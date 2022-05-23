<template>
  <div>
    <div>{{ parcent }}</div>
    <div :class="['progress-bar-background']">
      <div :style="progress"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 80,
      required: false,
    },
  },
  computed: {
    parcent() {
      return `${this.percent}%`
    },
    progress() {
      const progress = (this.percent / 100) * 100
      return {
        border: '5px solid #5F76D6',
        'border-radius': '20px',
        width: progress + '%',
      }
    },
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.progress-bar {
  &-background {
    width: 100%;
    height: 10px;
    border-radius: 20px;
    background-color: lightgray;
  }
}
</style>
