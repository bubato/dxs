import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'bizsky',
      paths: [
        'common.accountData',
        'common.masterData',
        'common.sideNavData',
        'cms.editorStore.designTemplate',
        'cms.editorStore.templateImageId',
        'cms.editorStore.colorId',
        'communication.mailList.showReportComponentFlg',
        'community.common.showProfileSettingsComponentFlg',
        'cfm.cashFlowReportStore.cashflowSimulations',
        'cfm.cashFlowReportStore.simulationTemporarilySaved',
        'cfm.cashFlowReportStore.cashFlowReportTableHeader',
        'cfm.cashFlowReportStore.cashFlowReportTableDataObj',
        'cfm.cashFlowReportStore.cashFlowReportList',
        'cfm.cashFlowReportStore.cashflowSimulationData',
        'mmi.common.displayCategory',
      ],
      storage: window.sessionStorage,
    })(store)
  })
}
