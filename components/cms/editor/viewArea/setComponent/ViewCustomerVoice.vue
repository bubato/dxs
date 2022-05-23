<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-customer-voice">
    <h2
      class="heading"
      :class="[mixin_getTextAlignClass(component.heading.align)]"
    >
      {{ component.heading.context }}
    </h2>
    <ul
      class="contents"
      :class="{
        horizon: component.layoutDirection === '1',
        vertical: component.layoutDirection === '2',
        'horizon-layout-2':
          component.layoutDirection === '1' && component.layoutType === '1',
        'horizon-layout-3':
          component.layoutDirection === '1' && component.layoutType === '2',
        'horizon-layout-4':
          component.layoutDirection === '1' && component.layoutType === '3',
        'vertical-layout-1':
          component.layoutDirection === '2' && component.layoutType === '1',
        'vertical-layout-2':
          component.layoutDirection === '2' && component.layoutType === '2',
      }"
    >
      <li v-for="(customer, index) in component.contents" :key="index">
        <template v-if="customer.link">
          <a
            v-bind="$common.getCmsEditorLinkAttr(customer.link)"
            class="image-link"
          >
            <div class="image">
              <img
                :src="
                  customer.image ||
                  $common.getAssetsImgUrl('images/no-image.png')
                "
                loading="lazy"
              />
            </div>
            <div class="context">
              <h4 v-html="customer.title.replace(/\n/g, '<br/>')"></h4>
              <p
                class="text"
                v-html="$common.replaceNewLineCode(customer.text)"
              />
            </div>
          </a>
        </template>
        <template v-else>
          <div class="image">
            <img
              :src="
                customer.image || $common.getAssetsImgUrl('images/no-image.png')
              "
              loading="lazy"
            />
          </div>
          <div class="context">
            <h4 v-html="customer.title.replace(/\n/g, '<br/>')"></h4>
            <p
              class="text"
              v-html="$common.replaceNewLineCode(customer.text)"
            />
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewCustomerVoice',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
