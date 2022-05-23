<template>
  <div class="storage-list-table">
    <div class="table-scroll">
      <table @dragenter="dragEnter">
        <thead>
          <tr
            :class="{
              pageShare: storageFirstLayer.includes('share'),
              pageDelete: storageFirstLayer.includes('delete'),
            }"
          >
            <th class="temptableCheckbox">
              <CustomInputCheckbox
                v-model="checkAll"
                value="all"
                :options="checkboxOptions"
                name="checkboxAll"
                @input="updateCheckAll()"
              />
            </th>
            <th class="objectName">
              名前
              <SortSpinner
                v-if="sortSpinnerDisplay"
                sort-id="objectName"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="modifiedUserName">
              更新者
              <SortSpinner
                v-if="sortSpinnerDisplay"
                sort-id="modifiedUserName"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th v-if="storageFirstLayer.includes('delete')" class="tempDelete">
              削除者名
            </th>
            <th class="modifiedAt">
              <template v-if="!storageFirstLayer.includes('delete')">
                更新日
              </template>
              <template v-else>削除日</template>
              <SortSpinner
                v-if="sortSpinnerDisplay"
                sort-id="modifiedAt"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th
              v-if="storageFirstLayer.includes('share')"
              class="numberOfPeopleShared"
            >
              共有メンバー
              <SortSpinner
                sort-id="numberOfPeopleShared"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="temptableSetting"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pathStorageObjectId !== null">
            <td colspan="6">
              <p class="backLink">
                <ToBackScreenLink
                  label="1つ上のフォルダに戻る"
                  @click="toBack()"
                />
              </p>
            </td>
          </tr>
          <tr
            v-for="(data, index) in storageList"
            :key="data.id"
            :class="{
              pageShare: storageFirstLayer.includes('share'),
              pageDelete: storageFirstLayer.includes('delete'),
              lineOne: index === 0 && uploadUpdateFlg,
            }"
          >
            <td class="temptableCheckbox">
              <CustomInputSingleCheckbox
                v-model="checkedConfirm[index]"
                :value="data.objectId"
                :options="setCheckboxOptions(data.objectId)"
                :is-disabled="getShareFolderConfirm(data)"
                name="inputCheckbox"
                @input="updateCheckVals()"
              />
            </td>
            <td class="objectName">
              <ul class="objectNameObject">
                <li
                  class="wrapObjectName"
                  :class="{
                    cursorPointer: !storageFirstLayer.includes('delete'),
                  }"
                  @click="dataNameClick(index)"
                >
                  <span class="kindsIcon">
                    <FolderSVG v-if="data.objectType === 1" /><img
                      v-else
                      class="fileIcon"
                      :src="
                        $common.getAssetsImgUrl(
                          getFileIconImgUrl(data.objectName)
                        )
                      "
                    />
                  </span>
                  <p class="link-text link-color-black">
                    {{ data.objectName }}
                  </p>
                </li>
                <li
                  v-if="!storageFirstLayer.includes('delete')"
                  class="wrapIconList"
                >
                  <ul class="iconList">
                    <li v-if="data.objectType === 1">
                      <p
                        v-if="data.shareFlag === 1 && data.communityFlag === 1"
                        class="icon-shared-folder community"
                      >
                        メッセージ
                      </p>
                      <p
                        v-else-if="
                          data.shareFlag === 1 && data.communityFlag === 0
                        "
                        class="icon-shared-folder"
                      >
                        共有フォルダ
                      </p>
                    </li>
                    <li
                      class="wrapIcon-pushPin"
                      :class="{ active: data.pinFlag }"
                    >
                      <PushPinSVG
                        class="icon-pushPin"
                        @mouseover="
                          $common.setAreaLabel(
                            $event,
                            'top',
                            pinText[data.pinFlag]
                          )
                        "
                        @mouseleave="$common.setAreaLabel($event, '', '')"
                        @click="updateStoragePin(index)"
                      />
                    </li>
                    <li class="wrapIcon-download">
                      <DownloadSVG
                        class="icon-download"
                        @mouseover="
                          $common.setAreaLabel($event, 'top', 'ダウンロード')
                        "
                        @mouseleave="$common.setAreaLabel($event, '', '')"
                        @click="downloadSelectStorageObject(data)"
                      />
                    </li>
                    <li class="wrapIcon-edit">
                      <EditSVG
                        v-if="data.communityFlag === 1 && data.objectType === 1"
                        class="icon-edit disabled"
                        @mouseover="
                          $common.setAreaLabel($event, 'top', '名前の変更')
                        "
                        @mouseleave="$common.setAreaLabel($event, '', '')"
                      />
                      <EditSVG
                        v-else
                        class="icon-edit"
                        @mouseover="
                          $common.setAreaLabel($event, 'top', '名前の変更')
                        "
                        @mouseleave="$common.setAreaLabel($event, '', '')"
                        @click="clickIconEdit(index)"
                      />
                    </li>
                  </ul>
                </li>
              </ul>
            </td>
            <td class="modifiedUserName">{{ data.modifiedUserName }}</td>
            <td v-if="storageFirstLayer.includes('delete')" class="tempDelete">
              {{ data.modifiedDeleteName }}
            </td>
            <td class="modifiedAt">
              <template v-if="storageFirstLayer.includes('delete')">{{
                data.logicalDeleteAt
              }}</template>
              <template v-else>{{ data.modifiedAt }}</template>
            </td>
            <td
              v-if="storageFirstLayer.includes('share')"
              class="numberOfPeopleShared"
            >
              <template v-if="data.numberOfPeopleShared"
                >{{ data.numberOfPeopleShared }}人</template
              >
              <template v-else>自分だけ</template>
            </td>
            <td class="temptableSetting">
              <SettingsSVG
                class="icon-settings"
                @mouseover="$common.setAreaLabel($event, 'top', 'メニュー')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @click="setSelectStorageStatus(index)"
              />
              <StorageMenuDialog
                v-if="
                  selectStorageType.index === index &&
                  Object.keys(selectStorageInfo).length > 0
                "
                v-on-clickaway="closeDialog"
                @updateStoragePin="updateStoragePin(index)"
                @storageDownload="
                  downloadSelectStorageObject(selectStorageInfo)
                "
                @close="closeDialog()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <StorageDeleteModal
      v-if="storageDeleteModalFlg"
      :storage-list="storageList"
      :checked-confirm="checkedConfirm"
      @close="hideStorageDeleteModal()"
    />
    <StorageAddSharedMember
      v-if="storageAddSharedMemberModalFlg"
      @close="hideStorageAddSharedMemberModal()"
    />
    <StorageChangeNameModal
      v-if="storageChangeNameModalFlg"
      :default-name-text="selectStorageInfo.tempfilename"
      @close="hideStorageChangeNameModal()"
    />
    <StorageLinkCopyModal
      v-if="storageLinkCopyModalFlg"
      @close="hideStorageLinkCopyModal()"
    />
    <StorageDataMoveModal
      v-if="storageDataMoveModalFlg"
      :storage-list="storageList"
      @close="hideStorageDataMoveModal()"
    />
    <StorageFileDragDrop
      v-if="storageFileDragDropFlg"
      @close="hideStorageFileDragDrop()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'StorageTable',
  mixins: [clickaway],
  props: {
    storageList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      checkboxOptions: [{ value: 'all' }],
      checkAll: [],
      checkVals: [],
      checkedConfirm: [],
      storageFirstLayer: '',
      selectStorageType: {
        index: -1,
        type: 'settings',
      },
      fileIconData: [
        {
          ext: ['doc', 'docx'],
          path: 'images/storage/icon/icon-word.png',
        },
        {
          ext: ['xls', 'xlsx'],
          path: 'images/storage/icon/icon-excel.png',
        },
        {
          ext: ['ppt', 'pptx'],
          path: 'images/storage/icon/icon-powerpoint.png',
        },
        {
          ext: ['pdf'],
          path: 'images/storage/icon/icon-pdf.png',
        },
        {
          ext: ['txt'],
          path: 'images/storage/icon/icon-txt.png',
        },
        {
          ext: ['zip'],
          path: 'images/storage/icon/icon-zip.png',
        },
        {
          ext: ['jpg', 'jpeg', 'gif', 'png', 'svg'],
          path: 'images/storage/icon/icon-img.png',
        },
        {
          ext: ['html', 'css', 'js', 'json'],
          path: 'images/storage/icon/icon-code.png',
        },
      ],
      otherFileIconPath: 'images/storage/icon/icon-other.png',
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    ...mapState('storage/storageList', [
      'storageDeleteModalFlg',
      'selectStorageInfo',
      'storageAddSharedMemberModalFlg',
      'storageChangeNameModalFlg',
      'storageLinkCopyModalFlg',
      'storageDataMoveModalFlg',
      'storageFileDragDropFlg',
      'selectSortType',
      'pathStorageObjectId',
      'breadcrumb',
      'pinText',
      'uploadUpdateFlg',
    ]),
    /**
     * ソートアイコン表示分岐
     *
     * @return {boolean} 判定値
     */
    sortSpinnerDisplay() {
      let backObj = false

      if (
        this.storageFirstLayer.includes('home') ||
        this.storageFirstLayer.includes('share') ||
        this.storageFirstLayer.includes('searchResults')
      ) {
        backObj = true
      }

      return backObj
    },
    /**
     * storageList数から共有フォルダを除いた値
     */
    storageListRemoveShredFolder() {
      let backNo = this.storageList.length

      for (const i in this.storageList) {
        if (this.getShareFolderConfirm(this.storageList[i])) {
          backNo--
        }
      }

      return backNo
    },
    /**
     * ファイルアイコンpath設定
     *
     * @param {string} objectName オブジェクト名
     * @return {string} アイコン画像path
     */
    getFileIconImgUrl() {
      return (objectName) => {
        const ext =
          objectName.split('.').length > 1
            ? objectName.split('.').slice(-1)[0]
            : ''
        let imgUrl = ''

        if (ext.length > 0) {
          const targetData = this.fileIconData.find((data) =>
            data.ext.includes(ext)
          )

          imgUrl = targetData ? targetData.path : this.otherFileIconPath
        } else {
          imgUrl = this.otherFileIconPath
        }

        return imgUrl
      }
    },
  },
  watch: {
    checkVals(flg) {
      this.updateCheckedFlg(flg.length > 0)
    },
    storageList() {
      this.checkboxAllReset()
    },
  },
  created() {
    this.checkboxAllReset()
    this.setStorageFirstLayer()
  },
  methods: {
    ...mapMutations('storage/storageList', [
      'setSelectStorageInfo',
      'hideStorageAddSharedMemberModal',
      'hideStorageDeleteModal',
      'showStorageChangeNameModal',
      'hideStorageChangeNameModal',
      'hideStorageLinkCopyModal',
      'hideStorageDataMoveModal',
      'showStorageFileDragDrop',
      'hideStorageFileDragDrop',
      'setSelectSortType',
      'onMoveGetList',
      'updateCheckedFlg',
    ]),
    /**
     * 共有フォルダ確認
     *
     * @param {Object} data 項目一覧
     * @return {boolean} 共有フォルダかつオブジェクト種別がフォルダの場合trueを戻す
     */
    getShareFolderConfirm(data) {
      let backValue = false

      if (
        data.shareFlag === 1 &&
        data.objectType === 1 &&
        data.communityFlag === 1
      ) {
        backValue = true
      }

      return backValue
    },
    /**
     * ソート処理
     *
     * @param {Object} sortData order:昇順降順 sort:ソート対象項目
     */
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setSelectSortType(newSelectSortType)
      this.onMoveGetList()
    },
    /**
     * アイコン「名前変更」押下処理
     *
     * @param {Number} index 押下番号
     */
    clickIconEdit(index) {
      this.setSelectStorageInfo(this.storageList[index])
      this.showStorageChangeNameModal()
    },
    /**
     * ダイアログアイコン押下によるメニュー表示
     *
     * @param {Number} index ダイアログ表示順
     */
    setSelectStorageStatus(index) {
      if (index === this.selectStorageType.index) {
        this.closeDialog()
      } else {
        this.setSelectStorageInfo(this.storageList[index])
        this.selectStorageType = {
          index,
        }
      }
    },
    /**
     * ダイアログを閉じる
     */
    closeDialog() {
      this.selectStorageType = {
        index: -1,
        type: '',
      }
    },
    /**
     * 「storage/」直下のフォルダ名を設定
     */
    setStorageFirstLayer() {
      this.storageFirstLayer = this.$route.path
        .split('storage/')[1]
        .split('/')[0]
    },
    /**
     * リンク「1つ上に戻る」
     */
    toBack() {
      this.$router.push(this.breadcrumb.slice(-2)[0].pass)
    },
    /**
     * チェックボックスオプション
     *
     * @param {number} objectId ストレージオブジェクトID
     * @return {object} value:ストレージオブジェクトID
     */
    setCheckboxOptions(objectId) {
      return [{ value: objectId }]
    },
    /**
     * チェックボックス通常 チェック判定
     *
     * @param {boolean} val チェック済判定
     */
    checkboxCheckConfirm(val) {
      this.checkedConfirm = []

      for (let i = 0; i < this.storageList.length; i++) {
        if (this.getShareFolderConfirm(this.storageList[i])) {
          this.checkedConfirm.push(false)
        } else {
          this.checkedConfirm.push(val)
        }
      }
    },
    /**
     * チェックボックス通常 チェック切り替え
     */
    checkboxCheck() {
      this.checkVals = []

      for (const i in this.storageList) {
        if (this.checkedConfirm[i]) {
          this.checkVals.push(this.storageList[i].objectId)
        }
      }
    },
    /**
     * チェックボックスすべて 非アクティブ時動作
     */
    checkboxAllNoneCheck() {
      this.checkboxCheckConfirm(false)
      this.checkboxCheck()
    },
    /**
     * チェックボックス 全チェック
     */
    checkboxAllCheck() {
      this.checkAll = ['all']
      this.checkboxCheckConfirm(true)
      this.checkboxCheck()
    },
    /**
     * チェックボックス 全リセット
     */
    checkboxAllReset() {
      this.checkAll = []
      this.checkVals = []
      this.checkboxCheckConfirm(false)
    },
    /**
     * チェックボックス すべて押下
     */
    updateCheckAll() {
      if (this.checkAll[0]) {
        this.checkboxAllCheck()
      } else {
        this.checkboxAllNoneCheck()
      }
    },
    /**
     * チェックボックス 通常押下
     */
    updateCheckVals() {
      this.checkboxCheck()
      let checkedConfirmTrueLength = 0

      for (const i in this.checkedConfirm) {
        if (this.checkedConfirm[i]) checkedConfirmTrueLength++
      }

      if (checkedConfirmTrueLength === this.storageListRemoveShredFolder) {
        this.checkAll = ['all']
      } else {
        this.checkAll = []
      }
    },
    /**
     * ボタン「ダウンロード」押下ファイルをダウンロード
     */
    storageDownload() {
      if (this.checkVals.length === 1) {
        for (const i in this.storageList) {
          if (this.checkedConfirm[i]) {
            this.downloadSelectStorageObject(this.storageList[i])
          }
        }
      } else {
        this.downloadCheckStorageObjects()
      }
    },
    /**
     * チェックボックス チェックindexを戻す
     *
     *  @return {number} チェック済み番号
     */
    getCheckedIndex() {
      let index

      for (const i in this.checkedConfirm) {
        if (this.checkedConfirm[i]) index = i
      }

      return index
    },
    /**
     * 選択したファイル名の取得
     *
     * @param {Object} selectObjectData 選択データ
     * @return {string} 選択したファイル名
     */
    getSelectFileName(selectObjectData) {
      let downloadFileName = ''
      const checkObjectType = selectObjectData.objectType

      // フォルダの場合はzipファイルとして保存。ファイルの場合は選択したファイルのファイル名として保存
      if (checkObjectType === 1) {
        downloadFileName =
          this.masterData.tenantId +
          '_storage_' +
          this.$common.getFormatCurrentDate('YYYYMMDD') +
          '.zip'
      } else if (checkObjectType === 2) {
        downloadFileName = selectObjectData.objectName
      }

      return downloadFileName
    },
    /**
     * 選択したオブジェクトのダウンロード(ダウンロードURL取得API)
     *
     * @param {Object} selectObjectData 選択データ
     */
    downloadSelectStorageObject(selectObjectData) {
      const paramData = {
        id: String(selectObjectData.objectId),
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageDownload(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const downloadFileName = this.getSelectFileName(selectObjectData)

            this.$common.downloadFile(
              resData.data.downloadURL,
              downloadFileName
            )
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
     * 選択した項目の一括ダウンロード(ダウンロードURL取得API)
     */
    downloadCheckStorageObjects() {
      const paramData = {
        id: this.checkVals.join(','),
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageDownload(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const downloadFileName =
              this.masterData.tenantId +
              '_storage_' +
              this.$common.getFormatCurrentDate('YYYYMMDD') +
              '.zip'

            this.$common.downloadFile(
              resData.data.downloadURL,
              downloadFileName
            )
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
     * オブジェクトピン留めAPI
     *
     * @param {Number} setNumber ストレージオブジェクトID
     */
    updateStoragePin(setNumber) {
      const paramData = {
        id: this.storageList[setNumber].objectId,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateStoragePin(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
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
    /**
     * 行クリック
     *
     * @param {number} index クリック値
     */
    dataNameClick(index) {
      if (this.storageFirstLayer.includes('delete')) return false

      if (this.storageList[index].objectType === 1) {
        this.$router.push(
          '/storage/home/' + this.storageList[index].objectId + '/'
        )
      } else {
        this.downloadSelectStorageObject(this.storageList[index])
      }
    },
    /**
     * テーブルへのファイルドラッグ
     */
    dragEnter() {
      if (this.storageFirstLayer.includes('home')) {
        this.showStorageFileDragDrop()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.storage-list-table {
  .table-scroll {
    table {
      min-width: 1036px;
      tbody {
        tr {
          height: 48px;
        }
      }
      tr {
        th,
        td {
          &.temptableCheckbox,
          &.temptableSetting {
            width: 47px;
            max-width: 47px;
          }
          &.objectName {
            min-width: 595px;
          }
          &.modifiedUserName {
            min-width: 207px;
          }
          &.modifiedAt {
            min-width: 140px;
          }
        }
      }
      .lineOne {
        animation: 0.8s ease 0s 1 normal none running lineOneFadeIn;
      }
      @keyframes lineOneFadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      .pageShare {
        th,
        td {
          &.temptableCheckbox,
          &.temptableSetting {
            width: 47px;
            max-width: 47px;
          }
          &.objectName {
            min-width: 479px;
          }
          &.modifiedUserName {
            min-width: 204px;
          }
          &.modifiedAt {
            min-width: 142px;
          }
          &.numberOfPeopleShared {
            min-width: 126px;
          }
        }
      }
      .pageDelete {
        th,
        td {
          &.temptableCheckbox,
          &.temptableSetting {
            width: 47px;
            max-width: 47px;
          }
          &.objectName {
            min-width: 479px;
          }
          &.modifiedUserName {
            min-width: 119px;
          }
          &.tempDelete {
            min-width: 211px;
          }
          &.modifiedAt {
            min-width: 142px;
          }
        }
      }
      &::v-deep .custom-input-single-checkbox {
        .is-disabled {
          p::before {
            background: #cdced0;
          }
        }
      }
      &::v-deep .custom-input-checkbox .checkbox_list label p {
        padding: 0;
      }
      .objectNameObject {
        display: flex;
        .kindsIcon {
          padding-right: 8px;
          .fileIcon {
            width: 24px;
            height: 24px;
          }
        }
        .wrapObjectName {
          display: flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cursorPointer {
          cursor: pointer;
        }
        .wrapIconList {
          margin-left: auto;
          padding: 0 13px;
          li:not(:last-child) {
            margin-right: 10px;
          }
          .wrapIcon-pushPin {
            svg {
              cursor: pointer;
              transform: rotate(30deg);
            }
            &.active {
              svg {
                fill: #4f7df0;
              }
            }
          }
          .wrapIcon-edit svg,
          .wrapIcon-download svg {
            cursor: pointer;
          }
          .wrapIcon-edit {
            .icon-edit.disabled {
              cursor: default;
              opacity: 0.3;
            }
          }
        }
        .iconList {
          display: flex;
          .icon-shared-folder {
            border: 1px solid #4f7df0;
            color: #4f7df0;
            font-size: 12px;
            padding: 2px 6px;
            text-align: center;
            vertical-align: middle;
            &.community {
              padding: 2px 12px;
            }
          }
        }
      }
      .temptableSetting svg {
        cursor: pointer;
      }
      .backLink {
        margin: -6px 0 0 10px;
        color: #007aff;
        a {
          margin-left: 11px;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
