<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="view-movie"
    :class="[mixin_getSpaceClass(component.spaceInfo)]"
    v-html="component.inputTag"
  ></div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewMovie',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
