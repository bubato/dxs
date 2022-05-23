<template>
  <div class="layout">
    <!-- side -->
    <CommonSideNav v-if="isAuthorized" />
    <!-- /side -->
    <!-- main -->
    <div class="main" :class="['main', { 'is-side-close': !sideNavIsOpen }]">
      <CommonHeader v-if="Object.keys(masterData).length > 0 && isAuthorized" />
      <div class="main-container" :class="[{ 'exe-scroll': showScrollbarFlg }]">
        <Nuxt v-if="Object.keys(masterData).length > 0 && isAuthorized" />
      </div>
      <CompletePopAlert />
    </div>
    <!-- /main -->
    <CompleteFuncModal
      v-if="showCompleteFuncModalFlg"
      @close="hideCompleteFuncModal()"
    />
    <CommonErrorModal
      v-if="showCommonErrorModalFlg"
      @close="hideCommonErrorModal()"
    />
    <LoadingScreen v-if="callApiNum > 0" />
    <IncompleteBasicSettingsModal
      v-if="showIncompleteBasicSettingsModalState"
      @close="$common.getBasicSettingCompleteStatus()"
    />
    <AreaLabel />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonSideNav from '~/components/common/CommonSideNav.vue'
import CommonHeader from '~/components/common/CommonHeader.vue'
import companyInfoUtilityMixin from '~/mixin/mmi/companyInfoUtility.js'

export default {
  components: {
    CommonSideNav,
    CommonHeader,
  },
  mixins: [companyInfoUtilityMixin],
  middleware: ['scrollTopDefault', 'checkAuth'],
  data() {
    return {
      timer: {},
      showScrollbarFlg: false,
      defaultShowScrollFlg: false,
      isAuthorized: false,
    }
  },
  computed: {
    ...mapState('common', [
      'sideNavIsOpen',
      'callApiNum',
      'masterData',
      'showCompleteFuncModalFlg',
      'showCommonErrorModalFlg',
      'showIncompleteBasicSettingsModalState',
    ]),
    ...mapState('mmi/companyReport', ['companyMasterInfo']),
  },
  watch: {
    $route(to, from) {
      if (to) {
        if (to.path === 'mmi/activate') {
          this.isAuthorized = true // 認証クリア
          return
        }
      }
      this.isAuthorized = false // 認証クリア
      this.getMmiActivatedState() // アクティベート確認APIの呼び出し
    },
  },
  created() {
    this.output('MMI共通レイアウトレイアウト 表示開始')
    this.getMmiActivatedState() // アクティベート確認APIの呼び出し
  },
  mounted() {
    document
      .querySelector('.main-container')
      .addEventListener('scroll', this.showScrollbar)
  },
  methods: {
    ...mapMutations('common', [
      'hideCompleteFuncModal',
      'hideCommonErrorModal',
    ]),
    ...mapMutations('mmi/companyReport', ['setCompanyMasterInfo']),
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
     * アクティベート確認APIの呼び出し
     */
    getMmiActivatedState() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.output('API アクティベート確認 開始')
      this.$api
        .getMmiActivatedState(paramData)
        .then((res) => {
          this.output('API アクティベート確認 終了')
          if (res.data.result === 0) {
            if (res.data.isActivate) {
              this.getCompanyMasterInfo() // 会社マスタ取得APIの呼び出し
            } else {
              this.onUnActivatedError() // アクティベート画面に遷移
            }
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API アクティベート確認 エラー')
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 会社マスタ取得APIの呼び出し
     */
    getCompanyMasterInfo() {
      const paramData = {}

      this.output('API 会社マスタ取得 開始')
      this.$api
        .getCompanyMasterInfo(paramData)
        .then((res) => {
          this.output('API 会社マスタ取得 終了')
          if (res.data.result === 0) {
            const companyMasterData = res.data

            this.setCompanyMasterInfo(companyMasterData) // vuexに会社マスタデータを格納

            this.isAuthorized = true // 認証クリア
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }
        })
        .catch((error) => {
          this.output('API 会社マスタ取得 エラー')
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * アクティベート画面に遷移
     */
    onUnActivatedError() {
      this.$router.push('/account/connect/mjs-datalake/')
    },
  },
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-width: 1123px;
}
.main {
  position: relative;
  width: calc(100% - 250px);
  background-color: #ffffff;
  &.is-side-close {
    width: calc(100% - 56px);
  }
  &-container {
    color: rgba(0, 0, 0, 0);
    padding-top: 0px;
    &.exe-scroll {
      transition: all 0.5s ease;
      -webkit-transition: all 0.5s ease;
      color: rgba(0, 0, 0, 0.3);
    }
    &::-webkit-scrollbar-thumb {
      color: inherit;
    }
  }
}
</style>
