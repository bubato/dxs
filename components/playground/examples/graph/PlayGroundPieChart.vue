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
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: 'pie',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          point: {
            valueSuffix: '%',
          },
        },
        plotOptions: {
          pie: {
            animation: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          },
        },
        series: [
          {
            name: 'Brands',
            colorByPoint: true,
            data: [
              {
                name: 'Chrome',
                y: 61.41,
                sliced: true,
                selected: true,
              },
              {
                name: 'Internet Explorer',
                y: 11.84,
              },
              {
                name: 'Firefox',
                y: 10.85,
              },
              {
                name: 'Edge',
                y: 4.67,
              },
              {
                name: 'Safari',
                y: 4.18,
              },
              {
                name: 'Sogou Explorer',
                y: 1.64,
              },
              {
                name: 'Opera',
                y: 1.6,
              },
              {
                name: 'QQ',
                y: 1.2,
              },
              {
                name: 'Other',
                y: 2.61,
              },
            ],
          },
        ],
      },
    }
  },
}
</script>
