<template>
  <div class="mail-settings">
    <div class="left-contents">
      <div class="form-block">
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="配信元表示名"
            :required="true"
          />
          <CustomInputText
            v-model="mailSettings.senderName"
            class="mailSubject"
            placeholder="メールの送信元を入力してください"
            maxlength="30"
            :validation="
              $common.getFormItemsDetail(formItems, 'senderName').validation
            "
          />
        </div>
        <div class="form-item">
          <p class="title">配信元メールアドレス</p>
          <CustomInputText
            v-model="mailSettings.senderMailAddress"
            placeholder="メールの送信元を入力してください"
            maxlength="120"
            :validation="
              $common.getFormItemsDetail(formItems, 'senderMailAddress')
                .validation
            "
          />
        </div>
        <div class="form-item">
          <p class="title">ゴール設定</p>
          <p class="context">
            フォームの完了をゴールとして設定できます。ゴールした回数はコンバージョン（CV）として集計されます。
          </p>
          <CustomInputSelect
            v-model="mailSettings.formId"
            :options="getFormInformationOptions()"
            class="goalSettings"
            placeholder="メールの送信元を入力してください"
          />
        </div>
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="配信フラグを無視"
            :required="true"
          />
          <p class="context">
            チェックを入れると配信停止登録されたコンタクトに対してもメールを送信します。十分にご注意ください。
          </p>
          <CustomInputSingleCheckbox
            v-model="mailSettings.ignoreSendFlag"
            class="ignoreSendFlag"
            name="ignoreSendFlag"
            label="配信フラグを無視して配信"
          />
        </div>
        <div class="form-item">
          <RequiredFormLabel class="title" label="配信方法" :required="true" />
          <CustomInputRadio
            v-model="mailSettings.sendType"
            name="sendType"
            :options="sendTypeOptions"
          />
        </div>
        <div v-if="mailSettings.sendType === '1'" class="form-item">
          <RequiredFormLabel
            class="title"
            label="配信予約日時"
            :required="true"
          />
          <div class="input-dateTime">
            <CustomDatePicker
              v-model="mailSettings.sendPlanDate"
              class="date-picker"
            />
            <CustomSelectHours
              v-model="mailSettings.sendPlanHours"
              class="input-hours"
            />
            <CustomSelectMinutes
              v-model="mailSettings.sendPlanMinutes"
              class="input-minutes"
            />
            <span>から</span>
          </div>
        </div>
      </div>
      <SendErrorContext v-if="mailStatus === '4'" />
      <div v-else class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': !checkChangeInputData(),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateEditMailSettings('save')"
        >
          配信設定を保存
        </button>
        <button
          v-if="mailStatus !== '1'"
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateEditMailSettings('send')"
        >
          メールを配信
        </button>
        <button
          v-if="mailStatus === '1'"
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateEditMailSettings('sendCancel')"
        >
          配信予約を取り消す
        </button>
      </div>
    </div>
    <div class="right-contents">
      <div class="contact-info">
        <div class="contact-num">
          <h4>設定した条件に合致する<br />配信コンタクト数</h4>
          <ProgressCircleBar
            v-if="sendCount.ableCount && sendCount.totalCount"
            :progress="(sendCount.ableCount / sendCount.totalCount) * 100"
            class="progressCircle"
          />
          <h5>
            配信可能数：{{ sendCount.ableCount }}/{{ sendCount.totalCount }}
          </h5>
          <p v-show="!sendCount.sendCountCheckFlag" class="error">
            配信数が上限を超えています。
          </p>
          <div class="buttons">
            <button
              class="btn btn-secondary btn-long"
              @click="downloadContactList()"
            >
              配信リストをダウンロード
            </button>
          </div>
        </div>
        <div class="test-send">
          <h4>テスト送信</h4>
          <p>
            テストメールを配信するアドレスを入力してください。<br />複数の宛先に配信する場合は改行してアドレスを入力してください。<br />一度に配信できるアドレスは5つまでです。
          </p>
          <CustomInputTextarea
            v-model="mailSettings.testSendAddress"
            class="test-send-address"
            :validation="
              $common.getFormItemsDetail(formItems, 'testSendAddress')
                .validation
            "
          />
          <div class="buttons">
            <button
              class="btn btn-basic btn-middle"
              :class="{ 'btn-disabled': checkBtnDisabled() }"
              @click="updateEditMailSettings('sendTest')"
            >
              テストメールを送信
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditMailContentsSettingsComponent',
  components: {},
  props: {
    propMailSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
    propSendCondition: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      defaultMailSettings: {},
      mailSettings: {},
      inputTestMails: [],
      sendCount: {
        totalCount: 0,
        ableCount: 0,
        sendCountCheckFlag: true,
      },
      sendTypeOptions: [
        {
          value: '0',
          label: '即時配信',
        },
        {
          value: '1',
          label: '予約配信',
        },
      ],
      formItems: [
        {
          id: 'senderName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'senderMailAddress',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
        {
          id: 'testSendAddress',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('mail/editMailSettings', ['formInformation', 'mailStatus']),
    /**
     * ボタンの非活性処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.mailSettings) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.mailSettings[key]
            )
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
    /**
     * フォーム情報をセレクトボックスの形式で取得
     *
     * @return {Object[]} フォーム情報
     */
    getFormInformationOptions() {
      return () => {
        return this.formInformation.map((data) => {
          return {
            code: data.baseFormId,
            label: data.baseFormTitle,
          }
        })
      }
    },
  },
  watch: {
    propMailSettings() {
      this.initFunc() // 初期値設定処理
    },
  },
  created() {
    this.initFunc() // 初期値設定処理
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    /**
     * 初期値設定処理
     */
    initFunc() {
      this.defaultMailSettings = this.getMailSettings()
      this.mailSettings = JSON.parse(JSON.stringify(this.defaultMailSettings))
      this.getMailContactCount()
    },
    /**
     * 画面の入力情報の取得
     */
    getMailSettings() {
      const mailSettings = JSON.parse(JSON.stringify(this.propMailSettings))

      mailSettings.ignoreSendFlag = mailSettings.ignoreSendFlag === '1'
      mailSettings.testSendAddress = mailSettings.testSendAddress.join('\n')

      return mailSettings
    },
    /**
     * 保存してリクエストデータを親に送る
     *
     * @param {string} afterFunc 保存後の処理
     */
    updateEditMailSettings(afterFunc) {
      const data = {
        requestParam: {
          sendConfiguration: this.getRequestMailSettings(),
        },
        afterFunc,
      }

      this.$emit('update', data)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     *
     * @return {Object} リクエストパラメータ
     */
    getRequestMailSettings() {
      const requestMailSettings = JSON.parse(JSON.stringify(this.mailSettings))

      requestMailSettings.ignoreSendFlag = requestMailSettings.ignoreSendFlag
        ? '1'
        : ' 0'

      return requestMailSettings
    },
    /**
     * オブジェクト一致チェック(親画面から呼び出される関数)
     *
     * @return {boolean} 入力内容に変更があった場合は、true それ以外はfalseを返す
     */
    checkChangeInputData() {
      return !this.$common.checkSameObject(
        this.defaultMailSettings,
        this.mailSettings
      )
    },
    /**
     * 配信条件設定内容の入力ブロックの追加
     */
    addInputCondition() {
      this.mailSettings.conditionContents.push({
        contentId: null,
        contentName: '',
        contentValue: '',
        contentSearchType: '',
      })
    },
    /**
     * 選択した配信条件設定内容の入力ブロックの削除
     *
     * @param {number} index 削除対象のインデックス
     */
    deleteCondition(index) {
      this.mailSettings.conditionContents.splice(index, 1)
    },
    /**
     * 配信リストのダウンロード
     */
    downloadContactList() {
      const paramData = {
        sendCondition: this.propSendCondition,
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailContactsCsv(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const nowDate = this.$common.getFormatCurrentDate('YYYYMMDDhhmmss')

            this.$common.csvFileDownload(
              resData.data.csvData,
              `contact_general_${nowDate}.csv`
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
     * コンタクト数の取得
     */
    getMailContactCount() {
      const paramData = {
        sendCondition: this.propSendCondition,
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailContactCount(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.sendCount.totalCount = resData.data.sendCount.totalCount
            this.sendCount.ableCount = resData.data.sendCount.ableCount
            this.sendCount.sendCountCheckFlag = resData.data.sendCountCheckFlag
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
     * 親画面から呼び出される関数 入力内容を元に戻す
     */
    restoreSettings() {
      this.initFunc() // 初期値設定処理
    },
  },
}
</script>

<style lang="scss" scoped>
.mail-settings {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .left-contents {
    .form-block {
      .form-item {
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .title {
          margin-bottom: 10px;
        }
        .context {
          font-size: 13px;
        }
        .goalSettings,
        .ignoreSendFlag {
          margin-top: 12px;
        }
        .goalSettings {
          width: 360px;
        }
        .input-dateTime {
          display: flex;
          align-items: center;
          .date-picker {
            ::v-deep input[type='text'] {
              width: 200px;
            }
          }
          .input-hours,
          .input-minutes {
            margin-left: 16px;
          }
          span {
            margin-left: 16px;
          }
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 48px;
      padding-top: 40px;
      border-top: 1px solid #e5e5e5;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
  .right-contents {
    margin-left: 40px;
    .contact-info {
      width: 320px;
      padding: 32px 24px;
      box-shadow: 0px 1px 5px #00000029;
      border-radius: 6px;
      .contact-num {
        padding: 0 26px;
        .progressCircle {
          margin: 24px auto 0 auto;
          width: 200px;
          height: 200px;
        }
        h5 {
          margin-top: 16px;
          text-align: center;
        }
        .error {
          margin-top: 8px;
          color: #e60012;
          text-align: center;
        }
        .buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 16px;
          padding-bottom: 24px;
          .btn {
            font-size: 13px;
          }
        }
      }
      .test-send {
        padding-top: 24px;
        border-top: 1px solid #e5e5e5;
        h4 {
          text-align: center;
        }
        p {
          margin-top: 16px;
        }
        .suggestTextarea {
          margin-top: 16px;
        }
        .buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 32px;
        }
        &-address {
          margin-top: 16px;
          ::v-deep .custom-input-textarea-block {
            height: 188px;
          }
        }
      }
    }
  }
}
</style>
