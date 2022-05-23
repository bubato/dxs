<template>
  <div class="page-nav">
    <button
      class="btn"
      :class="{ 'btn-disabled': fromNum() === 1 }"
      @click="showPrevPage()"
    >
      <KeyboardArrowRightSVG class="icon-before icon-keyboardArrowRight" />
    </button>
    <p>
      <span>{{ fromNum() }}</span
      >-<span>{{ toNum() }}</span
      >件を表示
    </p>
    <button
      class="btn"
      :class="{ 'btn-disabled': toNum() === maxDataNum }"
      @click="showNextPage()"
    >
      <KeyboardArrowRightSVG class="icon-next icon-keyboardArrowRight" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'PageNav',
  props: {
    maxDataNum: { type: Number, required: true, default: () => null },
    settingShowNum: { type: Number, required: true, default: () => null },
    currentPage: { type: Number, required: true, default: () => null },
  },
  data() {
    return {}
  },
  computed: {
    fromNum() {
      return () => {
        return this.settingShowNum * this.currentPage - this.settingShowNum + 1
      }
    },
    toNum() {
      return () => {
        let toNum = this.settingShowNum * this.currentPage

        if (this.maxDataNum < toNum) {
          toNum = this.maxDataNum
        }

        return toNum
      }
    },
  },
  methods: {
    showPrevPage() {
      this.$emit('showPrevPage')
    },
    showNextPage() {
      this.$emit('showNextPage')
    },
  },
}
</script>

<style lang="scss" scoped>
.page-nav {
  display: flex;
  align-items: center;
  height: 32px;
  p {
    margin: 0 16px;
    span {
      display: inline-block;
      text-align: center;
    }
  }
  button {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    width: 32px;
    height: 32px;
    &.btn-disabled {
      background: #e0e0e0;
      .icon-before,
      .icon-next {
        fill: #b0b3be;
      }
    }
    .icon-before,
    .icon-next {
      width: 16px;
      height: 16px;
    }
    .icon-before {
      transform: scale(-1, 1);
    }
  }
}
</style>
