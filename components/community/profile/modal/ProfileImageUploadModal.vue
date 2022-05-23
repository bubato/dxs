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
            <h3>プロフィール画像</h3>
            <p class="text-caption">
              アップロード可能なファイルサイズは1MBまで。拡張子は.{{
                imageAllowExts.join('、')
              }}が利用できます。
            </p>
          </div>
          <div
            class="modal_contents"
            :class="{ 'validation-error': errorList.length > 0 }"
          >
            <ValidationMessage
              v-if="errorList.length > 0"
              :error-list="errorList"
            />
            <div class="modal_contents-box">
              <div class="croppa">
                <cropper
                  ref="croppa"
                  v-model="profileImage"
                  :placeholder="``"
                  :placeholder-font-size="15"
                  :show-remove-button="false"
                  :file-size-limit="1048576"
                  :width="160"
                  :height="160"
                  :spfileup="spfileup"
                  accept=".gif,.jpg,.jpeg,.png,.svg"
                  prevent-white-space
                  :disable-drag-and-drop="false"
                  :disable-click-to-choose="false"
                  :is-upload="isUpload"
                  :initial-image="initialImage"
                  @image-remove="onImageRemove"
                  @file-type-mismatch="onFileTypeMismatch"
                  @file-size-exceed="onFileSizeExceed"
                  @file-choose="onLoadingEnd"
                  @init="onInit"
                  @new-image-drawn="onDrawnEnd"
                />
              </div>
              <div
                v-if="fileName || initialImage"
                class="flex flex-center upload-after-area"
              >
                <CancelSVG
                  class="icon-cancel icon-cancel-uploadCancel"
                  @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                  @click="removeImage"
                />
                <span>{{ fileName }}</span>
              </div>

              <div class="flex flex-center">
                <button
                  v-if="!isUpload"
                  class="btn btn-cancel btn-long"
                  @click="cancelUploadImage"
                >
                  キャンセル
                </button>
                <button
                  v-if="isUpload"
                  class="btn btn-basic btn-long"
                  @click="changeProfileImage"
                >
                  プロフィール画像を変更
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import cropper from '~/components/common/form/ProfileImageUploader/cropper.vue'
export default {
  name: 'ProfileImageUploadModal',
  components: {
    cropper,
  },
  props: {
    spfileup: {
      type: Boolean,
      default: false,
      required: false,
    },
    initImage: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      profileImage: {},
      initialImage: '',
      settings: {},
      isUpload: false,
      isUploadError: false,
      imgUrl: '',
      fileName: '',
      fileSize: 0,
      isDrawEnd: false, // canvas描画処理終了を取得
      errorList: [],
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
    }
  },
  computed: {
    bytesToSize() {
      return (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 Byte'
        const index = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        return `${Math.round(bytes / Math.pow(1024, index), 2)}${sizes[index]}`
      }
    },
  },
  watch: {
    isUpload() {
      if (this.spfileup) {
        setTimeout(() => {
          this.watchCanvasImageLoad()
        }, 20)
      }
    },
  },
  created() {
    if (this.initImage.length > 0) {
      this.initialImage = this.initImage
      this.isUpload = true
    }
  },
  methods: {
    /**
     * canvasのイメージ描画終了処理をwatch
     */
    watchCanvasImageLoad() {
      if (this.isDrawEnd) {
        this.changeProfileImage()
        this.isDrawEnd = false
      } else {
        setTimeout(() => {
          this.watchCanvasImageLoad()
        }, 20)
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
          this.removeImage()
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
        this.removeImage()
      }
    },
    onInit() {
      this.profileImage.addClipPlugin(function (ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    },
    onImageRemove() {
      this.isUpload = false
    },
    onFileTypeMismatch() {
      this.errorList = []
      this.errorList.push(
        this.$common.getMasterMessage('ErrorMsg_Upload02', {
          allowExts: this.imageAllowExts.join(','),
        })
      )
    },
    onFileSizeExceed() {
      this.errorList = []
      this.errorList.push(
        this.$common.getMasterMessage('ErrorMsg_Upload01', {
          size: 1,
          unit: 'MB',
        })
      )
    },
    changeProfileImage() {
      this.imgUrl = this.profileImage.generateDataUrl()

      this.$emit('reflect', this.imgUrl)
      this.$emit('close')
    },
    onLoadingEnd(file) {
      this.errorList = []
      this.fileSize = file.size
      this.fileName = file.name
      this.isUpload = true
    },
    onDrawnEnd() {
      this.isDrawEnd = true
    },
    cancelUploadImage() {
      this.$emit('close')
    },
    removeImage() {
      this.errorList = []
      this.fileSize = 0
      this.fileName = ''
      this.initialImage = ''
      this.isUpload = false
      this.profileImage.remove()
    },
    fileUploadSizeError(maxWidth, maxHeight) {
      const imageWidth = this.profileImage.naturalWidth
      const imageHeight = this.profileImage.naturalHeight

      if (imageWidth >= maxWidth && imageHeight >= maxHeight) {
        this.profileImage.remove()
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/scss/sp/mediaQuery.scss';
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
    .input_form {
      > div {
        p {
          padding: 5px 0;
        }
      }
      .input_load_sentence {
        margin-top: 10px;
      }
      .set_show_buttons {
        margin-top: 10px;
        .show_button_list {
          max-height: 120px;
          overflow: auto;
          .select_show_button {
            position: relative;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
            .btn-delete_select {
              position: absolute;
              top: 0;
              bottom: 0;
              right: 20px;
              margin: auto;
              cursor: pointer;
            }
          }
        }
        .add_item_component {
          margin-top: 10px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
    }
  }
}

.upload-after-area {
  margin: 19px 0 32px 0;
}

.text {
  &-caption {
    margin: 10px 0;
  }
}

.icon {
  &-cancel-uploadCancel {
    width: 16px;
    height: 16px;
    margin: 0 10px 0 0;
    cursor: pointer;
  }
}
// MQ
@include mq(sp) {
  .modal-container {
    width: calc(100% - 32px);
  }
  .modal-mask {
    visibility: hidden;
    pointer-events: none;
  }
}
// MQ
</style>
