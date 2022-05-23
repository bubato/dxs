<template>
  <div class="form-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="formTitle">
              <span>フォームタイトル</span>
              <SortSpinner
                sort-id="title"
                :current-type="formSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="lastReplyDateAndTime">
              <span>最終回答日時</span>
              <SortSpinner
                sort-id="last_created_at"
                :current-type="formSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="detail">詳細</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="form in formList" :key="form.formId">
            <td class="formTitle">
              {{ form.title }}
            </td>
            <td class="lastReplyDateAndTime">{{ form.lastAnswerDate }}</td>
            <td class="detail">
              <div v-if="form.answerViewFlag" class="flex flex-center">
                <button
                  class="btn btn-secondary btn-middle btn-report"
                  @click="showContactWebAnswerComponent(form.formId)"
                >
                  レポートを見る
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!$common.checkArrayValue(formList)" class="no-data">
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
    <CreateNewFormModal
      v-if="showCreateNewFormModalFlg"
      @close="hideCreateNewFormModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FormListTable',
  components: {},
  props: {
    formList: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      showCreateNewFormModalFlg: false,
      selectedSortType: {
        id: '',
        type: 'asc',
      },
    }
  },
  computed: {
    ...mapState('cms/dashBoardStore', ['formSelectSortType']),
  },
  methods: {
    ...mapMutations('cms/dashBoardStore', ['setFormSelectSortType']),
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setFormSelectSortType(newSelectSortType)
      this.$emit('update')
    },
    /**
     * 回答レポート画面の表示
     *
     * @param {number} formId フォームID
     */
    showContactWebAnswerComponent(formId) {
      this.$router.push('/form/answer/' + formId)
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
.lastReplyDateAndTime {
  width: 200px;
}

.detail {
  width: 200px;
}

.form-list-table {
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
          &.formTitle {
            width: auto;
          }
          &.lastReplyDateAndTime {
            width: 142px;
            min-width: 142px;
          }
          &.detail {
            width: 140px;
            min-width: 140px;
          }
        }
        td {
          &.detail {
            padding: 0;
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
