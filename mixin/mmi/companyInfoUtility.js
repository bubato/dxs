export default {
  data() {
    const TermSet = 3 // １期分のセル数
    const CellType = {
      金額: {
        widthType: 'amount',
        widthPercent: 50, // 125px,
        format: this.formatCurrency,
        isHighlight: false,
        hasUnit: true,
      },
      構成比: {
        widthType: 'percentage',
        widthPercent: 26, // 75px
        format: this.formatPercent,
        isHighlight: false,
      },
      比較: {
        widthType: 'diff',
        widthPercent: 24, // 60px
        format: this.formatDiff,
        isHighlight: true,
      },
    }

    const averageBaseInfo = {
      corporate: {
        title: '企業数',
        validator: (v, cellIndex, isOwnCompany) => {
          if (isOwnCompany) {
            if (cellIndex === 0) {
              if (v < 1) {
                return false
              }
              return true
            }
          }

          if (v < 3) {
            return false
          }
          return true
        },
      },
      employee: {
        title: '従業員数',
        validator: (v, cellIndex, isOwnCompany) => {
          if (v <= 0) {
            return false
          }
          return true
        },
      },
    }
    return {
      CellType,
      averageBaseInfo,
      TermSet,
    }
  },
  methods: {
    /**
     * テーブル全非表示判定
     * @param {*} tableData
     * @param {*} tableType
     * @param {*} isOwnCompany
     * @returns
     */
    isEmptyDataTable(tableData, tableType, isOwnCompany) {
      if (!tableData) {
        return true
      }

      const table = tableData[tableType]
      if (!table) {
        return true
      }

      const averageBaseValidator =
        this.averageBaseInfo[tableType].validator || (() => true)

      if (!table.headerList) {
        return true
      }

      return !table.headerList.find((d, i) => {
        return averageBaseValidator(d.value, i, isOwnCompany)
      })
    },
    isEmptyDataTableColLine(tableData, tableType, colIndex, isOwnCompany) {
      if (!tableData) {
        return true
      }

      const table = tableData[tableType]
      if (!table) {
        return true
      }

      const averageBaseValidator =
        this.averageBaseInfo[tableType].validator || (() => true)

      if (!table.headerList) {
        return true
      }

      const col = table.headerList[colIndex]
      return !averageBaseValidator(col.value, colIndex, isOwnCompany)
    },
    isEmptyDataTableColLineOther(tableData, tableType, colIndex, isOwnCompany) {
      if (!tableData) {
        return true
      }

      const table = tableData[tableType]
      if (!table) {
        return true
      }

      const averageBaseValidator =
        this.averageBaseInfo[tableType].validator || (() => true)

      if (!table.headerList) {
        return true
      }

      return !table.headerList.find((d, i) => {
        if (i === colIndex) {
          return false
        }
        return averageBaseValidator(d.value, i, isOwnCompany)
      })
    },
    output(text) {
      const date = new Date()
      console.log(
        `[MMI] - ${date.toString()}:${date.getMilliseconds()} - ${text}`
      )
    },
    getCellInfo(type) {
      return this.CellType[type.substr(0, 3)]
    },
    getCellSetPercent(widthCount) {
      return Object.values(this.CellType).reduce((sum, cell, i) => {
        if (i < widthCount) {
          sum += cell.widthPercent
        }
        return sum
      }, 0)
    },
    formatCurrency(value) {
      const unit = parseInt(this.unit) || 1
      const amount = parseInt(value / unit, 10) || 0
      return this.$common.commaSeparate(amount)
    },
    formatPercent(value) {
      value = parseFloat(value) || 0.0
      return `${value.toFixed(1)}%`
    },
    formatDiff(value) {
      value = parseFloat(value) || 0.0
      if (value < 0) {
        return `${value.toFixed(1)}`
      }
      return `+${value.toFixed(1)}`
    },
    formatNumber(value) {
      return `${value}`
    },
    getColSpan(companyInfo, index) {
      if (!companyInfo.dataList.length) {
        return 2
      }

      const dataListLine = companyInfo.dataList[0].value.slice(index + 1)
      const nextStartIndex = dataListLine.findIndex((d) => {
        return d.type === '金額'
      })
      if (nextStartIndex < 0) {
        return dataListLine.length + 1
      }
      return nextStartIndex + 1
    },

    getHeaderWidthList(companyInfo) {
      const list = []

      if (!companyInfo) {
        return list
      }
      if (!companyInfo.dataList.length) {
        companyInfo.headerList.forEach((h) => {
          list.push(2)
        })
        return list
      }
      const data = companyInfo.dataList[0].value

      for (let index = 0; index < data.length; ) {
        const w = this.getColSpan(companyInfo, index)
        if (!w) {
          break
        }
        list.push(w)
        index += w
      }
      return list
    },

    /**
     * 期のテーブルデータ取得
     * @param {Object} companyInfo
     * @param {Number} limit (期数・0指定ならすべて)
     * @returns 変換後のテーブルデータ
     */
    getTermFilteredCompanyInfo(companyInfo, limit) {
      const headerWidthList = this.getHeaderWidthList(companyInfo)
      companyInfo = JSON.parse(JSON.stringify(companyInfo))

      const year = {}
      companyInfo.headerList.forEach((h) => {
        year[h.year] = h.year
      })

      const yearList = Object.values(year)
      yearList.sort((a, b) => b - a)
      if (yearList.length <= limit || !limit) {
        return companyInfo
      }

      companyInfo.dataList.filter((row) => {
        let cellSetCount = 0 // 何番目のヘッダと対応するかをカウント
        let inCellIndex = 0 // ヘッダ内の何セル目と対応するかをカウント
        row.value = row.value.filter(() => {
          const y = companyInfo.headerList[cellSetCount].year
          const isNotFiltered = yearList.indexOf(y) < limit

          inCellIndex++
          if (inCellIndex >= headerWidthList[cellSetCount]) {
            cellSetCount++
            inCellIndex = 0
          }
          return isNotFiltered
        })
      })

      companyInfo.headerList = companyInfo.headerList.filter((h, i) => {
        return yearList.indexOf(h.year) < limit
      })

      return companyInfo
    },
    getCompanyInfoFilename(name, balanceType, term) {
      let filename = ''
      switch (balanceType) {
        case '0':
          filename += 'PL(損益計算書)_'
          break
        case '1':
          filename += 'BS(貸借対照表)_'
          break
        case '2':
          filename += '変動損益計算書_'
          break
      }

      filename += name.replace(/[\\"<>|:*?/]/, '-')

      if (term) {
        filename += `_${term}期`
      }

      return filename
    },
  },
}
