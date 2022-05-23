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

export default {
  components: {},
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
@import '~assets/styles/scss/sp/mediaQuery.scss';
.default-template {
  .header {
    display: flex;
    align-items: center;
    height: 80px;
    padding-left: 32px;
    border-bottom: 1px solid #eaeaea;
    @include mq(sp) {
      justify-content: center;
      padding-left: 0;
    }
  }
}
</style>
