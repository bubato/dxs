<template>
  <div class="chart">
    <div class="flex">
      <h4>日別レポート</h4>
      <!-- <CustomDateRangePicker
        class="ml-auto"
        :start-date=""
        :end-date=""
        @update="getDateRangeData($event)"
      /> -->
      <CustomDateRangePicker
        class="ml-auto"
        @update="getDateRangeData($event)"
      />
    </div>
    <div class="chart-daily-report">
      <select
        id=""
        v-model="contrastsSelected1"
        name=""
        class="chart-daily-report-select"
      >
        <option
          v-for="option in contrastsOptions1"
          :key="option.name"
          :value="option"
        >
          {{ option.name }}
        </option>
      </select>
      <span>対</span>
      <select
        id=""
        v-model="contrastsSelected2"
        name=""
        class="chart-daily-report-select"
      >
        <option
          v-for="option in contrastsOptions2"
          :key="option.name"
          :value="option"
        >
          {{ option.name }}
        </option>
      </select>
      <HighchartsVue ref="Highcharts" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import CustomDateRangePicker from '~/components/common/form/dateRangePicker/CustomDateRangePicker.vue'

export default {
  name: 'DailyReportChart',
  components: {
    CustomDateRangePicker,
  },
  props: {
    dailyReportData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    const contrastsOptions = [
      {
        name: '配信数',
        value: 'delivery',
      },
      {
        name: '開封数',
        value: 'opened',
      },
      {
        name: '流入数​',
        value: 'inflows',
      },
      {
        name: 'CV数​',
        value: 'cv',
      },
      {
        name: '配信エラー数',
        value: 'error',
      },
    ]

    return {
      dateRange: {},
      contrastsSelected1: { name: '配信数', value: 'delivery' },
      contrastsOptions1: [...contrastsOptions],
      contrastsSelected2: { name: '開封数', value: 'opened' },
      contrastsOptions2: [...contrastsOptions],
      chartOptions: {
        credits: {
          enabled: false,
        },
        chart: {
          type: 'spline',
        },
        title: {
          text: '',
          align: 'left',
          margin: 0,
          style: {
            color: '#1e1e1e',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: '20px',
          },
        },
        /**
         * 凡例
         */
        legend: {
          // 表示・非表示
          enabled: true,
          // 表示位置
          verticalAlign: 'top',
          // テキスト表示位置
          align: 'left',
          // マージントップ
          itemMarginTop: 0,
          // マージンボトム
          itemMarginBottom: 20,
          // 正円から正方形にする
          symbolRadius: 0,
          // シンボルの間隔
          symbolPadding: 5,
          // 開始位置
          x: -10,
        },
        // 表示範囲の指定
        xAxis: {
          categories: [],
          min: 0.5,
          max: 0,
        },
        yAxis: {
          title: {
            text: '',
          },
        },
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          areaspline: {
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true,
                },
              },
            },
          },
        },
        series: [
          {
            name: '',
            data: [],
            color: '#4F7DF0',
          },
          {
            name: '',
            data: [],
            color: '#66A2FC',
          },
        ],
      },
    }
  },
  computed: {
    /**
     * 表示するデータの日付を取得
     */
    getPeriod() {
      return Object.keys(this.dailyReportData)
    },

    /**
     * 日付別の同項目データを取得
     */
    getDataValues() {
      return (item) => {
        const target = Object.values(this.dailyReportData).map((data) => {
          return Object.values(data).filter((value) => {
            return value.name.match(item)
          })
        })
        return target.flat().map((obj) => obj.data)
      }
    },
  },
  watch: {
    contrastsSelected1: {
      handler(val) {
        const name = val.name
        this.chartOptions.series[0].name = name
        this.chartOptions.series[0].data = this.getDataValues(name)
      },
      deep: true,
    },
    contrastsSelected2: {
      handler(val) {
        const name = val.name
        this.chartOptions.series[1].name = name
        this.chartOptions.series[1].data = this.getDataValues(name)
      },
      deep: true,
    },
  },
  created() {
    // デフォルトの期間を設定（7日間）
    this.chartOptions.xAxis.categories = this.getPeriod
    this.chartOptions.xAxis.max = this.getPeriod.length - 1.5

    // デフォルトのセレクトボックスの値を設定
    this.chartOptions.series[0].name = this.contrastsSelected1.name
    this.chartOptions.series[1].name = this.contrastsSelected2.name

    // デフォルトで描画するデータ
    this.chartOptions.series[0].data = this.getDataValues(
      this.contrastsSelected1.name
    )
    this.chartOptions.series[1].data = this.getDataValues(
      this.contrastsSelected2.name
    )
  },
  methods: {
    getDateRangeData($event) {
      alert(
        `開始日:${$event.startDate} 終了日:${$event.endDate}をparamsにapi post`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  margin: 24px 0 0 0;
  &-daily-report {
    width: 100%;
    margin: 16px 0 0 0;
    padding: 32px 26px;
    background: #ffffff;
    box-shadow: 0px 1px 5px #d6d6d6;
    border-radius: 6px;
    &-control {
      display: flex;
      align-items: center;
      margin: 0 0 14px 0;
    }
    &-select {
      &:nth-of-type(1) {
        margin: 0 12px 0 10px;
      }
      &:nth-of-type(2) {
        margin: 0 0 0 12px;
      }
      width: auto;
      height: 32px;
      font-size: 13px;
      padding: 0 24px 0 12px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
  }
}
.ml-auto {
  margin-left: auto;
}
</style>
