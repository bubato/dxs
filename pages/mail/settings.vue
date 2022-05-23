<template>
  <div class="mail-settings">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">基本設定</h2>
        <p class="header-sub">メール機能で利用する基本的な設定を行います。</p>
      </div>
      <div class="contents">
        <div class="form-block">
          <h3>アドレス設定</h3>
          <p>
            顧客に配信するメールのアドレス情報を設定します。ここに設定することで、メール設定画面のFROMのフォームに反映されます。
          </p>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="配信元表示名"
              :required="false"
            />
            <CustomInputText
              v-model="basicSettings.senderName"
              placeholder="入力例：キャンペーン事務局"
              maxlength="30"
              :validation="
                $common.getFormItemsDetail(formItems, 'senderName').validation
              "
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="配信元アドレス"
              :required="false"
            />
            <CustomInputText
              v-model="basicSettings.senderEmail"
              placeholder="メールアドレスを入力してください"
              maxlength="120"
              :validation="
                $common.getFormItemsDetail(formItems, 'senderEmail').validation
              "
            />
          </div>
        </div>
        <div class="form-block">
          <h3>テスト配信用アドレス</h3>
          <p>
            テスト配信のメールアドレスフォームに初期登録されるアドレスを登録します。<br />複数のメールアドレスを設定する場合は改行してメールアドレスを入力してください。5件まで入力できます。
          </p>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="テスト配信アドレス"
              :required="false"
            />
            <CustomInputTextarea
              v-model="basicSettings.senderTestEmail"
              class="senderTestEmail"
              placeholder="メールアドレスを改行で入力してください"
              maxlength="500"
              :validation="
                $common.getFormItemsDetail(formItems, 'senderTestEmail')
                  .validation
              "
            />
          </div>
        </div>
        <div class="form-block">
          <h3>分析設定</h3>
          <p>
            Webサイト機能を利用しない場合は、アカウント画面からJavaScriptタグを取得してメールから遷移するサイトへ設置してください。
          </p>
          <CustomLinkText
            class="analysisSettingsLink"
            text="アカウント＞共通タグ"
            link="/account/tag/"
          />
        </div>
        <div class="form-block">
          <h3>配信停止設定</h3>
          <p>
            配信停止ページはWebサイト上に自動で作成されます。<br />Webサイト機能を使用しないページで配信停止を受け付ける場合は共通タグと配信停止用タグの2つをページ内に設定してください。
          </p>
          <div class="form-item">
            <p class="title">配信停止ページURL</p>
            <CustomInputText
              v-model="basicSettings.senderStopPageUrl"
              :is-disabled="basicSettings.senderStopPageUrl"
              maxlength="20"
              :validation="
                $common.getFormItemsDetail(formItems, 'senderStopPageUrl')
                  .validation
              "
            />
          </div>
          <div class="form-item">
            <p class="title">配信停止用タグ</p>
            <CustomInputTextarea
              v-model="basicSettings.senderStopTag"
              :is-disabled="basicSettings.senderStopTag"
              class="senderStopTag"
              placeholder="IPアドレスを入力してください"
              maxlength="500"
              :validation="
                $common.getFormItemsDetail(formItems, 'senderStopTag')
                  .validation
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
              defaultBasicSettings,
              basicSettings
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          class="btn btn-basic btn-long"
          @click="updateMailBasicSettings()"
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
      defaultBasicSettings: {},
      basicSettings: {},
      recordVersion: null,
      formItems: [
        {
          id: 'senderName',
          validation: [],
        },
        {
          id: 'senderEmail',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumberSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Format01'),
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
          id: 'senderTestEmail',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
        {
          id: 'senderStopPageUrl',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.protocol,
              message: this.$common.getMasterMessage('ErrorMsg_Url03'),
            },
          ],
        },
        {
          id: 'senderStopTag',
          validation: [],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    /**
     * ボタンの非活性処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.basicSettings) {
          if (
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
    this.getMailBasicSettings() // メール基本設定の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * メール基本設定の取得
     */
    getMailBasicSettings() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getMailBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const basicSettings = resData.data.basicSettings

            basicSettings.senderTestEmail = basicSettings.senderTestEmailList.join(
              '\n'
            )
            this.defaultBasicSettings = JSON.parse(
              JSON.stringify(basicSettings)
            )
            this.basicSettings = basicSettings
            this.recordVersion = resData.data.recordVersion
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
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      this.basicSettings = JSON.parse(JSON.stringify(this.defaultBasicSettings))
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * 設定内容を保存ボタン押下処理
     */
    updateMailBasicSettings() {
      const paramData = {
        recordVersion: this.recordVersion,
        basicSettings: this.basicSettings,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateMailBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getMailBasicSettings() // メール基本設定の取得
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
  },
  head() {
    return {
      title: '基本設定｜メール',
    }
  },
}
</script>

<style lang="scss" scoped>
.mail-settings {
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
        border-bottom: 1px solid #e5e5e5;
        p {
          margin-top: 8px;
        }
        &:not(:last-child) {
          border-top: 1px solid #e5e5e5;
        }
        .form-item {
          margin-top: 32px;
          &.tag {
            margin-top: 24px;
            .btn {
              margin-top: 12px;
            }
          }
          .title {
            margin-bottom: 10px;
          }
          .senderTestEmail {
            ::v-deep .custom-input-textarea-block {
              height: 128px;
            }
          }
          .senderStopTag {
            ::v-deep .custom-input-textarea-block {
              height: 268px;
            }
          }
        }
        .analysisSettingsLink {
          margin-top: 24px;
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
