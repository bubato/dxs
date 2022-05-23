<template>
  <div v-if="$common.checkArrayValue(browsingHistory)" class="browsing-history">
    <p class="headline">
      {{
        myProfile.basicSetting ? myProfile.basicSetting.lastName : ''
      }}さんのプロフィールが 閲覧されています
    </p>
    <ul class="browsing-history-list">
      <li v-for="(history, index) in showBrowsingHistory()" :key="index">
        <div class="image" @click="showSelectUserProfile(history.userId)">
          <img :src="$common.getProfileImg(history.image)" />
        </div>
        <div class="profile">
          <p class="name">
            {{ history.name }}
            <span>
              {{
                $common.getFormatDiffDate(history.diffDate, 'YYYY/MM/DD HH:mm')
              }}</span
            >
          </p>
          <p class="company">{{ history.company }}</p>
          <p class="position">{{ history.position }}</p>
          <button
            class="btn btn-secondary btn-middle"
            @click="showSelectUserProfile(history.userId)"
          >
            プロフィールを見る
          </button>
        </div>
      </li>
    </ul>
    <button
      v-if="!moreListFlg && browsingHistory.length > maxShowNum"
      class="btn btn-more"
      @click="moreListFlg = true"
    >
      もっと見る
      <ExpandMoreSVG class="icon icon-expandMore" />
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'BrowsingHistory',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      browsingHistory: [],
      moreListFlg: false,
      maxShowNum: 5,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    showBrowsingHistory() {
      return () => {
        const showBrowsingHistory = this.browsingHistory.filter(
          (history, index) => {
            if (this.moreListFlg) {
              return true
            } else {
              return index < this.maxShowNum
            }
          }
        )

        return showBrowsingHistory
      }
    },
  },
  created() {
    this.getBrowsingHistory() // ユーザーへのお知らせ一覧の取得
  },
  methods: {
    /**
     * ユーザーへのお知らせ一覧の取得
     */
    getBrowsingHistory() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getBrowsingHistory(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.browsingHistory = resData.data.browsingHistory
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
     * 選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
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
.browsing-history {
  margin-top: 20px;
  background: #f7f8f9;
  padding: 20px 24px;
  .headline {
    font-size: 17px;
    font-weight: 500;
  }
  ul.browsing-history-list {
    margin-top: 16px;
    li {
      display: flex;
      padding: 17px 0;
      font-size: 13px;
      border-bottom: 1px solid #e5e5e5;
      &:first-child {
        border-top: 1px solid #e5e5e5;
      }
      .image {
        width: 48px;
        height: 48px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      .profile {
        margin-left: 16px;
        flex: 1;
        .name {
          font-weight: 500;
        }
        .company,
        .position {
          font-size: 13px;
        }
        .btn {
          margin-top: 12px;
        }
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
      position: absolute;
      right: 50px;
    }
  }
}
</style>
