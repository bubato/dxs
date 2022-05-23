<template>
  <!-- eslint-disable vue/no-v-html -->
  <ul
    class="view-annotation"
    :class="[mixin_getSpaceClass(component.spaceInfo)]"
  >
    <li v-for="(annotation, index) in component.annotationList" :key="index">
      <span v-if="component.symbolType === '1'" class="symbol">※</span>
      <span v-if="component.symbolType === '2'" class="symbol">・</span>
      <span v-if="component.symbolType === '3'" class="symbol"
        >{{ index + 1 }}.</span
      >
      <span v-if="component.symbolType === '4'" class="symbol"
        >※{{ index + 1 }}.</span
      >
      <a
        v-if="annotation.link"
        class="link"
        v-bind="$common.getCmsEditorLinkAttr(annotation.link)"
        v-html="annotation.text.replace(/\n/g, '<br/>')"
      ></a>
      <p v-else v-html="annotation.text.replace(/\n/g, '<br/>')"></p>
    </li>
  </ul>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewAnnotation',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
