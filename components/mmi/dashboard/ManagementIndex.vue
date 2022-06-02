<template>
<div class="flex flex-start">
    <div class="filter-content">
        <div class="row filter-heading toggle-heading" @click="onFilter3ShowStateChanged">
        比較業種
        <button class="btn-fold">
            <ExpandLessSVG v-if="isShowFilter3" class="icon icon-expandLess" />
            <ExpandMoreSVG v-if="!isShowFilter3" class="icon icon-expandMore" />
        </button>
        </div>
        <CollapseTransition>
        <div v-if="isShowFilter3" class="row filter-select-container toggle-body">
            <div class="row filter-select">
            <div class="form-item">
                <FilterButtonsVertical
                  :number="1"
                  class="filter"
                  title="業種"
                  placeholder="業種を選択してください"
                  :select-data="selectSaveCondition.items.industryCodes"
                  :filter-type="1"
                  @click="isShowCategoryModal  = true"
                />
            </div>
            </div>
            <div class="row filter-select mt-1">
            </div>
            <div class="row filter-select mt-1">
            </div>
        </div>
        </CollapseTransition>
        <div class="row filter-heading toggle-heading" @click="onFilterShowStateChanged">
        比較期間
        <button class="btn-fold">
            <ExpandLessSVG v-if="isShowFilter" class="icon icon-expandLess" />
            <ExpandMoreSVG v-if="!isShowFilter" class="icon icon-expandMore" />
        </button>
        </div>
        <CollapseTransition>
        <div v-if="isShowFilter" class="row filter-select-container toggle-body">
            <div class="row filter-select">
            <div class="form-item">
                <CustomInputCheckbox
                v-model="selectStyle"
                name="selectStyle"
                layout-type="vertical"
                :options="styleOptions"
                />
            </div>
            </div>
        </div>
        </CollapseTransition>
        <div class="row filter-heading toggle-heading" @click="onFilter1ShowStateChanged">
        絞込条件
        <button class="btn-fold">
            <ExpandLessSVG v-if="isShowFilter1" class="icon icon-expandLess" />
            <ExpandMoreSVG v-if="!isShowFilter1" class="icon icon-expandMore" />
        </button>
        </div>
        <CollapseTransition>
        <div v-if="isShowFilter1" class="row filter-select-container toggle-body">
            <div class="row filter-select">
            <div class="form-item">
                <FilterButtonsVertical
                  :number="1"
                  class="filter"
                  title="業種"
                  placeholder="業種を選択してください"
                  :select-data="selectSaveCondition.items.industryCodes"
                  :filter-type="1"
                  @click="isShowCategoryModal  = true"
                />
            </div>
            </div>
            <div class="row filter-select mt-1">
            <div class="form-item">
                <FilterButtonsVertical
                  :number="1"
                  class="filter"
                  title="業種"
                  placeholder="業種を選択してください"
                  :select-data="selectSaveCondition.items.industryCodes"
                  :filter-type="1"
                  @click="isShowCategoryModal = true"
                />
            </div>
            </div>
            <div class="row filter-select mt-1">
            </div>
            <div class="row filter-select mt-1">
            </div>
        </div>
        </CollapseTransition>
    </div>
    <div class="main-content">
        <div class="row-second bt-none">
          <ExcelDownloadButton
              :filename="csvFilename"
              :is-own-company="true"
              :table-info="tableData"
              :table-type="tableType"
              :balance-type="balanceType"
              :filter-info="csvFilterInfo"
              :own-company-name="ownCompanyName"
          />
        </div>
        <div class="chart-information mt-3">
        <div class="chart-container">
            <label>収益性</label>
            <BarChartCustom :type="1"/>
        </div>
        <div class="table-container">
            <label>効率性</label>
            <BarChartCustom :type="2" />
        </div>
        </div>
        <div class="chart-information mt-3">
        <div class="chart-container">
            <label>安全性</label>
            <BarChartCustom :type="2"/>
        </div>
        <div class="table-container">
            <label>生産性</label>
            <BarChartCustom  :type="3"/>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import mmiFilterUtilityMixin from '~/mixin/mmi/mmiFilterUtility.js'
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'
import CsvDownloadButton from '~/components/mmi/CsvDownloadButton.vue'
import CompanyInfoTable from '~/components/mmi/companyInfoTable/CompanyInfoTable.vue'
import CollapseTransition from '~/components/mmi/companyInfoTable/CollapseTransition'

export default {
  layout: 'mmiLayout',
  mixins: [mmiFilterUtilityMixin, companyInfoUtility],
  components: {
    CompanyInfoTable,
    CsvDownloadButton,
    CollapseTransition
  },
  data() {
    return {
      showCreateNewFormModalFlg: false,
      isShowModal: false,
      isShowCategoryModal: false,
      isShowEarningsModal: false,
      isShowReportStateModal: false,
      isShowFilter: true,
      isShowFilter1: true,
      isShowFilter3: true,
      tableType: 'corporate',
      termType: 1, // 期数
      termOptions: [
        {
          code: 1,
          label: '青山商事',
        },
      ],
      optionList: [
        {
          code: 1,
          label: '総資本経常利益率',
        },
      ],
      styleOptions: [
        {
          value: 'simple',
          label: '2021年',
        },
        {
          value: 'stylish',
          label: '2020年',
        },
        {
          value: 'friendly',
          label: '2019年',
        },
        {
          value: 'stylish',
          label: '2018年',
        },
        {
          value: 'friendly',
          label: '2017年',
        },
      ],
      listForChart: [
        {
          name: "総資本経常利益率",
          companyCode: "1,000,000"
        },
        {
          name: "当座預金",
          companyCode: "4,500,000"
        },
        {
          name: "現金",
          companyCode: "3,000,000"
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
    onFilter3ShowStateChanged() {
      this.isShowFilter3 = !this.isShowFilter3
    }
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
