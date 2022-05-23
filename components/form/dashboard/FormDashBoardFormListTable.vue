<template>
  <div class="form-list">
    <div v-if="publishedFlag === 0" class="no-data">
      <div class="context">
        <h4>フォームを作成して<br />オンラインで新規顧客を獲得しましょう</h4>
        <button
          class="btn btn-middle btn-basic"
          @click="showCreateNewFormModal()"
        >
          新規フォームを作成
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
            <th class="formTitle">
              <span>フォームタイトル</span>
              <SortSpinner
                sort-id="formTitle"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="inputNum">
              <span>入力数</span>
              <SortSpinner
                sort-id="inputNum"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="confirmTransitionRate">
              <span>確認への遷移率</span>
              <SortSpinner
                sort-id="confirmTransitionRate"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="confirmNum">
              <span>確認数</span>
              <SortSpinner
                sort-id="confirmNum"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cvTransitionRate">
              <span>CVへの遷移率</span>
              <SortSpinner
                sort-id="cvTransitionRate"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="cvNum">
              <span>CV数</span>
              <SortSpinner
                sort-id="cvNum"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="formTitle"></td>
            <td class="inputNum">
              <p>{{ sumFormData.inputNum }}</p>
              <p class="ave">全体平均:{{ sumFormData.inputNumAve }}</p>
            </td>
            <td class="confirmTransitionRate">
              <p>{{ sumFormData.confirmTransitionRate }}</p>
              <p class="ave">
                全体平均:{{ sumFormData.confirmTransitionRateAve }}
              </p>
            </td>
            <td class="confirmNum">
              <p>{{ sumFormData.confirmNum }}</p>
              <p class="ave">全体平均:{{ sumFormData.confirmNumAve }}</p>
            </td>
            <td class="cvTransitionRate">
              <p>{{ sumFormData.cvTransitionRate }}</p>
              <p class="ave">全体平均:{{ sumFormData.cvTransitionRateAve }}</p>
            </td>
            <td class="cvNum">
              <p>{{ sumFormData.cvNum }}</p>
              <p class="ave">全体平均:{{ sumFormData.cvNumAve }}</p>
            </td>
          </tr>
          <tr v-for="form in formList" :key="form.formId">
            <td class="formTitle">
              {{ form.title }}
            </td>
            <td class="inputNum">
              {{ form.inputNum }}
              <p class="rate">{{ form.inputNumRate }}</p>
            </td>
            <td class="confirmTransitionRate">
              {{ form.confirmTransitionRate }}
            </td>
            <td class="confirmNum">
              {{ form.confirmNum }}
              <p class="rate">{{ form.confirmNumRate }}</p>
            </td>
            <td class="cvTransitionRate">
              {{ form.cvTransitionRate }}
            </td>
            <td class="cvNum">
              {{ form.cvNum }}
              <p class="rate">{{ form.cvNumRate }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CreateNewFormModal
      v-if="showCreateNewFormModalFlg"
      @close="hideCreateNewFormModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FormDashBoardFormListTable',
  components: {},
  props: {
    sumFormData: {
      type: Object,
      default: () => {},
      required: false,
    },
    formList: {
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
    return {
      showCreateNewFormModalFlg: false,
    }
  },
  computed: {
    ...mapState('form/dashboard', ['selectSortType']),
  },
  methods: {
    ...mapMutations('form/dashboard', ['setSelectSortType']),
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setSelectSortType(newSelectSortType)
      this.$emit('update')
    },
    /**
     * 新規フォーム作成モーダルを表示
     */
    showCreateNewFormModal() {
      this.showCreateNewFormModalFlg = true
    },
    /**
     * 新規フォーム作成モーダルを非表示
     */
    hideCreateNewFormModal() {
      this.showCreateNewFormModalFlg = false
    },
  },
}
</script>

<style lang="scss" scoped>
.table-scroll {
  table {
    tbody {
      tr {
        height: 64px;
      }
    }
    tr {
      th,
      td {
        &.formTitle {
          width: auto;
        }
        &.inputNum {
          min-width: 115px;
          width: 115px;
        }
        &.confirmTransitionRate {
          width: 137px;
          min-width: 137px;
        }
        &.confirmNum {
          min-width: 114px;
          width: 114px;
        }
        &.cvTransitionRate {
          min-width: 127px;
          width: 127px;
        }
        &.cvNum {
          min-width: 114px;
          width: 114px;
        }
        .ave {
          font-size: 12px;
          color: #8d8d8d;
          margin-top: 3px;
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
</style>
