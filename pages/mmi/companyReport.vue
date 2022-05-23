<template>
  <div>
    <div class="title-header flex flex-between">
      <h1>自社分析</h1>
    </div>

    <div class="row header-select-container">
      <div class="header-select">
        <template v-if="accountingFirmFlg && advisorOptions.length > 0">
          <CustomInputSelect
            v-model="selectedCompanyLinkageId"
            :options="advisorOptions"
            :validation="[]"
            @change="onCompanySelectChanged()"
          />
        </template>
        <template v-else>
          <p v-if="$common.checkArrayValue(companyMasterInfo.dataList)">
            {{ companyMasterInfo.dataList[0].companyName }}
          </p>
        </template>
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
              title="業種"
              placeholder="業種を選択してください"
              :select-data="selectSaveCondition.items.industryCodes"
              :filter-type="1"
              @click="isShowCategoryModal = true"
            />
            <FilterButtons
              class="filter"
              title="所在地"
              placeholder="所在地を選択してください"
              :select-data="selectSaveCondition.items.prefectureCodes"
              :filter-type="2"
              @click="isShowLocationModal = true"
            />
            <FilterButtons
              class="filter"
              title="売上規模"
              placeholder="売上規模を選択してください"
              :select-data="[selectSaveCondition.items.salesScaleCode]"
              :filter-type="3"
              @click="isShowEarningsModal = true"
            />
          </div>
          <SelectSaveConditions
            screen-id="SC-DXT09030101"
            :company-info="currentCompany"
            :client-info="clientCompany"
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
            :is-own-company="true"
            :table-info="tableData"
            :table-type="tableType"
            :balance-type="balanceType"
            :filter-info="csvFilterInfo"
            :own-company-name="ownCompanyName"
          />
        </div>
      </div>
      <CompanyInfoTable
        class="company-info-table"
        :table-info="tableData"
        :is-own-company="true"
        :balance-type="balanceType"
        :table-type="tableType"
        :own-company-name="ownCompanyName"
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
import companyInfoUtilityMixin from '~/mixin/mmi/companyInfoUtility.js'
import mmiFilterUtilityMixin from '~/mixin/mmi/mmiFilterUtility.js'
import TabButtons from '~/components/mmi/TabButtons.vue'
import FilterButtons from '~/components/mmi/FilterButtons.vue'
import CompanyInfoTable from '~/components/mmi/companyInfoTable/CompanyInfoTable.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'
import CsvDownloadButton from '~/components/mmi/CsvDownloadButton.vue'
import CategoryFilterModal from '~/components/mmi/modal/CategoryFilterModal.vue'
import EarningsFilterModal from '~/components/mmi/modal/EarningsFilterModal.vue'
import LocationFilterModal from '~/components/mmi/modal/LocationFilterModal.vue'
import ReportStateMessageModal from '~/components/mmi/modal/ReportStateMessageModal.vue'

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
    ReportStateMessageModal,
    CollapseTransition,
  },
  mixins: [companyInfoUtilityMixin, mmiFilterUtilityMixin],
  data() {
    return {
      isShowFilter: true,
      balanceTabIndex: 0,
      averageTabsIndex: 0,
      isShowCategoryModal: false,
      isShowLocationModal: false,
      isShowEarningsModal: false,
      isShowReportStateModal: false,
      balanceTabs: [
        { title: 'PL（損益計算書）' },
        { title: 'BS（貸借対照表）' },
        { title: '変動損益計算書' },
      ],
      balanceType: '0',
      averageTabs: [
        { title: '1企業あたり平均' },
        { title: '1従業員あたり平均' },
      ],
      selectedCompanyLinkageId: '',
      advisorOptions: [],
      advisorList: [],
      inputSearchText: '',
      tableData: {},
      tableType: 'corporate',
      ownCompanyName: '',
    }
  },
  computed: {
    ...mapState('mmi/companyReport', [
      'currentCompanyLinkageId',
      'companyMasterInfo',
      'accountingFirmFlg',
    ]),
    ...mapState('mmi/filterConditions', ['selectSaveCondition']),
    csvFilename() {
      let baseFilename = '自社分析'
      if (this.$common.checkArrayValue(this.companyMasterInfo.dataList)) {
        if (!this.accountingFirmFlg) {
          baseFilename =
            this.companyMasterInfo.dataList[0].companyName || baseFilename
        } else {
          this.advisorOptions.find((companyOption) => {
            if (companyOption.code === this.selectedCompanyLinkageId) {
              baseFilename = companyOption.label
              return true
            }
          })
        }
      }
      console.log('baseFilename', baseFilename)
      return this.getCompanyInfoFilename(baseFilename, this.balanceType)
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
  },
  created() {
    this.output('自社分析画面 表示開始')
    this.resetSelectSaveCondition() // 保存条件のリセット
  },
  mounted() {
    this.initFunc() // 初期表示処理
  },
  methods: {
    ...mapMutations('mmi/companyReport', ['setCurrentCompanyLinkageId']),
    ...mapMutations('mmi/filterConditions', ['resetSelectSaveCondition']),
    /**
     * 初期表示処理
     */
    initFunc() {
      // 会計事務所チェック
      if (this.accountingFirmFlg) {
        this.getAdvisorList() // 顧問先一覧の取得
      } else {
        this.ownCompanyName = this.companyMasterInfo.dataList[0].companyName
        this.getCompanyInfo() // 自社分析PL_BSの取得
      }
    },
    /**
     * 顧問先一覧の取得
     */
    getAdvisorList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.output('API 顧問先取得 開始')
      this.$api
        .getAdvisorInfo(paramData)
        .then((res) => {
          this.output('API 顧問先取得 終了')
          if (res.data.result === 0) {
            this.advisorList = res.data.resultDataList
            this.setAdvisorOptions(this.advisorList) // 顧問先一覧のプルダウン設定
            this.getCompanyInfo() // 自社分析PL_BSの取得
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API 顧問先取得 エラー')
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 顧問先一覧のプルダウン設定
     *
     * @param {object[]} 顧問先一覧のリスト
     */
    setAdvisorOptions(advisorList) {
      const options = []
      let option = {}

      for (let i = 0; i < advisorList.length; i++) {
        option = {}

        option.code = advisorList[i].linkageId
        option.label = advisorList[i].companyName

        options.push(option)
      }
      this.selectedCompanyLinkageId =
        this.currentCompanyLinkageId || options[0].code
      this.advisorOptions = options

      this.ownCompanyName = options[0].label
      advisorList.forEach((e) => {
        if (e.linkageId === this.selectedCompanyLinkageId) {
          this.ownCompanyName = e.companyName
        }
      })

      this.setCurrentCompanyLinkageId(null)
    },
    /**
     * 分析情報の状態チェック
     */
    checkCompanyInfoState() {
      if (!this.isFiltered()) {
        if (
          this.isEmptyDataTableColLine(this.tableData, this.tableType, 0, true)
        ) {
          this.isShowReportStateModal = true
        }
      } else if (
        this.isEmptyDataTableColLineOther(
          this.tableData,
          this.tableType,
          0,
          true
        )
      ) {
        this.isShowReportStateModal = true
      }
    },
    /**
     * 自社分析PL_BSの取得
     */
    getCompanyInfo() {
      const paramData = this.getCompanyInfoParam() // 自社分析PL_BS取得APIのリクエストパラメータの取得

      this.$common.addCallApiNum()
      this.output('API 自社分析PL_BS取得 開始')
      this.$api
        .getMmiOwnCompany(paramData)
        .then((res) => {
          this.output('API 自社分析PL_BS取得 終了')
          if (res.data.result === 0) {
            this.tableData = res.data
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }

          this.checkCompanyInfoState()
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API 自社分析PL_BS取得 エラー', error)
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
     * 自社分析PL_BS取得APIのリクエストパラメータの取得
     *
     * @return {object[]} 自社分析PL_BS取得APIのリクエストパラメータ
     */
    getCompanyInfoParam() {
      const paramData = {}

      // 会社事務所チェック
      if (this.accountingFirmFlg) {
        // 顧問先一覧からの遷移
        if (this.selectedCompanyLinkageId) {
          if (this.selectedCompanyLinkageId !== '') {
            paramData.linkageId = this.selectedCompanyLinkageId
          }
        } else if (this.advisorList.length > 0) {
          paramData.linkageId = this.advisorList[0].linkageId
        }
      } else if (
        this.$common.checkArrayValue(this.companyMasterInfo.dataList)
      ) {
        paramData.linkageId = this.companyMasterInfo.dataList[0].linkageId
      }

      paramData.plbsDiv = this.balanceType

      // 業種の設定 全項目が設定されている場合は、keyは送らない
      if (
        !this.selectSaveCondition.items.industryCategory.includes(
          'すべての業種'
        )
      ) {
        paramData.industryCodes = this.selectSaveCondition.items.industryCodes
      }

      // 所在地の設定 全項目が設定されている場合は、keyは送らない
      if (!this.selectSaveCondition.items.prefectureCategory.includes('all')) {
        paramData.prefectureCodes = this.selectSaveCondition.items.prefectureCodes
      }

      paramData.salesScaleCode = this.selectSaveCondition.items.salesScaleCode

      if (paramData.salesScaleCode === '0') {
        paramData.salesScaleLower = this.selectSaveCondition.items.salesScaleLower
        paramData.salesScaleUpper = this.selectSaveCondition.items.salesScaleUpper
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

      if (this.selectSaveCondition.items.salesScaleCode !== '1') {
        return true
      }

      return false
    },

    /**
     * 顧問先セレクトボックス変更時
     */
    onCompanySelectChanged() {
      this.resetSelectSaveCondition() // 保存条件のリセット
      this.balanceTabIndex = 0 // BS/PSの選択をリセット
      this.averageTabsIndex = 0 // 企業/従業員の選択をリセット

      this.advisorOptions.forEach((e) => {
        if (e.code === this.selectedCompanyLinkageId) {
          this.ownCompanyName = e.label
        }
      })

      this.getCompanyInfo() // 自社分析PL_BSの取得
    },
    /**
     * PL/BS区分の選択
     *
     * @param {number} tab PL/BS区分 0:PL 1:BS
     */
    onBalanceTabSelected(tab) {
      this.balanceType = String(tab)
      this.getCompanyInfo() // 自社分析PL_BSの取得
    },
    /**
     * テーブル表示タイプの切り替え
     *
     * @param {number} tab 切り替えタブの値
     */
    onAverageTabSelected(tab) {
      if (tab === 0) {
        this.tableType = 'corporate'
      }
      if (tab === 1) {
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
      title: '自社分析｜MMI｜bizskyDX',
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
