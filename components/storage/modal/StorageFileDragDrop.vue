<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
        @dragenter="dragEnter('wrapper')"
        @dragleave="dragLeave('wrapper')"
        @dragover.prevent
        @drop.self="dropWrap"
      >
        <div class="modal-container">
          <div
            class="modal_contents"
            @dragenter="dragEnter('dropArea')"
            @dragleave="dragLeave('dropArea')"
          >
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
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StorageFileDragDrop',
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
      flagMWrapperEnter: 0,
      flagDropAreaEnter: 0,
    }
  },
  computed: {
    ...mapState('storage/storageList', ['pathStorageObjectId', 'extNgList']),
  },
  methods: {
    ...mapMutations('storage/storageList', [
      'hideStorageFileDragDrop',
      'onMoveGetList',
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
     * マウスイベント初期化
     */
    setDefaultMouseEvent() {
      this.flagDropAreaEnter = 0
      this.flagMWrapperEnter = 0
    },
    /**
     * アップロードURL取得API
     */
    getStorageUploadUrl() {
      this.setDefaultMouseEvent()
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
            this.onMoveGetList()
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
     * ドラッグ状態でマウスオーバーした場合
     *
     * @param {string} type 動作箇所判定用テキスト
     */
    dragEnter(type) {
      if (type === 'dropArea') {
        this.flagDropAreaEnter++
      }

      if (type === 'wrapper') {
        this.flagMWrapperEnter++
      }
    },
    /**
     * ドラッグ状態でマウスアウトした場合
     *
     * @param {string} type 動作箇所判定用テキスト
     */
    dragLeave(type) {
      if (type === 'dropArea') {
        this.flagDropAreaEnter--
      }

      if (type === 'wrapper') {
        this.flagMWrapperEnter--
      }

      if (!this.flagDropAreaEnter && !this.flagMWrapperEnter) {
        this.hideStorageFileDragDrop()
      }
    },
    /**
     * モーダル外へのドロップ処理
     *
     * @param {object} e イベント名
     */
    dropWrap(e) {
      e.preventDefault()
      this.setDefaultMouseEvent()
      this.hideStorageFileDragDrop()
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
  width: 512px;
  background-color: #ffffff;
  border-radius: 6px;
  .modal_contents {
    ::v-deep .validation-message {
      margin: 10px;
    }
    ::v-deep .file-upload {
      .validation-message {
        margin: 10px;
      }
      .drop_area {
        height: 220px;
        border: none;
        &::before {
          content: url(~@/assets/images/storage/upload_file.png);
          display: inline-block;
          position: absolute;
          margin-left: 44.5%;
          margin-top: 40px;
        }
      }
      .select_file {
        &::before {
          content: 'ファイルをドラッグアンドドロップしてください';
          display: block;
          margin-top: 34px;
          position: absolute;
          color: #8d8d8d;
          font-size: 20px;
          font-weight: 500;
        }
        &::after {
          content: 'アップロード可能なファイルサイズは10MBまでです。';
          display: block;
          margin-top: 100px;
          position: absolute;
          color: #8d8d8d;
        }
        p {
          display: none;
        }
      }
    }
  }
}
</style>
