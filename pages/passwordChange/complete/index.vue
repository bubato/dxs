<template>
  <div class="complete">
    <div class="pop">
      <div class="header">
        <CheckCircleSVG class="icon icon-checkCircle" />
        <h4>パスワードを変更しました</h4>
      </div>
      <div class="contents">
        <p class="annotation">
          パスワードの変更が正常に完了しました。<br />
          新しいパスワードを入力してログインしてください。
        </p>
        <div class="buttons">
          <button
            class="btn btn-basic btn-long"
            @click="transitionLoginScreen()"
          >
            ログイン画面
          </button>
        </div>
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
     * ログイン画面に遷移
     */
    transitionLoginScreen() {
      this.$router.push('/login/')
    },
  },
  head() {
    return {
      title: 'パスワード変更が完了しました｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.complete {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  .pop {
    width: 468px;
    padding: 40px 32px;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    .header {
      display: flex;
      justify-content: center;
      .icon-checkCircle {
        width: 32px;
        height: 32px;
        fill: #34c759;
      }
      h4 {
        margin-left: 12px;
      }
    }
    .contents {
      margin-top: 12px;
      .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 32px;
      }
    }
  }
}
</style>
