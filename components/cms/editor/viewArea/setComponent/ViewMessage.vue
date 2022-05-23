<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-message">
    <h1
      class="heading"
      :class="mixin_getTextAlignClass(component.title.align)"
      v-html="$common.replaceNewLineCode(component.title.context)"
    />
    <p
      class="text"
      :class="mixin_getTextAlignClass(component.text.align)"
      v-html="$common.replaceNewLineCode(component.text.context)"
    />
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewMessage',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
