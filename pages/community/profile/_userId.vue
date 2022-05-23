<template>
  <div class="profile-list">
    <div v-show="!spTimeLineMode">
      <ProfileHeader :is-my-profile="isMyProfile" />
      <NuxtChild v-if="$route.name === 'community-profile-edit'" />
    </div>
    <div v-if="spTimeLineMode">
      <SpPostingArea @close="closeSpTimeLine()" />
    </div>
    <CommonFooter class="footer" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'community',
  components: {},
  data() {
    return {
      isMyProfile: true,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/timeline', ['spTimeLineMode']),
    ...mapState('community/profileStore', ['profilePageProfile']),
  },
  watch: {},
  created() {
    if (this.$route.params.userId) {
      if (String(this.myProfile.userId) === this.$route.params.userId) {
        this.$router.push('/community/profile/') // パラメータなしのプロフィール画面に遷移
      } else {
        this.isMyProfile = false
      }
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('community/timeline', [
      'setSpTimeLineMode',
      'setPostEditMode',
    ]),
    /**
     * タイムライン編集画面の非表示(SP版)
     */
    closeSpTimeLine() {
      this.setPostEditMode(false)
      this.setSpTimeLineMode(false)
    },
  },
  head() {
    return {
      title: this.profilePageProfile.basicSetting
        ? this.profilePageProfile.basicSetting.lastName +
          this.profilePageProfile.basicSetting.firstName +
          'さんのプロフィール｜コミュニティ｜bizskyDX'
        : 'さんのプロフィール｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.footer {
  margin-bottom: 44px;
}
</style>
