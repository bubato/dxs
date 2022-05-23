<template>
  <div>
    <HighchartsVue :options="chartOptions" />
  </div>
</template>

<script>
export default {
  name: 'HorizontalStackingChart',
  props: {
    series: {
      type: Array,
      default: () => [],
      required: true,
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
          text: '',
        },
        tooltip: {
          enabled: false,
        },
        xAxis: {
          title: {
            text: '',
          },
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          title: {
            text: '',
          },
          min: 0,
          labels: {
            enabled: true,
          },
        },
        /**
         * 凡例
         */
        legend: {
          // 表示位置
          verticalAlign: 'top',
          // テキスト表示位置
          align: 'left',
          // マージントップ
          itemMarginTop: 0,
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
          // スタイル調整
          itemStyle: {
            textAlign: 'left',
            color: '#1e1e1e',
            fontWeight: 'normal',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: '15px',
          },
          // 開始位置
          x: 0,
        },
        plotOptions: {
          series: {
            // グラフの幅調整
            pointWidth: 56,
            // 積み重ねる
            stacking: true,
          },
        },
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
}
</script>
