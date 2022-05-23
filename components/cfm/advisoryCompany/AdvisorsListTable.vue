<template>
  <div class="advisors-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="companyCode">
              <span>会社コード</span>
              <SortSpinner
                sort-id="companyCode"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="tenantId">
              <span>テナントID</span>
              <SortSpinner
                sort-id="tenantId"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="companyName">
              <span>企業名</span>
              <SortSpinner
                sort-id="companyName"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="managerName">
              <span>担当者</span>
              <SortSpinner
                sort-id="managerName"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="latestDate">
              <span>最新データ取得日</span>
              <SortSpinner
                sort-id="latestDate"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(advisors, index) in advisorsList" :key="index">
            <td class="companyCode">
              {{ advisors.companyCode }}
            </td>
            <td class="tenantId">
              {{ advisors.tenantId }}
            </td>
            <td class="companyName">
              <a
                class="link-text link-color-black"
                @click="transitionForecastReportScreen(advisors.linkageId)"
              >
                <CheckCircleSVG
                  v-if="advisors.predictiveStatus === '0'"
                  class="icon icon-checkCircle"
                />
                <ErrorSVG
                  v-if="advisors.predictiveStatus === '1'"
                  class="icon icon-error"
                />
                <RemoveCircleSVG
                  v-if="advisors.predictiveStatus === '9'"
                  class="icon icon-removeCircle"
                />
                <span class="link-text link-color-black">{{
                  advisors.companyName
                }}</span>
              </a>
            </td>
            <td class="managerName">
              {{ advisors.managerName }}
            </td>
            <td class="latestDate">
              {{ advisors.latestDate }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AdvisorsListTable',
  props: {
    advisorsList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('cfm/advisoryCompanyStore', ['selectSortType']),
  },
  methods: {
    ...mapMutations('cfm/advisoryCompanyStore', [
      'setSelectSortType',
      'setSelectLinkageId',
    ]),
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setSelectSortType(newSelectSortType)
      this.$emit('update')
    },
    /**
     * 資金繰り予測レポート画面に遷移
     *
     * @param {string} linkageId 連携ID
     */
    transitionForecastReportScreen(linkageId) {
      this.setSelectLinkageId(linkageId) // 選択した顧問先情報をvuexに設定

      this.$router.push('/cashFlowManagement/forecastReport/')
    },
  },
}
</script>

<style lang="scss" scoped>
.advisors-list-table {
  .table-scroll {
    table {
      tbody {
        tr {
          height: 48px;
        }
      }
      tr {
        th,
        td {
          &.companyCode {
            width: 120px;
            min-width: 120px;
          }
          &.tenantId {
            width: 140px;
            min-width: 140px;
          }
          &.companyName {
            width: auto;
          }
          &.managerName {
            width: 200px;
            min-width: 200px;
          }
          &.latestDate {
            width: 150px;
            min-width: 150px;
          }
        }
        td {
          &.companyName {
            .link-text {
              display: flex;
              align-items: center;
              .icon {
                width: 20px;
                height: 20px;
                margin-right: 8px;
                &-checkCircle {
                  fill: #34c759;
                }
                &-error {
                  fill: #e60012;
                }
                &-removeCircle {
                  fill: #e2e3e5;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
