<template>
  <div class="post-profile">
    <div class="profile-image">
      <div
        v-if="
          (timeLineType === 0 && parentComment.postGroupName) ||
          timeLineType === 1
        "
        class="image"
        @click="showSelectGroupProfile(parentComment.postGroupId)"
      >
        <img
          :src="
            $common.getGroupProfileImg(parentComment.postGroupCoverImageUrl)
          "
        />
      </div>
      <div class="image" @click="showSelectUserProfile(parentComment.userId)">
        <img :src="$common.getProfileImg(parentComment.image)" />
      </div>
    </div>
    <div class="profile-detail">
      <p>
        <span
          v-if="
            (timeLineType === 0 && parentComment.postGroupName) ||
            timeLineType === 1
          "
          class="postGroupName"
          >{{ parentComment.postGroupName }}</span
        ><span v-if="timeLineType === 2" class="contributor">{{
          parentComment.contributor
        }}</span
        ><span class="postedDate">{{ parentComment.postedDate }}</span>
        <PublicSVG
          v-if="parentComment.rangeStatus === '1'"
          class="icon icon-public"
          @mouseover="$common.setAreaLabel($event, 'right', '全員に公開')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        />
        <SupervisorAccountSVG
          v-if="parentComment.rangeStatus === '2'"
          class="icon icon-supervisorAccount"
          @mouseover="$common.setAreaLabel($event, 'right', 'つながりまで公開')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        />
        <LockSVG
          v-if="parentComment.rangeStatus === '3'"
          class="icon icon-lock"
          @mouseover="$common.setAreaLabel($event, 'right', '自分だけ公開')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        />
      </p>
      <p
        v-if="
          (timeLineType === 0 && parentComment.postGroupName) ||
          timeLineType === 1
        "
        class="contributor"
      >
        {{ parentComment.contributor }}
      </p>
      <p v-if="timeLineType === 2" class="companyPosition">
        <span class="company">{{ parentComment.company }}</span
        ><span class="position">{{ parentComment.position }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'PostGroupProfileBlock',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    parentComment: { type: Object, required: true, default: () => {} },
    timeLineType: {
      type: Number,
      default: 0, // 0:通常 1:グループ(最近投稿したグループ画面) 2:グループタイムライン
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * 選択したグループのプロフィール画面を表示
     *
     * @param {Number} groupId 投稿グループID
     */
    showSelectGroupProfile(groupId) {
      this.$router.push(`/community/group/${groupId}/`)
    },
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
.post-profile {
  display: flex;
  align-items: center;
  .profile-image {
    display: flex;
    .image {
      width: 48px;
      height: 48px;
      cursor: pointer;
      &:not(:first-child) {
        margin-left: -32px;
      }
      img {
        width: 100%;
      }
    }
  }
  .profile-detail {
    margin-left: 16px;
    flex: 1;
    .postedDate,
    .contributor,
    .companyPosition {
      font-size: 13px;
    }
    .postedDate {
      color: #8d8d8d;
    }
    .postedDate,
    .position {
      margin-left: 12px;
    }
    .icon {
      margin-left: 8px;
      width: 16px;
      height: 16px;
      fill: #8d8d8d;
    }
  }
}
</style>
