import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('cfm/cashFlowReportStore', [
      'cashFlowAlertList',
      'cashFlowReportList',
      'cashFlowReportTableHeader',
      'cashFlowReportTableData',
    ]),
    /**
     * 保存したシミュレーション判定
     */
    checkSimulationType() {
      let simulationType = 1 // 1:

      if (
        this.$route.path.startsWith(
          '/cashFlowManagement/forecastReport/simulationResults/'
        )
      ) {
        if (this.$route.params.simulationId) {
          simulationType = 3
        } else {
          simulationType = 2
        }
      }

      return simulationType
    },
    /**
     * アラートのステータスの参照
     */
    checkAlertStatus() {
      let status = null // 0:良好 1:危険 9:予測不可

      if (this.$common.checkArrayValue(this.cashFlowAlertList)) {
        status = this.cashFlowAlertList[0].status
      }

      return status
    },
    /**
     * アラート一覧に引数の項目が存在するかのチェック
     *
     * @param {String} itemName 項目名
     * @returns {boolean} true:存在する false:存在しない
     */
    checkAlertTargetItem() {
      return (itemName) => {
        let result = false

        if (
          this.cashFlowAlertList.findIndex(
            (data) => data.messageCode === itemName
          ) >= 0
        ) {
          result = true
        }

        return result
      }
    },
    /**
     * 数値を3桁カンマ区切りにする
     *
     * @param {String|Number} num 数値
     * @param {String} unit 単位
     * @return {string} 表示する数値
     */
    getNumCommaSeparated() {
      return (num, unit) => {
        let returnNum = ''

        if (isFinite(Number(num))) {
          returnNum = Number(num).toLocaleString() + (unit || '')
        } else {
          returnNum = num
        }

        return returnNum
      }
    },
    /**
     * 数値の小数点を丸める
     *
     * @return {string} 小数点の数値
     */
    getNumFixed() {
      return (num, digit) => {
        let fixedNum = null

        if (isFinite(Number(num))) {
          fixedNum = Number(num.toFixed(digit))
        } else if (isNaN(num)) {
          fixedNum = String(num)
        } else {
          fixedNum = 'ゼロ除算'
        }

        return fixedNum
      }
    },
  },
  methods: {
    ...mapMutations('cfm/cashFlowReportStore', [
      'setCashFlowAlertList',
      'setCashFlowReportList',
      'setCashFlowReportTableHeader',
      'setCashFlowReportTableDataObj',
      'setSimulationChartReloadFlg',
    ]),
    /**
     * 資金繰り予測API取得
     *
     * @param {object} paramData リクエストパラメータ
     */
    getCashFlowReport(paramData) {
      this.$common.addCallApiNum()
      this.$api
        .getCashFlowReport(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setInitCashFlowAlertList(
              resData.data.alerts,
              resData.data.dataList
            )
            this.setInitShowCashFlowTableData(resData.data.dataList)
            this.$nextTick(() => {
              this.setSimulationChartReloadFlg(true)
            })
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * アラートリストの初期設定
     *
     * @param {Object[]} alertList アラート一覧
     * @param {Object[]} dataList 表示データ一覧
     */
    setInitCashFlowAlertList(alertList, dataList) {
      const sortAlertList = alertList.sort((a, b) => {
        if (a.displayRank > b.displayRank) {
          return 1
        } else {
          return -1
        }
      })

      if (
        sortAlertList.length > 0 &&
        dataList.length > 0 &&
        dataList[0].year === null
      ) {
        sortAlertList[0].status = 9
      }

      this.setCashFlowAlertList(sortAlertList)
    },
    /**
     * テーブルに表示するシミュレーションデータを設定
     */
    setInitShowCashFlowTableData(simulationDataList) {
      // 予測レポートをセット
      const cashFlowReportList = simulationDataList.map((data) => {
        data.month = ('00' + data.month).slice(-2)
        return data
      })

      this.setCashFlowReportList(cashFlowReportList)

      if (
        this.cashFlowAlertList.length > 0 &&
        this.cashFlowAlertList[0].status !== 9
      ) {
        const filterCashFlowReportList = cashFlowReportList.filter(
          (data) => data.forecastFlag === 1
        )

        // テーブルヘッダーの設定
        const cashFlowTableHeader = this.getCashFlowTableHeader(
          filterCashFlowReportList
        )
        this.setCashFlowReportTableHeader(cashFlowTableHeader)

        // テーブルデータの設定
        const cashFlowTableDataObj = this.getCashFlowReportTableData(
          filterCashFlowReportList,
          cashFlowTableHeader
        )
        this.setCashFlowReportTableDataObj(cashFlowTableDataObj)
      } else {
        this.setCashFlowReportTableHeader([])
        this.setCashFlowReportTableDataObj({})
      }
    },
    /**
     * テーブルヘッダーの表示
     *
     * @param {object[]} cashFlowReportList テーブルデータ
     * @return {string[]} テーブルヘッダー
     */
    getCashFlowTableHeader(cashFlowReportList) {
      const cashFlowTableHeader = []

      for (let i = 0; i < cashFlowReportList.length; i++) {
        cashFlowTableHeader.push(
          cashFlowReportList[i].year + '/' + cashFlowReportList[i].month
        )
      }

      return cashFlowTableHeader
    },
    /**
     * テーブルデータの表示
     *
     * @param {object[]} cashFlowReportList テーブルデータ
     * @return {string[]} テーブルヘッダー
     */
    getCashFlowReportTableData(cashFlowReportList, cashFlowTableHeader) {
      const cashFlowTableDataListObj = []
      const headerKey = [
        {
          key: 'sales',
          label: '売上高',
        },
        {
          key: 'compareSales',
          label: '前年同月比',
        },
        {
          key: 'cost',
          label: '売上原価',
        },
        {
          key: 'costRate',
          label: '原価率',
        },
        {
          key: 'personnelExpenses',
          label: '人件費',
        },
        {
          key: 'comparePersonnelExpenses',
          label: '前年同月比',
        },
        {
          key: 'rents',
          label: '地代・家賃',
        },
        {
          key: 'compareRents',
          label: '前年同月比',
        },
        {
          key: 'sgAndA',
          label: '他販管費',
        },
        {
          key: 'compareSgAndA',
          label: '前年同月比',
        },
        {
          key: 'operatingIncome',
          label: '営業利益',
        },
        {
          key: 'operatingIncomeRate',
          label: '営業利益率',
        },
        {
          key: 'depreciationCost',
          label: '減価償却費(原価)',
        },
        {
          key: 'depreciationSgAndA',
          label: '減価償却費(販管費)',
        },
        {
          key: 'tradeReceivable',
          label: '売上債権',
        },
        {
          key: 'tradeReceivableTurnoverPeriod',
          label: '売上債権-回転期間(日)',
        },
        {
          key: 'inventories',
          label: '棚卸資産',
        },
        {
          key: 'inventoriesTurnoverPeriod',
          label: '棚卸資産-回転期間(日)',
        },
        {
          key: 'accountsPayable',
          label: '仕入債務',
        },
        {
          key: 'accountsPayableTurnoverPeriod',
          label: '仕入債務-回転期間(日)',
        },
        {
          key: 'operatingCashFlow',
          label: '営業CF',
        },
        {
          key: 'cashAndDeposits',
          label: '現預金残高',
        },
      ]

      for (let i = 0; i < headerKey.length; i++) {
        const cashFlowTableData = []

        for (let j = 0; j < cashFlowReportList.length; j++) {
          if (headerKey[i].label === '前年同月比') {
            cashFlowTableData.push({
              date: cashFlowTableHeader[j],
              value: this.getCalculationLastYearRatio(
                cashFlowTableHeader[j],
                headerKey[i - 1].key
              ),
            })
          } else if (headerKey[i].key === 'operatingIncomeRate') {
            cashFlowTableData.push({
              date: cashFlowTableHeader[j],
              value: this.getNumFixed(
                (cashFlowTableDataListObj.operatingIncome[j].value * 100) /
                  cashFlowTableDataListObj.sales[j].value,
                1
              ),
            })
          } else if (headerKey[i].key === 'costRate') {
            cashFlowTableData.push({
              date: cashFlowTableHeader[j],
              value: this.getNumFixed(
                (cashFlowReportList[j].cost / cashFlowReportList[j].sales) *
                  100,
                1
              ),
            })
          } else {
            cashFlowTableData.push({
              date: cashFlowTableHeader[j],
              value: cashFlowReportList[j][headerKey[i].key],
            })
          }
        }

        cashFlowTableDataListObj[headerKey[i].key] = cashFlowTableData
      }

      return cashFlowTableDataListObj
    },
    /**
     * 現在月を文字列で取得
     */
    getCurrentMonthStr() {
      const currentMonthIndex = this.getCurrentMonthIndex()
      const currentMonthData = this.cashFlowReportList[currentMonthIndex]
      const currentMonthStr =
        currentMonthData.year + '/' + currentMonthData.month

      return currentMonthStr
    },
    /**
     * 現在月のインデックスの取得
     */
    getCurrentMonthIndex() {
      const cashFlowReportList = JSON.parse(
        JSON.stringify(this.cashFlowReportList)
      )
      const currentMonthIndex =
        cashFlowReportList.length -
        cashFlowReportList
          .reverse()
          .findIndex((data) => data.forecastFlag === 0) -
        1

      return currentMonthIndex
    },
    /**
     * 引数の日付のデータを取得
     *
     * @param {String} date 日付
     * @return {Object} 日付データ
     */
    getTargetDateData(date) {
      const targetData = this.cashFlowReportList.find(
        (data) => data.year + '/' + data.month === date
      )

      return targetData
    },
    /**
     * 対象月のNか月後を取得
     *
     * @param {String} 対象月
     * @return {boolean} true:最終月 false:最終月以外
     */
    checkTargetDateLast(date) {
      const targetDataIndex = this.cashFlowReportList.findIndex(
        (data) => data.year + '/' + data.month === date
      )

      return targetDataIndex === this.cashFlowReportList.length - 1
    },
    /**
     * 対象月のNか月後を取得
     *
     * @param {String} 対象月
     * @param {number} 対象月からNか月
     * @return {String} 現在日からNか月を加算した日付
     */
    getTargetDate(date, num) {
      const targetDataIndex = this.cashFlowReportList.findIndex(
        (data) => data.year + '/' + data.month === date
      )
      const beforeMonthIndex = targetDataIndex + num

      return (
        this.cashFlowReportList[beforeMonthIndex].year +
        '/' +
        this.cashFlowReportList[beforeMonthIndex].month
      )
    },
    /**
     * 対象の月からNか月前のデータを取得
     *
     * @param {string} date 対象の月
     * @param {number} beforeMonth Nか月前
     * @return {object} 対象の月からNか月前のデータ
     */
    getBeforeTargetDate(date, beforeMonth) {
      const targetDate =
        String(Number(date.split('/')[0]) - 1) + '/' + date.split('/')[1]
      const targetDataIndex = this.cashFlowReportList.findIndex(
        (data) => data.year + '/' + data.month === targetDate
      )
      const beforeMonthIndex = targetDataIndex - beforeMonth

      return this.cashFlowReportList[beforeMonthIndex]
    },
    /**
     * 前年同月のデータを取得
     */
    getYearOnYearData(date) {
      const targetDate =
        String(Number(date.split('/')[0]) - 1) + '/' + date.split('/')[1]
      const targetData = this.cashFlowReportList.find(
        (data) => data.year + '/' + data.month === targetDate
      )

      return targetData
    },
    /**
     * 前年同月比の値を取得
     */
    getCalculationLastYearRatio(date, key) {
      const value = this.cashFlowReportList.find(
        (data) => data.year + '/' + data.month === date
      )[key]
      const targetData = this.getYearOnYearData(date) // 前年同月のデータ取得
      const targetValue = targetData[key]
      const ratio = this.getNumFixed((value * 100) / targetValue, 1)

      return ratio
    },
  },
}
