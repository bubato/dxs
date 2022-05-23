<template>
  <div class="search-results">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">検索結果</h2>
      </div>
      <div class="connection-search">
        <div class="input-text">
          <CustomInputText
            v-model="searchText"
            placeholder="メンバーの氏名や企業名を入力してください"
            view-type="search"
            maxlength="50"
            @submit="getCommunitySearchResultData(false)"
          />
        </div>
      </div>

      <ConnectionCompany
        v-if="$common.checkArrayValue(searchResultData.companyResultList)"
        :company-list="searchResultData.companyResultList"
      />
      <ConnectionMember
        v-if="$common.checkArrayValue(searchResultData.memberResultList)"
        :member-list="searchResultData.memberResultList"
      />

      <div v-if="noSearchResults()" class="no-result">
        <p class="no-result-message">
          検索条件に一致する会社およびメンバーがありませんでした。<br />会社名や氏名を省略しないで検索するなど別の方法をお試しください。
        </p>
        <p class="no-result-message">
          例）「(株)」で該当の情報が表示されない場合「株式会社」で検索するなど。
        </p>
      </div>
    </div>
    <!-- /main-contents -->
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ConnectionCompany from '~/components/community/searchResults/ConnectionCompany.vue'
import ConnectionMember from '~/components/community/searchResults/ConnectionMember.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'community',
  components: {
    ConnectionCompany,
    ConnectionMember,
    CommonFooter,
  },
  data() {
    return {
      searchText: '',
    }
  },
  computed: {
    ...mapState('community/searchResult', [
      'searchResultData',
      'connectionSearchText',
    ]),
    noSearchResults() {
      return () => {
        const companyResultList = this.searchResultData.companyResultList
        const memberResultList = this.searchResultData.memberResultList

        if (this.$common.checkArrayValue(companyResultList)) return false
        if (this.$common.checkArrayValue(memberResultList)) return false
        return true
      }
    },
  },
  watch: {
    connectionSearchText(newValue) {
      if (newValue) {
        this.searchText = newValue
        this.getCommunitySearchResultData(true)
      }
    },
  },
  created() {
    this.searchText = this.connectionSearchText
    this.getCommunitySearchResultData(true)
  },
  mounted() {},
  methods: {
    ...mapMutations('community/searchResult', ['setSearchResultData']),
    getCommunitySearchResultData(init) {
      const paramData = {
        searchText: this.searchText,
      }

      this.$common.addCallApiNum()
      this.$api
        .getCommunitySearchResultData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (!init) {
              this.searchText = ''
            }
            this.setSearchResultData(resData.data)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
  head() {
    return {
      title: '検索結果｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.header-title {
  font-weight: 500;
}
.connection-search {
  margin: 40px 0 0 0;
  .input-text {
    position: relative;
    margin: 0 0 24px 0;
  }
  .icon {
    &-close {
      position: absolute;
      top: 12px;
      right: 60px;
      cursor: pointe;
    }
    &-search {
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
  }
}
.no-result {
  text-align: center;
  padding: 1em;

  &-message {
    margin-top: 1em;
  }
}
// MQ
@include mq(sp) {
  .header {
    padding: 32px 16px;
    &-title {
      font-size: 22px;
    }
  }
  .connection-search {
    margin-top: 0;
    padding: 0 16px;
  }
}
// MQ
</style>
