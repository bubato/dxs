<template>
  <!-- eslint-disable vue/no-v-html -->
  <h4
    v-if="component.link"
    class="view-heading4"
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
  </h4>
  <h4
    v-else
    class="view-heading4"
    :class="[
      mixin_getTextAlignClass(component.align),
      mixin_getSpaceClass(component.spaceInfo),
      { link: component.link },
    ]"
    v-html="component.context.replace(/\n/g, '<br/>')"
  ></h4>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewHeading4',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
