<template>
  <!-- eslint-disable vue/no-v-html -->
  <h3
    v-if="component.link"
    class="view-heading3"
    :class="[
      mixin_getTextAlignClass(component.align),
      { link: component.link },
    ]"
    :style="{ color: component.color }"
  >
    <a
      v-bind="$common.getCmsEditorLinkAttr(component.link)"
      v-html="component.context.replace(/\n/g, '<br/>')"
    ></a>
  </h3>
  <h3
    v-else
    class="view-heading3"
    :class="[
      mixin_getTextAlignClass(component.align),
      { link: component.link },
    ]"
    :style="{ color: component.color }"
    v-html="component.context.replace(/\n/g, '<br/>')"
  ></h3>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'MailComponentViewHeading3',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
