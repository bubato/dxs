<template>
  <!-- bizskyDXジャーナル -->
  <div class="c-bizskyDX">
    <h2 class="l-main-navi">bizskyDXジャーナル</h2>
    <div class="c-bizskyDX-list">
      <swiper ref="swiper" :options="swiperOption">
        <swiper-slide
          v-for="item in bizskyJournalData"
          :key="item.id"
          class="c-bizskyDX-list-cell"
        >
          <a
            :href="`${item.url}`"
            class="c-bizskyDX-list-cell-link"
            target="_blank"
          >
            <div
              :style="{ backgroundImage: `url(${item.thumbnailUrl})` }"
              class="c-bizskyDX-list-cell-image"
            ></div>
            <div class="c-bizskyDX-list-cell-inner">
              <p class="c-bizskyDX-list-cell-day">{{ item.date }}</p>
              <p v-if="item.type.label !== ''" class="c-bizskyDX-list-cell-tag">
                {{ item.type.label }}
              </p>
              <p
                class="c-bizskyDX-list-cell-text"
                :class="{ noTagData: item.type.label === '' }"
              >
                {{ item.title }}
              </p>
            </div>
          </a>
        </swiper-slide>
      </swiper>
      <div class="c-bizskyDX-list-btn">
        <ArrowLeft
          ref="swiperButtonPrev"
          slot="button-prev"
          class="c-bizskyDX-list-prevBtn icon-arrowLeft"
        />
        <ArrowRight
          ref="swiperButtonNext"
          slot="button-next"
          class="c-bizskyDX-list-nextBtn icon-arrowRight"
        />
      </div>
    </div>
  </div>
  <!-- /bizskyDXジャーナル -->
</template>

<script>
export default {
  layout: 'servicelauncher',
  components: {},
  props: {
    bizskyJournalData: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      swiperOption: {
        loop: true, // 無限ループ
        slidesPerView: 'auto', // スライダーカード表示枚数
        spaceBetween: 18, // スライダーカード間マージン
        centeredSlides: true, // スライダーを中央表示
        initialSlide: 2, // 初期表示スライド設定（データ取得時に再設定）
        navigation: {
          nextEl: '.c-bizskyDX-list-nextBtn', // 前へ・次へのナビ設定
          prevEl: '.c-bizskyDX-list-prevBtn',
        },
        breakpoints: {
          1046: {
            initialSlide: 1, // 初期表示スライド設定（データ取得時に再設定）
          },
          700: {
            initialSlide: 0, // 初期表示スライド設定（データ取得時に再設定）
          },
        },
      },
    }
  },
  computed: {
    swiper() {
      return this.$refs.swiper.$swiper
    },
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.l-main-navi {
  max-width: 1046px;
  margin: 40px auto 13px;
  h2 {
    margin-bottom: 24px;
  }
}
.c-bizskyDX {
  &-list {
    overflow: hidden;
    display: flex;
    position: relative;
    &-btn {
      pointer-events: none;
      position: absolute;
      top: 0;
      height: 285px;
      max-width: 1046px;
      margin: 0 auto;
      width: 100%;
      left: 0;
      right: 0;
      &:before {
        pointer-events: auto;
        content: '';
        width: 3000px;
        height: 100%;
        background: rgba(255, 255, 255, 0.56);
        display: block;
        left: -3020px;
        position: absolute;
        z-index: 10;
        @media screen and (max-width: 1046px) {
          display: none;
        }
      }
      &:after {
        pointer-events: auto;
        content: '';
        width: 3000px;
        height: 100%;
        background: rgba(255, 255, 255, 0.56);
        display: block;
        right: -3010px;
        position: absolute;
        z-index: 10;
        @media screen and (max-width: 1046px) {
          display: none;
        }
      }
    }
    &-prevBtn {
      cursor: pointer;
      pointer-events: auto;
      position: absolute;
      left: -43px;
      top: calc(50% - 20px);
      z-index: 100;
      @media screen and (max-width: 1046px) {
        left: 0;
      }
    }
    &-nextBtn {
      cursor: pointer;
      pointer-events: auto;
      position: absolute;
      right: -43px;
      top: calc(50% - 20px);
      z-index: 100;
      @media screen and (max-width: 1046px) {
        right: 0;
      }
    }
    &-cell {
      width: 196px;
      height: (261+12+12) px;
      padding-top: 12px;
      padding-bottom: 12px;
      // &.swiper-slide-active {
      //   padding-top: 0;
      //   padding-bottom: 0;
      //   width: 212px;
      //   .c-bizskyDX-list-cell-link {
      //     width: 100%;
      //     height: 100%;
      //   }
      //   .c-bizskyDX-list-cell-image {
      //     height: 119px;
      //   }
      // }
      &-link {
        width: 196px;
        height: 270px;
        transition: all 0.3s ease-in-out;
        display: block;
        border: #e5e5e5 1px solid;
        &:hover {
          background: #f8f9fa;
        }
      }
      &-inner {
        padding: 16px;
      }
      &-image {
        width: 100%;
        height: 109px;
        background-size: cover;
        background-position: center center;
      }
      &-day {
        color: #8a8a8e;
        font-size: 13px;
        margin-bottom: 9px;
      }
      &-tag {
        display: inline-block;
        color: #4f7df0;
        border: #4f7df0 1px solid;
        font-size: 12px;
        padding: 3px 8px;
        margin-bottom: 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        background-color: #fff;
      }
      &-text {
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        &.noTagData {
          margin-top: 46px;
        }
      }
    }
  }
}
.swiper-wrapper {
  width: 1366px !important;
  margin: 0px auto !important;
}
.icon-error {
  height: 20px;
  width: 20px;
  fill: #fff;
  margin-right: 4px;
}
.is-disabled {
  visibility: hidden;
}
</style>
