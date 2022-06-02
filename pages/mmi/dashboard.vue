<template>
  <div>
    <div class="title-header flex flex-between">
      <h1>ダッシュボード</h1>
    </div>
    <div class="row-first flex">
      <div class="col-4 left-contents">
        <CustomInputSelect
          v-model="termType"
          :options="termOptions"
          @change="onTermTabSelected($event)"
        />
      </div>
      <div class="col-right-fix right-contents float-right">
        <SelectSaveConditions
          screen-id="SC-DXT09030101"
          :company-info="currentCompany"
          :client-info="clientCompany"
          @update="getCompanyInfo()"
        />
      </div>
    </div>

    <div class="table-area">
      <div class="row">
        <div class="row-first flex flex-left bb-1">
          <div class="left-contents flex">
            <TabButtons
              label="比較手法"
              class="table-state-button"
              :tabs="averageTabs1"
              @selected="onAverageTabSelected($event)"
            />
            <TabButtons
              label=""
              class="table-state-button ml-15"
              :tabs="averageTabs1"
              @selected="onAverageTabSelected($event)"
            />
          </div>
          <div class="right-contents ml-50">
            <TabButtons
              label="分析指標"
              class="table-state-button"
              :tabs="balanceTabs"
              @selected="onBalanceTabSelected($event)"
            />
          </div>
        </div>
      </div>
      <FinancialReport v-if="analysisIndicator == 0" />
      <ManagementIndex v-if="analysisIndicator == 1" />
      <CustomReports v-if="analysisIndicator == 2" />
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import mmiFilterUtilityMixin from '~/mixin/mmi/mmiFilterUtility.js'
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'
import TabButtons from '~/components/mmi/TabButtons.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'
import FinancialReport from '../../components/mmi/dashboard/FinancialReport.vue'

export default {
  layout: 'mmiLayout',
  components: {
    TabButtons,
    CommonFooter,
    FinancialReport
},
  mixins: [mmiFilterUtilityMixin, companyInfoUtility],
  data() {
    return {
      showCreateNewFormModalFlg: false,
      isShowModal: false,
      isShowCategoryModal: false,
      isShowLocationModal: false,
      isShowEarningsModal: false,
      isShowReportStateModal: false,
      isShowFilter: true,
      isShowFilter1: true,
      tableType: 'corporate',
      analysisIndicator: 0,
      balanceTabs: [
        { title: '財務諸表' },
        { title: '経営指標' },
        { title: 'カスタムレポート' },
      ],
      averageTabs1: [
        { title: '期間比較' },
        { title: '業種比較' },
      ],
      averageTabs2: [
        { title: '自社分析' },
        { title: '統計分析' },
      ],
      termType: 1, // 期数
      termOptions: [
        {
          code: 1,
          label: '青山商事',
        },
      ],
      balanceType: '0',
      tableData: {},
      termTableData: {},
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', ['selectSaveCondition']),
    ...mapState('mmi/companyReport', ['companyMasterInfo']),
    currentCompany() {
      if (!this.companyMasterInfo.dataList) {
        return null
      }
      if (!this.companyMasterInfo.dataList.length) {
        return null
      }
      return this.companyMasterInfo.dataList[0]
    },
    clientCompany() {
      if (!this.advisorList || !this.advisorList.length) {
        return {}
      }

      const selectedCompany = this.advisorList.find((c) => {
        if (c.linkageId === this.selectedCompanyLinkageId) {
          return true
        }
      })
      return selectedCompany || {}
    },
    csvFilename() {
      return this.getCompanyInfoFilename(
        '統計分析_期間比較',
        this.balanceType,
        this.termType
      )
    },
    lackInfo() {
      const lackOfInformation = this.tableData.lackOfInformation
      if (!lackOfInformation) {
        return null
      }

      let cmpEmpDiv = ''
      if (this.tableType === 'corporate') {
        cmpEmpDiv = '1'
      }
      if (this.tableType === 'employee') {
        cmpEmpDiv = '2'
      }

      const info = lackOfInformation.find((e) => {
        return e.cmpEmpDiv === cmpEmpDiv
      })
      if (!info) {
        return null
      }
      return info
    },
    csvFilterInfo() {
      const filterCondition = this.selectSaveCondition.items
      const industryFilter = filterCondition.industryCodes.map((v) => {
        return `${v}: ${this.industryCodeToName(v)}`
      })
      if (!industryFilter.length) {
        industryFilter.push('0: すべての業種')
      }

      const locationFilter = filterCondition.prefectureCodes.map((v) => {
        return `${v}: ${this.prefectureCodeToName(v)}`
      })
      if (!locationFilter.length) {
        locationFilter.push('0: すべての都道府県')
      }

      const salesFilter = []
      if (filterCondition.salesScaleCode) {
        let text = `${
          filterCondition.salesScaleCode || 0
        }: ${this.salesScaleCodeToName(filterCondition.salesScaleCode)}`

        if (filterCondition.salesScaleCode === '0') {
          text += `（${this.$common.commaSeparate(
            filterCondition.salesScaleLower
          )}円～${this.$common.commaSeparate(
            filterCondition.salesScaleUpper
          )}円）`
        }
        salesFilter.push(text)
      }

      return [
        {
          header: '業種',
          value: industryFilter,
        },
        {
          header: '所在地',
          value: locationFilter,
        },
        {
          header: '売上規模',
          value: salesFilter,
        },
      ]
    },
    currentCompany() {
      if (!this.companyMasterInfo.dataList) {
        return null
      }
      if (!this.companyMasterInfo.dataList.length) {
        return null
      }
      return this.companyMasterInfo.dataList[0]
    },
  },
  created() {
    this.output('統計分析：期間比較画面 表示開始')
    this.resetSelectSaveCondition()
    this.getCompanyInfo() // 統計分析(期間比較)PL_BS取得
  },
  mounted() {},
  methods: {
    ...mapMutations('mmi/filterConditions', ['resetSelectSaveCondition']),
    setTerm(term) {
      if (!this.tableData) {
        return
      }

      if (!this.tableData[this.tableType]) {
        return
      }

      const termTable = JSON.parse(JSON.stringify(this.tableData))
      termTable.corporate = this.getTermFilteredCompanyInfo(
        termTable.corporate,
        term
      )

      termTable.employee = this.getTermFilteredCompanyInfo(
        termTable.employee,
        term
      )

      this.termTableData = termTable
    },

    /**
     * 分析情報の状態チェック
     */
    checkCompanyInfoState() {
      if (this.isFiltered()) {
        if (this.isEmptyDataTable(this.termTableData, this.tableType)) {
          this.isShowReportStateModal = true
        }
      }
    },

    /**
     * 統計分析(期間比較)PL_BS取得
     */
    getCompanyInfo() {
      const paramData = this.getCompanyInfoParam() // 1期: 統計分析(期間比較)PL_BS取得APIのリクエストパラメータの取得
      this.$common.addCallApiNum()
      this.output('API 統計分析(期間比較)PL_BS取得 開始')
      this.$api
        .getMmiStaticTerm(paramData)
        .then((res) => {
          this.output('API 統計分析(期間比較)PL_BS取得 終了')
          if (res.data.result === 0) {
            this.tableData = res.data
            this.setTerm(this.termType)

            this.checkCompanyInfoState()
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API 統計分析(期間比較)PL_BS取得 エラー')
          // const response = error.response
          // if (response && response.status >= 500) {
          //   console.log('Error FALLBACK', response)
          //   this.$common.subCallApiNum()
          //   return
          // }
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 統計分析(期間比較)PL_BS取得APIのリクエストパラメータの取得
     *
     * @param {number} term '0':１期 / '1':３期
     * @return {object[]} 統計分析(期間比較)PL_BS取得APIのリクエストパラメータ
     */
    getCompanyInfoParam() {
      const paramData = {}

      const term = '1' // 3期

      paramData.term = term || '0' // 期
      paramData.plbsDiv = this.balanceType // PL/BS区分

      // 業種の設定 全項目が設定されている場合は、keyは送らない
      if (
        !this.selectSaveCondition.items.industryCategory.includes(
          'すべての業種'
        )
      ) {
        paramData.industryCodes = this.selectSaveCondition.items.industryCodes // 業種
      }

      // 所在地の設定 全項目が設定されている場合は、keyは送らない
      if (!this.selectSaveCondition.items.prefectureCategory.includes('all')) {
        paramData.prefectureCodes = this.selectSaveCondition.items.prefectureCodes // 所在地
      }

      paramData.salesScaleCode = this.selectSaveCondition.items.salesScaleCode // 売上規模コード
      if (paramData.salesScaleCode === '0') {
        paramData.salesScaleLower = this.selectSaveCondition.items.salesScaleLower // 売上規模下限
        paramData.salesScaleUpper = this.selectSaveCondition.items.salesScaleUpper // 売上規模上限
      }

      return paramData
    },

    /**
     * 絞り込み状態かを取得
     */
    isFiltered() {
      if (
        !this.selectSaveCondition.items.industryCategory.includes(
          'すべての業種'
        )
      ) {
        return true
      }

      if (!this.selectSaveCondition.items.prefectureCategory.includes('all')) {
        return true
      }

      // 売上規模コード
      if (this.selectSaveCondition.items.salesScaleCode !== '1') {
        return true
      }
      return false
    },

    /**
     * PL/BS区分の選択
     *
     * @param {number} tab PL/BS区分 0:PL 1:BS
     */
    onBalanceTabSelected(tab) {
      this.analysisIndicator = tab
      this.balanceType = String(tab)
      this.getCompanyInfo() // 統計分析(期間比較)PL_BS取得
    },
    /**
     * 期の切り替え
     *
     * @param {number} tab 1:1期 3:3期
     */
    onTermTabSelected() {
      this.setTerm(this.termType)
      this.checkCompanyInfoState()
    },
    /**
     * テーブル表示タイプの切り替え
     *
     * @param {number} tab 切り替えタブの値
     */
    onAverageTabSelected(tab) {
      console.log(tab)
      if (tab === 0) {
        this.tableType = 'corporate'
      } else {
        this.tableType = 'employee'
      }

      this.checkCompanyInfoState()
    },
    /**
     * 絞り込みの表示状態変更
     */
    onFilterShowStateChanged() {
      this.isShowFilter = !this.isShowFilter
    },
    onFilter1ShowStateChanged() {
      this.isShowFilter1 = !this.isShowFilter1
    },
  },
  head() {
    return {
      title: '統計分析（期間比較）｜MMI｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.title-header {
  margin-top: 40px;
  margin-bottom: 32px;
}

.icon {
  margin-right: 10px;
}

.pane {
  padding: 16px;
  position: relative;
}

div.header {
  margin-bottom: 32px;
}

div.header-select-container {
  margin: 32px 0px;
}
div.header-select {
  width: 360px;
  position: relative;
}

.table-area {
  // border-top: 1px solid #ebeced;
  padding-top: 30px;
  margin-top: 30px;
  .row {
    &-first {
      padding-bottom: 20px;
    }
    &-second {
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }

    .right-contents {
      display: flex;
      align-items: center;
      .table-state-button {
        &:not(:first-child) {
          margin-left: 24px;
        }
      }
    }
  }
  > .flex {
    .table-options {
      display: flex;
      > * {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}

.company-info-table {
  margin-top: 17px;
}

::v-deep {
  .unit-select {
    margin: 0px 4px;
    select {
      position: relative;
      height: 30px;
      width: 84px;
      padding: 1px 17px 1px 8px;
    }
  }
}
.drop {
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // height: 48px;
    // padding-left: 32px;
    position: relative;
    .icon {
      margin-right: 16px;
    }
    &:hover {
      background-color: #ebeced;
    }
  }
}

::v-deep {
  .table-state-button {
    &.tab-term {
      button.tab-button {
        width: 56px;
      }
    }
  }
  .filter-heading {
    font-size: 17px;
    min-width: 84px;
    font-weight: 500;
  }
  .filter-select-container {
    padding: 16px 20px;
    background: #f7f8f9;
    margin: 16px 0px;
    .filter-select {
      display: block;
      align-items: flex-end;
      justify-content: space-between;
      &-edit {
        width: calc(100% - 252px);
        position: relative;
        .filter {
          width: calc(100% / 3);
          &:not(:last-child) {
            margin-right: 8px;
          }
          input {
            background-color: #ffffff;
          }
        }
      }
      &-buttons {
        margin: 0px 22px;
        width: 220px;
        height: 48px;
        min-width: 220px;
        position: relative;
        flex-direction: row;
        &-inner {
          position: relative;
          width: 100%;
          margin: auto 0px 0px 0px;
        }
      }
    }
  }
}
.btn-fold {
  background: #f8f9fa;
  float: right;
  cursor: pointer;
  :hover {
    fill: #bfc2ca;
  }
}
.col-4 {
  width: 33%;
}
.col-3 {
  width: 25%
}
.d-inline-flex {
  display: inline;
}
.ml-15 {
  margin-left: 15px;
}
.ml-50 {
  margin-left: 50px;
}
.max-content {
  width: max-content;
}
.flex-start {
  align-items: flex-start;
}
.filter-content {
  width: 200px;
}
.main-content {
  width: calc(100% - 200px);
  padding-left: 25px;
}
.toggle-heading {
  cursor: pointer;
  background: #f8f9fa;
  padding: 20px 0px 20px 20px;
  margin-top: 20px;
  border-radius: 4px;
}
.toggle-body {
  margin-top: -4px;
  border-radius: 4px; 
}
.mt-1 {
  margin-top: 10px
}
.mt-3 {
  margin-top: 30px
}
.bb-1 {
  border-bottom: 1px solid #e5e5e5;
}
.ml-2 {
  margin-left: 20px
}
.bt-none {
  border-top: none !important;
}
.chart-container {
  width: 50%;
  padding-right: 10px;
}
.table-container {
  width: 50%;
  padding-left: 10px;
}
.chart-information {
  display: flex;
}
.float-right {
  align-items: flex-end;
}
.flex {
  justify-content: space-between;
}
.col-right-fix {
  width: 212px;
}
.inline-flex {
  display: inline-flex;
  align-items: center
}
</style>
