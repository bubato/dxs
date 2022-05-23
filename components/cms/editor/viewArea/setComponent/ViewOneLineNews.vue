<template>
  <div class="view-oneLineNews">
    <div class="news">
      <span class="date">{{ component.date }}</span>
      <span class="label">{{ component.label }}</span>
      <a
        v-if="component.link"
        class="title link"
        v-bind="$common.getCmsEditorLinkAttr(component.link)"
        >{{ component.title }}</a
      >
      <p v-else class="title">{{ component.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewOneLineNews',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
