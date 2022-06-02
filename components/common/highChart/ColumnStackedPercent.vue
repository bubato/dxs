<template>
  <div>
    <HighchartsVue :options="chartOptions" />
  </div>
</template>
<script>
export default {
    props: {
        isPercent: {
            type: Boolean, 
            default: false
        }
    },
  data() {
    return {
      chartOptions: {
        chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['2021', '2020', '2019']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Total fruit consumption'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'percent',
            pointWidth: 60
        }
    },
    series: [{
        name: '期首棚卸高',
        data: [5, 3, 7]
    }, {
        name: '商品仕入',
        data: [2, 2, 0]
    }, {
        name: '材料費（変動）',
        data: [3, 4, 4]
    },{
        name: '外注費（変動）',
        data: [2, 2, 9]
    }, {
        name: '期末棚卸高',
        data: [3, 4, 6]
    }]
      },
    }
  },
}
</script>
