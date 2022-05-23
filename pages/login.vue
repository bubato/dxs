<template>
  <div class="login">
    <div class="header">
      <MainLogoSVG class="logo" />
    </div>
    <p class="context">さあ、はじめましょう。</p>
    <div class="form-block">
      <div class="form-item">
        <p class="title">メールアドレス</p>
        <CustomInputText
          v-model="form.email"
          maxlength="254"
          :validation="
            $common.getFormItemsDetail(formItems, 'email').validation
          "
        />
      </div>
      <div class="form-item">
        <p class="title">パスワード</p>
        <CustomInputPassword
          v-model="form.password"
          :validation="
            $common.getFormItemsDetail(formItems, 'password').validation
          "
        />
      </div>
    </div>
    <div class="option">
      <CustomLinkText
        text="パスワードを忘れた方はこちら"
        link="/passwordRequest/"
      />
      <CustomInputSingleCheckbox
        v-model="checkPasswordRetention"
        name="checkPasswordRetention"
        label="30日間ログイン情報を保持する"
      />
    </div>
    <p v-if="showLoginErrorMsgFlg" class="error">{{ loginErrorMsg }}</p>
    <div class="buttons">
      <button
        class="btn btn-long btn-basic"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="loginCognito()"
      >
        ログイン
      </button>
    </div>
    <AccountExpiredModal
      v-if="showAccountExpiredModalFlg"
      @close="hideAccountExpiredModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import lscache from 'lscache'

export default {
  layout: 'onlyHeaderLogo',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      checkPasswordRetention: false,
      showAccountExpiredModalFlg: false,
      showLoginErrorMsgFlg: false,
      loginErrorMsg: 'メールアドレスまたはパスワードが正しくありません。',
      formItems: [
        {
          id: 'email',
          validation: [
            {
              type: 'required',
              message: '入力が必須の項目です。',
            },
            {
              type: 'maxlength',
              maxlength: 254,
              message: '254文字以内で入力してください。',
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
        {
          id: 'password',
          validation: [
            {
              type: 'required',
              message: '入力が必須の項目です。',
            },
            {
              type: 'maxlength',
              maxlength: 98,
              message: '98文字以内で入力してください。',
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['initShowPage']),
    /**
     * ログインボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        const validationItems = {
          email: this.form.email,
          password: this.form.password,
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

        return result
      }
    },
  },
  created() {
    // 30日間ログインチェックの値をローカルストレージの値に設定
    if (lscache.get('loginFlg') === '1') {
      this.checkPasswordRetention = true
    } else {
      this.checkPasswordRetention = false
    }

    // cognito認証が通っていれば、自動ログイン処理を実行
    if (
      this.$auth.isAuthenticated &&
      process.env.environment !== 'development'
    ) {
      this.autoLogin() // 自動ログイン
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setMasterData', 'setInitShowPage']),
    /**
     * 自動ログイン(30日間パスワード保存有効時)
     */
    autoLogin() {
      // this.getCsrfTokenData()
    },
    /**
     * Cognitoログイン処理
     */
    async loginCognito() {
      this.$common.addCallApiNum()
      try {
        // ①cognitoログイン処理
        await this.$store.dispatch('auth/login', this.form)

        this.deleteCognitoLocalStorageEmail() // ログイン時に保存されるCognitoのemail情報を削除

        this.exeLogin()
        this.showLoginErrorMsgFlg = false
      } catch (error) {
        this.showLoginErrorMsgFlg = true
        console.log(error.message)
      }
      this.$common.subCallApiNum()
    },
    /**
     * ログイン時に保存されるCognitoのemail情報を削除
     */
    deleteCognitoLocalStorageEmail() {
      if (this.$auth.user) {
        const userDataKey = this.$auth.user.userDataKey
        const targetData = JSON.parse(localStorage.getItem(userDataKey))
        const targetIndex = targetData.UserAttributes.findIndex(
          (data) => data.Name === 'email'
        )
        targetData.UserAttributes[targetIndex].Value = ''

        localStorage.setItem(userDataKey, JSON.stringify(targetData))
      }
    },
    /**
     * サーバ側のログイン処理
     */
    exeLogin() {
      const paramData = {
        'remember-me': this.checkPasswordRetention ? '1' : '0',
      }

      this.$common.addCallApiNum()
      this.$api
        .exeLogin(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            lscache.set('loginFlg', paramData['remember-me'], 43200)
            this.resetStore() // Vuexのリセット
            this.getCsrfTokenData()
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
     * CSRFトークンデータの取得
     */
    getCsrfTokenData() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCsrfTokenData(paramData)
        .then((resData) => {
          localStorage.setItem('csrfToken', resData.data.csrfToken)
          this.getMasterData() // マスターデータの取得
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * マスターデータの取得
     */
    getMasterData() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getMasterData(paramData)
        .then((resData) => {
          this.setMasterData(resData.data)

          if (resData.data.initialTourCompletedFlag === 1) {
            if (this.initShowPage.length > 0) {
              const initShowPage = this.initShowPage

              this.setInitShowPage('')
              this.$router.push(initShowPage)
            } else {
              this.$router.push('/launcher/')
            }
          } else {
            this.$router.push('/starter/initialTour/')
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * アカウント有効期限切れモーダルの表示
     */
    showAccountExpiredModal() {
      this.showAccountExpiredModalFlg = true
    },
    /**
     * アカウント有効期限切れモーダルの非表示
     */
    hideAccountExpiredModal() {
      this.showAccountExpiredModalFlg = false
    },
    /**
     * Vuexのリセット
     */
    resetStore() {
      // MMIのストアをリセット
      this.$store.commit('mmi/common/resetDefaultState')
      this.$store.commit('mmi/companyReport/resetDefaultState')
      this.$store.commit('mmi/filterConditions/resetDefaultState')

      // Communityのストアをリセット
      this.$store.commit('community/common/resetDefaultState')
      this.$store.commit('community/corporate/resetDefaultState')
      this.$store.commit('community/member/resetDefaultState')
      this.$store.commit('community/message/resetDefaultState')
      this.$store.commit('community/profileStore/resetDefaultState')
      this.$store.commit('community/searchResult/resetDefaultState')
      this.$store.commit('community/timeline/resetDefaultState')
    },
  },
  head() {
    return {
      title: 'ログイン｜bizskyDXで中堅・中小企業に成長と活力を',
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.login {
  @include spContentWidth();
  width: 468px;
  background: #ffffff;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 40px 24px;
  margin: 30px auto 0 auto;
  .header {
    text-align: center;
    .title {
      margin-top: 8px;
    }
  }
  .context {
    font-size: 17px;
    text-align: center;
    margin-top: 16px;
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
  .error {
    color: #ff0000;
    font-weight: 500;
    text-align: center;
    margin-top: 20px;
  }
  .option {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    ::v-deep .link-text {
      margin-bottom: 16px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>
