<template>
  <div class="attracting-customers-chart">
    <HighchartsVue :options="chartOptions" />
  </div>
</template>

<style lang="scss" scoped>
.attracting-customers-chart {
  width: calc(60% - 16px);
  margin: 0 16px 0 0;
  padding: 32px 26px;
  background: #ffffff;
  border-radius: 6px;
  border: #e5e5e5 1px solid;
}
</style>

<script>
export default {
  name: 'AttractingCustomersChart',
  props: {
    chartData: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      chartOptions: {
        credits: {
          enabled: false,
        },
        chart: {
          type: 'bar',
        },
        title: {
          text: '流入元',
          align: 'left',
          style: {
            color: '#1e1e1e',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: '20px',
            letterSpacing: '0px',
            fontWeight: 'bold',
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
          align: 'right',
          // マージントップ
          itemMarginTop: -50,
          // マージンボトム
          itemMarginBottom: 20,
          // 正円から正方形にする
          symbolRadius: 0,
          // シンボルの間隔
          symbolPadding: 5,
        },
        xAxis: {
          categories: [],
          title: {
            text: '',
          },
          labels: {
            style: {
              color: '#1e1e1e',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontSize: '13px',
              letterSpacing: '0px',
            },
          },
        },
        yAxis: {
          min: 0,
          // seriesの最大値を取得する
          max: null,
          title: {
            text: '',
          },
          labels: {},
        },
        series: [],
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            // グラフに文字を積み重ねる
            stacking: 'normal',
            // アニメーション
            animation: true,
            // 凡例のマーカーの色
            color: '#4F7DF0',
          },
          series: {
            dataLabels: {
              enabled: true,
              crop: false,
              // 描画されるデータの表示形式
              format: '{point.y:,.0f}',
              style: {
                color: '#ffffff',
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 'normal',
                fontSize: '12px',
                letterSpacing: '1px',
                textOutline: false,
              },
            },
          },
        },
      },
    }
  },
  computed: {
    getMaxValue() {
      return (a, b) => {
        return Math.max(a, b)
      }
    },
    getCategories() {
      return this.chartData.map((data) => data.name)
    },
    getSeries() {
      const data = this.chartData.map((data) => {
        return {
          name: data.name,
          y: data.value,
          color: '#4F7DF0',
        }
      })
      return [
        {
          name: '訪問数',
          data,
        },
      ]
    },
    getSeriesValue() {
      return this.getSeries[0].data.map(({ y }) => y)
    },
  },
  watch: {
    chartData() {
      this.setInitAttractingCustomersChart()
    },
  },
  created() {
    this.setInitAttractingCustomersChart()
  },
  mounted() {},
  methods: {
    setInitAttractingCustomersChart() {
      this.chartOptions.xAxis.categories = this.getCategories
      this.chartOptions.series = this.getSeries
      this.chartOptions.yAxis.max = this.getSeriesValue.reduce(this.getMaxValue)
    },
  },
}
</script>
