<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-textWithLeftAndRightImages">
    <h2 class="heading">{{ component.heading }}</h2>
    <div class="contents flex">
      <div
        v-for="(imageInfo, index) in component.images"
        :key="index"
        class="images"
        :class="[
          { 'layout-1': component.layoutType === '1' },
          { 'layout-2': component.layoutType === '2' },
        ]"
      >
        <div
          v-if="imageInfo.imageAlign === '1'"
          :class="{ link: imageInfo.link }"
        >
          <a
            v-if="imageInfo.link"
            v-bind="$common.getCmsEditorLinkAttr(imageInfo.link)"
            class="image-left"
            ><div class="images-img">
              <img
                :src="
                  imageInfo.image ||
                  $common.getAssetsImgUrl('images/no-image.png')
                "
                loading="lazy"
              />
            </div>
            <div class="image-title">
              <h3
                class="title"
                v-html="$common.replaceNewLineCode(imageInfo.title)"
              />
              <p
                class="text"
                v-html="$common.replaceNewLineCode(imageInfo.text)"
              />
            </div>
          </a>
          <div v-else class="image-left">
            <div class="images-img">
              <img
                :src="
                  imageInfo.image ||
                  $common.getAssetsImgUrl('images/no-image.png')
                "
                loading="lazy"
              />
            </div>
            <div class="image-title">
              <h3
                class="title"
                v-html="$common.replaceNewLineCode(imageInfo.title)"
              />
              <p
                class="text"
                v-html="$common.replaceNewLineCode(imageInfo.text)"
              />
            </div>
          </div>
        </div>
        <div
          v-if="imageInfo.imageAlign === '2'"
          :class="{ link: imageInfo.link }"
        >
          <a
            v-if="imageInfo.link"
            v-bind="$common.getCmsEditorLinkAttr(imageInfo.link)"
            class="image-right"
            ><div class="image-title">
              <h3
                class="title"
                v-html="$common.replaceNewLineCode(imageInfo.title)"
              />
              <p
                class="text"
                v-html="$common.replaceNewLineCode(imageInfo.text)"
              />
            </div>
            <div class="images-img">
              <img
                :src="
                  imageInfo.image ||
                  $common.getAssetsImgUrl('images/no-image.png')
                "
                loading="lazy"
              />
            </div>
          </a>
          <div v-else class="image-right">
            <div class="image-title">
              <h3
                class="title"
                v-html="$common.replaceNewLineCode(imageInfo.title)"
              />
              <p
                class="text"
                v-html="$common.replaceNewLineCode(imageInfo.text)"
              />
            </div>
            <div class="images-img">
              <img
                :src="
                  imageInfo.image ||
                  $common.getAssetsImgUrl('images/no-image.png')
                "
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewTextWithLeftAndRightImages',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
