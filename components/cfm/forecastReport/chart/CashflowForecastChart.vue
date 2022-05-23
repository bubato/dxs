<template>
  <div class="cashflow-forecast">
    <div class="cashflow-forecast-title">
      <div class="left-contents">
        <h4>
          <span v-if="checkSimulationType === 1">資金繰り予測</span>
          <span v-if="checkSimulationType === 2"
            >資金繰り予測シミュレーション結果</span
          >
          <span
            v-if="
              checkSimulationType === 3 &&
              Object.keys(saveSimulationInfo).length > 0
            "
            >{{ saveSimulationInfo.simulationResultName }}</span
          >
        </h4>
      </div>
      <div class="right-contents">
        <button
          v-if="checkSimulationType === 2"
          class="btn btn-utility btn-save"
          @click="setSaveSimulationResultsModalState(true)"
        >
          <StarOutlineSVG class="icon-starOutline" /><span>保存</span>
        </button>
        <SimulationSelectBox />
      </div>
    </div>
    <p v-if="checkSimulationType === 1" class="latest-date">
      最新データ取得日：{{ latestDate }}
    </p>
    <p v-if="checkSimulationType === 3" class="latest-date">
      シミュレーション保存日：{{ saveSimulationInfo.simulationResultSaveDate }}
    </p>
    <div class="cashflow-forecast-chart">
      <div class="cashflow-forecast-chart-graph">
        <div class="cashflow-forecast-chart-graph-guide">
          <ul class="legend-scenario flex">
            <li><ScenarioBase />ベースシナリオ</li>
            <li v-if="checkSimulationType === 1">
              <ScenarioOptimism />楽観シナリオ
            </li>
            <li v-if="checkSimulationType === 1">
              <ScenarioConservative />保守的シナリオ
            </li>
          </ul>
          <ul v-show="checkAlertStatus !== 9" class="legend-status flex">
            <li>良好</li>
            <li>危険</li>
          </ul>
        </div>
        <HighchartsVue
          v-show="checkAlertStatus !== 9"
          ref="cashFlowForecast"
          :options="chartOptions"
          class="highcharts"
        />
      </div>
      <div
        class="scenario-comments"
        :class="[
          { 'status-fine': checkAlertStatus === 0 },
          { 'status-danger': checkAlertStatus === 1 },
          { 'status-unpredictable': checkAlertStatus === 9 },
        ]"
      >
        <div v-if="checkAlertStatus === 0" class="scenario-comments-block">
          <div class="title">
            <CheckCircleSVG class="icon icon-checkCircle" />
            <h3>健全な資金繰り状況です</h3>
          </div>
          <div class="contents">
            <p>6か月先まで健全な資金繰り状況が続くと予測されています。</p>
          </div>
        </div>
        <div v-if="checkAlertStatus === 1" class="scenario-comments-block">
          <div class="title">
            <IconDanger class="icon icon-danger" />
            <h3>危険レベルに達する可能性があります</h3>
          </div>
          <div class="contents">
            <p class="advice-list-heading">アドバイス一覧</p>
            <ul class="advice-list-description">
              <li v-for="(alert, index) in cashFlowAlertList" :key="index">
                <h5>{{ alert.messageCode }}</h5>
                <p>
                  {{ alert.message }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="checkAlertStatus === 9" class="scenario-comments-block">
          <div class="title">
            <RemoveCircleSVG class="icon icon-removeCircle" />
            <h3>予測に必要な過去データが不足しているため予測できません。</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import cfmCommonMixin from '~/mixin/cfm/cfmCommon.js'
import IconDanger from '~/assets/svg/cfm/cashFlowReport/status-danger.svg'
import ScenarioBase from '~/assets/svg/cfm/cashFlowReport/scenario-base.svg'
import ScenarioOptimism from '~/assets/svg/cfm/cashFlowReport/scenario-optimism.svg'
import ScenarioConservative from '~/assets/svg/cfm/cashFlowReport/scenario-conservative.svg'

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
})

stockInit(Highcharts)

export default {
  name: 'CashflowForecastChart',
  components: {
    ScenarioBase,
    ScenarioOptimism,
    ScenarioConservative,
    IconDanger,
  },
  mixins: [cfmCommonMixin],
  props: {
    latestDate: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      // 選択中の顧問先のアドバイス
      currentAdvice: {},
      // チャートを表示する期間
      periodToDisplay: [],
      // 現在月のインデックス
      currentMonthIndex: 0,
      // 月々の営業CF値
      monthlyCashFlow: [],
      // 危険レベルステート
      isStatus: 1, // 0:正常 1:危険
      // チャートに描画する初期営業CF
      baseScenarioCashFlow: [],
      optimisticScenarioCashFlow: [],
      conservativeScenarioCashFlow: [],
      // チャートオプション
      chartOptions: {
        credits: {
          enabled: false,
        },
        chart: {
          type: 'line',
        },
        title: {
          text: 'text',
          margin: 20,
          style: {
            visibility: 'hidden',
          },
        },
        /**
         * 凡例
         */
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: null,
          min: null,
          max: null,
          scrollbar: {
            enabled: true,
            barBackgroundColor: '#9CA0AD',
            barBorderRadius: 7,
            barBorderWidth: 0,
            buttonBorderWidth: 0,
            buttonBorderRadius: 0,
            buttonArrowColor: 'none',
            buttonBackgroundColor: 'none',
            trackBackgroundColor: '#E5E5E5',
            trackBorderWidth: 1,
            trackBorderColor: 'none',
            trackBorderRadius: 7,
            rifleColor: 'none',
          },
          plotLines: [
            {
              label: {
                text: '現在月',
                x: 0,
                y: -20,
                textAlign: 'center',
                rotation: 0,
              },
              color: 'black',
              width: 1,
              value: null,
              dashStyle: 'solid',
            },
          ],
        },
        yAxis: {
          title: {
            text: '',
          },
          tickInterval: 10000,
          labels: {
            formatter() {
              return Highcharts.numberFormat(this.value, 0, '', ',')
            },
          },
          plotBands: [
            {
              color: 'rgba(255, 69, 58, 0.1)',
              from: -999999999999999999999999,
              // 当月の現預金残高を参照し-20%した値をセットする
              to: 0,
            },
          ],
          plotLines: [
            // 現預金残高-20%
            {
              label: {
                text: '現預金残高-20%',
                x: 0,
                align: 'right',
              },
              color: '',
              width: 0,
              value: 0,
              dashStyle: 'solid',
            },
          ],
          max: 0,
        },
        tooltip: {
          enabled: true,
        },
        plotOptions: {
          // 線の描画色を値毎に変更する
          series: {
            zones: [
              // 危険(現預金残高-20%)
              {
                value: 0,
                color: '#FF453A',
              },
              // 良好
              {
                color: '#34C759',
              },
            ],
          },
        },
        series: [],
      },
    }
  },
  computed: {
    ...mapState('cfm/common', ['corporateType', 'companyMasterDataList']),
    ...mapState('cfm/cashFlowReportStore', [
      'cashFlowReportTableDataObj',
      'simulationChartReloadFlg',
      'cashflowSimulationData',
      'cashFlowAlertList',
      'cashFlowReportList',
      'advisorVal',
      'saveSimulationInfo',
    ]),
  },
  watch: {
    simulationChartReloadFlg(afterVal) {
      if (afterVal) {
        this.setInitChartDraw() // チャートの初期描画
      }

      this.setSimulationChartReloadFlg(false)
    },
  },
  created() {
    if (this.checkSimulationType !== 1) {
      this.setInitChartDraw() // チャートの初期描画
    }
  },
  methods: {
    ...mapMutations('cfm/cashFlowReportStore', [
      'setSimulationChartReloadFlg',
      'setSaveSimulationResultsModalState',
    ]),
    /**
     * チャートの初期描画
     */
    setInitChartDraw() {
      switch (this.checkSimulationType) {
        case 1:
          // デフォルトの処理
          this.defaultChartDraw()
          break
        case 2:
          // シミュレーション結果ページの処理
          this.simulationResultChartDraw()
          break
        case 3:
          // 保存したシミュレーションページの処理
          this.saveSimulationChartDraw()
          break
      }
    },
    /**
     * 保存したシミュレーションのチャートを描画する
     */
    saveSimulationChartDraw() {
      this.setChartOptions(true)
    },
    /**
     * シミュレーション結果のチャートを描画する
     */
    simulationResultChartDraw() {
      this.setChartOptions(true)
    },
    /**
     * デフォルトのチャートを描画する
     */
    defaultChartDraw() {
      this.setChartOptions(false)
    },
    /**
     * チャートオプションをセットする
     */
    setChartOptions() {
      const cashDepositsList = this.getCashDepositsList()
      this.periodToDisplay = this.cashFlowReportList.map(
        (data) => data.year + '/' + data.month
      ) // 表示期間
      const currentMonthIndex = this.getCurrentMonthIndex() // 現在月のインデックス
      this.chartOptions.xAxis.categories = this.periodToDisplay // 表示する期間をセットする
      this.chartOptions.xAxis.plotLines[0].value = currentMonthIndex // 現在月のインデックスをセットする
      this.chartOptions.xAxis.min = currentMonthIndex // 描画初期位置をセットする
      this.baseScenarioCashFlow = cashDepositsList // ベースシナリオの初期値をセットする

      // チャートライン描画色の閾値指定
      this.chartOptions.yAxis.plotBands[0].to = this.cashFlowAlertList[0].threshold
      this.chartOptions.yAxis.plotLines[0].value = this.cashFlowAlertList[0].threshold
      this.chartOptions.plotOptions.series.zones[0].value = this.cashFlowAlertList[0].threshold

      if (this.checkAlertStatus === 9) {
        const borderColor = '#B0B3BE'

        this.chartOptions.plotOptions.series.zones[0].color = borderColor
        this.chartOptions.plotOptions.series.zones[1].color = borderColor
      } else {
        this.chartOptions.plotOptions.series.zones[0].color = '#FF453A'
        this.chartOptions.plotOptions.series.zones[1].color = '#34C759'
      }

      // 楽観シナリオの設定（現預金残高 + 確率分布幅）
      this.optimisticScenarioCashFlow = this.cashFlowReportList.map(
        (data, index) =>
          currentMonthIndex < index
            ? cashDepositsList[index] + data.probabilityDistributionWidth || 0
            : data.cashAndDeposits
      )

      // 保守的シナリオの設定（現預金残高 - 確率分布幅）
      this.conservativeScenarioCashFlow = this.cashFlowReportList.map(
        (data, index) =>
          currentMonthIndex < index
            ? cashDepositsList[index] - data.probabilityDistributionWidth
            : data.cashAndDeposits
      )

      this.setTickInterval() // Y軸の最大値を設定

      this.chartOptions.series = [
        {
          // ベースシナリオ
          name: '現預金残高',
          data: this.baseScenarioCashFlow,
          dashStyle: 'Solid',
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 6,
          },
        },
      ]

      if (this.checkSimulationType === 1) {
        this.chartOptions.series.push(
          {
            // 楽観シナリオ
            name: '現預金残高',
            data: this.optimisticScenarioCashFlow,
            dashStyle: 'Dash',
            opacity: 0.4,
            marker: {
              enabled: true,
              symbol: 'square',
              radius: 5,
            },
          },
          {
            // 保守的シナリオ
            name: '現預金残高',
            data: this.conservativeScenarioCashFlow,
            dashStyle: 'Dash',
            opacity: 0.4,
            marker: {
              enabled: true,
              symbol: 'triangle',
              radius: 5,
            },
          }
        )
      }
    },
    /**
     * グラフに表示するデータを取得(現預金残高)
     */
    getCashDepositsList() {
      const cashDepositsList = this.cashFlowReportList.map(
        (data) => data.cashAndDeposits
      )

      if (this.checkSimulationType !== 1) {
        for (let i = 0; i < 6; i++) {
          let cashDeposits = 0

          if (this.checkSimulationType === 2) {
            cashDeposits = this.cashflowSimulationData.tableData
              .cashAndDeposits[i].value
          } else if (this.checkSimulationType === 3) {
            cashDeposits = this.cashFlowReportTableDataObj.cashAndDeposits[i]
              .value
          }

          cashDepositsList[cashDepositsList.length - (6 - i)] = cashDeposits
        }
      }

      return cashDepositsList
    },
    /**
     * Y軸の最大値を設定
     */
    setTickInterval() {
      const maxCashDeposits = Math.max.apply(
        null,
        this.optimisticScenarioCashFlow
      ) // 現預金残高(楽観シナリオ)の最大値
      const digits = String(parseInt(maxCashDeposits)).length - 1
      const pow = Math.pow(10, digits)

      if (pow >= 100) {
        this.chartOptions.yAxis.tickInterval =
          Math.ceil(parseInt(maxCashDeposits) / pow) * pow
      } else {
        this.chartOptions.yAxis.tickInterval =
          Math.ceil(parseInt(maxCashDeposits) / 10) * 10
      }

      this.chartOptions.yAxis.max = maxCashDeposits
    },
  },
}
</script>

<style scoped lang="scss">
.highcharts {
  margin: 20px 0 0 0;
}

.cashflow-forecast {
  margin: 40px 0 0 0;
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      margin: 0 0 0 8px;
    }
    .right-contents {
      display: flex;
      align-items: center;
      > * {
        &:not(:first-child) {
          margin-left: 8px;
        }
      }
    }
  }
  .latest-date {
    margin-top: 8px;
  }
  &-chart {
    display: flex;
    margin-top: 16px;
    &-graph {
      width: calc(100% - 442px);
      height: 490px;
      padding: 24px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      &-guide {
        .legend-status {
          margin-top: 18px;
        }
      }
      .legend {
        &-status {
          li {
            font-size: 12px;
            font-weight: 500;
            @mixin statusCircle {
              display: inline-block;
              margin: 0px 8px 0 0;
              content: '';
              width: 16px;
              height: 16px;
              vertical-align: bottom;
              border-radius: 50%;
            }
            &:nth-of-type(1) {
              &:before {
                @include statusCircle;
                background-color: #34c759;
              }
            }
            &:nth-of-type(2) {
              &:before {
                @include statusCircle;
                background-color: #ff453a;
              }
            }
            &:not(:last-of-type) {
              margin: 0 16px 0 0;
            }
          }
        }
        &-scenario {
          margin-left: auto;
          li {
            svg {
              margin: 0 8px 0 0;
            }
            &:not(:last-of-type) {
              margin: 0 18px 0 0;
            }
          }
        }
      }
    }
    .scenario-comments {
      width: 426px;
      padding: 24px;
      margin-left: 16px;
      border-radius: 6px;
      &-block {
        .title {
          display: flex;
          h3 {
            margin-left: 8px;
          }
        }
        .contents {
          height: 405px;
          background: #ffffff;
          margin-top: 24px;
          padding: 20px 24px;
          overflow: auto;
        }
      }
      .icon {
        min-width: 32px;
        min-height: 32px;
        &-checkCircle {
          fill: #34c759;
        }
      }
    }
  }
}

.scenario-selection {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 396px;
  height: 40px;
  margin: 56px 0 0 0;
  button {
    width: 137px;
    height: 38px;
    font-weight: 500;
    cursor: pointer;
    &.active,
    &:hover {
      background: #ebeced;
    }
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
  }
}

.text {
  &-danger {
    color: #e60012;
  }
}

.status {
  &-fine {
    background-color: #f0fff4;
  }
  &-danger {
    background-color: #fff2f4;
  }
  &-unpredictable {
    background-color: #f5f7fa;
  }
}

.advice-list {
  &-heading {
    font-size: 20px;
    font-weight: 500;
    &:last-of-type {
      margin-left: auto;
    }
  }
  &-description {
    margin: 16px 0 0 0;
    li {
      h5 {
        margin: 0 0 15px 0;
        color: #e60012;
      }
      p {
        color: #e60012;
      }
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
</style>
