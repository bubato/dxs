// import industryMasterList from '~/static/mmi/getIndustryMasterList.json'

const getDefaultState = () => {
  return {
    // industryMasterList,
    navParams: null,
    currentCompanyLinkageId: null,
    companyMasterInfo: null,
    accountingFirmFlg: false, // 会計事務所フラグ
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setNavParams(state, val) {
    state.navParams = val
  },
  setCurrentCompanyLinkageId(state, val) {
    state.currentCompanyLinkageId = val
  },
  setCompanyMasterInfo(state, val) {
    state.companyMasterInfo = val

    // 会計事務所フラグを設定
    if (val.dataList.length > 0) {
      state.accountingFirmFlg = val.dataList[0].corporateType === '20'
    }
  },
}

export const actions = {}
