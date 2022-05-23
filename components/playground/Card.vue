<template>
  <div class="max-w-4xl mt-10 mx-auto px-5">
    <div class="flex flex-wrap -mx-1 lg:-mx-4">
      <!-- Column -->
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <nuxt-link to="/examples/components/BarChart">
          <div class="border-2 border-gray-300 rounded-xl bg-white mr-5">
            <div class="p-5">
              <h1 class="text-2xl font-bold text-green-800 py-2">
                highchart sample bar
              </h1>
            </div>
          </div>
        </nuxt-link>
      </div>
      <!-- //Column -->
      <!-- Column -->
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <nuxt-link to="/examples/components/AreasplineChart">
          <div class="border-2 border-gray-300 rounded-xl bg-white mr-5">
            <div class="p-5">
              <h1 class="text-2xl font-bold text-green-800 py-2">
                highchart sample areaspline
              </h1>
            </div>
          </div>
        </nuxt-link>
      </div>
      <!-- //Column -->
      <!-- Column -->
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <nuxt-link to="/examples/components/ColumnChart">
          <div class="border-2 border-gray-300 rounded-xl bg-white mr-5">
            <div class="p-5">
              <h1 class="text-2xl font-bold text-green-800 py-2">
                highchart sample column
              </h1>
            </div>
          </div>
        </nuxt-link>
      </div>
      <!-- //Column -->
      <!-- Column -->
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <nuxt-link to="/examples/components/FunnelChart">
          <div class="border-2 border-gray-300 rounded-xl bg-white mr-5">
            <div class="p-5">
              <h1 class="text-2xl font-bold text-green-800 py-2">
                highchart sample funnel
              </h1>
            </div>
          </div>
        </nuxt-link>
      </div>
      <!-- //Column -->
      <!-- Column -->
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <nuxt-link to="/examples/components/PieChart">
          <div class="border-2 border-gray-300 rounded-xl bg-white mr-5">
            <div class="p-5">
              <h1 class="text-2xl font-bold text-green-800 py-2">
                highchart sample pie
              </h1>
            </div>
          </div>
        </nuxt-link>
      </div>
      <!-- //Column -->
      <!-- Column -->
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <nuxt-link to="/examples/components/BasicColumnChart">
          <div class="border-2 border-gray-300 rounded-xl bg-white mr-5">
            <div class="p-5">
              <h1 class="text-2xl font-bold text-green-800 py-2">
                highchart sample basic column
              </h1>
            </div>
          </div>
        </nuxt-link>
      </div>
      <!-- //Column -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    components: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
