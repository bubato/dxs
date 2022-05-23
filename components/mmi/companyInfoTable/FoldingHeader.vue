<template>
  <td class="row-header">
    <div class="row-header-text">
      <a @click="onFoldIconClicked">
        <!-- <div class=""> -->
        <slot />
        <!-- </div> -->
        <ExpandLessSVG v-if="!isFolding" class="icon icon-expandLess" />
        <ExpandMoreSVG v-if="isFolding" class="icon icon-expandMore" />
      </a>
    </div>
  </td>
</template>

<script>
export default {
  name: 'FoldingHeader',
  props: {
    isFold: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFolding: this.isFold,
    }
  },
  methods: {
    onFoldIconClicked() {
      this.isFolding = !this.isFolding
      this.$emit('fold', this.isFolding)
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // height: 48px;
  // padding-left: 32px;
  position: relative;
  .icon {
    margin-right: 16px;
  }
}
</style>
