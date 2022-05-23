<template>
  <div class="advisors-list">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">顧問先一覧</h2>
        <p class="header-sub">
          顧問先をクリックすると、資金繰予測レポートの詳細を確認できます。
        </p>
      </div>
      <div class="contents">
        <div class="search-options">
          <div class="search-keyword">
            <p>キーワード検索</p>
            <CustomInputText
              v-model="searchKeyword"
              view-type="search"
              placeholder="顧問先名称を入力して検索してください"
              maxlength="50"
              @submit="exeSearchKeyword()"
            />
          </div>
          <div class="select-forecast">
            <p>資金繰り予測ステータス</p>
            <CustomInputCheckbox
              v-model="selectForecast"
              :options="forecastOptions"
              name="selectForecast"
              @input="exeSelectForecast()"
            />
          </div>
        </div>
        <div class="table-options">
          <SettingShowNum
            :setting-show-num="pagingInfo.limit"
            @update="updateSettingShowNum($event)"
          />
          <PageNav
            :current-page="pagingInfo.offset"
            :setting-show-num="pagingInfo.limit"
            :max-data-num="pagingInfo.maxDataNum"
            @showPrevPage="showPrevPage()"
            @showNextPage="showNextPage()"
          />
        </div>
        <AdvisorsListTable
          class="table-area"
          :advisors-list="advisorsList"
          @update="updateSort()"
        />
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'cfmLayout',
  components: { CommonFooter },
  data() {
    return {
      searchKeyword: '',
      selectForecast: ['0', '1', '9'],
      forecastOptions: [
        {
          value: '0',
          label: '良好',
          icon: 'CheckCircleSVG',
          iconClass: 'icon-checkCircle',
        },
        {
          value: '1',
          label: '危険',
          icon: 'ErrorSVG',
          iconClass: 'icon-error',
        },
        {
          value: '9',
          label: '予測不可',
          icon: 'RemoveCircleSVG',
          iconClass: 'icon-removeCircle',
        },
      ],
      advisorsList: [],
      pagingInfo: {
        limit: 20,
        offset: 1,
        maxDataNum: 0,
      },
    }
  },
  computed: {
    ...mapState('cfm/common', ['corporateType']),
    ...mapState('cfm/advisoryCompanyStore', ['selectSortType']),
  },
  created() {
    this.initFunc() // 初期表示処理 会計事務所以外の場合は、ランチャー画面に遷移
  },
  mounted() {},
  methods: {
    /**
     * 初期表示処理 会計事務所以外の場合は、ランチャー画面に遷移
     */
    initFunc() {
      if (this.corporateType === '20') {
        this.getAdvisorsList() // 顧問先一覧データの取得
      } else {
        this.$router.push('/launcher/')
      }
    },
    /**
     * 顧問先一覧データの取得
     */
    getAdvisorsList() {
      const paramData = this.getAdvisorsListParam()

      this.$common.addCallApiNum()
      this.$api
        .getAdvisorsList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.pagingInfo.maxDataNum = resData.data.searchResult
            this.advisorsList = resData.data.resultDataList
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 顧問先一覧取得APIのリクエストパラメータの取得
     *
     * @return {object} 顧問先一覧取得APIのリクエストパラメータ
     */
    getAdvisorsListParam() {
      const paramData = {}

      if (this.selectSortType.sort) {
        paramData.sort = this.selectSortType.sort
        paramData.order = this.selectSortType.order
      }

      paramData.keyword = this.searchKeyword
      paramData.countPage = this.pagingInfo.offset
      paramData.count = this.pagingInfo.limit
      paramData.predictiveStatus = this.selectForecast.join(',')

      return paramData
    },
    /**
     * キーワード検索の実行
     */
    exeSearchKeyword() {
      this.pagingInfo.offset = 1
      this.getAdvisorsList()
    },
    /**
     * 予測データ絞り込みの実行
     */
    exeSelectForecast() {
      this.pagingInfo.offset = 1
      this.getAdvisorsList()
    },
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(limit) {
      this.pagingInfo.limit = limit
      this.pagingInfo.offset = 1
      this.getAdvisorsList()
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.pagingInfo.offset += 1
      this.getAdvisorsList()
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.pagingInfo.offset -= 1
      this.getAdvisorsList()
    },
    /**
     * ソート処理
     */
    updateSort() {
      this.pagingInfo.offset = 1
      this.getAdvisorsList()
    },
  },
  head() {
    return {
      title: '顧問先一覧｜キャッシュフローマネジメント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    &-title {
      font-weight: 500;
    }
    &-sub {
      margin-top: 8px;
    }
  }
  .contents {
    margin-top: 28px;
    .search-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search-keyword {
        width: calc(100% - 396px);
        p {
          font-weight: 500;
          margin-bottom: 12px;
        }
      }
      .select-forecast {
        p {
          font-weight: 500;
          margin-bottom: 12px;
        }
        ::v-deep .custom-input-checkbox {
          display: flex;
          align-items: center;
          height: 48px;

          &.horizon-layout .checkbox_list label:not(:last-child) {
            margin-right: 24px;
          }
          p {
            padding-right: 0;
          }
          .icon-removeCircle {
            fill: #e2e3e5;
          }
        }
      }
    }
    .table-options {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
      ::v-deep .page-nav {
        margin-left: 16px;
      }
    }
    .table-area {
      margin-top: 12px;
    }
  }
}
</style>
