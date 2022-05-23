<script>
import CompanyInfoFolding from './CompanyInfoFolding.vue'
import FoldingHeader from './FoldingHeader.vue'
import CompanyInfoHeader from './CompanyInfoHeader.vue'
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'
import plBsMasterKeyValue from '~/static/mmi/getPlBsMasterKeyValue.json'

export default {
  name: 'FoldingTable',
  components: {
    FoldingHeader,
    CompanyInfoFolding,
    CompanyInfoHeader,
  },
  mixins: [companyInfoUtility],
  props: {
    tableInfo: {
      type: Object,
      default: () => {},
    },
    isOwnCompany: {
      type: Boolean,
      default: false,
    },
    balanceType: {
      type: String,
      required: true,
    },
    averageBaseTitle: {
      type: String,
      default: '',
    },
    averageBaseValidator: {
      type: Function,
      default: (v) => true,
    },
    ownCompanyName: {
      type: String,
      default: null,
    },
    tableStyle: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    const tableData = this.getTableData(this.tableInfo)
    const headerWidthList = this.getHeaderWidthList(tableData)
    return {
      unit: '1',
      unitInfo: {},
      isFold: false,
      isFoldInternal: false,
      isFoldingTransition: false,
      tableData,
      headerWidthList,
    }
  },
  watch: {
    tableInfo(value) {
      this.tableData = this.getTableData(value)
      this.headerWidthList = this.getHeaderWidthList(this.tableData)
    },
  },
  methods: {
    /**
     * 表示用に親子関係を持っているデータを作成する
     */
    getTableData(rawTableData) {
      rawTableData = JSON.parse(JSON.stringify(rawTableData))
      const data = []

      const levelStack = []
      const addRowData = (d, prev) => {
        if (prev) {
          if (prev.level < d.level) {
            levelStack.unshift(prev)
          } else {
            while (levelStack.length && levelStack[0].level >= d.level) {
              levelStack.shift()
            }
          }
        }

        if (!levelStack.length) {
          // インデントがないので、そのまま表の配列に追加
          data.push(d)
        } else {
          // インデントされている場合は、インデントの親に追加
          if (!levelStack[0].children) {
            // 子要素用の配列がなければ配列を作成
            levelStack[0].children = []
            levelStack[0].isFold = false
            levelStack[0].isFoldInternal = false
            levelStack[0].isFoldingTransition = false
          }
          // インデントのchildrenに要素を追加（この要素の子(children)となっている列が、畳んで非表示に出来る）
          levelStack[0].children.push(d)
        }
      }

      let prev = null
      rawTableData.dataList.forEach((dataElement) => {
        addRowData(dataElement, prev)
        prev = dataElement
      })
      rawTableData.dataList = data
      return rawTableData
    },
    onFoldTransitionStart(foldRoot) {
      if (!foldRoot) {
        return
      }
      foldRoot.isFoldingTransition = true
      this.$nextTick(() => {
        foldRoot.isFold = !foldRoot.isFold
        if (!foldRoot.isFold) {
          foldRoot.isFoldInternal = true
          this.$nextTick(() => {
            foldRoot.isFoldInternal = false
          })
        } else {
          foldRoot.isFoldInternal = true
          // this.$nextTick(() => {
          //   foldRoot.isFoldInternal = false
          // })
        }
      })
    },
    onFoldTransitionEnd(parent) {
      parent.isFoldingTransition = false
    },
    getLevel(name, level) {
      const LevelInfo = plBsMasterKeyValue.level
      if (this.balanceType === '0') {
        if (this.$common.checkHasOwnProperty(LevelInfo.plItems, name)) {
          return LevelInfo.plItems[name]
        }
      }
      if (this.balanceType === '1') {
        if (this.$common.checkHasOwnProperty(LevelInfo.bsItems, name)) {
          return LevelInfo.bsItems[name]
        }
      }
      // if (this.$common.checkHasOwnProperty(LevelInfo.items, name)) {
      //   return LevelInfo.items[name]
      // }

      return level
    },
    getHighlightDirection(name) {
      const HighlightInfo = plBsMasterKeyValue.diff.highlight
      if (this.balanceType === '0') {
        if (this.$common.checkHasOwnProperty(HighlightInfo.plItems, name)) {
          return HighlightInfo.plItems[name]
        }
      }
      if (this.balanceType === '1') {
        if (this.$common.checkHasOwnProperty(HighlightInfo.bsItems, name)) {
          return HighlightInfo.bsItems[name]
        }
      }
      if (this.$common.checkHasOwnProperty(HighlightInfo.items, name)) {
        return HighlightInfo.items[name]
      }

      return 0
    },
  },
  render(h) {
    this.output('テーブル描画 開始')
    const self = this

    self.unit = self.$store.state.mmi.common.displayCategory
    // 均等割した場合の1セルの横幅(%)
    const baseCellWidthPercent =
      100 / ((this.tableData.headerList.length || 0) + 1)
    const bodyWidthPercent = 100 - baseCellWidthPercent

    let cellsPercentSum = 0
    if (this.tableData.dataList.length) {
      cellsPercentSum = this.tableData.dataList[0].value.reduce((sum, d) => {
        const CellType = this.getCellInfo(d.type)
        return sum + CellType.widthPercent
      }, 0)
    }

    const addRow = (data, headerList) => {
      let rowChildren = []
      data.forEach((r, i) => {
        const level = this.getLevel(r.name, r.level)
        const cols = []
        if (r.children && level > 1) {
          // 畳むためのボタンUI付きの列として表示
          cols.push(
            h(
              FoldingHeader,
              {
                on: {
                  fold: () => {
                    this.onFoldTransitionStart(r)
                  },
                },
                attrs: {
                  style: `width: ${baseCellWidthPercent}%`,
                },
                props: {
                  isFold: r.isFold,
                },
              },
              r.name
            )
          )
        } else {
          // 子要素が無い場合 （level=1は畳めない仕様なので子要素がない扱い）
          cols.push(
            h(
              'td',
              {
                class: 'row-header',
                style: `width: ${baseCellWidthPercent}%`,
              },
              [
                h(
                  'div',
                  {
                    class: 'row-header-text',
                  },
                  r.name
                ),
              ]
            )
          )
        }

        let cellSetCount = 0 // 何番目のヘッダと対応するかをカウント
        let inCellIndex = 0 // ヘッダ内の何セル目と対応するかをカウント
        const HighlightInfo = plBsMasterKeyValue.diff.highlight
        const Threshold = HighlightInfo.threshold || 0 // 比較のハイライトしきい値
        const itemHeightDirection = this.getHighlightDirection(r.name)

        r.value.forEach((d, i) => {
          if (cellSetCount >= headerList.length) {
            return
          }

          const CellType = this.getCellInfo(d.type)
          const cellPercent =
            (CellType.widthPercent / cellsPercentSum) * bodyWidthPercent

          if (
            this.averageBaseValidator(
              headerList[cellSetCount].value,
              cellSetCount,
              this.isOwnCompany
            )
          ) {
            // 表示値
            let cellValue = CellType.format(d.value, i)

            // 表示バリデーションがOKの場合、通常表示する
            let highlight = ''
            let direction = 1.0
            if (CellType.isHighlight) {
              if (itemHeightDirection !== null) {
                if (itemHeightDirection !== 0) {
                  direction = itemHeightDirection
                  const diff = d.value * direction
                  if (diff >= Threshold) {
                    highlight = 'highlight-upward'
                  } else if (diff <= -Threshold) {
                    highlight = 'highlight-downward'
                  } else {
                    highlight = 'darkout'
                  }
                }
              } else {
                cellValue = '-'
                highlight = 'darkout'
              }
            }

            cols.push(
              h(
                'td',
                {
                  class: `${CellType.widthType} ${highlight}`,
                  style: { width: `${cellPercent}%` },
                },
                cellValue
              )
            )
          } else {
            // 表示バリデーションがNGの場合、空文字で表示
            cols.push(
              h(
                'td',
                {
                  class: CellType.widthType,
                  style: { width: `${cellPercent}%` },
                },
                ''
              )
            )
          }

          inCellIndex++
          if (inCellIndex >= this.headerWidthList[cellSetCount]) {
            cellSetCount++
            inCellIndex = 0
          }
        })

        const tr = h('tr', { class: `level-${level}` }, cols)
        rowChildren.push(tr)
        if (r.children) {
          if (!r.isFoldingTransition) {
            // 畳みこみトランジション中でない列は通常表示
            rowChildren = rowChildren.concat(addRow(r.children, headerList))
          } else if (!r.isFold) {
            // 畳みこみトランジション中の列は、Foldingコンポーネントに乗せて表示する
            rowChildren.push(
              h(
                CompanyInfoFolding,
                {
                  props: {
                    isFolded: r.isFoldInternal,
                  },
                  on: {
                    'folding-changed': () => {
                      this.onFoldTransitionEnd(r)
                    },
                  },
                },
                addRow(r.children, headerList)
              )
            )
          }
        }
      })
      return rowChildren
    }
    const rows = addRow(this.tableData.dataList, this.tableData.headerList)
    const tableElements = []

    rows.forEach((e) => {
      tableElements.push(e)
    })

    const tableDomElement = h(
      'table',
      {
        class: 'company-data-gird',
        style: this.tableStyle,
      },
      tableElements
    )

    this.output('テーブル描画 終了')
    return tableDomElement
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  td.row-header {
    position: sticky;
    left: 0px;
    z-index: 10;
  }
  tr:nth-of-type(even) {
    background: none;
  }
  tr {
    .row-header {
      // position: sticky;
      // left: 0;
      &-text {
        // background: red;
        width: 100%;
        height: 100%;
        // border-right: 1px solid blue;
        border-right: none;
        display: flex;
        align-items: center;
      }
    }
    th.unit-cell {
      z-index: 300;
    }
    th.row-header {
      max-width: 504px;
    }
    &.level-0 {
      background-color: #ffecc2;
      border-top: 2px solid #ffffff;
      border-bottom: 4px solid #ffffff;
      td:not(:last-child) {
        border-right: 1px solid #ffffff;
      }

      th,
      td {
        font-size: 17px;
        height: 80px;
      }
      .row-header {
        background-color: inherit;
        border-right: none;
        padding: 0px;
      }
      .row-header-text {
        border-right: 1px solid #ffffff;
        justify-content: left;
        padding-left: 12px;
      }
    }
    &.level-1 {
      background-color: #ebf0fd;
      border-top: 2px solid #ffffff;
      border-bottom: 4px solid #ffffff;
      td:not(:last-child) {
        border-right: 1px solid #ffffff;
      }

      th,
      td {
        height: 64px;
      }
      .row-header {
        background-color: inherit;
        padding: 0px;
      }
      .row-header-text {
        justify-content: left;
        padding-left: 24px;
        border-right: 1px solid #ffffff;
      }
    }
    &.level-2 {
      background-color: #e2e3e5;
      border-bottom: 4px solid #ffffff;
      td:not(:last-child) {
        border-right: 1px solid #ffffff;
      }
      // td.row-header {
      //   // padding-left: 24px;
      // }

      th,
      td {
        height: 56px;
      }
      .row-header {
        padding: 0px;
        border-right: none;
        background-color: inherit;
      }
      .row-header-text {
        padding-left: 24px;
        border-right: 1px solid #ffffff;
        justify-content: left;
      }
    }
    &.level-3 {
      background-color: #f4f4f4;
      border-bottom: 4px solid #ffffff;
      td:not(:last-child) {
        border-right: 1px solid #e6e6e6;
      }

      th,
      td {
        height: 48px;
      }
      .row-header {
        background-color: inherit;
        border-right: none;
      }
      .row-header-text {
        justify-content: left;
        padding-left: 36px;
        border-right: 1px solid #e6e6e6;
      }
    }
    &.level-4 {
      background-color: #ffffff;
      td:not(:last-child) {
        border-right: 1px solid #e6e6e6;
      }
      td.row-header {
        padding: 0px;
        border-right: none;
        // text-align: right;
      }
      .row-header-text {
        justify-content: right;
        padding-right: 12px;
        border-right: 1px solid #e6e6e6;
      }

      th,
      td {
        height: 48px;
      }
      .row-header {
        background-color: inherit;
      }
    }

    &.fold {
      background-color: #ebf0fd;
    }

    td {
      // background: none;
      // border-bottom: 1px solid #e6e6e6;
      border-bottom: none;
    }
    // td.year-header-child {
    //   font-size: 13px;
    // }

    th,
    td {
      // height: 56px;
      text-align: center;
      &.title {
        width: auto;
      }
      &.amount {
        min-width: 125px;
        text-align: right;
        padding-left: 0px;
        padding-right: 12px;
      }
      &.percentage {
        min-width: 65px;
        text-align: right;
        padding-left: 0px;
        padding-right: 12px;
      }
      &.diff {
        min-width: 60px;
        text-align: right;
        padding-left: 0px;
        padding-right: 12px;
      }
      &.highlight-upward {
        color: #34c759;
      }
      &.highlight-downward {
        color: #ff453a;
      }
      &.darkout {
        color: #8d8d8d;
      }
      &.year-header {
        text-align: center;
        border-bottom: 1px solid #e6e6e6;
        min-width: 250px;
        max-width: 504px;
        height: 28px;
        &-first {
          height: 38px;
          max-width: 504px;
          z-index: 20;
          background-color: #ffffff;
        }
        &-narrow {
          min-width: 190px;
        }
        &-child {
          color: #8d8d8d;
          text-align: center;
          border-bottom: 1px solid #e6e6e6;
          height: 40px;
          padding-left: 0px;
          padding-right: 0px;
        }
      }
    }
    td {
      &.title {
        p {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .icon {
          margin-right: 16px;
          cursor: pointer;
        }
      }
    }
  }
}

// }
</style>
