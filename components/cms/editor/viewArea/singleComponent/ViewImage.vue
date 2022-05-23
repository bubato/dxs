<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="view-image"
    :class="[
      mixin_getTextAlignClass(component.align),
      mixin_getSpaceClass(component.spaceInfo),
    ]"
  >
    <div
      :style="{
        width: component.width ? component.width + 'px' : 'auto',
        'max-height': component.height ? component.height + 'px' : 'auto',
      }"
    >
      <a
        v-if="component.link"
        v-bind="$common.getCmsEditorLinkAttr(component.link)"
        ><img
          :class="{ link: component.link }"
          :alt="component.alternateText"
          :src="
            component.image || $common.getAssetsImgUrl('images/no-image.png')
          "
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
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewImage',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
