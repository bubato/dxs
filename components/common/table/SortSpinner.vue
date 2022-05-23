<template>
  <div class="sort">
    <button
      :class="[
        {
          'is-selected': currentType.sort === sortId,
          'is-asc': status === 0,
          'is-desc': status === 1,
        },
      ]"
      class="sortBtn"
      @click="sendSortType()"
    >
      <ExpandLessSVG class="icon icon-arrowDropUp" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'SortSpinner',
  props: {
    sortId: {
      type: String,
      default: '',
      required: false,
    },
    currentType: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      status: 0,
    }
  },
  computed: {},
  mounted() {},
  methods: {
    sendSortType() {
      this.status = this.status === 0 ? 1 : 0
      const sortData = {
        sort: this.sortId,
        order: this.status,
      }

      // 既に選択状態のアイコンを押下した場合は、処理をさせない
      if (
        this.currentType.sort === sortData.sort &&
        this.currentType.order === sortData.order
      ) {
        return
      }

      this.$emit('spinner-click', sortData)
    },
  },
}
</script>

<style lang="scss" scoped>
.sortBtn {
  position: absolute;
  height: 40px;
  top: 0;
  right: 8px;
  cursor: pointer;
  .icon {
    transform-origin: center center;
    transition: all 0.13s 0s ease-in-out;
    fill: #bfbfbf;
  }
  &.is-selected .icon {
    fill: #3a435c;
  }
  &.is-asc .icon {
    transform: rotate(0deg);
  }
  &.is-desc .icon {
    transform: rotate(-180deg);
  }
}
</style>
