<template>
  <!-- eslint-disable vue/no-v-html -->
  <p
    v-if="component.link"
    class="view-text"
    :class="[mixin_getTextAlignClass(component.align)]"
    :style="{ color: component.color }"
  >
    <a
      v-bind="$common.getCmsEditorLinkAttr(component.link)"
      v-html="component.context.replace(/\n/g, '<br/>')"
    ></a>
  </p>
  <p
    v-else
    class="view-text"
    :class="[mixin_getTextAlignClass(component.align)]"
    :style="{ color: component.color }"
    v-html="component.context.replace(/\n/g, '<br/>')"
  ></p>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'MailComponentViewText',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
