<template>
  <div class="header">
    <div class="header-logo">
      <HeaderLogo />
    </div>
    <div class="header-nav">
      <div class="header-nav-item">
        <div class="header-nav-item-icon" @click="showNotificationDialog()">
          <UnreadNotificationsSVG
            v-if="$common.checkArrayValue(notificationList)"
            class="icon icon-unreadNotifications"
          />
          <NotificationsSVG v-else class="icon icon-notifications" />
          <span class="text">通知</span>
        </div>
        <div class="header-nav-item-icon">
          <button @click="nemuFlug = !nemuFlug">
            <DehazeSVG class="icon-dehaze" />
          </button>
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

        <div class="sidemenu-wrap" :class="{ 'is-act': nemuFlug }">
          <div class="sidemenu">
            <div class="sidemenu-bglay" @click="nemuFlug = false"></div>
            <div class="sidemenu-content">
              <div class="sidemenu-header">
                <MainLogoSVG />
                <button @click="nemuFlug = !nemuFlug">
                  <CloseSVG class="icon-close" />
                </button>
              </div>
              <div class="sidemenu-body">
                <div @click="transitionServiceLauncher()">
                  <AppsSVG class="header-nav-item-icon icon-apps" />
                  <span class="header-nav-item-text">サービス</span>
                </div>
                <a href="https://help.bizsky.io/" target="_blank">
                  <HeaderHelpSVG class="header-nav-item-icon icon-apps" />
                  <span class="header-nav-item-text">ヘルプセンター</span>
                </a>
              </div>
              <div class="sidemenu-aside">
                <a
                  v-for="data in asideData"
                  :key="data.link"
                  :href="data.link"
                  target="_blank"
                  ><span>{{ data.label }}<LaunchSVG class="icon-launch" /></span
                ></a>
              </div>
              <div class="sidemenu-logout">
                <button class="btn btn-secondary btn-long" @click="exeLogout()">
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'CommonHeaderSP',
  mixins: [clickaway],
  data() {
    return {
      showNotificationDialogFlg: false,
      nemuFlug: false,
      asideData: [
        {
          link: 'https://www.bizsky.io/terms/',
          label: '利用規約',
        },
        {
          link: 'https://www.bizsky.io/privacy-policy/',
          label: '個人情報保護方針',
        },
        {
          link: 'https://help.bizsky.io/environment.html',
          label: '推奨環境',
        },
      ],
      windowWidth: null,
    }
  },
  computed: {
    ...mapState('common', ['notificationList']),
  },
  methods: {
    ...mapMutations('common', ['setNotificationList']),
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
     * サービスランチャー画面に遷移
     */
    transitionServiceLauncher() {
      this.$router.push('/launcher/')
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
@import '~assets/styles/scss/sp/mediaQuery.scss';
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px #e5e5e5 solid;
  &-nav-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &-icon {
      margin-right: 8px;
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      .text {
        font-size: 12px;
      }
    }
  }
}
.sidemenu {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000;
  &-wrap {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  &-bglay {
    position: absolute;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &-content {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    background: #ffffff;
    width: 295px;
    height: 100vh;
    transform: translate(100vw, 0);
    transition: transform 0.3s ease-in;
  }
  &-header {
    height: 64px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px #e5e5e5 solid;
  }
  &-body {
    margin: 0 16px;
    padding: 24px 8px;
    border-bottom: 1px #e5e5e5 solid;
    font-size: 15px;
    & > * {
      height: 48px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      & > * {
        display: flex;
        align-items: center;
      }
    }
  }
  &-aside {
    margin: 0 16px;
    padding: 24px 0;
    font-size: 13px;
    a {
      display: block;
      height: 44px;
      display: flex;
      align-items: ceter;
      padding: 0 8px;
    }
  }
  &-logout {
    position: absolute;
    bottom: 0;
    margin: 24px;
    width: calc(100% - 24px - 24px);
  }
}
.notification-dialog {
  position: absolute;
  top: 65px;
  right: 0;
  background: #ffffff;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 24px;
  z-index: 100;
  .notification-text {
    width: 335px;
    max-width: 100%;
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
.is-act {
  &.sidemenu-wrap {
    pointer-events: auto;
  }
  .sidemenu {
    &-bglay {
      opacity: 1;
    }
    &-content {
      transform: translate(0, 0);
    }
  }
}
.icon-dehaze,
.icon-close {
  width: 24px;
  height: 24px;
}
.icon-apps {
  width: 24px;
  height: 24px;
}
.icon-accountCircle {
  width: 24px;
  height: 24px;
}
.icon-launch {
  width: 16px;
  height: 16px;
  fill: #1e1e1e;
  margin-left: 8px;
}
</style>
