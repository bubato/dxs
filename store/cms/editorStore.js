import initComponentsJson from '~/static/cms/editor/initComponentParts.json'
import initIndustryToImageDataJson from '~/static/cms/editor/initIndustryToImageData.json' // 業種ごとメインエリアコンバージョン背景画像初期値

const getDefaultState = () => {
  return {
    showSettingMenuFlg: true,
    selectSettingTab: 1,
    editorData: {},
    designTemplate: '1',
    siteColor: '1',
    industry: '',
    componentParts: [],
    viewComponentList: [],
    dragComponent: {},
    dragFlg: false, // drag状態判定
    initComponentsJson,
    initIndustryToImageDataJson,
    showEditSetComponentModalFlg: false,
    editComponentModalData: {},
    targetComponent: {},
    selectDeleteEditorInfo: {
      parentIndex: null,
      layoutIndex: null,
      index: null,
    },
    showDeleteEditorPartsModalFlg: false,
    updateCmsDataFlg: false,
    currentSettingPageUrl: '',
    checkPublishType: 'init',
    showCheckPagePublishModalState: false,
    showCompletePagePublishModalState: false,
    editorFormList: [],
    maxRequestDataSize: 9000000,
    showErrorRequestDataSizeModalState: false,
    showSaveCustomPartsComponentModalState: false,
    selectComponentParts: {},
    customPartsList: [],
    getCustomPartsListFlg: false,
    pageListData: null,
    topPagePath: '',
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  showSettingMenu(state) {
    state.showSettingMenuFlg = true
  },
  hideSettingMenu(state) {
    state.showSettingMenuFlg = false
  },
  changeSelectSettingTab(state, val) {
    state.selectSettingTab = val
  },
  setEditorData(state, val) {
    state.editorData = val
  },
  setDesignTemplate(state, val) {
    state.designTemplate = val
  },
  setSiteColor(state, val) {
    state.siteColor = val
  },
  setInitComponentsJson(state, val) {
    state.initComponentsJson = val
  },
  setComponentParts(state, val) {
    state.componentParts = val
  },
  setViewComponentList(state, val) {
    state.viewComponentList = val
  },
  setDragComponent(state, val) {
    state.dragComponent = val
  },
  setDragFlg(state, val) {
    state.dragFlg = val
  },
  showEditSetComponentModal(state) {
    state.showEditSetComponentModalFlg = true
  },
  hideEditSetComponentModal(state) {
    state.showEditSetComponentModalFlg = false
  },
  setEditComponentModalData(state, val) {
    state.editComponentModalData = val
  },
  setTargetComponent(state, val) {
    state.targetComponent = val
  },
  showDeleteEditorPartsModal(state) {
    state.showDeleteEditorPartsModalFlg = true
  },
  hideDeleteEditorPartsModal(state) {
    state.showDeleteEditorPartsModalFlg = false
  },
  setSelectDeleteEditorInfo(state, val) {
    state.selectDeleteEditorInfo = val
  },
  setUpdateCmsDataFlg(state, val) {
    state.updateCmsDataFlg = val
  },
  setCurrentSettingPageUrl(state, val) {
    state.currentSettingPageUrl = val
  },
  setCheckPublishType(state, val) {
    state.checkPublishType = val
  },
  setShowCheckPagePublishModalState(state, val) {
    state.showCheckPagePublishModalState = val
  },
  setShowCompletePagePublishModalState(state, val) {
    state.showCompletePagePublishModalState = val
  },
  setEditorFormList(state, val) {
    state.editorFormList = val
  },
  setShowErrorRequestDataSizeModalState(state, val) {
    state.showErrorRequestDataSizeModalState = val
  },
  setShowSaveCustomPartsComponentModalState(state, val) {
    state.showSaveCustomPartsComponentModalState = val
  },
  setSelectComponentParts(state, val) {
    state.selectComponentParts = val
  },
  setCustomPartsList(state, val) {
    state.customPartsList = val
  },
  setGetCustomPartsListFlg(state, val) {
    state.getCustomPartsListFlg = val
  },
  setPageListData(state, val) {
    state.pageListData = val
  },
  setTopPagePath(state, val) {
    state.topPagePath = val
  },
}
export const actions = {}
