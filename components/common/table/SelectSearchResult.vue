<template>
  <div class="select-search-result">
    <button
      :class="{
        active: selectSearchResultType === 'all',
        btnDisabled: checkDisabled('all'),
      }"
      @click="changeSelectSearchResult('all')"
    >
      すべて<span class="number"
        >({{ $common.commaSeparate(searchResultAll) }})</span
      >
    </button>
    <button
      :class="{
        active: selectSearchResultType === 'filter',
        btnDisabled: checkDisabled('filter'),
      }"
      @click="changeSelectSearchResult('filter')"
    >
      検索結果<span class="number"
        >({{ $common.commaSeparate(searchResultFilter) }})</span
      >
    </button>
  </div>
</template>

<script>
export default {
  name: 'SelectSearchResult',
  props: {
    selectSearchResultType: { type: String, required: true, default: () => '' },
    searchResultAll: { type: Number, required: true, default: () => 0 },
    searchResultFilter: { type: Number, required: true, default: () => 0 },
    disabledBtnNameList: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    changeSelectSearchResult(selectSearchResultType) {
      this.$emit('changeSelectSearchResult', selectSearchResultType)
    },
    checkDisabled(key) {
      return this.disabledBtnNameList.includes(key)
    },
  },
}
</script>

<style lang="scss" scoped>
.select-search-result {
  display: flex;
  width: 264px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  button {
    width: 132px;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    &:not(.active) {
      cursor: pointer;
    }
    &.active,
    &:hover {
      background: #ebeced;
    }
    &.active {
      color: #007aff;
    }
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
    &.btnDisabled {
      color: rgba(30, 30, 30, 0.5);
    }
  }
}
.number {
  font-size: 13px;
}
</style>
