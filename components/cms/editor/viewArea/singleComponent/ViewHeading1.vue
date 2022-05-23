<template>
  <!-- eslint-disable vue/no-v-html -->
  <h1
    v-if="component.link"
    class="view-heading1"
    :class="[
      mixin_getTextAlignClass(component.align),
      mixin_getSpaceClass(component.spaceInfo),
      { link: component.link },
    ]"
  >
    <a
      v-bind="$common.getCmsEditorLinkAttr(component.link)"
      v-html="component.context.replace(/\n/g, '<br/>')"
    ></a>
  </h1>
  <h1
    v-else
    class="view-heading1"
    :class="[
      mixin_getTextAlignClass(component.align),
      mixin_getSpaceClass(component.spaceInfo),
      { link: component.link },
    ]"
    v-html="component.context.replace(/\n/g, '<br/>')"
  ></h1>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewHeading1',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
