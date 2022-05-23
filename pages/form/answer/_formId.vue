<template>
  <div class="form-list">
    <div class="main-contents">
      <a class="link-text" @click.prevent="backFormListScreen()"
        ><KeyboardArrowRightSVG
          class="btn-back icon-keyboardArrowRight"
        />フォーム一覧へ戻る</a
      >
      <div class="header">
        <h2>お問い合わせ：Webの回答データ</h2>
      </div>
      <div class="contents">
        <div v-if="filterStatusOptions.length > 0" class="search-options">
          <span>ステータスで絞り込む:</span>
          <CustomInputCheckbox
            v-model="statusParam"
            :options="filterStatusOptions"
            name="searchOptions"
            class="search-options-checkbox"
            @input="getContactWebAnswerDataList()"
          />
        </div>
        <div class="table-options">
          <div class="left">
            <button
              class="btn btn-middle-short"
              @click="downloadFormAnswerData()"
            >
              <DownloadSVG class="icon icon-download" /><span
                >CSVファイルを出力</span
              >
            </button>
          </div>
          <div class="right">
            <SettingShowNum
              :setting-show-num="settingShowNum"
              @update="updateSettingShowNum($event)"
            />
            <PageNav
              :current-page="currentPage"
              :setting-show-num="settingShowNum"
              :max-data-num="maxDataNum"
              @showPrevPage="showPrevPage()"
              @showNextPage="showNextPage()"
            />
          </div>
        </div>
        <ContactWebAnswerDataTable
          class="table-area"
          @update="getContactWebAnswerDataList()"
        />
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      settingShowNum: 20,
      currentPage: 1,
      maxDataNum: 0,
      statusParam: [],
      filterStatusOptions: [],
    }
  },
  computed: {
    ...mapState('form/contactWebAnswerData', ['answerDataInfo']),
  },
  created() {
    this.setAnswerDataInfo([]) // vuexの回答レポートリストデータの初期化
    this.getContactWebAnswerDataList(1) // 回答レポートリストの取得
  },
  mounted() {},
  methods: {
    ...mapMutations('form/contactWebAnswerData', ['setAnswerDataInfo']),
    /**
     * 回答レポートリストの取得
     */
    getContactWebAnswerDataList() {
      const paramData = this.getContactWebAnswerDataListRequestParam() // リクエストパラメータの取得

      this.$common.addCallApiNum()
      this.$api
        .getContactWebAnswerDataList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.maxDataNum = resData.data.searchResult
            this.setFilterStatusOptions(resData.data.statusList)
            this.setAnswerDataInfo(resData.data)
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
     * 検索条件のステータスで絞り込む項目の設定
     *
     * @param {object[]} ステータスリスト
     */
    setFilterStatusOptions(statusList) {
      this.filterStatusOptions = []

      for (let i = 0; i < statusList.length; i++) {
        this.filterStatusOptions.push({
          value: statusList[i].statusName,
          label: statusList[i].statusName,
        })
      }
    },
    /**
     * 回答レポートリスト取得APIのリクエストパラメータの取得
     *
     * @return {object} リクエストパラメータ
     */
    getContactWebAnswerDataListRequestParam() {
      const paramData = {}

      paramData.formId = this.$route.params.formId
      paramData.offset = this.currentPage
      paramData.limit = this.settingShowNum
      paramData.statusList = []

      if (Object.keys(this.answerDataInfo).length > 0) {
        for (let i = 0; i < this.answerDataInfo.statusList.length; i++) {
          const status = {}

          status.statusName = this.answerDataInfo.statusList[i].statusName

          if (
            this.statusParam.includes(
              this.answerDataInfo.statusList[i].statusName
            )
          ) {
            status.statusFlag = true
          } else {
            status.statusFlag = false
          }

          paramData.statusList.push(status)
        }
      }

      return paramData
    },
    downloadFormAnswerData() {
      const paramData = {
        formId: this.$route.params.formId,
      }

      this.$common.addCallApiNum()
      this.$api
        .downloadFormAnswerData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const formTitle = resData.data.title
            const nowDate = this.$common.getFormatCurrentDate('YYYYMMDD')

            this.$common.csvFileDownload(
              resData.data.csvData,
              `${this.$route.params.formId}_${formTitle}_${nowDate}.csv`
            )
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
     * フォーム一覧画面に戻る
     */
    backFormListScreen() {
      this.$router.push('/form/list/')
    },
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(settingShowNum) {
      this.settingShowNum = settingShowNum
      this.currentPage = 1
      this.getContactWebAnswerDataList()
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.currentPage += 1
      this.getContactWebAnswerDataList()
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.currentPage -= 1
      this.getContactWebAnswerDataList()
    },
  },
  head() {
    return {
      title: '回答レポート｜フォーム｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .link-text {
    display: flex;
    align-items: center;
    .btn-back {
      fill: #007aff;
      transform: scale(-1, 1);
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 17px;
    padding-bottom: 40px;
  }
  .contents {
    padding: 40px 0;
    border-top: 1px solid #e0e0e0;
    .search-options {
      display: flex;
      &-checkbox {
        margin-left: 16px;
      }
    }
    .table-options {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      .left {
        .btn {
          border: 1px solid #e0e0e0;
          span {
            margin-left: 11px;
          }
        }
      }
      .right {
        display: flex;
        ::v-deep .page-nav {
          margin-left: 16px;
        }
      }
    }
    .table-area {
      margin-top: 16px;
    }
  }
}
</style>
