const getDefaultState = () => {
  return {
    industryCodeOptions: [
      {
        label: '士業',
        code: '1',
      },
      {
        label: '建設業',
        code: '2',
      },
      {
        label: '製造業',
        code: '3',
      },
      {
        label: '運輸業、郵便業',
        code: '4',
      },
      {
        label: '卸売業、小売業',
        code: '5',
      },
      {
        label: '宿泊業、飲食サービス業',
        code: '6',
      },
      {
        label: '生活関連サービス業、娯楽業',
        code: '7',
      },
      {
        label: '情報通信業',
        code: '8',
      },
      {
        label: '金融業、保険業',
        code: '9',
      },
      {
        label: '不動産業、物品賃貸業',
        code: '10',
      },
      {
        label: '教育、学習支援業',
        code: '11',
      },
      {
        label: '医療、福祉',
        code: '12',
      },
      {
        label: 'その他',
        code: '13',
      },
    ],
    teamsData: [
      {
        id: 1,
        name: 'bizskyDXサービス利用規約',
        text:
          '（規約を確認すると「利用規約に同意します」にチェックが可能になります）',
        checkboxLabel: '利用規約に同意します',
        url: '/terms/service/view.html',
      },
      {
        id: 3,
        name: '経営分析サービス利用規約',
        text:
          '（規約を確認すると「利用規約に同意します」にチェックが可能になります）',
        checkboxLabel: '利用規約に同意します',
        url: '/terms/advisoryCompany/view.html',
      },
      {
        id: 4,
        name: 'MMI、CFMご利用ガイド',
        text:
          '（ご利用ガイドを確認すると「ご利用ガイドを確認しました」にチェックが可能になります）',
        checkboxLabel: 'ご利用ガイドを確認しました',
        url: '/terms/finance-option/view.html',
      },
    ],
    teamsSetting: {},
    teamsVersionIDList: {},
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setTeamsSetting(state, data) {
    state.teamsSetting = data
  },
  setTeamsVersionIDList(state, data) {
    state.teamsVersionIDList = data
  },
  initTeamsModalFlg(state) {
    state.teamsSetting.modalOpenFlgId = 0
  },
  initTeamsSettingData(state) {
    state.teamsSetting = {
      modalOpenFlgId: 0,
      requireConsentIdList: [],
      agreementDisabledIdList: [],
      agreeIdList: [],
    }
    state.teamsVersionIDList = {
      1: '',
      2: '',
      3: '',
      4: '',
    }
  },
}

export const actions = {}
