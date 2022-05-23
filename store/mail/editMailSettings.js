import initComponentsJson from '~/static/mail/editor/initComponentParts.json'
import mailBodyEditor from '~/static/mail/editor/mailBodyEditor.txt'

const getDefaultState = () => {
  return {
    initComponentsJson,
    mailBodyEditor,
    backgroundColorList: [
      '#1e1e1e',
      '#a0a0a0',
      '#ffffff',
      '#561631',
      '#009a22',
      '#830de8',
      '#9bdcf7',
      '#ffa6c9',
      '#f03333',
      '#ff831a',
    ],
    textColorList: ['#1e1e1e', '#404040', '#7f7f7f', '#bfbfbf', '#ffffff'],
    cancelAfterFunc: '',
    contactsDistributionMaster: {},
    formInformation: [],
    selectComponentInfo: {},
    showDeleteMailComponentModalState: false,
    selectComponentIndexObj: {},
    showEditMailComponentModalState: false,
    reflectButtonDisabledFlg: false,
    mailStatus: '',
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setCancelAfterFunc(state, val) {
    state.cancelAfterFunc = val
  },
  setContactsDistributionMaster(state, val) {
    state.contactsDistributionMaster = val
  },
  setFormInformation(state, val) {
    state.formInformation = val
  },
  setSelectComponentInfo(state, val) {
    state.selectComponentInfo = val
  },
  setShowDeleteMailComponentModalState(state, val) {
    state.showDeleteMailComponentModalState = val
  },
  setSelectComponentIndexObj(state, val) {
    state.selectComponentIndexObj = val
  },
  setShowEditMailComponentModalState(state, val) {
    state.showEditMailComponentModalState = val
  },
  setReflectButtonDisabledFlg(state, val) {
    state.reflectButtonDisabledFlg = val
  },
  setMailStatus(state, val) {
    state.mailStatus = val
  },
}

export const actions = {}
