<template>
  <div>
    <div class="title-header flex flex-between">
      <h1>統計分析：業種比較</h1>
    </div>

    <div class="row header-select-container">
      <button
        class="btn btn-utility btn-short btn-selectIndustry"
        @click="onClickSelectIndustry"
      >
        <AddCircleSVG class="icon-addCircle" />
        <span>業種を選択</span>
      </button>
      <div class="select-industry">
        <ul
          v-if="selectSaveCondition.items.industryCompareCodes.length"
          class="select-industry-list"
        >
          <li
            v-for="(code, index) in selectSaveCondition.items
              .industryCompareCodes"
            :key="index"
            class="condition-label"
          >
            <span>{{ getIndustryName(code) }}</span>
          </li>
        </ul>
        <div v-else class="select-industry-placeholder">
          最初に比較したい業種を選択してください。
        </div>
      </div>
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
              :filter-type="4"
              :select-data="[selectSaveCondition.items.companyType]"
              title="企業分類"
              placeholder="企業分類を選択してください"
              @click="isShowCategoryModal = true"
            />
            <FilterButtons
              class="filter"
              :filter-type="2"
              :select-data="selectSaveCondition.items.prefectureCodes"
              title="所在地"
              placeholder="所在地を選択してください"
              @click="isShowLocationModal = true"
            />
            <FilterButtons
              class="filter"
              :filter-type="3"
              :select-data="[selectSaveCondition.items.salesScaleCode]"
              title="売上規模"
              placeholder="売上規模を選択してください"
              @click="isShowEarningsModal = true"
            />
          </div>
          <SelectSaveConditions
            screen-id="SC-DXT09040201"
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
            <TabButtons
              class="table-state-button tab-term"
              :tabs="[{ title: '1期' }]"
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
            :table-info="tableData"
            :table-type="tableType"
            :balance-type="balanceType"
            :filter-info="csvFilterInfo"
          />
        </div>
      </div>
      <CompanyInfoTable
        class="company-info-table"
        :table-info="tableData"
        :balance-type="balanceType"
        :table-type="tableType"
      >
        <template v-slot:placeholder>
          <div class="table-placeholder">
            <h3 class="table-placeholder-text">
              業種を選択すると分析データが表示されます。
            </h3>
          </div>
        </template>
      </CompanyInfoTable>
    </div>
    <CommonFooter />
    <CompanyTypeFilterModal
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
    <CategorySelectorModal
      v-if="isShowSelectIndustryModal"
      @update="getCompanyInfo()"
      @close="isShowSelectIndustryModal = false"
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
import companyInfoUtilityMixin from '~/mixin/mmi/companyInfoUtility.js'
import mmiFilterUtilityMixin from '~/mixin/mmi/mmiFilterUtility.js'
import TabButtons from '~/components/mmi/TabButtons.vue'
import FilterButtons from '~/components/mmi/FilterButtons.vue'
import CompanyInfoTable from '~/components/mmi/companyInfoTable/CompanyInfoTable.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'
import CsvDownloadButton from '~/components/mmi/CsvDownloadButton.vue'
import CompanyTypeFilterModal from '~/components/mmi/modal/CompanyTypeFilterModal.vue'
import EarningsFilterModal from '~/components/mmi/modal/EarningsFilterModal.vue'
import LocationFilterModal from '~/components/mmi/modal/LocationFilterModal.vue'
import CategorySelectorModal from '~/components/mmi/modal/CategorySelectorModal.vue'

export default {
  layout: 'mmiLayout',
  components: {
    TabButtons,
    FilterButtons,
    CompanyInfoTable,
    CommonFooter,
    CsvDownloadButton,
    CompanyTypeFilterModal,
    EarningsFilterModal,
    LocationFilterModal,
    CategorySelectorModal,
  },
  mixins: [companyInfoUtilityMixin, mmiFilterUtilityMixin],
  data() {
    return {
      showCreateNewFormModalFlg: false,
      isShowSelectIndustryModal: false,
      isShowCategoryModal: false,
      isShowLocationModal: false,
      isShowEarningsModal: false,
      isShowReportStateModal: false,
      isShowFilter: true,
      balanceTabs: [
        { title: 'PL（損益計算書）' },
        { title: 'BS（貸借対照表）' },
        { title: '変動損益計算書' },
      ],
      averageTabs: [
        { title: '1企業あたり平均' },
        { title: '1従業員あたり平均' },
      ],
      inputSearchText: '',
      tableData: {},
      balanceType: '0',
      tableType: 'corporate',
    }
  },
  computed: {
    ...mapState('mmi/companyReport', ['companyMasterInfo']),
    ...mapState('mmi/filterConditions', [
      'industryCompareMasterKeyValue',
      'selectSaveCondition',
    ]),
    /**
     * 業種名を取得
     *
     * @param {string} code 業種コード
     * @return {string} 業種名
     */
    getIndustryName() {
      return (code) => {
        return this.industryCompareMasterKeyValue[code]
      }
    },
    csvFilename() {
      return this.getCompanyInfoFilename('統計分析_業種比較', this.balanceType)
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

      const companyType = []
      const name = this.companyTypeCodeToName(filterCondition.companyType)
      if (name === '') {
        companyType.push('0: すべての企業')
      }
      if (!companyType.length) {
        companyType.push(`${filterCondition.companyType}: ${name}`)
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
          header: '企業分類',
          value: companyType,
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
    this.output('統計分析：業種比較画面 表示開始')
    this.resetSelectSaveCondition()
    this.getCompanyInfo() // 統計分析(業績比較)PL_BS取得
  },
  mounted() {},
  methods: {
    ...mapMutations('mmi/filterConditions', ['resetSelectSaveCondition']),

    /**
     * 分析情報の状態チェック
     */
    checkCompanyInfoState() {
      if (this.isFilterd()) {
        if (this.isEmpatyDataTable(this.tableData, this.tableType)) {
          this.isShowReportStateModal = true
        }
      }
    },

    /**
     * 統計分析(業績比較)PL_BS取得
     */
    getCompanyInfo() {
      const paramData = this.getCompanyInfoParam() // 統計分析(業績比較)PL_BS取得APIのリクエストパラメータの取得

      if (!paramData.industryCodes.length) {
        this.tableData = {}
        return
      }

      this.$common.addCallApiNum()
      this.output('API 統計分析(業種比較)PL_BS取得 開始')
      this.$api
        .getMmiStaticIndustries(paramData)
        .then((res) => {
          this.output('API 統計分析(業種比較)PL_BS取得 終了')
          if (res.data.result === 0) {
            this.tableData = res.data
            this.checkCompanyInfoState()
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API 統計分析(業種比較)PL_BS取得 エラー')
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
     * 統計分析(業績比較)PL_BS取得APIのリクエストパラメータの取得
     *
     * @return {object[]} 統計分析(業績比較)PL_BS取得APIのリクエストパラメータ
     */
    getCompanyInfoParam() {
      const paramData = {}

      paramData.companyType = this.selectSaveCondition.items.companyType // 企業分類
      paramData.plbsDiv = this.balanceType // PL/BS区分
      paramData.industryCodes = this.selectSaveCondition.items.industryCompareCodes // 業種(比較)

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
    isFilterd() {
      // 企業分類
      if (this.selectSaveCondition.items.companyType !== '0') {
        return true
      }

      // 所在地の設定 全項目が設定されている場合は、keyは送らない
      if (!this.selectSaveCondition.items.prefectureCategory.includes('all')) {
        return true
      }

      if (this.selectSaveCondition.items.salesScaleCode !== '1') {
        return true
      }

      return false
    },

    updateCompanyList() {
      this.$common.addCallApiNum()
      this.output('API 会社マスタ取得 開始')
      this.$api.getCompanyMasterInfo({}).then((res) => {
        this.output('API 会社マスタ取得 終了')
        if (res.data.dataList) {
          this.companyMasterInfo = res.data
          this.$nuxt.$emit('navParams', {
            companyType: this.companyMasterInfo.dataList[0].corporateType,
            countCompanyMaster: this.companyMasterInfo.dataList.length,
          })
          this.options = res.data.dataList.map((d) => {
            return {
              code: d.companyCode,
              label: d.companyName,
            }
          })
          if (res.data.dataList.length) {
            this.selecedCompanyCode = res.data.dataList[0].companyCode
          }
          this.$common.subCallApiNum()
        } else {
          this.selecedCompanyCode = ''
          this.options = []
        }
        this.$common.subCallApiNum()
      })
    },
    checkShowDispItems() {
      return true
    },
    /**
     * 業種選択モーダルの表示
     */
    onClickSelectIndustry() {
      this.isShowSelectIndustryModal = true
    },
    /**
     * PL/BS区分の選択
     *
     * @param {number} tab PL/BS区分 0:PL 1:BS
     */
    onBalanceTabSelected(tab) {
      this.balanceType = String(tab)
      this.getCompanyInfo()
    },
    /**
     * 期の切り替え
     *
     * @param {number} tab 0:1期 1:3期
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
      title: '統計分析（業種比較）｜MMI｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.title-header {
  margin-top: 40px;
}

.icon {
  margin: 4px;
}

.pane {
  padding: 16px;
  position: relative;
}

.condition-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  border-radius: 4px;
  padding: 6px 12px;
  background-color: #d1e7ff;
}

div.header-select-container {
  display: flex;
  margin: 24px 0;
  padding: 28px;
  border: 1px solid #ffcc00;
  background: #fffae5 0% 0% no-repeat padding-box;
  border: 1px solid #ffcc00;
  border-radius: 4px;

  .btn-selectIndustry {
    display: flex;
    align-items: center;
    height: 32px;
    background: #ffffff;
    border: 1px dashed #c6c6c6;
    border-radius: 4px;
    padding: 6px 12px 6px 8px;
    .icon-addCircle {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
  }
  .select-industry {
    width: 75%;
    margin-left: 16px;
    &-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li {
        margin: 0 8px 8px 0;
      }
    }
    &-placeholder {
      color: #1e1e1e;
      margin: 0px 5px;
      font-size: 20px;
    }
  }
}
div.header-select {
  width: 360px;
  position: relative;
}

.table-area {
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
.table-placeholder {
  margin-top: 8px;
  border: #e5e5e5 1px solid;
  border-radius: 6px;
  color: #8d8d8d;
  // border: 1px solid #ffcc00;
  // background: #fffae5 0% 0% no-repeat padding-box;
  height: 400px;
  padding: 32px;
  display: flex;
  align-items: center;
  &-text {
    width: 100%;
    text-align: center;
  }
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
