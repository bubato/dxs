<template>
  <div class="basic-settings">
    <FormNav :nav-list="navList" :select-index="selectTabIndex" />
    <div class="header">
      <h2>サイト基本情報</h2>
      <p class="header-sub">Webサイトの名前やロゴを登録してください。</p>
    </div>
    <div class="contents">
      <div class="form-item">
        <RequiredFormLabel
          class="form-title"
          label="サイト名称"
          :required="true"
        />
        <CustomInputText
          v-model="basicSettings.siteName"
          placeholder="入力例：株式会社田中商事"
          class="width-middle"
          maxlength="200"
          :validation="
            $common.getFormItemsDetail(formItems, 'siteName').validation
          "
        />
      </div>
      <div class="form-item">
        <div class="form-title flex">
          <RequiredFormLabel label="サイト説明" :required="true" />
          <TooltipHelp
            label="Webサイトの説明文を入力します。入力された値はサイトの説明文として表示されます。"
            class="tooltip"
          />
        </div>
        <CustomInputTextarea
          v-model="basicSettings.siteDescription"
          placeholder="入力例：株式会社田中商事の公式Webサイトです。創業以来〇〇県〇〇市を中心にお仕事をさせていただいています。"
          class="site-description"
          maxlength="500"
          :validation="
            $common.getFormItemsDetail(formItems, 'siteDescription').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="form-title main-text"
          label="ロゴ"
          :required="true"
        />
        <p class="sub-text">
          ファイルサイズは500KB以下、拡張子は.{{
            imageAllowExts.join('、')
          }}が利用できます。
        </p>
        <FileUpload
          ref="fileUpload"
          :file-data="basicSettings.siteLogo"
          :validation="
            $common.getFormItemsDetail(formItems, 'siteLogo').validation
          "
          :max-size="500"
          @uploaded="setBasicLogo($event)"
          @deleted="fileDeleted()"
        />
      </div>
      <div class="form-item">
        <div class="form-title flex">
          <RequiredFormLabel label="コピーライト" :required="true" />
          <TooltipHelp
            label="Webサイトのコピーライトを入力します。入力された値はサイトに表示されます。"
            class="tooltip"
          />
        </div>
        <CustomInputText
          v-model="basicSettings.copyRight"
          placeholder="入力例：© Tanaka Inc. All Rights Reserved."
          maxlength="50"
          :validation="
            $common.getFormItemsDetail(formItems, 'copyRight').validation
          "
        />
      </div>
    </div>
    <div class="buttons">
      <button class="btn btn-cancel btn-long" @click="toBackDomainSettings()">
        前に戻る
      </button>
      <button
        class="btn btn-basic btn-long"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateCmsBasicSettingsSites()"
      >
        保存して次へ
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
        siteName: '',
        siteDescription: '',
        siteLogo: '',
        copyRight: '',
      },
      tenantInfo: {},
      selectTabIndex: 1,
      navList: ['サイトURL', 'サイト基本情報', 'サイトデザイン'],
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      formItems: [
        {
          id: 'siteName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 200,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 200,
              }),
            },
          ],
        },
        {
          id: 'siteDescription',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 500,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 500,
              }),
            },
          ],
        },
        {
          id: 'siteLogo',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'copyRight',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 50,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 50,
              }),
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
            this.tenantInfo = resData.data.tenantInfo
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
      this.basicSettings.siteUrl = this.basicSettings.siteUrl.toLowerCase()

      const paramData = {
        domainName: this.basicSettings.siteUrl,
        domainCode: this.basicSettings.siteDomain,
      }

      if (this.defaultBasicSettings.siteUrl) {
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .checkDomain(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.deleteCustomDomainValidation()
          } else {
            this.addCustomDomainValidation(resData.data.errorInfo.errorList)
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
     * 初期セットアップ(サイトURL)画面に戻る
     */
    toBackDomainSettings() {
      this.$router.push('/site/setup/domain/')
    },
    /**
     * 会社ロゴ画像設定処理
     *
     * @param {object} data ファイル情報
     */
    setBasicLogo(data) {
      this.basicSettings.siteLogo = data.fileImgPath
    },
    /**
     * 添付ファイル削除処理
     */
    fileDeleted() {
      this.basicSettings.siteLogo = ''
    },
    /**
     * 基本設定サイト情報更新APIの呼び出し
     */
    updateCmsBasicSettingsSites() {
      const paramData = {
        tenantInfo: {
          siteLogo: this.basicSettings.siteLogo,
          recordVersion: this.tenantInfo.recordVersion,
        },
        basicSettings: {
          siteName: this.basicSettings.siteName,
          siteDescription: this.basicSettings.siteDescription,
          copyRight: this.basicSettings.copyRight,
          recordVersion: this.basicSettings.recordVersion,
        },
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCmsBasicSettingsSites(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/site/setup/design/')
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
      title: '初期セットアップ（サイト基本情報）｜Webサイト',
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
    &:not(:first-child) {
      margin-top: 48px;
    }
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
    .file-upload {
      margin-top: 12px;
    }
    .site-description {
      height: 128px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    .btn {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
