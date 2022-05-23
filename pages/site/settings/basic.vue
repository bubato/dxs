<template>
  <div class="basic-settings">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2>基本情報</h2>
        <p class="header-sub">Webサイトの構成やデザインを設定できます。</p>
      </div>
      <div class="contents">
        <div class="form-item">
          <RequiredFormLabel
            class="title"
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
          <div class="title flex">
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
              $common.getFormItemsDetail(formItems, 'siteDescription')
                .validation
            "
          />
        </div>
        <div class="form-item">
          <RequiredFormLabel
            class="title main-text"
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
          <div class="title flex">
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
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultBasicSettings,
              basicSettings
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateCmsBasicSettingsSites()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <!-- /main-contents -->
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      defaultBasicSettings: {},
      basicSettings: {
        siteName: '',
        siteDescription: '',
        siteLogo: '',
        copyRight: '',
      },
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
    ...mapState('common', ['showCancelEditModalFlg']),
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
            !this.basicSettings[key] ||
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
    this.getBasicSettings()
  },
  mounted() {},
  methods: {
    ...mapMutations('common', [
      'showCancelEditModal',
      'hideCancelEditModal',
      'setShowIncompleteBasicSettingsModalState',
    ]),
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

            if ([0, 1, 2].includes(basicSettings.baseSettingStatus)) {
              this.setShowIncompleteBasicSettingsModalState(true)
            } else {
              this.defaultBasicSettings = JSON.parse(
                JSON.stringify(basicSettings)
              )
              this.basicSettings = basicSettings
              this.tenantInfo = resData.data.tenantInfo
            }
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
            this.getBasicSettings()
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * 入力内容を元に戻す
     */
    restoreSettings() {
      this.basicSettings = JSON.parse(JSON.stringify(this.defaultBasicSettings))
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
  },

  head() {
    return {
      title: '基本情報｜基本設定｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-settings {
  .nav-list {
    width: 640px;
    margin: auto;
  }
  .header {
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
    .title {
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
