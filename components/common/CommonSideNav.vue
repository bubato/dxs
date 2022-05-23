/* eslint-disable no-irregular-whitespace */
<template>
  <div class="side" :class="[{ 'is-open': sideNavIsOpen }]">
    <div v-if="sideNavIsOpen">
      <div class="side-nav-top">
        <HeaderLogo />
      </div>
      <div
        v-for="(sideNav, index1) in currentSideNav"
        :key="index1"
        class="side-nav-block"
      >
        <div class="side-nav-heading">
          <WebsiteIconSVG
            v-if="sideNav.name === 'Webサイト'"
            class="side-nav-heading-icon icon-web"
          />
          <FormIconSVG
            v-if="sideNav.name === 'フォーム'"
            class="side-nav-heading-icon icon-communication"
          />
          <ComputerSVG
            v-if="sideNav.name === 'コミュニケーション'"
            class="side-nav-heading-icon icon-communication"
          />
          <CommunityIconSVG
            v-if="sideNav.name === 'コミュニティ'"
            class="side-nav-heading-icon icon-community"
          />
          <AccountIconSVG
            v-if="sideNav.name === 'アカウント'"
            class="side-nav-heading-icon icon-account"
          />
          <CashFlowIconSVG
            v-if="sideNav.name === 'キャッシュフローマネジメント'"
            class="side-nav-heading-icon icon-cfm"
          />
          <MmiIconSVG
            v-if="sideNav.name === 'MMI'"
            class="side-nav-heading-icon icon-mmi"
          />
          <StorageIconSVG
            v-if="sideNav.name === 'ストレージ'"
            class="side-nav-heading-icon icon-storage icon-storage"
          />
          <ContactIconSVG
            v-if="sideNav.name === 'コンタクト'"
            class="side-nav-heading-icon icon-contact"
          />
          <MailIconSVG
            v-if="sideNav.name === 'メール'"
            class="side-nav-heading-icon icon-contact"
          />
          <StarSVG
            v-if="sideNav.name === 'よく使う機能'"
            class="side-nav-heading-icon icon-useful icon-star"
          />
          <PushPinSVG
            v-if="sideNav.name === 'ピン'"
            class="side-nav-heading-icon icon-pin icon-pushPin"
          />
          <span class="side-nav-heading-text">{{ sideNav.name }}</span>
        </div>
        <ul class="side-nav">
          <li
            v-for="nav in sideNav.link"
            :key="nav.name"
            :class="[
              'side-nav-item',
              { 'side-nav-item-current': checkNavItemCurrent(nav.path) },
            ]"
          >
            <template
              v-if="
                (nav.path === '/account/connect/' &&
                  masterData.firmKind === '0') === false &&
                (nav.path === '/account/invitation/' &&
                  masterData.activateStatus === false) === false &&
                (nav.path === '/account/invitation/' &&
                  masterData.firmKind === '0') === false
              "
            >
              <div v-if="nav.path">
                <nuxt-link :to="nav.path"
                  >{{ nav.name }}
                  <span
                    v-if="
                      nav.name === 'つながり' &&
                      $common.checkArrayValue(myConnectionRequestList)
                    "
                    class="notice-pop"
                    >{{ myConnectionRequestList.length }}</span
                  >
                  <span
                    v-if="
                      nav.name === 'メッセージ' &&
                      $common.checkArrayValue(getUnreadMessageList())
                    "
                    class="notice-pop"
                    >{{ getUnreadMessageList().length }}</span
                  ></nuxt-link
                >
              </div>
              <div v-else class="side-nav-item-drop">
                <a @click="nav.isOpen = !nav.isOpen"
                  >{{ nav.name
                  }}<ExpandLessSVG
                    v-if="nav.isOpen"
                    class="icon icon-expandLess"
                  />
                  <ExpandMoreSVG
                    v-if="!nav.isOpen"
                    class="icon icon-expandMore"
                  />
                </a>
                <ul v-show="nav.isOpen" class="side-nav-item-drop-child">
                  <li
                    v-for="childNav in nav.childPath"
                    :key="childNav.name"
                    :class="[
                      'side-nav-item',
                      {
                        'side-nav-item-current': checkNavItemCurrent(
                          childNav.path
                        ),
                      },
                    ]"
                  >
                    <nuxt-link :to="childNav.path">{{
                      childNav.name
                    }}</nuxt-link>
                  </li>
                </ul>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="side-nav-menu" @click="toggleSideNav()">
      <TopImageS v-show="!sideNavIsOpen" />
      <MenuSVG class="side-nav-menu-img icon-menu" />
    </div>
    <button class="side-btn-toggle" @click="toggleSideNav()">
      <KeyBoardTabSVG class="icon-keyBoardTab" />
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CommonSideNav',
  props: {},
  data() {
    return {
      currentSideNav: [],
      pageKind: '',
      windowWidth: null,
    }
  },
  computed: {
    ...mapState('common', ['sideNavIsOpen', 'sideNavData', 'masterData']),
    ...mapState('community/common', ['myConnectionRequestList']),
    ...mapState('community/message', ['recentGroupList']),
    ...mapState('mmi/companyReport', ['companyMasterInfo']),
    checkDefaultActive() {
      return (navPath) => {
        let result = false
        const path1 =
          this.$route.path.slice(-1) !== '/'
            ? this.$route.path + '/'
            : this.$route.path

        if (path1 === navPath) {
          result = true
        }

        return result
      }
    },
    getSideNaviItems() {
      return () => {
        const sideNavData = this.sideNavData[this.pageKind]
          ? JSON.parse(
              JSON.stringify(this.sideNavData[this.pageKind].sideNaviItems)
            )
          : []

        return sideNavData
      }
    },
    checkNavItemCurrent() {
      return (navPath) => {
        const currentPath =
          this.$route.path.slice(-1) === '/'
            ? this.$route.path
            : this.$route.path + '/'
        let result = currentPath.includes(navPath)

        if (!result) {
          switch (navPath) {
            case '/form/list/':
              if (
                currentPath.includes('/form/edit/') ||
                currentPath.includes('/form/answer/')
              ) {
                result = true
              }
              break
            case '/cashFlowManagement/forecastReport/':
              if (
                currentPath.includes(
                  '/cashFlowManagement/forecastReport/simulationResults/'
                )
              ) {
                result = true
              }
              break
            case '/community/profile/':
              if (
                currentPath.includes('/community/profile/edit/') ||
                currentPath.includes('/community/corporate/')
              ) {
                result = true
              }
              break
            case '/contact/list/':
              if (currentPath.includes('/contact/edit/')) {
                result = true
              }
              break
            case '/contact/create/manual/':
              if (currentPath.includes('/contact/create/import/')) {
                result = true
              }
              break
            case '/account/users/':
              if (currentPath.includes('/account/users/edit/')) {
                result = true
              }
              break

            case '/storage/home/':
              if (currentPath.includes('/storage/searchResults/')) {
                result = true
              }
              break
            case '/mail/list/':
              if (currentPath.includes('/mail/edit/')) {
                result = true
              }
              break
            default:
              break
          }
        }

        return result
      }
    },
    /**
     * メッセージの未読者数の取得
     *
     * @return {number} メッセージの未読者数
     */
    getUnreadMessageList() {
      return () => {
        const unreadMessageList = this.recentGroupList.filter((data) => {
          return data.unreadFlag
        })

        return unreadMessageList
      }
    },
  },
  watch: {
    $route(to, from) {
      this.getSideNavData() // サイドナビゲーションの取得
    },
  },
  mounted() {
    this.getSideNavData() // サイドナビゲーションの取得
    this.toggleWindowWidthSideNav()
    window.addEventListener('resize', this.toggleWindowWidthSideNav)
  },
  methods: {
    ...mapMutations('common', ['showSideNav', 'hideSideNav', 'setSideNavData']),
    getSideNavData() {
      let callFunc = ''
      let responseFilter = (data) => {
        return data
      }
      this.pageKind = this.$route.path.split('/')[1]

      if (
        this.sideNavData[this.pageKind] &&
        !['cashFlowManagement', 'mmi'].includes(this.pageKind)
      ) {
        this.currentSideNav = JSON.parse(
          JSON.stringify(this.sideNavData[this.pageKind].sideNaviItems)
        )
        return
      }

      switch (this.pageKind) {
        case 'site':
          callFunc = 'getCmsSideNav'
          break
        case 'account':
          callFunc = 'getAccountSideNav'
          break
        case 'communication':
          callFunc = 'getCommunicationSideNav'
          break
        case 'form':
          callFunc = 'getFormSideNav'
          break
        case 'community':
          callFunc = 'getCommunitySideNav'
          break
        case 'contact':
          callFunc = 'getContactSideNav'
          break
        case 'mail':
          callFunc = 'getMailSideNav'
          break
        case 'cashFlowManagement':
          callFunc = 'getCfmSideNav'
          break
        case 'mmi':
          callFunc = 'getMmiSideNav'
          responseFilter = this.filterMmiNavData
          break
        case 'storage':
          callFunc = 'getStorageSideNav'
          break
        default:
          break
      }

      const requestParams = {}

      if (this.pageKind === 'mmi' && this.companyMasterInfo) {
        if (this.$common.checkArrayValue(this.companyMasterInfo.dataList)) {
          requestParams.companyType = this.companyMasterInfo.dataList[0].corporateType
          requestParams.countCompanyMaster = this.companyMasterInfo.dataList.length
        }
      }

      this.$api[callFunc](requestParams)
        .then((result) => {
          const resSideNavData = responseFilter(result.data)
          const showSideNavData = this.getShowDefaultOpenSideMenu(
            resSideNavData
          )
          const sideNavData = JSON.parse(JSON.stringify(this.sideNavData))

          sideNavData[this.pageKind] = showSideNavData
          this.setSideNavData(sideNavData)

          this.currentSideNav = JSON.parse(
            JSON.stringify(this.sideNavData[this.pageKind].sideNaviItems)
          )
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    filterMmiNavData(data) {
      if (data.result !== 0) {
        return {}
      }

      const naviItems = data.sideNaviItems
      if (!naviItems) {
        return {}
      }

      return {
        sideNaviItems: naviItems.map((items) => {
          return {
            name: items.name,
            link: items.link.map((link) => {
              if (link.link) {
                return {
                  name: link.name,
                  isOpen: true,
                  childPath: link.link,
                }
              }

              return {
                name: link.name,
                path: link.path,
              }
            }),
          }
        }),
      }
    },
    getShowDefaultOpenSideMenu(sideNavData) {
      const showSideNavData = JSON.parse(JSON.stringify(sideNavData))

      for (let i = 0; i < showSideNavData.sideNaviItems.length; i++) {
        for (let j = 0; j < showSideNavData.sideNaviItems[i].link.length; j++) {
          if (showSideNavData.sideNaviItems[i].link[j].childPath) {
            for (
              let k = 0;
              k < showSideNavData.sideNaviItems[i].link[j].childPath.length;
              k++
            ) {
              if (
                showSideNavData.sideNaviItems[i].link[j].childPath[k].path ===
                this.$route.path
              ) {
                showSideNavData.sideNaviItems[i].link[j].isOpen = true
                break
              }
            }
          }
        }
      }

      return showSideNavData
    },
    toggleWindowWidthSideNav() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth < 1279) {
        this.hideSideNav()
      } else {
        this.showSideNav()
      }
    },
    toggleSideNav() {
      if (this.sideNavIsOpen) {
        this.hideSideNav()
      } else {
        this.showSideNav()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.side {
  width: 56px;
  height: 100vh;
  position: relative;
  border-right: 1px solid #eaeaea;
  transition: all 200ms 0s ease;
  overflow: hidden;
  background-color: #ffffff;
  z-index: 20;
  &.is-open {
    width: 250px;
    .side-btn-toggle {
      right: 25px;
      transform: scale(-1, 1);
    }
  }
  &-logo {
    width: 128px;
    height: 40px;
    margin: 32px 0 0 32px;
    background-color: gray;
    transition: all 200ms 0s ease;
    &:not(.is-open) {
      width: 40px;
      height: 40px;
      margin: 32px 0 0 8px;
    }
  }
  &-nav {
    margin-top: 24px;
    &-top {
      padding: 32px 0 0 32px;
    }
    &-heading {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 32px 0 0 32px;
      &-text {
        font-size: 17px;
        padding-right: 25px;
      }
      &-icon {
        width: 32px;
        height: 32px;
        min-width: 32px;
        margin: 0 8px 0 0;
        &.icon-pin {
          transform: rotate(30deg);
        }
      }
    }
    &-item {
      a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        padding-left: 32px;
        position: relative;
        .icon {
          margin-right: 16px;
        }
        &:hover {
          background-color: #ebeced;
        }
      }

      &-drop {
        &-child {
          a {
            padding-left: 50px;
          }
        }
      }
      &-current {
        background-color: #ebeced;
      }
    }
    &-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 32px;
      fill: #3a435c;
      cursor: pointer;
      &-img {
        margin-top: 24px;
      }
    }
  }
  &-btn-toggle {
    position: absolute;
    bottom: 25px;
    right: 17px;
    fill: #3a435c;
    outline: none;
  }
  .notice-pop {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-right: 24px;
    width: 32px;
    height: 24px;
    font-size: 13px;
    color: #ffffff;
    background: #4f7df0 0% 0% no-repeat padding-box;
    border-radius: 12px;
  }
}
</style>
