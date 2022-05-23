<template>
  <div class="basic-settings">
    <FormNav :nav-list="navList" :select-index="selectTabIndex" />
    <div class="header">
      <h2>サイトURL</h2>
      <p class="header-sub">
        WebサイトのURLとなるドメインを入力してください。<br />わかりやすく覚えてもらいやすいドメインをおすすめします。
      </p>
    </div>
    <div class="contents">
      <div class="context">
        <h3>独自ドメインも利用可能です</h3>
        <p>
          独自ドメインをbizskyDXで取得しサイトURLとすることができます。<br />初期設定完了後に契約プランから独自ドメインオプションをお申し込みください。
        </p>
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="form-title"
          label="ドメイン種別"
          :required="true"
        />
        <CustomInputRadio
          v-model="domainKind"
          name="domainKind"
          :options="domainKindOptions"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="form-title main-text"
          label="サイトURL"
          :required="true"
        />
        <p class="sub-text">
          URLの文字列は20字まで入力でき、大文字は自動で小文字に変換されます。<br />すでに登録されているドメインは利用できません。
          一度登録したドメインは変更できません。
        </p>
        <div class="site-url">
          <span class="site-url-protocol">https://</span>
          <CustomInputText
            v-model="basicSettings.siteUrl"
            placeholder="入力例：bizsky-dx"
            class="site-url-text"
            :is-disabled="defaultBasicSettings.siteUrl ? true : false"
            maxlength="20"
            :validation="
              $common.getFormItemsDetail(formItems, 'siteUrl').validation
            "
            @blur="checkDomain()"
          />
          <CustomInputSelect
            v-model="basicSettings.siteDomain"
            :options="$common.getVersatileOptions(2)"
            class="site-url-select"
            :validation="
              $common.getFormItemsDetail(formItems, 'siteDomain').validation
            "
            :is-disabled="true"
          />
        </div>
        <p class="sub-text">
          ※独自ドメインをご希望される方もサブドメインの登録が必要となります。
        </p>
      </div>
    </div>
    <div class="buttons">
      <button
        class="btn btn-basic btn-long"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="decideCmsDomainSettings()"
      >
        設定内容を保存
      </button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'servicelauncher',
  components: {},
  data() {
    return {
      defaultBasicSettings: {},
      basicSettings: {
        siteUrl: '',
        siteDomain: '1',
      },
      selectTabIndex: 0,
      navList: ['サイトURL', 'サイト基本情報', 'サイトデザイン'],
      domainKind: '1',
      domainKindOptions: [
        {
          value: '1',
          label: 'サブドメイン',
        },
      ],
      formItems: [
        {
          id: 'siteUrl',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cmsDomain,
              message: this.$common.getMasterMessage('ErrorMsg_Url04'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cmsDomainFormat1,
              message: this.$common.getMasterMessage('ErrorMsg_Url05'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cmsDomainFormat2,
              message: this.$common.getMasterMessage('ErrorMsg_Url06'),
            },
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'siteDomain',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * ボタンの非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.basicSettings) {
          if (
            (this.formItems.find((data) => data.id === key) &&
              !this.basicSettings[key]) ||
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.basicSettings[key]
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
    this.getBasicSettings() // 基本設定情報の取得
  },
  mounted() {},
  methods: {
    /**
     * 基本設定情報の取得
     */
    getBasicSettings() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCmsBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const basicSettings = resData.data.basicSettings

            this.defaultBasicSettings = JSON.parse(
              JSON.stringify(basicSettings)
            )
            this.basicSettings = basicSettings
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
     * ドメインチェック
     */
    checkDomain() {
      if (
        this.$common.checkExistValidation(
          this.formItems,
          'siteUrl',
          this.basicSettings.siteUrl,
          true
        ) ||
        this.defaultBasicSettings.siteUrl
      ) {
        return
      }

      const paramData = {
        domainName: this.basicSettings.siteUrl.toLowerCase(),
        domainCode: this.basicSettings.siteDomain,
      }

      this.$common.addCallApiNum()
      this.$api
        .checkDomain(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.deleteCustomDomainValidation() // ドメイン重複チェックのバリデーションエラーの削除
          } else {
            this.addCustomDomainValidation(resData.data.errorInfo.errorList) // ドメイン重複チェックのバリデーションエラーの追加
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ドメイン重複チェックのバリデーションエラーの追加
     *
     * @param {object[]} バリデーションエラーリスト
     */
    addCustomDomainValidation(errorList) {
      const customDomainValidation = this.formItems.find(
        (data) => data.id === 'siteUrl'
      ).validation

      if (
        customDomainValidation.findIndex((data) => data.type === 'custom') < 0
      ) {
        let errorMsg = ''

        if (this.$common.checkArrayValue(errorList)) {
          errorMsg = errorList.map((data) => data.errorMessage).join('<br>')
        }

        customDomainValidation.push({
          type: 'custom',
          message: errorMsg,
        })
      }
    },
    /**
     * ドメイン重複チェックのバリデーションエラーの削除
     */
    deleteCustomDomainValidation() {
      const mailAddressValidation = this.formItems.find(
        (data) => data.id === 'siteUrl'
      ).validation
      const findIndex = mailAddressValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        mailAddressValidation.splice(findIndex, 1)
      }
    },
    /**
     * サブドメイン情報の確定
     */
    decideCmsDomainSettings() {
      const paramData = {
        domainName: this.basicSettings.siteUrl,
        domainCode: this.basicSettings.siteDomain,
      }

      this.$common.addCallApiNum()
      this.$api
        .decideCmsDomainSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/site/setup/basic/')
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
      title: '初期セットアップ（サイトURL）｜Webサイト',
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-settings {
  width: 744px;
  padding-top: 48px;
  margin: auto;
  .nav-list {
    width: 640px;
    margin: auto;
  }
  .header {
    width: 420px;
    margin: 40px auto 0 auto;
    h2 {
      text-align: center;
    }
    &-sub {
      margin-top: 8px;
    }
    padding-bottom: 40px;
  }
  .contents {
    padding: 32px 0 48px 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    .context {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      padding: 32px 0;
      background: #f7f8f9;
      p {
        margin-top: 8px;
      }
    }
  }
  .form-item {
    margin-top: 48px;
    .form-title {
      margin-bottom: 12px;
      &.main-text {
        margin-bottom: 0;
      }
    }
    .sub-text {
      font-size: 13px;
      &:nth-of-type(1) {
        margin-top: 8px;
      }
      &:nth-of-type(2) {
        margin-top: 12px;
      }
    }
    .site-url {
      display: flex;
      align-items: flex-end;
      margin-top: 12px;
      &-protocol {
        display: flex;
        align-items: center;
        height: 48px;
      }
      &-text {
        width: 538px;
        margin-left: 16px;
      }
      &-select {
        width: 120px;
        margin-left: 16px;
      }
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
