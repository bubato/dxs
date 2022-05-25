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
            polar: true,
            type: 'line'
        },

        spacing: [10, 10, 10, 10],

        title: {
            text: '',
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories: ['総資本経常利益率','売上高経常利益率','売上高営業利益率','総資産回転率','受取勘定回転期間','財務レバレッジ'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },

        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
        },

        series: [{
            name: '2021',
            type: 'area',
            data: [20, 10, 45, 33, 67, 80],
        }, {
            name: '2020',
            type: 'area',
            data: [50, 39, 23, 5, 77, 90],
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    pane: {
                        size: '70%'
                    }
                }
            }]
        }
      },
    }
  },
}
</script>
