const getDefaultState = () => {
  return {
    timeLineList: [],
    maxTimeLineNum: 0,
    searchParam: {
      start: 0,
      count: 50,
    },
    showFileUploadModalState: false,
    showChildCommentIds: [],
    selectTimeLineComment: {},
    showEditTimeLineCommentModalState: false,
    showInputReasonForReportingModalState: false,
    showDeleteTimeLineCommentModalState: false,
    showDeleteTimeLineChildCommentModalState: false,
    spTimeLineMode: false,
    postEditMode: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  resetSelectTimeLineInfo(state) {
    state.maxTimeLineNum = 0
    state.searchParam = {
      start: 0,
      count: 50,
    }
    state.showChildCommentIds = []
    state.selectTimeLineComment = {}
  },
  setTimeLineList(state, val) {
    state.timeLineList = val
  },
  setMaxTimeLineNum(state, val) {
    state.maxTimeLineNum = val
  },
  setNextDataSearchParam(state) {
    state.searchParam.start = state.searchParam.start + state.searchParam.count
  },
  resetSearchParam(state) {
    state.searchParam.start = 0
    state.timeLineList = []
  },
  setShowFileUploadModalState(state, val) {
    state.showFileUploadModalState = val
  },
  setShowChildCommentIds(state, val) {
    state.showChildCommentIds = val
  },
  setSelectTimeLineComment(state, val) {
    state.selectTimeLineComment = val
  },
  setShowEditTimeLineCommentModalState(state, val) {
    state.showEditTimeLineCommentModalState = val
  },
  setShowInputReasonForReportingModalState(state, val) {
    state.showInputReasonForReportingModalState = val
  },
  setShowDeleteTimeLineCommentModalState(state, val) {
    state.showDeleteTimeLineCommentModalState = val
  },
  setShowDeleteTimeLineChildCommentModalState(state, val) {
    state.showDeleteTimeLineChildCommentModalState = val
  },
  setSpTimeLineMode(state, val) {
    state.spTimeLineMode = val
  },
  setPostEditMode(state, val) {
    state.postEditMode = val
  },
}

export const actions = {}
