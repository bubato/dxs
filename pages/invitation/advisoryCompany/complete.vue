<template>
  <div class="invited">
    <CheckCircleSVG class="icon icon-checkCircle" />
    <p class="title">規約に同意いただきありがとうございます。</p>
    <p class="context">
      bizskyDX利用規約に同意いただきありがとうございました。<br />
      貴社の会計データとMJSデータレイクを連携することで<br />
      統計データとの比較やAIによる予測など様々な機能を<br />
      会計事務所様がご利用いただけるようになります。
    </p>
    <div class="buttons">
      <button class="btn btn-long btn-basic" @click="transitionLoginScreen()">
        ログイン画面
      </button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'onlyHeaderLogo',
  data() {
    return {}
  },
  computed: {},
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
      title: 'MJSデータレイクとの連携同意完了｜bizskyDX',
    }
  },
}
</script>
<style lang="scss" scoped>
.invited {
  width: 575px;
  background: #ffffff;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 42px 72px;
  padding-right: 60px;
  margin: 172px auto 0 auto;
  .icon-checkCircle {
    width: 32px;
    height: 32px;
    fill: #34c759;
    position: absolute;
  }
  .title {
    font-size: 20px;
    font-weight: 500;
    padding-left: 43px;
  }
  .context {
    font-size: 15px;
    margin-top: 9px;
    padding: 0 15px;
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>
