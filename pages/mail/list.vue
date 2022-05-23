<template>
  <div class="mail-list">
    <div class="main-contents">
      <div
        class="header"
        :class="{
          listNone: updateListNone,
        }"
      >
        <h2 class="header-title">メール一覧</h2>
        <button
          v-show="updateListNone"
          class="btn btn-basic btn-long"
          @click="showMailCreateModal()"
        >
          新規メール作成
        </button>
      </div>
      <div v-if="updateListNone" class="contents listNone">
        <h2 class="context">
          顧客に最新の情報やトピックスを直接届けましょう。
        </h2>
        <button class="btn btn-basic btn-long" @click="showMailCreateModal()">
          メール作成へ進む
        </button>
        <div class="image">
          <img :src="$common.getAssetsImgUrl('images/common/nodata_1.png')" />
        </div>
      </div>
      <div v-else class="contents">
        <div class="searchArea">
          <CustomInputText
            v-model="requestData.keyword"
            placeholder="メールタイトルを入力して検索してください"
            view-type="search"
            :validation="validationSearchText"
            @submit="updateMailListData('filter')"
          />
          <button class="btn btn-basic btn-long" @click="showMailCreateModal()">
            新規メール作成
          </button>
        </div>
        <div class="filteringArea">
          <SelectSearchResult
            :select-search-result-type="selectSearchResultType"
            :search-result-all="allResult"
            :search-result-filter="searchResult"
            @changeSelectSearchResult="
              updateMailListData($event, 'SelectSearchResult')
            "
          />
          <CustomInputCheckbox
            v-model="filteringCheckbox.vModel"
            :options="filteringCheckbox.options"
            name="filteringCheckbox"
            class="filteringCheckbox"
            @input="updateMailListData(selectSearchResultType, 'checkbox')"
          />
        </div>
        <div
          v-if="selectSearchResultType === 'filter' && searchResult === 0"
          class="searchDataNone"
        >
          <p>検索条件に一致するメールがありませんでした。</p>
          <p>メール名を省略しないで検索するなど別の方法をお試しください。</p>
        </div>
        <template v-else>
          <div class="pagerWrap">
            <SettingShowNum
              :setting-show-num="requestData.limit"
              @update="updateSettingShowNum($event)"
            />
            <PageNav
              :current-page="requestData.offset"
              :setting-show-num="requestData.limit"
              :max-data-num="maxDataNum"
              @showPrevPage="showPrevPage()"
              @showNextPage="showNextPage()"
            />
          </div>
          <ListMailTable
            :mail-list="mailList"
            @updateMailListData="updateMailListData('all', 'mailTable')"
            @sortChange="onSortChanged()"
          />
        </template>
      </div>
    </div>
    <ListMailCreateModal
      v-if="mailCreateModalFlg"
      @close="hideMailCreateModal()"
    />
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      requestData: {
        keyword: '',
        mailStatus: '0,1,2,3,4,5',
        sort: '',
        order: 0,
        offset: 1,
        limit: 20,
      },
      mailStatusDefault: '0,1,2,3,4,5',
      allResult: 0,
      searchResult: 0,
      mailList: [],
      selectSearchResultType: 'all',
      maxDataNum: 0,
      validationSearchText: [
        {
          type: 'maxlength',
          maxlength: 50,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 50,
          }),
        },
      ],
      filteringCheckbox: {
        vModel: [],
        options: [],
      },
    }
  },
  computed: {
    ...mapState('mail/mailList', [
      'selectSortType',
      'mailStatus',
      'mailCreateModalFlg',
    ]),
    /**
     * メール0件判定
     *
     * @return {boolean} 判定値
     */
    updateListNone() {
      let result = false

      if (this.selectSearchResultType === 'all' && this.allResult === 0) {
        result = true
      }

      return result
    },
    /**
     * mailStatus最新化
     *
     * @return {string} mailStatus設定値
     */
    updateMailStatus() {
      let result = ''

      if (this.filteringCheckbox.vModel.length === 4) {
        result = this.mailStatusDefault
      } else {
        for (const i in this.filteringCheckbox.vModel) {
          result = result + this.filteringCheckbox.vModel[i] + ','
        }

        result = result.slice(0, -1)
      }

      return result
    },
  },
  created() {
    this.getMailListData()
    this.updateFilteringOptions()
  },
  methods: {
    ...mapMutations('mail/mailList', [
      'showMailCreateModal',
      'hideMailCreateModal',
    ]),
    /**
     * 表示絞り込み(CustomInputCheckbox) 選択肢生成
     */
    updateFilteringOptions() {
      const pushObject = (object) => {
        const setData = ['0', '1', '3', '4']

        for (const i in setData) {
          if (setData[i] === object.value) {
            this.filteringCheckbox.options.push(object)
          }
        }
      }

      for (const i in this.mailStatus) {
        pushObject(this.mailStatus[i])
      }

      this.updateFilteringModel()
    },
    /**
     * 表示絞り込み(CustomInputCheckbox) 初期化（すべてcheck済に）
     */
    updateFilteringModel() {
      this.filteringCheckbox.vModel = []

      for (const i in this.filteringCheckbox.options) {
        this.filteringCheckbox.vModel.push(
          this.filteringCheckbox.options[i].value
        )
      }
    },
    /**
     * メール一覧取得
     */
    getMailListData() {
      const paramData = {
        mailStatus: this.requestData.mailStatus,
        sort: this.requestData.sort,
        order: this.requestData.order,
        offset: this.requestData.offset,
        limit: this.requestData.limit,
      }

      if (this.selectSearchResultType === 'filter') {
        paramData.keyword = this.requestData.keyword
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailListData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.allResult = resData.data.allResult
            this.mailList = resData.data.mailList
            this.searchResult = resData.data.searchResult
            this.maxDataNum = this.allResult

            if (this.selectSearchResultType === 'filter') {
              this.maxDataNum = this.searchResult
            }
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
     * メール一覧更新
     *
     * @param {string} e 選択欄(すべて／検索結果)への設定値
     * @param {string} clickObject 動作させたobject
     */
    updateMailListData(e, clickObject) {
      if (
        clickObject !== 'SelectSearchResult' ||
        (this.searchResult !== 0 && this.selectSearchResultType === 'all') ||
        this.selectSearchResultType !== 'all'
      ) {
        this.requestData.sort = ''
        this.requestData.offset = 1
        this.requestData.limit = 20
        this.selectSearchResultType = e

        if (clickObject === 'mailTable') {
          this.requestData.keyword = ''
        }

        if (clickObject === 'checkbox') {
          this.requestData.mailStatus = this.updateMailStatus
        } else {
          this.updateFilteringModel()
          this.requestData.mailStatus = this.mailStatusDefault
        }

        this.getMailListData()
      }
    },
    /**
     * 前のページに移動
     */
    showPrevPage() {
      this.requestData.offset--
      this.getMailListData()
    },
    /**
     * 次のページに移動
     */
    showNextPage() {
      this.requestData.offset++
      this.getMailListData()
    },
    /**
     * 表示件数の更新
     *
     * @param {number} setLimit 表示総数
     */
    updateSettingShowNum(setLimit) {
      if (setLimit === undefined) {
        setLimit = this.requestData.limit
      }

      this.requestData.limit = setLimit
      this.requestData.offset = 1
      this.getMailListData()
    },
    /**
     * テーブルソート処理
     */
    onSortChanged() {
      this.requestData.sort = this.selectSortType.sort
      this.requestData.order = this.selectSortType.order
      this.getMailListData() // ファイル一覧の取得
    },
  },
  head() {
    return {
      title: 'メール一覧',
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
    &.listNone {
      padding-bottom: 25px;
      border-bottom: 1px solid #e5e5e5;
    }
    .btn {
      margin-top: 4px;
    }
  }
  .contents {
    &.listNone {
      padding-top: 40px;
      text-align: center;
      .btn {
        margin: 0 auto;
        margin-top: 24px;
        width: 200px;
      }
    }
    .context {
      font-size: 22px;
    }
    .image {
      margin-top: 40px;
    }
    .searchArea {
      display: flex;
      .custom-input-text {
        width: 100%;
        margin-right: 61px;
      }
    }
    .filteringArea {
      display: flex;
      margin-top: 24px;
      padding-bottom: 30px;
      border-bottom: 1px solid #e5e5e5;
      .select-search-result {
        margin-right: 40px;
      }
    }
    .filteringCheckbox {
      padding-top: 10px;
    }
    .pagerWrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
      .setting-show-num {
        margin-right: 40px;
      }
    }
    .searchDataNone {
      margin-top: 24px;
      text-align: center;
    }
    &::v-deep .custom-input-checkbox.horizon-layout .checkbox_list label p {
      padding-right: 12px;
    }
  }
}
</style>
