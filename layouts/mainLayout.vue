<template>
  <div class="layout">
    <!-- side -->
    <CommonSideNav />
    <!-- /side -->
    <!-- main -->
    <div class="main" :class="['main', { 'is-side-close': !sideNavIsOpen }]">
      <CommonHeader v-if="Object.keys(masterData).length > 0" />
      <div class="main-container" :class="[{ 'exe-scroll': showScrollbarFlg }]">
        <Nuxt v-if="Object.keys(masterData).length > 0" />
      </div>
      <CompletePopAlert />
    </div>
    <!-- /main -->
    <div
      class="hidden_sidebar"
      :class="[{ 'exe-scroll': showScrollbarFlg }]"
    ></div>
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
      defaultShowScrollFlg: false,
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
  },
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-width: 1024px;
}
.main {
  position: relative;
  width: calc(100% - 250px);
  background-color: #ffffff;
  &.is-side-close {
    width: calc(100% - 56px);
  }
}
</style>
