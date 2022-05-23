const getDefaultState = () => {
  return {
    recentGroupList: [],
    showMessageBlockFlg: false,
    showMessageChatAreaFlg: false,
    selectGroupId: null,
    selectStorageObjectId: null,
    showFileUploadModalState: false,
    showDeleteMessageModalState: false,
    selectMessage: {},
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setRecentGroupList(state, val) {
    state.recentGroupList = val
  },
  setShowMessageBlockFlg(state, val) {
    state.showMessageBlockFlg = val
  },
  setShowMessageChatAreaFlg(state, val) {
    state.showMessageChatAreaFlg = val
  },
  setSelectGroupId(state, val) {
    state.selectGroupId = val
  },
  setSelectStorageObjectId(state, val) {
    state.selectStorageObjectId = val
  },
  setShowFileUploadModalState(state, val) {
    state.showFileUploadModalState = val
  },
  setShowDeleteMessageModalState(state, val) {
    state.showDeleteMessageModalState = val
  },
  setSelectMessage(state, val) {
    state.selectMessage = val
  },
}

export const actions = {}
