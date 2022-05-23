<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-step">
    <h2 class="heading">{{ component.heading }}</h2>
    <ul
      class="step-contents"
      :class="{
        horizon: component.layoutDirection === '1',
        vertical: component.layoutDirection === '2',
      }"
    >
      <li v-for="(step, index) in component.contents" :key="index">
        <div class="step-images">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="step-context">
          <h4 v-html="step.title.replace(/\n/g, '<br/>')"></h4>
          <p class="text" v-html="$common.replaceNewLineCode(step.text)" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ViewStep',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
