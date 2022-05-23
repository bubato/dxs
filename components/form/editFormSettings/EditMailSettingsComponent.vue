<template>
  <div class="mail-settings">
    <div class="heading">
      <h3 class="form-title">管理者宛メール設定</h3>
      <p class="sub-text">
        フォーム登録時に管理者宛に配信するメールの設定を行います。ここで設定されたメールアドレスに対して設定した内容のメールが送信されます。<br />
        送信元アドレスに複数のアドレスを指定する場合は改行で設定します。
      </p>
    </div>
    <div class="form-block">
      <div class="title">
        <h3 class="form-title flex">
          送信元の情報を設定<TooltipHelp
            label="管理者メールの送り元情報を登録します。"
          />
        </h3>
      </div>
      <div class="contents">
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="メール件名"
            :required="true"
          />
          <CustomInputText
            v-model="mailSettings.sourceSettings.subject"
            placeholder="入力例：フォームから回答がありました"
            maxlength="50"
            :validation="
              $common.getFormItemsDetail(formItems, 'sourceSettingsSubject')
                .validation
            "
          />
        </div>
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="送信元表示名"
            :required="true"
          />
          <CustomInputText
            v-model="mailSettings.sourceSettings.showName"
            placeholder="入力例：bizskyDX管理者宛てメール"
            maxlength="20"
            :validation="
              $common.getFormItemsDetail(formItems, 'sourceSettingsShowName')
                .validation
            "
          />
        </div>
        <div class="form-item">
          <p class="title">送信元メールアドレス</p>
          <CustomInputText
            v-model="mailSettings.sourceSettings.mailAddress"
            class="source-mailAddress"
            :is-disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="form-block">
      <div class="title">
        <h3 class="form-title flex">
          送信先の情報を設定<TooltipHelp
            label="管理者メールの送り先を登録します。"
          />
        </h3>
      </div>
      <div class="contents">
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="送信先メールアドレス"
            :required="true"
          />
          <p class="annotation">
            複数のメールアドレスを設定する場合は改行してメールアドレスを入力してください。5件まで入力できます。
          </p>
          <CustomInputTextarea
            v-model="mailSettings.sendSettings.mailAddress"
            class="send-mailAddress"
            placeholder="メールアドレスを入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'sendSettingsMailAddress')
                .validation
            "
          />
        </div>
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="メール本文"
            :required="true"
          />
          <p class="sub-text">
            右クリックで差し込み可能な項目が表示されます。項目をクリックすると本文に入力されます。
          </p>
          <MailBodyEditor
            v-model="mailSettings.sendSettings.bodyText"
            class="send-bodyText"
            :form-info="formInfo"
            :is-admin="true"
            placeholder="送信内容を入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'sendSettingsBodyText')
                .validation
            "
          />

          <!-- <CustomInputTextarea
            v-model="mailSettings.sendSettings.bodyText"
            class="send-bodyText"
            placeholder="送信内容を入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'sendSettingsBodyText')
                .validation
            "
          /> -->
        </div>
      </div>
    </div>
    <div class="form-block">
      <div class="title">
        <h3 class="form-title flex">
          回答者宛メール設定<TooltipHelp
            label="回答したユーザー宛てメールの情報を登録します。"
          />
        </h3>
      </div>
      <div class="contents">
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="自動返信メール"
            :required="true"
          />
          <CustomInputRadio
            v-model="mailSettings.answerSettings.autoReply"
            name="answerAutoReply"
            :options="answerAutoReplyOptions"
            layout-type="vertical"
          />
        </div>
        <div
          v-if="mailSettings.answerSettings.autoReply === '1'"
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="メール件名"
            :required="true"
          />
          <CustomInputText
            v-model="mailSettings.answerSettings.subject"
            placeholder="入力例：お問い合わせありがとうございました"
            maxlength="50"
            :validation="
              $common.getFormItemsDetail(formItems, 'answerSettingsSubject')
                .validation
            "
          />
        </div>
        <div
          v-if="mailSettings.answerSettings.autoReply === '1'"
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="送信元表示名"
            :required="true"
          />
          <CustomInputText
            v-model="mailSettings.answerSettings.sourceShowName"
            placeholder="入力例：株式会社田中商事お問い合わせフォーム"
            maxlength="20"
            :validation="
              $common.getFormItemsDetail(
                formItems,
                'answerSettingsSourceShowName'
              ).validation
            "
          />
        </div>
        <div
          v-if="mailSettings.answerSettings.autoReply === '1'"
          class="form-item"
        >
          <p class="title">送信元メールアドレス</p>
          <CustomInputText
            v-model="mailSettings.answerSettings.sourceMailAddress"
            :is-disabled="true"
          />
        </div>
        <div
          v-if="mailSettings.answerSettings.autoReply === '1'"
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="メール本文"
            :required="true"
          />
          <p class="sub-text">
            右クリックで差し込み可能な項目が表示されます。項目をクリックすると本文に入力されます。
          </p>
          <MailBodyEditor
            v-model="mailSettings.answerSettings.bodyText"
            class="answer-bodyText"
            placeholder="返信内容を入力してください"
            :form-info="formInfo"
            :validation="
              $common.getFormItemsDetail(formItems, 'answerSettingsBodyText')
                .validation
            "
          />
          <!-- <CustomInputTextarea
            v-model="mailSettings.answerSettings.bodyText"
            class="answer-bodyText"
            placeholder="返信内容を入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'answerSettingsBodyText')
                .validationEditFormSettingsCompo.nent
            "
          /> -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <button
        class="btn btn-cancel btn-long"
        :class="{
          'btn-disabled': $common.checkSameObject(
            propMailSettings,
            mailSettings
          ),
        }"
        @click="showCancelEditModal()"
      >
        キャンセルして元に戻す
      </button>
      <button
        class="btn btn-long btn-cancel"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateEditFormSettings('save')"
      >
        メール設定を保存
      </button>
      <button
        class="btn btn-long btn-basic"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateEditFormSettings('next')"
      >
        メール設定を保存して公開設定へ進む
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import MailBodyEditor from './mailSettings/MailBodyEditor'

export default {
  name: 'EditMailSettingsComponent',
  components: {
    MailBodyEditor,
  },
  props: {
    propMailSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      mailSettings: {},
      answerAutoReplyOptions: [
        {
          value: '1',
          label: '返信する',
        },
        {
          value: '0',
          label: '返信しない',
        },
      ],
      formItems: [
        {
          id: 'sourceSettingsSubject',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'sourceSettingsShowName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'sendSettingsMailAddress',
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
        {
          id: 'sendSettingsBodyText',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 4000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 4000,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.formMailTextFormat,
              message: this.$common.getMasterMessage('ErrorMsg_Format06'),
            },
          ],
        },
        {
          id: 'answerSettingsSubject',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'answerSettingsSourceShowName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'answerSettingsBodyText',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 4000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 4000,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.formMailTextFormat,
              message: this.$common.getMasterMessage('ErrorMsg_Format06'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('form/editFormSettings', ['formInfo']),
    /**
     * ボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false
        const validationItems = {
          sourceSettingsSubject: this.mailSettings.sourceSettings.subject,
          sourceSettingsShowName: this.mailSettings.sourceSettings.showName,
          sendSettingsMailAddress: this.mailSettings.sendSettings.mailAddress,
          sendSettingsBodyText: this.mailSettings.sendSettings.bodyText,
        }

        if (this.mailSettings.answerSettings.autoReply === '1') {
          validationItems.answerSettingsSubject = this.mailSettings.answerSettings.subject
          validationItems.answerSettingsSourceShowName = this.mailSettings.answerSettings.sourceShowName
          validationItems.answerSettingsBodyText = this.mailSettings.answerSettings.bodyText
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

        this.setUpdateBtnDisabledFlg(result)

        return result
      }
    },
  },
  watch: {
    propMailSettings() {
      this.mailSettings = JSON.parse(JSON.stringify(this.propMailSettings))
    },
  },
  created() {
    this.mailSettings = JSON.parse(JSON.stringify(this.propMailSettings))
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('form/editFormSettings', ['setUpdateBtnDisabledFlg']),
    /**
     * 保存してリクエストデータを親に送る
     */
    updateEditFormSettings(afterFunc) {
      const data = {
        requestParam: {
          mailSettings: this.getRequestMailSettings(),
        },
        afterFunc,
      }

      this.$emit('update', data)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     */
    getRequestMailSettings() {
      const requestMailSettings = JSON.parse(JSON.stringify(this.mailSettings))

      if (requestMailSettings.answerSettings.autoReply === '0') {
        delete requestMailSettings.answerSettings.subject
        delete requestMailSettings.answerSettings.sourceShowName
        delete requestMailSettings.answerSettings.sourceMailAddress
        delete requestMailSettings.answerSettings.bodyText
      }

      return requestMailSettings
    },
    /**
     * オブジェクト一致チェック(親画面から呼び出される関数)
     *
     * @param {object} objA オブジェクトA
     * @param {object} objB オブジェクトB
     * @return {boolean} 入力内容に変更があった場合は、true それ以外はfalseを返す
     */
    checkChangeInputData() {
      return !this.$common.checkSameObject(
        this.propMailSettings,
        this.mailSettings
      )
    },
    /**
     * 親画面から呼び出される関数 入力内容を元に戻す
     */
    restoreSettings() {
      this.mailSettings = JSON.parse(JSON.stringify(this.propMailSettings))
    },
  },
}
</script>

<style lang="scss" scoped>
.mail-settings {
  .heading {
    padding-bottom: 32px;
    .form-title {
      display: flex;
      align-items: center;
      font-size: 22px;
      font-weight: 500;
      .icon {
        width: 20px;
        height: 20px;
        fill: #b0b3be;
        margin-left: 10px;
      }
    }
    .sub-text {
      font-size: 13px;
      margin-top: 8px;
    }
  }
  .form-block {
    &:not(:first-child) {
      padding-top: 32px;
      border-top: 1px solid #e5e5e5;
    }
    .title {
      margin-bottom: 32px;
      .form-title {
        font-size: 22px;
        font-weight: 500;
      }
      .sub-text {
        font-size: 13px;
        margin-top: 8px;
      }
    }
    .contents {
      margin-bottom: 32px;
    }
    .form-item {
      ::v-deep .custom-input-text {
        width: 593px;
      }
      .source-mailAddress,
      ::v-deep .custom-input-textarea {
        width: 856px;
      }
      .send-mailAddress {
        height: 128px;
      }
      .send-bodyText {
        height: 220px;
      }
      .answer-bodyText {
        height: 220px;
      }
      .title {
        margin-bottom: 10px;
        font-weight: 500;
      }
      .sub-text {
        font-size: 13px;
        margin-bottom: 12px;
      }
      .annotation {
        font-size: 13px;
        margin-bottom: 8px;
      }
      &:not(:last-child) {
        margin-bottom: 48px;
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
    border-top: 1px solid #e5e5e5;
    button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
