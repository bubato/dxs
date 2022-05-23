<template>
  <div class="password-request">
    <div class="password-request-form">
      <div class="header">
        <MainLogoSVG class="logo" />
        <h4 class="title">パスワードを忘れた方へ</h4>
      </div>
      <p class="context">
        登録したメールアドレスを入力して<br />パスワードを依頼するボタンをクリックしてください。<br />パスワードリセット用のURLをお送りします。
      </p>
      <div class="form-block">
        <div class="form-item">
          <p class="title">メールアドレス</p>
          <CustomInputText
            v-model="mailAddress"
            placeholder="account@ccm.com"
            :validation="
              $common.getFormItemsDetail(formItems, 'mailAddress').validation
            "
          />
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="resetPasswordRequest()"
        >
          パスワードリセットを依頼
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {
      mailAddress: '',
      formItems: [
        {
          id: 'mailAddress',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 254,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 254,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mail,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'mailAddress',
            this.mailAddress
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * パスワードリセット要求処理
     */
    resetPasswordRequest() {
      const paramData = {
        mailAddress: this.mailAddress,
      }

      this.$common.addCallApiNum()
      this.$api
        .resetPasswordRequest(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/passwordRequest/complete/')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
  head() {
    return {
      title: 'パスワードリセットを送信｜bizskyDXで中堅・中小企業に成長と活力を',
    }
  },
}
</script>

<style lang="scss" scoped>
.password-request {
  padding-top: 30px;
  &-form {
    width: 468px;
    background: #ffffff;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    padding: 40px 24px;
    margin: 0 auto;
    .header {
      text-align: center;
      .title {
        margin-top: 8px;
      }
    }
    .context {
      margin-top: 16px;
      padding: 0 22px;
      text-align: center;
    }
    .form-block {
      margin-top: 32px;
      .form-item {
        margin-bottom: 24px;
        .title {
          font-weight: 500;
          margin-bottom: 12px;
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
    }
  }
}
</style>
