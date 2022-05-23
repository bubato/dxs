<template>
  <div class="table-area">
    <div class="flex flex-between">
      <ShowTableType
        :show-table-type="showTableType"
        @changeShowTableType="changeShowTableType($event)"
      />
      <div class="table-options">
        <button
          v-if="showTableType === 'table'"
          class="btn btn-utility"
          @click="showChangeTableItemModal()"
        >
          表示項目
        </button>
        <SettingShowNum
          :setting-show-num="settingShowNum"
          @update="updateSettingShowNum($event)"
        />
        <PageNav
          :current-page="currentPage"
          :setting-show-num="settingShowNum"
          :max-data-num="maxDataNum"
          @showPrevPage="showPrevPage()"
          @showNextPage="showNextPage()"
        />
      </div>
    </div>
    <div v-if="showTableType === 'table'" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th v-if="checkShowDispItems('id')" class="id">メールID</th>
            <th v-if="checkShowDispItems('title')" class="title">
              メールタイトル/メールプレビュー
            </th>
            <th v-if="checkShowDispItems('type')" class="type">メールタイプ</th>
            <th v-if="checkShowDispItems('status')" class="status">
              ステータス
            </th>
            <th
              v-if="checkShowDispItems('deliveryReservationDate')"
              class="delivery-reservation-date"
            >
              配信予約日時
            </th>
            <th v-if="checkShowDispItems('deliveryDate')" class="delivery-date">
              配信日時
            </th>
            <th v-if="checkShowDispItems('deliveryNum')" class="delivery-num">
              配信数
            </th>
            <th
              v-if="checkShowDispItems('deliveryErrorNum')"
              class="delivery-error-num"
            >
              配信エラー数
            </th>
            <th
              v-if="checkShowDispItems('facilityEffect')"
              class="facility-effect"
            >
              施策効果
            </th>
            <th class="settings"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mail, index) in mailListObj.list" :key="index">
            <td v-if="checkShowDispItems('id')" class="id">
              {{ mail.id }}
            </td>
            <td v-if="checkShowDispItems('title')" class="title">
              <div class="flex flex-between">
                <p>{{ mail.title }}</p>
                <PageviewSVG class="icon icon-pageview" />
              </div>
            </td>
            <td v-if="checkShowDispItems('type')" class="type">
              {{ mail.type }}
            </td>
            <td v-if="checkShowDispItems('status')" class="status">
              <div v-if="mail.status === 1" class="flex">
                <p class="status-completed flex">
                  <CheckCircleSVG
                    class="icon icon-check icon-checkCircle"
                  /><span>配信済</span>
                </p>
              </div>
              <div v-if="mail.status === 2" class="flex flex-between">
                <p class="status-reserve flex">
                  <RemoveCircleSVG
                    class="icon icon-circle icon-removeCircle"
                  /><span>配信予約</span>
                </p>
                <button class="btn btn-utility">詳細</button>
              </div>
              <div v-if="mail.status === 3" class="flex flex-between">
                <p class="status-error flex">
                  <ErrorSVG class="icon icon-error" /><span>配信エラー</span>
                </p>
                <button class="btn btn-utility">詳細</button>
              </div>
            </td>
            <td
              v-if="checkShowDispItems('deliveryReservationDate')"
              class="delivery-reservation-date"
            >
              {{ mail.deliveryReservationDate }}
            </td>
            <td v-if="checkShowDispItems('deliveryDate')" class="delivery-date">
              {{ mail.deliveryDate }}
            </td>
            <td v-if="checkShowDispItems('deliveryNum')" class="delivery-num">
              {{ $common.commaSeparate(mail.deliveryNum) }}
            </td>
            <td
              v-if="checkShowDispItems('deliveryErrorNum')"
              class="delivery-error-num"
            >
              {{ $common.commaSeparate(mail.deliveryNum) }}
            </td>
            <td
              v-if="checkShowDispItems('facilityEffect')"
              class="facility-effect"
            >
              <button
                v-if="mail.facilityEffect === 1"
                class="btn btn-utility"
                @click="setShowReportComponentFlg(true)"
              >
                レポートを見る
                <LaunchSVG class="icon icon-launch" />
              </button>
            </td>
            <td class="settings">
              <SettingsSVG class="icon icon-settings" />
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
  name: 'MailListTable',
  data() {
    return {
      showTableType: 'table',
      maxDataNum: 345,
      settingShowNum: 20,
      currentPage: 1,
    }
  },
  computed: {
    ...mapState('communication/mailList', ['mailListObj', 'showDispItems']),
    /**
     * コンポーネントに紐づくクラスの取得
     *
     * @param {string} key 表示項目Key
     */
    checkShowDispItems() {
      return (key) => {
        let result = false

        for (let i = 0; i < this.showDispItems.length; i++) {
          if (this.showDispItems[i].key === key) {
            result = true
            break
          }
        }

        return result
      }
    },
  },
  methods: {
    ...mapMutations('communication/mailList', [
      'showChangeTableItemModal',
      'setShowReportComponentFlg',
    ]),
    /**
     * 表示タイプを変更
     */
    changeShowTableType(tableType) {
      this.showTableType = tableType
    },
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(settingShowNum) {
      this.settingShowNum = settingShowNum
      this.currentPage = 1
      this.getMailList()
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.currentPage += 1
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.currentPage -= 1
    },
    getMailList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getMailList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMailListObj(resData.data)
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
}
</script>

<style lang="scss" scoped>
.table-area {
  border-top: 1px solid #ebeced;
  padding-top: 30px;
  margin-top: 30px;
  > .flex {
    .table-options {
      display: flex;
      > * {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
.table-scroll {
  margin-top: 17px;
  table {
    tbody {
      max-height: 482px;
      tr {
        height: 48px;
      }
    }
    tr {
      th,
      td {
        &.id {
          width: 76px;
          min-width: 76px;
        }
        &.title {
          width: auto;
        }
        &.type {
          width: 120px;
          min-width: 120px;
        }
        &.status {
          width: 200px;
          min-width: 200px;
        }
        &.delivery-reservation-date {
          width: 150px;
          min-width: 150px;
        }
        &.delivery-date {
          width: 150px;
          min-width: 150px;
        }
        &.delivery-error-num {
          width: 120px;
          min-width: 120px;
        }
        &.delivery-num {
          width: 120px;
          min-width: 120px;
        }
        &.facility-effect {
          width: 170px;
          min-width: 170px;
        }
        &.settings {
          width: 80px;
          min-width: 80px;
        }
      }
      td {
        &.title {
          p {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .icon {
            margin-right: 16px;
            cursor: pointer;
          }
        }
        &.status {
          > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            p {
              display: flex;
              align-items: center;
            }
            .status-completed {
              .icon {
                fill: #34c759;
              }
              color: #34c759;
            }
            .status-reserve {
              .icon {
                fill: #e2e3e5;
              }
            }
            .status-error {
              .icon {
                fill: #e60012;
              }
              color: #e60012;
            }
            .icon {
              width: 20px;
              height: 20px;
              margin-right: 4px;
            }
            button {
              background: #dce5fc;
              color: #4f7df0;
              margin-right: 16px;
            }
          }
        }

        &.facility-effect {
          button {
            background: #dce5fc;
            color: #4f7df0;
            .icon {
              width: 16px;
              height: 16px;
              margin-left: 4px;
              fill: #4f7df0;
            }
          }
        }
        &.settings {
          .icon {
            cursor: pointer;
          }
        }
      }
    }

    &.show-scrollBar {
      td {
        &:nth-of-type(7) {
          width: 63px;
          min-width: 63px;
        }
      }
    }
  }
}
</style>
