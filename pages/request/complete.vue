<template>
  <div class="usage-application-form-complete">
    <div class="header">
      <h1 class="header-title">bizskyDX利用申し込み</h1>
    </div>
    <div class="form-nav">
      <FormNav
        :nav-list="navList"
        :select-index="selectIndex"
        class="form-nav-component"
      />
    </div>
    <div class="contents">
      <div class="image">
        <img :src="$common.getAssetsImgUrl('images/common/img_success.png')" />
      </div>
      <h2 class="heading">bizskyDXの利用申し込みが完了しました。</h2>
      <p class="context">
        bizskyDXの利用をお申込みいただきありがとうございました。<br />
        事務局で情報を確認させていただき、完了後にログインページのURLを登録いただいたメールアドレスへお送りします。<br />
        <br />
        申し込み時に登録したメールアドレスとパスワードを入力してbizskyDXを始めましょう。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {
      navList: ['必要情報の入力', '入力内容の確認', '申し込み完了'],
      selectIndex: 2,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * タブを閉じる
     */
    windowClose() {
      window.close()
    },
  },
  head() {
    return {
      title:
        'bizskyDXのお申込みありがとうございます｜bizskyDXで中堅・中小企業に成長と活力を',
    }
  },
}
</script>

<style lang="scss" scoped>
.usage-application-form-complete {
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
  }
  .form-nav {
    width: 594px;
    margin: 32px auto 0 auto;
  }
  .contents {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 32px;
    .icon-checkCircle {
      width: 48px;
      height: 48px;
      fill: #34c759;
    }
    .heading {
      margin-top: 16px;
    }
    .context {
      text-align: center;
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
      margin-top: 16px;
      p {
        font-size: 12px;
        margin-top: 12px;
      }
    }
  }
}
</style>
