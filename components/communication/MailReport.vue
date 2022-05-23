<template>
  <div class="mail-report">
    <span class="flex">
      <a class="link-text" @click.prevent="setShowReportComponentFlg(false)"
        ><KeyboardArrowRightSVG
          class="btn-back icon-keyboardArrowRight"
        />前の画面に戻る</a
      >
    </span>
    <div class="header flex">
      <h1>{{ mailTitle }}レポート</h1>
    </div>
    <div class="main-contents">
      <KpiSummaryChart :kpi-summary-data="kpiSummaryData" />
      <DailyReportChart :daily-report-data="dailyReportData" />
      <LinkClickTable :link-click-data="linkClickData" />
      <button
        class="btn btn-basic btn-long btn-close"
        @click.prevent="setShowReportComponentFlg(false)"
      >
        閉じる
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import KpiSummaryChart from '~/components/communication/mailReport/chart/KpiSummaryChart.vue'
import DailyReportChart from '~/components/communication/mailReport/chart/DailyReportChart.vue'
import LinkClickTable from '~/components/communication/mailReport/table/LinkClickTable.vue'

export default {
  name: 'MailReport',
  components: {
    KpiSummaryChart,
    DailyReportChart,
    LinkClickTable,
  },
  props: {
    mailTitle: {
      type: String,
      default: 'メールタイトル',
      required: false,
    },
  },
  data() {
    return {
      kpiSummaryData: {
        number: [
          {
            data: [
              {
                name: '配信数',
                y: 1200,
                color: '#4F7DF0',
              },
              {
                name: '開封数',
                y: 1200,
                color: '#66A2FC',
              },
              {
                name: '流入数',
                y: 1000,
                color: '#68CEF2',
              },
              {
                name: 'コンバージョン数',
                y: 200,
                color: '#58BAF5',
              },
            ],
          },
        ],
        status: [
          {
            name: '配信成功数',
            data: [1200],
            color: '#34C759',
          },
          {
            name: '配信停止数',
            data: [1000],
            color: '#8D8D8D',
          },
          {
            name: '配信エラー数',
            data: [1200],
            color: '#FF453A',
          },
        ],
      },
      dailyReportData: {
        '2020/01/01': {
          deliveries: {
            name: '配信数',
            data: 1,
          },
          opens: {
            name: '開封数',
            data: 2,
          },
          inflows: {
            name: '流入数​',
            data: 3,
          },
          cv: {
            name: 'CV数​',
            data: 4,
          },
          error: {
            name: '配信エラー数',
            data: 5,
          },
        },
        '2020/01/02': {
          deliveries: {
            name: '配信数',
            data: 2,
          },
          opens: {
            name: '開封数',
            data: 3,
          },
          inflows: {
            name: '流入数​',
            data: 4,
          },
          cv: {
            name: 'CV数​',
            data: 5,
          },
          error: {
            name: '配信エラー数',
            data: 6,
          },
        },
        '2020/01/03': {
          deliveries: {
            name: '配信数',
            data: 7,
          },
          opens: {
            name: '開封数',
            data: 8,
          },
          inflows: {
            name: '流入数​',
            data: 9,
          },
          cv: {
            name: 'CV数​',
            data: 10,
          },
          error: {
            name: '配信エラー数',
            data: 11,
          },
        },
        '2020/01/04': {
          deliveries: {
            name: '配信数',
            data: 12,
          },
          opens: {
            name: '開封数',
            data: 13,
          },
          inflows: {
            name: '流入数​',
            data: 14,
          },
          cv: {
            name: 'CV数​',
            data: 15,
          },
          error: {
            name: '配信エラー数',
            data: 1,
          },
        },
        '2020/01/05': {
          deliveries: {
            name: '配信数',
            data: 17,
          },
          opens: {
            name: '開封数',
            data: 18,
          },
          inflows: {
            name: '流入数​',
            data: 19,
          },
          cv: {
            name: 'CV数​',
            data: 4,
          },
          error: {
            name: '配信エラー数',
            data: 5,
          },
        },
        '2020/01/06': {
          deliveries: {
            name: '配信数',
            data: 1,
          },
          opens: {
            name: '開封数',
            data: 2,
          },
          inflows: {
            name: '流入数​',
            data: 3,
          },
          cv: {
            name: 'CV数​',
            data: 4,
          },
          error: {
            name: '配信エラー数',
            data: 5,
          },
        },
        '2020/01/07': {
          deliveries: {
            name: '配信数',
            data: 1,
          },
          opens: {
            name: '開封数',
            data: 2,
          },
          inflows: {
            name: '流入数​',
            data: 3,
          },
          cv: {
            name: 'CV数​',
            data: 4,
          },
          error: {
            name: '配信エラー数',
            data: 100,
          },
        },
      },
      linkClickData: [
        {
          url: 'https://www.tribeck.jp/event/webinar/20201118/',
          clickCount: 2000,
          cv: 2000,
        },
        {
          url: 'https://www.tribeck.jp/event/webinar/20201118/',
          clickCount: 2000,
          cv: 2000,
        },
        {
          url: 'https://www.tribeck.jp/event/webinar/20201118/',
          clickCount: 2000,
          cv: 2000,
        },
        {
          url: 'https://www.tribeck.jp/event/webinar/20201118/',
          clickCount: 2000,
          cv: 2000,
        },
        {
          url: 'https://www.tribeck.jp/event/webinar/20201118/',
          clickCount: 2000,
          cv: 2000,
        },
        {
          url: 'https://www.tribeck.jp/event/webinar/20201118/',
          clickCount: 2000,
          cv: 2000,
        },
      ],
    }
  },
  computed: {},
  methods: {
    ...mapMutations('communication/mailList', ['setShowReportComponentFlg']),
  },
}
</script>

<style lang="scss" scoped>
.header {
  &-icon {
    position: relative;
    top: 3px;
    margin: 0 0 0 9px;
    fill: #3a435c;
    transform: rotate(30deg);
  }
}
.btn {
  &-back {
    fill: #007aff;
    transform: scale(-1, 1);
  }
  &-close {
    margin: 39px auto 0;
  }
}
</style>
