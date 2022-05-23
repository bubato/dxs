<template>
  <div v-if="Object.keys(publishSettings).length > 0" class="publish">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">公開管理</h2>
        <p class="header-sub">
          Webサイトを一般向けに公開するうえでの各種設定を行います。
        </p>
      </div>
      <div class="contents">
        <div class="form-block">
          <h3>検索エンジン対応</h3>
          <div class="form-item authenticationFile">
            <p class="form-title">認証ファイルアップロード</p>
            <p class="sub-text">
              Google Search
              Consoleで取得した認証用のhtmlファイルをアップロードしてください。
            </p>
            <CustomLinkText
              text="認証ファイルについて"
              link="https://support.google.com/webmasters/answer/9008080?hl=ja"
            />
            <FileUpload
              ref="fileUpload"
              :file-data="publishSettings.authenticationFile.fileContent"
              :init-file-name="publishSettings.authenticationFile.fileName"
              file-type="html"
              :validation="
                $common.getFormItemsDetail(formItems, 'authenticationFile')
                  .validation
              "
              :max-size="500"
              read-type="text"
              @uploaded="setAuthenticationFile($event)"
              @deleted="fileDeleted()"
            />
          </div>
          <div class="form-item sitemap">
            <p class="form-title">sitemap.xml</p>
            <p class="sub-text">
              検索エンジンに表示するためにこちらのURLをGoogle Search
              Consoleのサイトマップへ登録してください。
            </p>
            <CustomLinkText
              text="sitemap.xmlの登録について"
              link="https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja"
            />
            <CustomInputText
              v-model="publishSettings.sitemapPath"
              :is-disabled="true"
            />
            <button class="btn btn-secondary btn-middle" @click="copySiteMap()">
              ファイル名をコピー
            </button>
          </div>
        </div>
        <div class="form-block">
          <h3>分析設定</h3>
          <div class="form-item">
            <p class="title flex">
              GoogleAnalyticsタグ<TooltipHelp
                label="Google Analyticsを利用したい場合に、Webサイト計測に必要な計測タグを取得して、こちらに入力してください。"
              />
            </p>
            <CustomInputTextarea
              v-model="publishSettings.gaTag"
              class="textarea"
              placeholder="発行されたGoogleAnalyticsタグを貼り付けてください"
              :validation="
                $common.getFormItemsDetail(formItems, 'gaTag').validation
              "
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultPublishSettings,
              publishSettings
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updatePublicManagementData()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
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
      defaultPublishSettings: {},
      publishSettings: {},
      formItems: [
        {
          id: 'authenticationFile',
          validation: [],
        },
        {
          id: 'sitemapPath',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'gaTag',
          validation: [
            {
              type: 'maxlength',
              maxlength: 1000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 1000,
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
     * ログインボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.publishSettings) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.publishSettings[key]
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
    this.getPublicManagementData() // 公開管理情報の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * 公開管理情報の取得
     */
    getPublicManagementData() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getPublicManagementData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const publishSettings = this.setNullInitData(
              resData.data.releaseData
            )

            this.defaultPublishSettings = JSON.parse(
              JSON.stringify(publishSettings)
            )
            this.publishSettings = publishSettings
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
     * nullが返ってきたデータの初期値設定
     *
     * @param {object} releaseData 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(releaseData) {
      this.$common.setNullConvertStringValue(releaseData, [
        'authenticationFile',
        'recordVersion',
      ])

      if (releaseData.authenticationFile === null) {
        releaseData.authenticationFile = {}
        releaseData.authenticationFile.fileName = ''
        releaseData.authenticationFile.fileContent = ''
      }

      return releaseData
    },
    /**
     * 認証ファイル設定処理
     *
     * @param {object} data ファイル情報
     */
    setAuthenticationFile(data) {
      this.publishSettings.authenticationFile.fileName = data.fileName
      this.publishSettings.authenticationFile.fileContent = data.fileData
    },
    /**
     * 認証ファイル削除処理
     */
    fileDeleted() {
      this.publishSettings.authenticationFile.fileName = ''
      this.publishSettings.authenticationFile.fileContent = ''
    },
    /**
     * サイトマップーの入力値をクリップボードにコピー
     */
    copySiteMap() {
      const fileName = this.publishSettings.sitemapPath.split('/').slice(-1)[0]

      this.$common.copyClipBoard(fileName)
      this.$common.showCompletePopAlert('ActionMsg_Gen08')
    },
    /**
     * 公開管理データの更新
     */
    updatePublicManagementData() {
      const paramData = this.getUpdatePublicManagementDataParam() // 公開管理データ公開APIのリクエストパラメータの取得

      this.$common.addCallApiNum()
      this.$api
        .updatePublicManagementData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getPublicManagementData()
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
     * 公開管理データ公開APIのリクエストパラメータの取得
     */
    getUpdatePublicManagementDataParam() {
      const paramData = {
        releaseData: JSON.parse(JSON.stringify(this.publishSettings)),
      }

      if (
        !paramData.releaseData.authenticationFile.fileName &&
        !paramData.releaseData.authenticationFile.fileContent
      ) {
        paramData.releaseData.authenticationFile = null
      }

      delete paramData.releaseData.sitemapPath

      return paramData
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      this.publishSettings = JSON.parse(
        JSON.stringify(this.defaultPublishSettings)
      )
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
  },
  head() {
    return {
      title: '公開管理｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.publish {
  .main-contents {
    .header {
      &-sub {
        margin-top: 8px;
      }
    }
    .contents {
      margin-top: 32px;
      .form-block {
        padding: 32px 0 40px 0;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        .form-item {
          margin-top: 16px;
          .title {
            font-weight: 500;
            margin-bottom: 12px;
          }
          .sub-text {
            margin-top: 8px;
          }
          &.authenticationFile {
            .file-upload {
              margin-top: 24px;
            }
          }
          ::v-deep .customLinkText {
            margin-top: 12px;
          }
          &.sitemap {
            margin-top: 48px;
            .custom-input-text {
              margin-top: 24px;
            }
            .btn {
              margin-top: 12px;
            }
          }
          ::v-deep textarea {
            height: 240px;
          }
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
