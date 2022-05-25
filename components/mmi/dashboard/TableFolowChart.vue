<template>
  <div class="table-area">
    <div class="table-scroll">
      <table class="max-content">
        <thead>
          <tr>
            <th class="cell-space">
              <span></span>
            </th>
            <th class="cell-code">
              <span>2021年</span>
            </th>
            <th class="cell-code">
              <span>2020年</span>
            </th>
            <th class="cell-code">
              <span>2019年</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, index) in list" :key="index">
            <td class="cell-space">{{ d.name }}</td>
            <td class="cell-code">{{ d.companyCode }}</td>
            <td class="cell-code">{{ d.companyCode }}</td>
            <td class="cell-code">{{ d.companyCode }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvisingClientsTable',
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      list: this.value,
      tableOption: {},
      advisingSort: {
        sort: '',
        order: '',
      },
    }
  },
  watch: {
    value(value) {
      if (!value) {
        this.list = []
      }
      this.list = value
    },
  },
  methods: {
    updateSortTable(e) {
      this.advisingSort.sort = e.sort
      this.advisingSort.order = e.order
      this.currentPage = 1
      this.$emit('sortChange', e)
    },
    onCompanySelected(client) {
      this.$emit('companySelect', client.linkageId)
    },
  },
}
</script>

<style lang="scss" scoped>
.table-area {
  position: relative;
}

.table-scroll {
  margin-top: 17px;
  table {
    .cell-code {
      width: 108px;
      min-width: 108px;
    }
    .cell-id {
      width: 140px;
      min-width: 140px;
    }
    .cell-desc {
      width: 200px;
      min-width: 200px;
    }
    .cell-title {
      width: auto;
      min-width: 80px;
    }
  }
}

.link-text {
  display: flex;
}
.max-content {
    width: 100%;
    min-width: 0px !important;
}
.cell-space {
    width: 50%;
}
</style>
