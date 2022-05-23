<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="view-image"
    :style="{
      width: component.width ? component.width + 'px' : 'auto',
      'max-height': component.height ? component.height + 'px' : 'auto',
    }"
    :class="[mixin_getTextAlignClass(component.align)]"
  >
    <a
      v-if="component.link"
      v-bind="$common.getCmsEditorLinkAttr(component.link)"
      ><img
        :class="{ link: component.link }"
        :alt="component.alternateText"
        :src="component.image || $common.getAssetsImgUrl('images/no-image.png')"
        loading="lazy"
    /></a>
    <img
      v-else
      :class="{ link: component.link }"
      :alt="component.alternateText"
      :src="component.image || $common.getAssetsImgUrl('images/no-image.png')"
      loading="lazy"
    />
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'MailComponentViewImage',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
