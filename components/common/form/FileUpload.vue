<template>
  <div
    class="file-upload"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div
      class="drop_area"
      :class="{ enter: isEnter }"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @dragover.prevent
      @drop.prevent="dropFile($event)"
      @change="selectedFile()"
    >
      <div
        v-if="fileData.length === 0 && initFileName.length === 0"
        class="select_file"
      >
        <p>ファイルをドラッグ＆ドロップしてください</p>
        <p>
          または<button class="btn btn-secondary" @click="openFileDialog()">
            ファイルを選択
          </button>
        </p>
      </div>
      <div
        v-if="fileData.length > 0 || initFileName.length > 0"
        class="view_file"
      >
        <img
          v-if="fileType === 'image'"
          class="file_image"
          :src="getImagePath()"
        />
        <p>
          <CancelSVG
            class="icon-delete icon-cancel"
            @click="deleteSelectFile()"
            @mouseover="$common.setAreaLabel($event, 'top', '削除')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <span>{{ selectFileName }}</span>
        </p>
      </div>
      <input ref="inputFile" type="file" class="inputFile" multiple="" />
    </div>
  </div>
</template>

<script>
import Encoding from 'encoding-japanese'

export default {
  name: 'FileUpload',
  props: {
    fileType: { type: String, required: false, default: 'image' },
    fileData: { type: String, required: false, default: '' },
    maxSize: { type: Number, required: false, default: null },
    validation: { type: Array, required: false, default: () => [] },
    initFileName: { type: String, required: false, default: '' },
    readType: { type: String, required: false, default: 'data' },
    imageAllowExts: {
      type: Array,
      required: false,
      default: () => ['gif', 'png', 'jpg', 'jpeg', 'svg'],
    },
  },
  data() {
    return {
      isEnter: false,
      selectFileName: '',
      allowExts: [],
      csvAllowExts: ['csv'],
      htmlAllowExts: ['html'],
      forbiddenExts: [
        'bat',
        'cmd',
        'com',
        'exe',
        'js',
        'jse',
        'pif',
        'scr',
        'vbe',
        'vbs',
        'wsf',
        'wsh',
      ],
      errorList: [],
    }
  },
  computed: {
    /**
     * 画像パスの取得
     *
     * @return {string} 画像パス
     */
    getImagePath() {
      return () => {
        const fileData = this.fileData
        let filePath = ''

        if (this.$common.getImagePathType(fileData) === 'url') {
          filePath = fileData + '?' + this.$common.getTimeStamp()
        } else {
          filePath = fileData
        }

        return filePath
      }
    },
  },
  watch: {
    initFileName() {
      this.updateInitFileName() // 初期値ファイル名の更新
    },
  },
  created() {
    this.updateInitFileName() // 初期値ファイル名の更新
  },
  mounted() {},
  methods: {
    /**
     * ドラッグエンター処理
     */
    dragEnter() {
      this.isEnter = true
    },
    /**
     * ドラッグリーブ処理
     */
    dragLeave() {
      this.isEnter = false
    },
    /**
     * ファイルドロップ処理
     *
     * @param {Object} e イベントオブジェクト
     */
    dropFile(e) {
      const files = [...e.dataTransfer.files]
      const file = files[0]

      this.readFileType(file)
      this.isEnter = false
    },
    /**
     * ファイル読み込み処理の分岐
     *
     * @param {Object} file ファイル情報
     */
    readFileType(file) {
      this.errorList = []

      if (this.checkExt(file.name)) {
        this.exeReadFile(file)
      }
    },
    /**
     * ファイルダイアログの表示
     */
    openFileDialog() {
      this.$refs.inputFile.value = null
      this.$refs.inputFile.click()
    },
    /**
     * ファイルの選択
     */
    selectedFile() {
      const file = this.$refs.inputFile.files[0]

      this.readFileType(file)
    },
    /**
     * 拡張子チェック
     *
     * @param {string} fileName ファイル名
     * @return {boolean} true:使用できる拡張子 false:使用できない拡張子
     */
    checkExt(fileName) {
      const ext = this.getExt(fileName)
      let result = false

      if (this.fileType === 'all') {
        if (this.forbiddenExts.includes(ext)) {
          this.errorList.push(
            this.$common.getMasterMessage('ErrorMsg_Upload03')
          )
          result = false
        } else {
          result = true
        }
      } else {
        switch (this.fileType) {
          case 'image':
            this.allowExts = this.imageAllowExts
            break
          case 'html':
            this.allowExts = this.htmlAllowExts
            break
          case 'csv':
            this.allowExts = this.csvAllowExts
            break
          default:
            break
        }

        if (this.allowExts.includes(ext)) {
          result = true
        } else {
          this.errorList.push(
            this.$common.getMasterMessage('ErrorMsg_Upload02', {
              allowExts: this.allowExts.join(','),
            })
          )
          result = false
        }
      }

      return result
    },
    /**
     * 拡張子を取得
     *
     * @param {string} fileName ファイル名
     * @return {string} 拡張子
     */
    getExt(fileName) {
      const fileNameSplit = fileName.toLowerCase().split('.')
      const ext = fileNameSplit[fileNameSplit.length - 1]

      return ext
    },
    /**
     * ファイル読み込み処理の実行
     *
     * @param {Object} file ファイル情報
     */
    exeReadFile(file) {
      const reader = new FileReader()

      if (this.fileType === 'image' && !file.type.match('image.*')) {
        this.deleteSelectFile()
        return
      }

      reader.onload = () => {
        this.selectFileName = file.name

        if (this.maxSize && file.size > this.maxSize * 1000) {
          const mbConversion = this.maxSize / 1024
          const unitVal = mbConversion < 1 ? 'KB' : 'MB'
          const sizeVal = mbConversion < 1 ? this.maxSize : mbConversion
          const validationMessage = this.$common.getMasterMessage(
            'ErrorMsg_Upload01',
            { size: sizeVal, unit: unitVal }
          )

          this.errorList.push(validationMessage)
          return
        }

        const returnFileData = {}

        returnFileData.file = file
        returnFileData.fileName = this.selectFileName

        if (this.fileType === 'image') {
          returnFileData.fileImgPath = reader.result
        }

        if (this.readType === 'text') {
          const codes = new Uint8Array(reader.result)
          const encoding = Encoding.detect(codes)
          const unicodeString = Encoding.convert(codes, {
            to: 'unicode',
            from: encoding,
            type: 'string',
          })

          returnFileData.fileData = unicodeString
        } else {
          returnFileData.fileData = reader.result
        }

        this.$emit('uploaded', returnFileData)
      }

      if (this.readType === 'text') {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsDataURL(file)
      }
    },
    /**
     * ファイルの削除
     */
    deleteSelectFile() {
      this.selectFileName = ''
      this.errorList = this.getValidationList(this.selectFileName)
      this.$emit('deleted')
    },
    /**
     * 初期値ファイル名の更新
     */
    updateInitFileName() {
      this.selectFileName = this.initFileName
    },
    /**
     * バリデーションチェック
     *
     * @param {string} 設定値
     * @return {Object[]} エラーリスト
     */
    getValidationList(inputVal) {
      let validationList = []

      if (this.validation) {
        validationList = this.$common.getValidationMsg(
          this.validation,
          inputVal
        )
      }

      return validationList
    },
  },
}
</script>

<style lang="scss">
.inputFile {
  display: none;
}
.drop_area {
  width: 100%;
  height: 156px;
  background: #f7f8f9;
  border: 1px dashed#c6c6c6;
  border-radius: 5px;
  position: relative;
  .select_file {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    border-radius: 5px;
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 3;
      button {
        width: 138px;
        height: 36px;
        border-radius: 4px;
        font-size: 13px;
        margin-left: 12px;
      }
    }
  }

  .view_file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    margin: auto;
    img {
      max-height: 100px;
    }
    .icon-delete {
      display: inline-block;
      cursor: pointer;
    }
    p {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .file_image {
        max-width: 160px;
        max-height: 80px;
      }
      span {
        margin-left: 8px;
      }
    }
  }
}
.enter {
  opacity: 0.7;
}
</style>
