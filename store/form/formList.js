const getDefaultState = () => {
  return {
    formList: [],
    selectFormInfo: {},
    showFormTagModalFlg: false,
    showDeleteFormModalFlg: false,
    formSelectSortType: {
      sort: '',
      order: '',
    },
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setFormList(state, val) {
    state.formList = val
  },
  setSelectFormInfo(state, val) {
    state.selectFormInfo = val
  },
  showFormTagModal(state) {
    state.showFormTagModalFlg = true
  },
  hideFormTagModal(state) {
    state.showFormTagModalFlg = false
  },
  showDeleteFormModal(state) {
    state.showDeleteFormModalFlg = true
  },
  hideDeleteFormModal(state) {
    state.showDeleteFormModalFlg = false
  },
  setFormSelectSortType(state, data) {
    state.formSelectSortType = data
  },
  resetFormSelectSortType(state) {
    state.formSelectSortType = getDefaultState().formSelectSortType
  },
}

export const actions = {}
