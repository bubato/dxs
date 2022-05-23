<template>
  <div class="flex flex-col items-center">
    <nav>
      <nuxt-link to="/playground/"><Logo /></nuxt-link>
    </nav>
    <div class="flex flex-col items-center mt-4">
      <nuxt-link to="/">DSXテストページへ</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: '',
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
