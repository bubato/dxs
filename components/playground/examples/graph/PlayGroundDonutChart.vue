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
        credits: {
          enabled: false,
        },
        chart: {
          // どんなタイプのグラフを表示させるか
          type: 'pie',
        },
        title: {
          // グラフのタイトル
          text: 'Donut Chart',
          align: 'center',
          verticalAlign: 'middle',
        },
        plotOptions: {
          pie: {
            // 円グラフの内側のサイズ
            innerSize: '60%',
            // ラベルの表示・非表示
            dataLabels: {
              enabled: false,
            },
          },
        },
        // 表示させるデータ。
        series: [
          {
            name: '進捗',
            data: [
              ['progress', 25],
              ['remaining', 75],
            ],
          },
        ],
        // カーソルを置いたときに吹き出しを表示しない
        tooltip: {
          enabled: false,
        },
      },
    }
  },
}
</script>
