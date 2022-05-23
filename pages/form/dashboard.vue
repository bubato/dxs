<template>
  <div class="dash-board">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">ダッシュボード</h2>
        <CustomDateRangePicker
          v-model="dateRangePicker"
          :start-date="dateRangePicker.startDate"
          :end-date="dateRangePicker.endDate"
          :opens="'left'"
          class="header-select"
          @update="updateDateRangePicker($event)"
        />
      </div>
      <div v-if="Object.keys(kpiData).length > 0" class="kpi-data">
        <div class="kpi-data-card">
          <div
            v-for="data in kpiData.sumData"
            :key="data.name"
            class="kpi-data-card-list"
          >
            <div class="first-view-data">
              <div class="first-view-data-title flex">
                {{ data.name
                }}<TooltipHelp
                  :label="tooltipLabel[data.name]"
                  class="tooltip"
                />
              </div>
              <div class="first-view-data-text">
                {{ data.value }}
              </div>
              <div class="first-view-data-rate">
                {{ data.ratio }}
              </div>
            </div>
            <div class="first-view-contrast">
              <StatusText
                :ratio="data.compareRatio"
                :status="data.ratioStatus"
              />
            </div>
          </div>
        </div>
        <div class="kpi-data-graph">
          <FunnelChart :series="graphData" />
        </div>
      </div>
      <div v-if="Object.keys(kpiData).length > 0" class="daily-chart">
        <h4>フォーム別効果</h4>
        <DailyChart
          ref="dailyChart"
          :aggregation-data="aggregationData"
          :default-view="defaultView"
          :option-list="optionList"
        />
      </div>
      <div class="form-list">
        <div class="table-options">
          <button
            v-show="
              formPublishedFlag === 1 && $common.checkArrayValue(formList)
            "
            class="btn btn-middle-short"
            @click="downloadFormListData()"
          >
            <DownloadSVG class="icon icon-download" /><span
              >CSVファイルを出力</span
            >
          </button>
        </div>
        <FormDashBoardFormListTable
          class="table-area"
          :sum-form-data="sumFormData"
          :form-list="formList"
          :published-flag="formPublishedFlag"
          @update="reflectSortFormTable()"
        />
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: {
    CommonFooter,
  },
  data() {
    return {
      limit: 20,
      offset: 1,
      maxDataNum: 0,
      kpiData: {},
      sumFormData: {},
      formList: [],
      formPublishedFlag: null,
      aggregationData: {},
      graphData: [
        {
          data: [],
        },
      ],
      dateRangePicker: {
        startDate: null,
        endDate: null,
      },
      defaultView: {
        value1: '1',
        value2: '3',
      },
      optionList: [
        {
          code: '1',
          label: '入力数',
        },
        {
          code: '2',
          label: '確認数',
        },
        {
          code: '3',
          label: 'CV数',
        },
      ],
      tooltipLabel: {
        入力数: '作成したフォームの入力画面表示合計数です。',
        確認数: '作成したフォームの確認画面表示合計数です。',
        コンバージョン数: '作成したフォームの完了画面表示合計数です。',
        入力からの離脱数: '入力数から確認数を引いた数です。',
        確認からの離脱数: '確認数から完了数を引いた数です。',
      },
    }
  },
  computed: {
    ...mapState('common', ['sideNavIsOpen']),
    ...mapState('form/dashboard', ['selectSortType']),
  },
  watch: {
    sideNavIsOpen() {
      if (
        this.$refs &&
        this.$refs.dailyChart &&
        this.$refs.dailyChart.$refs &&
        this.$refs.dailyChart.$refs.Highcharts
      ) {
        setTimeout(() => {
          this.$refs.dailyChart.$refs.Highcharts.chart.reflow()
        }, 100)
      }
    },
  },
  created() {
    this.setInitDateRage()
    this.getInitFunc()
  },
  mounted() {},
  methods: {
    ...mapMutations('form/dashboard', ['resetSelectSortType']),
    setInitDateRage() {
      this.dateRangePicker.startDate = dayjs()
        .subtract(6, 'days')
        .format('YYYY/MM/DD')
      this.dateRangePicker.endDate = dayjs().format('YYYY/MM/DD')
    },
    /**
     * KPIデータとフォームリストをAPIで取得
     */
    getInitFunc() {
      this.resetSelectSortType()

      this.getFormDashBoardKpiData()
      this.getFormList()
    },
    /**
     * 期間変更処理
     */
    updateDateRangePicker($event) {
      this.dateRangePicker = $event
      this.getInitFunc()
    },
    /**
     * KPIデータ取得
     */
    getFormDashBoardKpiData() {
      const paramData = {
        startDate: this.dateRangePicker.startDate,
        endDate: this.dateRangePicker.endDate,
      }

      this.$common.addCallApiNum()
      this.$api
        .getFormDashBoardKpiData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.kpiData = resData.data
            this.aggregationData = this.getAggregationData()
            this.setFunnelGraphData()
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
     * ファンネルグラフ用のデータ設定
     */
    setFunnelGraphData() {
      const colorList = ['#4F7DF0', '#66A2FC', '#68CEF2']

      this.graphData[0].data = []

      for (let i = 0; i < this.kpiData.sumData.length; i++) {
        if (i <= 2) {
          this.graphData[0].data.push({
            name: this.kpiData.sumData[i].name,
            y: Number(this.kpiData.sumData[i].value),
            color: colorList[i],
          })
        }
      }
    },
    /**
     * フォームデータリストの取得
     */
    getFormList() {
      const paramData = this.getFormListRequestParam()

      this.$common.addCallApiNum()
      this.$api
        .getDashBoardFormList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.maxDataNum = resData.data.searchResult
            this.sumFormData = resData.data.sumFormData
            this.formList = resData.data.formList
            this.formPublishedFlag = resData.data.publishedFlag
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
     * KPIフォームデータリストCSVの取得
     */
    downloadFormListData() {
      const paramData = this.getFormListRequestParam()

      this.$common.addCallApiNum()
      this.$api
        .downloadFormListData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const nowDate = this.$common.getFormatCurrentDate('YYYYMMDDhhmmss')

            this.$common.csvFileDownload(
              resData.data.csvData,
              `form_general_${nowDate}.csv`
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
     * フォームデータリスト取得,KPIフォームデータリストCSV取得APIのリクエストパラメータの取得
     */
    getFormListRequestParam() {
      const paramData = {}

      paramData.startDate = this.dateRangePicker.startDate
      paramData.endDate = this.dateRangePicker.endDate

      if (this.selectSortType.sort) {
        paramData.sort = this.selectSortType.sort
        paramData.order = this.selectSortType.order
      }

      return paramData
    },
    /**
     * グラフ表示データ用にデータを加工
     */
    getAggregationData() {
      const aggregationData = this.kpiData.aggregation
      const newAggregationData = {
        period: [],
        data: [],
      }

      if (aggregationData.length > 0) {
        for (let i = 0; i < aggregationData[0].data.length; i++) {
          newAggregationData.period.push(aggregationData[0].data[i].period)
        }
      }

      for (let i = 0; i < aggregationData.length; i++) {
        const addData = {
          name: '',
          value: [],
        }

        addData.name = aggregationData[i].name

        for (let j = 0; j < aggregationData[i].data.length; j++) {
          addData.value.push(aggregationData[i].data[j].value)
        }

        newAggregationData.data.push(addData)
      }

      return newAggregationData
    },
    /**
     * ソート反映処理
     */
    reflectSortFormTable() {
      this.getFormList()
    },
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(limit) {
      this.limit = limit
      this.offset = 1
      this.getFormList()
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.offset += 1
      this.getFormList()
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.offset -= 1
      this.getFormList()
    },
    /**
     * フォームテーブルのページング情報のリセット
     */
    resetPaging() {
      this.offset = 1
      this.limit = 20
    },
  },
  head() {
    return {
      title: 'ダッシュボード｜フォーム｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
/**
 * ヘッダー
 */
.header {
  display: flex;
  align-items: center;
  &-select {
    margin: 0 0 0 auto;
  }

  &-title {
    &-icon {
      position: relative;
      top: 3px;
      margin: 0 0 0 9px;
      fill: #3a435c;
      transform: rotate(30deg);
    }
  }
}

.kpi-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  &-card {
    width: calc(100% - 320px);
    display: flex;
    flex-wrap: wrap;
    &-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(50% - 9px);
      min-height: 136px;
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 1px 5px #00000029;
      border-radius: 6px;
      padding: 30px 16px 30px 32px;
      &:not(:nth-of-type(2n)) {
        margin-right: 16px;
      }
      &:not(:nth-of-type(5)) {
        margin-bottom: 16px;
      }
      .first-view {
        &-data {
          flex: 1;
          &-title {
            font-size: 17px;
            color: #1e1e1e;
          }
          &-text {
            margin: 2px 0 0 0;
            font-weight: bold;
            font-size: 28px;
            color: #1e1e1e;
          }
          &-rate {
            font-size: 13px;
            color: #8d8d8d;
          }
        }
        &-contrast {
          padding-left: 0.5em;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-left: auto;
        }
      }
    }
  }
  &-graph {
    width: 320px;
  }
}
.daily-chart {
  margin-top: 40px;
}
.form-list {
  .table-options {
    margin-top: 32px;
    .btn {
      border: 1px solid #e0e0e0;
      span {
        margin-left: 11px;
      }
    }
  }
  .table-area {
    margin-top: 16px;
  }
}
.tooltip {
  margin-left: 7px;
}
</style>
