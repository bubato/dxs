<template>
  <div class="group-timeline">
    <div class="group-join-member">
      <h5>参加しているメンバー</h5>
      <div class="contents">
        <div class="flex">
          <ul class="group-join-member-image-list">
            <li
              v-for="(member, index) in getFilterGroupMembers()"
              :key="index"
              @click="showSelectUserProfile(member.profileMemberId)"
            >
              <img
                :src="$common.getProfileImg(member.memberImageUrl)"
                :title="member.memberName"
                :alt="member.memberName"
              />
            </li>
          </ul>
          <MoreHorizSVG
            v-if="groupMembers.length > maxShowUserNum"
            class="icon-moreHoriz"
          />
        </div>
        <button
          v-if="!checkAccountingFirm()"
          class="btn btn-middle btn-primary"
          @click="setInvitationGroupMemberModalState(true)"
        >
          メンバーを招待
        </button>
      </div>
    </div>
    <PostTimeLine v-if="checkBelongsGroup()" :is-group="true" />
    <TimeLineList :all-view="true" :time-line-type="2" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'GroupTimeLine',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      maxShowUserNum: 5,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/group', ['groupMembers', 'groupInfo']),
    /**
     * 画面に表示する参加メンバーの取得
     *
     * @return {object[]} 画面に表示する参加メンバー
     */
    getFilterGroupMembers() {
      return () => {
        const filterGroupMembers = this.groupMembers.filter(
          (data, index) => index < this.maxShowUserNum
        )

        return filterGroupMembers
      }
    },
    /**
     * 自分がそのグループの管理者、またはグループ参加者かどうかのチェック
     *
     * @return {boolean} true:自分がそのグループの管理者、またはグループ参加者 false:それ以外
     */
    checkBelongsGroup() {
      return () => {
        let result = false

        if (
          this.groupInfo.adminProfileMemberId === this.myProfile.userId ||
          this.groupMembers.findIndex(
            (data) => data.profileMemberId === this.myProfile.userId
          ) >= 0
        ) {
          result = true
        }

        return result
      }
    },
    /**
     * 会計事務所かどうかのチェック
     *
     * @return {boolean} true:会計事務所 false:会計事務所以外
     */
    checkAccountingFirm() {
      return () => {
        let result = false

        if (this.$route.params.groupId === '0') {
          result = true
        }

        return result
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('community/group', ['setInvitationGroupMemberModalState']),
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     *
     * @param {Number} userId userId
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';

.group-timeline {
  .group-join-member {
    @include spContentWidth();
    margin-top: 40px;
    padding: 24px;
    background: #f7f8f9;
    .contents {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      @include mq(sp) {
        flex-direction: column;
      }
      .flex {
        align-items: flex-end;
        @include mq(sp) {
          margin-bottom: 24px;
        }
        .icon-moreHoriz {
          margin-left: 8px;
        }
      }
      .group-join-member-image-list {
        display: flex;
        align-items: center;
        li {
          width: 48px;
          height: 48px;
          position: relative;
          cursor: pointer;
          &:not(:first-child) {
            margin-left: 4px;
          }
          img {
            width: 100%;
          }
        }
      }
      .post-time-line {
        margin-top: 40px;
      }
      .time-line-list {
        margin-top: 32px;
      }
    }
  }
}
</style>
