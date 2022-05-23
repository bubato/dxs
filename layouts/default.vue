<template>
  <div>
    <Nuxt v-if="Object.keys(masterData).length > 0" />
    <LoadingScreen v-if="callApiNum > 0" />
    <CommonErrorModal
      v-if="showCommonErrorModalFlg"
      @close="hideCommonErrorModal()"
    />
    <AreaLabel />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  components: {},
  middleware: 'checkAuth',
  data() {
    return {}
  },
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
