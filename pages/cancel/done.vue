<template>
  <div class="usage-application-form-complete">
    <div class="contents">
      <h1 class="heading">bizskyDXの解約申込を受付済です。</h1>
      <p class="context">
        事務局で解約の手続き中です。<br />
        手続き完了後に管理者様のメールアドレスへ<br />
        手続き完了のメールをご案内いたします。<br />
        <br />
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
      title: 'bizskyDXを解約する｜bizskyDX',
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
