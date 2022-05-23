<template>
  <span>
    <button
      class="btn btn-utility btn-short btn-csv-download"
      :class="{
        'btn-disabled': isEmptyDataTable(tableInfo, tableType, isOwnCompany),
      }"
      @click="onDownloadButtonClick"
    >
      <DownloadSVG class="icon-download" />
      <div class="text-first">CSV</div>
      <div class="text">ファイル</div>
      <div class="text">を出力</div>
    </button>
    <a ref="link" :download="filename + getDateString() + '.csv'" />
  </span>
</template>

<script>
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'
import plBsMasterKeyValue from '~/static/mmi/getPlBsMasterKeyValue.json'

export default {
  name: 'CsvDownloadButton',
  mixins: [companyInfoUtility],
  props: {
    filename: {
      type: String,
      required: true,
    },
    isOwnCompany: {
      type: Boolean,
      default: false,
    },
    tableInfo: {
      type: Object,
      default: null,
    },
    tableType: {
      type: String,
      required: true,
    },
    balanceType: {
      type: String,
      required: true,
    },
    filterInfo: {
      type: Array,
      default: () => [],
    },
    ownCompanyName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      date: new Date(),
    }
  },
  methods: {
    onDownloadButtonClick(e) {
      if (
        this.isEmptyDataTable(this.tableInfo, this.tableType, this.isOwnCompany)
      ) {
        return
      }

      this.date = new Date()
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(
          this.csvFile(),
          this.filename + this.getDateString()
        )
      } else {
        this.$refs.link.href = window.URL.createObjectURL(this.csvFile())
        this.$refs.link.click(e)
      }
    },
    getDateString() {
      const date = new Date()
      const y = `${date.getFullYear()}`.padStart(4, '0')
      const m = `${date.getMonth() + 1}`.padStart(2, '0')
      const d = `${date.getDate()}`.padStart(2, '0')
      return `_${y}${m}${d}`
    },
    isDisabledByHighlight(name) {
      const HighlightInfo = plBsMasterKeyValue.diff.highlight
      if (this.balanceType === '0') {
        if (this.$common.checkHasOwnProperty(HighlightInfo.plItems, name)) {
          if (HighlightInfo.plItems[name] === null) {
            return true
          }
        }
      }
      if (this.balanceType === '1') {
        if (this.$common.checkHasOwnProperty(HighlightInfo.bsItems, name)) {
          if (HighlightInfo.bsItems[name] === null) {
            return true
          }
        }
      }
      if (this.$common.checkHasOwnProperty(HighlightInfo.items, name)) {
        if (HighlightInfo.items[name] === null) {
          return true
        }
      }

      return false
    },

    csvFile() {
      if (!this.tableInfo) {
        return
      }
      const tableData = this.tableInfo[this.tableType]
      if (!tableData) {
        return
      }

      const escape = (value) => {
        value = '' + value
        return `"${value.replace('"', '""')}"`
      }

      const headerList = tableData.headerList
      const headerWidthList = this.getHeaderWidthList(tableData)

      let content = ''
      this.filterInfo.forEach((f) => {
        content +=
          escape(f.header) + ',' + f.value.map(escape).join(',') + '\r\n'
      })

      // ヘッダ行（対象）
      content +=
        `${escape('対象')},` +
        tableData.headerList
          .map((d) => escape(d.name))
          .map((v, i) => {
            return v + ','.repeat(headerWidthList[i] - 1)
          })
          .join(',') +
        '\r\n'

      // ヘッダ行（企業数/従業員数）
      const averageBase = this.averageBaseInfo[this.tableType].title
      const averageBaseValidator =
        this.averageBaseInfo[this.tableType].validator || (() => true)
      content +=
        `${escape(averageBase)},` +
        tableData.headerList
          .map((d, i) => {
            if (averageBaseValidator(d.value, i, this.isOwnCompany)) {
              return escape(d.value) + ','.repeat(headerWidthList[i] - 1)
            } else {
              return escape('-') + ','.repeat(headerWidthList[i] - 1)
            }
          })
          .join(',') +
        '\r\n'

      // ヘッダ行（年度）
      content +=
        `${escape('年度')},` +
        tableData.headerList
          .map((d) => escape(d.year + '年'))
          .map((v, i) => {
            return v + ','.repeat(headerWidthList[i] - 1)
          })
          .join(',') +
        '\r\n'

      tableData.dataList.forEach((line) => {
        let cellSetCount = 0 // 何番目のヘッダと対応するかをカウント
        let inCellIndex = 0 // ヘッダ内の何セル目と対応するかをカウント

        content +=
          `${escape(line.name)},` +
          line.value
            .map((d, i) => {
              if (cellSetCount >= headerList.length) {
                return
              }
              const header = headerList[cellSetCount]
              const typeInfo = this.getCellInfo(d.type)

              inCellIndex++
              if (inCellIndex >= headerWidthList[cellSetCount]) {
                cellSetCount++
                inCellIndex = 0
              }
              if (!averageBaseValidator(header.value, i, this.isOwnCompany)) {
                return ''
              }
              if (typeInfo.isHighlight) {
                if (this.isDisabledByHighlight(line.name)) {
                  return '-'
                }
              }
              return typeInfo.format(d.value)
            })
            .map(escape)
            .join(',') +
          '\r\n'
      })

      const blob = new Blob(['\uFEFF', content], {
        type: 'text/csv',
      })

      return blob
    },
  },
}
</script>

<style lang="scss" scoped>
button.btn-csv-download {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}
.btn-csv-download.btn-disabled {
  color: #e0e0e0;
  .icon-download {
    fill: #e0e0e0;
  }
}
.text {
  &-first {
    padding-left: 8px;
  }
}

.icon-download {
  width: 24px;
  height: 30px;
  margin-top: 1px;
  margin-bottom: 1px;
}
</style>
