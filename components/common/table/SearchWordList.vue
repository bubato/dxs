<template>
  <div class="search-word-list">
    <span>検索条件:</span>
    <ul class="flex">
      <li v-for="(searchWord, index) in searchWordList" :key="index">
        <button @click="deleteSearchWord(index)">
          {{ searchWord }}を含む
          <CancelSVG class="btn-delete icon-cancel" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchWordList',
  props: {
    searchWordList: { type: Array, required: true, default: () => [] },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    deleteSearchWord(index) {
      this.$emit('deleteSearchWord', index)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-word-list {
  display: flex;
  ul {
    margin-left: 8px;
    li {
      &:not(:last-child) {
        margin-right: 8px;
      }
      button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 32px;
        background: #d1e7ff;
        border-radius: 4px;
        padding: 0 10px 0 12px;
        cursor: pointer;
        .btn-delete {
          width: 16px;
          height: 16px;
          margin-left: 10px;
          fill: #3a435c;
        }
      }
    }
  }
}
</style>
