<template>
  <div class="storage-list">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">削除したファイル</h2>
      </div>
      <div v-if="storageDeleteList.length === 0" class="contents list0">
        <h2 class="context">削除したファイルはありません。</h2>
      </div>
      <div v-else class="contents">
        <div v-if="flgAlertArea" class="alertArea">
          <h2>削除したファイルは30日間後に自動的に削除されます。</h2>
          <p>削除してから30日以内ならファイルを元に戻すことも可能です。</p>
        </div>
        <div class="selectAreaWrap">
          <ul class="buttonList">
            <li>
              <button
                class="btn btn-secondary"
                :class="{ 'btn-disabled': !checkedFlg }"
                @click="btnDeleteClick()"
              >
                完全に削除
              </button>
            </li>
          </ul>
        </div>
        <StorageTable
          ref="storageTable"
          class="table-area"
          :storage-list="storageDeleteList"
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
      storageDeleteList: [],
      flgAlertArea: false,
    }
  },
  computed: {
    ...mapState('storage/storageList', ['checkedFlg', 'moveGetList']),
  },
  watch: {
    moveGetList(flg) {
      if (flg) {
        this.getStorageDeleted()
      }
    },
  },
  created() {
    this.resetDefaultState()
    this.getStorageDeleted()
  },
  methods: {
    ...mapMutations('storage/storageList', [
      'resetDefaultState',
      'showStorageDeleteModal',
      'offMoveGetList',
    ]),
    /**
     * ストレージ削除一覧の取得
     */
    getStorageDeleted() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getStorageDeleted(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.storageDeleteList = resData.data.objects
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
     * ボタン「削除」クリック動作
     */
    btnDeleteClick() {
      this.showStorageDeleteModal()
    },
  },
  head() {
    return {
      title: '削除済のファイル｜ストレージ｜bizskyDX',
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
    .alertArea {
      border: 1px solid #ffcc00;
      border-radius: 4px;
      padding: 28px 24px;
      margin-bottom: 32px;
      background: #fffae5;
      h2 {
        font-size: 20px;
        margin-bottom: 4px;
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
      margin-bottom: 16px;
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
