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
                pointWidth: null
            },  
            series: {
                pointPadding: 0,
                borderWidth: 1,
                shadow: false,
            }
        },

        series: [{
            name: '売上原価',
            data: [1169409, null, null],
            stack: '2021'
        }, {
            name: '販売費',
            data: [46840, null, null],
            stack: '2021'
        }, {
            name: '人件費',
            data: [2627138, null, null],
            stack: '2021'
        }, {
            name: '一般管理費',
            data: [405844, null, null],
            stack: '2021'
        }, {
            name: 'その他営業外費',
            data: [17990, null, null],
            stack: '2021'
        }, {
            name: '特別損失',
            data: [49806, null, null],
            stack: '2021'
        }, {
            name: '法人税等',
            data: [19854, null, null],
            stack: '2021'
        }, {
            name: '純売上高',
            data: [4372, null, null],
            stack: '2020'
        }, {
            name: '営業外収益',
            data: [521575, null, null],
            stack: '2020'
        }, {
            name: '特別利益',
            data: [864756, null, null],
            stack: '2020'
        }, {
            name: '純売上高',
            data: [0, null, null],
            stack: '2020'
        }, {
            name: '特別利益',
            data: [2950550, null, null],
            stack: '2020'
        }, {
            name: '法人税等',
            data: [null, 4596029, null],
            stack: '2020'
        }, {
            name: '特別損失',
            data: [null, 710028, null],
            stack: '2020'
        }, {
            name: '特別利益',
            data: [null, 1027949, null],
            stack: '2020'
        }, {
            name: '特別損失',
            data: [null, 6334008, null],
            stack: '2020'
        }, {
            name: '特別利益',
            data: [null, null, 6668954],
            stack: '2020'
        }, {
            name: '法人税等',
            data: [null, null, 6785411],
            stack: '2020'
        }, {
            name: '特別損失',
            data: [null, null, 2456385],
            stack: '2019'
        }, {
            name: '特別利益',
            data: [null, null, 2546897],
            stack: '2019'
        }, {
            name: '特別損失',
            data: [null, null, 1235678],
            stack: '2019'
        }, {
            name: '特別損失',
            data: [null, 1235678, null],
            stack: '2019'
        }, {
            name: '特別利益',
            data: [null, 1235678, null],
            stack: '2019'
        }, {
            name: '特別損失',
            data: [null, 1235678, null],
            stack: '2019'
        }],
      },
    }
  },
}
</script>
