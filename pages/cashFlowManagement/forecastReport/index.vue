<template>
  <div class="cashflow-report">
    <div class="header">
      <h2 class="header-title">資金繰り予測レポート</h2>
    </div>
    <div class="main-contents">
      <CustomInputSelect
        v-if="advisorListOptions.length > 0 && corporateType === '20'"
        ref="advisorList"
        v-model="selectAdvisor"
        class="select-advisor"
        :is-disabled="false"
        :options="advisorListOptions"
        @change="changeAdvisor()"
      />
      <CashflowForecastChart
        v-if="
          cashFlowReportList.length > 0 &&
          cashFlowAlertList.length > 0 &&
          $common.checkArrayValue(companyMasterDataList)
        "
        ref="chart"
        :latest-date="getLatestDate"
      />
      <!-- CFM1.0では非表示
      <div v-if="checkAlertStatus === 1" class="banner">
        <img
          class="banner-image"
          :src="$common.getAssetsImgUrl('images/common/nodata_2.png')"
        />
      </div>
      -->
      <div class="table-cashflow">
        <CashflowTable
          v-if="Object.keys(cashFlowReportTableDataObj).length > 0"
          ref="table"
        />
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import cfmCommonMixin from '~/mixin/cfm/cfmCommon.js'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'cfmLayout',
  components: {
    CommonFooter,
  },
  mixins: [cfmCommonMixin],
  data() {
    return {
      forecastReportParam: {
        linkageId: '',
        period: '24',
      },
      latestDate: '',
      advisorDataList: [],
      advisorListOptions: [],
    }
  },
  computed: {
    ...mapState('cfm/common', ['corporateType', 'companyMasterDataList']),
    ...mapState('cfm/advisoryCompanyStore', ['selectLinkageId']),
    ...mapState('cfm/cashFlowReportStore', [
      'cashFlowAlertList',
      'advisorList',
      'cashFlowReportList',
      'cashFlowReportTableDataObj',
      'advisorVal',
      'backScreenFlg',
    ]),
    selectAdvisor: {
      get() {
        return this.advisorVal
      },
      set(val) {
        this.setAdvisorVal(val)
      },
    },
    /**
     * 最新データ取得日の取得
     */
    getLatestDate() {
      let latestDate = ''

      if (this.corporateType === '20') {
        const targetAdvisorInfo = this.advisorDataList.find(
          (data) => data.linkageId === this.advisorVal
        )

        if (targetAdvisorInfo) {
          latestDate = targetAdvisorInfo.latestDate
        }
      } else {
        latestDate = this.companyMasterDataList[0].latestDate
      }

      return latestDate
    },
  },
  watch: {},
  created() {
    this.initFunc() // 初期表示処理
  },
  mounted() {},
  methods: {
    ...mapMutations('cfm/cashFlowReportStore', [
      'resetDefaultState',
      'setAdvisorVal',
      'setBackScreenFlg',
      'setCashFlowReportList',
      'setCashFlowAlertList',
    ]),
    ...mapMutations('cfm/advisoryCompanyStore', ['setSelectLinkageId']),
    /**
     * 初期表示処理
     */
    initFunc() {
      this.setCashFlowReportList([])
      this.setCashFlowAlertList([])

      // 会計事務所の場合は、顧問先一覧取得APIを呼び出す
      if (this.corporateType === '20') {
        this.getCfmAdvisorsList() // 顧問先一覧取得APIの呼び出し(mixin)
      } else {
        this.advisorListOptions = this.companyMasterDataList.map(
          ({ linkageId, companyName }) => {
            return {
              code: linkageId,
              label: companyName,
            }
          }
        )

        this.setAdvisorVal(this.companyMasterDataList[0].linkageId)
        this.forecastReportParam.linkageId = this.advisorVal
        this.getCashFlowReport(this.forecastReportParam) // 資金繰り予測API取得(mixin)
      }
    },
    /**
     * 顧問先一覧API取得
     */
    getCfmAdvisorsList() {
      const params = {
        predictiveStatus: '0,1,9',
      }

      this.$common.addCallApiNum()
      this.$api
        .getAdvisorsList(params)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.advisorDataList = resData.data.resultDataList
            this.advisorListOptions = this.advisorDataList.map(
              ({ linkageId, companyName }) => {
                return {
                  code: linkageId,
                  label: companyName,
                }
              }
            )

            let advisorVal = ''

            if (this.backScreenFlg) {
              advisorVal = this.advisorVal
              this.setBackScreenFlg(false)
            } else if (this.selectLinkageId.length > 0) {
              // 顧問先一覧の企業名から遷移した場合、選択された企業名を表示
              advisorVal = this.selectLinkageId
              this.setSelectLinkageId('')
            } else {
              // 会社コード昇順の先頭の企業名を表示
              advisorVal = this.advisorDataList[0].linkageId
            }

            this.$nextTick(() => {
              this.setAdvisorVal(advisorVal)
              this.forecastReportParam.linkageId = this.advisorVal
              this.getCashFlowReport(this.forecastReportParam) // 資金繰り予測API取得(mixin)
            })
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
     * 顧問先のセレクトボックス変更処理
     */
    changeAdvisor() {
      this.forecastReportParam.linkageId = this.advisorVal
      this.getCashFlowReport(this.forecastReportParam) // 資金繰り予測API取得(mixin)

      if (Object.keys(this.cashFlowReportTableDataObj).length > 0) {
        this.$refs.table.changeMode('view', true) // テーブルを参照モードに変更
      }
    },
  },
  head() {
    return {
      title: '資金繰り予測レポート｜キャッシュフローマネジメント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  &-icon {
    position: relative;
    top: 3px;
    margin: 0 0 0 9px;
    fill: #3a435c;
  }
  * {
    &:last-child {
      margin-left: auto;
    }
  }
}
.select-advisor {
  width: 420px;
  margin-top: 24px;
}

.btn-update {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 16px;
  width: 70px;
  height: 32px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  & > *:first-of-type {
    margin: 0 8px 0 0;
  }
  svg {
    width: 17px;
    height: 17px;
    fill: #3a435c;
  }
}

.title {
  &-bold {
    font-weight: 500;
  }
}

.btn {
  &-manual-simulation {
    min-width: 304px;
    margin: 24px auto 0;
    span {
      margin: 0 0 0 24px;
    }
  }
}

.custom-input-select /deep/ {
  select {
    padding: 13px 32px 13px 16px;
  }
}

.custom-input-text /deep/ {
  min-width: 420px;
}

.banner {
  width: 854px;
  height: 285px;
  margin: 40px auto 0 auto;
  &-image {
    width: 100%;
    height: 100%;
  }
}
</style>
