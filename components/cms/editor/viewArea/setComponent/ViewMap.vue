<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-map" v-html="component.inputTag"></div>
</template>

<script>
export default {
  name: 'ViewMap',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.view-map {
  .text {
    margin-top: 20px;
  }
}
</style>
