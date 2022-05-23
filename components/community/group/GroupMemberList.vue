<template>
  <div class="group-member-list">
    <div
      v-for="(member, index) in filterMemberList()"
      :key="index"
      class="group-member-list-cell"
      @click="showSelectUserProfile(member.profileMemberId)"
    >
      <div class="group-member-list-cell-img">
        <img
          :src="$common.getProfileImg(member.memberImageUrl)"
          :alt="member.memberName"
        />
      </div>
      <div class="group-member-list-cell-profile">
        <p class="name">{{ member.memberName }}</p>
        <p class="company">{{ member.memberCompany }}</p>
        <p class="position">{{ member.memberPosition }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'GroupMemberList',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    filterText: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('community/group', ['groupMembers']),
    /**
     * メンバ一覧をフィルタリング
     */
    filterMemberList() {
      return () => {
        const showMemberList = this.groupMembers.filter((data) => {
          let result = false

          if (this.filterText.length > 0) {
            if (
              data.memberName.includes(this.filterText) ||
              data.memberCompany.includes(this.filterText)
            ) {
              result = true
            } else {
              result = false
            }
          } else {
            result = true
          }

          return result
        })

        return showMemberList
      }
    },
  },
  mounted() {},
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
@import '~assets/styles/scss/sp/mediaQuery.scss';
.group-member-list {
  display: flex;
  @include mq(pc) {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  @include mq(sp) {
    flex-direction: column;
  }
  &-cell {
    display: flex;
    position: relative;
    @include mq(sp) {
      width: 100%;
    }
    @include mq(pc) {
      width: 49%;
    }
    padding: 24px;
    border: #e5e5e5 1px solid;
    border-radius: 6px;
    margin-bottom: 2%;
    cursor: pointer;
    &.is-none {
      display: none !important;
    }
    &:hover {
      background: #f8f9fa;
    }

    &-img {
      width: 80px;
      padding-right: 16px;
      position: relative;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    &-profile {
      flex: 1;
      p {
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .name {
        font-size: 17px;
        font-weight: 500;
        color: #1e1e1e;
      }
      .btn-menu {
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 0px;
        width: 44px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &-menu {
      position: absolute;
      background: #fff;
      right: 0;
      top: 0;
      transform: translate(20px, -24px);
      z-index: 10;
    }
  }
}
// アイコン設定
.icon {
  &-moreHoriz {
    width: 24px;
    height: 24px;
  }
}
</style>
