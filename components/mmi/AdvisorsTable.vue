<template>
  <div v-if="list.length > 0" class="table-area">
    <div class="table-scroll">
      <table class="advisors-list">
        <thead>
          <tr>
            <th class="cell-selector"></th>
            <th class="cell-code">
              <span>会社コード</span>
            </th>
            <th class="cell-title">
              <span>会計事務所名</span>
            </th>
            <th class="cell-desc">
              <span>事業年度</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(d, index) in list"
            :key="index"
            :class="{ selected: selected === index }"
            @click="onAdvisorSelected(index)"
          >
            <td class="cell-selector">
              <input v-model="selected" type="radio" :value="index" />
            </td>
            <td class="cell-code">{{ d.parentCompanyCode }}</td>
            <td class="cell-title">
              <span>{{ d.parentCompanyName }}</span>
            </td>
            <td class="cell-desc">{{ placeholderFilter(d.businessYear) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvisorsTable',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: 0,
      list: this.value,
      tableOption: {},
      currentPage: 1,
      settingShowNum: 20,
      mySort: {
        sort: '',
        order: '',
      },
    }
  },
  watch: {
    value(value) {
      this.list = value
      this.selected = this.list.findIndex((e) => {
        return e.selectedFlg === '1'
      })
    },
  },
  methods: {
    onAdvisorSelected(index) {
      if (index >= 0 && index < this.list.length) {
        this.selected = index
        this.$emit('selected', this.list[this.selected])
      }
    },
    /*
     * 不可視文字のハイフン化
     */
    placeholderFilter(value) {
      if (value === null || value === '') {
        return '－'
      }
      return value
    },
  },
}
</script>

<style lang="scss" scoped>
.table-area {
  position: relative;
  border-top: 1px solid #ebeced;
  padding-top: 30px;
  margin-top: 30px;
  > .flex {
    .table-option-container {
      display: flex;
      align-items: center;
      > * {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}

.table-scroll {
  margin-top: 17px;
  table.advisors-list {
    min-width: 712px;
    .cell-selector {
      width: 40px;
      min-width: 40px;
      padding: 10px;
    }
    .cell-code {
      width: 108px;
      min-width: 108px;
    }
    .cell-desc {
      width: 200px;
      min-width: 200px;
    }
    .cell-title {
      width: auto;
      min-width: 80px;
    }
    tr.selected {
      border: 1.5px solid #007aff;
    }
  }
}

.selected-mark {
  margin: 2px 2px;
  padding: 1px 10px;
  border: 1px solid #101010;
  border-radius: 2px;
}

.company-link {
  display: flex;
  span {
    width: 100%;
  }
  span:hover {
    background-color: #ebeced;
  }
}
</style>
