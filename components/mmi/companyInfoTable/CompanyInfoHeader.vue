<template>
  <thead class="company-info-header">
    <tr>
      <th class="row-header title-line unit-cell" :style="cellStyle">
        <div class="row flex flex-center unit-selector">
          表示単位
          <CustomInputSelect
            v-model="unitValue"
            class="unit-select"
            :options="unitOptions"
            :validation="[]"
            @input="onUnitInput"
          />
        </div>
      </th>
      <th
        v-for="(h, i) in nameHeader"
        :key="i"
        class="company-header title-line"
        :style="{ width: `${h.width}%`, minWidth: `${h.minWidth}px` }"
        :colspan="h.colspan"
      >
        <div class="title">
          <b>{{ h.name }}</b>
        </div>
      </th>
    </tr>
    <tr>
      <th class="row-header desc-line" :style="cellStyle"></th>
      <th
        v-for="(h, i) in headerInfo"
        :key="i"
        class="company-header desc-line"
        :class="{
          'company-header-narrow': headerCellWidthList[i] < 3,
          'merged-header': mergeCellInfo[i].isMerged,
        }"
        :style="{ width: `${headerCellWidthPercentList[i]}%` }"
      >
        <div v-if="averageBaseTitle" class="desc">
          {{ averageBaseTitle }}:
          {{ averageBaseFormatter(h.value, i, isOwnCompany) }}
        </div>
      </th>
    </tr>

    <tr>
      <td
        class="row-header year-header-first year-header-corner"
        :style="cellStyle"
      >
        <div class="corner-content"></div>
      </td>
      <td
        v-for="(h, i) in headerInfo"
        :key="i"
        :class="{ 'year-header-narrow': headerCellWidthList[i] < 3 }"
        class="year-header"
        :style="{ width: `${headerCellWidthPercentList[i]}%` }"
      >
        {{ h.year }}年
      </td>
    </tr>
    <tr>
      <td
        class="row-header year-header-child year-header-corner"
        :style="cellStyle"
      >
        <!-- <div class="corner-content"></div> -->
      </td>
      <td
        v-for="(h, i) in dataCellWidthPercentList"
        :key="i"
        class="year-header-child"
        :class="h.class"
        :style="h.style"
      >
        {{ h.type }}
      </td>
    </tr>
  </thead>
</template>

<script>
import companyInfoUtility from '~/mixin/mmi/companyInfoUtility.js'

export default {
  name: 'CompanyInfoHeader',
  mixins: [companyInfoUtility],
  props: {
    headerInfo: {
      type: Array,
      default: () => [],
    },
    isOwnCompany: {
      type: Boolean,
      default: false,
    },
    unit: {
      type: String,
      default: '1',
    },
    averageBaseTitle: {
      type: String,
      default: '',
    },
    averageBaseValidator: {
      type: Function,
      default: (v) => true,
    },
    headerCellWidthList: {
      type: Array,
      default: () => [],
    },
    headerCellWidthPercentList: {
      type: Array,
      default: () => [],
    },
    dataCellWidthPercentList: {
      type: Array,
      default: () => [],
    },
    ownCompanyName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      unitOptions: [
        { code: '1', label: '円' },
        { code: '1000', label: '千円' },
        { code: '1000000', label: '百万円' },
      ],
      unitValue: this.unit,
      nameHeader: this.getNameHeader(),
      mergeCellInfo: this.getMergeCellInfo(),
    }
  },
  computed: {
    cellStyle() {
      const w = 100 / ((this.headerInfo.length || 0) + 1)
      return {
        width: `${w}%`,
      }
    },
  },
  watch: {
    headerInfo() {
      this.nameHeader = this.getNameHeader()
      this.mergeCellInfo = this.getMergeCellInfo()
    },
  },
  methods: {
    onUnitInput(value) {
      this.$emit(
        'input',
        this.unitOptions.find((unit) => unit.code === value)
      )
    },
    averageBaseFormatter(value, cellIndex, isOwnCompany) {
      if (!this.averageBaseValidator(value, cellIndex, isOwnCompany)) {
        return '-'
      }
      return value
    },

    /**
     * セル結合済みの社名ヘッダを取得
     */
    getNameHeader() {
      let prev = {}
      return this.headerInfo.reduce((info, h, i) => {
        let minWidth = 250
        if (this.headerCellWidthList[i] < 3) {
          minWidth = 190
        }

        if (prev.name !== h.name) {
          prev = {
            width: this.headerCellWidthPercentList[i],
            minWidth,
            name: h.name,
            colspan: 1,
          }
          info.push(prev)
        } else {
          prev.width += this.headerCellWidthPercentList[i]
          prev.colspan++
          prev.minWidth += minWidth
        }
        return info
      }, [])
    },
    /**
     * セル結合状態の取得
     */
    getMergeCellInfo() {
      let prev = {}
      // const headerMergeInfo = []
      return this.headerInfo.reduce((info, h, i) => {
        if (prev.name === h.name) {
          prev.isMerged = true
        }
        prev = {
          name: h.name,
          isMerged: false,
        }
        info.push(prev)
        return info
      }, [])
    },
  },
}
</script>

<style lang="scss" scoped>
.table-scroll {
  th {
    height: 28px;
  }
}
thead.company-info-header {
  height: 54px;
  tr {
    background: none;
    // height: 20px;
    th {
      color: #8d8d8d;
      // background: none;
      border-bottom: 1px solid #e6e6e6;
      &:not(:last-of-type) {
        border-right: 1px solid #ffffff;
      }
    }
  }
}

div.unit-selector {
  position: absolute;
  top: 0px;
  width: 100%;
  height: calc(100% + 27px);
  border-right: 1px solid #ffffff;
}

th {
  &.company-header {
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
    &.merged-header {
      // background: red;
      border-right: none;
    }
  }
  &.title-line {
    vertical-align: bottom;
    border-bottom: none;
  }
  &.desc-line {
    vertical-align: top;
    border-top: none;
  }
  &.row-header {
    z-index: 30;
    border-right: none;
  }
  &.unit-cell {
    z-index: 300;
    padding: 0px;
  }

  div.title {
    text-align: center;
    position: relative;
    font-size: 15px;
  }
  div.desc {
    text-align: center;
    position: relative;
  }
}

th,
td {
  &.year-header {
    text-align: center;
    background-color: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    min-width: 250px;
    max-width: 504px;
    height: 28px;
    &-first {
      height: 38px;
      max-width: 504px;
      z-index: 20;
      background-color: #ffffff;
      border-bottom: none;
    }
    &-narrow {
      min-width: 190px;
    }
    &-child {
      font-size: 13px;
      color: #8d8d8d;
      background-color: #ffffff;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
      height: 40px;
      padding-left: 0px;
      padding-right: 0px;
      &.amount {
        min-width: 125px;
      }
      &.percentage {
        min-width: 65px;
      }
      &.diff {
        min-width: 60px;
      }
    }
  }
}

.year-header-corner {
  z-index: 1;
  position: sticky;
  left: 0px;
  overflow: visible;
  border-right: none;
}
.corner-content {
  border-right: 1px solid #e6e6e6;
  position: absolute;
  top: 0px;
  left: 0px;
  background: #ffffff;
  width: 100%;
  height: 78px;
  z-index: 400;
}

::v-deep {
  .unit-select {
    margin: 0px 4px;
    select {
      position: relative;
      height: 30px;
      width: 84px;
      padding: 1px 17px 1px 8px;
    }
  }
}
</style>
