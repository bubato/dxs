<template>
  <div class="community">
    <!-- side -->
    <CommonSideNav class="is-pc" />
    <!-- /side -->
    <!-- main -->
    <div class="main" :class="['main', { 'is-side-close': !sideNavIsOpen }]">
      <CommonHeader v-if="Object.keys(masterData).length > 0" class="is-pc" />
      <CommonHeaderSP v-if="Object.keys(masterData).length > 0" class="is-sp" />
      <div
        :class="[{ 'is-viewMessage': showMessageBlockFlg }]"
        class="community-contents"
      >
        <div
          :class="[
            { 'show-scroll': $common.checkShowScrollBar() },
            { 'exe-scroll': showScrollbarFlg },
            { 'main-container': isPCView },
          ]"
          class="scrollKey communityMain-container"
        >
          <Nuxt
            v-if="
              Object.keys(masterData).length > 0 &&
              Object.keys(myProfile).length > 0
            "
            :nuxt-child-key="$route.fullPath"
            :is-pc-view="isPCView"
          />
        </div>
        <CommunitySideNav class="is-pc" />
        <CommunityToolBar v-if="sideNavData['community']" class="is-sp" />
      </div>
      <MessageComponent />
      <CompletePopAlert />
    </div>
    <!-- /main -->
    <div
      class="hidden_sidebar is-pc"
      :class="[{ 'exe-scroll': showScrollbarFlg }]"
    ></div>
    <CommonErrorModal
      v-if="showCommonErrorModalFlg"
      @close="hideCommonErrorModal()"
    />
    <LoadingScreen v-if="callApiNum > 0" />
    <AreaLabel />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'
import CommonSideNav from '~/components/common/CommonSideNav.vue'
import CommonHeader from '~/components/common/CommonHeader.vue'
import CommonHeaderSP from '~/components/common/CommonHeaderSP.vue'
import CommunitySideNav from '~/components/community/CommunitySideNav.vue'
import CommunityToolBar from '~/components/community/CommunityToolBar.vue'

export default {
  components: {
    CommonSideNav,
    CommonHeader,
    CommonHeaderSP,
    CommunitySideNav,
    CommunityToolBar,
  },
  mixins: [communityCommonMixin],
  middleware: ['scrollTopDefault', 'checkAuth'],
  data() {
    return {
      spHtmlClass: '',
      isPCView: false,
      timer: {},
      showScrollbarFlg: false,
      defaultShowScrollFlg: false,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('common', [
      'sideNavIsOpen',
      'callApiNum',
      'masterData',
      'showCommonErrorModalFlg',
      'sideNavData',
    ]),
    ...mapState('community/searchResult', ['connectionSearchText']),
    ...mapState('community/timeline', ['timeLineList', 'maxTimeLineNum']),
    ...mapState('community/profileStore', ['showPageTab']),
    ...mapState('community/message', ['showMessageBlockFlg']),
    ...mapState('community/group', ['showGroupPageTab']),
  },
  created() {
    this.mixin_getMyProfile()

    if (this.$route.path !== '/community/member/') {
      this.getRequestConnectionList()
    }
    if (this.$route.path !== '/community/message/') {
      this.mixin_getRecentlyMessageList()
    }
  },
  mounted() {
    this.setScrollEvent() // スクロールイベントの設定

    // MQ
    this.$nextTick(() => {
      const mql = window.matchMedia(this.$style.breakpoint)
      this.func(mql)
      mql.addListener(this.func)
    })
    // MQ

    if (!this.isPCView) {
      this.spHtmlClass = 'spBody'
    }
  },
  methods: {
    ...mapMutations('common', ['hideCommonErrorModal']),
    ...mapMutations('community/common', [
      'setMyConnectionRequestList',
      'setIsPCSize',
    ]),
    ...mapMutations('community/timeline', ['setNextDataSearchParam']),
    // MQ
    func(mql) {
      this.isPCView = mql.matches
      this.setIsPCSize(mql.matches)
    },
    /**
     * スクロールイベントの設定
     */
    setScrollEvent() {
      document.querySelector('.scrollKey').onscroll = () => {
        const targetEle = document.querySelector('.scrollKey')

        if (
          (['/community/timeline/', '/community/group/'].includes(
            this.$route.path
          ) ||
            (this.$route.path.includes('/community/profile/') &&
              this.showPageTab === 3) ||
            this.$route.path === '/community/group/' ||
            (this.$route.path.includes('/community/group/') &&
              this.$route.params.groupId &&
              this.showGroupPageTab === 1)) &&
          this.maxTimeLineNum !== this.timeLineList.length &&
          this.callApiNum === 0 &&
          targetEle.scrollHeight <
            targetEle.scrollTop + targetEle.offsetHeight + 200
        ) {
          this.setNextDataSearchParam()

          if (this.$route.path === '/community/timeline/') {
            this.mixin_getTimeLineList()
          } else if (this.$route.path.includes('/community/profile/')) {
            this.mixin_getTargetUserTimeLineList(this.$route.params.userId)
          } else if (this.$route.path === '/community/group/') {
            this.mixin_getPostGroupRecentTimeLine()
          } else if (
            this.$route.path.includes('/community/group/') &&
            this.$route.params.groupId
          ) {
            this.mixin_getPostGroupTimeLine()
          }
        }

        this.showScrollbar()
      }
    },
    /**
     * スクロールバーの表示
     */
    showScrollbar() {
      this.showScrollbarFlg = true

      // timer解除
      clearTimeout(this.timer)
      this.timer = setTimeout(
        function () {
          this.showScrollbarFlg = false
        }.bind(this),
        '1000'
      )
    },
    /**
     * つながり申請承認待ち一覧取得処理
     */
    getRequestConnectionList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getRequestConnectionList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMyConnectionRequestList(
              resData.data.connectionRequestList || []
            )
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
  head() {
    return {
      htmlAttrs: {
        class: this.spHtmlClass,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.community {
  .main {
    position: relative;
    background-color: #ffffff;
    .community-contents {
      background: #ffffff;
    }
  }
  .hidden_sidebar {
    background: #ffffff;
  }
}
@include mq(pc) {
  //PCView
  .is-sp {
    display: none;
  }
  .community {
    display: flex;
    .main {
      position: relative;
      width: calc(100% - 250px);
      &.is-side-close {
        width: calc(100% - 56px);
      }

      .main-container {
        width: calc(100% - 280px);
      }

      .community-contents {
        display: flex;
        justify-content: space-between;
        padding-right: 40px;
      }
    }
  }
}
@include mq(sp) {
  *::-webkit-scrollbar {
    display: none;
  }
  .community-contents.is-viewMessage {
    display: none;
  }
  //SPView
  .is-pc {
    display: none;
  }
  .community {
    width: 100%;

    .main {
      width: 100%;
      .main-container {
        width: 100%;
      }
      &.is-side-close {
        width: 100%;
      }
    }
  }
  .community-contents {
    width: 100%;
  }
  .community .main .main-container {
    padding: 0;
    height: 100vh;
    overflow: auto;
    text-shadow: none;
  }
  .main-container::-webkit-scrollbar,
  .main-container::-webkit-scrollbar-thumb {
    border: none;
    width: auto;
    background-clip: content-box;
    border-radius: 0;
    box-shadow: none;
    scrollbar-base-color: transparent;
    scrollbar-arrow-color: transparent;
  }
}
</style>
<style lang="postcss" module>
@value breakpoint: (min-width: 897px);
</style>
