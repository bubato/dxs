const getDefaultState = () => {
  return {
    myProfile: {},
    myConnectionList: [],
    myConnectionRequestList: [],
    showProfileSettingsComponentFlg: false,
    isPCSize: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setMyProfile(state, data) {
    state.myProfile = data
  },
  setMyConnectionList(state, data) {
    state.myConnectionList = data
  },
  setMyConnectionRequestList(state, data) {
    state.myConnectionRequestList = data
  },
  setShowProfileSettingsComponentFlg(state, val) {
    state.showProfileSettingsComponentFlg = val
  },
  setIsPCSize(state, val) {
    state.isPCSize = val
  },
}

export const actions = {}
