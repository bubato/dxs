<template>
  <div class="progress-bar-background">
    <div :style="progressValue"></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  computed: {
    progressValue() {
      const progress = (this.progress / 100) * 100
      return {
        display: this.progress === 0 ? 'none' : 'block',
        border: '6px solid #4F7DF0',
        'border-radius': '20px',
        width: progress + '%',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.progress-bar {
  &-background {
    width: 100%;
    height: 12px;
    border-radius: 20px;
    background-color: #e5ecfb;
  }
}
</style>
