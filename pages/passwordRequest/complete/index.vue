<template>
  <div class="complete">
    <div class="pop">
      <div class="header">
        <CheckCircleSVG class="icon icon-checkCircle" />
        <h4>パスワードリセットの<br />依頼を受け付けました</h4>
      </div>
      <div class="contents">
        <p class="annotation">
          登録いただいたメールアドレスへ<br />
          パスワードリセット用のURLをお送りしました。<br />
          URLをクリックして新しいパスワードを入力してください。
        </p>
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
  methods: {},
  head() {
    return {
      title:
        'パスワードリセットのリクエストが完了しました｜bizskyDXで中堅・中小企業に成長と活力を',
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
    }
  }
}
</style>
