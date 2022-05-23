<template>
  <div v-if="Object.keys(myProfile).length > 0" class="profile-block">
    <div class="images">
      <div class="image">
        <img
          :src="$common.getGroupProfileImg(groupInfo.postGroupCoverImageUrl)"
        />
      </div>
      <div class="image" @click="showSelectUserProfile(myProfile.userId)">
        <img
          :src="$common.getProfileImg(myProfile.basicSetting.profileImage)"
        />
      </div>
    </div>
    <div class="profile">
      <p class="group-name">{{ groupInfo.postGroupName }}</p>
      <p class="user-name">
        <span class="last-name">{{ myProfile.basicSetting.lastName }}</span
        ><span class="first-name">{{ myProfile.basicSetting.firstName }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'PostGroupProfile',
  components: {},
  mixins: [communityCommonMixin],
  props: {},
  data() {
    return {
      companyName: '',
      position: '',
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/group', ['groupInfo']),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     *
     * @param {string} userId 選択したユーザID
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.profile-block {
  @include spContentWidth();
  display: flex;
  align-items: center;
  margin-top: 24px;
  .profile {
    margin-left: 16px;
    flex: 1;
    .user-name {
      font-size: 13px;
    }
  }
  .images {
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
}
</style>
