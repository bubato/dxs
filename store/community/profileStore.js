const getViewDefaultState = () => {
  return {
    showPageTab: 1, // プロフィール、つながり、投稿切り替えタブアクティブ保持
    profilePageProfile: {},
    profilePageConnection: [],
  }
}

export const state = getViewDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getViewDefaultState())
  },
  setShowPageTab(state, data) {
    state.showPageTab = data
  },
  setProfilePageProfile(state, data) {
    state.profilePageProfile = data
  },
  setProfilePageConnection(state, data) {
    state.profilePageConnection = data
  },
}

export const actions = {}
