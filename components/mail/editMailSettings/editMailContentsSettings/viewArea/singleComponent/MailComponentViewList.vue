<template>
  <!-- eslint-disable vue/no-v-html -->
  <ul class="view-list" :style="{ color: component.color }">
    <li v-for="(list, index) in component.list" :key="index">
      <span v-if="component.symbolType === '1'" class="symbol">・</span>
      <span v-if="component.symbolType === '2'" class="symbol"
        >{{ index + 1 }}.</span
      >
      <a
        v-if="list.link"
        class="link"
        v-bind="$common.getCmsEditorLinkAttr(list.link)"
        v-html="list.text.replace(/\n/g, '<br/>')"
      ></a>
      <p v-else v-html="list.text.replace(/\n/g, '<br/>')"></p>
    </li>
  </ul>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'MailComponentViewList',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
