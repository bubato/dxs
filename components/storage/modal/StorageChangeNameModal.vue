<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4>名前の変更</h4>
          </div>
          <div class="modal_contents">
            <p></p>
            <p class="context">変更後の名前を入力して保存してください。</p>
            <p class="textFileName">元のファイル名：{{ defaultNameText }}</p>
            <div class="input-wrap">
              <div class="objectInput">
                <CustomInputText
                  v-model="formTitle"
                  maxlength="50"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'formTitle')
                      .validation
                  "
                />
                <div v-if="setExtension() !== ''" class="objectText">
                  <p>{{ extensionText }}</p>
                </div>
              </div>
            </div>
            <div class="buttons">
              <button
                class="btn btn-long btn-cancel"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-long btn-basic"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="saveChangeName()"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StorageChangeNameModal',
  data() {
    return {
      formTitle: '',
      formItems: [
        {
          id: 'formTitle',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.storageFolderName,
              message: this.$common.getMasterMessage('ErrorMsg_Format05'),
            },
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
      defaultNameText: '',
      extensionText: '',
    }
  },
  computed: {
    ...mapState('storage/storageList', ['selectStorageInfo']),
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'formTitle',
            this.formTitle
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.defaultNameText = this.selectStorageInfo.objectName
    this.formTitle = this.defaultNameText.split('.')[0]
    this.extensionText = this.setExtension()
  },
  methods: {
    ...mapMutations('storage/storageList', ['onMoveGetList']),
    /**
     * 名前変更api実行
     */
    saveChangeName() {
      if (this.selectStorageInfo.objectType === 1) {
        this.updateStorageFolders()
      } else {
        this.updateStorageFiles()
      }
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
    /**
     * 選択項目拡張子判定
     */
    setExtension() {
      if (this.defaultNameText.includes('.')) {
        this.extensionText = '.' + this.defaultNameText.split('.')[1]
      }
    },
    /**
     * 入力名の判定
     *
     * @param {String} formTitle フォーム入力テキスト
     * @return {String} 名前の変更しない場合はNullをセット
     */
    setName(formTitle) {
      let backText = formTitle
      if (formTitle === this.defaultNameText) {
        backText = null
      }

      return backText
    },
    /**
     * フォルダ更新API
     */
    updateStorageFolders() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
        name: this.setName(this.formTitle),
        shareUserIds: null,
        recordVersion: this.selectStorageInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateStorageFolders(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
            this.onMoveGetList()
            this.$emit('close')
          } else {
            this.$emit('close')
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ファイル更新API
     */
    updateStorageFiles() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
        name: this.formTitle + this.extensionText,
        recordVersion: this.selectStorageInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateStorageFiles(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
            this.onMoveGetList()
            this.$emit('close')
          } else {
            this.$emit('close')
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 688px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 8px;
    .context {
      text-align: center;
    }
    .textFileName {
      margin-top: 24px;
      font-weight: bold;
    }
    .input-wrap {
      margin-top: 12px;
      display: flex;
      .objectInput {
        display: flex;
        .custom-input-text {
          width: 559px;
        }
      }
      .objectText {
        position: relative;
        p {
          font-size: 15px;
          position: absolute;
          width: 200px;
          left: 13px;
          bottom: 0;
        }
        .formAlert {
          padding-top: 70px;
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
