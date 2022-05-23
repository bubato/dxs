<template>
  <div class="message">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">メッセージ一覧</h2>
        <button
          v-if="$common.checkArrayValue(recentGroupList)"
          class="btn btn-basic btn-long"
          @click="showMessageBlock()"
        >
          新しいメッセージを開始
        </button>
      </div>
      <div class="contents">
        <div v-for="(group, i) in recentGroupList" :key="i" class="item">
          <div class="member-box">
            <div class="member-image">
              <div
                v-for="member in getFilterChatMemberList(group.chatMemberList)"
                :key="member.userId"
                class="image"
                @click="showSelectUserProfile(member.userId)"
              >
                <img :src="$common.getProfileImg(member.image)" alt="" />
              </div>
            </div>
            <div class="member-name">
              <p
                v-for="member in getFilterChatMemberList(group.chatMemberList)"
                :key="member.userId"
                class="name"
              >
                {{ member.name }}
              </p>
              <p v-if="group.chatMemberList.length > maxShowUser" class="sum">
                ＋{{ group.chatMemberList.length - maxShowUser }}
              </p>
              <p v-if="!isPCSize" class="update-date">{{ group.date }}</p>
            </div>
            <span v-if="group.unreadFlag" class="unread-pop">未読あり</span>
            <p v-if="isPCSize" class="update-date">{{ group.date }}</p>
          </div>
          <button
            class="btn btn-secondary btn-middle"
            @click="showSelectUserMessage(group)"
          >
            メッセージを再開
          </button>
        </div>
        <div v-if="!$common.checkArrayValue(recentGroupList)" class="no-data">
          <div class="context">
            <h2>
              つながっているメンバーへ<br />初めてのメッセージを送ってみましょう
            </h2>
            <button class="btn btn-basic btn-long" @click="showMessageBlock()">
              新しいメッセージを開始
            </button>
          </div>
          <div class="image">
            <img :src="$common.getAssetsImgUrl('images/common/nodata_1.png')" />
          </div>
        </div>
      </div>
    </div>
    <!-- /main-contents -->
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'community',
  components: {
    CommonFooter,
  },
  mixins: [communityCommonMixin],
  data() {
    return {
      maxShowUser: 2,
    }
  },
  computed: {
    ...mapState('community/common', ['isPCSize']),
    ...mapState('community/message', ['recentGroupList']),
    /**
     * 画面に表示するメンバー情報の取得
     *
     * @param {object[]} chatMemberList グループチャットに所属しているメンバーリスト
     * @return {object[]} 画面に表示するメンバー情報
     */
    getFilterChatMemberList() {
      return (chatMemberList) => {
        const filterChatMemberList = chatMemberList.filter(
          (data, index) => index < this.maxShowUser
        )

        return filterChatMemberList
      }
    },
  },
  watch: {},
  created() {
    this.mixin_getRecentlyMessageList() // 最近チャットしたメンバーの取得
  },
  mounted() {},
  methods: {
    ...mapMutations('community/message', [
      'setSelectGroupId',
      'setSelectStorageObjectId',
      'setShowMessageBlockFlg',
      'setShowMessageChatAreaFlg',
    ]),
    /**
     * メッセージエリアの表示
     */
    showMessageBlock() {
      this.setShowMessageBlockFlg(true)
    },
    /**
     * 対象のユーザーとメッセージを開始
     *
     * @param {Object} groupInfo グループ情報
     */
    showSelectUserMessage(groupInfo) {
      this.setShowMessageBlockFlg(true)
      this.setSelectGroupId(groupInfo.messageGroupId)
      this.setSelectStorageObjectId(groupInfo.storageObjectId)
      this.setShowMessageChatAreaFlg(true)
    },
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
  },
  head() {
    return {
      title: 'メッセージ｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';

.message {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include mq(sp) {
      display: block;
      padding: 32px 16px;
    }
    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include mq(sp) {
        margin-bottom: 24px;
        font-size: 22px;
      }
    }
  }
}

.contents {
  margin: 40px 0 0 0;
  @include mq(sp) {
    padding: 0 16px;
  }
  .item {
    @include mq(pc) {
      display: flex;
    }
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #e5e5e5;
    &:first-child {
      border-top: 1px solid #e5e5e5;
    }
    .member-box {
      display: flex;
      @include mq(pc) {
        align-items: center;
        width: calc(100% - 165px);
      }
      @include mq(sp) {
        margin-bottom: 16px;
        align-items: flex-end;
      }
    }
    .member-image {
      display: flex;
      .image {
        width: 56px;
        height: 56px;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: -37px;
        }
        img {
          width: 100%;
        }
      }
    }
    .member-name {
      flex: 1;
      @include mq(pc) {
        margin-left: 32px;
        font-size: 17px;
      }
      @include mq(sp) {
        margin-left: 24px;
        margin-bottom: 4px;
        font-weight: 500;
      }
    }
    .unread-pop {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 32px;
      font-size: 13px;
      color: #ffffff;
      background: #ff453a 0% 0% no-repeat padding-box;
      border-radius: 20px;
      @include mq(pc) {
        margin-bottom: 5px;
      }
    }
    .update-date {
      font-size: 13px;
      color: #8d8d8d;
      @include mq(pc) {
        margin-left: 16px;
      }
    }
    .btn {
      @include mq(pc) {
        margin-left: 24px;
      }
    }
  }
  .no-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    .context {
      h2 {
        color: #1e1e1e;
        text-align: center;
      }
      .btn {
        margin: 32px auto 0 auto;
      }
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
}

// MQ
@include mq(sp) {
  // .header {
  //   padding: 32px 16px;
  //   &-title {
  //     font-size: 22px;
  //   }
  // }
  .connection-search {
    margin-top: 0;
    padding: 0 16px;
  }
  .contents {
    .item {
      .right {
        .update-date {
          word-break: keep-all;
        }
      }
    }
  }
}
// MQ
</style>
