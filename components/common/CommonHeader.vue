<template>
  <div class="header" :class="{ 'show-logo': showLogo }">
    <HeaderLogo v-if="showLogo" />
    <div class="header-nav">
      <div class="header-nav-item">
        <a
          class="header-nav-item-icon"
          href="https://help.bizsky.io/"
          target="_blank"
        >
          <HeaderHelpSVG class="icon-apps" />
          <span class="text">ヘルプ</span>
        </a>
      </div>
      <div class="header-nav-item">
        <div class="header-nav-item-icon" @click="transitionServiceLauncher()">
          <AppsSVG class="icon-apps" />
          <span class="text">サービス</span>
        </div>
      </div>
      <div class="header-nav-item">
        <div class="header-nav-item-icon" @click="showNotificationDialog()">
          <UnreadNotificationsSVG
            v-if="$common.checkArrayValue(notificationList)"
            class="icon icon-unreadNotifications"
          />
          <NotificationsSVG v-else class="icon icon-notifications" />
          <span class="text">通知</span>
        </div>
        <div
          v-if="showNotificationDialogFlg"
          v-on-clickaway="hideNotificationDialog"
          class="notification-dialog"
        >
          <template v-if="!$common.checkArrayValue(notificationList)">
            <p class="notification-text">現在通知はありません。</p>
          </template>
          <template v-else>
            <ul class="notification-list">
              <li v-for="(data, index) in notificationList" :key="index">
                <p class="date">{{ data.date }}</p>
                <p class="link" @click="readNotification('single', data)">
                  {{ data.noticeMessage }}
                </p>
              </li>
            </ul>
            <div class="buttons">
              <button
                class="btn btn-secondary btn-middle"
                @click="readNotification('all')"
              >
                すべての通知を既読
              </button>
            </div>
          </template>
        </div>
      </div>
      <div class="header-nav-item">
        <div class="header-nav-item-icon" @click="showAccountDialog()">
          <AccountCircleSVG class="icon icon-accountCircle" />
          <span class="text">アカウント</span>
        </div>
        <div
          v-if="showAccountDialogFlg"
          v-on-clickaway="hideAccountDialog"
          class="account-dialog"
        >
          <p class="tenantId">テナントID:{{ masterData.tenantId }}</p>
          <div class="profile">
            <AccountCircleSVG class="icon icon-accountCircle" />
            <p>{{ masterData.lastName }} {{ masterData.firstName }}</p>
          </div>
          <ul class="menu-list">
            <li @click="transitionEditAccount()">アカウント情報の編集</li>
            <li @click="transitionResetPassword()">パスワードの変更</li>
            <li @click="exeLogout()">ログアウト</li>
          </ul>
        </div>
      </div>
    </div>
    <EditAccountInfoModal
      v-if="showEditAccountInfoModalFlg"
      @close="hideEditAccountInfoModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'CommonHeader',
  mixins: [clickaway],
  props: {
    showLogo: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      showNotificationDialogFlg: false,
      showAccountDialogFlg: false,
    }
  },
  computed: {
    ...mapState('common', [
      'masterData',
      'notificationList',
      'showEditAccountInfoModalFlg',
    ]),
  },
  created() {
    this.getNotificationList()
    this.$common.chatUnreadMessagesPolling() // チャット未読確認用ポーリング
  },
  methods: {
    ...mapMutations('common', [
      'setNotificationList',
      'showEditAccountInfoModal',
      'hideEditAccountInfoModal',
    ]),
    /**
     * サービスランチャー画面に遷移
     */
    transitionServiceLauncher() {
      this.$router.push('/launcher/')
    },
    /**
     * 通知モーダルの表示
     */
    showNotificationDialog() {
      this.showNotificationDialogFlg = true
    },
    /**
     * 通知モーダルの非表示
     */
    hideNotificationDialog() {
      this.showNotificationDialogFlg = false
    },
    /**
     * 通知リストの取得
     */
    getNotificationList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getNotificationList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setNotificationList(resData.data.notificationList)
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
     * 既読を付けて、通知のリンク先に遷移
     */
    readNotification(type, selectNoticeData) {
      const paramData = this.getReadNotificationParamData(
        type,
        selectNoticeData
      )

      this.$common.addCallApiNum()
      this.$api
        .readNotification(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getNotificationList()
            this.hideNotificationDialog()
            if (type === 'single' && selectNoticeData.path !== '') {
              this.$router.push(selectNoticeData.path)
            }
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
     * 通知既読APIのリクエストパラメータの取得
     */
    getReadNotificationParamData(type, selectNoticeData) {
      const paramData = {
        dataList: [],
      }

      if (type === 'all') {
        for (let i = 0; i < this.notificationList.length; i++) {
          paramData.dataList.push({
            id: this.notificationList[i].id,
            recordVersion: this.notificationList[i].recordVersion,
          })
        }
      } else if (type === 'single') {
        paramData.dataList.push({
          id: selectNoticeData.id,
          recordVersion: selectNoticeData.recordVersion,
        })
      }

      return paramData
    },
    /**
     * アカウントモーダルの表示
     */
    showAccountDialog() {
      this.showAccountDialogFlg = true
    },
    /**
     * アカウントモーダルの非表示
     */
    hideAccountDialog() {
      this.showAccountDialogFlg = false
    },
    /**
     * アカウント編集画面に遷移
     */
    transitionEditAccount() {
      this.hideAccountDialog()
      this.showEditAccountInfoModal()
    },
    /**
     * パスワード変更画面を別タブにて表示
     */
    transitionResetPassword() {
      this.hideAccountDialog()
      window.open('/passwordChange/', '_blank')
    },
    /**
     * ログアウト処理
     */
    exeLogout() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .exeLogout(paramData)
        .then((resData) => {
          if (!resData.data.proxyLogin) {
            this.$store.dispatch('auth/logout') // cognito認証情報の削除
          }
          this.$common.clearUnreadMessagesPolling()
          this.$router.push('/login/')
          this.hideAccountDialog()
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          console.log(error)
          this.$store.dispatch('auth/logout') // cognito認証情報の削除
          this.$router.push('/login/')
          this.hideAccountDialog()
          this.$common.subCallApiNum()
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 80px;
  padding: 0 40px;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
  &.show-logo {
    justify-content: space-between;
  }
  &-nav {
    display: flex;
    align-items: center;
    &-item {
      position: relative;
      &:not(:last-child) {
        margin-right: 16px;
      }
      &-icon {
        display: flex;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        .text {
          font-size: 12px;
        }
      }
      .notification-dialog {
        position: absolute;
        right: 0;
        background: #ffffff;
        box-shadow: 0px 1px 5px #00000029;
        border-radius: 6px;
        padding: 24px;
        z-index: 100;
        .notification-text {
          width: 335px;
          text-align: center;
        }
        .notification-list {
          width: 335px;
          max-height: 394px;
          overflow: auto;
          li {
            padding: 17px 0 21px 0;
            border-bottom: 1px solid #e5e5e5;
            .date {
              color: #8a8a8e;
              font-size: 13px;
            }
            .link {
              margin-top: 10px;
              text-decoration: underline;
              cursor: pointer;
              &:hover {
                text-decoration: none;
              }
            }
          }
        }
        .buttons {
          display: flex;
          justify-content: center;
          padding-top: 24px;
        }
      }
      .account-dialog {
        width: 192px;
        position: absolute;
        right: 0;
        background: #ffffff;
        box-shadow: 0px 1px 5px #00000029;
        border-radius: 6px;
        padding: 16px 16px 24px 16px;
        z-index: 100;
        .tenantId {
          padding: 8px 0 24px 0;
          text-align: center;
        }
        .profile {
          display: flex;
          align-items: center;
          flex-direction: column;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
          .icon {
            width: 48px;
            height: 48px;
            margin-bottom: 8px;
          }
        }
        .menu-list {
          padding-top: 16px;
          li {
            cursor: pointer;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
