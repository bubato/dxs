<template>
  <div>
    <div v-if="type == 1">
        <BarChartCustomChild :data="data1" isEndChart/>
    </div>
    <div v-if="type == 2">
        <BarChartCustomChild :data="data2"/>
        <BarChartCustomChild :data="data3" isEndChart/>
    </div>
    <div v-if="type == 3">
        <BarChartCustomChild :data="data4"/>
        <BarChartCustomChild :data="data4"/>
        <BarChartCustomChild :data="data5"/>
        <BarChartCustomChild :data="data6" isEndChart/>
    </div>
  </div>
</template>
<script>
export default {
    props: {
        type: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {
            data1: {
                height: 440,
                xAxis: {
                    categories: ['売上高 対人件費比率', '販売一般 管理比率', '総資本営業 利益率', '売上高経常 利益率', '売上高営業 利益率', '売上高経常 利益率', '売上高経常 利益率', '総資本経常 利益率'],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML:true,
                        style:{
                            width:'70px',
                            minWidth:'70px',
                        }
                    }
                },
                series: [{
                    name: '2021',
                    data: [133, 400,600,430,100,500,677,711],
                    color: '#4f7df0'
                }, {
                    name: '2020',
                    data: [814,1,45,76,43,222,77,890],
                    color: '#56b971'
                }, {
                    name: '2019',
                    data: [814,1,45,76,43,222,77,890],
                    color: '#f0ac4f'
                }]
            },
            data2: {
                height: 330,
                xAxis: {
                    categories: ['支払勘定 回転期間', '支払勘定 回転期間', '支払勘定 回転期間'],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML:true,
                        style:{
                            width:'70px',
                            minWidth:'70px',
                        }
                    }
                },
                series: [{
                    name: '2021',
                    data: [3, 5.7, 1],
                    color: '#4f7df0'
                }, {
                    name: '2020',
                    data: [3.5, 1.2, 3.2],
                    color: '#56b971'
                }, {
                    name: '2019',
                    data: [3, 1, 3],
                    color: '#f0ac4f'
                }]
            },
            data3: {
                xAxis: {
                    categories: ['支払勘定'],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML:true,
                        style:{
                            width:'70px',
                            minWidth:'70px',
                        }
                    }
                },
                series: [{
                    name: '2021',
                    data: [133],
                    color: '#4f7df0'
                }, {
                    name: '2020',
                    data: [814],
                    color: '#56b971'
                }, {
                    name: '2019',
                    data: [700],
                    color: '#f0ac4f'
                }]
            },
            data4: {
                tickInterval: 1000000,
                xAxis: {
                    categories: ['粗付加価値'],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML:true,
                        style:{
                            width:'70px',
                            minWidth:'70px',
                        }
                    },
                },
                series: [{
                    name: '2021',
                    data: [3000000],
                    color: '#4f7df0'
                }, {
                    name: '2020',
                    data: [4500000],
                    color: '#56b971'
                }, {
                    name: '2019',
                    data: [3500000],
                    color: '#f0ac4f'
                }]
            },
            data5: {
                min: -5,
                xAxis: {
                    categories: ['1人当り 粗付付加価格'],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML:true,
                        style:{
                            width:'70px',
                            minWidth:'70px',
                        }
                    }
                },
                series: [{
                    name: '2021',
                    data: [10],
                    color: '#4f7df0'
                }, {
                    name: '2020',
                    data: [-5],
                    color: '#56b971'
                }, {
                    name: '2019',
                    data: [19],
                    color: '#f0ac4f'
                }]
            },
            data6: {
                labels: {
                    overflow: 'justify',
                    formatter: function() {
                        return this.value + '%';
                    }
                },
                xAxis: {
                    categories: ['労働分配率'],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML:true,
                        style:{
                            width:'70px',
                            minWidth:'70px',
                        }
                    }
                },
                series: [{
                    name: '2021',
                    data: [55],
                    color: '#4f7df0'
                }, {
                    name: '2020',
                    data: [77],
                    color: '#56b971'
                }, {
                    name: '2019',
                    data: [71],
                    color: '#f0ac4f'
                }]
            },
        }
    }
}
</script>
