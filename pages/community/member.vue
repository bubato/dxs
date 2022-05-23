<template>
  <div class="connections-list">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header flex">
        <h2 class="header-title">つながり一覧</h2>
        <p class="connection-list-count">
          {{ myConnectionList ? myConnectionList.length : 0 }}人
        </p>
      </div>
      <!-- つながり申請一覧 -->
      <ConnectionRequest
        :request-list="myConnectionRequestList"
        @reflect="getRequestConnectionList()"
      />
      <!-- /つながり申請一覧 -->
      <div
        v-if="$common.checkArrayValue(myConnectionList)"
        class="member-search"
      >
        <!-- メンバー検索 -->
        <div class="input-text">
          <CustomInputText
            v-model="inputSearchText"
            view-type="search"
            placeholder="メンバーを検索"
            maxlength="50"
            @submit="setFilterText()"
          />
        </div>
        <!-- /メンバー検索 -->
        <!-- 繋がり一覧リスト -->
        <ConnectionList
          :connection-list="filterConnectionList()"
          :show-menu="true"
        />
        <!-- /繋がり一覧リスト -->
      </div>
      <div v-else class="no-data">
        <h2>
          気になるメンバーを探して<br />新しいビジネスチャンスをつかみましょう
        </h2>
        <div class="input-text">
          <CustomInputText
            v-model="inputSearchText"
            view-type="search"
            placeholder="メンバーや会社を検索"
            @submit="transitionSearchResult($event)"
          />
        </div>
        <div class="image">
          <img :src="$common.getAssetsImgUrl('images/common/nodata_1.png')" />
        </div>
      </div>
    </div>
    <!-- /main-contents -->
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ConnectionRequest from '~/components/community/connection/ConnectionRequest.vue'
import ConnectionList from '~/components/community/connection/ConnectionList.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'community',
  components: {
    ConnectionRequest,
    ConnectionList,
    CommonFooter,
  },
  data() {
    return {
      inputSearchText: '',
      filterText: '',
    }
  },
  computed: {
    ...mapState('community/common', [
      'myConnectionList',
      'myConnectionRequestList',
    ]),
    /**
     * つながり一覧をフィルタリング
     */
    filterConnectionList() {
      return () => {
        const showConnectionList = this.myConnectionList.filter((data) => {
          let result = false

          if (this.filterText.length > 0) {
            if (
              data.name.includes(this.filterText) ||
              data.company.includes(this.filterText)
            ) {
              result = true
            } else {
              result = false
            }
          } else {
            result = true
          }

          return result
        })

        return showConnectionList
      }
    },
  },
  created() {
    this.getRequestConnectionList() // つながり申請承認待ち一覧取得処理
    this.getConnectionList() // つながりリスト取得処理
  },
  mounted() {},
  methods: {
    ...mapMutations('community/common', [
      'setMyConnectionList',
      'setMyConnectionRequestList',
    ]),
    ...mapMutations('community/searchResult', ['setConnectionSearchText']),
    /**
     * つながり申請承認待ち一覧取得処理
     */
    getRequestConnectionList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getRequestConnectionList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMyConnectionRequestList(
              resData.data.connectionRequestList || []
            )
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * つながりリスト取得処理
     */
    getConnectionList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getConnectionList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMyConnectionList(resData.data.connectionList)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * フィルターテキストを設定
     */
    setFilterText() {
      this.filterText = JSON.parse(JSON.stringify(this.inputSearchText))
    },
    /**
     * 検索結果画面に遷移
     */
    transitionSearchResult(inputWord) {
      this.setConnectionSearchText(inputWord)
      this.inputSearchText = ''
      this.$router.push('/community/searchResults/')
    },
  },
  head() {
    return {
      title: 'つながり一覧｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
// ヘッダー
.connection-list-count {
  margin: 0 0 0 16px;
  font-size: 22px;
  color: #8d8d8d;
}
.member-search {
  margin: 40px 0 0 0;
  .input-text {
    position: relative;
    margin: 0 0 24px 0;
    &::after {
      position: absolute;
      top: 0;
      right: 48px;
      display: block;
      content: '';
      height: 48px;
      border-left: 1px solid #e5e5e5;
    }
  }
  .icon {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
  }
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  margin-top: 32px;
  @include mq(sp) {
    padding: 0 10px;
  }
  h2 {
    color: #1e1e1e;
    text-align: center;
  }
  .input-text {
    width: 100%;
    margin-top: 32px;
  }
  .image {
    width: 716px;
    height: 537px;
    margin-top: 24px;
    text-align: center;
    @include mq(sp) {
      width: 100%;
      height: auto;
    }
    img {
      @include mq(sp) {
        width: 100%;
        height: auto;
      }
    }
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
  .member-search {
    padding: 0 16px;
  }
}
// MQ
</style>
