<template>
  <div>
    <HighchartsVue ref="chart" :options="chartOptions" />
  </div>
</template>

<script>
export default {
  name: 'FunnelChart',
  props: {
    series: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      customLegend: 'null',
      chartOptions: {
        chart: {
          type: 'funnel',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: false,
              softConnector: true,
            },
          },
        },
        /**
         * 凡例
         */
        legend: {
          enabled: false,
          // 表示位置
          verticalAlign: 'middle',
          // テキスト表示位置
          align: 'left',
          // マージントップ
          itemMarginTop: 10,
          // マージンボトム
          itemMarginBottom: 0,
          // 正円から正方形にする
          symbolRadius: 0,
          // シンボルの間隔
          symbolPadding: 5,
          // 凡例のフォーマット
          labelFormatter() {
            return `${this.name}: ${this.yData}`
          },
          itemStyle: {
            textAlign: 'left',
            color: '#1e1e1e',
            fontWeight: 'normal',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: '17px',
          },
        },
        /**
         * 描画するデータ
         */
        series: this.series,
      },
    }
  },
  watch: {
    series: {
      handler(series) {
        this.chartOptions.series = series
      },
      deep: true,
    },
  },
  created() {},
}
</script>
