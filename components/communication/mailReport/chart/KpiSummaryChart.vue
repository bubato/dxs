<template>
  <div class="chart">
    <h4>KPIサマリー</h4>
    <div class="chart-kpi-summary">
      <FunnelChart :series="kpiSummaryData.number" />
      <HorizontalStackingChart :series="kpiSummaryData.status" />
    </div>
  </div>
</template>

<script>
import HorizontalStackingChart from '~/components/communication/mailReport/chart/HorizontalStackingChart.vue'

export default {
  name: 'KpiSummaryChart',
  components: {
    HorizontalStackingChart,
  },
  props: {
    kpiSummaryData: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.chart {
  margin: 24px 0 0 0;
  &-kpi-summary {
    display: flex;
    align-items: center;
    margin: 16px 0 0 0;
    & > * {
      width: calc(50% - 8px);
      padding: 32px 26px;
      background: #ffffff;
      box-shadow: 0px 1px 5px #d6d6d6;
      border-radius: 6px;
    }
    & > *:nth-of-type(1) {
      margin: 0 8px 0 0;
    }
    & > *:nth-of-type(2) {
      margin: 0 0 0 8px;
    }
  }
}
</style>
