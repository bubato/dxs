const getDefaultState = () => {
  return {
    basicSettings: {},
    showPromptForPageUpdateModalState: false,
    promptForPageUpdateMessage: '',
    showChangeOwnDomainConfirmModalState: false,
    templateImageMaster: [
      {
        templateImageId: '101',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '1',
        industryName: '士業',
        colorId: '6',
      },
      {
        templateImageId: '102',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '2',
        industryName: '建設業',
        colorId: '9',
      },
      {
        templateImageId: '103',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '3',
        industryName: '製造業',
        colorId: '12',
      },
      {
        templateImageId: '104',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '4',
        industryName: '運輸業、郵便業',
        colorId: '5',
      },
      {
        templateImageId: '105',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '5',
        industryName: '卸売業、小売業',
        colorId: '19',
      },
      {
        templateImageId: '106',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '6',
        industryName: '宿泊業、飲食サービス業',
        colorId: '18',
      },
      {
        templateImageId: '107',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '7',
        industryName: '生活関連サービス業、娯楽業',
        colorId: '11',
      },
      {
        templateImageId: '108',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '8',
        industryName: '情報通信業',
        colorId: '4',
      },
      {
        templateImageId: '109',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '9',
        industryName: '金融業、保険業',
        colorId: '9',
      },
      {
        templateImageId: '110',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '10',
        industryName: '不動産業、物品賃貸業',
        colorId: '20',
      },
      {
        templateImageId: '111',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '11',
        industryName: '教育、学習支援業',
        colorId: '15',
      },
      {
        templateImageId: '112',
        styleId: 'simple',
        styleName: 'シンプル',
        industryId: '12',
        industryName: '医療、福祉',
        colorId: '11',
      },
      {
        templateImageId: '301',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '1',
        industryName: '士業',
        colorId: '20',
      },
      {
        templateImageId: '302',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '2',
        industryName: '建設業',
        colorId: '16',
      },
      {
        templateImageId: '303',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '3',
        industryName: '製造業',
        colorId: '2',
      },
      {
        templateImageId: '304',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '4',
        industryName: '運輸業、郵便業',
        colorId: '6',
      },
      {
        templateImageId: '305',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '5',
        industryName: '卸売業、小売業',
        colorId: '17',
      },
      {
        templateImageId: '306',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '6',
        industryName: '宿泊業、飲食サービス業',
        colorId: '19',
      },
      {
        templateImageId: '307',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '7',
        industryName: '生活関連サービス業、娯楽業',
        colorId: '5',
      },
      {
        templateImageId: '308',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '8',
        industryName: '情報通信業',
        colorId: '2',
      },
      {
        templateImageId: '309',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '9',
        industryName: '金融業、保険業',
        colorId: '7',
      },
      {
        templateImageId: '310',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '10',
        industryName: '不動産業、物品賃貸業',
        colorId: '9',
      },
      {
        templateImageId: '311',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '11',
        industryName: '教育、学習支援業',
        colorId: '12',
      },
      {
        templateImageId: '312',
        styleId: 'stylish',
        styleName: 'スタイリッシュ',
        industryId: '12',
        industryName: '医療、福祉',
        colorId: '8',
      },
      {
        templateImageId: '401',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '1',
        industryName: '士業',
        colorId: '7',
      },
      {
        templateImageId: '402',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '2',
        industryName: '建設業',
        colorId: '11',
      },
      {
        templateImageId: '403',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '3',
        industryName: '製造業',
        colorId: '4',
      },
      {
        templateImageId: '404',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '4',
        industryName: '運輸業、郵便業',
        colorId: '9',
      },
      {
        templateImageId: '405',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '5',
        industryName: '卸売業、小売業',
        colorId: '13',
      },
      {
        templateImageId: '406',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '6',
        industryName: '宿泊業、飲食サービス業',
        colorId: '16',
      },
      {
        templateImageId: '407',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '7',
        industryName: '生活関連サービス業、娯楽業',
        colorId: '10',
      },
      {
        templateImageId: '408',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '8',
        industryName: '情報通信業',
        colorId: '15',
      },
      {
        templateImageId: '409',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '9',
        industryName: '金融業、保険業',
        colorId: '12',
      },
      {
        templateImageId: '410',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '10',
        industryName: '不動産業、物品賃貸業',
        colorId: '19',
      },
      {
        templateImageId: '411',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '11',
        industryName: '教育、学習支援業',
        colorId: '5',
      },
      {
        templateImageId: '412',
        styleId: 'friendly',
        styleName: 'フレンドリー',
        industryId: '12',
        industryName: '医療、福祉',
        colorId: '6',
      },
    ],
  }
}

export const state = getDefaultState

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setBasicSettings(state, data) {
    state.basicSettings = data
  },
  updateBasicSettings(state, data) {
    state.basicSettings.basicSettings[data.key] = data.val
  },
  setShowPromptForPageUpdateModalState(state, val) {
    state.showPromptForPageUpdateModalState = val
  },
  setPromptForPageUpdateMessage(state, val) {
    state.promptForPageUpdateMessage = val
  },
  setShowChangeOwnDomainConfirmModalState(state, val) {
    state.showChangeOwnDomainConfirmModalState = val
  },
}

export const getters = {
  getBasicSettings(state) {
    return state.basicSettings
  },
}

export const actions = {
  resetDefaultState({ commit }) {
    commit('resetDefaultState')
  },
  setBasicSettings({ commit }, data) {
    commit('setBasicSettings', data)
  },
  updateBasicSettings({ commit }, data) {
    commit('updateBasicSettings', data)
  },
}
