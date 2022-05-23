<template>
  <ul class="select-image-align">
    <li :class="{ active: value === '1' }" @click="updateValue('1')">
      <FormatAlignLeftSVG class="icon icon-formatAlignLeft" />
    </li>
    <li :class="{ active: value === '2' }" @click="updateValue('2')">
      <FormatAlignRightSVG class="icon icon-formatAlignRight" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SelectImageAlign',
  props: {
    value: { type: String, required: true },
  },
  computed: {},
  methods: {
    updateValue(selectVal) {
      this.$emit('selectImageAlign', selectVal)
    },
  },
}
</script>

<style lang="scss" scoped>
.select-image-align {
  display: flex;
  width: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  li {
    width: calc(100% / 2);
    height: 40px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon {
      fill: #3a435c;
    }
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
