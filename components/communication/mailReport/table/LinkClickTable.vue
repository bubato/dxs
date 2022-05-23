<template>
  <div class="link-click-table">
    <h4>リンククリック</h4>
    <div class="table-scroll">
      <table :class="{ 'show-scrollBar': linkClickData.length > 2 }">
        <thead>
          <tr>
            <th>リンクURL</th>
            <th>クリック数</th>
            <th>コンバージョン数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, i) in linkClickData" :key="i">
            <td class="text-ellipsis">
              {{ data.url }}
            </td>
            <td>{{ data.clickCount }}</td>
            <td>{{ data.cv }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkClickTable',
  components: {},
  props: {
    linkClickData: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.link-click-table {
  margin: 40px 0 0 0;
  & > h4 {
    margin: 0 0 16px 0;
  }
}

.text-ellipsis {
  max-width: 0;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-scroll {
  table {
    tbody {
      max-height: 200px;
      tr {
        height: 58px;
      }
    }
    tr {
      th,
      td {
        &:nth-of-type(1) {
          width: auto;
        }
        &:nth-of-type(2) {
          width: 200px;
          min-width: 200px;
        }
        &:nth-of-type(3) {
          width: 220px;
          min-width: 220px;
        }
      }
    }
    &.show-scrollBar {
      td {
        &:nth-of-type(3) {
          width: 203px;
          min-width: 203px;
        }
      }
    }
  }
}
</style>
