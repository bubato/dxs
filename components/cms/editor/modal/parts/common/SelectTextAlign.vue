<template>
  <ul class="select-text-align">
    <li :class="{ active: value === '1' }" @click="updateValue('1')">
      <FormatAlignLeftSVG class="icon icon-formatAlignLeft" />
    </li>
    <li :class="{ active: value === '2' }" @click="updateValue('2')">
      <FormatAlignCenterSVG class="icon icon-formatAlignCenter" />
    </li>
    <li :class="{ active: value === '3' }" @click="updateValue('3')">
      <FormatAlignRightSVG class="icon icon-formatAlignRight" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SelectTextAlign',
  props: {
    value: { type: String, required: true },
    type: { type: String, required: true },
  },
  computed: {},
  methods: {
    updateValue(selectVal) {
      this.$emit('changeAlign', { selectVal, type: this.type })
    },
  },
}
</script>

<style lang="scss" scoped>
.select-text-align {
  display: flex;
  width: 120px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  li {
    width: calc((100% / 3) + 1px);
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    fill: #3a435c;
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
    &.active {
      background: #ebeced;
      .icon {
        fill: #007aff;
      }
    }
  }
}
</style>
