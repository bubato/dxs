<template>
  <div class="form">
    <!-- side -->
    <CommonSideNav />
    <!-- /side -->
    <!-- main -->
    <div class="main" :class="['main', { 'is-side-close': !sideNavIsOpen }]">
      <CommonHeader />
      <div
        class="main-container"
        :class="[
          { 'show-scroll': $common.checkShowScrollBar() },
          { 'exe-scroll': showScrollbarFlg },
        ]"
      >
        <Nuxt />
      </div>
    </div>
    <!-- /main -->
    <div
      class="hidden_sidebar"
      :class="[{ 'exe-scroll': showScrollbarFlg }]"
    ></div>
    <AreaLabel />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommonSideNav from '~/components/common/CommonSideNav.vue'
import CommonHeader from '~/components/common/CommonHeader.vue'

export default {
  components: {
    CommonSideNav,
    CommonHeader,
  },
  middleware: 'scrollTopDefault',
  data() {
    return {
      timer: {},
      showScrollbarFlg: false,
      defaultShowScrollFlg: false,
    }
  },
  computed: {
    ...mapState('common', ['sideNavIsOpen']),
  },
  mounted() {
    document
      .querySelector('.main-container')
      .addEventListener('scroll', this.showScrollbar)
  },
  methods: {
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
.form {
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
