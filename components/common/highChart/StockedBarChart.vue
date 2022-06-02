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
            categories: ['青山商事', '農業']
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y;
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                stacking: this.isPercent ? 'percent' : 'normal',
                pointWidth: 60
            },  
            series: {
                pointPadding: 0,
                borderWidth: 1,
                shadow: false,
            }
        },

        series: [{
            name: '売上原価',
            data: [1169409, null],
            stack: 'Credit'
        }, {
            name: '販売費',
            data: [46840, null],
            stack: 'Credit'
        }, {
            name: '人件費',
            data: [2627138, null],
            stack: 'Credit'
        }, {
            name: '一般管理費',
            data: [405844, null],
            stack: 'Credit'
        }, {
            name: 'その他営業外費',
            data: [17990, null],
            stack: 'Credit'
        }, {
            name: '特別損失',
            data: [49806, null],
            stack: 'Credit'
        }, {
            name: '法人税等',
            data: [19854, null],
            stack: 'Credit'
        }, {
            name: '純売上高',
            data: [4372, null],
            stack: 'Dedit'
        }, {
            name: '営業外収益',
            data: [521575, null],
            stack: 'Dedit'
        }, {
            name: '特別利益',
            data: [864756, null],
            stack: 'Dedit'
        }, {
            name: '純売上高',
            data: [0, null],
            stack: 'Dedit'
        }, {
            name: '特別利益',
            data: [2950550, null],
            stack: 'Dedit'
        }, {
            name: '法人税等',
            data: [null, 4596029],
            stack: 'Credit'
        }, {
            name: '特別損失',
            data: [null, 710028],
            stack: 'Credit'
        }, {
            name: '特別利益',
            data: [null, 1027949],
            stack: 'Credit'
        }, {
            name: '特別損失',
            data: [null, 6334008],
            stack: 'Dedit'
        }],
      },
    }
  },
}
</script>
