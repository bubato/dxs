const getDefaultState = () => {
  return {
    checkStorageList: [],
    selectStorageInfo: {},
    breadcrumbList: [],
    breadcrumb: [],
    overwriteModalInfo: {},
    storageAddSharedMemberModalFlg: false,
    storageChangeNameModalFlg: false,
    storageLinkCopyModalFlg: false,
    storageDataMoveModalFlg: false,
    storageFileUploadFlg: false,
    storageOverwriteModalFlg: false,
    storageDeleteModalFlg: false,
    storageFileDragDropFlg: false,
    moveGetList: false,
    selectSortType: {
      sort: '',
      order: '',
    },
    pathStorageObjectId: null,
    checkedFlg: 0,
    dialogDeleteClick: false,
    extNgList: [
      'bat',
      'cmd',
      'com',
      'exe',
      'js',
      'jse',
      'pif',
      'scr',
      'vbe',
      'bvs',
      'wsf',
      'wsh',
    ],
    pinText: ['ピン留め', 'ピンを外す'],
    objectTypeText: { 1: 'フォルダ', 2: 'ファイル' },
    uploadDataFlg: false,
    uploadUpdateFlg: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setCheckStorageList(state, val) {
    state.checkStorageList = val
  },
  setSelectStorageInfo(state, val) {
    state.selectStorageInfo = val
  },
  setOverwriteModalInfo(state, val) {
    state.overwriteModalInfo = val
  },
  showStorageAddSharedMemberModal(state) {
    state.storageAddSharedMemberModalFlg = true
  },
  hideStorageAddSharedMemberModal(state) {
    state.storageAddSharedMemberModalFlg = false
  },
  showStorageChangeNameModal(state) {
    state.storageChangeNameModalFlg = true
  },
  hideStorageChangeNameModal(state) {
    state.storageChangeNameModalFlg = false
  },
  showStorageLinkCopyModal(state) {
    state.storageLinkCopyModalFlg = true
  },
  hideStorageLinkCopyModal(state) {
    state.storageLinkCopyModalFlg = false
  },
  showStorageDataMoveModal(state) {
    state.storageDataMoveModalFlg = true
  },
  hideStorageDataMoveModal(state) {
    state.storageDataMoveModalFlg = false
  },
  showStorageFileUpload(state) {
    state.storageFileUploadFlg = true
  },
  hideStorageFileUpload(state) {
    state.storageFileUploadFlg = false
  },
  showStorageOverwriteModal(state) {
    state.storageOverwriteModalFlg = true
  },
  hideStorageOverwriteModal(state) {
    state.storageOverwriteModalFlg = false
  },
  showStorageFileDragDrop(state) {
    state.storageFileDragDropFlg = true
  },
  hideStorageFileDragDrop(state) {
    state.storageFileDragDropFlg = false
  },
  showStorageDeleteModal(state) {
    state.storageDeleteModalFlg = true
  },
  hideStorageDeleteModal(state) {
    state.storageDeleteModalFlg = false
  },
  updateDialogDeleteClick(state, val) {
    state.dialogDeleteClick = val
  },
  setSelectSortType(state, val) {
    state.selectSortType = val
  },
  resetSelectSortType(state) {
    state.selectSortType = getDefaultState().selectSortType
  },
  setBreadcrumbList(state, val) {
    state.breadcrumbList = val
  },
  setBreadcrumb(state, val) {
    state.breadcrumb = []
    const passText = '/storage/home/'
    let setPassText = ''
    for (const i in val) {
      if (val[i].objectId === null) {
        setPassText = passText
      } else {
        setPassText = passText + val[i].objectId + '/'
      }
      state.breadcrumb.push({
        pass: setPassText,
        folderName: val[i].folderName,
      })
    }
  },
  onMoveGetList(state) {
    state.moveGetList = true
  },
  offMoveGetList(state) {
    state.moveGetList = false
  },
  getPathStorageObjectId(state, val) {
    if (val.objectId !== undefined) {
      state.pathStorageObjectId = val.objectId
    }
  },
  updateCheckedFlg(state, val) {
    state.checkedFlg = val
  },
  onUploadDataFlg(state) {
    state.uploadDataFlg = true
    state.uploadUpdateFlg = false
  },
  onUploadUpdateFlg(state) {
    state.uploadUpdateFlg = true
    state.uploadDataFlg = false
  },
}

export const actions = {}
