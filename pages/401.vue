<template>
  <div class="error">
    <div class="context">
      <h4>401 unauthorized</h4>
      <h2>認証に失敗しました</h2>
      <p class="annotation">
        認証情報が正しく読み取れなかったためページを表示できませんでした。<br />
        再度ログインしてください。
      </p>
      <div class="link">
        <a class="link-text" @click="transitionLogin()"
          >bizskyDXログインページ</a
        >
      </div>
    </div>
    <div class="image">
      <img :src="$common.getAssetsImgUrl('images/error/400.png')" />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * ログイン画面に遷移
     */
    transitionLogin() {
      this.$router.push('/login/')
    },
  },
  head() {
    return {
      title: '認証に失敗しました｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  justify-content: center;
  margin-top: 140px;
  .context {
    h2 {
      margin-top: 8px;
    }
    .annotation {
      margin-top: 16px;
    }
    .link {
      margin-top: 40px;
      &-text {
        &:not(:first-child) {
          margin-top: 8px;
        }
      }
    }
  }
  .image {
    margin-left: 64px;
  }
}
</style>
