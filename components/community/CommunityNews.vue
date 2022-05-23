<template>
  <div class="community-news">
    <p class="headline">
      {{
        myProfile.basicSetting ? myProfile.basicSetting.lastName : ''
      }}さんへのお知らせ
    </p>
    <ul class="news-list">
      <li v-for="(news, index) in showNewsList()" :key="index">
        <p class="date">{{ news.date }}</p>
        <p>{{ news.text }}</p>
      </li>
    </ul>
    <button v-if="!moreListFlg" class="btn btn-more" @click="showMoreList()">
      もっと見る
      <ExpandMoreSVG class="icon icon-expandMore" />
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CommunityNews',
  components: {},
  data() {
    return {
      newsList: [],
      moreListFlg: false,
      maxShowNum: 5,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    showNewsList() {
      return () => {
        const showNewsList = this.newsList.filter((news, index) => {
          if (this.moreListFlg) {
            return true
          } else {
            return index < this.maxShowNum
          }
        })

        return showNewsList
      }
    },
  },
  created() {
    this.getCommunityNewsList() // ユーザーへのお知らせ一覧の取得
  },
  methods: {
    /**
     * ユーザーへのお知らせ一覧の取得
     */
    getCommunityNewsList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCommunityNewsList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.newsList = resData.data.newsList
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
     * もっと見るボタン押下時の処理
     *
     * リスト全件表示
     */
    showMoreList() {
      this.moreListFlg = true
    },
  },
}
</script>

<style lang="scss" scoped>
.community-news {
  margin-top: 20px;
  background: #f7f8f9;
  padding: 20px 24px;
  .headline {
    font-size: 17px;
    font-weight: 500;
  }
  ul.news-list {
    margin-top: 16px;
    li {
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      padding: 17px 0;
      font-size: 13px;
      .date {
        color: #8a8a8e;
      }
    }
  }
  .btn-more {
    width: 100%;
    height: 48px;
    margin-top: 24px;
    position: relative;
    background: #ffffff;
    .icon {
      position: absolute;
      right: 50px;
    }
  }
}
</style>
