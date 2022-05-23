<template>
  <div class="to-back link-text" @click="exeBackScreen()">
    <KeyboardArrowRightSVG class="icon-keyboardArrowRight" />
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: 'ToBackScreenLink',
  props: {
    label: { type: String, required: true, default: '' },
    link: { type: String, required: false, default: '' },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    /**
     * リンク押下処理
     */
    exeBackScreen() {
      if (this.link) {
        this.$router.push(this.link)
      } else {
        this.$emit('click')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.to-back {
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon-keyboardArrowRight {
    fill: #007aff;
    transform: scale(-1, 1);
  }
  p {
    height: 24px;
  }
}
</style>
