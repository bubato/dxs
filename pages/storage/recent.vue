<template>
  <div class="storage-list">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">最近使用したファイル</h2>
        <CustomInputText
          v-model="inputSearchText"
          placeholder="ファイル名やフォルダ名を入力して検索してください"
          view-type="search"
          :validation="validationSearchText"
          @submit="transitionSearchResult($event)"
        />
      </div>
      <div v-if="storageList.length === 0" class="contents list0">
        <h2 class="context">最近使用したファイルはありません。</h2>
      </div>
      <div v-else class="contents">
        <div class="selectAreaWrap">
          <ul class="buttonList">
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
        </div>
        <StorageTable
          ref="storageTable"
          class="table-area"
          :storage-list="storageList"
          @modalSwitch="modalSwitch($event, obj)"
        />
      </div>
    </div>
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
    ...mapState('storage/storageList', ['checkedFlg', 'moveGetList']),
  },
  watch: {
    moveGetList(flg) {
      if (flg) {
        this.getStorageRecent()
      }
    },
  },
  created() {
    this.resetDefaultState()
    this.getStorageRecent()
  },
  methods: {
    ...mapMutations('storage/searchResult', ['setStorageSearchText']),
    ...mapMutations('storage/storageList', [
      'resetDefaultState',
      'showStorageDeleteModal',
      'offMoveGetList',
    ]),
    /**
     * 検索結果画面に遷移
     */
    transitionSearchResult() {
      this.setStorageSearchText(this.inputSearchText)
      this.$router.push('/storage/searchResults/')
    },
    /**
     * ファイル一覧の取得
     */
    getStorageRecent() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getStorageRecent(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.storageList = resData.data.objects
            this.offMoveGetList()
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
      title: '最近使用したファイル｜ストレージ｜bizskyDX',
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
    margin-top: 28px;
    &.list0 {
      margin-top: 32px;
      .context {
        font-size: 17px;
        color: #8d8d8d;
        text-align: center;
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
      margin: 16px 0;
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
