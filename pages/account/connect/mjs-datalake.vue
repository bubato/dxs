<template>
  <div class="activate">
    <div class="header">
      <h1 class="title">MJSデータレイクとのデータ連携</h1>
      <p class="title-context">
        MJSが運営するデータレイクサービス上のデータを参照可能にするために<br />会計事務所がデータレイクにデータアップロードで使用しているbizskyIDを登録してください。<br />
      </p>
      <CustomLinkText
        text="bizskyIDをまだお持ちでない方はこちらから取得できます。"
        link="https://auth.bizsky.jp/MyAuth/ServiceLogin?act=em&cprg=ca&xtnl=f&returnurl=https%253a%252f%252fmypage.kantan.mjs.co.jp%252fAuthenticateUser%252fBizskyLoginAuthentication"
      />
    </div>
    <div class="form">
      <div class="form-header">
        <MainLogoSVG class="logo" />
      </div>
      <p class="form-text">
        MJSが提供するbizskyIDのアカウント情報<br />（メールアドレス、パスワード）を入力してください。
      </p>
      <div class="form-block">
        <div class="form-item">
          <p class="title">bizskyID</p>
          <CustomInputText
            v-model="form.email"
            maxlength="254"
            placeholder="account@ccm.com"
            :validation="
              $common.getFormItemsDetail(formItems, 'email').validation
            "
          />
        </div>
        <div class="form-item">
          <p class="title">パスワード</p>
          <CustomInputPassword
            v-model="form.password"
            maxlength="98"
            placeholder="パスワードを入れてください"
            :validation="
              $common.getFormItemsDetail(formItems, 'password').validation
            "
          />
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="execMmiActivate()"
        >
          Finance機能を有効化
        </button>
      </div>
    </div>
    <ActivatedMessageModal
      v-if="isActivatedModalShown"
      :corp-type="corpType"
      :from-page-name="fromPageData.name"
      @close="hideActivatedModal()"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ActivatedMessageModal from '~/components/mmi/modal/activate/ActivatedMessageModal.vue'
import mmiCompanyInfoUtilityMixin from '~/mixin/mmi/companyInfoUtility.js'

export default {
  layout: 'servicelauncher',
  components: {
    ActivatedMessageModal,
  },
  mixins: [mmiCompanyInfoUtilityMixin],
  data() {
    return {
      fromPageData: {},
      isAuthenticated: false,
      companyMasterRequestState: {},
      form: {
        email: '',
        password: '',
      },
      corpType: 2,
      checkPasswordRetention: false,
      isActivatedModalShown: false,
      isErrorMessageModalShown: false,
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
    ...mapState('common', ['dataLakeActivateFrom', 'masterData']),
    ...mapState('mmi/companyReport', [
      'companyMasterInfo',
      'accountingFirmFlg',
    ]),
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
    this.output('MMIアクティベート画面表示 開始')

    if (this.masterData.managementFlag === 1) {
      this.initFunc()
      this.setFromPageData()
    } else {
      this.$router.push('/launcher/')
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('mmi/companyReport', ['setCompanyMasterInfo']),
    ...mapMutations('common', ['setDatalakeActivateFrom']),
    /**
     * 遷移元ページの設定
     */
    setFromPageData() {
      if (Object.keys(this.dataLakeActivateFrom).length) {
        this.fromPageData = JSON.parse(this.dataLakeActivateFrom)
        this.setDataLakeActivateFrom({})
      }
    },
    /**
     * 初期化処理
     */
    initFunc() {
      // 会社マスタの取得チェック
      if (this.companyMasterInfo === null) {
        this.getCompanyMasterInfo(true) // 会社マスタ取得APIの呼び出し
      }
    },
    /**
     * 会社マスタ取得APIの呼び出し
     *
     * @param {boolean} init true:初回呼び出し false:アクティベート実行時呼び出し
     */
    getCompanyMasterInfo(init) {
      const requestParams = {}

      this.output('API 会社マスタ取得 開始')

      this.$common.addCallApiNum()
      this.$api
        .getCompanyMasterInfo(requestParams)
        .then((res) => {
          this.output('API 会社マスタ取得 終了')
          if (res.data.result === 0) {
            this.setCompanyMasterInfo(res.data)

            if (init) {
              this.isAuthenticated = true
            } else {
              this.$common.getMasterData()
              this.showActivatedModal()
            }
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API MMI機能権限チェック エラー')
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 遷移先の種別を取得（完了ダイアログ・遷移URLの決定で使用する）
     */
    getCorporateType(companyInfo) {
      if (!companyInfo || !this.$common.checkArrayValue(companyInfo.dataList)) {
        return 2
      }

      if (this.accountingFirmFlg) {
        return 0
      } else if (companyInfo.dataList.length > 1) {
        return 1
      }

      return 2
    },
    /**
     * サーバ側のアクティベート処理
     */
    execMmiActivate() {
      const paramData = {
        bizskyId: this.form.email,
        password: this.form.password,
        recordVersion: this.companyMasterInfo.tenantRecordVersion,
      }

      this.$common.addCallApiNum()
      this.output('API アクティベート実行 開始')
      this.$api
        .execMmiActivate(paramData)
        .then((res) => {
          this.output('API アクティベート実行 終了')

          if (res.data.result === 0) {
            this.getCompanyMasterInfo(false) // 会社マスタ取得APIの呼び出し
          } else {
            this.$common.showCommonError(res.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.output('API アクティベート実行 エラー')
          this.$common.apiErrorFunc(error)
        })
    },
    showActivatedModal() {
      this.corpType = this.getCorporateType(this.companyMasterInfo)
      this.isActivatedModalShown = true
    },
    hideActivatedModal() {
      this.isActivatedModalShown = false

      this.$nextTick(() => {
        this.$router.push('/launcher/')
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.activate {
  padding-top: 40px;
  .header {
    width: auto;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title-context {
      margin-top: 16px;
    }
    .customLinkText {
      margin-top: 24px;
    }
  }
  .form {
    width: 468px;
    background: #ffffff;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    padding: 40px 24px;
    margin: 40px auto 0 auto;
    &-header {
      text-align: center;
      margin-bottom: 10px;
      .title {
        margin-top: 8px;
      }
    }
    &-text {
      display: flex;
      justify-content: center;
    }
    .form-block {
      margin-top: 32px;
      .form-item {
        margin-bottom: 24px;
        .title {
          font-weight: 500;
          margin-bottom: 12px;
        }
        .context {
          font-size: 13px;
          margin-top: 8px;
        }
        .custom-input-single-checkbox {
          margin-top: 12px;
        }
      }
    }
    .error {
      color: #ff0000;
      font-weight: 500;
      text-align: center;
      margin-top: 20px;
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
    }
  }
}
</style>
