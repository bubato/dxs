<template>
  <div class="search-options">
    <div class="row flex">
      <SelectSearchResult
        :select-search-result-type="selectSearchResultType"
        :search-result-all="mailListObj.searchResultAll"
        :search-result-filter="mailListObj.searchResultFilter"
        @changeSelectSearchResult="changeSelectSearchResult($event)"
      />
      <CustomInputCheckbox
        v-model="selectSearchCheck"
        :options="searchCheckOptions"
        class="search-check-options"
        name="searchCheckOptions"
      />
    </div>
    <div class="row">
      <CustomInputText
        v-model="inputSearchText"
        class="input-search-text"
        view-type="search"
      />
    </div>
    <div class="row">
      <SearchWordList
        :search-word-list="searchWordList"
        @deleteSearchWord="deleteSearchWord($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SearchOptions',
  data() {
    return {
      selectSearchResultType: 'all',
      inputSearchText: '',
      searchWordList: ['検索条件A', '検索条件B'],
      selectSearchCheck: [],
      searchCheckOptions: [
        {
          value: '1',
          label: '配信済',
        },
        {
          value: '2',
          label: '配信予約',
        },
        {
          value: '3',
          label: '編集中',
        },
        {
          value: '4',
          label: '配信エラー',
        },
      ],
    }
  },
  computed: {
    ...mapState('communication/mailList', ['mailListObj']),
  },
  created() {},
  mounted() {},
  methods: {
    changeSelectSearchResult(selectSearchResultType) {
      this.selectSearchResultType = selectSearchResultType
    },
    deleteSearchWord(index) {
      this.searchWordList.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-options {
  margin-top: 24px;
  .row {
    &:nth-of-type(1) {
      height: 40px;
    }
    &:nth-of-type(2) {
      margin-top: 24px;
    }
    &:nth-of-type(3) {
      height: 40px;
      margin-top: 16px;
    }
  }

  .search-check-options {
    margin-left: 40px;
  }
  .input-search-text {
    width: 100%;
  }
}
</style>
