<template>
  <div class="account-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="companyCode">
              顧問先番号<SortSpinner
                sort-id="companyCode"
                :current-type="{ sort: '' }"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="tenantId">テナントID</th>
            <th class="companyName">
              企業名<SortSpinner
                sort-id="companyName"
                :current-type="{ sort: '' }"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="mailAddress">メールアドレス</th>
            <th class="invitedMailAddress">招待済メールアドレス</th>
            <th class="status">
              ステータス<SortSpinner
                sort-id="status"
                :current-type="{ sort: '' }"
                @spinner-click="updateSortTable($event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invitation, index) in invitationList" :key="index">
            <td class="companyCode">
              {{ invitation.companyCode.toString() }}
            </td>
            <td class="tenantId">
              {{ invitation.tenantId }}
            </td>
            <td class="companyName">
              {{ invitation.companyName }}
            </td>
            <td class="mailAddress">
              <div v-if="invitation.status !== 3" class="flex flex-between">
                <CustomInputSelect
                  v-model="selectMailAddress[index]"
                  :options="selectOptionDataList[index]"
                  class="mailAddressSelect"
                  :class="{
                    mailAddressSelectOther:
                      selectMailAddress[index] === 'directInput',
                  }"
                />
                <CustomInputText
                  v-if="selectMailAddress[index] === 'directInput'"
                  v-model="otherMailAddress[index]"
                  placeholder="入力例：account@tanaka.co.jp"
                  class="mailAddressInput"
                  :validation="mailAddress.validation"
                  :maxlength="mailAddress.maxlength"
                />
              </div>
            </td>
            <td class="invitedMailAddress">
              <div class="flex flex-between">
                <span>{{ invitation.invitationEmail }}</span>
                <button
                  v-if="invitation.status !== 3 && invitation.status !== 4"
                  class="btn btn-secondary btn-short"
                  :class="{
                    'btn-disabled': checkBtnDisabled(index),
                  }"
                  @click="sendMail(index)"
                >
                  {{ statusActionBtnLabel[invitation.status] }}
                </button>
              </div>
            </td>
            <td class="status">
              <InvitationListTableStatusLabel
                :status="{ status: invitation.status }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'InvitationListTable',
  mixins: [clickaway],
  props: {
    invitationList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      selectOptionDataList: [],
      selectMailAddress: [],
      otherMailAddress: [],
      selectIndex: -1,
      selectMenuDialogIndex: null,
      statusActionBtnLabel: {
        0: '招待',
        1: '再送',
        2: '再送',
        3: '',
      },
      mailAddress: {
        maxlength: 254,
        validation: [
          {
            type: 'required',
            message: this.$common.getMasterMessage('ErrorMsg_Required01'),
          },
          {
            type: 'regex',
            regex: this.$globalVariable.regularExp.mail,
            message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
          },
          {
            type: 'regex',
            regex: this.$globalVariable.regularExp.mailAt,
            message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
          },
        ],
      },
    }
  },
  computed: {},
  watch: {
    invitationList(afterVal) {
      for (const index in afterVal) {
        this.selectOptionDataList.push(
          this.makeSelectOptionData(afterVal[index].dlkEmail, index)
        )
      }
    },
  },
  methods: {
    /**
     * メールアドレスセレクトボックスデータの成型
     *
     * @param {Array} mailAddressList 顧問先メールアドレスリスト
     * @param {Number} index invitationListインデックス
     * @return {Object} 顧問先メールアドレスリスト(CustomInputSelect用に成型)
     */
    makeSelectOptionData(mailAddressList, index) {
      const selectOptionDataList = []
      const selectOptionData = {
        code: 'directInput',
        label: '直接入力',
      }

      for (const key in mailAddressList) {
        if (mailAddressList[key] !== '') {
          const label =
            key === 'representativeEmail' ? '(代表者)' : '(経理責任者)'
          const selectOptionData = {
            code: key,
            label: mailAddressList[key] + label,
          }

          selectOptionDataList.push(selectOptionData)
        }
      }

      selectOptionDataList.push(selectOptionData)
      this.selectMailAddress[index] = selectOptionDataList[0].code
      return selectOptionDataList
    },
    /**
     * 送信・再送ボタン非活性チェック処理
     *
     * @param {Number} index 顧問先招待配列index
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled(index) {
      let result = false

      if (this.selectMailAddress[index] !== 'directInput') {
        return result
      }

      if (
        this.$common.getValidationMsg(
          this.mailAddress.validation,
          this.otherMailAddress[index],
          false
        ).length > 0
      ) {
        result = true
      }

      if (!this.otherMailAddress[index]) {
        result = true
      }

      return result
    },
    /**
     * ソート処理・テーブル更新
     *
     * @param {order:Number sort:String} sortData order:昇順降順 sort:ソート対象項目
     */
    updateSortTable(sortData) {
      let list = []

      if (sortData.order === 0) {
        // 昇順
        list = this.ascendingOrder(this.invitationList, sortData.sort)
      } else {
        // 降順
        list = this.descendingOrder(this.invitationList, sortData.sort)
      }

      this.invitationList = list
    },
    /**
     * ソート昇順
     *
     * @param {Array} list ソート対象リスト
     * @param {String} sortDataName ソート対象項目名
     * @return {Array} ソートしたデータ
     */
    ascendingOrder(list, sortDataName) {
      return list.sort((itemA, itemB) => {
        const firstSortA = this.createSortData(itemA[sortDataName])
        const firstSortB = this.createSortData(itemB[sortDataName])
        const secondSortA = itemA.companyCode.toString().toUpperCase()
        const secondSortB = itemB.companyCode.toString().toUpperCase()

        if (firstSortA < firstSortB) {
          return -1
        }

        if (firstSortA > firstSortB) {
          return 1
        }

        if (secondSortA < secondSortB) {
          return -1
        }

        if (secondSortA > secondSortB) {
          return 1
        }

        return 0
      })
    },
    /**
     * ソートデータの成型
     *
     * @param {String} sortData ソートデータ
     * @return {String} 成型したソートデータ
     */
    createSortData(sortData) {
      let result = ''

      if (typeof sortData !== 'string') {
        result = sortData.toString().toUpperCase()
      } else {
        result = sortData.toUpperCase()
      }

      return result
    },
    /**
     * ソート降順
     *
     * @param {Array} list ソート対象リスト
     * @param {String} sortDataName ソート対象項目名
     * @return {Array} ソートしたデータ
     */
    descendingOrder(list, sortDataName) {
      return this.ascendingOrder(list, sortDataName).reverse()
    },
    /**
     * ダイアログを閉じる
     */
    closeDialog() {
      this.selectIndex = -1
    },
    /**
     * 招待メールを送信する
     *
     * @param {String} index 招待メールを送信するテナントindex
     */
    sendMail(index) {
      let sendMailAddress = ''

      if (this.selectMailAddress[index] === 'directInput') {
        // 直楔入力選択時
        sendMailAddress = this.otherMailAddress[index]
      } else {
        sendMailAddress = this.invitationList[index].dlkEmail[
          this.selectMailAddress[index]
        ]
      }

      this.$emit('send', {
        mail: sendMailAddress,
        companyCode: this.invitationList[index].companyCode,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.account-list-table {
  margin-top: 30px;
  .table-scroll {
    margin-top: 17px;
    table {
      tbody {
        tr {
          height: 48px;
        }
      }
      tr {
        th,
        td {
          &.companyCode {
            width: 112px;
            min-width: 112px;
          }
          &.tenantId {
            width: 90px;
            min-width: 90px;
          }
          &.companyName {
            min-width: 220px;
            width: auto;
          }
          &.mailAddress {
            width: 377px;
            min-width: 377px;
            .mailAddressSelect {
              width: 100%;
            }
            .mailAddressSelectOther {
              width: 116px;
            }
            .mailAddressInput {
              width: 224px;
            }
          }
          &.invitedMailAddress {
            width: 278px;
            min-width: 278px;
            span {
              width: 192px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          &.status {
            width: 154px;
            min-width: 154px;
          }
        }
        td {
          padding: 12px;
        }
      }
    }
  }
}
</style>
