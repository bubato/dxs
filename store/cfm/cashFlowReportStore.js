const getDefaultState = () => {
  return {
    // アラートリスト
    cashFlowAlertList: [],
    // 予測レポートデータ
    cashFlowReportList: [],
    // 予測レポートテーブルヘッダー
    cashFlowReportTableHeader: [],
    // 予測レポートテーブルデータ
    cashFlowReportTableDataObj: {},
    // シミュレーションデータ
    cashflowSimulationData: {
      advisorVal: '',
      comment: '',
      tableData: {},
    },
    // 保存したシミュレーション情報
    saveSimulationInfo: {},
    // アドバイスリロードフラグ
    adviceReloadFlg: false,
    // グラフシミュレーションリロードフラグ
    simulationChartReloadFlg: false,
    // 選択した顧問先
    advisorVal: '',
    // シミュレーション結果保存モーダルの表示状態
    saveSimulationResultsModalState: false,
    // 戻るリンクで戻ってきたかどうかのフラグ
    backScreenFlg: false,
  }
}

export const state = getDefaultState

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setCashFlowAlertList(state, val) {
    state.cashFlowAlertList = val
  },
  setCashFlowReportList(state, val) {
    state.cashFlowReportList = val
  },
  setCashFlowReportTableHeader(state, val) {
    state.cashFlowReportTableHeader = val
  },
  setCashFlowReportTableDataObj(state, val) {
    state.cashFlowReportTableDataObj = val
  },
  setCashflowSimulationData(state, val) {
    state.cashflowSimulationData = val
  },
  setSaveSimulationInfo(state, val) {
    state.saveSimulationInfo = val
  },
  setAdviceReloadFlg(state, val) {
    state.adviceReloadFlg = val
  },
  setSimulationChartReloadFlg(state, val) {
    state.simulationChartReloadFlg = val
  },
  setAdvisorVal(state, val) {
    state.advisorVal = val
  },
  setSaveSimulationResultsModalState(state, val) {
    state.saveSimulationResultsModalState = val
  },
  setBackScreenFlg(state, val) {
    state.backScreenFlg = val
  },
}

export const actions = {}
