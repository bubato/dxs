<template>
  <div class="main">
    <EditorHeader />
    <div class="contents siteEditPage">
      <EditorSettings />
      <div
        class="main-container"
        :class="[
          { 'exe-scroll': showScrollbarFlg },
          { open: showSettingMenuFlg },
        ]"
      >
        <ViewArea v-if="showViewAreaFlg" view-mode="editor" />
      </div>
    </div>
    <div
      class="hidden_sidebar"
      :class="[{ 'exe-scroll': showScrollbarFlg }]"
    ></div>
    <EditSetComponentModal
      v-if="showEditSetComponentModalFlg"
      @reflect="reflectComponentData()"
      @close="hideEditSetComponentModal()"
    />
    <SaveCustomPartsComponentModal
      v-if="showSaveCustomPartsComponentModalState"
      @reflect="getCustomPartsList()"
      @close="setShowSaveCustomPartsComponentModalState(false)"
    />
    <DeletePartsModal
      v-if="showDeleteEditorPartsModalFlg"
      @delete="deleteEditorParts()"
      @close="hideDeleteEditorPartsModal()"
    />
    <CheckPagePublishModal
      v-if="showCheckPagePublishModalState"
      @close="setShowCheckPagePublishModalState(false)"
    />
    <CompletePagePublishModal
      v-if="showCompletePagePublishModalState"
      @close="setShowCompletePagePublishModalState(false)"
    />
    <ErrorRequestDataSizeModal
      v-if="showErrorRequestDataSizeModalState"
      @close="setShowErrorRequestDataSizeModalState(false)"
    />
    <CompletePopAlert />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="exeCancelEdit()"
      @close="hideCancelEditModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import EditorHeader from '~/components/cms/editor/EditorHeader.vue'
import EditorSettings from '~/components/cms/editor/EditorSettings.vue'
import ViewArea from '~/components/cms/editor/ViewArea.vue'

export default {
  layout: 'default',
  components: {
    EditorHeader,
    EditorSettings,
    ViewArea,
  },
  data() {
    return {
      showViewAreaFlg: false,
      timer: {},
      showScrollbarFlg: false,
      companyProfile: {},
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    ...mapState('cms/editorStore', [
      'editorData',
      'viewComponentList',
      'initComponentsJson',
      'showEditSetComponentModalFlg',
      'editComponentModalData',
      'showSettingMenuFlg',
      'showDeleteEditorPartsModalFlg',
      'selectDeleteEditorInfo',
      'companyData',
      'initIndustryToImageDataJson',
      'updateCmsDataFlg',
      'showCheckPagePublishModalState',
      'showCompletePagePublishModalState',
      'showErrorRequestDataSizeModalState',
      'showSaveCustomPartsComponentModalState',
      'getCustomPartsListFlg',
    ]),
  },
  watch: {
    updateCmsDataFlg(newValue) {
      if (newValue) {
        this.getCmsEditorData()
        this.setUpdateCmsDataFlg(false)
      }
    },
    getCustomPartsListFlg(newValue) {
      if (newValue) {
        this.getCustomPartsList() // カスタムパーツリストの取得
        this.setGetCustomPartsListFlg(false)
      }
    },
  },
  created() {
    this.getCmsEditorComponentParts() // サイドメニューのコンポーネントパーツ
    this.getFormList()
    this.getCustomPartsList() // カスタムパーツリストの取得
    this.setInitComponent() // 初期値設定
    this.getInitCompany()
  },
  mounted() {
    document
      .querySelector('.main-container')
      .addEventListener('scroll', this.showScrollbar)
  },
  methods: {
    ...mapMutations('common', ['hideCancelEditModal']),
    ...mapMutations('cms/editorStore', [
      'setComponentParts',
      'setEditorData',
      'setDesignTemplate',
      'setSiteColor',
      'setViewComponentList',
      'showEditSetComponentModal',
      'hideEditSetComponentModal',
      'setInitComponentsJson',
      'hideDeleteEditorPartsModal',
      'setImage',
      'setInitOneLineNewsDate',
      'setUpdateCmsDataFlg',
      'setCurrentSettingPageUrl',
      'setShowCheckPagePublishModalState',
      'setShowCompletePagePublishModalState',
      'setEditorFormList',
      'setShowErrorRequestDataSizeModalState',
      'setShowSaveCustomPartsComponentModalState',
      'setCustomPartsList',
      'setGetCustomPartsListFlg',
      'setPageListData',
      'setTopPagePath',
    ]),
    showScrollbar() {
      this.showScrollbarFlg = true
      // timer解除
      clearTimeout(this.timer)
      this.timer = setTimeout(
        function () {
          this.showScrollbarFlg = false
        }.bind(this),
        '1000'
      )
    },
    /**
     * エディタ、ワンラインニュース、企業情報、業種ごとメインエリアコンバージョン背景画像、初期値の設定
     */
    setInitComponent() {
      let newInitComponentsJson = JSON.parse(
        JSON.stringify(this.initComponentsJson)
      )
      newInitComponentsJson = this.setInitOneLineNews(newInitComponentsJson)
      this.setInitComponentsJson(newInitComponentsJson)
    },
    /**
     * ワンラインニュース初期値の設定
     */
    setInitOneLineNews(newInitComponentsJson) {
      newInitComponentsJson.setComponent.oneLineNews.date = dayjs(
        new Date()
      ).format('YYYY/MM/DD')
      return newInitComponentsJson
    },
    /**
     * 企業情報初期値取得・設定
     */
    getInitCompany() {
      const paramData = {}
      this.$common.addCallApiNum()
      this.$api
        .getCompanyData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const newInitComponentsJson = JSON.parse(
              JSON.stringify(this.initComponentsJson)
            )
            this.companyProfile = resData.data.profile

            this.setInitCompany(
              newInitComponentsJson.setComponent.companyOverview,
              this.companyProfile
            )
            this.setInitComponentsJson(newInitComponentsJson)
            this.getCmsEditorData() // エディター画面の表示データ
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
     * 企業情報初期値の設定
     *
     * @param {object} companyData 設定対象の企業概要データ
     * @param {object} val 設定元の企業概要データ
     */
    setInitCompany(companyData, val) {
      // 会社概要初期値
      companyData.companyName = val.basicSettings.name
      companyData.representativeName =
        val.basicSettings.lastName + val.basicSettings.firstName
      companyData.representativeNumber = val.basicSettings.tel
      companyData.headquartersPostalCode = val.basicSettings.postCode
      companyData.headquartersLocation1 = this.$common.getVersatileItem(
        17,
        val.basicSettings.addressState,
        'value'
      )
      companyData.headquartersLocation2 = val.basicSettings.addressCity
      companyData.headquartersLocation3 = val.basicSettings.addressLine1
      companyData.headquartersLocation4 = val.basicSettings.addressLine2
      companyData.officer = val.detail.officer
      companyData.foundingDate = val.detail.foundedY + '/' + val.detail.foundedM
      companyData.numberOfEmployees = this.$common.getVersatileItem(
        8,
        val.detail.numberOfEmployees,
        'value'
      )
      companyData.capital = val.detail.capital
      companyData.businessContent = val.detail.businessContent

      return companyData
    },
    /**
     * サイドメニューのコンポーネントパーツの取得
     */
    getCmsEditorComponentParts() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCmsEditorComponentParts(paramData)
        .then((resData) => {
          this.setComponentParts(resData.data)
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * フォーム一覧の取得
     */
    getFormList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getFormList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setEditorFormList(resData.data.formList)
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
     * カスタムパーツの取得
     */
    getCustomPartsList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCustomPartsList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setCustomPartsList(resData.data.partsList)
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
     * エディター画面の表示データの取得
     */
    getCmsEditorData() {
      const paramData = {
        id: Number(this.$route.params.pageId),
      }

      this.$common.addCallApiNum()
      this.$api
        .getCmsEditorData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const editorData = this.setNullInitData(resData.data)

            this.setEditorData(editorData)
            this.setPageListData(editorData.pageListData)
            this.setTopPagePath()
            this.setPageUrl() // 現在編集中のページのURL設定
            this.setDesignTemplate(editorData.templateImageId)
            this.setSiteColor(editorData.colorId)
            this.setViewComponentList(editorData.componentList)
            this.setIndustryToImageData(editorData.industry)
            this.showViewAreaFlg = true

            if (editorData.publishStatus === 9) {
              this.setShowCheckPagePublishModalState(true)
            }
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$nextTick(() => {
            this.$common.subCallApiNum()
          })
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * nullが返ってきたデータの初期値設定
     *
     * @param {object} editorData 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(editorData) {
      this.$common.setNullConvertStringValue(editorData.pageProperty, [])
      this.$common.setNullConvertStringValue(editorData.publishingSettings, [])

      editorData.pageProperty.showHeader =
        editorData.pageProperty.showHeader || false
      editorData.pageProperty.showFooter =
        editorData.pageProperty.showFooter || false

      const companyOverviewData = editorData.componentList.find(
        (data) => data.id === 'companyOverview'
      )

      if (
        companyOverviewData &&
        Object.prototype.hasOwnProperty.call(companyOverviewData, 'initFlag')
      ) {
        this.setInitCompany(companyOverviewData, this.companyProfile)
        delete companyOverviewData.initFlag
      }

      this.setInitImage(editorData) // トップページの初期設定画像パスの設定

      return editorData
    },
    /**
     * トップページの初期画像の設定
     *
     * @param {object} editorData 対象のオブジェクト
     */
    setInitImage(editorData) {
      const hasImageIdList = [
        'mainArea',
        'conversion',
        'textWithTopImages',
        'textWithLeftAndRightImages',
        'customerVoice',
        'image',
      ]

      for (let i = 0; i < editorData.componentList.length; i++) {
        if (editorData.componentList[i].componentKind === 'layoutComponent') {
          for (
            let j = 0;
            j < editorData.componentList[i].componentList.length;
            j++
          ) {
            for (
              let k = 0;
              k < editorData.componentList[i].componentList[j].length;
              k++
            ) {
              if (
                editorData.componentList[i].componentList[j][k].id === 'image'
              ) {
                editorData.componentList[i].componentList[j][
                  k
                ].image = editorData.componentList[i].componentList[j][
                  k
                ].image.replace(
                  '@@images-domain@@',
                  this.$common.getVersatileItemInformation(21)
                )
              }
            }
          }
        } else if (
          ['setComponent', 'singleComponent'].includes(
            editorData.componentList[i].componentKind
          )
        ) {
          if (hasImageIdList.includes(editorData.componentList[i].id)) {
            if (hasImageIdList.includes(editorData.componentList[i].id)) {
              if (
                ['mainArea', 'conversion'].includes(
                  editorData.componentList[i].id
                )
              ) {
                editorData.componentList[
                  i
                ].backgroundImage = editorData.componentList[
                  i
                ].backgroundImage.replace(
                  '@@images-domain@@',
                  this.$common.getVersatileItemInformation(21)
                )
              } else if (
                ['textWithTopImages', 'textWithLeftAndRightImages'].includes(
                  editorData.componentList[i].id
                )
              ) {
                for (
                  let j = 0;
                  j < editorData.componentList[i].images.length;
                  j++
                ) {
                  editorData.componentList[i].images[
                    j
                  ].image = editorData.componentList[i].images[j].image.replace(
                    '@@images-domain@@',
                    this.$common.getVersatileItemInformation(21)
                  )
                }
              } else if (editorData.componentList[i].id === 'customerVoice') {
                for (
                  let j = 0;
                  j < editorData.componentList[i].contents.length;
                  j++
                ) {
                  editorData.componentList[i].contents[
                    j
                  ].image = editorData.componentList[i].contents[
                    j
                  ].image.replace(
                    '@@images-domain@@',
                    this.$common.getVersatileItemInformation(21)
                  )
                }
              } else if (editorData.componentList[i].id === 'image') {
                editorData.componentList[i].image = editorData.componentList[
                  i
                ].image.replace(
                  '@@images-domain@@',
                  this.$common.getVersatileItemInformation(21)
                )
              }
            }
          }
        }
      }
    },
    /**
     * ページURLを表示
     */
    setPageUrl() {
      const topPagePath = this.editorData.topPagePath
      const pageId = Number(this.$route.params.pageId)
      let pageUrl = ''
      let rootPath = ''
      const pageList = this.editorData.pageListData.underContents

      if (this.$common.checkArrayValue(pageList)) {
        for (let i = 0; i < pageList.length; i++) {
          if (rootPath) {
            break
          }
          if (pageList[i].id === pageId) {
            rootPath = pageList[i].path.slice(1)
            break
          }
          if (this.$common.checkArrayValue(pageList[i].underContents)) {
            for (let j = 0; j < pageList[i].underContents.length; j++) {
              if (pageList[i].underContents[j].id === pageId) {
                rootPath = pageList[i].underContents[j].path.slice(1)
                break
              }
            }
          }
        }
      }

      pageUrl = topPagePath + rootPath

      this.setCurrentSettingPageUrl(pageUrl)
    },
    /**
     * 編集したコンポーネントデータを反映
     */
    reflectComponentData() {
      const newComponentList = JSON.parse(
        JSON.stringify(this.viewComponentList)
      )
      const index = this.editComponentModalData.selectComponentInfo.index
      const parentIndex = this.editComponentModalData.selectComponentInfo
        .parentIndex
      const layoutIndex = this.editComponentModalData.selectComponentInfo
        .layoutIndex
      const componentKind = this.editComponentModalData.selectComponentInfo
        .componentKind

      if (componentKind === 'setComponent') {
        newComponentList[index] = this.editComponentModalData.targetComponent
      } else if (componentKind === 'layoutComponent') {
        newComponentList[index] = this.editComponentModalData.targetComponent
      } else if (componentKind === 'singleComponent') {
        if (layoutIndex) {
          newComponentList[parentIndex].componentList[layoutIndex][
            index
          ] = this.editComponentModalData.targetComponent
        } else {
          newComponentList[index] = this.editComponentModalData.targetComponent
        }
      }

      this.setViewComponentList(newComponentList)
      this.hideEditSetComponentModal()
    },
    deleteEditorParts() {
      const newComponentList = JSON.parse(
        JSON.stringify(this.viewComponentList)
      )

      if (this.selectDeleteEditorInfo.parentIndex) {
        newComponentList[this.selectDeleteEditorInfo.parentIndex].componentList[
          this.selectDeleteEditorInfo.layoutIndex
        ].splice(this.selectDeleteEditorInfo.index, 1)
      } else {
        newComponentList.splice(this.selectDeleteEditorInfo.index, 1)
      }

      this.setViewComponentList(newComponentList)
    },
    /**
     * 業種毎設定画像初期値の設定
     *
     * @param {string} industryCode 業種コード
     */
    setIndustryToImageData(industryCode) {
      const newInitComponentsJson = JSON.parse(
        JSON.stringify(this.initComponentsJson)
      )

      newInitComponentsJson.setComponent.mainArea.backgroundImage = this.initIndustryToImageDataJson[
        industryCode
      ].replace(
        '@@images-domain@@',
        this.$common.getVersatileItemInformation(21)
      )
      newInitComponentsJson.setComponent.conversion.backgroundImage = this.initIndustryToImageDataJson[
        industryCode
      ].replace(
        '@@images-domain@@',
        this.$common.getVersatileItemInformation(21)
      )

      this.setInitComponentsJson(newInitComponentsJson)
    },
    /**
     * パーツ編集モーダルと編集破棄確認モーダルを非表示
     */
    exeCancelEdit() {
      this.hideEditSetComponentModal()
      this.hideCancelEditModal()
    },
  },
  head() {
    return {
      title: this.editorData.pageProperty
        ? this.editorData.pageProperty.title + 'ページ編集｜Webサイト｜bizskyDX'
        : 'ページ編集｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  min-width: 1024px;
  .contents {
    height: calc(100vh - 64px);
    display: flex;
    background: #f8f8fa;
    .main-container {
      width: calc(100% - 43px);
      height: 100%;
      padding: 32px 40px;
      overflow: auto;
      &.open {
        width: calc(100% - 520px);
      }
    }
  }
  .hidden_sidebar {
    height: calc(100vh - 64px);
    &:not(.exe-scroll) {
      background: #f8f8fa;
    }
  }
}
</style>
