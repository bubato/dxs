<template>
  <div class="storage-list">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">共有済のファイル</h2>
        <CustomInputText
          v-if="storageList.length > 0"
          v-model="inputSearchText"
          placeholder="ファイル名やフォルダ名を入力して検索してください"
          view-type="search"
          :validation="validationSearchText"
          @submit="transitionSearchResult($event)"
        />
      </div>
      <div v-if="storageList.length === 0" class="contents list0">
        <h2 class="context">共有済のファイルはありません。</h2>
        <ul class="buttonList">
          <li>
            <button
              class="btn btn-basic btn-long"
              @click="showStorageMakeSharedFolderModal()"
            >
              共有フォルダを作成
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="contents">
        <ul class="buttonList">
          <button
            class="btn btn-basic"
            @click="showStorageMakeSharedFolderModal()"
          >
            共有フォルダを作成
          </button>
        </ul>
        <div class="selectAreaWrap">
          <ul class="buttonList">
            <!-- <li>
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
          @modalSwitch="modalSwitch($event, obj)"
        />
      </div>
    </div>
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
  data() {
    return {
      inputSearchText: '',
      storageList: [],
      currentPage: 1,
      settingShowNum: 20,
      totalDataCount: 0,
      storageParams: {
        sort: '',
        order: null,
      },
      showStorageMakeSharedFolderModalState: false,
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
      'checkedFlg',
      'selectSortType',
      'breadcrumb',
      'moveGetList',
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
    this.getStorageShared()
  },
  methods: {
    ...mapMutations('storage/searchResult', ['setStorageSearchText']),
    ...mapMutations('storage/storageList', [
      'resetDefaultState',
      'showStorageDeleteModal',
      'setBreadcrumb',
      'offMoveGetList',
    ]),
    /**
     * 検索結果画面に遷移
     *
     * @param {string} inputWord 検索欄入力テキスト
     */
    transitionSearchResult(inputWord) {
      this.setStorageSearchText(inputWord)
      this.inputSearchText = ''
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
     * @param {number} settingShowNum 表示件数
     */
    updateSettingShowNum(settingShowNum) {
      if (this.settingShowNum === settingShowNum) {
        return
      }

      if (settingShowNum === undefined) {
        settingShowNum = this.settingShowNum
      }

      this.settingShowNum = settingShowNum
      this.currentPage = 1
      this.getStorageShared()
    },
    /**
     * 表示件数の更新
     *
     * ページング情報の表示件数で再度APIを投げる
     */
    emitPageState() {
      this.getStorageShared()
    },
    /**
     * ファイル一覧の取得
     */
    getStorageShared() {
      const paramData = {
        offset: this.currentPage - 1,
        limit: this.settingShowNum,
      }

      if (this.selectSortType.sort) {
        paramData.sortKey = this.selectSortType.sort
        paramData.sortDirection = this.selectSortType.order
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageShared(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.totalDataCount = resData.data.countSearch
            this.storageList = resData.data.objects
            this.offMoveGetList()
            this.setBreadcrumb(resData.data.breadcrumbList)
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

      this.getStorageShared() // ファイル一覧の取得
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
  },
  head() {
    return {
      title: '共有済のファイル｜ストレージ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    .custom-input-text {
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
        font-size: 17px;
        text-align: center;
        color: #8d8d8d;
      }
      .file-upload {
        margin: 0 auto;
        margin-top: 32px;
        width: 856px;
        ::v-deep .btn.btn-secondary {
          width: 123px;
          height: 40px;
        }
      }
      .buttonList {
        margin-top: 32px;
        justify-content: center;
        .btn-basic {
          padding: 0 24px;
          font-size: 15px;
        }
      }
    }
    .buttonList {
      display: flex;
      li:not(last-child) {
        padding-right: 16px;
      }
      .btn-basic {
        padding: 6px 12px;
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
          padding-right: 16px;
        }
      }
    }
  }
}
</style>
