<template>
  <div class="contract">
    <!-- eslint-disable vue/no-v-html -->
    <div v-if="Object.keys(contractPlan).length > 0" class="main-contents">
      <div class="header">
        <h2 class="header-title">契約プラン</h2>
        <p class="header-tenantId">
          テナントID:<span>{{ masterData.tenantId }}</span>
        </p>
      </div>
      <div class="contents">
        <div class="plan-block">
          <h4 class="plan-block-title flex">
            ご契約中のプラン<TooltipHelp
              label="現在の契約プランを表示しています。"
            />
          </h4>
          <div class="plan-block-contents">
            <h2>
              {{ $common.getVersatileItem(12, contractPlan.planId, 'value') }}
            </h2>
            <div class="plan-block-contents-detail">
              <!-- ph1でトリツメ
              <p>
                利用料：{{
                  $common.commaSeparate(contractPlan.usageFee)
                }}円/月（税別）
              </p>
              -->
              <p>利用開始日時：{{ contractPlan.startDateOfUse }}</p>
              <p>契約継続日数：{{ contractPlan.dayOfUse }}日</p>
            </div>
          </div>
        </div>
        <div class="available-service-block">
          <h4 class="available-service-block-title flex">
            利用可能なサービス<TooltipHelp
              label="現在の契約プランで利用可能は機能を表示しています。"
            />
          </h4>
          <div class="available-service-block-contents">
            <div class="available-service-block-contents-table table-scroll">
              <table>
                <thead>
                  <tr>
                    <th class="service">サービス名</th>
                    <th class="limitations">制限事項</th>
                    <th class="option">オプション</th>
                    <th class="startDay">利用開始日時</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <WebsiteIconSVG class="icon" />
                        <p>Webサイト</p>
                      </div>
                    </td>
                    <td class="limitations">
                      <p>サブドメインのみ<br />最大10ページまで</p>
                    </td>
                    <td class="option">
                      <span class="bold">独自ドメイン</span><br /><span
                        class="font-size-middle"
                        >独自のドメインを取得してWebサイトの信頼感を高めましょう。</span
                      >
                    </td>
                    <td class="startDay">
                      <!-- 独自ドメイン未登録 -->
                      <button
                        v-if="
                          getOptionData(5, 'startAt') === '' &&
                          getOptionData(5, 'applyFlag')
                        "
                        class="btn btn-basic btn-short"
                        @click="showOwnDomainOptionModal = true"
                      >
                        申し込む
                      </button>
                      <!-- 独自ドメイン登録済 startAtを表示 -->
                      <span v-if="getOptionData(5, 'startAt') !== ''">{{
                        getOptionData(5, 'startAt')
                      }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <FormIconSVG class="icon" />
                        <p>フォーム</p>
                      </div>
                    </td>
                    <td class="limitations">最大5つまで</td>
                    <td class="option"></td>
                    <td class="startDay"></td>
                  </tr>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <StorageIconSVG class="icon" />
                        <p>ストレージ</p>
                      </div>
                    </td>
                    <td class="limitations">アカウント全体で10GBまで</td>
                    <td class="option"></td>
                    <td class="startDay"></td>
                  </tr>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <CommunityIconSVG class="icon" />
                        <p>コミュニティ</p>
                      </div>
                    </td>
                    <td class="limitations">なし</td>
                    <td class="option"></td>
                    <td class="startDay"></td>
                  </tr>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <MmiIconSVG class="icon" />
                        <p>MMI</p>
                      </div>
                    </td>
                    <td class="limitations">bizskyIDによる有効化が必要</td>
                    <td class="option"></td>
                    <td class="startDay"></td>
                  </tr>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <CashFlowIconSVG class="icon" />
                        <p>キャッシュフロー<br />マネジメント</p>
                      </div>
                    </td>
                    <td class="limitations">bizskyIDによる有効化が必要</td>
                    <td class="option"></td>
                    <td class="startDay"></td>
                  </tr>
                  <tr>
                    <td class="service">
                      <div class="flex">
                        <AccountIconSVG class="icon" />
                        <p>アカウント</p>
                      </div>
                    </td>
                    <td class="limitations">
                      最大10アカウントまで<br />管理者のみ利用可能
                    </td>
                    <td class="option"></td>
                    <td class="startDay"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- <div class="available-service-block-contents-other">
              <div class="available-service-block-contents-other-option">
                <p class="title">オプション</p>
                <p class="context">現在利用できるオプションはありません</p>
              </div>
              <div class="available-service-block-contents-other-function">
                <p class="title">追加機能</p>
                <p class="context">現在利用できる追加機能はありません</p>
              </div>
            </div> -->
          </div>
        </div>
        <div class="help-block">
          <ul class="help-block-list">
            <!-- <li>
              <a href="" target="_blank"
                >契約プランについて<LaunchSVG class="icon icon-launch"
              /></a>
            </li> -->
            <li>
              <a href="https://help.bizsky.io/faq/" target="_blank"
                >よくある質問<LaunchSVG class="icon icon-launch"
              /></a>
            </li>
            <li>
              <a href="https://www.bizsky.io/contact/" target="_blank"
                >お問い合わせ<LaunchSVG class="icon icon-launch"
              /></a>
            </li>
          </ul>
        </div>
        <CustomLinkText
          class="cancel-link"
          text="bizskyDXの解約申し込みはこちら"
          link="/cancel/input/"
        />
      </div>
    </div>
    <CommonFooter />
    <OwnDomainOptionModal
      v-if="showOwnDomainOptionModal"
      @complete="completeOwnDomainOption()"
      @close="hideModal()"
    />
    <CompleteOwnDomainOptionModal
      v-if="showCompleteOwnDomainOptionModal"
      @close="completeOwnDomainOptionModalClose()"
    />
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
      contractPlan: {},
      showOwnDomainOptionModal: false,
      showCompleteOwnDomainOptionModal: false,
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
  },
  created() {
    this.getContractPlan() // 契約プラン情報の取得
  },
  mounted() {},
  methods: {
    /**
     * optionデータを取得
     *
     * @param {String} optionId オプションID
     * @param {String} keyName key名
     * @return {String|Number|Boolean} オプションデータ
     */
    getOptionData(optionId, keyName) {
      return this.contractPlan.options.find(
        (data) => data.optionId === optionId
      )[keyName]
    },
    /**
     * サブドメイン確定モーダルの表示
     */
    completeOwnDomainOption() {
      this.hideModal()
      this.showCompleteOwnDomainOptionModal = true
    },
    /**
     * 契約プラン情報の取得
     */
    getContractPlan() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getContractPlan(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.contractPlan = resData.data.data
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
     * 独自ドメイン申し込み完了モーダルを閉じ、契約プラン情報を更新
     */
    completeOwnDomainOptionModalClose() {
      this.hideModal()
      this.getContractPlan()
    },
    /**
     * モーダルを閉じる
     */
    hideModal() {
      this.showOwnDomainOptionModal = false
      this.showCompleteOwnDomainOptionModal = false
    },
  },
  head() {
    return {
      title: '契約プラン｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.bold {
  font-weight: 500;
}
.contract {
  .main-contents {
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
      .plan-block {
        &-contents {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 97px;
          margin-top: 24px;
          background: #f5f5f5;
          padding: 0 40px 0 32px;
          &-detail {
            display: flex;
            align-items: center;
            p {
              &:not(:last-child) {
                margin-right: 32px;
              }
            }
          }
        }
      }
      .available-service-block {
        margin-top: 40px;
        &-title {
          margin-top: 24px;
        }
        &-contents {
          // display: flex;
          margin-top: 24px;
          &-table {
            // width: 604px;
            table {
              min-width: auto;
            }
            tbody {
              tr {
                height: 72px;
              }
            }
            tr {
              th,
              td {
                &.service {
                  width: 184px;
                  min-width: 184px;
                }
                &.limitations {
                  width: 217px;
                  min-width: 217px;
                }
                &.option {
                  width: auto;
                  min-width: 416px;
                }
                &.startDay {
                  width: 214px;
                  min-width: 214px;
                  .btn {
                    float: right;
                    margin-right: 12px;
                  }
                }
                .icon {
                  width: 32px;
                  height: 32px;
                  margin-right: 8px;
                }
              }
            }
          }
          &-other {
            width: 100%;
            margin-left: 40px;
            flex: 1;
            &-option,
            &-function {
              .title {
                font-size: 17px;
                font-weight: 500;
              }
              .context {
                margin-top: 12px;
              }
            }
            &-option {
              padding-bottom: 24px;
              border-bottom: 1px solid #e5e5e5;
            }
            &-function {
              padding-top: 24px;
            }
          }
        }
      }
      .help-block {
        margin-top: 40px;
        ul {
          display: flex;
          align-items: center;
          li {
            width: calc(100% / 3);
            height: 136px;
            box-shadow: 0px 1px 5px #00000029;
            border-radius: 6px;
            font-size: 20px;
            font-weight: 500;
            text-decoration: none;
            position: relative;
            &:hover {
              background: #f8f9fa;
            }
            &:not(:last-child) {
              margin-right: 16px;
            }
            a {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              .icon {
                width: 16px;
                height: 16px;
                margin-left: 10px;
              }
            }
          }
        }
      }
      .cancel-link {
        margin-top: 24px;
      }
    }
  }
}
</style>
