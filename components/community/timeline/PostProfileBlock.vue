<template>
  <div class="post-profile">
    <div
      class="profile-image"
      @click="showSelectUserProfile(parentComment.userId)"
    >
      <img :src="$common.getProfileImg(parentComment.image)" />
    </div>
    <div class="profile-detail">
      <p>
        <span class="contributor">{{ parentComment.contributor }}</span
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
      <p>
        <span class="company">{{ parentComment.company }}</span
        ><span class="position">{{ parentComment.position }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'PostProfileBlock',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    parentComment: { type: Object, required: true, default: () => {} },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
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
    width: 48px;
    height: 48px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .profile-detail {
    margin-left: 16px;
    flex: 1;
    .postedDate,
    .company,
    .position {
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
