const getDefaultState = () => {
  return {
    selectMailList: {},
    selectSortType: {
      sort: '',
      order: '',
    },
    mailType: {
      0: 'テキストメール',
      1: 'HTMLメール',
    },
    mailStatus: [
      {
        value: '0',
        label: '編集中',
        class: 'editing',
      },
      {
        value: '1',
        label: '配信予約',
        class: 'reserve',
      },
      {
        value: '2',
        label: '配信中',
        class: 'during',
      },
      {
        value: '3',
        label: '配信完了',
        class: 'delivered',
      },
      {
        value: '4',
        label: '配信エラー',
        class: 'error',
      },
      {
        value: '5',
        label: '配信不可',
        class: 'impossible',
      },
    ],
    mailDeleteModalFlg: false,
    mailCreateModalFlg: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setSelectMailList(state, val) {
    state.selectMailList = val
  },
  setSelectSortType(state, val) {
    state.selectSortType = val
  },
  resetSelectSortType(state) {
    state.selectSortType = getDefaultState().selectSortType
  },
  showMailDeleteModal(state) {
    state.mailDeleteModalFlg = true
  },
  hideMailDeleteModal(state) {
    state.mailDeleteModalFlg = false
  },
  showMailCreateModal(state) {
    state.mailCreateModalFlg = true
  },
  hideMailCreateModal(state) {
    state.mailCreateModalFlg = false
  },
}

export const actions = {}
