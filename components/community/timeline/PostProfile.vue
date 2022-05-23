<template>
  <div v-if="Object.keys(myProfile).length > 0" class="profile-block">
    <div class="image">
      <img
        :src="$common.getProfileImg(myProfile.basicSetting.profileImage)"
        @click="showSelectUserProfile(myProfile.userId)"
      />
    </div>
    <div class="profile">
      <p>
        <span class="last-name">{{ myProfile.basicSetting.lastName }}</span
        ><span class="first-name">{{ myProfile.basicSetting.firstName }}</span>
      </p>
      <p v-if="$common.checkArrayValue(myProfile.workHistory)">
        <span class="company">{{ companyName }}</span
        ><span class="position">{{ position }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'PostProfile',
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
  },
  watch: {},
  created() {
    this.setCompanyPosition()
  },
  mounted() {},
  methods: {
    /**
     * 画面に表示する投稿者の会社名と役職を設定
     */
    setCompanyPosition() {
      let workHistory =
        JSON.parse(JSON.stringify(this.myProfile.workHistory)) || []

      if (workHistory.length > 0) {
        workHistory = workHistory.filter((data) => {
          return data.employmentStatus === '1'
        })

        workHistory.sort((a, b) => {
          if (
            Number(a.hireDateStartYear + a.hireDateStartMonth) <
            Number(b.hireDateStartYear + b.hireDateStartMonth)
          ) {
            return 1
          } else {
            return -1
          }
        })

        workHistory = workHistory.filter((data) => {
          return (
            data.hireDateStartYear === workHistory[0].hireDateStartYear &&
            data.hireDateStartMonth === workHistory[0].hireDateStartMonth
          )
        })

        if (workHistory.length > 0) {
          const targetWork = workHistory[workHistory.length - 1]

          this.companyName = targetWork.company
          this.position = targetWork.position
        }
      }
    },
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
  display: flex;
  align-items: center;
  margin-top: 24px;
  .profile {
    margin-left: 16px;
    flex: 1;
    .company,
    .position {
      font-size: 13px;
    }
    .position {
      margin-left: 12px;
    }
    .icon-public {
      margin-left: 8px;
      width: 16px;
      height: 16px;
      fill: #8d8d8d;
    }
  }
  .image {
    width: 48px;
    height: 48px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>
