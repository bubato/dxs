const getDefaultState = () => {
  return {
    sideNaviItems: [],
    companyMasterDataList: {},
    corporateType: '',
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setSideNaviItems(state, val) {
    state.sideNaviItems = val
  },
  setCompanyMasterDataList(state, val) {
    state.companyMasterDataList = val
  },
  setCorporateType(state, val) {
    state.corporateType = val
  },
}

export const actions = {}
