<template>
  <div class="select-image-file">
    <div v-if="imagePath" class="current-image">
      <div class="image">
        <img :src="imagePath" alt="選択画像" />
      </div>
      <div class="delete-image" @click="deleteSelectImage()">
        <DeleteForeverSVG class="icon-delete" />
        <p>選択画像を解除</p>
      </div>
    </div>
    <div v-else class="select-image">
      <div class="select-image-tab">
        <ul>
          <li
            :class="{ 'is-selected': selectImageTab === 1 }"
            @click="changeSelectImageTab(1)"
          >
            画像をアップロード
          </li>
          <li
            :class="{ 'is-selected': selectImageTab === 2 }"
            @click="changeSelectImageTab(2)"
          >
            画像を選択
          </li>
        </ul>
      </div>
      <div class="image-upload">
        <div v-if="selectImageTab === 1" class="file-upload">
          <FileUpload
            :max-size="1024"
            @uploaded="checkSameCmsEditorImageUpload($event)"
            @deleted="deleted()"
          />
          <div v-if="showSameFileAlertFlg" class="alert-message">
            <p>
              同じ名前の画像があります。<br />ファイル名を変更して再度アップロードしてください。
            </p>
            <div class="buttons">
              <button
                class="btn btn-basic btn-long"
                @click="cancelSameUpload()"
              >
                OK
              </button>
            </div>
          </div>
        </div>
        <div v-if="selectImageTab === 2" class="select-upload-file">
          <div class="search-image">
            <CustomInputText
              v-model="inputKeyword"
              class="input-search-text"
              view-type="search"
              @submit="submitSearchText($event)"
            />
            <PageNav
              :current-page="offset"
              :setting-show-num="limit"
              :max-data-num="totalDataCount"
              @showPrevPage="showPrevPage()"
              @showNextPage="showNextPage()"
            />
          </div>
          <p v-if="imageList.length === 0" class="no-data">
            アップロード画像がありません。
          </p>
          <div v-else class="select-regist-image">
            <ul class="hidden_scrollbar">
              <li v-for="(image, index) in imageList" :key="index">
                <div class="image" @click="selectUploadImage(image)">
                  <img :src="image.thumbUrl" />
                </div>
                <div class="image-detail">
                  <DeleteForeverSVG
                    class="icon-delete"
                    @click="showDeleteAlertMoldal(image)"
                  />
                  <p class="file-name">{{ image.fileName }}</p>
                </div>
              </li>
            </ul>
            <div v-if="showDeleteAlertFlg" class="alert-message">
              <h5><AttentionSVG class="icon-attention" />画像ファイルの削除</h5>
              <p>
                選択した画像を削除しますか?<br />
                一度削除した画像は元に戻せません。<br />
                <br />
                他のパーツで同じ画像を使用している場合<br />
                その画像も削除されるのでご注意ください。
              </p>
              <div class="buttons">
                <button
                  class="btn btn-cancel btn-long"
                  @click="cancelDeleteImage()"
                >
                  キャンセル
                </button>
                <button
                  class="btn btn-basic btn-long"
                  @click="deleteCmsEditorImage()"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SelectImageFile',
  props: {
    imagePath: { type: String, required: true, default: '' },
    imageName: { type: String, required: true, default: '' },
  },
  data() {
    return {
      selectImageTab: 1,
      offset: 1,
      limit: 20,
      totalDataCount: 0,
      inputKeyword: '',
      imageList: [],
      showSameFileAlertFlg: false,
      uploadFileData: {},
      showDeleteAlertFlg: false,
      selectImage: {},
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['viewComponentList']),
  },
  methods: {
    ...mapMutations('cms/editorStore', ['setViewComponentList']),
    /**
     * CMS_画像重複チェックAPIの呼び出し
     *
     * @param {object} data ファイルコンポーネントから取得したデータ
     */
    checkSameCmsEditorImageUpload(data) {
      this.uploadFileData = data.file

      const paramData = {
        fileName: this.uploadFileData.name,
      }

      this.$common.addCallApiNum()
      this.$api
        .checkSameCmsEditorImageUpload(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (resData.data.isDuplicated === 1) {
              this.showSameFileAlertFlg = true
            } else {
              this.uploadCmsEditorImage(false)
            }
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
     * 画像登録処理
     *
     * @param {boolean} sameImageUploadFlg true:同じ画像名の更新 false:異なる画像名の更新
     */
    uploadCmsEditorImage(imageParamUpdateFlg) {
      const paramData = new FormData()

      paramData.append('imageFile', this.uploadFileData)

      this.showSameFileAlertFlg = false
      this.$common.addCallApiNum()
      this.$api
        .uploadCmsEditorImage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (imageParamUpdateFlg) {
              this.setExistImageParam(resData.data.imageData)
            }

            this.$emit('uploaded', this.getResImageData(resData.data.imageData))
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
     * 既存設定画像のパスにタイムスタンプのパラメータを設定
     */
    setExistImageParam(imageData) {
      const newComponentList = JSON.parse(
        JSON.stringify(this.viewComponentList)
      )
      const imageUrl = imageData.imageUrl

      for (let i = 0; i < newComponentList.length; i++) {
        if (newComponentList[i].componentKind === 'layoutComponent') {
          for (let j = 0; j < newComponentList[i].componentList.length; j++) {
            for (
              let k = 0;
              k < newComponentList[i].componentList[j].length;
              k++
            ) {
              if (
                newComponentList[i].componentList[j][k].id === 'image' &&
                newComponentList[i].componentList[j][k].image.split('?')[0] ===
                  imageUrl
              ) {
                newComponentList[i].componentList[j][k].image +=
                  '?' + this.$common.getTimeStamp()
              }
            }
          }
        }

        if (
          newComponentList[i].id === 'image' &&
          newComponentList[i].image.split('?')[0] === imageUrl
        ) {
          newComponentList[i].image += '?' + this.$common.getTimeStamp()
        }
      }

      this.setViewComponentList(newComponentList)
    },
    /**
     * 選択画像削除処理
     */
    deleteSelectImage() {
      this.$emit('uploaded', this.getResImageData())
    },
    /**
     * 画像重複アラート キャンセルボタン押下処理
     */
    cancelSameUpload() {
      this.showSameFileAlertFlg = false
      this.uploadFileData = {}
    },
    /**
     * 画像選択方式タブの選択
     *
     * @param {number} val タブ値
     */
    changeSelectImageTab(val) {
      this.selectImageTab = val

      this.showSameFileAlertFlg = false
      this.showDeleteAlertFlg = false

      if (val === 2) {
        this.inputKeyword = ''
        this.offset = 1
        this.getCmsEditorUploadImageList()
      }
    },
    /**
     * 親コンポーネントに画像情報を取得
     *
     * @param {object} imageData 画像データ
     * @return {object} 画像情報
     */
    getResImageData(imageData) {
      const resData = {}

      resData.path = imageData
        ? imageData.imageUrl + '?' + this.$common.getTimeStamp()
        : ''
      resData.imageName = imageData ? imageData.fileName : ''

      return resData
    },
    /**
     * 登録画像一覧取得APIの呼び出し
     */
    getCmsEditorUploadImageList() {
      const paramData = {
        keyword: this.inputKeyword,
        offset: this.offset,
        limit: this.limit,
      }

      this.$common.addCallApiNum()
      this.$api
        .getCmsEditorUploadImageList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.imageList = resData.data.imageList
            this.totalDataCount = resData.data.searchResult
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
     * 画像削除確認モーダルの表示
     *
     * @param {object} imageInfo 選択画像情報
     */
    showDeleteAlertMoldal(imageInfo) {
      this.selectImage = imageInfo
      this.showDeleteAlertFlg = true
    },
    /**
     * 画像削除確認モーダルの非表示
     */
    cancelDeleteImage() {
      this.selectImage = {}
      this.showDeleteAlertFlg = false
    },
    /**
     * アップロード画像削除APIの呼び出し
     */
    deleteCmsEditorImage() {
      const paramData = {
        imageId: this.selectImage.imageId,
        recordVersion: this.selectImage.recordVersion,
      }

      this.showDeleteAlertFlg = false

      this.$common.addCallApiNum()
      this.$api
        .deleteCmsEditorImage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getCmsEditorUploadImageList() // 登録画像一覧取得APIの呼び出し
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
     * アップロード画像を選択
     */
    selectUploadImage(imageInfo) {
      this.$emit('uploaded', this.getResImageData(imageInfo))
    },
    /**
     * テキストエリアの佐文っと処理
     */
    submitSearchText() {
      this.offset = 1
      this.getCmsEditorUploadImageList() // 登録画像一覧取得APIの呼び出し
    },
    /**
     * 前のページに移動
     */
    showPrevPage() {
      this.offset -= 1
      this.getCmsEditorUploadImageList() // 登録画像一覧取得APIの呼び出し
    },
    /**
     * 次のページに移動
     */
    showNextPage() {
      this.offset += 1
      this.getCmsEditorUploadImageList() // 登録画像一覧取得APIの呼び出し
    },
  },
}
</script>

<style lang="scss" scoped>
.select-image-file {
  .current-image {
    .image {
      img {
        width: 100%;
      }
    }
    .delete-image {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      cursor: pointer;
      p {
        margin-left: 8px;
      }
    }
  }
  .select-image {
    .select-image-tab {
      ul {
        display: flex;
        align-items: center;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          padding: 0 16px;
          font-size: 13px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          &.is-selected {
            background: #ebeced;
            color: #007aff;
          }
        }
      }
    }
    .alert-message {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      h5,
      p {
        color: #ffffff;
        text-align: center;
      }
      h5 {
        .icon-attention {
          margin-right: 12px;
        }
      }
      .buttons {
        margin-top: 18px;
      }
    }
    .image-upload {
      margin-top: 10px;
      .file-upload {
        position: relative;
      }
      .select-upload-file {
        .search-image {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .input-search-text {
            width: 360px;
          }
        }
        .no-data {
          padding: 20px;
        }
        .select-regist-image {
          margin-top: 10px;
          position: relative;
          .alert-message {
            p {
              margin-top: 8px;
            }
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            max-height: 400px;
            overflow: auto;
            li {
              width: calc(100% / 3 - 7px);
              cursor: pointer;
              &:not(:nth-child(3n)) {
                margin-right: 10px;
              }
              &:nth-child(n + 4) {
                margin-top: 10px;
              }
              &.is-selected {
                border: 1px solid blue;
              }
              .image {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 130px;
                img {
                  max-height: 100%;
                  max-width: 100%;
                }
              }
              .image-detail {
                display: flex;
                align-items: center;
                margin-top: 8px;
                .icon-delete {
                  min-width: 24px;
                  height: 24px;
                }
                .file-name {
                  margin-left: 8px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
