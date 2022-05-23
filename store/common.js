import frontMasterMessageList from '~/static/common/getMasterFrontMessageList.json'

const getDefaultState = () => {
  return {
    frontMasterMessageList: frontMasterMessageList.masterMessageList,
    notAuthScreens: [
      '/login/',
      '/request/input/',
      '/request/complete/',
      '/passwordRequest/',
      '/passwordRequest/complete/',
      '/passwordReset/',
      '/passwordReset/complete/',
      '/passwordReset/expire/',
      '/passwordChange/complete/',
      '/401/',
      '/invitation/',
      '/invitation/advisoryCompany/',
      '/invitation/advisoryCompany/complete/',
      '/invitation/advisoryCompany/expire/',
      '/invalid/',
      '/storage/sharedItem/',
    ],
    showScrollBarFlg: false,
    sideNavIsOpen: true,
    masterData: {},
    completePopAlertLabel: '',
    callApiNum: 0,
    commonErrorList: [], // 共通エラーリスト
    showCancelEditModalFlg: false, // 編集内容破棄モーダル表示フラグ
    showCompleteFuncModalFlg: false, // 完了モーダル表示フラグ
    showCommonErrorModalFlg: false, // 共通エラーモーダル表示フラグ
    showEditAccountInfoModalFlg: false, // アカウント情報編集モーダル表示フラグ
    completeFuncInfo: {
      text: '',
      context: '',
      type: '',
    },
    profileImageUploadModalState: false,
    profileImageStore: '',
    areaLabel: {},
    showIncompleteBasicSettingsModalState: false, // 基本設定未完了フラグ
    showIncompleteBasicSettingsMessage: '', // 基本設定未完了メッセージ
    onlyDevScreen: [
      '/',
      '/common/moduleList/',
      '/communication/basicSettings/',
      '/communication/createMail/',
      '/communication/createNewMail/',
      '/communication/dashboard/',
      '/communication/mailList/',
      '/form/preview/test/',
    ],
    sideNavData: {},
    notificationList: [],
    isNotificationListPolling: false,
    dataLakeActivateFrom: {},
    initShowPage: '',
    unreadMessagesPollingTimerId: null,
    basicSettingStatus: null,
  }
}

export const state = getDefaultState

export const getters = {
  getSideNavIsOpen(state) {
    return state.sideNavIsOpen
  },
}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  showScrollBar(state) {
    state.showScrollBarFlg = true
  },
  hideScrollBar(state) {
    state.showScrollBarFlg = false
  },
  showSideNav(state) {
    state.sideNavIsOpen = true
  },
  hideSideNav(state) {
    state.sideNavIsOpen = false
  },
  setScrollbarFlg(state, flg) {
    state.showScrollBarFlg = flg
  },
  setMasterData(state, val) {
    state.masterData = val
  },
  setCompletePopAlertLabel(state, val) {
    state.completePopAlertLabel = val
  },
  addCallApiNum(state) {
    state.callApiNum += 1
  },
  subCallApiNum(state) {
    state.callApiNum -= 1
  },
  setCommonErrorList(state, val) {
    state.commonErrorList = val
  },
  showCancelEditModal(state) {
    state.showCancelEditModalFlg = true
  },
  hideCancelEditModal(state) {
    state.showCancelEditModalFlg = false
  },
  showCompleteFuncModal(state) {
    state.showCompleteFuncModalFlg = true
  },
  hideCompleteFuncModal(state) {
    state.showCompleteFuncModalFlg = false
  },
  showCommonErrorModal(state) {
    state.showCommonErrorModalFlg = true
  },
  hideCommonErrorModal(state) {
    state.showCommonErrorModalFlg = false
  },
  showEditAccountInfoModal(state) {
    state.showEditAccountInfoModalFlg = true
  },
  hideEditAccountInfoModal(state) {
    state.showEditAccountInfoModalFlg = false
  },
  setCompleteFuncInfo(state, val) {
    state.completeFuncInfo = val
  },
  setProfileImageUploadModalState(state, val) {
    state.profileImageUploadModalState = val
  },
  setProfileImage(state, val) {
    state.profileImageStore = val
  },
  setAreaLabel(state, val) {
    state.areaLabel = val
  },
  setShowIncompleteBasicSettingsModalState(state, val) {
    state.showIncompleteBasicSettingsModalState = val
  },
  setShowIncompleteBasicSettingsMessage(state, val) {
    state.showIncompleteBasicSettingsMessage = val
  },
  setSideNavData(state, val) {
    state.sideNavData = val
  },
  setNotificationList(state, val) {
    state.notificationList = val
  },
  setIsNotificationListPolling(state, val) {
    state.isNotificationListPolling = val
  },
  setDataLakeActivateFrom(state, val) {
    state.dataLakeActivateFrom = val
  },
  setInitShowPage(state, val) {
    state.initShowPage = val
  },
  setUnreadMessagesPollingTimerId(state, val) {
    state.unreadMessagesPollingTimerId = val
  },
  setBasicSettingStatus(state, val) {
    state.basicSettingStatus = val
  },
}

export const actions = {}
