<template>
  <div class="view-button" :class="[mixin_getSpaceClass(component.spaceInfo)]">
    <a
      class="btn btn-basic"
      :class="getBlockAlignClass(component.align)"
      :style="{
        width: component.width ? component.width + 'px' : '150px',
        height: component.height ? component.height + 'px' : 'auto',
      }"
      v-bind="$common.getCmsEditorLinkAttr(component.link)"
      >{{ component.text }}</a
    >
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewButton',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {
    /**
     * テキスト位置を参照するクラスの取得
     *
     * @param {string} alignVal テキスト位置
     */
    getBlockAlignClass() {
      return (alignVal) => {
        let returnClassName = ''

        if (alignVal === '1') {
          returnClassName = 'block-align-left'
        } else if (alignVal === '2') {
          returnClassName = 'block-align-center'
        } else if (alignVal === '3') {
          returnClassName = 'block-align-right'
        }

        return returnClassName
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
