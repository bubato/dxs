<template>
  <div class="dash-board">
    <div class="main-contents">
      <!-- 期間選択 -->
      <div class="header">
        <h3 class="header-title">ダッシュボード</h3>
        <CustomDateRangePicker
          v-model="dateRangePicker"
          :start-date="dateRangePicker.startDate"
          :end-date="dateRangePicker.endDate"
          :opens="'left'"
          class="header-select"
          @update="updateDateRangePicker($event)"
        />
      </div>
      <!-- /期間選択 -->
      <!-- ファーストビュー -->
      <div v-if="Object.keys(kpiData).length > 0" class="kpi-data">
        <div class="kpi-data-card">
          <div
            v-for="data in kpiData.sumData"
            :key="data.name"
            class="kpi-data-card-list"
          >
            <div class="first-view-data">
              <div class="first-view-data-title flex">
                {{ data.name
                }}<TooltipHelp
                  :label="tooltipLabel[data.name]"
                  class="tooltip"
                />
              </div>
              <div class="first-view-data-text">
                {{ data.value }}
              </div>
            </div>
            <div class="first-view-contrast">
              <StatusText
                :ratio="data.ratio"
                :status="data.ratioStatus"
                :arrow-reverse="data.name === '直帰率'"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- /ファーストビュー -->
      <!-- 対比チャート -->
      <div
        v-if="
          Object.keys(kpiData).length > 0 &&
          Object.keys(aggregationData).length > 0 &&
          $common.checkArrayValue(aggregationData.data)
        "
        class="daily-chart"
      >
        <DailyChart
          ref="dailyChart"
          :aggregation-data="aggregationData"
          :default-view="defaultView"
          :option-list="optionList"
        />
      </div>
      <!-- /対比チャート -->
      <!-- 閲覧ページ -->
      <div class="circulationPage-list">
        <h4>閲覧ページ</h4>
        <!-- ph1ではページング不要
        <div v-if="$common.checkArrayValue(circulationPageList)" class="table-options">
          <SettingShowNum
            :setting-show-num="circulationPagePaging.limit"
            @update="updateSettingShowNum($event, 'circulationPage')"
          />
          <PageNav
            :current-page="circulationPagePaging.offset"
            :setting-show-num="circulationPagePaging.limit"
            :max-data-num="circulationPagePaging.maxDataNum"
            @showPrevPage="showPrevPage('circulationPage')"
            @showNextPage="showNextPage('circulationPage')"
          />
        </div>
        -->
        <CirculationPageTable
          :total-data="circulationPageTotalData"
          :circulation-page-list="circulationPageList"
          :published-flag="circulationPagePublishedFlag"
          class="table-area"
          @update="reflectCirculationPageTable()"
        />
      </div>
      <!-- /閲覧ページ -->
      <!-- 集客・デバイス別セッション -->
      <div v-if="Object.keys(kpiData).length > 0" class="deviceData-list">
        <AttractingCustomersChart
          v-if="$common.checkArrayValue(kpiData.inflowSource)"
          ref="attractingCustomersChart"
          :chart-data="kpiData.inflowSource"
        />
        <SessionsByDeviceChart
          v-if="$common.checkArrayValue(kpiData.deviceDataList)"
          ref="sessionsByDeviceChart"
          :device-data="kpiData.deviceDataList"
        />
      </div>
      <!-- /集客・デバイス別セッション -->
      <!-- フォーム一覧 -->
      <div class="form-list">
        <h4>フォーム一覧</h4>
        <!-- ph1ではページング不要
        <div v-if="$common.checkArrayValue(formList)" class="table-options">
          <SettingShowNum
            :setting-show-num="formPaging.limit"
            @update="updateSettingShowNum($event, 'form')"
          />
          <PageNav
            :current-page="formPaging.offset"
            :setting-show-num="formPaging.limit"
            :max-data-num="formPaging.maxDataNum"
            @showPrevPage="showPrevPage('form')"
            @showNextPage="showNextPage('form')"
          />
        </div>
        -->
        <FormListTable
          :form-list="formList"
          class="table-area"
          @update="reflectSortFormTable()"
        />
      </div>
      <!-- /フォーム一覧 -->
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import AttractingCustomersChart from '~/components/cms/dashboard/chart/AttractingCustomersChart.vue'
import SessionsByDeviceChart from '~/components/cms/dashboard/chart/SessionsByDeviceChart.vue'
import FormListTable from '~/components/cms/dashboard/table/FormListTable.vue'
import CirculationPageTable from '~/components/cms/dashboard/table/CirculationPageTable.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: {
    AttractingCustomersChart,
    SessionsByDeviceChart,
    FormListTable,
    CirculationPageTable,
    CommonFooter,
  },
  data() {
    return {
      formPaging: {
        limit: 20,
        offset: 1,
        maxDataNum: 0,
      },
      circulationPagePaging: {
        limit: 20,
        offset: 1,
        maxDataNum: 0,
      },
      kpiData: {},
      aggregationData: {},
      formList: [],
      circulationPageTotalData: {},
      circulationPageList: [],
      circulationPagePublishedFlag: null,
      dateRangePicker: {
        startDate: null,
        endDate: null,
      },
      defaultView: {
        value1: '1',
        value2: '2',
      },
      optionList: [
        {
          code: '1',
          label: 'ページビュー数',
        },
        {
          code: '2',
          label: '訪問数',
        },
        {
          code: '3',
          label: '直帰率',
        },
        {
          code: '4',
          label: '新規ユーザー数',
        },
        {
          code: '5',
          label: 'CV数',
        },
      ],
      tooltipLabel: {
        ページビュー数: '閲覧されたページの合計数です。',
        訪問数:
          'サイトへの訪問合計数です。単位はセッションで、60分以上経過した場合やサイトを離脱した後の訪問、日をまたいだ訪問は新しい訪問数としてカウントされます。',
        直帰率:
          '最初にアクセスしたページを見てサイトを離脱したユーザーの割合です。',
        CVR: '作成したフォームを完了まで進んだユーザーの割合です。',
        平均滞在時間: 'サイトに滞在した時間の平均値です。',
        新規ユーザー数:
          '初めてサイトに来訪したユーザー数です。同一ユーザーでも利用する端末が変わった場合は新規ユーザーとしてカウントされます。',
      },
    }
  },
  computed: {
    ...mapState('cms/dashBoardStore', [
      'circulationPageSelectSortType',
      'formSelectSortType',
    ]),
    ...mapState('common', ['sideNavIsOpen']),
  },
  watch: {
    sideNavIsOpen() {
      if (
        this.$refs &&
        this.$refs.dailyChart &&
        this.$refs.dailyChart.$refs &&
        this.$refs.dailyChart.$refs.Highcharts
      ) {
        setTimeout(() => {
          this.$refs.dailyChart.$refs.Highcharts.chart.reflow()
        }, 100)
      }
    },
  },
  created() {
    this.setInitDateRage()
    this.getInitFunc()
  },
  mounted() {},
  methods: {
    ...mapMutations('cms/dashBoardStore', [
      'resetFormSelectSortType',
      'resetCirculationPageSelectSortType',
    ]),
    setInitDateRage() {
      this.dateRangePicker.startDate = dayjs()
        .subtract(6, 'days')
        .format('YYYY/MM/DD')
      this.dateRangePicker.endDate = dayjs().format('YYYY/MM/DD')
    },
    updateDateRangePicker($event) {
      this.dateRangePicker = $event
      this.getInitFunc()
    },
    getInitFunc() {
      this.resetFormSelectSortType()
      this.resetCirculationPageSelectSortType()
      // this.resetPaging('form')
      // this.resetPaging('circulationPage')

      this.getCmsDashBoardKpiData()
      this.getFormList()
      this.getCirculationPageList()
    },
    /**
     * KPIデータの取得
     */
    getCmsDashBoardKpiData() {
      const paramData = this.getCmsDashBoardKpiDataParamData()

      this.$common.addCallApiNum()
      this.$api
        .getCmsDashBoardKpiData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.kpiData = resData.data

            this.aggregationData = this.getAggregationData()
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
     * グラフ表示データ用にデータを加工
     */
    getAggregationData() {
      const aggregationData = this.kpiData.aggregation
      const newAggregationData = {
        period: [],
        data: [],
      }

      if (this.$common.checkArrayValue(aggregationData)) {
        for (let i = 0; i < aggregationData[0].data.length; i++) {
          newAggregationData.period.push(aggregationData[0].data[i].period)
        }

        for (let i = 0; i < aggregationData.length; i++) {
          const addData = {
            name: '',
            value: [],
          }

          addData.name = aggregationData[i].name

          for (let j = 0; j < aggregationData[i].data.length; j++) {
            addData.value.push(aggregationData[i].data[j].value)
          }

          newAggregationData.data.push(addData)
        }
      }

      return newAggregationData
    },
    /**
     * KPIデータ取得APIのリクエストパラメータの取得
     */
    getCmsDashBoardKpiDataParamData() {
      const paramData = {}

      paramData.startDate = this.dateRangePicker.startDate
      paramData.endDate = this.dateRangePicker.endDate

      return paramData
    },
    /**
     * フォームリストデータの取得
     */
    getFormList() {
      const paramData = this.getFormListRequestParam()

      this.$common.addCallApiNum()
      this.$api
        .getFormList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.formPaging.maxDataNum = resData.data.searchResult
            this.formList = resData.data.formList
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
     * フォームリスト取得APIのリクエストパラメータの取得
     */
    getFormListRequestParam() {
      const paramData = {}

      paramData.startDate = this.dateRangePicker.startDate
      paramData.endDate = this.dateRangePicker.endDate
      /*
      ph1では不要
      paramData.offset = this.formPaging.offset
      paramData.limit = this.formPaging.limit
      */

      if (this.formSelectSortType.sort) {
        paramData.sort = this.formSelectSortType.sort
        paramData.order = this.formSelectSortType.order
      }

      return paramData
    },
    /**
     * 閲覧ページリストの取得
     */
    getCirculationPageList() {
      const paramData = this.getCirculationPageListRequestParam()

      this.$common.addCallApiNum()
      this.$api
        .getCirculationPageList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.circulationPagePaging.maxDataNum = resData.data.searchResult
            this.circulationPageTotalData = resData.data.totalPageInfo
            this.circulationPageList = resData.data.pageList
            this.circulationPagePublishedFlag = resData.data.publishedFlag
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
     * 閲覧ページリストAPIのリクエストパラメータの取得
     */
    getCirculationPageListRequestParam() {
      const paramData = {}

      paramData.startDate = this.dateRangePicker.startDate
      paramData.endDate = this.dateRangePicker.endDate
      /*
      ph1では不要
      paramData.offset = this.circulationPagePaging.offset
      paramData.limit = this.circulationPagePaging.limit
      */

      if (this.circulationPageSelectSortType.sort) {
        paramData.sort = this.circulationPageSelectSortType.sort
        paramData.order = this.circulationPageSelectSortType.order
      }

      return paramData
    },
    /**
     * ソート反映処理
     */
    reflectSortFormTable() {
      // this.resetPaging('table')
      this.getFormList()
    },
    /**
     * ソート反映処理
     */
    reflectCirculationPageTable() {
      // this.resetPaging('circulationPage')
      this.getCirculationPageList()
    },
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(limit, tableType) {
      if (tableType === 'form') {
        this.formPaging.limit = limit
        this.formPaging.offset = 1
        this.getFormList()
      } else if (tableType === 'circulationPage') {
        this.circulationPagePaging.limit = limit
        this.circulationPagePaging.offset = 1
        this.getCirculationPageList()
      }
    },
    /**
     * 次のページを表示
     */
    showNextPage(tableType) {
      if (tableType === 'form') {
        this.formPaging.offset += 1
        this.getFormList()
      }
      if (tableType === 'circulationPage') {
        this.circulationPagePaging.offset += 1
        this.getCirculationPageList()
      }
    },
    /**
     * 前のページを表示
     */
    showPrevPage(tableType) {
      if (tableType === 'form') {
        this.formPaging.offset -= 1
        this.getFormList()
      }
      if (tableType === 'circulationPage') {
        this.circulationPagePaging.offset -= 1
        this.getCirculationPageList()
      }
    },
    /**
     * フォームテーブルのページング情報のリセット
     */
    resetPaging(tableType) {
      if (tableType === 'form') {
        this.formPaging.offset = 1
        this.formPaging.limit = 20
      }
      if (tableType === 'circulationPage') {
        this.circulationPagePaging.offset = 1
        this.circulationPagePaging.limit = 20
      }
    },
  },
  head() {
    return {
      title: 'ダッシュボード｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
/**
 * ヘッダー
 */
.header {
  display: flex;
  align-items: center;
  &-select {
    margin: 0 0 0 auto;
  }

  &-title {
    font-size: 28px;
    color: #1e1e1e;
    &-icon {
      position: relative;
      top: 3px;
      margin: 0 0 0 9px;
      fill: #3a435c;
      transform: rotate(30deg);
    }
  }
}

/**
 * ファーストビュー
 */
.kpi-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  &-card {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% / 3 - 12px);
      min-height: 136px;
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 1px 5px #00000029;
      border-radius: 6px;
      padding: 30px 16px 30px 32px;
      &:not(:nth-of-type(3n)) {
        margin-right: 16px;
      }
      &:nth-of-type(-n + 3) {
        margin-bottom: 16px;
      }
      .first-view {
        &-data {
          flex: 1;
          &-title {
            font-size: 17px;
            color: #1e1e1e;
          }
          &-text {
            margin: 2px 0 0 0;
            font-weight: bold;
            font-size: 28px;
            color: #1e1e1e;
          }
        }
        &-contrast {
          padding-left: 0.5em;
          display: flex;
          align-items: center;
          margin-left: auto;
        }
      }
    }
  }
  &-graph {
    width: 320px;
  }
}
.table-options {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  ::v-deep .page-nav {
    margin-left: 16px;
  }
}
.form-list {
  margin-top: 40px;
  .table-area {
    margin-top: 16px;
  }
}
.circulationPage-list {
  margin-top: 40px;
  .table-area {
    margin-top: 16px;
  }
}
.deviceData-list {
  display: flex;
  margin-top: 32px;
}
.tooltip {
  display: inline-block;
}
</style>
