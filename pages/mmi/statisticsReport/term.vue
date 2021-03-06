<template>
  <div>
    <div class="title-header flex flex-between">
      <h1>統計分析：期間比較</h1>
    </div>

    <div class="row filter-heading">
      絞込条件
      <button class="btn-fold" @click="onFilterShowStateChanged">
        <ExpandLessSVG v-if="isShowFilter" class="icon icon-expandLess" />
        <ExpandMoreSVG v-if="!isShowFilter" class="icon icon-expandMore" />
      </button>
    </div>
    <CollapseTransition>
      <div v-if="isShowFilter" class="row filter-select-container">
        <div class="row filter-select">
          <div class="row flex filter-select-edit">
            <FilterButtons
              class="filter"
              title="業種"
              placeholder="業種を選択してください"
              :filter-type="1"
              :select-data="selectSaveCondition.items.industryCodes"
              @click="isShowCategoryModal = true"
            />
            <FilterButtons
              class="filter"
              title="所在地"
              placeholder="所在地を選択してください"
              :filter-type="2"
              :select-data="selectSaveCondition.items.prefectureCodes"
              @click="isShowLocationModal = true"
            />
            <FilterButtons
              class="filter"
              title="売上規模"
              placeholder="売上規模を選択してください"
              :filter-type="3"
              :select-data="[selectSaveCondition.items.salesScaleCode]"
              @click="isShowEarningsModal = true"
            />
          </div>
          <SelectSaveConditions
            screen-id="SC-DXT09040101"
            :company-info="currentCompany"
            :client-info="{}"
            @update="getCompanyInfo()"
          />
        </div>
      </div>
    </CollapseTransition>

    <div class="table-area">
      <div class="row">
        <div class="row-first flex flex-between">
          <div class="left-contents">
            <TabButtons
              class="table-state-button"
              :tabs="balanceTabs"
              @selected="onBalanceTabSelected($event)"
            />
          </div>
          <div class="right-contents">
            <CustomInputSelect
              v-model="termType"
              :options="termOptions"
              @change="onTermTabSelected($event)"
            />
            <TabButtons
              class="table-state-button"
              :tabs="averageTabs"
              @selected="onAverageTabSelected($event)"
            />
          </div>
        </div>
        <div class="row-second">
          <CsvDownloadButton
            :filename="csvFilename"
            :table-info="termTableData"
            :table-type="tableType"
            :balance-type="balanceType"
            :filter-info="csvFilterInfo"
          />
        </div>
      </div>
      <CompanyInfoTable
        class="company-info-table"
        :table-info="termTableData"
        :balance-type="balanceType"
        :table-type="tableType"
      />
    </div>
    <CommonFooter />
    <CategoryFilterModal
      v-if="isShowCategoryModal"
      @update="getCompanyInfo()"
      @close="isShowCategoryModal = false"
    />
    <LocationFilterModal
      v-if="isShowLocationModal"
      @update="getCompanyInfo()"
      @close="isShowLocationModal = false"
    />
    <EarningsFilterModal
      v-if="isShowEarningsModal"
      @update="getCompanyInfo()"
      @close="isShowEarningsModal = false"
    />
    <ReportStateMessageModal
      v-if="isShowReportStateModal"
      :lack-info="lackInfo"
      @close="isShowReportStateModal = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CollapseTransition from '~/components/mmi/companyInfoTable/CollapseTransition'
import mmiFilterUtilityMixin from '~/mixin/mmi/mmiFilterUtility.js'
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'
import TabButtons from '~/components/mmi/TabButtons.vue'
import CsvDownloadButton from '~/components/mmi/CsvDownloadButton.vue'
import FilterButtons from '~/components/mmi/FilterButtons.vue'
import CompanyInfoTable from '~/components/mmi/companyInfoTable/CompanyInfoTable.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'
import CategoryFilterModal from '~/components/mmi/modal/CategoryFilterModal.vue'
import EarningsFilterModal from '~/components/mmi/modal/EarningsFilterModal.vue'
import LocationFilterModal from '~/components/mmi/modal/LocationFilterModal.vue'

export default {
  layout: 'mmiLayout',
  components: {
    TabButtons,
    FilterButtons,
    CompanyInfoTable,
    CommonFooter,
    CsvDownloadButton,
    CategoryFilterModal,
    EarningsFilterModal,
    LocationFilterModal,
    CollapseTransition,
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
      tableType: 'corporate',
      balanceTabs: [
        { title: 'PL（損益計算書）' },
        { title: 'BS（貸借対照表）' },
        { title: '変動損益計算書' },
      ],
      averageTabs: [
        { title: '1企業あたり平均' },
        { title: '1従業員あたり平均' },
      ],
      termType: 1, // 期数
      termOptions: [
        {
          code: 1,
          label: '1期',
        },
        {
          code: 3,
          label: '3期',
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
  margin: 4px;
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
    padding: 16px 24px;
    background: #f7f8f9;
    margin: 16px 0px;
    .filter-select {
      display: flex;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  top: 118px;
  left: 118px;
  cursor: pointer;
  :hover {
    fill: #bfc2ca;
  }
}
</style>
