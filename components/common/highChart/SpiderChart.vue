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
            type: 'line',
            marginRight: 2,
        },

        title: {
            text: '',
        },

        pane: {
            size: '90%'
        },

        xAxis: {
            categories: ['総資本経常利益率','売上高経常利益率','売上高営業利益率','総資産回転率','総資産回転率','総資産回転率', '財務レバレッジ', '自己資本比率', '固定長期適合率', '1人当り売上高', '労働分配率', '1人当り粗付加価値'],
            tickmarkPlacement: 'on',
            lineWidth: 0,       
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            title: {
                text: '',
                align: 'high',
                reserveSpace: true
            },
            tickInterval: 20
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

        credits: {
            enabled: false
        },

        series: [{
            name: '青山商事',
            type: 'area',
            data: [20, 10, 45, 33, 67, 80, 20, 10, 45, 33, 67, 80],
            color: '#b9cbf9'
        }, {
            name: '農業',
            type: 'line',
            data: [50, 39, 23, 5, 77, 90, 20, 10, 45, 33, 67, 80],
            color: '#56b971'
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
