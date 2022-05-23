<template>
  <div class="circulation-page-table">
    <div v-if="publishedFlag === 0" class="no-data">
      <div class="context">
        <h4>
          Webサイトを通して<br />サービス内容や理念を世界に向け配信しましょう
        </h4>
        <button class="btn btn-middle btn-basic" @click="showCreateWebPage()">
          新規ページを作成
        </button>
      </div>
      <div class="image">
        <img :src="$common.getAssetsImgUrl('images/common/nodata_2.png')" />
      </div>
    </div>
    <div v-if="publishedFlag === 1" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="pageTitle">
              <span>ページタイトル</span>
              <SortSpinner
                sort-id="pageTitle"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="pvCount">
              <span>ページビュー数</span>
              <SortSpinner
                sort-id="pvCount"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="uuCount">
              <span>訪問数</span>
              <SortSpinner
                sort-id="uuCount"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="averageVisitedTime">
              <span>平均滞在時間</span>
              <SortSpinner
                sort-id="averageVisitedTime"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="browsingStarts">
              <span>閲覧開始数</span>
              <SortSpinner
                sort-id="browsingStarts"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="bounceRate">
              <span>直帰率</span>
              <SortSpinner
                sort-id="bounceRate"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cvCount">
              <span>コンバージョン数</span>
              <SortSpinner
                sort-id="cvCount"
                :current-type="circulationPageSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pageTitle"></td>
            <td class="pvCount">
              {{ $common.commaSeparate(totalData.pvCount) }}
              <p class="ave">全体平均:{{ totalData.pvCountAve }}</p>
            </td>
            <td class="uuCount">
              {{ $common.commaSeparate(totalData.uuCount) }}
              <p class="ave">全体平均:{{ totalData.uuCountAve }}</p>
            </td>
            <td class="averageVisitedTime">
              {{ totalData.averageVisitedTime }}
              <p class="ave">全体平均:{{ totalData.averageVisitedTimeAve }}</p>
            </td>
            <td class="browsingStarts">
              {{ $common.commaSeparate(totalData.browsingStarts) }}
              <p class="ave">全体平均:{{ totalData.browsingStartsAve }}</p>
            </td>
            <td class="bounceRate">
              {{ totalData.bounceRate }}
              <p class="ave">全体平均:{{ totalData.bounceRateAve }}</p>
            </td>
            <td class="cvCount">
              {{ $common.commaSeparate(totalData.cvCount) }}
              <p class="ave">全体平均:{{ totalData.cvCountAve }}</p>
            </td>
          </tr>
          <tr v-for="(data, index) in circulationPageList" :key="index">
            <td class="pageTitle">
              {{ data.pageTitle }}
            </td>
            <td class="pvCount">
              <p>{{ $common.commaSeparate(data.pvCount) }}</p>
              <p class="rate">{{ data.pvRatio }}</p>
            </td>
            <td class="uuCount">
              <p>{{ $common.commaSeparate(data.uuCount) }}</p>
              <p class="rate">{{ data.uuRatio }}</p>
            </td>
            <td class="averageVisitedTime">
              {{ data.averageVisitedTime }}
            </td>
            <td class="browsingStarts">
              {{ $common.commaSeparate(data.browsingStarts) }}
              <p class="rate">{{ data.browsingRatio }}</p>
            </td>
            <td class="bounceRate">
              {{ data.bounceRate }}
            </td>
            <td class="cvCount">
              {{ $common.commaSeparate(data.cvCount) }}
              <p class="rate">{{ data.cvRatio }}</p>
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
  name: 'CirculationPageTable',
  components: {},
  props: {
    totalData: {
      type: Object,
      default: () => {},
      required: false,
    },
    circulationPageList: {
      type: Array,
      default: () => [],
      required: false,
    },
    publishedFlag: {
      type: Number,
      default: () => null,
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('cms/dashBoardStore', ['circulationPageSelectSortType']),
  },
  methods: {
    ...mapMutations('cms/dashBoardStore', ['setCirculationPageSelectSortType']),
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setCirculationPageSelectSortType(newSelectSortType)
      this.$emit('update')
    },
    /**
     * ページ作成画面に遷移
     */
    showCreateWebPage() {
      this.$router.push('/site/pages/')
    },
  },
}
</script>

<style lang="scss" scoped>
.circulation-page-table {
  .table-scroll {
    table {
      tbody {
        tr {
          height: 58px;
        }
      }
      tr {
        th,
        td {
          &.pageTitle {
            width: auto;
          }
          &.pvCount {
            width: 138px;
            min-width: 138px;
          }
          &.uuCount {
            width: 114px;
            min-width: 114px;
          }
          &.averageVisitedTime {
            width: 131px;
            min-width: 131px;
          }
          &.browsingStarts {
            width: 118px;
            min-width: 118px;
          }
          &.bounceRate {
            width: 114px;
            min-width: 114px;
          }
          &.cvCount {
            width: 148px;
            min-width: 148px;
          }
          .ave {
            font-size: 12px;
            color: #8d8d8d;
            margin-top: 3px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .rate {
            font-size: 13px;
            margin-top: 2px;
            color: #8d8d8d;
          }
        }
      }
    }
  }
  .no-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 350px;
    padding: 40px 60px;
    border: 1px solid #e5e5e5;
    .context {
      h4 {
        color: #1e1e1e;
      }
      .btn {
        margin-top: 24px;
      }
    }
    .image {
      width: 360px;
      margin-left: 68px;
    }
  }
}
</style>
