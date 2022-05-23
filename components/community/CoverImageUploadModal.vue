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
            <h3>カバー画像アップロード</h3>
          </div>
          <div class="modal_contents">
            <p class="context">
              アップロード可能なファイルサイズは1MBまで。拡張子は.{{
                imageAllowExts.join('、')
              }}が利用できます。
            </p>
            <FileUpload
              :file-data="selectImage"
              :max-size="maxSize"
              :image-allow-exts="imageAllowExts"
              @uploaded="uploadImage($event)"
              @deleted="deleteImage()"
            />
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-long"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button
              class="btn btn-long btn-basic"
              :class="{ 'btn-disabled': !selectImage }"
              @click="updateProfileCoverImage()"
            >
              カバー画像を変更
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CoverImageUploadModal',
  components: {},
  props: {
    imgPath: {
      type: String,
      default: '',
      required: false,
    },
    coverType: {
      type: Number,
      default: 0, // 0:ユーザープロフィール 1:企業プロフィール 2:グループプロフィール
      required: false,
    },
    propRecordVersion: {
      type: Number,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      selectImage: null,
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      imageList: [
        {
          id: 1,
          path: 'images/community/bgImage/bg1.png',
        },
        {
          id: 2,
          path: 'images/community/bgImage/bg2.png',
        },
        {
          id: 3,
          path: 'images/community/bgImage/bg3.png',
        },
        {
          id: 4,
          path: 'images/community/bgImage/bg4.png',
        },
      ],
      maxSize: 1024,
    }
  },
  computed: {},
  created() {
    this.selectImage = this.imgPath
  },
  methods: {
    /**
     * カバー画像の変更
     */
    updateProfileCoverImage() {
      switch (this.coverType) {
        case 0:
          this.updateUserProfileCoverImage() // ユーザープロフィール カバー画像の変更
          break
        case 1:
          this.updateCorporateProfileCoverImage() // 企業プロフィール カバー画像の変更
          break
        case 2:
          this.updateGroupProfileCoverImage() // グループプロフィール カバー画像の変更
          break
        default:
          break
      }
    },
    /**
     * ユーザープロフィール カバー画像の変更
     */
    updateUserProfileCoverImage() {
      const paramData = {
        coverImage: this.selectImage,
        recordVersion: this.propRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateProfileCoverImage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
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
     * 企業プロフィール カバー画像の変更
     */
    updateCorporateProfileCoverImage() {
      const paramData = {
        companyCoverImage: this.selectImage,
        recordVersion: this.propRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCorporateProfileCoverImage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
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
     * グループプロフィール カバー画像の変更
     */
    updateGroupProfileCoverImage() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
        postGroupCoverImage: this.selectImage,
        recordVersion: this.propRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateGroupProfileCoverImage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
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
     * 画像選択処理
     *
     * @param {object} data ファイルデータ
     */
    uploadImage(data) {
      this.selectImage = data.fileImgPath
    },
    /**
     * 画像選択解除処理
     */
    deleteImage() {
      this.selectImage = ''
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
@import '~assets/styles/scss/sp/mediaQuery.scss';
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  @include spContentWidth();
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
  }
  .modal_contents {
    margin-top: 8px;
    .context {
      margin-bottom: 24px;
      text-align: center;
    }
  }
  .buttons {
    margin-top: 32px;
    @include mq(sp) {
      flex-direction: column;
    }
    button {
      &:not(:last-child) {
        @include mq(sp) {
          margin-right: 0px;
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
