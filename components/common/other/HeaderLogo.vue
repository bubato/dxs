<template>
  <MainLogoSVG
    v-if="
      !ngList.includes(currentPath) &&
      $auth.isAuthenticated &&
      Object.keys(masterData).length > 0
    "
    class="link"
    @click="logoLink()"
  />
  <MainLogoSVG v-else />
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {
      ngList: ['/starter/initialTour/'], // ログイン後でもランチャー遷移不可ページリスト
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    currentPath() {
      return this.$route.path.slice(-1) === '/'
        ? this.$route.path
        : this.$route.path + '/'
    },
  },
  methods: {
    logoLink() {
      this.$router.push('/launcher/')
    },
  },
}
</script>
<style lang="scss" scoped>
.link {
  cursor: pointer;
}
</style>
