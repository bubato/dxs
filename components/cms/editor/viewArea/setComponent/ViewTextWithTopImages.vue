<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-textWithTopImages">
    <h2 class="heading">{{ component.heading }}</h2>
    <div class="contents">
      <div
        v-for="(imageInfo, index) in component.images"
        :key="index"
        class="images"
        :class="[
          { 'layout-2': component.layoutType === '1' },
          { 'layout-3': component.layoutType === '2' },
          { 'layout-4': component.layoutType === '3' },
          { link: imageInfo.link },
        ]"
      >
        <a
          v-if="imageInfo.link"
          v-bind="$common.getCmsEditorLinkAttr(imageInfo.link)"
          ><div class="images-block">
            <div class="images-img">
              <span
                :style="{
                  backgroundImage: `url(${
                    imageInfo.image ||
                    $common.getAssetsImgUrl('images/no-image.png')
                  })`,
                }"
              ></span>
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
            </div></div
        ></a>
        <div v-else class="images-block">
          <div class="images-img">
            <span
              :style="{
                backgroundImage: `url(${
                  imageInfo.image ||
                  $common.getAssetsImgUrl('images/no-image.png')
                })`,
              }"
            ></span>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewTextWithTopImages',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
