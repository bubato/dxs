<template>
  <div class="storage-list">
    <div class="main-contents">
      <div class="header">
        <h2
          v-if="!storageList.length && pathStorageObjectId"
          class="header-title"
        >
          {{ titleText }}
        </h2>
        <h2 v-else>すべてのファイル</h2>
        <CustomInputText
          v-if="storageList.length > 0"
          v-model="inputSearchText"
          placeholder="ファイル名やフォルダ名を入力して検索してください"
          view-type="search"
          :validation="validationSearchText"
          @submit="transitionSearchResult($event)"
        />
      </div>
      <div
        v-if="storageList.length === 0 && pathStorageObjectId"
        class="contents"
      >
        <ul class="buttonList">
          <li>
            <button class="btn btn-basic" @click="showStorageFileUpload()">
              ファイルをアップロード
            </button>
          </li>
          <li v-show="buttonCreateFolder">
            <button class="btn btn-basic" @click="showStorageMakeFolderModal()">
              フォルダを作成
            </button>
          </li>
        </ul>
        <StorageBreadcrumb />
      </div>
      <div
        v-if="storageList.length === 0"
        class="contents list0"
        :class="{ childFolder: pathStorageObjectId }"
      >
        <h2 class="context">
          ばらばらにあるファイルをストレージでかんたん管理、共有。
        </h2>
        <div class="custom-input-text validation-error">
          <ValidationMessage
            v-if="errorList.length > 0"
            :error-list="errorList"
          />
          <FileUpload
            file-type="all"
            :file-data="fileData"
            :max-size="10240"
            @uploaded="getUploadData($event)"
          />
        </div>
        <ul class="buttonList">
          <li>
            <button
              class="btn btn-basic btn-long"
              @click="showStorageMakeFolderModal()"
            >
              フォルダを作成
            </button>
          </li>
          <li>
            <button
              class="btn btn-basic btn-long"
              @click="showStorageMakeSharedFolderModal()"
            >
              共有フォルダを作成
            </button>
          </li>
          <li>
            <button
              class="btn btn-basic btn-long"
              @click="showStorageFileUpload()"
            >
              ファイルをアップロード
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="contents">
        <ul class="buttonList">
          <li>
            <button class="btn btn-basic" @click="showStorageFileUpload()">
              ファイルをアップロード
            </button>
          </li>
          <li v-show="buttonCreateFolder">
            <button class="btn btn-basic" @click="showStorageMakeFolderModal()">
              フォルダを作成
            </button>
          </li>
          <li v-show="$route.params.objectId === undefined">
            <button
              class="btn btn-basic"
              @click="showStorageMakeSharedFolderModal()"
            >
              共有フォルダを作成
            </button>
          </li>
        </ul>
        <div class="selectAreaWrap">
          <ul class="buttonList">
            <!--<li>
              <button
                class="btn btn-secondary"
                :class="{ 'btn-disabled': !checkedFlg }"
                @click="btnDownloadClick()"
              >
                <DownloadSVG
                  class="icon-download"
                  @mouseover="
                    $common.setAreaLabel($event, 'top', 'ダウンロード')
                  "
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                />ダウンロード
              </button>
            </li>-->
            <li>
              <button
                class="btn btn-secondary"
                :class="{ 'btn-disabled': !checkedFlg }"
                @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @click="btnDeleteClick()"
              >
                削除
              </button>
            </li>
          </ul>
          <ul class="pagerWrap">
            <li>
              <SettingShowNum
                :setting-show-num="settingShowNum"
                @update="updateSettingShowNum($event)"
              />
            </li>
            <li>
              <PageNav
                :current-page="currentPage"
                :setting-show-num="settingShowNum"
                :max-data-num="totalDataCount"
                @showPrevPage="showPrevPage()"
                @showNextPage="showNextPage()"
              />
            </li>
          </ul>
        </div>
        <StorageBreadcrumb />
        <StorageTable
          ref="storageTable"
          class="table-area"
          :storage-list="storageList"
          @sortChange="onSortChanged"
        />
      </div>
    </div>
    <StorageFileUploadModal
      v-if="storageFileUploadFlg"
      @close="hideStorageFileUpload()"
      @updateSettingShowNum="updateSettingShowNum"
    />
    <StorageOverwriteModal
      v-if="storageOverwriteModalFlg"
      @close="hideStorageOverwriteModal()"
      @updateSettingShowNum="updateSettingShowNum"
    />
    <StorageMakeFolderModal
      v-if="showStorageMakeFolderModalState"
      @close="hideStorageMakeFolderModal()"
    />
    <StorageMakeSharedFolderModal
      v-if="showStorageMakeSharedFolderModalState"
      @close="hideStorageMakeSharedFolderModal()"
    />
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'mainLayout',
  props: {},
  data() {
    return {
      titleText: 'すべてのファイル',
      inputSearchText: '',
      storageList: [],
      informationObject: null,
      buttonCreateFolder: true,
      currentPage: 1,
      settingShowNum: 20,
      totalDataCount: 0,
      storageParams: {
        sort: '',
        order: null,
      },
      showStorageMakeFolderModalState: false,
      showStorageMakeSharedFolderModalState: false,
      fileData: '',
      errorList: [],
      uploadData: {
        name: '',
        fileType: '',
        fileSize: '',
        file: '',
        fileUploadURL: '',
        filePath: '',
      },
      validationSearchText: [
        {
          type: 'maxlength',
          maxlength: 50,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 50,
          }),
        },
      ],
    }
  },
  computed: {
    ...mapState('storage/storageList', [
      'selectSortType',
      'breadcrumb',
      'storageFileUploadFlg',
      'storageOverwriteModalFlg',
      'moveGetList',
      'pathStorageObjectId',
      'checkedFlg',
      'extNgList',
      'uploadDataFlg',
    ]),
  },
  watch: {
    moveGetList(flg) {
      if (flg) {
        this.updateSettingShowNum()
      }
    },
  },
  created() {
    this.resetDefaultState()
    this.getPathStorageObjectId(this.$route.params)
    this.getStorageObjects()
  },
  methods: {
    ...mapMutations('storage/searchResult', ['setStorageSearchText']),
    ...mapMutations('storage/storageList', [
      'resetDefaultState',
      'showStorageDeleteModal',
      'setBreadcrumbList',
      'setBreadcrumb',
      'showStorageFileUpload',
      'hideStorageFileUpload',
      'hideStorageOverwriteModal',
      'offMoveGetList',
      'getPathStorageObjectId',
      'onUploadUpdateFlg',
      'onUploadDataFlg',
    ]),
    /**
     * 検索結果画面に遷移
     */
    transitionSearchResult() {
      this.setStorageSearchText(this.inputSearchText)
      this.$router.push('/storage/searchResults/')
    },
    /**
     * 前のページに移動
     */
    showPrevPage() {
      this.currentPage--
      this.emitPageState()
    },
    /**
     * 次のページに移動
     */
    showNextPage() {
      this.currentPage++
      this.emitPageState()
    },
    /**
     * 表示件数の更新
     *
     * @param {number} settingShowNum 表示総数
     */
    updateSettingShowNum(settingShowNum) {
      if (settingShowNum === undefined) {
        settingShowNum = this.settingShowNum
      }

      this.settingShowNum = settingShowNum
      this.currentPage = 1
      this.getStorageObjects()
    },
    /**
     * 表示件数の更新
     *
     * ページング情報の表示件数で再度APIを投げる
     */
    emitPageState() {
      this.getStorageObjects()
    },
    /**
     * ボタン「フォルダを作成」非表示判定
     */
    updateButtonCreateFolder() {
      if (this.informationObject.communityFlag === 1) {
        this.buttonCreateFolder = false
      }
    },
    /**
     * ファイル一覧の取得
     */
    getStorageObjects() {
      const paramData = {
        offset: this.currentPage - 1,
        limit: this.settingShowNum,
      }

      if (this.pathStorageObjectId !== null) {
        paramData.id = this.pathStorageObjectId
      } else {
        this.$router.push('/storage/home/')
      }

      if (this.selectSortType.sort) {
        paramData.sortKey = this.selectSortType.sort
        paramData.sortDirection = this.selectSortType.order
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageObjects(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.totalDataCount = resData.data.countSearch
            this.storageList = resData.data.objects

            if (resData.data.informationObject !== null) {
              this.informationObject = resData.data.informationObject
              this.updateButtonCreateFolder()
            }

            this.offMoveGetList()
            const resBreadcrumb = resData.data.breadcrumbList
            this.setBreadcrumbList(resBreadcrumb)
            this.setBreadcrumb(resBreadcrumb)

            if (resBreadcrumb.length !== 1) {
              this.titleText = resBreadcrumb.slice(-1)[0].folderName
            }

            if (this.uploadDataFlg) {
              this.onUploadUpdateFlg()
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
     * テーブルソート処理
     *
     * @param {object} e 選択ソート値
     */
    onSortChanged(e) {
      this.storageParams.sort = e.sort
      this.storageParams.order = e.order

      this.getStorageObjects() // ファイル一覧の取得
    },
    /**
     * フォルダを作るボタン押下処理
     */
    showStorageMakeFolderModal() {
      this.showStorageMakeFolderModalState = true
    },
    /**
     * フォルダ作成モーダルの非表示
     */
    hideStorageMakeFolderModal() {
      this.showStorageMakeFolderModalState = false
    },
    /**
     * 共有フォルダを作るボタン押下処理
     */
    showStorageMakeSharedFolderModal() {
      this.showStorageMakeSharedFolderModalState = true
    },
    /**
     * 共有フォルダ作成モーダルの非表示
     */
    hideStorageMakeSharedFolderModal() {
      this.showStorageMakeSharedFolderModalState = false
    },
    /**
     * ボタン「ダウンロード」クリック動作
     */
    btnDownloadClick() {
      this.$refs.storageTable.storageDownload()
    },
    /**
     * ボタン「削除」クリック動作
     */
    btnDeleteClick() {
      this.showStorageDeleteModal()
    },
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
            this.putStorageFileForUploadUrl()
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
        .then((resData) => {
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
            this.onUploadDataFlg()
            this.updateSettingShowNum()
            this.$common.showCompletePopAlert('ActionMsg_Gen13', 'ファイル')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
  head() {
    return {
      title: this.titleText + '｜ストレージ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    .custom-input-text {
      position: relative;
      margin-left: auto;
      ::v-deep .type-search {
        width: 593px;
      }
    }
  }
  .contents {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e5e5;
    &.list0 {
      border: none;
      padding-top: 0;
      .context {
        font-size: 22px;
        text-align: center;
      }
      ::v-deep .custom-input-text {
        padding-top: 32px;
        .validation-message {
          width: 856px;
          margin: 0 auto;
          margin-bottom: 10px;
        }
        .file-upload {
          margin: 0 auto;
          width: 856px;
          .btn.btn-secondary {
            width: 123px;
            height: 40px;
          }
        }
      }
      .buttonList {
        margin-top: 32px;
        justify-content: center;
        .btn-basic {
          padding: 0 24px;
          font-size: 15px;
          height: 48px;
        }
      }
      &.childFolder {
        ::v-deep .file-upload {
          .drop_area {
            height: 220px;
            &::before {
              content: url(~@/assets/images/storage/upload_file.png);
              display: inline-block;
              position: absolute;
              margin-left: 46.5%;
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

        .context {
          display: none;
        }
        .buttonList {
          display: none;
        }
      }
    }
    .buttonList {
      display: flex;
      li:not(last-child) {
        margin-right: 16px;
      }
      .btn-basic {
        height: 32px;
        padding: 0 12px;
        font-size: 13px;
        svg {
          fill: #fff;
        }
      }
      .icon-close {
        transform: rotate(-30deg);
        margin-right: 3px;
        width: 20px;
        height: 20px;
      }
      .icon-expandMore {
        margin-left: 2px;
        width: 16px;
        height: 16px;
      }
    }
    .selectAreaWrap {
      margin-top: 16px;
      display: flex;
      .btn-secondary {
        font-size: 13px;
        font-weight: bold;
        padding: 4px 12px;
        border: 1px solid #e0e0e0;
        color: #1e1e1e;
        .icon-download {
          margin-left: -5px;
          margin-right: 7px;
        }
      }
      li:last-child {
        .btn-secondary {
          padding: 6px 12px;
        }
      }
      .pagerWrap {
        display: flex;
        margin-left: auto;
        li:nth-child(1) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
