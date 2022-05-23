const getDefaultState = () => {
  return {
    groupMembers: [],
    groupInfo: {},
    showInvitationGroupMemberModalState: false,
    joinGroup: {
      accountingFirmPostGroups: [],
      adminPostGroups: [],
      participationPostGroups: [],
    },
    showGroupPageTab: 1,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setGroupMembers(state, val) {
    state.groupMembers = val
  },
  setGroupInfo(state, val) {
    state.groupInfo = val
  },
  setInvitationGroupMemberModalState(state, val) {
    state.showInvitationGroupMemberModalState = val
  },
  setJoinGroup(state, val) {
    state.joinGroup = val
  },
  setShowGroupPageTab(state, val) {
    state.showGroupPageTab = val
  },
}

export const actions = {}
