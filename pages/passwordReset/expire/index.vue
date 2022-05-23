<template>
  <div class="error">
    <div class="pop">
      <div class="context">
        <h2>有効期限が切れました</h2>
        <p class="annotation">
          お送りしたパスワードリセット用URLの有効期限が切れています。<br />
          お手数ですが再度パスワードリセットのリクエストを送信ください。
        </p>
        <div class="link">
          <a class="link-text" @click="transitionPasswordRequest()"
            >bizskyDX パスワードを忘れた方へ</a
          >
        </div>
      </div>
      <div class="image">
        <img :src="$common.getAssetsImgUrl('images/error/400.png')" />
      </div>
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
     * パスワードリセット要求画面に遷移
     */
    transitionPasswordRequest() {
      this.$router.push('/passwordRequest/')
    },
  },
  head() {
    return {
      title: 'パスワードの有効期限がきれています｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.error {
  .pop {
    display: flex;
    justify-content: center;
    margin-top: 140px;
    .context {
      h1 {
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
}
</style>
