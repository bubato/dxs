<template>
  <div class="create-web-page">
    <div class="main-contents">
      <div class="header">
        <h2>ページ作成</h2>
      </div>
      <div class="contents">
        <p class="subText">
          Webサイトのページを作成・編集します。
          <a
            v-if="
              publishNowStatus.includes(createWebPageList.pageStatus) &&
              topPagePath !== ''
            "
            :href="topPagePath"
            class="link-text"
            target="_blank"
            >公開中のWebサイトを見る<OpenInNewSVG
              class="icon-blankLink icon-openInNew"
          /></a>
        </p>
        <div class="l-table">
          <div class="l-table-header">
            <p class="l-table-header-left">
              <span>
                <span v-for="(obj, index) in pathList" :key="obj">
                  {{ obj
                  }}<KeyboardArrowRightSVG
                    v-if="index < pathList.length - 1"
                    class="icon-arrowRight icon-keyboardArrowRight"
                  />
                </span>
              </span>
            </p>
            <div class="l-table-header-right">
              <button
                class="btn btn-delete"
                :disabled="
                  page.selectPageId === 0 ||
                  page.selectPageId === createWebPageList.id ||
                  page.publishStatus !== 0
                "
                @click="flg.showDeleteModal = true"
              >
                削除
              </button>
              <button
                class="btn btn-edit"
                :disabled="page.selectPageId === 0 || page.publishStatus !== 0"
                @click="showEditorPage()"
              >
                エディターで編集<OpenInNewSVG
                  class="icon-blankLink2 icon-openInNew"
                />
              </button>
            </div>
          </div>
          <div class="l-table-body">
            <div ref="cellW" class="l-table-body-levelBox is-first">
              <ListCell
                v-if="Object.keys(createWebPageList).length"
                class="l-table-body-cell"
                :data="createWebPageList"
                :arrow-flg="Array.isArray(createWebPageList.underContents)"
                :class="{
                  isAct: page.selectPage.first === createWebPageList.id,
                  isClickActiveCell: page.selectPageId === createWebPageList.id,
                }"
                level="first"
                :top-page-path="topPagePath"
                @click.native="
                  cellClick(
                    0,
                    0,
                    createWebPageList.id,
                    createWebPageList.publishStatus
                  )
                "
              />
            </div>
            <div class="l-table-body-levelBox is-second">
              <draggable
                v-model="secondList"
                tag="div"
                group="second"
                v-bind="dragOptions"
                ghost-class="ghost"
                :options="{
                  handle: '.icon-dehazeWrap',
                  setData: modifyDragItem,
                  forceFallback: true,
                }"
                @start="dragging($event)"
                @sort="updateWebPageList(createWebPageList.id, secondList)"
                @end="deleteGhost()"
              >
                <ListCell
                  v-for="(pageListData, index) in secondList"
                  :key="pageListData.id"
                  :class="{
                    isAct: page.selectPage.second === pageListData.id,
                    isClickActiveCell: page.selectPageId === pageListData.id,
                  }"
                  class="l-table-body-cell"
                  :data="pageListData"
                  :index="index"
                  :arrow-flg="Array.isArray(pageListData.underContents)"
                  :top-page-path="topPagePath"
                  @click.native="
                    cellClick(
                      index,
                      1,
                      pageListData.id,
                      pageListData.publishStatus
                    )
                  "
                />
              </draggable>
              <div
                v-if="Object.keys(createWebPageList).length"
                class="btn-createPage"
                @click="showCreateNewPageModal(2)"
              >
                <AddCircleSVG class="icon-createPage icon-addCircle" />
                ページを追加
              </div>
            </div>
            <div class="l-table-body-levelBox is-third">
              <draggable
                v-model="thirdList"
                tag="div"
                group="third"
                ghost-class="ghost"
                v-bind="dragOptions"
                :options="{
                  handle: '.icon-dehazeWrap',
                  setData: modifyDragItem,
                  forceFallback: true,
                }"
                @start="dragging($event)"
                @sort="updateWebPageList(page.selectPage.second, thirdList)"
                @end="deleteGhost()"
              >
                <ListCell
                  v-for="(pageListData, index) in thirdList"
                  :key="pageListData.id"
                  :class="{
                    isAct: page.selectPage.third === pageListData.id,
                    isClickActiveCell: page.selectPageId === pageListData.id,
                  }"
                  class="l-table-body-cell"
                  :data="pageListData"
                  :index="index"
                  :arrow-flg="false"
                  :top-page-path="topPagePath"
                  @click.native="
                    cellClick(
                      index,
                      2,
                      pageListData.id,
                      pageListData.publishStatus
                    )
                  "
                />
              </draggable>
              <div
                v-show="page.selectPage.second !== 0"
                class="btn-createPage"
                @click="showCreateNewPageModal(3)"
              >
                <AddCircleSVG class="icon-createPage icon-addCircle" />
                ページを追加
              </div>
              <div v-show="isDrug" id="drugDom" ref="drugDom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CommonFooter />
    <CreateWebPageModal
      v-if="flg.showEditSetComponentModal"
      :parent-id="getParentId(page.addPageSelectLevel)"
      :record-version="recordVersion"
      :level="page.addPageSelectLevel"
      @reflect="reflectComponentData()"
      @close="hideModal()"
    />
    <CreateWebPageDeleteModal
      v-if="flg.showDeleteModal"
      :select-page-id="page.selectPageId"
      :site-info-record-version="recordVersion"
      :page-record-version="getRecodeVersion(page.selectPageId)"
      @reflect="reflectComponentDataDelete()"
      @close="hideModal()"
    />
    <CreateWebPageNotMorePageModal
      v-if="flg.showNotMorePageModal"
      :select-page-id="page.selectPageId"
      @close="hideModal()"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import CommonFooter from '~/components/common/CommonFooter.vue'
import ListCell from '~/components/cms/createWebPage/CreateWebPageCell.vue'
import CreateWebPageModal from '~/components/cms/createWebPage/CreateWebPageModal.vue'
import CreateWebPageDeleteModal from '~/components/cms/createWebPage/CreateWebPageDeleteModal.vue'
import CreateWebPageNotMorePageModal from '~/components/cms/createWebPage/CreateWebPageNotMorePageModal.vue'

export default {
  layout: 'mainLayout',
  components: {
    CommonFooter,
    draggable,
    ListCell,
    CreateWebPageModal,
    CreateWebPageDeleteModal,
    CreateWebPageNotMorePageModal,
  },
  data() {
    return {
      limitPage: 3, // ページ作成上限数
      topPagePath: '', // 公開中のwebサイトのリンク
      publishNowStatus: [2, 3, 4], // 公開中を表すページステータス
      recordVersion: 0, // サイトのrecordVersion
      createWebPageList: {}, // 全てのページデータ
      secondList: [], // 第二階層以降の配列
      thirdList: [], // 第三改装の配列
      flg: {
        showEditSetComponentModal: false, // ページ追加モーダル
        showDeleteModal: false, // 削除モーダル
        showNotMorePageModal: false, // 新規ページ作成上限到達モーダル
      },
      page: {
        addPageSelectLevel: 2, // ページを追加する階層
        selectPageId: 0, // 選択しているページIDを取得
        publishStatus: 0,
        selectPage: {
          // トピックパス用に各階層にて選択しているIDを保持
          first: 0,
          second: 0,
          third: 0,
        },
      },
      selectIndex: {
        first: null,
        second: null,
        third: null,
      },
      isDrug: false,
    }
  },
  computed: {
    pathList() {
      const text = []
      for (const property in this.page.selectPage) {
        if (this.createWebPageList.id === this.page.selectPage[property]) {
          text.push(this.createWebPageList.name)
        } else {
          for (const obj1 in this.createWebPageList.underContents) {
            const obj1Data = this.createWebPageList.underContents[obj1]
            if (obj1Data.id === this.page.selectPage[property]) {
              text.push(obj1Data.name)
            } else {
              for (const obj2 in obj1Data.underContents) {
                const obj2Data = obj1Data.underContents[obj2]
                if (obj2Data.id === this.page.selectPage[property]) {
                  text.push(obj2Data.name)
                }
              }
            }
          }
        }
      }
      return text
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  created() {
    this.getCreateWebPage()
  },
  mounted() {},
  updated() {},
  methods: {
    getParentId(num) {
      switch (num) {
        case 2:
          return this.createWebPageList.id
        case 3:
          return this.page.selectPage.second
      }
    },
    getRecodeVersion(pageID) {
      if (this.createWebPageList.id === pageID) {
        return this.createWebPageList.recordVersion
      }
      if (Array.isArray(this.createWebPageList.underContents)) {
        for (const index2 in this.createWebPageList.underContents) {
          if (this.createWebPageList.underContents[index2].id === pageID) {
            return this.createWebPageList.underContents[index2].recordVersion
          }
          if (
            Array.isArray(
              this.createWebPageList.underContents[index2].underContents
            )
          ) {
            for (const index3 in this.createWebPageList.underContents[index2]
              .underContents) {
              if (
                this.createWebPageList.underContents[index2].underContents[
                  index3
                ].id === pageID
              ) {
                return this.createWebPageList.underContents[index2]
                  .underContents[index3].recordVersion
              }
            }
          }
        }
      }
      return 0
    },
    /**
     * 新規ページ作成モーダルを表示
     */
    showCreateNewPageModal(selectLevel) {
      this.page.addPageSelectLevel = selectLevel
      this.flg.showEditSetComponentModal = true
    },
    /**
     * ページの上限数確認 ph1では不要
     */
    isPageCreateLimit(num) {
      this.page.addPageSelectLevel = num
      this.flg.showEditSetComponentModal = true

      let pageCount = this.createWebPageList.underContents.length + 1
      for (const obj in this.createWebPageList.underContents) {
        if (
          Array.isArray(this.createWebPageList.underContents[obj].underContents)
        ) {
          pageCount += this.createWebPageList.underContents[obj].underContents
            .length
        }
      }

      if (this.limitPage > pageCount) {
        this.flg.showEditSetComponentModal = true
      } else {
        this.flg.showNotMorePageModal = true
      }
    },
    /**
     * FireFox以外は、ドラッグをカスタムするので、判定
     */
    isCustomDrugCheck() {
      const userAgent = window.navigator.userAgent.toUpperCase()
      if (userAgent.includes('firefox') || userAgent.includes('FIREFOX')) {
        // FireFox
        return true
      }
      return false
    },
    /**
     * draggableドラッグ時ゴーストの非表示対応
     */
    modifyDragItem(dataTransfer) {
      if (this.isCustomDrugCheck() === false) {
        const img = new Image()
        dataTransfer.setDragImage(img, 0, 0)
      }
    },
    /**
     * draggable start
     */
    dragging(evt) {
      document.addEventListener('drag', function (event) {
        if (this.isDrug === false) return
        document.getElementById('drugDomInner').style.transform =
          'translate(' + event.pageX + 'px, ' + event.pageY + 'px)'
        document.getElementById('drugDomInner').style.display = 'flex'
      })
      this.isDrug = true

      if (this.isCustomDrugCheck() === false) {
        this.$nextTick(() => {
          const druggingDom = evt.target.querySelector('.ghost').cloneNode(true)

          druggingDom.id = 'drugDomInner'
          druggingDom.classList.remove('ghost')
          this.$refs.drugDom.appendChild(druggingDom)
          druggingDom.style.width = this.$refs.cellW.clientWidth + 'px'
        })
      }
    },
    /**
     * draggable end
     */
    deleteGhost() {
      this.$refs.drugDom.innerHTML = ''
      this.isDrug = false
    },
    /**
     * 各ページセルクリック時のイベント
     */
    cellClick(index, level, selectedPageId, publishStatus) {
      this.page.publishStatus = publishStatus
      // 選択していた値のある場合初期化
      if (this.page.selectPageId === selectedPageId) {
        this.resetSelectData() // 選択情報のリセット
        return
      }

      this.page.selectPageId = selectedPageId
      this.page.selectPage.first = this.createWebPageList.id
      switch (level) {
        case 0:
          // 1階層目のクリック処理
          this.page.selectPage.second = 0
          this.page.selectPage.third = 0
          this.thirdList = []
          this.selectIndex.first = index
          break
        case 1:
          // 2階層目のクリック処理
          this.thirdList = Array.isArray(this.secondList[index].underContents)
            ? this.secondList[index].underContents
            : []
          this.page.selectPage.second = selectedPageId
          this.page.selectPage.third = 0
          this.selectIndex.second = index
          break
        case 2:
          // 3階層目のクリック処理

          // 初期表示時に3階層目をクリックした場合
          if (this.page.selectPage.second === 0) {
            this.page.selectPage.second = this.secondList[0].id
          }
          this.page.selectPage.third = selectedPageId
          this.selectIndex.third = index
          break
      }
    },
    /**
     * 削除ボタンのアクティブチェック
     */
    isDeleteBtnActive() {
      if (this.page.publishStatus === 0) {
        return true
      }
      if (
        this.page.selectPageId === 0 ||
        this.page.selectPageId === this.createWebPageList.id
      ) {
        return false
      } else {
        return true
      }
    },
    /**
     * モーダルの非表示
     */
    hideModal() {
      this.flg.showEditSetComponentModal = false
      this.flg.showDeleteModal = false
      this.flg.showNotMorePageModal = false
    },
    /**
     * 編集したコンポーネントデータを反映
     */
    reflectComponentData() {
      this.flg.showEditSetComponentModal = false
      this.getCreateWebPage()
    },
    /**
     * 選択情報のリセット
     */
    resetSelectData() {
      this.page.addPageSelectLevel = 2
      this.page.selectPageId = 0
      this.page.selectPage.first = 0
      this.page.selectPage.second = 0
      this.page.selectPage.third = 0
      this.thirdList = []
      this.selectIndex.first = null
      this.selectIndex.second = null
      this.selectIndex.third = null
    },
    /**
     * 削除確認モーダルを閉じ、データを再取得
     */
    reflectComponentDataDelete() {
      this.flg.showDeleteModal = false
      this.resetSelectData()
      this.getCreateWebPage()
    },
    /**
     * ページデータの取得
     */
    getCreateWebPage() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCreateWebPage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (Array.isArray(resData.data.pageListData.underContents)) {
              // pageStatusが9の場合は削除されたページのため、表示不要
              const filterData = resData.data.pageListData.underContents.filter(
                function (val) {
                  return val.pageStatus !== 9
                }
              )
              for (const obj in filterData) {
                if (Array.isArray(filterData[obj].underContents)) {
                  filterData[obj].underContents = filterData[
                    obj
                  ].underContents.filter(function (val3) {
                    return val3.publishStatus !== 9
                  })
                }
              }
              resData.data.pageListData.underContents = filterData
            } else {
              resData.data.pageListData.underContents = []
            }

            this.createWebPageList = resData.data.pageListData
            this.recordVersion = resData.data.siteInfo.recordVersion
            this.secondList = Array.isArray(
              this.createWebPageList.underContents
            )
              ? this.createWebPageList.underContents
              : []
            if (this.selectIndex.second !== null) {
              this.thirdList = Array.isArray(
                this.secondList[this.selectIndex.second].underContents
              )
                ? this.secondList[this.selectIndex.second].underContents
                : []
            }
            this.topPagePath = resData.data.topPagePath
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
     * ページ構成更新APIの実行(ドラッグ終了後、リストのソート)
     */
    updateWebPageList(parentId, dataList) {
      const paramData = this.getUpdateWebPageListParam(parentId, dataList)

      this.$common.addCallApiNum()
      this.$api
        .updateWebPageList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getCreateWebPage()
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
     * ページ構成更新APIのリクエストパラメータの取得
     * ドラッグ＆ドロップ並べ替え後のインデックスの順序を取得
     */
    getUpdateWebPageListParam(parentId, dataList) {
      const newDataList = dataList.map((obj) => {
        const newObj = {}
        newObj.id = obj.id
        newObj.recordVersion = obj.recordVersion
        return newObj
      })
      const paramData = {
        siteInfo: {
          recordVersion: this.recordVersion,
        },
        updateInfo: {
          parentPageId: parentId,
          contents: newDataList,
        },
      }

      return paramData
    },
    /**
     * エディターページに遷移
     */
    showEditorPage() {
      window.open(`/site/pages/edit/${this.page.selectPageId}`, '_blank')
    },
  },
  head() {
    return {
      title: 'ページ設定｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  position: relative;
}
.contents {
  margin-top: 8px;
}
.subText {
  margin-bottom: 33px;
}
.c-listBtn {
  display: flex;
  flex-wrap: wrap;
  &-cell {
    width: calc(25% - 16px);
    min-width: 185px;
    padding-right: 16px;
    padding-bottom: 16px;
    &:nth-child(4n + 1) {
      padding-left: 0;
    }
    &:nth-child(4n + 4) {
      padding-right: 0;
    }
  }
  &-link {
    display: block;
    width: 100%;
    background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    text-align: center;
    padding-top: 40px;
    img {
      display: block;
      margin: 0 auto;
      margin-bottom: 12px;
    }
  }
  &-label {
    padding-bottom: 50px;
    display: block;
    margin: 0 auto;
  }
}
/**
 * テキスト周り
 */
.main-contents-title {
  font-size: 28px;
  margin-bottom: 8px;
}
.link-text {
  display: inline-block;
  padding-left: 16px;
}

/**
 * テーブルレイアウト
 */
.l-table {
  min-width: 888px;
  &-header {
    background: #e2e3e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px 0 23px;
    width: 100%;
    height: 48px;
    &-left {
      display: flex;
      flex: 1;
      overflow: hidden;
      color: #8d8d8d;
      & > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-right {
      display: flex;
      padding: 8px 0;
      width: 220px;
      justify-content: flex-end;
    }
  }
  &-body {
    display: flex;
    min-height: 56+293px;
    margin-bottom: 64px;
    &-levelBox {
      box-sizing: border-box;
      width: calc(100% / 3);
      border-left: #e5e5e5 1px solid;
      border-bottom: #e5e5e5 1px solid;
      &:last-child {
        border-right: #e5e5e5 1px solid;
      }
    }
    .l-table-body-cell {
      display: flex;
      width: 100%;
      height: 56px;
      align-items: center;
      position: relative;
      border: #ffffff 1px solid;
      border-bottom: #e5e5e5 1px solid;
      background: #ffffff;
      cursor: pointer;
      &.ghost {
        visibility: hidden;
      }

      // 青背景設定のみ
      &.isAct {
        background: #f7f8f9;
        border: #f7f8f9 1px solid;
        border-bottom: #e5e5e5 1px solid;
      }
      // 青背景＋枠線。クリック時のスタイル
      &.isClickActiveCell {
        border: #007aff 1px solid;
      }
    }
  }
}

// ボタン
.btn {
  &-delete {
    padding: 6px 12px;
    background: #ffffff;
    border-radius: 4px;
    color: #1e1e1e;
    border: #f5f5f5 1px solid;
    margin-right: 8px;
    &:disabled {
      color: #b7b7b7;
      pointer-events: none;
    }
  }
  &-edit {
    display: flex;
    align-items: center;
    padding: 6px 8px 6px 12px;
    background: #4f7df0;
    pointer-events: auto;
    border-radius: 4px;
    color: #fff;
    &:disabled {
      background-color: #c6d5fa;
      pointer-events: none;
    }
  }
  &-createPage {
    padding: 18px 24px;
    cursor: pointer;
  }
}

// アイコン
.icon {
  &-pin {
    display: inline-block;
    transform: rotate(30deg);
    margin-left: 16px;
    fill: #1e1e1e;
  }
  &-blankLink2 {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    fill: #fff;
  }
  &-blankLink {
    display: inline-block;
    fill: #007aff;
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
  &-arrowRight {
    display: inline-block;
    width: 15px;
    fill: #8d8d8d;
  }
  &-addCircle {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-right: 10px;
  }
}

// drug&drop
#drugDom {
  width: 100%;
}
#drugDom > * {
  background: #fff;
  pointer-events: none;
  position: fixed;
  top: -30px;
  left: -23px;
  transform: translate(-100px, -100px);
  transition: transform 0.001s;
  transition-timing-function: ease-out;
  z-index: 999;
  opacity: 1;
  // 以下cellと同じスタイル設定
  display: none;
  width: calc(100% / 3);
  height: 56px;
  align-items: center;
  .cell-arrow-icon {
    display: block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-left: 12px;
  }
  .cell-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    fill: #34c759;
    &.is-disable {
      fill: #b0b3be;
    }
  }
  .cell-title {
    color: #1e1e1e;
    display: block;
  }
  .cell-status {
    font-size: 12px;
    width: 64px;
    padding: 3px;
    text-align: center;
    margin-left: 8px;
  }
}
</style>
