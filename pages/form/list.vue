<template>
  <div class="form-list">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">フォーム一覧</h2>
        <button
          v-if="$common.checkArrayValue(formList)"
          class="btn btn-basic btn-long"
          @click="showCreateNewFormModal()"
        >
          新規フォームを作成
        </button>
      </div>
      <div class="contents">
        <div v-if="$common.checkArrayValue(formList)" class="table-area">
          <!-- ph1では不要
          <div class="table-options">
            <SettingShowNum
              :setting-show-num="formListPaging.limit"
              @update="updateSettingShowNum($event)"
            />
            <PageNav
              :current-page="formListPaging.offset"
              :setting-show-num="formListPaging.limit"
              :max-data-num="formListPaging.maxDataNum"
              @showPrevPage="showPrevPage()"
              @showNextPage="showNextPage()"
            />
          </div>
          -->
          <FormListTableComponent @update="getFormList()" />
        </div>
        <div v-else class="no-data">
          <div class="context">
            <h2>フォームを作成してオンラインで新規顧客を獲得しましょう</h2>
            <button
              class="btn btn-basic btn-long"
              @click="showCreateNewFormModal()"
            >
              新規フォームを作成
            </button>
          </div>
          <div class="image">
            <img :src="$common.getAssetsImgUrl('images/common/nodata_1.png')" />
          </div>
        </div>
      </div>
    </div>
    <CommonFooter />
    <CreateNewFormModal
      v-if="showCreateNewFormModalFlg"
      @close="hideCreateNewFormModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      showCreateNewFormModalFlg: false,
      formListPaging: {
        limit: 20,
        offset: 1,
        maxDataNum: 0,
      },
    }
  },
  computed: {
    ...mapState('form/formList', [
      'formList',
      'formListScreen',
      'formSelectSortType',
    ]),
  },
  created() {
    this.resetFormSelectSortType() // ソート情報のリセット
    this.getFormList()
  },
  mounted() {},
  methods: {
    ...mapMutations('form/formList', [
      'setFormList',
      'resetFormSelectSortType',
    ]),
    getFormList() {
      const paramData = {}

      if (this.formSelectSortType.sort) {
        paramData.sort = this.formSelectSortType.sort
        paramData.order = this.formSelectSortType.order
      }

      this.$common.addCallApiNum()
      this.$api
        .getFormList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.formListPaging.maxDataNum = resData.data.searchResult
            this.setFormList(resData.data.formList)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
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
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(limit) {
      this.formListPaging.limit = limit
      this.formListPaging.offset = 1
      this.getFormList()
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.formListPaging.offset += 1
      this.getFormList()
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.formListPaging.offset -= 1
      this.getFormList()
    },
  },
  head() {
    return {
      title: 'フォーム一覧｜フォーム｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 32px;
    border-bottom: 1px solid #e5e5e5;
  }
  .contents {
    padding-top: 32px;
    .table-options {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      > * {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
    .no-data {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      width: 100%;
      .context {
        h2 {
          color: #1e1e1e;
        }
        .btn {
          margin: 24px auto 0 auto;
        }
      }
      .image {
        width: 716px;
        height: 537px;
        margin-top: 24px;
        text-align: center;
      }
    }
  }
}
</style>
