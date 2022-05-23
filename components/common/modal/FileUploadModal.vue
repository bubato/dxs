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
            <h3 v-if="fileType === 'image'">画像アップロード</h3>
            <h3 v-else>ファイルアップロード</h3>
          </div>
          <div class="modal_contents">
            <p v-if="maxFileSize !== 0" class="context">
              アップロード可能なファイルサイズは{{ getFileSize() }}までです。
            </p>
            <p v-else-if="fileType === 'image'" class="context">
              アップロード可能なファイルサイズは1MBまで。拡張子は.{{
                imageAllowExts.join('、')
              }}が利用できます。
            </p>
            <p v-else class="context">
              アップロード可能なファイルサイズは5MBまでです。
            </p>
            <FileUpload
              :file-type="fileType"
              :file-data="fileData"
              :max-size="maxSize"
              :is-sp-file-upload="isSpFileUpload"
              @uploaded="uploaded($event)"
              @deleted="deletePostImage()"
            />
            <button
              class="btn btn-cancel btn-long"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FileUploadModal',
  props: {
    maxFileSize: {
      type: Number,
      default: 0,
      required: false,
    },
    fileType: {
      type: String,
      default: '',
      required: false,
    },
    fileData: {
      type: String,
      default: '',
      required: false,
    },
    isSpFileUpload: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      maxSize: null,
    }
  },
  computed: {},
  created() {
    if (this.maxFileSize !== 0) {
      this.maxSize = this.maxFileSize
    } else if (this.fileType === 'image') {
      this.maxSize = 1024
    } else {
      this.maxSize = 5120
    }
  },
  methods: {
    getFileSize() {
      const mbConversion = this.maxFileSize / 1024
      const unitVal = mbConversion < 1 ? 'KB' : 'MB'
      const sizeVal = mbConversion < 1 ? this.maxSize : mbConversion

      return sizeVal + unitVal
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
    uploaded(val) {
      this.$emit('uploaded', val)
    },
    deletePostImage() {
      this.$emit('uploaded', '')
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
      text-align: center;
    }
  }
}

.btn-cancel {
  margin: 30px auto 0;
}
</style>
