<template>
  <section>
    <div class="max-w-4xl mt-10 mx-auto px-5">
      <nuxt-link
        v-for="tag in getComponentsData"
        :key="tag.name"
        :to="`/examples/archive/${tag.slug}`"
      >
        <div
          class="mr-4 mb-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border"
        >
          <span class="pr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg> </span
          >{{ tag.name }}
        </div>
      </nuxt-link>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    tags: {
      type: Array,
      default: () => {
        return []
      },
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      getComponentsData: 'modules/fetch_components/getComponentsData',
    }),
  },
  created() {
    this.fetchComponentsData()
  },
  mounted() {},
  methods: {
    ...mapActions({
      fetchComponentsData: 'modules/fetch_components/fetchComponentsData',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
