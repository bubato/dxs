<template>
  <div class="dash-board">
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="Object.keys(contractInformation).length > 0"
      class="main-contents"
    >
      <div
        v-if="cancelStatus !== '0'"
        class="backOffice-alert"
        :class="{ backOfficeAlertShow: backOfficeAlertShowFlag }"
      >
        <p class="context">
          {{ cancelMessage }}
        </p>
        <div v-if="cancelStatus === '1'" class="buttons">
          <a
            class="btn btn-cancel btn-long"
            href="https://www.bizsky.io/contact/"
            target="_blank"
          >
            解約を取り消す場合はこちらからお問い合わせ
          </a>
        </div>
      </div>
      <div v-if="$common.checkArrayValue(newsList)" class="backOffice-news">
        <ul class="backOffice-news-list">
          <li v-for="(news, index) in newsList" :key="index">
            <p class="date">{{ news.date }}</p>
            <div class="context">
              <h3 class="title">{{ news.title }}</h3>
              <p class="text" v-html="news.text.replace(/\n/g, '<br/>')" />
            </div>
          </li>
        </ul>
      </div>
      <div class="header">
        <h2 class="header-title">ダッシュボード</h2>
        <p class="header-tenantId">
          テナントID:<span>{{ masterData.tenantId }}</span>
        </p>
      </div>
      <div class="contents">
        <div class="billing-information">
          <h3 class="flex">
            契約情報<TooltipHelp label="現在の契約プランを表示しています。" />
          </h3>
          <div class="billing-information-contents">
            <div class="billing-information-contents-plan">
              <h4>
                契約プラン:<a
                  class="link-text"
                  @click="transitionContractScreen()"
                  >{{
                    $common.getVersatileItem(
                      12,
                      contractInformation.billingInformation.planId,
                      'value'
                    )
                  }}</a
                >
              </h4>
            </div>
            <!-- ph1ではトリツメ
            <div class="billing-information-contents-detail">
              <div class="billing-information-contents-detail-money">
                <div class="billing-information-contents-detail-money-title">
                  <h4>最新の請求金額</h4>
                  <p>2020/11/01-2020/11/30</p>
                </div>
                <div class="billing-information-contents-detail-money-value">
                  <h2>10000</h2>
                  <span>円(税別)</span>
                </div>
              </div>
              <div class="billing-information-contents-detail-date">
                <div class="billing-information-contents-detail-date-title">
                  <h4>支払い期日</h4>
                  <p>翌月末支払</p>
                </div>
                <div class="billing-information-contents-detail-date-source">
                  <h4>請求元</h4>
                  <p>トライベック株式会社</p>
                </div>
              </div>
            </div>
            -->
          </div>
        </div>
        <div class="usage-details">
          <h3 class="flex">
            利用明細<TooltipHelp
              label="現在の機能の利用実績を表示しています。"
            />
          </h3>
          <div class="usage-details-contents">
            <ul>
              <li class="accountNum">
                <div class="circle-wrap">
                  <ProgressCircleBar
                    :progress="accountPercent()"
                    class="progressCircle"
                  />
                </div>
                <div class="num-info">
                  <p>アカウント数</p>
                  <p class="num-info-detail">
                    {{ contractInformation.usageDetails.accountNum.num }}/{{
                      contractInformation.usageDetails.accountNum.sum
                    }}
                  </p>
                </div>
              </li>
              <li class="pageNum">
                <div class="circle-wrap">
                  <ProgressCircleBar
                    :progress="pagePercent()"
                    class="progressCircle"
                  />
                </div>
                <div class="num-info">
                  <p>ページ数</p>
                  <p class="num-info-detail">
                    {{ contractInformation.usageDetails.pageNum.num }}/{{
                      contractInformation.usageDetails.pageNum.sum
                    }}
                  </p>
                </div>
              </li>
              <li class="formNum">
                <div class="circle-wrap">
                  <ProgressCircleBar
                    :progress="formPercent()"
                    class="progressCircle"
                  />
                </div>
                <div class="num-info">
                  <p>フォーム数</p>
                  <p class="num-info-detail">
                    {{ contractInformation.usageDetails.formNum.num }}/{{
                      contractInformation.usageDetails.formNum.sum
                    }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="buttons">
          <button
            class="btn btn-basic btn-long"
            @click="transitionContractScreen()"
          >
            契約中のプラン内容を確認
          </button>
        </div>
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      contractInformation: {},
      newsList: [],
      cancelStatus: '',
      cancelMessage: '',
      cancelDetailReason: '',
      backOfficeAlertShowFlag: false,
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    accountPercent() {
      return () => {
        return Number(
          (
            (this.contractInformation.usageDetails.accountNum.num /
              this.contractInformation.usageDetails.accountNum.sum) *
            100
          ).toFixed(2)
        )
      }
    },
    pagePercent() {
      return () => {
        return Number(
          (
            (this.contractInformation.usageDetails.pageNum.num /
              this.contractInformation.usageDetails.pageNum.sum) *
            100
          ).toFixed(2)
        )
      }
    },
    formPercent() {
      return () => {
        return Number(
          (
            (this.contractInformation.usageDetails.formNum.num /
              this.contractInformation.usageDetails.formNum.sum) *
            100
          ).toFixed(2)
        )
      }
    },
  },
  created() {
    this.getContractInformation() // 契約情報取得APIの呼び出し
    this.getCancelNotice() // 解約情報取得APIの呼び出し
  },
  mounted() {},
  methods: {
    /**
     * 契約情報取得APIの呼び出し
     */
    getContractInformation() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getContractInformation(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.contractInformation = resData.data.data
            this.newsList = resData.data.data.backOfficeNews
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
     * 契約プラン画面に遷移
     */
    transitionContractScreen() {
      this.$router.push('/account/contract/')
    },
    /**
     * 解約情報取得APIの呼び出し
     */
    getCancelNotice() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCancelNotice(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.cancelStatus = resData.data.cancelStatus
            this.cancelMessage = resData.data.cancelMessage
            if (resData.data.cancelStatus !== '0')
              this.backOfficeAlertShowFlag = true
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
  head() {
    return {
      title: 'ダッシュボード｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.dash-board {
  .main-contents {
    .backOffice-alert {
      display: none;
      background: #fff2f4 0% 0% no-repeat padding-box;
      border: 2px solid #e60012;
      border-radius: 4px;
      padding: 16px 24px;
      margin-bottom: 24px;
      .context {
        font-size: 17px;
        color: #e60012;
        padding: 12px 0;
      }
      .buttons {
        margin-left: auto;
      }
    }
    .backOfficeAlertShow {
      display: flex;
    }
    .backOffice-news {
      padding: 24px;
      background: #f5f5f5;
      margin-bottom: 40px;
      &-list {
        li {
          display: flex;
          &:not(:last-child) {
            padding-bottom: 24px;
          }
          .context {
            margin-left: 40px;
            flex: 1;
            .title {
              font-size: 17px;
              margin-bottom: 8px;
            }
          }
        }
      }
    }
    .header {
      &-tenantId {
        margin-top: 24px;
        span {
          padding-left: 24px;
        }
      }
    }
    .contents {
      margin-top: 32px;
      .billing-information {
        &-contents {
          margin-top: 24px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          &-plan {
            display: flex;
            align-items: center;
            height: 78px;
            padding-left: 32px;
            .link-text {
              margin-left: 8px;
            }
          }
          &-detail {
            display: flex;
            align-items: center;
            height: 150px;
            padding-left: 32px;
            &-money {
              display: flex;
              align-items: center;
              &-title {
                p {
                  margin-top: 8px;
                }
              }
              &-value {
                display: flex;
                align-items: baseline;
                margin-left: 40px;
              }
            }
            &-date {
              margin-left: 230px;
              &-title,
              &-source {
                display: flex;
                align-items: center;
                h4 {
                  width: 100px;
                }
                p {
                  margin-left: 48px;
                }
              }
              &-source {
                margin-top: 12px;
              }
            }
          }
        }
      }
      .usage-details {
        margin-top: 48px;
        &-contents {
          margin-top: 24px;
          ul {
            display: flex;
            align-items: center;
            li {
              display: flex;
              align-items: center;
              justify-content: center;
              width: calc(100% / 3);
              background: #ffffff;
              box-shadow: 0px 1px 5px #00000029;
              border-radius: 6px;
              padding: 15px;
              &:not(:last-child) {
                margin-right: 16px;
              }
              .num-info {
                font-weight: 500;
                margin-left: 40px;
                &-detail {
                  font-size: 22px;
                }
              }
            }
          }
        }
      }
      .circle-wrap {
        width: 100px;
        height: 100px;
        overflow: hidden;
        position: relative;
      }
      .progressCircle {
        width: 200px;
        height: 200px;
        transform: scale(0.5);
        position: absolute;
        top: -50%;
        left: -50%;
      }
      .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px;
      }
    }
  }
}
</style>
