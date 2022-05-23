<template>
  <div class="password-change">
    <div class="password-change-form">
      <div class="header">
        <MainLogoSVG class="logo" />
        <h4 class="title">パスワード変更</h4>
      </div>
      <div class="form-block">
        <div class="old-password">
          <div class="form-item">
            <p class="title">現在のパスワード</p>
            <CustomInputPassword
              ref="oldPassword"
              v-model="oldPassword"
              placeholder="パスワードを入れてください"
              :validation="
                $common.getFormItemsDetail(formItems, 'oldPassword').validation
              "
            />
          </div>
        </div>
        <div class="new-password">
          <p class="context">新しいパスワードを入力してください。</p>
          <div class="form-item">
            <p class="title">新しいパスワード（大文字小文字数字混在8桁以上）</p>
            <CustomInputPassword
              ref="newPassword"
              v-model="newPassword"
              placeholder="パスワードを入れてください"
              :validation="
                $common.getFormItemsDetail(formItems, 'newPassword').validation
              "
            />
          </div>
          <div class="form-item">
            <p class="title">もう一度入力してください</p>
            <CustomInputPassword
              ref="newRePassword"
              v-model="newRePassword"
              placeholder="パスワードを入れてください"
              :validation="
                $common.getFormItemsDetail(formItems, 'newRePassword')
                  .validation
              "
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updatePassword()"
        >
          パスワードを変更する
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newRePassword: '',
      formItems: [
        {
          id: 'oldPassword',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
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
          id: 'newPassword',
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
          id: 'newRePassword',
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
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newRePassword: this.newRePassword,
        }

        const formItemsCheck = () => {
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

        const newPasswordFormItems = this.formItems.find(
          (item) => item.id === 'newPassword'
        )
        const newPasswordValidationIndex = newPasswordFormItems.validation.findIndex(
          (item) => item.type === 'custom'
        )

        if (this.oldPassword !== '' && this.oldPassword === this.newPassword) {
          result = true
          if (newPasswordValidationIndex < 0) {
            newPasswordFormItems.validation.push({
              type: 'custom',
              message: this.$common.getMasterMessage('ErrorMsg_Password03'),
            })
          }
        } else {
          if (newPasswordValidationIndex >= 0) {
            newPasswordFormItems.validation.splice(
              newPasswordValidationIndex,
              1
            )
          }

          formItemsCheck()
        }

        const newRePasswordFormItems = this.formItems.find(
          (item) => item.id === 'newRePassword'
        )
        const newRePasswordValidationIndex = newRePasswordFormItems.validation.findIndex(
          (item) => item.type === 'custom'
        )

        if (this.newPassword !== this.newRePassword) {
          result = true
          if (newRePasswordValidationIndex < 0) {
            newRePasswordFormItems.validation.push({
              type: 'custom',
              message: this.$common.getMasterMessage('ErrorMsg_Password02'),
            })
          }
        } else {
          if (newRePasswordValidationIndex >= 0) {
            newRePasswordFormItems.validation.splice(
              newRePasswordValidationIndex,
              1
            )
          }

          formItemsCheck()
        }

        if (Object.keys(this.$refs).length > 0) {
          this.$refs.newPassword.validationCheck()
          this.$refs.newRePassword.validationCheck()
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
     * パスワード更新処理
     */
    async updatePassword() {
      const paramData = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      }

      paramData.accessToken = (await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()

      this.$common.addCallApiNum()
      this.$api
        .updatePassword(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.exeLogout()
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ログアウト処理
     */
    exeLogout() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .exeLogout(paramData)
        .then((resData) => {
          if (!resData.data.proxyLogin) {
            this.$store.dispatch('auth/logout') // cognito認証情報の削除
          }
          this.$common.clearUnreadMessagesPolling()
          this.$router.push('/passwordChange/complete/')
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          console.log(error)
          this.$store.dispatch('auth/logout') // cognito認証情報の削除
          this.$router.push('/passwordChange/complete/')
          this.$common.subCallApiNum()
        })
    },
  },
  head() {
    return {
      title: 'パスワード変更｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.password-change {
  padding-top: 30px;
  &-form {
    width: 468px;
    background: #ffffff;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    padding: 40px 24px;
    margin: auto;
    .header {
      text-align: center;
    }
    .form-block {
      margin-top: 32px;
      .old-password {
        padding-bottom: 32px;
        border-bottom: 1px solid #e5e5e5;
      }
      .new-password {
        .context {
          text-align: center;
          padding: 40px 0 32px 0;
        }
      }
      .form-item {
        &:not(:last-child) {
          margin-bottom: 24px;
        }
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
