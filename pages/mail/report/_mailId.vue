<template>
  <div class="mail-list">
    <div class="main-contents">
      <ToBackScreenLink label="メール一覧へ戻る" @click="toBack()" />
      <div class="header">
        <h2 class="header-title">{{ sendReport.mailTitle }}配信レポート</h2>
      </div>
      <div class="mail-list__graph">
        <h3 class="title">KPIサマリー</h3>
        <div class="contents">
          <ul id="kpiList">
            <template v-for="(data, index) in kpiSummary">
              <li :key="data.title" class="item">
                <h4>{{ data.title }}</h4>
                <div class="figure">
                  <div
                    class="text"
                    :class="{ barFirst: index === 0 }"
                    :style="'top: ' + getKpiTextTop(data.height, index)"
                  >
                    <p class="number">
                      {{ getLocaleString(data.value) }}
                    </p>
                    <p class="percent">
                      {{ getPercent(data.value) }}
                    </p>
                  </div>
                  <div
                    class="figure-bg"
                    :style="'height: ' + data.height"
                  ></div>
                </div>
              </li>
              <li
                v-if="index !== kpiSummary.length - 1"
                :key="index"
                class="space"
                :style="'width:' + kpiTriangleValue"
              >
                <div class="bg" :style="'height: ' + data.bgHeight">
                  <div
                    v-if="data.triangleLeft"
                    class="triangle"
                    :style="{
                      borderTop: 'solid #fff ' + data.triangleBorderTop,
                      borderLeft: 'solid transparent ' + kpiTriangleValue,
                    }"
                  ></div>
                  <div
                    v-else
                    class="triangle"
                    :style="{
                      borderTop: 'solid #fff ' + data.triangleBorderTop,
                      borderRight: 'solid transparent ' + kpiTriangleValue,
                    }"
                  ></div>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>

      <div class="mail-list__bar">
        <div
          v-for="(data, index) in rageData"
          :key="index"
          :class="{
            left: index === 0,
            right: index === 1,
          }"
        >
          <h3 class="title">{{ data.text }}率</h3>
          <div class="wrapper">
            <div
              class="graph"
              :class="{
                ' bar-error-graph': index === 0,
                ' bar-stop-graph': index === 1,
              }"
            >
              <div class="graph__left" :style="'width: ' + data.barLeft"></div>
              <div
                class="graph__right"
                :style="'width: ' + data.barRight"
              ></div>
            </div>
            <ul class="list">
              <li v-for="(barValueData, i) in barValue" :key="barValueData">
                <span>{{ barValueData }}</span
                ><span v-if="i === 4" class="right">100</span>
              </li>
            </ul>
            <div class="result green">
              <div class="text">
                <p class="text__left">
                  {{ data.baseText }}
                </p>
                <p class="text__right">
                  {{ getLocaleString(data.baseValue) }}
                </p>
              </div>
              <div class="percent">100.0%</div>
            </div>
            <div class="result">
              <div class="text">
                <p class="text__left">{{ data.text }}数</p>
                <p class="text__right">
                  {{ getLocaleString(data.value) }}
                </p>
              </div>
              <div class="percent">
                {{ getPercent(data.value, data.baseValue) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mail-table">
        <h3>リンククリック</h3>
        <div class="tableWrap">
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>流入元のリンクタイトル</th>
                  <th>クリック数</th>
                  <th>CV数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in sendReport.linkClick" :key="index">
                  <td>{{ data.linkTitle }}</td>
                  <td>{{ getLocaleString(data.clickCount) }}</td>
                  <td>{{ getLocaleString(data.cvCount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      sendReport: {
        sendCount: 0,
        sendSuccessCount: 0,
        openCount: 0,
        inputCount: 0,
        cvCount: 0,
        sendErrorCount: 0,
        sendStopCount: 0,
        linkClick: [],
      },
      kpiSummary: [
        {
          title: '配信数',
          value: 0,
          height: '',
          bgHeight: '',
          triangleBorderTop: '',
          triangleLeft: true,
        },
        {
          title: '配信成功数',
          value: 0,
          height: '',
          bgHeight: '',
          triangleBorderTop: '',
          triangleLeft: true,
        },
        {
          title: '開封数',
          value: 0,
          height: '',
          bgHeight: '',
          triangleBorderTop: '',
          triangleLeft: true,
        },
        {
          title: '流入数',
          value: 0,
          height: '',
          bgHeight: '',
          triangleBorderTop: '',
          triangleLeft: true,
        },
        { title: 'CV数', value: 0, height: '', bgHeight: '' },
      ],
      kpiTriangleValue: '',
      rageData: [
        {
          baseText: '',
          baseValue: 0,
          text: '配信エラー',
          value: 0,
          barLeft: '',
          barRight: '',
        },
        {
          baseText: '',
          baseValue: 0,
          text: '配信停止',
          value: 0,
          barLeft: '',
          barRight: '',
        },
      ],
      barValue: ['0', '20', '40', '60', '80'],
    }
  },
  computed: {
    /**
     * kpiサマリーテキスト表示位置設定
     *
     * @param {number} heightNumber 表height
     * @param {number} index 表示順
     * @return {string}  kpiサマリーテキスト表示位置(style top設定)
     */
    getKpiTextTop() {
      return (heightNumber, index) => {
        let result = 50
        const checkNumber = (100 - parseInt(heightNumber)) * 2.4 - 44

        if (checkNumber > result) {
          result = checkNumber
        }

        return result + 'px'
      }
    },
    /**
     * 数値をカンマ付き値へ変換
     *
     * @param {number} number 数値
     * @return {string} カンマ付き数値
     */
    getLocaleString() {
      return (number) => {
        return number.toLocaleString()
      }
    },
    /**
     * 数値をパーセント付き値へ変換
     *
     * @param {number} number 変換元数値
     * @param {number} totalNumber 総数
     * @return {string} パーセント付与数値
     */
    getPercent() {
      return (number, totalNumber) => {
        let setTotalNumber = totalNumber

        if (!totalNumber) {
          setTotalNumber = this.sendReport.sendCount
        }

        return ((number / setTotalNumber) * 100).toFixed(1) + '%'
      }
    },
  },
  created() {
    this.getMailSendReport()
  },
  mounted() {
    this.getKpiTriangle()
  },
  methods: {
    /**
     * kpiサマリー グラフ傾斜リサイズ対応
     */
    getKpiTriangle() {
      const updateResize = () => {
        const kpiTableWidth = document.getElementById('kpiList').clientWidth
        let kpiTableBarWidth = ''
        const kpiTableBarWidthBase = kpiTableWidth * 0.18
        const kpiTableBarWidthMax = 209

        if (kpiTableBarWidthBase > kpiTableBarWidthMax) {
          kpiTableBarWidth = kpiTableBarWidthMax
        } else {
          kpiTableBarWidth = kpiTableBarWidthMax
        }

        let kpiTableTriangleWidth = ''
        const kpiTableTriangleWidthBase = kpiTableWidth * 0.03
        const kpiTableTriangleWidthVariable = Math.round(
          (kpiTableWidth - 60 - kpiTableBarWidth * 5) / 4
        )

        if (kpiTableTriangleWidthBase > kpiTableTriangleWidthVariable) {
          kpiTableTriangleWidth = kpiTableTriangleWidthBase + 'px'
        } else {
          kpiTableTriangleWidth = kpiTableTriangleWidthVariable + 'px'
        }

        this.kpiTriangleValue = kpiTableTriangleWidth
      }

      updateResize()
      window.onresize = updateResize
    },
    /**
     * メール_配信レポート取得
     */
    getMailSendReport() {
      const paramData = {
        mailId: this.$route.params,
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailSendReport(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.sendReport = resData.data.sendReport
            this.getKpiSummary()
            this.getRageDataValue()
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
     * メール一覧に戻る
     */
    toBack() {
      this.$router.push('/mail/list/')
    },
    /**
     * KPIサマリー用データ設定
     */
    getKpiSummary() {
      const valueList = [
        'sendCount',
        'sendSuccessCount',
        'openCount',
        'inputCount',
        'cvCount',
      ]
      const valueSendCount = this.sendReport.sendCount

      /**
       * KPIサマリー 値、グラフ高さ設定
       */
      for (const i in this.kpiSummary) {
        const setValue = this.sendReport[valueList[i]]
        this.kpiSummary[i].value = setValue
        this.kpiSummary[i].height = (setValue / valueSendCount) * 100 + '%'
        this.kpiSummary[i].bgHeight = this.kpiSummary[i].height
      }

      /**
       * KPIサマリー グラフ間傾斜高さ生成
       */
      for (const i in this.kpiSummary) {
        if (parseInt(i) !== this.kpiSummary.length - 1) {
          const indexNext = parseInt(i) + 1
          const valueThis = this.kpiSummary[i].value
          const valueNext = this.kpiSummary[indexNext].value
          const getTriangleBorderTop = (valueOne, valueTwo) => {
            this.kpiSummary[i].triangleBorderTop =
              Math.round(
                (valueOne / valueSendCount - valueTwo / valueSendCount) * 240
              ) + 'px'
          }

          if (valueNext < valueThis) {
            getTriangleBorderTop(valueThis, valueNext)
          } else {
            this.kpiSummary[i].bgHeight = this.kpiSummary[indexNext].bgHeight
            getTriangleBorderTop(valueNext, valueThis)
            this.kpiSummary[i].triangleLeft = false
          }
        }
      }
    },
    /**
     * 配信エラー率、配信停止率 表示値更新
     */
    getRageDataValue() {
      const updateBaseValue = (object, baseValue) => {
        object.baseText = baseValue.title
        object.baseValue = baseValue.value
      }
      updateBaseValue(this.rageData[0], this.kpiSummary[0])
      updateBaseValue(this.rageData[1], this.kpiSummary[1])

      this.rageData[0].value = this.sendReport.sendErrorCount
      this.rageData[1].value = this.sendReport.sendStopCount

      const updateBar = (object) => {
        const tempRight = 100 / (object.baseValue / object.value)
        object.barLeft = tempRight + '%'
        object.barRight = 100 - tempRight + '%'
      }

      updateBar(this.rageData[0])
      updateBar(this.rageData[1])
    },
  },
  head() {
    return {
      title: this.sendReport.mailTitle + '配信レポート｜メール',
    }
  },
}
</script>

<style lang="scss" scoped>
.mail-list {
  margin-top: -15px;
}
.main-contents {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    padding-bottom: 32px;
  }
  .mail-list__graph {
    .title {
      font-size: 20px;
      margin-bottom: 17px;
    }
    .contents {
      margin: 0 auto 40px;
      #kpiList {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 24px 30px 33px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        .item {
          width: 18%;
          max-width: 209px;
          h4 {
            font-size: 17px;
            text-align: center;
            margin-bottom: 21px;
          }
          .figure {
            height: 240px;
            width: 100%;
            background: #f7f8f9;
            position: relative;
            .text {
              position: absolute;
              left: 0;
              width: 100%;
              top: 50%;
              transform: translateY(-50%);
              z-index: 1;
              &.barFirst {
                color: #fff;
              }
              .number {
                font-size: 28px;
                font-weight: bold;
                text-align: center;
              }
              .percent {
                font-size: 15px;
                font-weight: normal;
                text-align: center;
              }
            }
            .figure-bg {
              position: absolute;
              width: 100%;
              background: #4f7df0;
              bottom: 0;
              left: 0;
            }
          }
        }
        .space {
          width: 3%;
          height: 240px;
          position: relative;
          .bg {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #dce5fc;
            .triangle {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              background: #dce5fc;
            }
          }
        }
      }
    }
  }
  .mail-list__bar {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .title {
      font-size: 20px;
      margin-bottom: 16px;
    }
    .wrapper {
      padding: 30px 30px 36px;
      border-radius: 6px;
      border: 1px solid #e5e5e5;
      position: relative;
    }
    .graph {
      width: calc(100% - 60px);
      height: 88px;
      position: absolute;
      z-index: 1;
      .graph__left,
      .graph__right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 56px;
      }
      .graph__left {
        left: 0;
      }
      .graph__right {
        right: 0;
        &:after {
          content: '';
          width: calc(100% - 3px);
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
          background: #34c759;
        }
      }
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      position: relative;
      margin-bottom: 55px;
      li {
        width: 20%;
        height: 88px;
        position: relative;
        span {
          position: absolute;
          bottom: -26px;
          left: -12px;
          font-size: 12px;
          color: #8d8d8d;
          display: inline-block;
          min-width: 25px;
          text-align: center;
          &.right {
            left: auto;
            right: -28%;
          }
        }
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          height: 100%;
          background: #e5e5e5;
        }
        &:last-child {
          &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 1px;
            height: 100%;
            background: #e5e5e5;
          }
        }
      }
    }
    .left,
    .right {
      width: calc(50% - 17px);
      margin-right: 17px;
    }
    .left {
      .graph__left,
      .result:before {
        background: #ff0000;
      }
    }
    .right {
      .graph__left,
      .result:before {
        background: #8d8d8d;
      }
    }
    .result {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 14px;
      &::before {
        content: '';
        width: 12px;
        height: 12px;
        margin-right: 8px;
      }
      &.green:before {
        background: #34c759;
      }
      .text {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        width: 180px;
        margin-right: 8px;
        color: #1e1e1e;
        .text__left {
          font-size: 15px;
          line-height: 15px;
          margin-right: 10px;
        }
        .text__right {
          font-size: 20px;
          line-height: 20px;
        }
      }
      .percent {
        font-size: 15px;
        line-height: 15px;
        color: #8d8d8d;
      }
    }
  }
  .mail-table {
    margin-top: 36px;
    .tableWrap {
      margin-top: 16px;
    }
    table tr {
      th:nth-of-type(2),
      td:nth-of-type(2) {
        width: 100px;
        max-width: 100px;
      }
      th:nth-of-type(3),
      td:nth-of-type(3) {
        width: 90px;
        max-width: 90px;
      }
      th:nth-of-type(2),
      th:nth-of-type(3) {
        padding: 0 15px;
        text-align: center;
      }
      td:nth-of-type(2),
      td:nth-of-type(3) {
        padding: 0 15px;
        text-align: right;
      }
    }
  }
}
</style>
