const getDefaultState = () => {
  return {
    mailListObj: {},
    showChangeTableItemModalFlg: false,
    showDispItems: [
      {
        key: 'id',
        name: 'メールID',
      },
      {
        key: 'title',
        name: 'メールタイトル',
      },
      {
        key: 'status',
        name: 'ステータス',
      },
      {
        key: 'deliveryDate',
        name: '配信日時',
      },
      {
        key: 'deliveryNum',
        name: '配信数',
      },
      {
        key: 'facilityEffect',
        name: '施設効果',
      },
    ],
    showReportComponentFlg: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setMailListObj(state, val) {
    state.mailListObj = val
  },
  showChangeTableItemModal(state) {
    state.showChangeTableItemModalFlg = true
  },
  hideChangeTableItemModal(state) {
    state.showChangeTableItemModalFlg = false
  },
  setDispTableItem(state, val) {
    state.showDispItems = val
  },
  setShowReportComponentFlg(state, val) {
    state.showReportComponentFlg = val
  },
}

export const actions = {}
