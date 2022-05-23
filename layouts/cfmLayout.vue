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

export default {
  components: {
    CommonSideNav,
    CommonHeader,
  },
  middleware: ['scrollTopDefault', 'checkAuth'],
  data() {
    return {
      timer: {},
      showScrollbarFlg: false,
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
    ...mapState('cfm/common', ['companyMasterDataList']),
  },
  watch: {
    $route(to, from) {
      this.isAuthorized = false // 認証クリア
      this.getCompanyMasterInfo() // 会社マスタ取得APIの呼び出し
    },
  },
  created() {
    this.getCompanyMasterInfo() // 会社マスタ取得APIの呼び出し
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
    ...mapMutations('cfm/common', [
      'setCorporateType',
      'setCompanyMasterDataList',
    ]),
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
     * 会社マスタ取得APIの呼び出し
     */
    getCompanyMasterInfo() {
      const paramData = {}

      this.$api
        .getCompanyMasterInfo(paramData)
        .then((res) => {
          if (res.data.result === 0) {
            const companyMasterDataList = res.data.dataList

            if (this.$common.checkArrayValue(companyMasterDataList)) {
              this.setCorporateType(companyMasterDataList[0].corporateType)
            }

            this.isAuthorized = true // 認証クリア
            this.setCompanyMasterDataList(companyMasterDataList) // vuexに会社マスタデータを格納
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
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
