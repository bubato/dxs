<template>
  <div class="color-list">
    <label
      v-for="(color, index) in colorList"
      :key="index"
      :style="{ background: color.color }"
      class="color"
      :class="{ selected: colorValue === color.id }"
    >
      <input v-model="colorValue" type="radio" :value="color.id" />
      <CheckSVG v-if="colorValue === color.id" class="icon icon-check" />
    </label>
  </div>
</template>

<script>
export default {
  name: 'ColorList',
  props: {
    colorList: { type: Array, required: true, default: () => [] },
    colorId: { type: String, required: false, default: '' },
  },
  data() {
    return {}
  },
  computed: {
    colorValue: {
      get() {
        return this.colorId
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.color-list {
  width: 588px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 2px;
  .color {
    width: 48px;
    height: 48px;
    position: relative;
    border-radius: 6px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
    &:nth-child(-n + 10) {
      margin-bottom: 12px;
    }
    &:not(:nth-of-type(10n)) {
      margin-right: 12px;
    }
    &.selected {
      box-shadow: 0px 0px 3px 1px #007aff;
      border-radius: 8px;
    }
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      fill: #ffffff;
    }
    input {
      display: none;
    }
  }
}
</style>
