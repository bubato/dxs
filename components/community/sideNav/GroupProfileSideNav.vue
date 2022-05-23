<template>
  <div class="group-profile-sidenav">
    <div class="heading">
      <h5>プロフィール</h5>
      <CreateSVG class="icon" />
    </div>
    <div class="contents">
      <div class="group-info">
        <div class="group-name">
          <p class="title">グループ名</p>
          <p class="name">{{ postGroupInfo.postGroupType }}</p>
        </div>
        <div class="group-name">
          <p class="title">グループ説明</p>
          <p class="name">{{ postGroupInfo.postGroupDescription }}</p>
        </div>
        <div class="group-range-status">
          <p class="title">公開範囲</p>
          <p class="name">{{ postGroupInfo.postGroupRangeStatus }}</p>
        </div>
      </div>
      <div class="admin-info">
        <p>管理者</p>
        <div class="admin-user">
          <div
            class="image"
            @click="showSelectUserProfile(postGroupInfo.adminProfileMemberId)"
          >
            <img :src="$common.getProfileImg(postGroupInfo.adminImageUrl)" />
          </div>
          <div class="admin-user-info">
            <p class="name">{{ postGroupInfo.adminName }}</p>
            <p class="company">{{ postGroupInfo.adminCompany }}</p>
            <p class="position">{{ postGroupInfo.adminPosition }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'GroupProfileSideNav',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      postGroupInfo: {},
    }
  },
  computed: {
    getShowAccountingFirmList() {
      return () => {
        const showAccountingFirmList = this.accountingFirmList.filter(
          (data, index) => {
            if (this.moreListFlg) {
              return true
            } else {
              return index < this.maxShowNum
            }
          }
        )

        return showAccountingFirmList
      }
    },
  },
  created() {
    this.getPostGroupInfo() // 投稿グループ情報取得API
  },
  methods: {
    /**
     * 投稿グループ情報取得API
     */
    getJoinGroupList() {
      const paramData = {
        postGroupId: '',
      }

      this.$common.addCallApiNum()
      this.$api
        .getPostGroupInfo(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.postGroupInfo = resData.data
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
.group-profile-sidenav {
  margin-top: 24px;
  background: #f7f8f9;
  padding: 20px 24px;
  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e5e5;
    .icon {
      width: 18px;
      height: 18px;
    }
  }
  .contents {
    > div {
      &:not(:first-child) {
        margin-top: 24px;
      }
    }
    .title {
      font-size: 13px;
      color: #8d8d8d;
      margin-bottom: 8px;
    }
    .group-info {
      padding: 24px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .admin-info {
      padding-top: 24px;
      .image {
        width: 48px;
        height: 48px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      .admin-user {
        display: flex;
        &-info {
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
