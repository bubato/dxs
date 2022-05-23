<template>
  <!-- eslint-disable vue/no-v-html -->
  <ul
    class="view-accordion"
    :class="[mixin_getSpaceClass(component.spaceInfo)]"
  >
    <li
      v-for="(accordion, index) in component.accordionList"
      :key="index"
      :class="[mixin_getTextAlignClass(accordion.align)]"
    >
      <input :checked="accordion.initOpen" type="checkbox" class="init-open" />
      <p class="title">
        {{ accordion.title }}
        <ExpandMoreSVG class="icon icon-more icon-expandMore" />
        <ExpandLessSVG class="icon icon-less icon-expandLess" />
      </p>
      <div class="accordion-block">
        <p v-html="accordion.text"></p>
      </div>
    </li>
  </ul>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewAccordion',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
