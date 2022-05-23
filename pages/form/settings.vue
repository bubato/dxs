<template>
  <div class="basic-settings">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">基本設定</h2>
        <p class="header-title-sub">
          新しいフォームを作成する際に必要な管理者宛てメールの初期設定値を登録します。
        </p>
      </div>
      <!-- basic settings -->
      <div class="form">
        <div class="form-header">
          <h3 class="form-header-title">管理者宛メール設定</h3>
          <p class="form-header-title-sub">
            フォーム登録時に管理者宛に配信するメールの設定を行います。<br />
            ここで設定されたメールアドレスに対して設定した内容のメールが送信されます。<br />
            送信先メールアドレスに複数のアドレスを指定する場合は改行で設定します。
          </p>
        </div>
        <div class="form-section">
          <div class="form-section-source">
            <h4>送信元の情報を設定</h4>
            <div class="input-form">
              <RequiredFormLabel
                class="form-title"
                label="メール件名"
                :required="false"
              />
              <CustomInputText
                v-model="basicSettings.title"
                maxlength="50"
                placeholder="入力例：フォームから回答がありました"
                :validation="
                  $common.getFormItemsDetail(formItems, 'title').validation
                "
              />
            </div>
            <div class="input-form">
              <RequiredFormLabel
                class="form-title"
                label="送信元表示名"
                :required="false"
              />
              <CustomInputText
                v-model="basicSettings.showName"
                maxlength="20"
                placeholder="入力例：bizskyDX管理者宛てメール"
                :validation="
                  $common.getFormItemsDetail(formItems, 'showName').validation
                "
              />
            </div>
            <div class="input-form">
              <p>送信元メールアドレス</p>
              <CustomInputText
                v-model="basicSettings.sourceMailAddress"
                :is-disabled="true"
                :validation="
                  $common.getFormItemsDetail(formItems, 'sourceMailAddress')
                    .validation
                "
              />
            </div>
          </div>
          <div class="form-section-sender">
            <h4>送信先の情報を設定</h4>
            <div class="input-form">
              <RequiredFormLabel
                class="form-title"
                label="送信先メールアドレス"
                :required="false"
              />
              <p class="context">
                複数のメールアドレスを設定する場合は改行してメールアドレスを入力してください。5件まで入力できます。
              </p>
              <CustomInputTextarea
                v-model="basicSettings.senderMailAddress"
                class="textarea"
                placeholder="メールアドレスを入力してください"
                :validation="
                  $common.getFormItemsDetail(formItems, 'senderMailAddress')
                    .validation
                "
              />
            </div>
          </div>
        </div>
      </div>
      <!-- /basic settings -->
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
          @click="updateFormBasicSettings()"
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
  components: {
    CommonFooter,
  },
  data() {
    return {
      defaultBasicSettings: {
        title: '',
        showName: '',
        sourceMailaddress: '',
        senderMailaddress: '',
      },
      basicSettings: {
        title: '',
        showName: '',
        sourceMailaddress: '',
        senderMailaddress: '',
      },
      formItems: [
        {
          id: 'title',
          validation: [],
        },
        {
          id: 'showName',
          validation: [],
        },
        {
          id: 'sourceMailAddress',
          validation: [],
        },
        {
          id: 'senderMailAddress',
          validation: [
            {
              type: 'maxlength',
              maxlength: 500,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 500,
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
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.fiveLineBreaks,
              message: this.$common.getMasterMessage('ErrorMsg_Mail03'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    /**
     * 設定内容を保存ボタン非活性チェック処理
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
  watch: {},
  created() {
    this.getFormBasicSettings()
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    getFormBasicSettings() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getFormBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const basicSettings = this.setNullInitData(
              resData.data.basicSettings
            )
            this.defaultBasicSettings = basicSettings
            this.basicSettings = JSON.parse(
              JSON.stringify(this.defaultBasicSettings)
            )
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
     * @param {object} basicSettings 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(basicSettings) {
      if (basicSettings.title === null) basicSettings.title = ''
      if (basicSettings.showName === null) basicSettings.showName = ''
      if (basicSettings.sourceMailAddress === null)
        basicSettings.sourceMailAddress = ''
      if (basicSettings.senderMailAddress === null)
        basicSettings.senderMailAddress = ''

      return basicSettings
    },
    restoreSettings() {
      this.basicSettings = JSON.parse(JSON.stringify(this.defaultBasicSettings))
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * フォーム基本設定の更新処理
     */
    updateFormBasicSettings() {
      const paramData = {
        basicSettings: this.basicSettings,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateFormBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getFormBasicSettings()
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
      title: '基本設定｜フォーム｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-settings {
  h2,
  h3,
  h4 {
    font-weight: 500;
  }
  .header {
    padding-bottom: 40px;
    &-title-sub {
      margin-top: 8px;
    }
  }
  .form {
    padding: 40px 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    &-header {
      &-title {
        display: flex;
        align-items: center;
        ::v-deep .tooltip {
          margin-left: 8px;
        }
      }
      &-title-sub {
        margin-top: 8px;
      }
    }

    &-section {
      margin-top: 32px;
      &-source,
      &-sender {
        ::v-deep .custom-input-text,
        ::v-deep .custom-input-textarea {
          margin-top: 14px;
        }
        h3 {
          margin-bottom: 23px;
        }
        .input-form {
          &:not(:first-child) {
            margin-top: 32px;
          }
        }
      }
      .form-section-sender {
        margin-top: 48px;
        .form-title {
          margin-bottom: 8px;
        }
        .context {
          font-size: 13px;
          margin-bottom: 12px;
        }
        .textarea {
          ::v-deep .custom-input-textarea-block {
            height: 128px;
          }
        }
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
