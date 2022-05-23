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
          type: 'column',
        },
        /**
         * クレジット
         */
        credits: {
          // 表示・非表示
          enabled: false,
        },
        /**
         * 凡例
         */
        legend: {
          // 表示位置
          verticalAlign: 'top',
          // 正円から正方形にする
          symbolRadius: 0,
          // シンボルの間隔
          symbolPadding: 5,
        },
        title: {
          text: 'Pareto Chart',
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          visible: false,
        },
        yAxis: [
          {
            title: {
              text: '収支',
            },
            labels: {
              format: '{value}円',
            },
          },
          {
            title: {
              text: '残高',
            },
            max: 100,
            min: 0,
            opposite: true,
            labels: {
              format: '{value}円',
            },
          },
        ],
        // 表示するデータ群
        series: [
          {
            type: 'column',
            name: '収入（実績）',
            data: [100, 200, 300, 400, 500],
            color: 'rgba(34,37,132,0.3)',
          },
          {
            type: 'column',
            name: '支出（実績）',
            data: [50, 100, 150, 200, 250],
          },
          {
            type: 'column',
            name: '収入（未決済）',
            data: [0, 100, 150, 200, 250],
          },
          {
            type: 'column',
            name: '支出（未決済）',
            data: [0, 100, 150, 200, 250],
          },
          {
            type: 'column',
            name: '収入（見込）',
            data: [0, 100, 150, 200, 250],
          },
          {
            type: 'column',
            name: '支出（見込）',
            data: [0, 100, 150, 200, 250],
          },
          {
            type: 'pareto',
            name: '残高',
            data: [100, 100, 150, 200, 250],
            color: 'black',
            marker: {
              fillColor: '#ffffff',
              lineColor: '#000000',
              lineWidth: 5,
              radius: 10,
            },
          },
        ],
      },
    }
  },
  computed: {
    arrayMax() {
      return (array) => {
        return array.reduce((a, b) => {
          return Math.max(a, b)
        })
      }
    },
    arrayMin() {
      return (array) => {
        return array.reduce((a, b) => {
          return Math.min(a, b)
        })
      }
    },
  },
  mounted() {},
}
</script>
