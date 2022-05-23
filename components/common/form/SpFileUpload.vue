<template>
  <div class="sp-file-upload">
    <input
      ref="inputFile"
      type="file"
      class="inputFile"
      multiple=""
      @change="selectedFile()"
    />
  </div>
</template>

<script>
export default {
  name: 'SpFileUpload',
  props: {
    fileType: { type: String, required: false, default: 'image' },
    maxSize: { type: Number, required: false, default: null },
    validation: { type: Array, required: false, default: () => [] },
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
      csvAllowExts: ['csv'],
      errorList: [],
    }
  },
  watch: {},
  mounted() {},
  methods: {
    openFileDialog() {
      this.$refs.inputFile.value = null
      this.$refs.inputFile.click()
    },
    selectedFile() {
      const file = this.$refs.inputFile.files[0]

      this.readFile(file)
    },
    readFile(file) {
      if (this.fileType === 'all') {
        this.readImgFile(file)
      } else if (this.fileType === 'image') {
        if (this.checkExt(file.name)) {
          this.readImgFile(file)
        }
      }
    },
    /**
     * 拡張子チェック
     * @param {string} ファイル名
     */
    checkExt(fileName) {
      const ext = this.getExt(fileName)
      let result = false
      let allowExts = ''

      switch (this.fileType) {
        case 'image':
          allowExts = this.imageAllowExts
          break
        default:
          break
      }

      if (allowExts.includes(ext)) {
        result = true
      } else {
        result = false
      }

      return result
    },
    /**
     * 拡張子を取得
     * @param {string} fileName ファイル名
     */
    getExt(fileName) {
      const fileNameSplit = fileName.toLowerCase().split('.')
      const ext = fileNameSplit[fileNameSplit.length - 1]

      return ext
    },
    readImgFile(file) {
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
        returnFileData.imageName = this.selectFileName
        returnFileData.fileData = reader.result

        if (this.fileType === 'image') {
          returnFileData.fileImgPath = reader.result
        }

        this.$emit('uploaded', returnFileData)
      }

      reader.readAsDataURL(file)
    },
    deleteSelectFile() {
      this.selectFileName = ''
      this.errorList = this.getValidationList(this.selectFileName)
      this.$emit('deleted')
    },
    /**
     * バリデーションチェック
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
</style>
