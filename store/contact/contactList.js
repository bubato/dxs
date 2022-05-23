const getDefaultState = () => {
  return {
    contactList: [],
    checkContactList: [],
    selectContactInfo: {},
    contactSelectSortType: {
      sort: '',
      order: '',
    },
    showContactTagModalState: false,
    showDeleteContactModalState: false,
    showSearchDetailContactModalState: false,
    showChangeTableItemModalState: false,
    searchDetailOptions: {},
    dataItemDefinitionList: [],
    deleteSelectId: 0,
    salesPersonList: [],
    tagDefinitionList: [],
    settingCreateDataList: [],
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setContactList(state, val) {
    state.contactList = val
  },
  setCheckContactList(state, val) {
    state.checkContactList = val
  },
  setSelectContactInfo(state, val) {
    state.selectContactInfo = val
  },
  setContactSelectSortType(state, val) {
    state.contactSelectSortType = val
  },
  setShowContactTagModalState(state, val) {
    state.showContactTagModalState = val
  },
  setShowDeleteContactModalState(state, val) {
    state.showDeleteContactModalState = val
  },
  setShowSearchDetailContactModalState(state, val) {
    state.showSearchDetailContactModalState = val
  },
  setShowChangeTableItemModalState(state, val) {
    state.showChangeTableItemModalState = val
  },
  setSearchDetailOptions(state, val) {
    state.searchDetailOptions = val
  },
  setDataItemDefinitionList(state, val) {
    state.dataItemDefinitionList = val
  },
  setDeleteSelectId(state, val) {
    state.deleteSelectId = val
  },
  setSalesPersonList(state, val) {
    state.salesPersonList = val
  },
  setTagDefinitionList(state, val) {
    state.tagDefinitionList = val
  },
  setSettingCreateDataList(state, val) {
    state.settingCreateDataList = val
  },
}

export const actions = {}
