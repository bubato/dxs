<template>
  <div class="publish-settings">
    <div class="form-block input-settings">
      <div class="title">
        <h3 class="form-title flex">
          受付期間の設定<TooltipHelp
            label="受付期間を設定すると自動でフォームの受付開始、受付終了を制御できます。"
          />
        </h3>
      </div>
      <div class="contents">
        <div class="form-item">
          <RequiredFormLabel class="title" label="受付期間" :required="true" />
          <CustomInputRadio
            v-model="publishSettings.receptionPeriodSettings.receptionPeriod"
            name="receptionPeriod"
            :options="receptionPeriodOptions"
            layout-type="vertical"
          />
        </div>
        <div
          v-show="
            publishSettings.receptionPeriodSettings.receptionPeriod === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="受付開始日時"
            :required="true"
          />
          <div class="input-dateTime">
            <CustomDatePicker
              v-model="
                publishSettings.receptionPeriodSettings.acceptedStartDate
              "
              class="date-picker"
              :validation="
                $common.getFormItemsDetail(formItems, 'acceptedStartDate')
                  .validation
              "
            />
            <CustomSelectHours
              v-model="
                publishSettings.receptionPeriodSettings.acceptedStartHours
              "
              class="input-hours"
            />
            <CustomSelectMinutes
              v-model="
                publishSettings.receptionPeriodSettings.acceptedStartMinutes
              "
              class="input-minutes"
            />
            <span>から</span>
          </div>
        </div>
        <div
          v-show="
            publishSettings.receptionPeriodSettings.receptionPeriod === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="受付終了日時"
            :required="false"
          />
          <div class="input-dateTime">
            <CustomDatePicker
              v-model="publishSettings.receptionPeriodSettings.acceptedEndDate"
              class="date-picker"
              :validation="
                $common.getFormItemsDetail(formItems, 'acceptedEndDate')
                  .validation
              "
            />
            <CustomSelectHours
              v-model="publishSettings.receptionPeriodSettings.acceptedEndHours"
              class="input-hours"
            />
            <CustomSelectMinutes
              v-model="
                publishSettings.receptionPeriodSettings.acceptedEndMinutes
              "
              class="input-minutes"
            />
            <span>まで</span>
          </div>
        </div>
        <div
          v-show="
            moreDetail &&
            publishSettings.receptionPeriodSettings.receptionPeriod === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="受付開始前の表示メッセージ"
            :required="true"
          />
          <WysiwygEditor
            class="wysiwyg-editor"
            :prop-html="
              publishSettings.receptionPeriodSettings
                .outsideTheReceptionPeriodeBeforeMessage
            "
            :validation="
              $common.getFormItemsDetail(
                formItems,
                'outsideTheReceptionPeriodeBeforeMessage'
              ).validation
            "
            @updateHtml="
              updateHtml($event, 'outsideTheReceptionPeriodeBeforeMessage')
            "
          />
        </div>
        <div
          v-show="
            moreDetail &&
            publishSettings.receptionPeriodSettings.receptionPeriod === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="受付終了後の表示メッセージ"
            :required="true"
          />
          <WysiwygEditor
            class="wysiwyg-editor"
            :prop-html="
              publishSettings.receptionPeriodSettings
                .outsideTheReceptionPeriodeAfterMessage
            "
            :validation="
              $common.getFormItemsDetail(
                formItems,
                'outsideTheReceptionPeriodeAfterMessage'
              ).validation
            "
            @updateHtml="
              updateHtml($event, 'outsideTheReceptionPeriodeAfterMessage')
            "
          />
        </div>
      </div>
    </div>
    <div v-show="moreDetail" class="more-elements">
      <div class="form-block">
        <div class="title">
          <h3 class="form-title flex">
            定員数の設定<TooltipHelp
              label="定員数を設定すると回答数が定員を超過した際にフォームの受付が終了します。"
            />
          </h3>
        </div>
        <div class="contents">
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="回答数に上限を設ける"
              :required="true"
            />
            <CustomInputRadio
              v-model="publishSettings.capacitySettings.limitAnswer"
              name="limitAnswer"
              :options="limitAnswerOptions"
              layout-type="vertical"
            />
          </div>
          <div
            v-show="publishSettings.capacitySettings.limitAnswer === '1'"
            class="form-item"
          >
            <RequiredFormLabel class="title" label="定員数" :required="true" />
            <div class="flex">
              <CustomInputText
                v-model="publishSettings.capacitySettings.capacity"
                class="capacity"
                maxlength="5"
                :validation="
                  $common.getFormItemsDetail(formItems, 'capacity').validation
                "
              /><span class="text-unit">人</span>
            </div>
          </div>
          <div
            v-show="publishSettings.capacitySettings.limitAnswer === '1'"
            class="form-item"
          >
            <RequiredFormLabel
              class="title"
              label="定員満了時の表示メッセージ"
              :required="true"
            />
            <WysiwygEditor
              class="wysiwyg-editor"
              :prop-html="publishSettings.capacitySettings.expiredMessage"
              :validation="
                $common.getFormItemsDetail(formItems, 'expiredMessage')
                  .validation
              "
              @updateHtml="updateHtml($event, 'expiredMessage')"
            />
          </div>
        </div>
      </div>
      <div class="form-block">
        <div class="title">
          <h3 class="form-title flex">
            セキュリティの設定<TooltipHelp
              label="よりセキュリティを高めるためにスパム対策機能を有効にしてください。"
            />
          </h3>
        </div>
        <div class="contents">
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="スパム対策機能"
              :required="false"
            />
            <CustomInputSingleCheckbox
              v-model="publishSettings.securitySettings.antiSpamFunction"
              name="antiSpamFunction"
              label="明示的なボット保護を有効化"
            />
          </div>
        </div>
      </div>
      <!--ph1対象外
      <div class="form-block">
        <div class="title">
          <h3 class="form-title flex">
            その他の設定<TooltipHelp
              label="回答に対するステータスを登録できます。（例：未対応、対応済など）"
            />
          </h3>
        </div>
        <div class="contents">
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="回答データのステータス管理"
              :required="true"
            />
            <CustomInputRadio
              v-model="publishSettings.otherSettings.statusManagement"
              name="statusManagement"
              :options="statusManagementOptions"
            />
            <div
              v-show="publishSettings.otherSettings.statusManagement === '1'"
              class="statusManagement"
            >
              <div
                v-for="(text, index) in publishSettings.otherSettings
                  .statusManagementTexts"
                :key="index"
                class="statusManagementText"
              >
                <CustomInputText
                  v-model="
                    publishSettings.otherSettings.statusManagementTexts[index]
                  "
                  :value="text"
                  maxlength="20"
                  :validation="
                    $common.getFormItemsDetail(
                      formItems,
                      'statusManagementTexts'
                    ).validation
                  "
                  @input="updateStatusManagementText($event, index)"
                />
                <CancelSVG
                  v-show="index > 0"
                  class="icon icon-cancel"
                  @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                  @click="deleteStatusManagementText(index)"
                />
              </div>
            </div>
            <div
              v-show="publishSettings.otherSettings.statusManagement === '1'"
              class="add-item"
              @click="addStatusManagementText()"
            >
              <AddCircleSVG class="icon icon-addCircle" />
              <span>ステータスを追加</span>
            </div>
          </div>
        </div>
      </div>
      -->
    </div>
    <MoreFormDetail
      class="more-detail"
      type="publish"
      :more-detail="moreDetail"
      @change="moreDetail = !moreDetail"
    />
    <div class="buttons">
      <div class="column">
        <div class="first">
          <button
            class="btn btn-cancel btn-long"
            :class="{
              'btn-disabled': $common.checkSameObject(
                propPublishSettings,
                publishSettings
              ),
            }"
            @click="showCancelEditModal()"
          >
            キャンセルして元に戻す
          </button>
          <button
            class="btn btn-long btn-basic"
            :class="{ 'btn-disabled': checkBtnDisabled() }"
            @click="updateEditFormSettings('save')"
          >
            公開設定を保存
          </button>
          <button
            class="btn btn-long btn-basic"
            :class="{ 'btn-disabled': checkBtnDisabled() }"
            @click="updateEditFormSettings('next')"
          >
            公開設定を保存してタグを表示
          </button>
        </div>
        <div class="second">
          <button
            v-if="publishSettings.releaseFlag === 1"
            class="btn btn-long btn-primary"
            :class="{ 'btn-disabled': checkBtnDisabled() }"
            @click="updatePublishSettings(0)"
          >
            フォームを非公開
          </button>
          <button
            v-else
            class="btn btn-long btn-primary"
            :class="{ 'btn-disabled': checkBtnDisabled() }"
            @click="updatePublishSettings(1)"
          >
            フォームを公開
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditPublishSettingsComponent',
  components: {},
  props: {
    propPublishSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      publishSettings: {},
      moreDetail: false,
      receptionPeriodOptions: [
        {
          value: '1',
          label: '設定する',
        },
        {
          value: '0',
          label: '設定しない',
        },
      ],
      limitAnswerOptions: [
        {
          value: '1',
          label: '設定する',
        },
        {
          value: '0',
          label: '設定しない',
        },
      ],
      messageLanguageOptions: [
        {
          code: '1',
          label: '日本語',
        },
        {
          code: '2',
          label: '英語',
        },
        {
          code: '3',
          label: '中国語',
        },
      ],
      statusManagementOptions: [
        {
          value: '1',
          label: '設定する',
        },
        {
          value: '0',
          label: '設定しない',
        },
      ],
      formItems: [
        {
          id: 'acceptedStartDate',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'acceptedEndDate',
          validation: [],
        },
        {
          id: 'outsideTheReceptionPeriodeBeforeMessage',
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
          ],
        },
        {
          id: 'outsideTheReceptionPeriodeAfterMessage',
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
          ],
        },
        {
          id: 'expiredMessage',
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
          ],
        },
        {
          id: 'statusManagementTexts',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'capacity',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
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

        const validationItems = {}

        if (
          this.publishSettings.receptionPeriodSettings.receptionPeriod === '1'
        ) {
          validationItems.acceptedStartDate = this.publishSettings.receptionPeriodSettings.acceptedStartDate
          validationItems.outsideTheReceptionPeriodeBeforeMessage = this.publishSettings.receptionPeriodSettings.outsideTheReceptionPeriodeBeforeMessage
          validationItems.outsideTheReceptionPeriodeAfterMessage = this.publishSettings.receptionPeriodSettings.outsideTheReceptionPeriodeAfterMessage
        }

        if (this.publishSettings.capacitySettings.limitAnswer === '1') {
          validationItems.capacity = this.publishSettings.capacitySettings.capacity
          validationItems.expiredMessage = this.publishSettings.capacitySettings.expiredMessage
        }

        if (this.publishSettings.otherSettings.statusManagement === '1') {
          validationItems.statusManagementTexts = this.publishSettings.otherSettings.statusManagementTexts
        }

        for (const key in validationItems) {
          if (key === 'statusManagementTexts') {
            for (let i = 0; i < validationItems[key].length; i++) {
              const value = validationItems[key][i]
              if (
                this.$common.checkExistValidation(this.formItems, key, value)
              ) {
                result = true
                break
              }
            }
          } else {
            const value = validationItems[key]
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        }

        this.setUpdateBtnDisabledFlg(result)

        return result
      }
    },
  },
  watch: {
    propPublishSettings() {
      this.publishSettings = JSON.parse(
        JSON.stringify(this.propPublishSettings)
      )
    },
  },
  created() {
    this.publishSettings = JSON.parse(JSON.stringify(this.propPublishSettings))
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('form/editFormSettings', [
      'setUpdateBtnDisabledFlg',
      'setShowCompleteFormPublishModalState',
    ]),
    /**
     * 回答データのステータス管理入力項目の追加
     */
    addStatusManagementText() {
      this.publishSettings.otherSettings.statusManagementTexts.push('')
    },
    /**
     * 回答データのステータス管理入力項目の追加
     */
    deleteStatusManagementText(index) {
      this.publishSettings.otherSettings.statusManagementTexts.splice(index, 1)
    },
    updateStatusManagementText(value, index) {
      this.publishSettings.otherSettings.statusManagementTexts[index] = value
    },
    updateHtml(value, id) {
      if (id === 'outsideTheReceptionPeriodeBeforeMessage') {
        this.publishSettings.receptionPeriodSettings.outsideTheReceptionPeriodeBeforeMessage = value
      } else if (id === 'outsideTheReceptionPeriodeAfterMessage') {
        this.publishSettings.receptionPeriodSettings.outsideTheReceptionPeriodeAfterMessage = value
      } else if (id === 'expiredMessage') {
        this.publishSettings.capacitySettings.expiredMessage = value
      }
    },
    /**
     * 保存してリクエストデータを親に送る
     */
    updateEditFormSettings(afterFunc) {
      const data = {
        requestParam: {
          publishSettings: this.getRequestPublishSettings(),
        },
        afterFunc,
      }

      this.$emit('update', data)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     */
    getRequestPublishSettings() {
      const requestPublishSettings = JSON.parse(
        JSON.stringify(this.publishSettings)
      )

      if (
        requestPublishSettings.receptionPeriodSettings.receptionPeriod === '0'
      ) {
        delete requestPublishSettings.receptionPeriodSettings.acceptedStartDate
        delete requestPublishSettings.receptionPeriodSettings.acceptedStartHours
        delete requestPublishSettings.receptionPeriodSettings
          .acceptedStartMinutes
        delete requestPublishSettings.receptionPeriodSettings.acceptedEndDate
        delete requestPublishSettings.receptionPeriodSettings.acceptedEndHours
        delete requestPublishSettings.receptionPeriodSettings.acceptedEndMinutes
        delete requestPublishSettings.receptionPeriodSettings
          .outsideTheReceptionPeriodeBeforeMessage
        delete requestPublishSettings.receptionPeriodSettings
          .outsideTheReceptionPeriodeAfterMessage
      }

      if (requestPublishSettings.capacitySettings.limitAnswer === '0') {
        delete requestPublishSettings.capacitySettings.capacity
        delete requestPublishSettings.capacitySettings.expiredMessage
      }

      if (requestPublishSettings.otherSettings.statusManagement === '0') {
        delete requestPublishSettings.otherSettings.statusManagementTexts
      }

      requestPublishSettings.securitySettings.messageLanguage = '1'

      return requestPublishSettings
    },
    /**
     * フォーム公開/非公開設定処理
     */
    updatePublishSettings(releaseFlag) {
      const paramData = {
        formId: this.formInfo.formId,
        releaseFlag,
        recordVersion: this.formInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updatePublishSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (releaseFlag === 1) {
              this.setShowCompleteFormPublishModalState(true)
            } else if (releaseFlag === 0) {
              this.$common.showCompletePopAlert('ActionMsg_Gen06', 'フォーム')
            }
            this.$emit('refresh')
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
     * オブジェクト一致チェック(親画面から呼び出される関数)
     *
     * @param {object} objA オブジェクトA
     * @param {object} objB オブジェクトB
     * @return {boolean} 入力内容に変更があった場合は、true それ以外はfalseを返す
     */
    checkChangeInputData() {
      return !this.$common.checkSameObject(
        this.propPublishSettings,
        this.publishSettings
      )
    },
    /**
     * 親画面から呼び出される関数 入力内容を元に戻す
     */
    restoreSettings() {
      this.publishSettings = JSON.parse(
        JSON.stringify(this.propPublishSettings)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.publish-settings {
  .form-block {
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
      .capacity {
        width: 175px;
      }
      .message-language {
        width: 300px;
      }
      .title {
        margin-bottom: 10px;
      }
      &:not(:last-child) {
        margin-bottom: 48px;
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
      .statusManagementText {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        ::v-deep .custom-input-text {
          width: 100%;
        }
        .icon {
          margin-left: 16px;
        }
      }
      .add-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
        cursor: pointer;
        .icon {
          fill: #3a435c;
        }
        span {
          margin-left: 10px;
        }
      }
    }
  }
  .more-elements {
    padding-top: 48px;
    .form-block {
      padding-top: 32px;
      border-top: 1px solid #e5e5e5;
    }
  }
  .wysiwyg-editor {
    width: 854px;
  }
  .buttons {
    padding-top: 40px;
    border-top: 1px solid #e5e5e5;
    .column {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
      .first,
      .second {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .second {
        margin-top: 24px;
        margin-right: 36px;
      }
    }
  }
  .text-unit {
    margin-left: 10px;
  }
}
</style>
