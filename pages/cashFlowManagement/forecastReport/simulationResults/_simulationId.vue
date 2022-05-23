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
      <ToBackScreenLink
        label="資金繰り予測レポートへ戻る"
        @click="toBackScreen()"
      />
      <CashflowForecastChart
        v-if="
          (checkSimulationType !== 3 &&
            cashFlowReportList.length > 0 &&
            cashFlowAlertList.length > 0 &&
            $common.checkArrayValue(companyMasterDataList)) ||
          (checkSimulationType === 3 &&
            cashFlowAlertList.length > 0 &&
            readSaveDataFlg)
        "
        ref="chart"
      />
      <div class="table-cashflow">
        <CashflowTable
          v-if="
            (checkSimulationType === 2 &&
              Object.keys(cashflowSimulationData.tableData).length > 0) ||
            (checkSimulationType === 3 && readSaveDataFlg)
          "
          ref="table"
        />
      </div>
    </div>
    <SaveSimulationResultsModal
      v-if="saveSimulationResultsModalState"
      @close="setSaveSimulationResultsModalState(false)"
    />
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
      advisorListOptions: [],
      readSaveDataFlg: false, // 保存取得情報読込完了フラグ
    }
  },
  computed: {
    ...mapState('cfm/common', ['corporateType', 'companyMasterDataList']),
    ...mapState('cfm/cashFlowReportStore', [
      'cashFlowAlertList',
      'cashFlowReportList',
      'cashflowSimulationData',
      'adviceReloadFlg',
      'cashFlowReportTableDataObj',
      'advisorVal',
      'saveSimulationResultsModalState',
      'saveSimulationInfo',
    ]),
    selectAdvisor: {
      get() {
        return this.advisorVal
      },
      set(val) {
        this.setAdvisorVal(val)
      },
    },
  },
  watch: {
    adviceReloadFlg(afterVal) {
      if (afterVal) {
        this.getAdviceInfo() // アドバイス情報取得
      }
      this.setAdviceReloadFlg(false)
    },
  },
  created() {
    this.initFunc() // 初期表示処理
  },
  mounted() {},
  methods: {
    ...mapMutations('cfm/cashFlowReportStore', [
      'setCashFlowAlertList',
      'setCashFlowReportList',
      'setCashFlowReportTableHeader',
      'setCashFlowReportTableDataObj',
      'setAdvisorVal',
      'setSaveSimulationResultsModalState',
      'setSaveSimulationInfo',
      'setBackScreenFlg',
      'setAdviceReloadFlg',
      'setSimulationChartReloadFlg',
    ]),
    ...mapMutations('cfm/advisoryCompanyStore', ['setSelectLinkageId']),
    /**
     * 初期表示処理
     */
    initFunc() {
      if (this.checkSimulationType === 2) {
        this.initManualSimulation() // 手動シミュレーション時の初期表示処理
      } else if (this.checkSimulationType === 3) {
        this.initSaveSimulation() // 保存シミュレーション時の初期表示処理
      }
    },
    /**
     * 手動シミュレーション時の初期表示処理
     */
    initManualSimulation() {
      // 会計事務所の場合は、顧問先一覧取得APIを呼び出す
      if (this.corporateType === '20') {
        this.getCfmAdvisorsList() // 顧問先一覧取得APIの呼び出し
      } else {
        this.advisorListOptions = this.companyMasterDataList.map(
          ({ linkageId, companyName }) => {
            return {
              code: linkageId,
              label: companyName,
            }
          }
        )

        this.setAdvisorVal(this.cashflowSimulationData.advisorVal)
        this.getAdviceInfo() // アドバイス情報取得
      }
    },
    /**
     * 保存シミュレーション時の初期表示処理
     */
    initSaveSimulation() {
      // 会計事務所の場合は、顧問先一覧取得APIを呼び出す
      if (this.corporateType === '20') {
        this.getCfmAdvisorsList() // 顧問先一覧取得APIの呼び出し
      } else {
        this.advisorListOptions = this.companyMasterDataList.map(
          ({ linkageId, companyName }) => {
            return {
              code: linkageId,
              label: companyName,
            }
          }
        )

        this.getSimulationResults() // シミュレーション結果を取得する
      }
    },
    /**
     * シミュレーション結果を取得する
     */
    getSimulationResults() {
      const params = {
        simulationResultId: this.$route.params.simulationId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getSimulationResults(params)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setSaveSimulationInfo(resData.data)
            this.setAdvisorVal(resData.data.linkageId)
            this.setInitShowCashFlowTableData(
              resData.data.simulationResultJson.datalist
            )

            this.getAdviceInfo() // アドバイス情報取得
            this.readSaveDataFlg = true
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
     * アドバイス情報取得
     */
    getAdviceInfo() {
      const params = this.getAdviceInfoParam() // アドバイス情報取得APIのリクエストパラメータの取得

      this.$common.addCallApiNum()
      this.$api
        .getAdviceInfo(params)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setInitCashFlowAlertList(resData.data.alerts)
            this.$nextTick(() => {
              this.setSimulationChartReloadFlg(true)
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
     * アラートリストの初期設定
     *
     * @param {Object[]} alertList アラート一覧
     * @param {Object[]} dataList 表示データ一覧
     */
    setInitCashFlowAlertList(alertList, dataList) {
      const sortAlertList = alertList.sort((a, b) => {
        if (a.displayRank > b.displayRank) {
          return 1
        } else {
          return -1
        }
      })

      if (
        sortAlertList.length > 0 &&
        this.cashFlowReportList.length > 0 &&
        this.cashFlowReportList[0].year === null
      ) {
        sortAlertList[0].status = 9
      }

      this.setCashFlowAlertList(sortAlertList)
    },
    /**
     * アドバイス情報取得APIのリクエストパラメータの取得
     *
     * @return {object} アドバイス情報取得APIのリクエストパラメータ
     */
    getAdviceInfoParam() {
      const paramData = {
        actual: [],
        forecast: [],
      }
      const targetKey = [
        'sales',
        'cost',
        'personnelExpenses',
        'rents',
        'sgAndA',
        'operatingIncome',
        'depreciationCost',
        'depreciationSgAndA',
        'tradeReceivable',
        'inventories',
        'accountsPayable',
        'operatingCashFlow',
        'cashAndDeposits',
      ]

      const oneYearDataList = JSON.parse(
        JSON.stringify(
          this.cashFlowReportList
            .filter((data) => data.forecastFlag === 0)
            .reverse()
            .filter((data, index) => index < 12)
            .reverse()
        )
      )

      for (let i = 0; i < oneYearDataList.length; i++) {
        let option = {}

        option = oneYearDataList[i]
        option.linkageId = this.advisorVal

        paramData.actual.push(option)
      }

      let targetTableData = {}

      if (this.checkSimulationType === 2) {
        targetTableData = this.cashflowSimulationData.tableData
      } else if (this.checkSimulationType === 3) {
        targetTableData = this.cashFlowReportTableDataObj
      }

      for (let i = 0; i < 6; i++) {
        const option = {}

        for (let j = 0; j < targetKey.length; j++) {
          option[targetKey[j]] = targetTableData[targetKey[j]][i].value
        }

        option.linkageId = this.advisorVal
        option.year = targetTableData.sales[i].date.split('/')[0]
        option.month = targetTableData.sales[i].date.split('/')[1]

        paramData.forecast.push(option)
      }

      return paramData
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
            this.advisorListOptions = resData.data.resultDataList.map(
              ({ linkageId, companyName }) => {
                return {
                  code: linkageId,
                  label: companyName,
                }
              }
            )

            this.$nextTick(() => {
              this.setAdvisorVal(this.cashflowSimulationData.advisorVal)
              if (this.checkSimulationType === 2) {
                this.getAdviceInfo() // アドバイス情報取得
              } else if (this.checkSimulationType === 3) {
                this.getSimulationResults() // シミュレーション結果を取得する
              }
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
      this.setSelectLinkageId(this.advisorVal) // 選択された会社名に紐づく連携IDをSessionStorageに格納
      this.$router.push('/cashFlowManagement/forecastReport/')
    },
    /**
     * 資金繰り予測レポート画面に戻る
     */
    toBackScreen() {
      this.setBackScreenFlg(true)
      this.$router.push('/cashFlowManagement/forecastReport/')
    },
  },
  head() {
    let title = ''

    if (this.checkSimulationType === 2) {
      title =
        'シミュレーション結果｜資金繰り予測レポート｜キャッシュフローマネジメント｜bizskyDX'
    } else if (
      this.checkSimulationType === 3 &&
      this.saveSimulationInfo.simulationResultName
    ) {
      title = `${this.saveSimulationInfo.simulationResultName}｜キャッシュフローマネジメント｜bizskyDX`
    }

    return {
      title,
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

.title {
  &-bold {
    font-weight: 500;
  }
}

.link-text {
  display: flex;
  align-items: center;
  margin: 40px 0 17px 0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.advice-list {
  margin: 24px 0 0 0;
  padding: 24px;
  background: #f7f8f9;
  border-radius: 6px;
  &-heading {
    font-size: 17px;
    font-weight: 500;
    &:last-of-type {
      margin-left: auto;
    }
  }
  &-description {
    margin: 16px 0 0 0;
    li {
      &:first-of-type {
        border-top: 1px solid #e5e5e5;
      }
      border-bottom: 1px solid #e5e5e5;
      padding: 17px 0;
    }
  }
  &-recommendation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-left: auto;
    border: 3px #e5ecfb solid;
    border-radius: 50%;
    color: #4f7df0;
    font-size: 12px;
  }
}

.btn {
  &-save {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 16px;
    width: 70px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    & > *:first-of-type {
      margin: 0 2px 0 0;
    }
    svg {
      fill: #3a435c;
    }
  }
  &-manual-simulation {
    &-top {
      margin-left: auto;
      span {
        margin: 0 0 0 8px;
      }
    }
    &-bottom {
      margin: 24px auto 0;
      span {
        margin: 0 0 0 8px;
      }
    }
  }
  &-back {
    fill: #007aff;
    transform: scale(-1, 1);
  }
}

.table {
  &-cashflow {
    margin: 41px 0 0 0;
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

.simulation-comment {
  margin: 40px 0 0 0;
  > p {
    margin: 0 0 12px 0;
  }
  > button {
    margin: 40px auto 0;
  }
}
</style>
