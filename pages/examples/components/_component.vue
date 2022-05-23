<template>
  <div class="max-w-4xl mt-10 mx-auto px-5">
    <component :is="matchComponents" />
    <div class="flex justify-end">
      <button
        class="mt-5 bg-blue-700 text-white border border-blue-700 font-bold py-2 px-6 rounded-lg"
        @click="prevPage"
      >
        戻る
      </button>
    </div>
  </div>
</template>

<script>
// チャート
// import PlayGroundBarChart from '~/components/playground/examples/graph/PlayGroundBarChart.vue'
// import PlayGroundStackingChart from '~/components/playground/examples/graph/PlayGroundStackingChart.vue'
// import PlayGroundHorizontalStackingChart from '~/components/playground/examples/graph/PlayGroundHorizontalStackingChart'
// import PlayGroundFunnelChart from '~/components/playground/examples/graph/PlayGroundFunnelChart.vue'
// import PlayGroundBasicAreaChart from '~/components/playground/examples/graph/PlayGroundBasicAreaChart.vue'
// import PlayGroundAreasplineChart from '~/components/playground/examples/graph/PlayGroundAreasplineChart.vue'
// import PlayGroundPieChart from '~/components/playground/examples/graph/PlayGroundPieChart.vue'
// import PlayGroundDonutChart from '~/components/playground/examples/graph/PlayGroundDonutChart.vue'
// import PlayGroundBasicColumnChart from '~/components/playground/examples/graph/PlayGroundBasicColumnChart.vue'
// import PlayGroundScatterPlotChart from '~/components/playground/examples/graph/PlayGroundScatterPlotChart.vue'
// import PlayGroundParetoChart from '~/components/playground/examples/graph/PlayGroundParetoChart.vue'

// エディタ
// import PlayGroundTextEditor from '~/components/playground/examples/editor/PlayGroundTextEditor.vue'
// import PlayGroundTinyMCE from '~/components/playground/examples/editor/PlayGroundTinyMCE'

// プログレス
// import PlayGroundProgressBar from '~/components/playground/examples/progress/PlayGroundProgressBar.vue'
// import PlayGroundProgressCircle from '~/components/playground/examples/progress/PlayGroundProgressCircle.vue'

export default {
  layout: 'playground',
  components: {
    // PlayGroundBarChart,
    // PlayGroundStackingChart,
    // PlayGroundHorizontalStackingChart,
    // PlayGroundFunnelChart,
    // PlayGroundBasicAreaChart,
    // PlayGroundAreasplineChart,
    // PlayGroundPieChart,
    // PlayGroundDonutChart,
    // PlayGroundBasicColumnChart,
    // PlayGroundScatterPlotChart,
    // PlayGroundParetoChart,
    // PlayGroundTextEditor,
    // PlayGroundTinyMCE,
    // PlayGroundProgressBar,
    // PlayGroundProgressCircle,
  },
  asyncData({ route, app }) {
    return {
      routeParams: route.params,
    }
  },
  computed: {
    matchComponents() {
      return (
        this.routeParams.component.charAt(0).toUpperCase() +
        this.routeParams.component.slice(1)
      )
    },
  },
  created() {},
  mounted() {},
  methods: {
    prevPage() {
      this.$router.go(-1)
    },
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
