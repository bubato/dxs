<template>
  <div>
    <div v-if="table" class="row">
      <div
        ref="headerPane"
        class="table-scroll header-pane"
        @scroll="onHeaderPaneScroll"
      >
        <table class="company-data-gird" :style="tableStyle">
          <CompanyInfoHeader
            :style="tableStyle"
            :header-info="table.headerList"
            :unit="unit"
            :is-own-company="showData.isOwnCompany"
            :average-base-title="averageBaseInfo[tableType].title"
            :average-base-validator="averageBaseInfo[tableType].validator"
            :own-company-name="ownCompanyName"
            :header-cell-width-list="headerWidthList"
            :header-cell-width-percent-list="headerCellWidthPercentList"
            :data-cell-width-percent-list="dataCellWidthPercentList"
            @input="onUnitInput"
          />
        </table>
      </div>
      <div
        ref="mainPane"
        class="table-scroll main-pane"
        @scroll="onMainPaneScroll"
      >
        <FoldingTable
          :table-info="table"
          :is-own-company="showData.isOwnCompany"
          :balance-type="showData.balanceType"
          :average-base-title="averageBaseInfo[tableType].title"
          :average-base-validator="averageBaseInfo[tableType].validator"
          :own-company-name="ownCompanyName"
          :table-style="tableStyle"
        />
      </div>
      <div
        ref="subPane"
        class="table-scroll sub-pane"
        @scroll="onSubPaneScroll"
      >
        <table class="sub-pane-inner" :style="tableStyle"></table>
      </div>
    </div>
    <slot v-else name="placeholder" />
  </div>
</template>

<script>
import CompanyInfoHeader from './CompanyInfoHeader.vue'
import FoldingTable from './FoldingTable.vue'
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'

export default {
  name: 'CompanyInfoTable',
  components: {
    CompanyInfoHeader,
    FoldingTable,
  },
  mixins: [companyInfoUtility],
  props: {
    tableInfo: {
      type: Object,
      required: true,
    },
    isOwnCompany: {
      type: Boolean,
      default: false,
    },
    balanceType: {
      type: String,
      required: true,
    },
    tableType: {
      type: String,
      required: true,
    },
    ownCompanyName: {
      type: String,
      default: null,
    },
  },
  data() {
    const unit = this.$store.state.mmi.common.displayCategory || '1'

    const headerWidthList = this.getHeaderWidthList(this.table)
    const headerCellWidthPercentList = this.getHeaderCellWidthPercentList(
      this.table,
      headerWidthList
    )
    const dataCellWidthPercentList = this.getDataCellWidthPercentList(
      this.table
    )

    const tableWidth = headerWidthList.reduce((sum, w) => {
      if (w === 2) {
        return sum + 190
      } else if (w === 3) {
        return sum + 250
      }
      return sum
    }, 230)

    const showData = {
      balanceType: this.balanceType,
      isOwnCompany: this.isOwnCompany,
    }

    return {
      showData,
      tableStyle: {
        minWidth: `${tableWidth}px`,
      },
      headerWidthList,
      headerCellWidthPercentList,
      dataCellWidthPercentList,
      tableWidth,
      scrollEventSrc: null,
      unit,
    }
  },
  computed: {
    table() {
      if (!this.tableInfo) {
        return null
      }

      return this.tableInfo[this.tableType]
    },
  },
  watch: {
    tableInfo() {
      if (this.table) {
        this.headerWidthList = this.getHeaderWidthList(this.table)
        this.headerCellWidthPercentList = this.getHeaderCellWidthPercentList(
          this.table,
          this.headerWidthList
        )
        this.tableWidth = this.headerWidthList.reduce((sum, w) => {
          if (w === 2) {
            return sum + 190
          } else if (w === 3) {
            return sum + 250
          }
          return sum
        }, 230)

        this.dataCellWidthPercentList = this.getDataCellWidthPercentList(
          this.table
        )

        this.tableStyle.minWidth = `${this.tableWidth}px`

        this.showData = {
          balanceType: this.balanceType,
          isOwnCompany: this.isOwnCompany,
        }
      }
    },
  },
  methods: {
    onUnitInput(unitInfo) {
      this.unit = this.$store.commit(
        'mmi/common/setDisplayCategory',
        unitInfo.code
      )
    },
    getHeaderCellWidthPercentList(table, headerWidthList) {
      if (!table) {
        return null
      }

      // 均等割した場合の1セルの横幅(%)
      const baseCellWidthPercent = 100 / ((table.headerList.length || 0) + 1)
      const bodyWidthPercent = 100 - baseCellWidthPercent

      let cellsPercentSum = 0
      if (table.dataList.length) {
        cellsPercentSum = table.dataList[0].value.reduce((sum, d) => {
          const CellType = this.getCellInfo(d.type)
          return sum + CellType.widthPercent
        }, 0)
      }

      return headerWidthList.map((w) => {
        return (this.getCellSetPercent(w) / cellsPercentSum) * bodyWidthPercent
      })
    },
    getDataCellWidthPercentList(table) {
      if (!table) {
        return null
      }

      // 均等割した場合の1セルの横幅(%)
      const baseCellWidthPercent = 100 / ((table.headerList.length || 0) + 1)
      const bodyWidthPercent = 100 - baseCellWidthPercent

      let cellsPercentSum = 0
      if (table.dataList.length) {
        cellsPercentSum = table.dataList[0].value.reduce((sum, d) => {
          const CellType = this.getCellInfo(d.type)
          return sum + CellType.widthPercent
        }, 0)
      }

      const widthList = []
      if (table.dataList.length) {
        table.dataList[0].value.forEach((d) => {
          const classList = []
          const CellType = this.getCellInfo(d.type)
          if (CellType.widthType) {
            classList.push(CellType.widthType)
          }
          const cellPercent =
            (CellType.widthPercent / cellsPercentSum) * bodyWidthPercent

          widthList.push({
            type: d.type,
            style: { width: `${cellPercent}%` },
            class: classList,
          })
        })
      }

      return widthList
    },
    onTableMinWidthChange(width) {
      const style = {
        minWidth: `${width}px`,
      }
      this.tableStyle = style
    },
    onMainPaneScroll(e) {
      this.syncScrollBar(this.$refs.mainPane, [
        this.$refs.headerPane,
        this.$refs.subPane,
      ])
      // e.stopImmediatePropagation()
    },
    onSubPaneScroll(e) {
      this.syncScrollBar(this.$refs.subPane, [
        this.$refs.mainPane,
        this.$refs.headerPane,
      ])
      // e.stopImmediatePropagation()
    },
    onHeaderPaneScroll(e) {
      this.syncScrollBar(this.$refs.headerPane, [
        this.$refs.mainPane,
        this.$refs.subPane,
      ])
      // e.stopImmediatePropagation()
    },
    syncScrollBar(src, destList) {
      if (this.scrollEventSrc && this.scrollEventSrc !== src) {
        return
      }
      this.scrollEventSrc = src

      if (!src || !destList) {
        return
      }

      destList.forEach((d) => {
        d.scrollTo(src.scrollLeft, 0)
      })
      this.$nextTick(() => {
        this.scrollEventSrc = null
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  tr {
    .row-header {
      position: sticky;
      left: 0;
    }
  }
}

.header-pane {
  position: sticky;
  top: 0px;
  z-index: 500;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  &.table-scroll {
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.main-pane {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  &.table-scroll {
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.sub-pane {
  z-index: 100;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  width: 100%;
  height: 20px;
  position: sticky;
  bottom: 0;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
  &-inner {
    position: relative;
    height: 1px;
  }
}
</style>
