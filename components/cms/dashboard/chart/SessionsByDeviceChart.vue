<template>
  <div class="sessions-device-chart">
    <HighchartsVue :options="chartOptions" />
  </div>
</template>

<style lang="scss" scoped>
.sessions-device-chart {
  width: 40%;
  padding: 32px 26px;
  background: #ffffff;
  border: #e5e5e5 1px solid;
  border-radius: 6px;
}
</style>

<script>
export default {
  name: 'SessionsByDeviceChart',
  props: {
    deviceData: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      sumSessionDeviceNum: 0,
      chartOptions: {
        /**
         * クレジットの表示
         */
        credits: {
          // 非表示にする
          enabled: false,
        },
        /**
         * チャートタイプ
         */
        chart: {
          type: 'pie',
        },
        /**
         * タイトル
         */
        title: {
          text: 'デバイス別訪問数',
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
          // 表示位置
          verticalAlign: 'bottom',
          // テキスト表示位置
          align: 'center',
          // マージントップ
          itemMarginTop: 10,
          // マージンボトム
          itemMarginBottom: 0,
          // 正円から正方形にする
          symbolRadius: 0,
          // シンボルの間隔
          symbolPadding: 5,
          // ラベルにデータを表示する
          labelFormat: '{name}: {y:.2f}%',
          itemStyle: {
            textAlign: 'right',
            color: '#1e1e1e',
            fontWeight: 'normal',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: '17px',
          },
        },
        /**
         * 描画オプション
         */
        plotOptions: {
          pie: {
            showInLegend: true,
            // 円グラフの内側のサイズ
            innerSize: '60%',
            // ラベルの表示・非表示
            dataLabels: {
              enabled: false,
            },
            // ボーダーを無くす
            borderWidth: 0,
          },
        },
        /**
         * 描画するデータ
         */
        series: [],
        /**
         * ツールチップ
         */
        tooltip: {
          enabled: true,
          pointFormat: '<b>{point.percentage:.2f}%</b>',
        },
      },
    }
  },
  watch: {
    deviceData() {
      this.setInitDeviceChart()
    },
  },
  created() {
    this.setInitDeviceChart()
  },
  methods: {
    setInitDeviceChart() {
      this.sumSessionDeviceNum =
        this.deviceData[0].value +
        this.deviceData[1].value +
        this.deviceData[2].value
      this.chartOptions.series = this.getSeriesData()
    },
    getSeriesData() {
      const valueRatio0 = this.getValueRatio(0)
      const valueRatio1 = this.getValueRatio(1)
      const valueRatio2 =
        Math.round(100 * (100 - (valueRatio0 + valueRatio1))) / 100

      const seriesData = [
        {
          data: [
            {
              name: this.deviceData[0].name,
              y: valueRatio0,
              color: '#4F7DF0',
            },
            {
              name: this.deviceData[1].name,
              y: valueRatio1,
              color: '#66A2FC',
            },
            {
              name: this.deviceData[2].name,
              y: valueRatio2,
              color: '#68CEF2',
            },
          ],
        },
      ]

      return seriesData
    },
    /**
     * 割合を取得
     */
    getValueRatio(index) {
      let valueRatio =
        100 * (this.deviceData[index].value / this.sumSessionDeviceNum)
      valueRatio = Math.round(valueRatio * 100) / 100

      return valueRatio
    },
  },
}
</script>
