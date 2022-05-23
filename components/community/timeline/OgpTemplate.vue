<template>
  <a class="ogp" :href="ogpData.url" target="_blank">
    <CancelSVG
      v-if="editComment"
      class="btn-close icon-cancel"
      @click.stop.prevent="deleteData()"
    />
    <div class="ogp-image" :style="imageSizeStyle">
      <img :src="imageUrl" class="ogp-imageElm" @error="addNoImage()" />
    </div>
    <div class="ogp-txt" :style="paddingSizeStyle">
      <p class="ogp-txt-title">{{ ogpData.title }}</p>
      <p
        :class="{ isNonDisplay: !isDescriptionDisplayCheck() }"
        class="ogp-txt-description"
      >
        {{ ogpData.description }}
      </p>
      <LinkSVG class="icon-link" /><span class="ogp-txt-url">{{
        hostname
      }}</span>
    </div>
  </a>
</template>

<script>
import communityCommonMixin from '~/mixin/community/communityCommon.js'
export default {
  name: 'OgpTemplate',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    ogpData: {
      type: Object,
      required: true,
    },
    editComment: {
      type: Boolean,
      default: true,
      required: false,
    },
    imageSize: {
      type: Object,
      default: () => ({
        pcSize: '140',
        spSize: '120',
      }),
      required: false,
    },
    isDescription: {
      type: Object,
      default: () => ({
        pc: true,
        sp: false,
      }),
      required: false,
    },
  },
  data() {
    return {
      hostname: '',
      imageUrl: '',
    }
  },
  computed: {
    imageSizeStyle() {
      if (this.$common.isSpSize()) {
        return `width:${this.imageSize.spSize}px;height:${this.imageSize.spSize}px;`
      } else {
        return `width:${this.imageSize.pcSize}px;height:${this.imageSize.pcSize}px;`
      }
    },
    paddingSizeStyle() {
      if (Number(this.imageSize.pcSize) <= 80) {
        // メッセージチャット等小さいサイズ
        return 'padding: 18px 12px'
      } else {
        return 'padding: 26px 16px'
      }
    },
  },
  watch: {},
  created() {},
  mounted() {
    if (this.ogpData.url) {
      const urlInfo = new URL(this.ogpData.url)

      if (urlInfo.hostname) {
        this.hostname = new URL(this.ogpData.url).hostname.replace('www.', '')
      }
    }

    this.imageUrl = this.getImagePath(this.ogpData.image)
  },
  methods: {
    addNoImage() {
      this.imageUrl = this.$common.getAssetsImgUrl('images/no-image.png')
    },
    /**
     * ディスクリプション表示の有無
     */
    isDescriptionDisplayCheck() {
      if (this.$common.isSpSize()) {
        return this.isDescription.sp
      } else {
        return this.isDescription.pc
      }
    },
    /**
     * 選択したOGPデータの削除
     */
    deleteData() {
      this.$emit('delete')
    },
    /**
     * 画像イメージのパスが、ルートパスの場合は絶対パスに置き換え
     *
     */
    getImagePath(path) {
      let imagePath = path
      if (!path.match(this.$globalVariable.regularExp.protocol)) {
        // httpを含まないため、ルートパス
        const origin = new URL(this.ogpData.url).origin
        const pathData = path.startsWith('/') ? path : '/' + path
        imagePath = origin + pathData
      }
      return imagePath
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
/*
テキストクリップ
基本設定。設定した高さより長くなった場合に文末以降が省略される
$line: クリップしたい行数
$lineHeight:クリップしたいテキストのline-height
*/
@mixin textClip($line: 1, $lineHeight: 1.4) {
  line-height: $lineHeight;
  max-height: $lineHeight * $line * 1em;
  overflow: hidden;
  position: relative;
  text-align: justify;
  text-overflow: ellipsis;

  &::before,
  &::after {
    /*IE用。疑似要素に除外設定*/
    content: '...';
    line-height: 1;
    position: absolute;
    right: 0;
    top: $line * 1em;
    -ms-wrap-flow: start;
  }
  &::after {
    background: currentColor;
    color: white;
    top: auto;
  }
  @supports (-webkit-line-clamp: $line) {
    /*モダンブラウザ用*/
    & {
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: $line;
      &::before,
      &::after {
        content: normal;
      }
    }
  }
}
.ogp {
  margin-top: 17px;
  margin-bottom: 17px;
  display: flex;
  border-radius: 6px;
  border: #e5e5e5 1px solid;
  background-color: #fff;
  position: relative;
  @include mq(pc) {
    margin: 20px;
  }
  @include mq(sp) {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
  .btn-close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 100;
    width: 16px;
    height: 16px;
  }
  &-image {
    // @include mq(pc) {
    //   width: 140px;
    //   height: 140px;
    // }
    // @include mq(sp) {
    //   width: 120px;
    //   height: 120px;
    // }
    border-right: #e5e5e5 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-imageElm {
    width: 100%;
    height: auto;
  }
  &-txt {
    .isMessageChat & {
      padding: 18px 12px;
    }
    flex: 1;
    &-title {
      font-size: 15px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      width: 100%;

      @include mq(pc) {
        @include textClip(1);
      }
      @include mq(sp) {
        @include textClip(2);
      }
    }
    &-description {
      &.isNonDisplay {
        display: none;
      }
      // @include mq(pc) {
      color: #8d8d8d;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      width: 100%;
      @include textClip(2);
      // }
      // @include mq(sp) {
      //   display: none;
      // }
    }
    .icon-link {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
    &-url {
      color: #8d8d8d;
    }
  }
}
// MQ
@include mq(sp) {
  .isSP {
    .timeline-field {
      position: static;
    }
    .timeline-publishing {
      position: absolute;
      top: 78px;
      right: 16px;
    }
  }
  .image img {
    width: 48px !important;
    height: 48px !important;
  }
  // SP表示かつ、SP表示投稿エリアではないとき
  .isTimeLine.timeline-field {
    display: none;
  }
}
// MQ
</style>
