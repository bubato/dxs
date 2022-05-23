<template>
  <div v-if="isInitialized">
    <div class="header flex flex-between">
      <h1>顧問先一覧</h1>
    </div>

    <div class="row subtitle-container">
      <p>企業名をクリックすると、顧問先企業のPL/BSを確認できます。</p>
    </div>

    <div class="row search-container">
      <div class="row search-caption">
        <span>キーワード検索</span>
      </div>
      <CustomInputText
        v-model="inputSearchText"
        class="input-search-text"
        view-type="search"
        placeholder="顧問先名称を入力して検索してください"
        :validation="validationSearchText"
        @submit="onSearchEnter"
      />
    </div>
    <div class="table-options">
      <SettingShowNum
        :setting-show-num="advisorsParams.count"
        @update="updateSettingShowNum($event)"
      />
      <PageNav
        :current-page="advisorsParams.countPage"
        :setting-show-num="advisorsParams.count"
        :max-data-num="totalDataCount"
        @showPrevPage="showPrevPage()"
        @showNextPage="showNextPage()"
      />
    </div>
    <AdvisingClientsTable
      v-model="clientCompaniyInfo"
      @sortChange="onSortChanged"
      @companySelect="onCompanySelected"
    />
    <CommonFooter />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import AdvisingClientsTable from '~/components/mmi/AdvisingClientsTable.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'
import mmiCompanyInfoUtilityMixin from '~/mixin/mmi/companyInfoUtility.js'

export default {
  layout: 'mmiLayout',
  components: {
    AdvisingClientsTable,
    CommonFooter,
  },
  mixins: [mmiCompanyInfoUtilityMixin],
  data() {
    return {
      isInitialized: false,
      totalDataCount: 0,
      clientCompaniyInfo: {},
      inputSearchText: '',
      advisorsParams: {
        countPage: 1,
        count: 20,
        sort: '',
        order: null,
      },
      validationSearchText: [
        {
          type: 'maxlength',
          maxlength: 50,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 50,
          }),
        },
      ],
    }
  },
  computed: {
    ...mapState('mmi/companyReport', [
      'companyMasterInfo',
      'accountingFirmFlg',
    ]),
  },
  created() {
    this.output('顧問先一覧画面表示 開始')
    this.initFunc()
  },
  mounted() {},
  methods: {
    ...mapMutations('mmi/companyReport', [
      'setCompanyMasterInfo',
      'setCurrentCompanyLinkageId',
    ]),
    initFunc() {
      if (this.accountingFirmFlg) {
        this.isInitialized = true
        this.getClientList() // 顧問先一覧の取得
      } else {
        this.$router.push('/launcher/')
      }
    },
    /**
     * 顧問先一覧の取得
     */
    getClientList() {
      const paramData = {
        keyword: this.inputSearchText,
        countPage: this.advisorsParams.countPage,
        count: this.advisorsParams.count,
      }

      if (this.advisorsParams.sort) {
        paramData.sort = this.advisorsParams.sort
        paramData.order = this.advisorsParams.order
      }

      this.$common.addCallApiNum()
      this.output('API 顧問先一覧 開始')
      this.$api
        .getAdvisorInfo(paramData)
        .then((res) => {
          this.output('API 顧問先一覧 終了')
          if (res.data.result === 0) {
            this.clientCompaniyInfo = res.data

            if (this.clientCompaniyInfo.isLastPage) {
              this.totalDataCount =
                (this.advisorsParams.countPage - 1) *
                  this.advisorsParams.count +
                res.data.resultDataList.length
            } else {
              this.totalDataCount =
                this.advisorsParams.countPage * (this.advisorsParams.count + 1)
            }
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }

          console.log('total:' + this.totalDataCount)
          this.$common.subCallApiNum()
        })
        .catch(() => {
          this.output('API 顧問先一覧 エラー')
          this.$common.subCallApiNum()
        })
    },
    showPrevPage() {
      this.advisorsParams.countPage -= 1
      this.getClientList() // 顧問先一覧の取得
    },
    showNextPage() {
      this.advisorsParams.countPage += 1
      this.getClientList() // 顧問先一覧の取得
    },
    updateSettingShowNum(settingShowNum) {
      if (this.advisorsParams.count === settingShowNum) {
        return
      }
      this.advisorsParams.count = settingShowNum
      this.advisorsParams.countPage = 1

      this.getClientList() // 顧問先一覧の取得
    },
    /**
     * テーブルソート処理
     *
     * @param {object} e 選択ソート値
     */
    onSortChanged(e) {
      this.advisorsParams.sort = e.sort
      this.advisorsParams.order = e.order
      this.advisorsParams.countPage = 1

      this.getClientList() // 顧問先一覧の取得
    },
    /**
     * 顧問先選択処理 自社分析画面に遷移
     *
     * @param {string} linkageId 連携ID
     */
    onCompanySelected(linkageId) {
      this.setCurrentCompanyLinkageId(linkageId)
      this.$router.push('/mmi/companyReport/')
    },
    /**
     * 検索処理
     */
    onSearchEnter() {
      // 最初のページからキーワード検索の結果を表示
      this.advisorsParams.page = 1
      this.advisorsParams.countPage = 1

      this.getClientList() // 顧問先一覧の取得
    },
  },
  head() {
    return {
      title: '顧問先一覧｜MMI｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.icon {
  margin: 4px;
}

.pane {
  padding: 16px;
  position: relative;
}

div.header-select {
  width: 360px;
  position: relative;
}
.subtitle-container {
  margin: 8px 0px;
}
.search-container {
  margin-top: 32px;
  margin-bottom: 32px;
}
.search-caption {
  margin: 8px 1px;
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
</style>
