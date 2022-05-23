<template>
  <div class="account-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="checkbox">
              <label for="checkAll">
                <input
                  id="checkAll"
                  :checked="allCheck"
                  type="checkbox"
                  class="input-checkbox"
                  @click="allCheckEvt($event.target.checked)"
                />
                <span></span>
              </label>
            </th>
            <th class="companyCode">
              会社コード<SortSpinner
                sort-id="companyCode"
                :current-type="sortData"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="tenantId">
              テナントID<SortSpinner
                sort-id="tenantId"
                :current-type="sortData"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="companyName">
              企業名<SortSpinner
                sort-id="companyName"
                :current-type="sortData"
                @spinner-click="updateSortTable($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(reading, index) in readingList">
            <tr v-show="reading.showFlg" :key="index">
              <td class="checkbox">
                <label :for="`customer${index}`">
                  <input
                    :id="`customer${index}`"
                    v-model="reading.selectFlag"
                    type="checkbox"
                    :name="`customer${index}`"
                    class="input-checkbox"
                    @change="changeCheckBox()"
                  />
                  <span></span>
                </label>
              </td>
              <td class="companyCode">{{ reading.companyCode }}</td>
              <td class="tenantId">{{ reading.tenantId }}</td>
              <td class="companyName">
                {{ reading.companyName }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadingListTable',
  props: {
    readingList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      sortData: {
        sort: '',
      },
    }
  },
  computed: {
    /**
     * 全てチェックのチェックをつける
     */
    allCheck() {
      const showCount = this.readingList.filter((item) => {
        if (item.showFlg) {
          return item
        }
      }).length
      const showCheckCount = this.readingList.filter((item) => {
        if (item.showFlg && item.selectFlag) {
          return item
        }
      }).length

      if (showCount === showCheckCount) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {},
  mounted() {},
  methods: {
    /**
     * ソート処理
     *
     * @param {Object} sortData order:昇順降順 sort:ソート対象項目
     */
    updateSortTable(sortData) {
      let list = []

      if (sortData.order === 0) {
        // 昇順
        list = this.ascendingOrder(this.readingList, sortData.sort)
      } else {
        // 降順
        list = this.descendingOrder(this.readingList, sortData.sort)
      }
      this.sortData = sortData

      this.$emit('update', list)
    },
    /**
     * ソート昇順
     *
     * @param {Array} list ソート対象リスト
     * @param {String} sortDataName ソート対象項目名
     */
    ascendingOrder(list, sortDataName) {
      return list.sort((itemA, itemB) => {
        const firstSortA = itemA[sortDataName].toUpperCase()
        const firstSortB = itemB[sortDataName].toUpperCase()
        const secondSortA = itemA.companyCode.toUpperCase()
        const secondSortB = itemB.companyCode.toUpperCase()

        if (firstSortA < firstSortB) {
          return -1
        }
        if (firstSortA > firstSortB) {
          return 1
        }
        if (secondSortA < secondSortB) {
          return -1
        }
        if (secondSortA > secondSortB) {
          return 1
        }

        return 0
      })
    },
    /**
     * ソート降順
     *
     * @param {Array} list ソート対象リスト
     * @param {String} sortDataName ソート対象項目名
     */
    descendingOrder(list, sortDataName) {
      return this.ascendingOrder(list, sortDataName).reverse()
    },
    /**
     * 顧問先の閲覧制限 全て選択チェックボックス
     *
     * @param {bool} isChecked 全て選択チェックボックス選択値
     */
    allCheckEvt(isChecked) {
      let newReadingList = JSON.parse(JSON.stringify(this.readingList))

      newReadingList = newReadingList.map((item) => {
        if (item.showFlg) {
          item.selectFlag = isChecked
        }
        return item
      })

      this.$emit('update', newReadingList)
    },
    /**
     * 顧問先の閲覧制限 テナントユーザ毎チェックボックス
     */
    changeCheckBox() {
      this.$emit('update', this.readingList)
    },
  },
}
</script>

<style lang="scss" scoped>
.account-list-table {
  margin-top: 30px;
  .table-scroll {
    margin-top: 17px;
    table {
      thead {
        label {
          span {
            padding-left: 26px;
          }
        }
      }
      tbody {
        max-height: 282px;
        overflow: auto;
        tr {
          height: 48px;
        }
        th,
        td {
          &.checkbox {
            label {
              text-align: center;
              display: flex;
              justify-content: center;
              span {
                width: 21px;
              }
            }
          }
        }
      }
      tr {
        th,
        td {
          &.checkbox {
            width: 100px;
            min-width: 100px;
            text-align: center;
            padding-left: 0;
          }
          &.companyCode {
            width: 108px;
            min-width: 108px;
          }
          &.tenantId {
            width: 140px;
            min-width: 140px;
          }
          &.companyName {
            width: auto;
          }
        }
      }
    }
  }
}
</style>
