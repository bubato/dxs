<template>
  <div class="group-info">
    <JoinGroupList v-if="isPCSize === false" class="joinGroupList" />
    <div class="header">
      <div
        class="header-banner"
        :style="{ background: `url(${getCoverImage()})` }"
      >
        <div
          v-if="mixin_checkGroupAdminUser(groupInfo.adminProfileMemberId)"
          class="btnList"
        >
          <template v-if="isPCSize">
            <button
              class="btn btn-basic btn-middle"
              @click="showGroupProfileSettingsPage()"
            >
              プロフィールを編集
            </button>
            <button
              class="btn btn-basic btn-middle"
              @click="showCoverImageUploadModal()"
            >
              カバー写真を変更
            </button>
          </template>
        </div>
      </div>
      <h3 class="group-name">{{ groupInfo.postGroupName }}</h3>
      <div v-if="isPCSize === false" class="btnList">
        <button
          class="btn btn-basic btn-middle"
          @click="showGroupProfileSettingsPage()"
        >
          プロフィールを編集
        </button>
        <button
          class="btn btn-basic btn-middle"
          @click="showCoverImageUploadModal()"
        >
          カバー写真を変更
        </button>
      </div>
    </div>
    <div class="contents">
      <ul class="groupNavi">
        <li
          :class="{ 'is-act': showGroupPageTab === 1 }"
          @click="changeShowPageTab(1)"
        >
          タイムライン
        </li>
        <li
          :class="{ 'is-act': showGroupPageTab === 2 }"
          @click="changeShowPageTab(2)"
        >
          参加メンバー
        </li>
        <li
          :class="{ 'is-act': showGroupPageTab === 3 }"
          @click="changeShowPageTab(3)"
        >
          プロフィール
        </li>
      </ul>
      <GroupTimeLine v-show="showGroupPageTab === 1" />
      <GroupMember v-show="showGroupPageTab === 2" />
      <GroupProfile v-show="showGroupPageTab === 3" />
    </div>
    <InvitationGroupMemberModal
      v-if="showInvitationGroupMemberModalState"
      @update="getGroupMembers()"
      @close="setInvitationGroupMemberModalState(false)"
    />
    <CoverImageUploadModal
      v-if="showCoverImageUploadModalState"
      :img-path="groupInfo.postGroupCoverImageUrl"
      :prop-record-version="groupInfo.recordVersion"
      :cover-type="2"
      @update="getPostGroupInfo()"
      @close="hideCoverImageUploadModal()"
    />
    <CommonFooter class="footer" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  layout: 'community',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      showCoverImageUploadModalState: false,
    }
  },
  computed: {
    ...mapState('community/group', [
      'groupInfo',
      'showInvitationGroupMemberModalState',
      'showGroupPageTab',
    ]),
    ...mapState('community/common', ['isPCSize']),
    getCoverImage() {
      return () => {
        let backgroundImage = ''

        if (this.groupInfo.postGroupCoverImageUrl) {
          backgroundImage = this.groupInfo.postGroupCoverImageUrl
        } else {
          backgroundImage = require(`@/assets/images/community/bgImage/bg1.png`)
        }

        return backgroundImage
      }
    },
  },
  watch: {},
  created() {
    this.resetSearchParam()
    this.setShowGroupPageTab(1)
    this.getPostGroupInfo() // 投稿グループ情報の取得
    this.mixin_getPostGroupTimeLine() // 投稿グループタイムラインの取得
    this.getGroupMembers() // 投稿グループメンバー一覧の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('community/timeline', ['resetSearchParam']),
    ...mapMutations('community/group', [
      'setGroupInfo',
      'setGroupMembers',
      'setInvitationGroupMemberModalState',
      'setShowGroupPageTab',
    ]),
    /**
     * 投稿グループ情報の取得
     */
    getPostGroupInfo() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getPostGroupInfo(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setGroupInfo(resData.data)
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
     * 投稿グループメンバー一覧の取得
     */
    getGroupMembers() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getGroupMembers(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setGroupMembers(resData.data.groupMembers)
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
     * 表示タブ切り替え
     *
     * @param {number} tabVal 選択したタブの値
     */
    changeShowPageTab(tabVal) {
      this.setShowGroupPageTab(tabVal)
    },
    /**
     * グループプロフィール編集画面に遷移
     */
    showGroupProfileSettingsPage() {
      this.$common.initScrollTop()
      this.$router.push(`/community/group/edit/${this.$route.params.groupId}/`)
    },
    /**
     * カバー写真変更モーダルの表示
     */
    showCoverImageUploadModal() {
      this.showCoverImageUploadModalState = true
    },
    /**
     * カバー写真変更モーダルの非表示
     */
    hideCoverImageUploadModal() {
      this.showCoverImageUploadModalState = false
    },
  },
  head() {
    return {
      title: `${this.groupInfo.postGroupName}｜コミュニティ`,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.group-info {
  @include mq(sp) {
    .joinGroupList {
      margin-top: 32px;
      margin-bottom: 32px;
    }
  }
  .header {
    position: relative;
    margin-bottom: 33px;
    @include mq(pc) {
      min-width: 716px;
    }
    &-banner {
      position: relative;
      background-size: cover !important;
      @include mq(pc) {
        width: 100%;
        height: 239px;
      }
      @include mq(sp) {
        width: calc(100% - 16px * 2);
        padding-top: 52%;
        margin: 0 auto;
        border-radius: 4px;
      }
      .btnList {
        @include mq(pc) {
          position: absolute;
          top: 183px;
          right: 16px;
          display: flex;
          justify-content: flex-end;
          > * {
            &:not(:first-child) {
              margin-left: 8px;
            }
          }
        }
      }
    }
    .group-name {
      margin-top: 24px;
      @include mq(sp) {
        width: calc(100% - 16px * 2);
        text-align: center;
        margin-bottom: 24px;
      }
    }
    .btnList {
      @include spContentWidth();
      @include mq(sp) {
        > * {
          &:not(:last-child) {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  .contents {
    @include mq(pc) {
      width: 716px;
    }
    margin: 40px auto 0 auto;
    .groupNavi {
      display: flex;
      margin-bottom: 40px;
      li {
        position: relative;
        cursor: pointer;
        padding: 13px 24px;
        width: 33.3%;
        text-align: center;
        font-weight: 500;
        &:after {
          display: block;
          content: '';
          width: 100%;
          height: 3px;
          background: #e5e5e5;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        &.is-act:after {
          display: block;
          content: '';
          width: 100%;
          height: 3px;
          background: #4f7df0;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
}
</style>
