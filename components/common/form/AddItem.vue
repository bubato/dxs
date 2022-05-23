<template>
  <div class="add-item-component" @click="addItem()">
    <AddCircleSVG class="icon-addCircle" />
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: 'AddItem',
  props: {
    label: {
      type: String,
      default: '項目を追加する',
      required: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    addItem() {
      this.$emit('addItem')
    },
  },
}
</script>

<style lang="scss" scoped>
.add-item-component {
  display: flex;
  align-items: center;
  height: 48px;
  background: #ffffff;
  cursor: pointer;
  .icon-addCircle {
    margin-right: 10px;
  }
}
</style>
