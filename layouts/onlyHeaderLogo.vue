<template>
  <div class="default-template">
    <div class="header">
      <HeaderLogo />
    </div>
    <div class="contents">
      <Nuxt
        v-if="
          Object.keys(masterData).length > 0 ||
          $common.checkNotAuthScreens(
            $route.path.slice(-1) === '/' ? $route.path : $route.path + '/'
          )
        "
      />
    </div>
    <CommonFooter class="fixed-footer" />
    <CompletePopAlert />
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
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  middleware: 'checkAuth',
  components: {
    CommonFooter,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('common', [
      'callApiNum',
      'masterData',
      'showCommonErrorModalFlg',
      'notAuthScreens',
    ]),
  },
  methods: {
    ...mapMutations('common', ['hideCommonErrorModal']),
  },
}
</script>
<style lang="scss" scoped>
.default-template {
  min-height: 100vh;
  position: relative;
  padding-bottom: 143px;
  .header {
    display: flex;
    align-items: center;
    height: 80px;
    padding-left: 32px;
    border-bottom: 1px solid #eaeaea;
  }
  .fixed-footer {
    position: absolute;
    bottom: 0;
  }
}
</style>
