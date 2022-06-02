import Vue from 'vue'
import Highcharts from 'highcharts'
import HighchartsVue, { Chart } from 'highcharts-vue'
import HighchartsMore from 'highcharts-more'

import funnelInit from 'highcharts/modules/funnel'
import paretoInit from 'highcharts/modules/pareto'

// global options
Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ',',
  },
})

HighchartsMore(Highcharts)
Vue.use(HighchartsVue)

// コンポーネントとして扱う
Vue.component('HighchartsVue', Chart)

// モジュール拡張
funnelInit(Highcharts)
paretoInit(Highcharts)
