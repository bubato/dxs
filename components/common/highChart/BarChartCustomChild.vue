<template>
  <div>
    <HighchartsVue :options="chartOptions" />
  </div>
</template>
<script>
export default {
    props: {
      isEndChart: {
          type: Boolean,
          default: false
      },
      data: {
          type: Object
      }
    },
  data() {
    return {
      chartOptions: {
        chart: {
            type: 'bar',
            height: this.data.height || 90,
            marginBottom: 50
        },
        title: {
            text: ''
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: this.data.labels || {
                overflow: 'justify',
                formatter: function() {
                    return this.value;
                }
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                },
                pointWidth: 8
            },
        },
        legend: {
            enabled: this.isEndChart,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: -40,
            y: 20,
            floating: true,
            backgroundColor: '#FFFFFF',
        },
        credits: {
            enabled: false
        },
        xAxis: this.data.xAxis,
        series: this.data.series
      },
    }
  },
}
</script>
