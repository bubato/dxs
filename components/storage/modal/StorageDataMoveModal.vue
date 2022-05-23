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
            <h4>{{ objectTypeText[selectStorageInfo.objectType] }}を移動</h4>
          </div>
          <div class="modal_contents">
            <p class="context">移動先のフォルダを選択してください。</p>
            <div class="wrapArea">
              <p class="wrapAreaTitle">
                元の{{ objectTypeText[selectStorageInfo.objectType] }}の場所
              </p>
              <ul class="wrapBreadcrumb">
                <li v-for="(i, index) in breadcrumb" :key="i + index">
                  {{ i.folderName }}
                  <KeyboardArrowRightSVG
                    v-if="index !== breadcrumb.length - 1"
                    class="icon-next"
                  />
                </li>
              </ul>
              <div class="selectArea">
                <p class="selectAreaTitle">移動先の場所</p>
                <ul class="selectAreaBreadcrumb">
                  <li
                    v-for="(data, index) in selectBreadcrumbList"
                    :key="index"
                    :class="[
                      {
                        'is-current': index === selectBreadcrumbList.length - 1,
                      },
                      { notPointer: checkNotPointerCheck(index) },
                    ]"
                  >
                    <a
                      v-if="index !== selectBreadcrumbList.length - 1"
                      class="folderName"
                      @click="getStorageObjects(data.objectId)"
                      >{{ data.folderName }}</a
                    >
                    <p v-else class="folderName">
                      {{ data.folderName }}（ここに移動）
                    </p>
                    <KeyboardArrowRightSVG
                      v-if="index !== selectBreadcrumbList.length - 1"
                      class="icon-next"
                    />
                  </li>
                </ul>
                <div class="wrapSelectAreaList">
                  <div v-if="flagBackFolder" class="backFolder">
                    <ToBackScreenLink
                      label="1つ上のフォルダに戻る"
                      @click="
                        getStorageObjects(
                          selectBreadcrumbList.slice(-2)[0].objectId
                        )
                      "
                    />
                  </div>
                  <ul class="selectAreaList">
                    <li v-for="(i, index) in folderList" :key="index">
                      <p
                        class="selectAreaListText link-text link-color-black"
                        @click="getStorageObjects(i.objectId)"
                      >
                        <FolderSVG class="icon-folder" /> {{ i.objectName }}
                      </p>
                    </li>
                  </ul>
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
                :class="{ 'btn-disabled': checkBtnDisabled }"
                @click="moveStorageData()"
              >
                移動
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
  name: 'StorageDataMoveModal',
  props: {
    storageList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      selectBreadcrumbList: [],
      folderList: [],
      flagBackFolder: true,
    }
  },
  computed: {
    ...mapState('storage/storageList', [
      'selectStorageInfo',
      'breadcrumbList',
      'breadcrumb',
      'objectTypeText',
    ]),
    /**
     * ボタン「移動」アクティブ切り替え
     */
    checkBtnDisabled() {
      let result = true

      if (
        this.breadcrumbList.slice(-1)[0].objectId !==
        this.selectBreadcrumbList.slice(-1)[0].objectId
      ) {
        result = false
      }

      return result
    },
  },
  created() {
    this.firstLoad()
  },
  methods: {
    ...mapMutations('storage/storageList', [
      'onMoveGetList',
      'setBreadcrumbList',
      'setBreadcrumb',
    ]),
    /**
     * モーダル起動時 初回動作
     */
    firstLoad() {
      this.selectBreadcrumbList = this.breadcrumbList
      this.changeFlagBackFolder(this.breadcrumb.length)

      if (this.$route.path.includes('/storage/home/')) {
        this.updateFolderList(this.storageList)
      } else {
        this.getStorageObjects(this.selectStorageInfo.objectId)
      }
    },
    /**
     * モーダル起動時 storageListよりフォルダのみ抽出
     *
     * @param {object} setList データ一覧リスト
     */
    updateFolderList(setList) {
      this.folderList = []

      for (const i in setList) {
        // 「not共有フォルダ」
        if (
          setList[i].objectType === 1 &&
          !this.selectStorageInfo.shareFlag &&
          setList[i].objectId !== this.selectStorageInfo.objectId
        ) {
          this.folderList.push(setList[i])
        }

        // 「共有フォルダ」
        if (
          setList[i].objectType === 1 &&
          this.selectStorageInfo.shareFlag &&
          !setList[i].shareFlag &&
          setList[i].objectId !== this.selectStorageInfo.objectId
        ) {
          this.folderList.push(setList[i])
        }
      }
    },
    /**
     * パンくずリンクでのcss 共有フォルダチェック
     *
     * @param {Number} index 表示順番号
     * @return {boolean} 共有フォルダかつ0の場合、trueを戻す
     */
    checkNotPointerCheck(index) {
      if (this.selectStorageInfo.shareFlag && !index) {
        return true
      } else {
        return false
      }
    },
    /**
     * ファイル一覧の取得
     *
     * @param {Number} setId データ取得時に設定するID
     */
    getStorageObjects(setId) {
      const paramData = {
        type: 1,
      }

      if (setId !== undefined) {
        paramData.id = setId
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageObjects(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (this.breadcrumb.length === 0) {
              this.setBreadcrumbList(resData.data.breadcrumbList)
              this.setBreadcrumb(resData.data.breadcrumbList)
            }

            this.selectBreadcrumbList = resData.data.breadcrumbList
            this.updateFolderList(resData.data.objects)
            this.checkBtnDisabled()
            this.changeFlagBackFolder(resData.data.breadcrumbList.length)
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
     * ストレージ オブジェクト移動API
     *
     * @param {Number} lengthNo 取得したbreadcrumbListの数 1の場合false||共有フォルダだった場合は3以下の場合false
     */
    changeFlagBackFolder(lengthNo) {
      if (
        lengthNo === 1 ||
        (this.selectStorageInfo.shareFlag && lengthNo < 3)
      ) {
        this.flagBackFolder = false
      } else {
        this.flagBackFolder = true
      }
    },
    /**
     * ストレージ オブジェクト移動API
     */
    moveStorageData() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
        parentId: this.selectBreadcrumbList.slice(-1)[0].objectId,
        recordVersion: this.selectStorageInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .moveStorageData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.onMoveGetList()
            this.$emit('close')
            this.$common.showCompletePopAlert(
              'ActionMsg_Gen14',
              this.objectTypeText[this.selectStorageInfo.objectType]
            )
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
.modal-container {
  width: 832px;
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
    .wrapArea {
      background: #f7f8f9;
      border-radius: 6px;
      margin-top: 24px;
      padding: 24px;
      .wrapAreaTitle {
        font-weight: bold;
      }
      .wrapBreadcrumb {
        color: #8d8d8d;
        margin-top: 8px;
        li {
          padding-right: 4px;
          display: inline-block;
          .icon-next {
            fill: #8d8d8d;
            width: 16px;
            height: 16px;
          }
        }
      }
      .selectArea {
        background: #fff;
        margin-top: 24px;
        padding: 24px;
        .selectAreaTitle {
          font-weight: bold;
        }
        .selectAreaBreadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 12px;
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
            .notPointer {
              cursor: default;
            }
            a {
              text-decoration: none;
              &:hover {
                text-decoration: underline;
              }
            }
            .icon-next {
              fill: #8d8d8d;
              width: 16px;
              height: 16px;
              margin: 0 4px;
            }
          }
        }

        .wrapSelectAreaList {
          border-top: 1px solid #e5e5e5;
          margin-top: 24px;
          .backFolder {
            margin-top: 24px;
            color: #007aff;
            span {
              cursor: pointer;
              text-decoration: underline;
            }
          }
          .selectAreaList {
            margin-top: 24px;
            height: 115px;
            overflow: scroll;
            li {
              &:not(:last-child) {
                padding-bottom: 12px;
              }
            }
            .selectAreaListText {
              display: inline-block;
              vertical-align: middle;
              max-width: 618px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .icon-folder {
              margin-right: 8px;
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
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
