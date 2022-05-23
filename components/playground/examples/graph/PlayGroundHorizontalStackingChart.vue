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
          type: 'bar',
        },
        title: {
          text: 'Horizontal Stacked bar chart',
        },
        tooltip: {
          enabled: false,
        },
        xAxis: {
          categories: [''],
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          labels: {
            enabled: false,
          },
        },
        legend: {
          reversed: true,
        },
        plotOptions: {
          series: {
            stacking: 'normal',
          },
        },
        series: [
          {
            name: 'hoge',
            data: [5],
          },
          {
            name: 'fuga',
            data: [2],
          },
        ],
      },
    }
  },
}
</script>
