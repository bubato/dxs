const getDefaultState = () => {
  return {
    formInfo: {
      formId: null,
      recordVersion: null,
    },
    updateBtnDisabledFlg: false,
    cancelAfterFunc: '',
    selectPartsInfo: {},
    formSettings: {},
    mailSettings: {},
    publishSettings: {},
    otherSettings: {},
    reflectButtonDisabledFlg: false,
    showOtherSettingsCancelEditModalFlg: false, // タグ・CSS・JSタブ内の編集破棄モーダル表示設定フラグ
    showCompleteFormPublishModalState: false,
    showFormEditPartsDetailModalState: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setFormInfo(state, val) {
    state.formInfo = val
  },
  setCancelAfterFunc(state, val) {
    state.cancelAfterFunc = val
  },
  setSelectPartsInfo(state, val) {
    state.selectPartsInfo = val
  },
  setUpdateBtnDisabledFlg(state, val) {
    state.updateBtnDisabledFlg = val
  },
  setformSettings(state, val) {
    state.searchOptions = val
  },
  setMailSettings(state, val) {
    state.mailSettings = val
  },
  setPublishSettings(state, val) {
    state.publishSettings = val
  },
  setOtherSettings(state, val) {
    state.otherSettings = val
  },
  setReflectButtonDisabledFlg(state, val) {
    state.reflectButtonDisabledFlg = val
  },
  showOtherSettingsCancelEditModal(state) {
    state.showOtherSettingsCancelEditModalFlg = true
  },
  hideOtherSettingsCancelEditModal(state) {
    state.showOtherSettingsCancelEditModalFlg = false
  },
  setShowCompleteFormPublishModalState(state, val) {
    state.showCompleteFormPublishModalState = val
  },
  setShowFormEditPartsDetailModalState(state, val) {
    state.showFormEditPartsDetailModalState = val
  },
}

export const actions = {}
