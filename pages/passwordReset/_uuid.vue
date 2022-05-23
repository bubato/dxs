<template>
  <div class="password-reset">
    <div class="password-reset-form">
      <div class="header">
        <MainLogoSVG class="logo" />
        <h4 class="title">パスワードリセット</h4>
      </div>
      <div class="form-block">
        <div class="form-item">
          <p class="title">
            新しいパスワード（大文字小文字数字混在8桁以上、記号不可）
          </p>
          <CustomInputPassword
            ref="password"
            v-model="password"
            placeholder="新しいパスワードを入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'password').validation
            "
          />
        </div>
        <div class="form-item">
          <p class="title">もう一度入力してください</p>
          <CustomInputPassword
            ref="rePassword"
            v-model="rePassword"
            placeholder="もう一度同じパスワードを入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'rePassword').validation
            "
          />
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="resetPassword()"
        >
          パスワードを更新
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
      password: '',
      rePassword: '',
      formItems: [
        {
          id: 'password',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.passwordNoSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Password01'),
            },
            {
              type: 'minlength',
              minlength: 8,
              message: this.$common.getMasterMessage('ErrorMsg_Count02', {
                minlength: 8,
              }),
            },
            {
              type: 'maxlength',
              maxlength: 98,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 98,
              }),
            },
          ],
        },
        {
          id: 'rePassword',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.passwordNoSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Password01'),
            },
            {
              type: 'minlength',
              minlength: 8,
              message: this.$common.getMasterMessage('ErrorMsg_Count02', {
                minlength: 8,
              }),
            },
            {
              type: 'maxlength',
              maxlength: 98,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 98,
              }),
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

        const validationItems = {
          password: this.password,
          rePassword: this.rePassword,
        }

        const rePasswordFormItems = this.formItems.find(
          (item) => item.id === 'rePassword'
        )
        const validationIndex = rePasswordFormItems.validation.findIndex(
          (item) => item.type === 'custom'
        )

        if (this.password !== this.rePassword) {
          result = true
          if (validationIndex < 0) {
            rePasswordFormItems.validation.push({
              type: 'custom',
              message: this.$common.getMasterMessage('ErrorMsg_Password02'),
            })
          }
        } else {
          if (validationIndex >= 0) {
            rePasswordFormItems.validation.splice(validationIndex, 1)
          }
          for (const key in validationItems) {
            if (
              this.$common.checkExistValidation(
                this.formItems,
                key,
                validationItems[key]
              )
            ) {
              result = true
              break
            }
          }
        }

        if (Object.keys(this.$refs).length > 0) {
          this.$refs.password.validationCheck()
          this.$refs.rePassword.validationCheck()
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
     * パスワードリセット処理
     */
    resetPassword() {
      const paramData = {
        uuid: this.$route.params.uuid,
        password: this.password,
      }

      this.$common.addCallApiNum()
      this.$api
        .resetPassword(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/passwordReset/complete/')
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
      title: 'パスワードリセット｜bizskyDXで中堅・中小企業に成長と活力を',
    }
  },
}
</script>

<style lang="scss" scoped>
.password-reset {
  padding-top: 30px;
  &-form {
    width: 488px;
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
