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
            type: 'bar',
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['負債', '流動負債', '買掛金および 支払手形', 'その他の流動負債', '固定負債', '純資産', '自己資本', '少数株主持分など'],
            title: {
                enabled: false
            },
            labels: {
                overflow: 'justify',
                enabled: true,
                style:{
                    width:'30px',
                },
            },
        },
        yAxis: {
            min: -70,
            labels: {
                overflow: 'justify',
                enabled: true,
                formatter: function () {
                    return this.value + '';
                }
            },
            title: {
                text: '',
                align: 'high'
            },
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                },
                pointWidth: 10
            },
        },
        legend: {
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
        series: [{
            name: '2020',
            data: [133, 156, 947, 408, 60, 100, 300, 100],
            color: '#56b971'
        }, {
            name: '2019',
            data: [814, 841, 3714, 727, -31, -65, -450, 910],
            color: '#4f7df0'
        },{
            name: '2018',
            data: [666, 555, 666, 333, 999, 99, 50, 10],
            color: '#f0ac4f'
        }]
      },
    }
  },
}
</script>
