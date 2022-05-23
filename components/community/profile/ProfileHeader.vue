<template>
  <div>
    <!-- main-contents -->
    <div class="main-contents">
      <div v-if="isMyProfile" class="header">
        <h2 class="header-title">プロフィール</h2>
      </div>
      <div v-if="Object.keys(profileData).length > 0" class="body">
        <div class="body-header">
          <div
            :style="{ background: `url(${getCoverImage()})` }"
            class="body-header-image"
          ></div>
          <div class="body-header-data">
            <p class="name">
              {{ profileData.basicSetting.lastName }}
              {{ profileData.basicSetting.firstName }}
            </p>
            <p class="companyName">
              {{ companyNameValue }}
            </p>
          </div>
          <div class="body-header-profile">
            <div class="body-header-facePhotoWrap">
              <img
                :src="$common.getProfileImg(profileImage)"
                alt=""
                class="body-header-facePhoto"
              />
            </div>
            <button v-if="isMyProfile" class="btn-camera">
              <CameraAltSVG
                class="icon-camera"
                @click="
                  profileImageUploadModalState = !profileImageUploadModalState
                "
              />
            </button>
          </div>
          <div v-if="profileData.social" class="iconList">
            <a
              v-if="isValue(profileData.social.facebook)"
              target="_blank"
              :href="profileData.social.facebook"
              ><img
                :src="$common.getAssetsImgUrl(imageData.facebook)"
                width="32"
                height="32"
            /></a>
            <a
              v-if="isValue(profileData.social.twitter)"
              target="_blank"
              :href="profileData.social.twitter"
              ><img
                :src="$common.getAssetsImgUrl(imageData.twitter)"
                width="32"
                height="32"
            /></a>
            <a
              v-if="isValue(profileData.social.instagramId)"
              target="_blank"
              :href="profileData.social.instagramId"
              ><img
                :src="$common.getAssetsImgUrl(imageData.instagram)"
                width="32"
                height="32"
            /></a>
          </div>
          <div v-if="isMyProfile" class="body-header-image-btnList">
            <button
              v-if="profileData.companyId"
              class="btn btn-secondary btn-middle btn-editProfile"
              @click="showCompanyPage()"
            >
              企業ページを見る
            </button>
            <button
              class="btn btn-basic btn-middle btn-editProfile"
              @click="showProfileSettingsPage()"
            >
              プロフィールを編集
            </button>
            <button
              class="btn btn-basic btn-middle btn-editProfile"
              @click="showCoverImageUploadModal()"
            >
              カバー写真を変更
            </button>
          </div>
          <div v-if="!isMyProfile" class="body-header-image-btnList">
            <button
              v-if="profileData.connectionStatus === 1"
              class="btn btn-basic btn-middle btn-editProfile connectionRequest"
              @click="requestConnection()"
            >
              つながり申請
            </button>
            <button
              v-if="profileData.connectionStatus === 2"
              class="btn btn-middle btn-editProfile connectionCancel"
              @click="cancelConnection()"
            >
              <CancelSVG class="icon-cancel" />
              申請をキャンセル
            </button>
            <div
              v-if="profileData.connectionStatus === 3"
              class="connection-block"
            >
              <button
                class="btn connectionBoth"
                @click="showAccordionBlock = !showAccordionBlock"
              >
                <CheckCircleSVG class="icon icon-check icon-checkCircle" />
                つながり中
                <ExpandMoreSVG
                  v-if="!showAccordionBlock"
                  class="icon icon-more icon-expandMore"
                />
                <ExpandLessSVG v-else class="icon icon-less icon-expandLess" />
              </button>
              <div
                v-if="showAccordionBlock"
                v-on-clickaway="hideAccordionBlock"
                class="accordion-block"
              >
                <ul>
                  <li
                    class="text-alert"
                    @click="showCancelConfirmConnectionModal()"
                  >
                    つながりを解除する
                  </li>
                  <li
                    v-if="!profileData.postDisplay"
                    @click="updatePostDisplay(true)"
                  >
                    投稿を表示する
                  </li>
                  <li
                    v-if="profileData.postDisplay"
                    @click="updatePostDisplay(false)"
                  >
                    投稿を非表示にする
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-if="profileData.connectionStatus === 4"
              class="connection-block"
            >
              <button
                class="btn connectionContact"
                @click="showAccordionBlock = !showAccordionBlock"
              >
                <WatchLaterSVG class="icon icon-watch" />
                申請が届いてます
                <ExpandMoreSVG
                  v-if="!showAccordionBlock"
                  class="icon icon-more icon-expandMore"
                />
                <ExpandLessSVG v-else class="icon icon-less icon-expandLess" />
              </button>
              <div
                v-if="showAccordionBlock"
                v-on-clickaway="hideAccordionBlock"
                class="accordion-block contact"
              >
                <ul>
                  <li>
                    <button
                      class="btn btn-cancel btn-short"
                      @click="deleteConnectionRequest()"
                    >
                      削除
                    </button>
                  </li>
                  <li>
                    <button
                      class="btn btn-basic btn-short"
                      @click="approvalConnection()"
                    >
                      承認
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <button
              class="btn btn-basic btn-middle btn-editProfile"
              @click="startChatGroup()"
            >
              メッセージを送る
            </button>
            <button
              v-if="companyUrlValue"
              class="btn btn-secondary btn-middle btn-editProfile"
              @click="showCompanyPage()"
            >
              企業ページを見る
            </button>
          </div>
        </div>
        <ul
          :class="{
            'is-mine': isMyProfile,
          }"
          class="profileNavi"
        >
          <li
            :class="{ 'is-act': showPageTab === 1 }"
            @click="changeShowPageTab(1)"
          >
            プロフィール
          </li>
          <li
            v-if="!isMyProfile"
            :class="{ 'is-act': showPageTab === 2 }"
            @click="changeShowPageTab(2)"
          >
            つながり<span>{{ profilePageConnection.length }}</span>
          </li>
          <li
            :class="{ 'is-act': showPageTab === 3 }"
            @click="changeShowPageTab(3)"
          >
            {{ profileData.basicSetting.lastName }}さんの投稿
          </li>
        </ul>

        <ProfileProfileTab
          v-show="showPageTab === 1"
          :is-my-profile="isMyProfile"
          @update="initFunc()"
        />
        <ProfileConnectTab v-show="showPageTab === 2" @update="initFunc()" />
        <TimeLineList
          v-show="showPageTab === 3"
          :all-view="false"
          :is-sp="isSp()"
        />
      </div>
    </div>

    <!-- /profileSettings -->
    <!-- /main-contents -->
    <!-- modal -->
    <ProfileImageUploadModal
      v-if="profileImageUploadModalState"
      :init-image="$common.getAssetsImgUrl(profileData.profileImage)"
      :spfileup="isSp()"
      @reflect="changeProfileImage($event)"
      @close="hideModal()"
    />
    <CoverImageUploadModal
      v-if="showCoverImageUploadModalState"
      :img-path="profileData.coverImageURL"
      :prop-record-version="profileData.recordVersion"
      :cover-type="0"
      @update="getProfile()"
      @close="hideCoverImageUploadModal()"
    />
    <CancelConfirmConnectionModal
      v-if="showCancelConfirmConnectionModalFlg"
      @reflect="deleteConnectionRequest()"
      @close="hideCancelConfirmConnectionModal()"
    />
    <!-- /modal -->
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'
import ProfileImageUploadModal from '~/components/community/profile/modal/ProfileImageUploadModal.vue'
import ProfileConnectTab from '~/components/community/profile/ProfileConnectTab.vue'
import ProfileProfileTab from '~/components/community/profile/ProfileProfileTab.vue'

export default {
  name: 'ProfileHeader',
  components: {
    ProfileImageUploadModal,
    ProfileProfileTab,
    ProfileConnectTab,
  },
  mixins: [communityCommonMixin, clickaway],
  props: {
    isMyProfile: {
      type: Boolean,
      default: true,
    }, // 自分のプロフィール、他人のプロフィール選択（確認用）
  },
  data() {
    return {
      profileData: {}, // プロフィールデータ
      imageData: {
        facebook: 'images/community/icon/icon-facebook.png',
        twitter: 'images/community/icon/icon-twitter.png',
        line: 'images/community/icon/icon-line.png',
        instagram: 'images/community/icon/icon-instagram.png',
      }, // SNS
      profileImageUploadModalState: false, // プロフィール写真用フラグ
      showAccordionBlock: false,
      showCoverImageUploadModalState: false,
    }
  },
  computed: {
    // プロフィール画面用store
    ...mapState('community/profileStore', [
      'showPageTab',
      'selectUserId',
      'profilePageConnection',
    ]),
    ...mapState('community/member', ['showCancelConfirmConnectionModalFlg']),
    /**
     * 会社URLの取得（null対策）
     */
    companyUrlValue() {
      const workHistory = this.profileData.workHistory || []

      return workHistory.length > 0 ? workHistory[0].url : ''
    },
    /**
     * 会社名の取得（null対策）
     */
    companyNameValue() {
      let workHistory =
        JSON.parse(JSON.stringify(this.profileData.workHistory)) || []
      let companyName = ''

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

          companyName = targetWork.company + ' ' + targetWork.position
        }
      }

      return companyName
    },
    profileImage() {
      return this.profileData.basicSetting.profileImage || ''
    },
    getCoverImage() {
      return () => {
        let backgroundImage = ''

        if (this.profileData.basicSetting.coverImageURL) {
          backgroundImage = this.profileData.basicSetting.coverImageURL
        } else {
          backgroundImage = require(`@/assets/images/community/bgImage/bg${String(
            this.profileData.basicSetting.backgroundId
          )}.png`)
        }

        return backgroundImage
      }
    },
  },
  watch: {},
  created() {},
  mounted() {
    if (!this.isMyProfile) {
      this.addBrowsingHistory()
    }
    this.initFunc()
  },
  methods: {
    ...mapMutations('community/member', [
      'showCancelConfirmConnectionModal',
      'hideCancelConfirmConnectionModal',
    ]),
    ...mapMutations('community/common', [
      'setProfile',
      'setShowProfileSettingsComponentFlg',
    ]),
    ...mapMutations('community/profileStore', [
      'setShowPageTab',
      'setProfilePageProfile',
      'setProfilePageConnection',
    ]),
    ...mapMutations('community/timeline', ['resetSearchParam']),
    ...mapMutations('community/message', [
      'setSelectGroupId',
      'setSelectStorageObjectId',
      'setShowMessageBlockFlg',
      'setShowMessageChatAreaFlg',
    ]),
    /**
     * 初期表示処理
     */
    initFunc() {
      this.$common.initScrollTop()
      this.changeShowPageTab(1)
      this.getProfile()
      this.resetSearchParam()
      this.mixin_getTargetUserTimeLineList(Number(this.$route.params.userId))

      // つながりプロフィール画面の場合は、つながり一覧APIを呼び出す
      if (!this.isMyProfile) {
        this.getConnectionList()
      }
    },
    /**
     * 閲覧履歴登録APIを呼び出す
     */
    addBrowsingHistory() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .addBrowsingHistory(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
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
     * 取得値確認
     */
    isValue(val) {
      if (val === undefined) {
        return false
      } else if (val === '') {
        return false
      } else {
        return true
      }
    },
    isValueArray(val) {
      if (Array.isArray(val)) {
        return true
      } else {
        return false
      }
    },
    /**
     * プロフィールjsonの取得
     */
    getProfile() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .getProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.profileData = resData.data.profile
            const profileData = JSON.parse(JSON.stringify(resData.data.profile))
            // nullで返ってきた文字列を空文字に変換

            this.$common.setNullConvertStringValue(profileData.basicSetting, [])
            this.$common.setNullConvertStringValue(
              profileData.selfIntroduction,
              []
            )
            this.$common.setNullConvertStringValue(profileData.social, [])

            // 配列で帰ってくるworkHistory, educationalBackground,qualification,publicationの処理

            for (const index in profileData.workHistory) {
              this.$common.setNullConvertStringValue(
                profileData.workHistory[index],
                []
              )
            }
            for (const index in profileData.educationalBackground) {
              this.$common.setNullConvertStringValue(
                profileData.educationalBackground[index],
                []
              )
            }
            for (const index in profileData.qualification) {
              this.$common.setNullConvertStringValue(
                profileData.qualification[index],
                []
              )
            }
            for (const index in profileData.publication) {
              this.$common.setNullConvertStringValue(
                profileData.publication[index],
                []
              )
            }

            this.setProfilePageProfile(profileData)
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
     * つながりリストの取得
     */
    getConnectionList() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .getConnectionList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setProfilePageConnection(resData.data.connectionList)
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
     * つながり申請
     */
    requestConnection() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .requestConnection(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initFunc()
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
     * つながり申請キャンセルAPI処理
     */
    cancelConnection() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .cancelConnection(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initFunc()
            this.showAccordionBlock = false
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
     * プロフィル写真
     */
    hideModal() {
      this.profileImageUploadModalState = false
    },
    /**
     * 表示タブ切り替え
     */
    changeShowPageTab(tabVal) {
      this.setShowPageTab(tabVal)
    },
    /**
     * 会社ページに遷移
     */
    showCompanyPage() {
      this.$router.push('/community/corporate/' + this.profileData.companyId)
    },
    /**
     * プロフィール編集コンポーネントに遷移
     */
    showProfileSettingsPage() {
      this.$common.initScrollTop()
      this.$router.push('/community/profile/edit/')
    },
    /**
     * 投稿表示設定更新API処理
     */
    updatePostDisplay(postDisplay) {
      const userId = Number(this.$route.params.userId)
      const paramData = {
        postDisplay,
      }

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .updatePostDisplay(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initFunc()
            this.showAccordionBlock = false
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    hideAccordionBlock() {
      this.showAccordionBlock = false
    },
    /**
     * つながりを承認(申請)
     */
    approvalConnection() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .approvalConnection(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initFunc()
            this.showAccordionBlock = false
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
     * つながり解除
     */
    deleteConnectionRequest() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteConnectionRequest(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getProfile()
            this.showAccordionBlock = false
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
     * カバー写真を変更ボタン押下処理
     */
    showCoverImageUploadModal() {
      this.showCoverImageUploadModalState = true
    },
    /**
     * 背景カバー写真モーダルの非表示
     */
    hideCoverImageUploadModal() {
      this.showCoverImageUploadModalState = false
    },
    /**
     * プロフィールイメージの変更
     */
    changeProfileImage(profileImage) {
      const paramData = JSON.parse(JSON.stringify(this.profileData))
      paramData.basicSetting.profileImage = profileImage

      this.$common.addCallApiNum()
      this.$api
        .updateProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getProfile()
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * メッセージグループ開始APIの呼び出し
     */
    startChatGroup() {
      const paramData = {
        memberIdList: [Number(this.$route.params.userId)],
      }

      this.$common.addCallApiNum()
      this.$api
        .startChatGroup(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setSelectGroupId(resData.data.messageGroupId)
            this.setSelectStorageObjectId(resData.data.storageObjectId)
            this.setShowMessageBlockFlg(true)
            this.setShowMessageChatAreaFlg(true)
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
     * SP判定
     */
    isSp() {
      if (window.matchMedia('(max-width: 896px)').matches) {
        return this.profileImageUploadModalState
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.main-contents {
  background: #fff;
}
.header {
  padding-bottom: 24px;
}
.profile-list {
  background: #fff;
}
.body-header {
  position: relative;
  margin-bottom: 33px;
  min-width: 716px;
  &-image {
    position: relative;
    width: 100%;
    height: 239px;
    background-size: cover !important;
    &-btnList {
      position: absolute;
      top: 183px;
      right: 16px;
      display: flex;
      justify-content: flex-end;
      > * {
        margin-right: 8px;
        &:last-child {
          margin-right: 0;
        }
      }
      .btn {
        &.connectionCancel {
          height: 40px;
          background: #e1e2e5;
          border: 1px solid #6c707e;
          .icon-cancel {
            width: 16px;
            height: 16px;
            margin-right: 6px;
          }
        }
        &.connectionContact {
          height: 40px;
          background: #fffae5;
          border: #ffcc00 1px solid;
          padding: 0 8px 0 12px;
          .icon {
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }
          .icon-check {
            fill: #34c759;
          }
          .icon-watch {
            fill: #ffcc00;
          }
        }
        &.connectionBoth {
          width: 130px;
          height: 40px;
          background: #f0fff4;
          border: #34c759 1px solid;
          .icon-check {
            fill: #34c759;
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }
        }
      }

      .icon-accessTimeFilled,
      .icon-checkCircle {
        margin-right: 5px;
      }
    }
    .btn-editProfile {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &-data {
    padding-left: 184px;
    position: relative;
    min-height: 67px;
    .name {
      padding-top: 16px;
      padding-right: 120px;
      font-size: 22px;
      font-weight: 500;
    }
    .companyName {
      font-size: 13px;
      color: #1e1e1e;
    }
  }
  &-profile {
    position: absolute;
    top: 159px;
    left: 8px;
    p {
      text-align: center;
      font-size: 22px;
    }
  }
  .connection-block {
    .icon {
      &.icon-more,
      &.icon-less {
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }
    .accordion-block {
      position: absolute;
      left: 0;
      padding: 24px 16px;
      background: #ffffff;
      box-shadow: 0px 1px 5px #00000029;
      border-radius: 6px;
      z-index: 10;
      &.contact {
        ul {
          display: flex;
          li {
            &:not(:last-child) {
              margin-right: 8px;
            }
          }
        }
      }
      ul {
        li {
          cursor: pointer;
          &:not(:last-child) {
            margin-bottom: 8px;
          }
          &.text-alert {
            color: #e60012;
          }
        }
      }
    }
  }
  .iconList {
    position: absolute;
    top: 250px;
    right: 0;
  }
  &-facePhotoWrap {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: #fff 4px solid;
    overflow: hidden;
    background: #ffffff;
    img {
      width: 100%;
      height: 100%;
    }
    .icon-account {
      width: 100%;
      height: 100%;
      fill: #b0b3be;
      transform: scale(1.2);
    }
  }
  .btn-camera {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8f9fa;
    position: absolute;
    top: 118px;
    left: 118px;
    cursor: pointer;
    :hover {
      fill: #bfc2ca;
    }
  }
}

.profileNavi {
  display: flex;
  width: 716px;
  margin: 0 auto 40px auto;
  &.is-mine li {
    width: 50%;
  }
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
    span {
      display: inline-block;
      padding-left: 4px;
      color: #8d8d8d;
    }
  }
}
.icon {
  &-camera {
    width: 28px;
    height: 28px;
  }
  &-expandMore {
    width: 27px;
    height: 21px;
  }
  &-checkCircle {
    fill: #34c759;
    width: 20px;
    height: 20px;
  }
  &-accessTimeFilled {
    fill: #ffcc00;
    width: 17px;
    height: 17px;
  }
}
.is-open {
  .icon-expandMore {
    transform: rotate(180deg);
  }
}
.is-more {
  display: none;
  &.is-view {
    display: block;
  }
}
// MQ
@include mq(sp) {
  .header {
    margin: 32px 16px;
    padding-bottom: 0;
  }
  .company {
    margin: 0 16px;
  }
  .body {
    &-header {
      margin: 25px 16px 0 16px;
      min-width: 0;
      &-profile {
        top: 155px;
        left: 0;
        width: 100%;
        height: 170px;
      }
      &-facePhotoWrap {
        margin: 0 auto;
      }
      .btn-camera {
        left: calc(50% + 40px);
      }
      &-data {
        padding-left: 0;
        text-align: center;
        padding-top: 70px;
        margin-bottom: 16px;
        min-height: 0;
        .name {
          padding-right: 0;
        }
      }
      &-image-btnList {
        position: static;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        > * {
          width: calc(50% - 4px);
          margin-right: 0;
          &:nth-child(3) {
            width: 100%;
            margin-top: 8px;
          }
        }
      }
      .iconList {
        position: static;
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
        a {
          margin: 0 4px;
        }
      }
    }
  }
  .profileNavi {
    width: 100%;
    font-size: 13px;
    li {
      padding: 13px 0;
    }
  }
}
// MQ
</style>
