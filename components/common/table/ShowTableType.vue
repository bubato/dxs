<template>
  <div class="show-table-type">
    <button
      :class="{ active: showTableType === 'table' }"
      @click="changeShowTableType('table')"
    >
      <FormatListBulletedSVG class="icon-formatListBulleted" />
    </button>
    <button
      :class="{ active: showTableType === 'list' }"
      @click="changeShowTableType('list')"
    >
      <AppsSVG class="icon-apps" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ShowTableType',
  props: {
    showTableType: { type: String, required: true, default: () => '' },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    changeShowTableType(type) {
      this.$emit('changeShowTableType', type)
    },
  },
}
</script>

<style lang="scss" scoped>
.show-table-type {
  display: flex;
  width: 94px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 47px;
    height: 30px;
    &.active,
    &:hover {
      background: #ebeced;
    }
    &.active svg {
      fill: #007aff;
    }
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
  }
}
</style>
