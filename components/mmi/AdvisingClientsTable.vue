<template>
  <div class="table-area">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="cell-code">
              <span>会社コード</span>
              <SortSpinner
                sort-id="companyCode"
                :current-type="advisingSort"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cell-id">
              <span>テナントID</span>
              <SortSpinner
                sort-id="tenantId"
                :current-type="advisingSort"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cell-title">
              <span>企業名</span>
              <SortSpinner
                sort-id="companyName"
                :current-type="advisingSort"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cell-desc">
              <span>事業年度</span>
              <SortSpinner
                sort-id="businessYear"
                :current-type="advisingSort"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cell-desc">
              <span>担当者</span>
              <SortSpinner
                sort-id="managerName"
                :current-type="advisingSort"
                @spinner-click="updateSortTable($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, index) in list" :key="index">
            <td class="cell-code">{{ d.companyCode }}</td>
            <td class="cell-id">{{ d.tenantId }}</td>
            <td class="cell-title">
              <a
                class="link-text link-color-black"
                @click="onCompanySelected(d)"
              >
                <span>{{ d.companyName }}</span>
              </a>
            </td>
            <td class="cell-desc">{{ d.businessYear }}</td>
            <td class="cell-desc">{{ d.manager }}</td>
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
      list: this.value.resultDataList,
      tableOption: {},
      advisingSort: {
        sort: '',
        order: '',
      },
    }
  },
  watch: {
    value(value) {
      if (!value.resultDataList) {
        this.list = []
      }
      this.list = value.resultDataList
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
    min-width: 1000px;
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
</style>
