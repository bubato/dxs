<template>
  <div class="servicelauncher">
    <CommonHeader
      v-if="Object.keys(masterData).length > 0"
      :show-logo="true"
      class="is-pc"
    />
    <CommonHeaderSP v-if="Object.keys(masterData).length > 0" class="is-sp" />
    <Nuxt v-if="Object.keys(masterData).length > 0" />
    <CommonFooter class="fixed-footer" />
    <CompletePopAlert />
    <LoadingScreen v-if="callApiNum > 0" />
    <AreaLabel />
    <CommonErrorModal
      v-if="showCommonErrorModalFlg"
      @close="hideCommonErrorModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonHeaderSP from '~/components/common/CommonHeaderSP.vue'
export default {
  components: {
    CommonHeaderSP,
  },
  middleware: 'checkAuth',
  computed: {
    ...mapState('common', [
      'callApiNum',
      'masterData',
      'showCommonErrorModalFlg',
    ]),
  },
  methods: {
    ...mapMutations('common', ['hideCommonErrorModal']),
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.servicelauncher {
  min-height: 100vh;
  position: relative;
  padding-bottom: 143px;
  .fixed-footer {
    position: absolute;
    bottom: 0;
  }
}
@include mq(pc) {
  .is-sp {
    display: none;
  }
}
@include mq(sp) {
  .is-pc {
    display: none;
  }
}
</style>
