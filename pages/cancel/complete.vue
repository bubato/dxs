<template>
  <div class="usage-application-form-complete">
    <div class="contents">
      <h1 class="heading">bizskyDXの解約申し込みが完了しました。</h1>
      <p class="context">
        長らくの間bizskyDXをご利用いただき誠にありがとうございました。<br />
        非常に残念ではございますが、頂いた解約理由は<br />
        今後の更なるサービス改善へのアドバイスとして活用させていただきます。<br />
        <br />
        事務局で解約の手続きをいたしますので手続き完了後に<br />
        管理者様のメールアドレスへ手続き完了のメールをご案内いたします。<br />
        今しばらくお待ちいただきますようお願い申し上げます。<br />
        <br />
        不明点などありましたらお問い合わせフォームよりご連絡ください。
      </p>
      <div class="option">
        <CustomLinkText
          link="https://www.bizsky.io/contact/"
          text="bizskyDX お問い合わせフォーム"
        />
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
      title: 'bizskyDXを解約しました｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.usage-application-form-complete {
  .contents {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 32px;
    .heading {
      font-size: 28px;
      margin-top: 48px;
    }
    .context {
      margin-top: 16px;
    }
    ::v-deep .link-text {
      margin-top: 40px;
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 24px;
      p {
        font-size: 12px;
        margin-top: 12px;
      }
    }
  }
}
</style>
