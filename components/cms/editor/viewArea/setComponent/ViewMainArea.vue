<template>
  <div
    class="view-mainArea background"
    :style="{
      backgroundImage: component.backgroundImage
        ? `url(${component.backgroundImage})`
        : '',
    }"
    :class="{ 'background-image': component.backgroundImage }"
  >
    <div class="parts-contents">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="heading-text"
        :class="mixin_getTextColor(component.textColor)"
      >
        <h1
          class="heading"
          :class="mixin_getTextAlignClass(component.title.align)"
          v-html="component.title.context"
        ></h1>
        <p
          class="text"
          :class="mixin_getTextAlignClass(component.text.align)"
          v-html="component.text.context.replace(/\n/g, '<br/>')"
        ></p>
      </div>
      <div v-if="getShowButtons().length > 0" class="buttons">
        <template v-for="(button, index) in getShowButtons()">
          <a
            :key="index"
            class="btn btn-middle btn-basic"
            v-bind="$common.getCmsEditorLinkAttr(button.link)"
          >
            {{ button.text }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewMainArea',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {}
  },
  computed: {
    /**
     * 画面に表示させるボタンの取得
     */
    getShowButtons() {
      return () => {
        const showButtons = this.component.buttons.filter(
          (item) => item.text.length > 0
        )

        return showButtons
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.is-sp ul.view-components {
  .view-mainArea .buttons .btn {
    display: flex;
  }
}
</style>
