<template>
  <div class="change-form-status-dialog">
    <p
      v-show="checkDialogTitle"
      class="title"
      @click="modalSwitchName('addSharedMember')"
    >
      メンバーを招待
    </p>
    <ul class="list">
      <li
        v-for="(i, index) in setListData"
        :key="index"
        :class="i.class"
        @click="modalSwitchName(i.class)"
      >
        {{ displayText(i) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StorageMenuDialog',
  data() {
    return {}
  },
  computed: {
    ...mapState('storage/storageList', [
      'selectStorageInfo',
      'pinText',
      'objectTypeText',
    ]),
    /**
     * 表示項目名 分岐
     *
     * @return {string} 表示テキスト
     */
    displayText() {
      return (i) => {
        if (i.text === 'ピン留め') {
          return this.pinText[this.selectStorageInfo.pinFlag]
        } else if (i.text === 'ファイルフォルダを移動') {
          return (
            this.objectTypeText[this.selectStorageInfo.objectType] + 'を移動'
          )
        } else {
          return i.text
        }
      }
    },
    /**
     * 第一階層判定
     *
     * @return {boolean} 判定値
     */
    firstLayerFlag() {
      let result = false

      if (
        (this.$route.path.includes('home/') &&
          this.$route.params.objectId === undefined) ||
        (this.$route.path.includes('pin/') &&
          this.selectStorageInfo.parentId === null) ||
        (this.$route.path.includes('searchResults/') &&
          this.selectStorageInfo.parentId === null) ||
        this.$route.path.includes('share/')
      ) {
        result = true
      }

      return result
    },
    /**
     * 共有フォルダ判定
     *
     * @return {boolean} 判定値
     */
    shareFolderFlag() {
      let result = false

      if (
        this.selectStorageInfo.shareFlag === 1 &&
        this.selectStorageInfo.communityFlag === 0 &&
        this.selectStorageInfo.objectType === 1
      ) {
        result = true
      }

      return result
    },
    /**
     * 共有フォルダ メンバー招待項目 表示分岐
     *
     * @return {boolean} 表示判定用値
     */
    checkDialogTitle() {
      let result = false

      if (this.firstLayerFlag && this.shareFolderFlag) {
        result = true
      }

      return result
    },
    /**
     * 表示項目分岐
     *
     * @return {object} backListData 表示項目
     */
    setListData() {
      let backListData = []

      // 種別 フォルダ
      if (this.selectStorageInfo.objectType === 1) {
        backListData = [
          { text: 'ダウンロード', class: 'download' },
          { text: '名前の変更', class: 'name' },
          { text: 'ファイルフォルダを移動', class: 'dataMove' },
          { text: 'ピン留め', class: 'pin' },
          { text: '削除する', class: 'delete' },
        ]
      } else {
        // 種別 ファイル
        backListData = [
          { text: 'リンクのコピー', class: 'linkCopy' },
          { text: 'ダウンロード', class: 'download' },
          { text: '名前の変更', class: 'name' },
          { text: 'ファイルフォルダを移動', class: 'dataMove' },
          { text: 'ピン留め', class: 'pin' },
          { text: '削除する', class: 'delete' },
        ]
      }

      // 種別 共有フォルダ第一階層
      if (this.shareFolderFlag && this.firstLayerFlag) {
        backListData = [
          { text: 'リンクのコピー', class: 'linkCopy' },
          { text: 'ダウンロード', class: 'download' },
          { text: '名前の変更', class: 'name' },
          { text: 'ピン留め', class: 'pin' },
          { text: '削除する', class: 'delete' },
        ]
      }

      // 種別 共有フォルダ第二階層以下
      if (this.shareFolderFlag && !this.firstLayerFlag) {
        backListData = [
          { text: 'リンクのコピー', class: 'linkCopy' },
          { text: 'ダウンロード', class: 'download' },
          { text: '名前の変更', class: 'name' },
          { text: 'ファイルフォルダを移動', class: 'dataMove' },
          { text: 'ピン留め', class: 'pin' },
          { text: '削除する', class: 'delete' },
        ]
      }

      // 種別 ファイル+メッセージ連携
      if (
        this.selectStorageInfo.objectType === 2 &&
        this.selectStorageInfo.communityFlag === 1
      ) {
        backListData = [
          { text: 'リンクのコピー', class: 'linkCopy' },
          { text: 'ダウンロード', class: 'download' },
          { text: '名前の変更', class: 'name' },
          { text: 'ピン留め', class: 'pin' },
          { text: '削除する', class: 'delete' },
        ]
      }

      // 種別 フォルダ+メッセージ連携
      if (
        this.selectStorageInfo.objectType === 1 &&
        this.selectStorageInfo.communityFlag === 1
      ) {
        backListData = [
          { text: 'リンクのコピー', class: 'linkCopy' },
          { text: 'ダウンロード', class: 'download' },
          { text: 'ピン留め', class: 'pin' },
        ]
      }

      // 種別 ページ「削除」
      if (this.$route.path.includes('delete/')) {
        backListData = [
          { text: '元に戻す', class: 'undo' },
          { text: '削除', class: 'delete' },
        ]
      }

      return backListData
    },
  },
  created() {},
  methods: {
    ...mapMutations('storage/storageList', [
      'showStorageAddSharedMemberModal',
      'showStorageChangeNameModal',
      'showStorageLinkCopyModal',
      'showStorageDataMoveModal',
      'showStorageDeleteModal',
      'onMoveGetList',
      'updateDialogDeleteClick',
    ]),
    /**
     * ダイアログ 項目押下によるモーダル表示処理
     *
     * @param {string} modalSwitchName 分岐判定用テキスト
     */
    modalSwitchName(modalSwitchName) {
      if (modalSwitchName === 'delete') {
        this.showStorageDeleteModal()
        this.updateDialogDeleteClick(true)
      }

      if (modalSwitchName === 'undo') {
        this.updateStorageRestore()
      }

      if (modalSwitchName === 'linkCopy') {
        this.showStorageLinkCopyModal()
      }

      if (modalSwitchName === 'addSharedMember') {
        this.showStorageAddSharedMemberModal()
      }

      if (modalSwitchName === 'download') {
        this.$emit('storageDownload')
      }

      if (modalSwitchName === 'name') {
        this.showStorageChangeNameModal()
      }

      if (modalSwitchName === 'dataMove') {
        this.showStorageDataMoveModal()
      }

      if (modalSwitchName === 'pin') {
        this.$emit('updateStoragePin')
      }

      this.$emit('close')
    },
    /**
     *ストレージオブジェクトリストアAPI(元に戻す)
     */
    updateStorageRestore() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
        recordVersion: this.selectStorageInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateStorageRestore(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert(
              'ActionMsg_Gen15',
              'ストレージトップ'
            )
            this.onMoveGetList()
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
}
</script>

<style scoped lang="scss">
.change-form-status-dialog {
  position: absolute;
  width: 152px;
  padding: 16px;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  background: #ffffff;
  margin-left: -118px;
  z-index: 1;
  .title {
    margin: 0 -16px 16px;
    padding: 0 16px 16px;
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
  }
  .list {
    font-size: 15px;
    color: #1e1e1e;
    li {
      cursor: pointer;
      &:not(:last-child) {
        padding-bottom: 8px;
      }
    }
    .delete {
      color: #e60012;
    }
  }
}
</style>
