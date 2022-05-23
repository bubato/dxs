<template>
  <div>
    <HighchartsVue :options="chartOptions" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'scatter',
          plotBorderWidth: 3, // グラフの囲い線の太さ
          marginTop: 6,
          marginBottom: 15,
          marginLeft: 35,
          marginRight: 10,
          zoomType: 'xy',
        },
        title: {
          text: '',
        },
        // マウスカーソルが当たった際のtooltipを非表示
        tooltip: {
          enabled: false, // カーソルを置いたときに吹き出しを表示しない
        },
        // "highcharts.com"というクレジットを消す
        credits: {
          enabled: false,
        },
        xAxis: {
          tickWidth: 0,
          title: {
            enabled: true,
            text: '　',
            margin: -25,
          },
          labels: {
            enabled: false,
            y: 13,
            formatter() {
              // 右端に(%)を表記
              if (this.value === '20') {
                return this.value + ' (％)'
              } else {
                return this.value + '%'
              }
            },
          },
          gridLineWidth: 1, // 縦線の太さ
          startOnTick: false,
          endOnTick: false,
          showFirstLabel: true,
          showLastLabel: true,
        },
        yAxis: {
          tickWidth: 0,
          title: {
            text: '　',
            margin: -10,
          },
          labels: {
            enabled: false,
            x: -5,
            formatter() {
              // 上部に(%)を表記
              if (this.value === '5') {
                return this.value + '%'
              } else {
                return this.value + '%'
              }
            },
          },
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)',
                },
              },
            },
            states: {
              hover: {
                marker: {
                  enabled: false,
                },
              },
            },
            tooltip: {
              enabled: true,
              headerFormat: '<b>{point.name}</b>',
              pointFormat: '{point.name2}',
            },

            dataLabels: {
              crop: false,
              overflow: 'justify',
              enabled: true,
              format: '{point.name}',
            },
            showInLegend: false,
            enableMouseTracking: false, // マウスカーソルが当たった際のpointerを非表示
            animation: false, // グラフ表示時のアニメーションOFF
          },
        },
        series: [
          {
            name: '',
            color: 'rgba(0, 0, 0, .5)',
            data: [
              { name: '', name2: '堅実型', x: 6.01, y: 3.11 },
              { name: '', name2: '安定型', x: 8.69, y: 3.88 },
              { name: '', name2: 'バランス型', x: 10.65, y: 4.36 },
              { name: '', name2: '成長型', x: 12.65, y: 5.06 },
              { name: '', name2: '積極型', x: 15.42, y: 5.84 },
            ],
          },
        ],
      },
    }
  },
}
</script>
