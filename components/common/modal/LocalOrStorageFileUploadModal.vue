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
            <h3>ファイルを添付</h3>
          </div>
          <div class="modal_contents">
            <div class="select-upload-type">
              <CustomInputRadio
                v-model="selectUploadType"
                :options="uploadTypeOptions"
                name="selectUploadType"
                @input="changeSelectUploadType($event)"
              />
            </div>
            <p class="context">
              アップロード可能なファイルサイズは{{
                maxFileSize / 1024
              }}MBまでです。
            </p>
            <div v-if="selectUploadType === '1'" class="type-upload">
              <FileUpload
                :file-type="fileType"
                :file-data="fileData"
                :max-size="maxFileSize"
                :is-sp-file-upload="isSpFileUpload"
                @uploaded="selectUploadFile($event)"
                @deleted="deleteUploadFile()"
              />
            </div>
            <div v-if="selectUploadType === '2'" class="type-storage">
              <div class="selectArea">
                <p class="selectAreaTitle">現在閲覧中の場所</p>
                <ul class="selectAreaBreadcrumb">
                  <li
                    v-for="(data, index) in breadcrumbList"
                    :key="index"
                    :class="{
                      'is-current': index === breadcrumbList.length - 1,
                    }"
                  >
                    <a
                      v-if="index !== breadcrumbList.length - 1"
                      class="folderName"
                      @click="getStorageObjects(data.objectId)"
                      >{{ data.folderName }}</a
                    >
                    <p v-else class="folderName">
                      {{ data.folderName }}
                    </p>
                    <KeyboardArrowRightSVG
                      v-if="index !== breadcrumbList.length - 1"
                      class="icon-next"
                    />
                  </li>
                </ul>
                <div class="wrapSelectAreaList">
                  <ToBackScreenLink
                    v-if="breadcrumbList.length > 1"
                    class="backFolder"
                    label="1つ上のフォルダに戻る"
                    @click="getPrevStorageObjects()"
                  />
                  <ul class="selectAreaList">
                    <li
                      v-for="(object, index) in storageObjectList"
                      :key="index"
                    >
                      <div class="input-radio">
                        <input
                          v-if="object.objectType === 2"
                          v-model="selectFileObject"
                          type="radio"
                          name="selectFile"
                          :value="object.objectId"
                        />
                      </div>
                      <FolderSVG
                        v-if="object.objectType === 1"
                        class="icon icon-folder"
                      />
                      <FileSVG
                        v-if="object.objectType === 2"
                        class="icon icon-file"
                      />
                      <p
                        class="selectAreaListText"
                        @click="
                          selectStorageObject(
                            object.objectId,
                            object.objectType
                          )
                        "
                      >
                        {{ object.objectName }}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-long"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button
              v-if="selectUploadType === '2'"
              class="btn btn-basic btn-long"
              :class="{ 'btn-disabled': selectFileObject === '' }"
              @click="attachingFile()"
            >
              ファイルを添付
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LocalOrStorageFileUploadModal',
  props: {
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
    maxFileSize: {
      type: Number,
      default: 5120,
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
      selectUploadType: '1',
      selectFileObject: '',
      breadcrumbList: [],
      storageObjectList: [],
      uploadTypeOptions: [
        {
          label: 'アップロード',
          value: '1',
        },
        {
          label: 'ストレージから選択',
          value: '2',
        },
      ],
    }
  },
  computed: {},
  created() {},
  methods: {
    /**
     * アップロードタイプ変更処理
     *
     * @param {String} selectVal 選択値
     */
    changeSelectUploadType(selectVal) {
      if (selectVal === '2') {
        this.getStorageObjects()
      }
    },
    /**
     * ストレージ オブジェクト一覧の取得
     *
     * @param {Number} objectId オブジェクトID 空の場合はルート直下を参照
     */
    getStorageObjects(objectId) {
      const paramData = {
        id: objectId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageObjects(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.breadcrumbList = resData.data.breadcrumbList
            this.storageObjectList = resData.data.objects
            this.selectFileObject = ''
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
     * ストレージオブジェクトの選択
     *
     * @param {number} objectId オブジェクトID
     * @param {string} objectType オブジェクトType(1:フォルダ or 2:ファイル)
     */
    selectStorageObject(objectId, objectType) {
      if (objectType === 1) {
        this.getStorageObjects(objectId)
      } else if (objectType === 2) {
        this.selectFileObject = objectId
      }
    },
    /**
     * １階層上のフォルダ内容を表示
     */
    getPrevStorageObjects() {
      const targetObjectId = this.breadcrumbList[this.breadcrumbList.length - 2]
        .objectId

      this.getStorageObjects(targetObjectId)
    },
    /**
     * ファイル添付処理
     */
    attachingFile() {
      const targetFile = this.storageObjectList.find(
        (data) => data.objectId === this.selectFileObject
      )

      this.$emit('existUploaded', {
        fileStorageObjectId: this.selectFileObject,
        fileName: targetFile.objectName,
      })
      this.$emit('close')
    },
    /**
     * アップロードファイル選択処理
     *
     * @param {object} fileInfo 選択したファイル情報
     */
    selectUploadFile(fileInfo) {
      this.$emit('newUploaded', fileInfo)
      this.$emit('close')
    },
    /**
     * アップロードファイル削除処理
     *
     * @param {object} fileInfo 選択したファイル情報
     */
    deleteUploadFile() {
      this.$emit('delete')
      this.$emit('close')
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
    margin-top: 16px;
    .select-upload-type {
      display: flex;
      justify-content: center;
      ::v-deep
        .custom-input-radio.horizon-layout
        .radio_list
        label:not(:last-child) {
        margin-right: 40px;
      }
    }
    .context {
      margin: 32px 0 24px 0;
      text-align: center;
    }
    .type-storage {
      background: #f7f8f9;
      padding: 24px;
      .selectArea {
        background: #ffffff;
        padding: 24px;
        .selectAreaBreadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 8px;
          padding-bottom: 24px;
          li {
            color: #8d8d8d;
            &:not(.is-current) {
              cursor: pointer;
            }
            &.is-current {
              p {
                &:hover {
                  text-decoration: none;
                }
              }
            }
            a {
              text-decoration: none;
              &:hover {
                text-decoration: underline;
              }
            }
            .icon-next {
              width: 16px;
              height: 16px;
              fill: #8d8d8d;
              margin: 0 4px;
            }
          }
        }
        .wrapSelectAreaList {
          padding-top: 24px;
          border-top: 1px solid #e5e5e5;
          .selectAreaList {
            height: 168px;
            overflow: auto;
            margin-top: 24px;
            li {
              display: flex;
              align-items: center;
              &:not(:first-child) {
                margin-top: 12px;
              }
              .input-radio {
                width: 18px;
              }
              .icon {
                width: 24px;
                height: 24px;
                margin-left: 16px;
              }
              .selectAreaListText {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin-left: 8px;
                text-decoration: underline;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    &:not(:first-child) {
      margin-left: 16px;
    }
  }
}
</style>
