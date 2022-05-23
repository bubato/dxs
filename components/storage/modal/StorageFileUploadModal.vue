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
            class="btn-close"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h3>ファイルアップロード</h3>
          </div>
          <div class="modal_contents">
            <p class="context">
              アップロード可能なファイルサイズは10MBまでです。
            </p>
            <div class="custom-input-text validation-error">
              <ValidationMessage
                v-if="errorList.length > 0"
                :error-list="errorList"
              />
              <FileUpload
                ref="fileUpload"
                file-type="all"
                :file-data="fileData"
                :max-size="10240"
                @uploaded="getUploadData($event)"
              />
            </div>
            <button
              class="btn btn-cancel btn-long"
              @click="closeModal($event, 'close')"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StorageFileUploadModal',
  data() {
    return {
      fileData: '',
      errorList: [],
      uploadData: {
        name: '',
        fileSize: null,
        fileType: '',
        file: '',
        fileUploadURL: '',
        filePath: '',
      },
    }
  },
  computed: {
    ...mapState('storage/storageList', ['pathStorageObjectId', 'extNgList']),
  },
  methods: {
    ...mapMutations('storage/storageList', [
      'onUploadDataFlg',
      'showStorageOverwriteModal',
      'setOverwriteModalInfo',
    ]),
    /**
     * 拡張子チェック
     *
     * @return {boolean} true:使用できる拡張子 false:使用できない拡張子
     */
    extCheck() {
      const extText =
        this.uploadData.name.split('.').length > 1
          ? this.uploadData.name.split('.')[1]
          : ''

      if (extText.length > 0 && this.extNgList.includes(extText)) {
        return false
      } else {
        return true
      }
    },
    /**
     * uploadData更新
     *
     * @param {object} fileObj ファイルオブジェクト
     */
    getUploadData(fileObj) {
      this.uploadData.name = fileObj.fileName
      this.uploadData.fileType = fileObj.file.type
      this.uploadData.fileSize = fileObj.file.size
      this.uploadData.file = fileObj.file
      this.getStorageUploadUrl()
    },
    /**
     * アップロードURL取得API
     */
    getStorageUploadUrl() {
      this.errorList = []

      if (!this.extCheck()) {
        this.errorList.push(this.$common.getMasterMessage('ErrorMsg_Upload03'))
        return false
      }

      const paramData = {
        name: this.uploadData.name,
        fileSize: this.uploadData.fileSize,
        type: this.uploadData.fileType,
      }

      if (this.pathStorageObjectId) {
        paramData.parentId = this.pathStorageObjectId
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageUploadUrl(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.uploadData.fileUploadURL = resData.data.uploadURL
            this.uploadData.filePath = resData.data.filePath

            if (resData.data.storageObjectId !== null) {
              const setData = {
                id: resData.data.storageObjectId,
                name: this.uploadData.name,
                filePath: this.uploadData.filePath,
                fileSize: this.uploadData.fileSize,
                recordVersion: resData.data.recordVersion,
              }
              this.setOverwriteModalInfo(setData)
              this.showStorageOverwriteModal()
              this.$emit('close')
            } else {
              this.putStorageFileForUploadUrl()
            }
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
     * 取得したURLにてuploadURLにてファイルをアップロード
     */
    putStorageFileForUploadUrl() {
      const paramData = {
        url: this.uploadData.fileUploadURL,
        fileType: this.uploadData.fileType,
        fileData: this.uploadData.file,
      }

      this.$common.addCallApiNum()
      this.$api
        .putStorageFileForUploadUrl(paramData)
        .then(() => {
          this.registStorageFiles()
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$emit('close')
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ファイル登録API
     */
    registStorageFiles() {
      const paramData = {
        parentId: this.pathStorageObjectId,
        name: this.uploadData.name,
        filePath: this.uploadData.filePath,
        fileSize: this.uploadData.fileSize,
        renameFlag: 1,
      }

      this.$common.addCallApiNum()
      this.$api
        .registStorageFiles(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('close')
            this.onUploadDataFlg()
            this.$emit('updateSettingShowNum')
            this.$common.showCompletePopAlert('ActionMsg_Gen13', 'ファイル')
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
  },
}
</script>

<style scoped lang="scss">
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
  }
  .modal_contents {
    margin-top: 20px;

    .context {
      margin-bottom: 12px;
    }
  }
}

.btn-cancel {
  margin: 30px auto 0;
}
</style>
