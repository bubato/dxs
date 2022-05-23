<template>
  <div class="form-settings">
    <div class="form-block">
      <div class="title">
        <RequiredFormLabel
          class="form-title"
          label="入力画面の設定"
          :required="true"
        />
        <p class="sub-text">
          点線で括られたエリアに下のフォームパーツをドラッグ＆ドロップして設置してください。
        </p>
      </div>
      <div class="contents">
        <FormEditParts
          class="form-item"
          :select-parts="formSettings.selectParts"
          @update="updateSelectParts($event)"
        />
        <div v-show="moreDetail" class="form-item">
          <RequiredFormLabel
            class="title"
            label="入力画面の送信ボタンの文字"
            :required="true"
          />
          <CustomInputText
            v-model="formSettings.inputScreenSendBtnName"
            placeholder="入力例：次へ"
            maxlength="20"
            class="input-text"
            :validation="
              $common.getFormItemsDetail(formItems, 'inputScreenSendBtnName')
                .validation
            "
          />
        </div>
      </div>
    </div>
    <div v-show="moreDetail" class="more-elements">
      <div class="form-block confirm-settings">
        <div class="title">
          <h3 class="form-title">確認画面の設定</h3>
          <p class="sub-text">
            入力確認画面の表示有無を選択します。なしを選択すると、確認画面を挟まずに入力画面から完了画面に直接遷移します。
          </p>
        </div>
        <div class="contents">
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="確認画面の表示"
              :required="true"
            />
            <CustomInputRadio
              v-model="formSettings.showConfirmScreen"
              name="showConfirmScreen"
              :options="showConfirmScreenOptions"
              layout-type="vertical"
            />
          </div>
          <div v-if="formSettings.showConfirmScreen === '1'" class="form-item">
            <RequiredFormLabel
              class="title"
              label="確認画面の送信ボタンの文字"
              :required="true"
            />
            <CustomInputText
              v-model="formSettings.sendBtnName"
              placeholder="入力例：上記の内容で送信する"
              maxlength="20"
              class="input-text"
              :validation="
                $common.getFormItemsDetail(formItems, 'sendBtnName').validation
              "
            />
          </div>
          <div v-if="formSettings.showConfirmScreen === '1'" class="form-item">
            <RequiredFormLabel
              class="title"
              label="確認画面の戻るボタンの文字"
              :required="true"
            />
            <CustomInputText
              v-model="formSettings.backBtnName"
              placeholder="入力例：戻る"
              maxlength="20"
              class="input-text"
              :validation="
                $common.getFormItemsDetail(formItems, 'backBtnName').validation
              "
            />
          </div>
        </div>
      </div>
      <div class="form-block confirm-settings">
        <div class="title">
          <h3 class="form-title">完了画面の設定</h3>
          <p class="sub-text">フォーム登録後に遷移する画面の設定を行います。</p>
        </div>
        <div class="contents">
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="完了画面の表示"
              :required="true"
            />
            <div class="flex flexAlignEnd">
              <CustomInputRadio
                v-model="formSettings.showCompleteScreen"
                name="showCompleteScreen"
                :options="showCompleteScreenOptions"
                layout-type="vertical"
              />
              <TooltipHelp label="完了時に指定したURLへ自動的に移動します。" />
            </div>
          </div>
          <div v-show="formSettings.showCompleteScreen === '1'">
            <div class="form-item">
              <RequiredFormLabel
                class="title"
                label="完了画面のメッセージ"
                :required="true"
              />
              <WysiwygEditor
                class="wysiwyg-editor"
                :prop-html="formSettings.completeScreenMessage"
                :validation="
                  $common.getFormItemsDetail(formItems, 'completeScreenMessage')
                    .validation
                "
                @updateHtml="updateHtml($event)"
              />
            </div>
            <div class="form-item">
              <RequiredFormLabel
                class="title"
                label="ダウンロードファイルの添付"
                :required="true"
              />
              <CustomInputRadio
                v-model="formSettings.completeScreenDownloadFileAttachmentFlag"
                name="completeScreenDownloadFileAttachmentFlag"
                :options="completeScreenDownloadFileAttachmentFlagOptions"
                layout-type="vertical"
              />
              <div
                v-if="
                  formSettings.completeScreenDownloadFileAttachmentFlag === '1'
                "
                class="downloadFileList"
              >
                <div v-if="formSettings.downloadFile.length === 0">
                  <button
                    class="btn btn-middle btn-secondary"
                    @click="showFileUploadModal('new')"
                  >
                    ファイルを選択
                  </button>
                </div>
                <div
                  v-for="(fileInfo, index) in formSettings.downloadFile"
                  :key="index"
                  class="downloadFile"
                >
                  <div class="flex flex-between">
                    <p class="title">
                      {{ index + 1 }}つ目のダウンロードファイル項目
                    </p>
                    <DeleteSVG
                      class="icon icon-delete"
                      @click="deleteInputFile(index)"
                      @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                      @mouseleave="$common.setAreaLabel($event, '', '')"
                      @blur="$common.setAreaLabel($event, '', '')"
                    />
                  </div>
                  <button
                    v-if="
                      !fileInfo.file &&
                      !fileInfo.storageObjectId &&
                      !fileInfo.downloadFileId
                    "
                    class="btn btn-middle btn-secondary"
                    @click="showFileUploadModal('update')"
                  >
                    ファイルを選択
                  </button>
                  <div v-else class="fileDetail">
                    <div class="form-item">
                      <RequiredFormLabel
                        class="title"
                        label="ダウンロードファイル表示名"
                        :required="true"
                      />
                      <CustomInputText
                        v-model="fileInfo.fileTitle"
                        placeholder=""
                        maxlength="20"
                        class="input-text"
                      />
                    </div>
                    <div class="form-item">
                      <RequiredFormLabel
                        class="title"
                        label="class属性追加"
                        :required="false"
                      />
                      <CustomInputText
                        v-model="fileInfo.classAttribute"
                        placeholder=""
                        maxlength="20"
                        class="input-text"
                      />
                    </div>
                    <div class="form-item">
                      <RequiredFormLabel
                        class="title"
                        label="アップロードファイル名"
                        :required="false"
                      />
                      <a
                        v-if="fileInfo.url"
                        class="link-text"
                        target="_blank"
                        :href="fileInfo.url"
                        >{{ fileInfo.fileTitle }}</a
                      >
                      <p v-else>{{ fileInfo.fileTitle }}</p>
                    </div>
                  </div>
                </div>
                <AddBlockItem
                  v-if="
                    $common.checkArrayValue(formSettings.downloadFile) &&
                    formSettings.downloadFile.length < 2
                  "
                  class="add-item"
                  @addItem="addInputFileBlock()"
                />
              </div>
            </div>
            <div class="form-item">
              <RequiredFormLabel
                class="title"
                label="完了ボタンの表示"
                :required="true"
              />
              <CustomInputRadio
                v-model="formSettings.showCompleteBtn"
                name="showCompleteBtn"
                :options="showCompleteBtnOptions"
                layout-type="vertical"
              />
            </div>
            <div
              v-show="formSettings.showCompleteBtn === '1'"
              class="form-item"
            >
              <RequiredFormLabel
                class="title"
                label="完了ボタンの文字"
                :required="true"
              />
              <CustomInputText
                v-model="formSettings.completeBtnName"
                placeholder="入力例：トップページへ戻る"
                maxlength="20"
                class="input-text"
                :validation="
                  $common.getFormItemsDetail(formItems, 'completeBtnName')
                    .validation
                "
              />
            </div>
            <div
              v-show="formSettings.showCompleteBtn === '1'"
              class="form-item"
            >
              <RequiredFormLabel
                class="title"
                label="完了ボタンのURL"
                :required="true"
              />
              <CustomInputText
                v-model="formSettings.completeBtnUrl"
                maxlength="2000"
                class="input-text"
                :validation="
                  $common.getFormItemsDetail(formItems, 'completeBtnUrl')
                    .validation
                "
              />
            </div>
          </div>
          <div v-show="formSettings.showCompleteScreen === '0'">
            <div class="form-item">
              <RequiredFormLabel
                class="title"
                label="リダイレクト先URL"
                :required="true"
              />
              <CustomInputText
                v-model="formSettings.completeBtnRedirectUrl"
                maxlength="2000"
                class="input-text"
                :validation="
                  $common.getFormItemsDetail(formItems, 'redirectUrl')
                    .validation
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <MoreFormDetail
      class="more-detail"
      type="form"
      :more-detail="moreDetail"
      @change="moreDetail = !moreDetail"
    />
    <div class="buttons">
      <button
        class="btn btn-cancel btn-long"
        :class="{
          'btn-disabled': $common.checkSameObject(
            propFormSettings,
            formSettings
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
        フォーム設定を保存
      </button>
      <button
        class="btn btn-long btn-basic"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateEditFormSettings('next')"
      >
        フォーム設定を保存してメール設定へ進む
      </button>
    </div>
    <LocalOrStorageFileUploadModal
      v-if="showFileUploadModalState"
      ref="fileUploadModal"
      file-type="all"
      class="fileUploadModal"
      :max-file-size="10240"
      @newUploaded="selectNewFileData($event)"
      @existUploaded="selectExistFileData($event)"
      @close="showFileUploadModalState = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditFormSettingsComponent',
  components: {},
  props: {
    propFormSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      formSettings: {},
      moreDetail: false,
      showFileUploadModalState: false,
      uploadType: '',
      showConfirmScreenOptions: [
        {
          value: '1',
          label: '表示する',
        },
        {
          value: '0',
          label: '表示しない',
        },
      ],
      showCompleteScreenOptions: [
        {
          value: '1',
          label: '表示する',
        },
        {
          value: '0',
          label: 'リダイレクト（指定したURLを表示）',
        },
      ],
      completeScreenDownloadFileAttachmentFlagOptions: [
        {
          value: '1',
          label: 'あり',
        },
        {
          value: '0',
          label: 'なし',
        },
      ],
      showCompleteBtnOptions: [
        {
          value: '1',
          label: '表示する',
        },
        {
          value: '0',
          label: '表示しない',
        },
      ],
      formItems: [
        {
          id: 'inputScreenSendBtnName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'sendBtnName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'backBtnName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'completeScreenMessage',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'completeBtnName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'completeBtnUrl',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.domain,
              message: this.$common.getMasterMessage('ErrorMsg_Url02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.protocol,
              message: this.$common.getMasterMessage('ErrorMsg_Url03'),
            },
          ],
        },
        {
          id: 'redirectUrl',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.domain,
              message: this.$common.getMasterMessage('ErrorMsg_Url02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.protocol,
              message: this.$common.getMasterMessage('ErrorMsg_Url03'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('editFormSettings', ['updateBtnDisabledFlg']),
    /**
     * ボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.formSettings) {
          if (['sendBtnName', 'backBtnName'].includes(key)) {
            if (this.formSettings.showConfirmScreen === '0') {
              continue
            }
          }
          if (
            [
              'completeScreenMessage',
              'completeScreenDownloadFileAttachmentFlag',
              'completeBtnName',
              'completeBtnUrl',
            ].includes(key)
          ) {
            if (this.formSettings.showCompleteScreen === '0') {
              continue
            }
          }
          if (key === 'downloadFile') {
            if (
              this.formSettings.showCompleteScreen === '1' &&
              this.formSettings.completeScreenDownloadFileAttachmentFlag === '0'
            ) {
              continue
            }
          }
          if (key === 'completeBtnRedirectUrl') {
            if (this.formSettings.showCompleteScreen === '1') {
              continue
            }
          }
          if (['completeBtnName', 'completeBtnUrl'].includes(key)) {
            if (this.formSettings.showCompleteBtn === '0') {
              continue
            }
          }

          if (!this.$common.checkArrayValue(this.formSettings.selectParts)) {
            result = true
            break
          }

          if (
            !this.formSettings[key] ||
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.formSettings[key]
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
    propFormSettings() {
      this.formSettings = JSON.parse(JSON.stringify(this.propFormSettings))
    },
  },
  created() {
    this.formSettings = JSON.parse(JSON.stringify(this.propFormSettings))
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('form/editFormSettings', [
      'selectBtnInfo',
      'setUpdateBtnDisabledFlg',
    ]),
    updateSelectParts(newSelectParts) {
      this.formSettings.selectParts = newSelectParts
    },
    updateHtml(value) {
      this.formSettings.completeScreenMessage = value
    },
    /**
     * ファイル添付モーダルの表示
     *
     * @param {string} uploadType アップロードタイプ new or update
     */
    showFileUploadModal(uploadType) {
      this.uploadType = uploadType
      this.showFileUploadModalState = true
    },
    /**
     * FileUpLoadModalにて新規ファイルを選択
     *
     * @param {Object} returnFileData ファイルデータ
     */
    selectNewFileData(returnFileData) {
      if (this.uploadType === 'new') {
        this.formSettings.downloadFile.push({
          file: returnFileData.fileData,
          fileTitle: returnFileData.fileName,
          classAttribute: '',
        })
      } else {
        this.formSettings.downloadFile[
          this.formSettings.downloadFile.length - 1
        ] = {
          file: returnFileData.fileData,
          fileTitle: returnFileData.fileName,
          classAttribute: '',
        }
      }
    },
    /**
     * FileUpLoadModalにて既存ファイルを選択
     *
     * @param {Object} returnFileData ファイルデータ
     */
    selectExistFileData(returnFileData) {
      if (this.uploadType === 'new') {
        this.formSettings.downloadFile.push({
          storageObjectId: returnFileData.fileStorageObjectId,
          fileTitle: returnFileData.fileName,
          classAttribute: '',
        })
      } else if (this.uploadType === 'update') {
        this.formSettings.downloadFile[
          this.formSettings.downloadFile.length - 1
        ] = {
          storageObjectId: returnFileData.fileStorageObjectId,
          fileTitle: returnFileData.fileName,
          classAttribute: '',
        }
      }
    },
    /**
     * ダウンロードファイルの入力エリアを1つ増やす
     */
    addInputFileBlock() {
      this.formSettings.downloadFile.push({
        file: '',
        fileTitle: '',
        classAttribute: '',
      })
    },
    /**
     * 選択したダウンロードファイルの入力エリアを削除
     */
    deleteInputFile(index) {
      this.formSettings.downloadFile.splice(index, 1)
    },
    /**
     * 保存してリクエストデータを親に送る
     */
    updateEditFormSettings(afterFunc) {
      const data = {
        requestParam: {
          formSettings: this.getRequestFormSettings(),
        },
        afterFunc,
      }

      this.$emit('update', data)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     */
    getRequestFormSettings() {
      const requestFormSettings = JSON.parse(JSON.stringify(this.formSettings))

      if (requestFormSettings.showConfirmScreen === '0') {
        delete requestFormSettings.sendBtnName
        delete requestFormSettings.backBtnName
      }

      if (requestFormSettings.showCompleteScreen === '0') {
        delete requestFormSettings.completeScreenMessage
        delete requestFormSettings.downloadFile
        delete requestFormSettings.completeScreenDownloadFileAttachmentFlag
        delete requestFormSettings.downloadFile
        delete requestFormSettings.showCompleteBtn
        delete requestFormSettings.completeBtnName
        delete requestFormSettings.completeBtnUrl
      } else if (requestFormSettings.showCompleteScreen === '1') {
        delete requestFormSettings.completeBtnRedirectUrl
        if (
          requestFormSettings.completeScreenDownloadFileAttachmentFlag === '0'
        ) {
          delete requestFormSettings.downloadFile
        }
        if (requestFormSettings.showCompleteBtn === '0') {
          delete requestFormSettings.completeBtnName
          delete requestFormSettings.completeBtnUrl
        }
      }

      return requestFormSettings
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
        this.propFormSettings,
        this.formSettings
      )
    },
    /**
     * 親画面から呼び出される関数 入力内容を元に戻す
     */
    restoreSettings() {
      this.formSettings = JSON.parse(JSON.stringify(this.propFormSettings))
    },
  },
}
</script>

<style lang="scss" scoped>
.form-settings {
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
      .input-text {
        width: 593px;
      }
      .title {
        margin-bottom: 10px;
      }
      .downloadFileList {
        width: 854px;
        margin-top: 20px;
        position: relative;
        .file-upload {
          width: 100%;
          margin-top: 18px;
        }
        .sub-text {
          font-size: 13px;
          margin-bottom: 12px;
        }
        .downloadFile {
          &:not(:last-child) {
            margin-bottom: 30px;
          }
          .title {
            margin-bottom: 10px;
          }
          .fileDetail {
            .form-item {
              margin-bottom: 20px;
            }
          }
        }
      }
      &:not(:last-child) {
        margin-bottom: 48px;
      }
    }
  }
  .more-elements {
    .form-block {
      padding-top: 32px;
      border-top: 1px solid #e5e5e5;
    }
  }
  .wysiwyg-editor {
    width: 854px;
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
.flexAlignEnd {
  align-items: flex-end;
}
</style>
