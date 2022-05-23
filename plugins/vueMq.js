import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: {
    md: 896,
    lg: Infinity,
  },
  defaultBreakpoint: 'lg',
})
