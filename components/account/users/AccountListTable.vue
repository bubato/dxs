<template>
  <div class="account-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="id">アカウントID</th>
            <th class="name">氏名</th>
            <th class="mailAddress">メールアドレス</th>
            <th class="status">ステータス</th>
            <th class="settings"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account, index) in searchAccountList" :key="index">
            <td class="id">
              {{ account.tenantUserId.toString() }}
            </td>
            <td class="name" :data-index="index">
              {{ account.name }}
            </td>
            <td class="mailAddress">
              {{ account.mailAddress }}
            </td>
            <td class="status">
              <AccountListTableStatusLabel
                :status="{ status: account.status }"
              />
            </td>
            <td class="settings">
              <SettingsSVG
                class="icon icon-settings"
                @click="selectIndex = index"
                @mouseover="$common.setAreaLabel($event, 'left', 'メニュー')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              />
              <AccountListMenuDialog
                v-if="selectIndex === index"
                v-on-clickaway="closeDialog"
                :account="account"
                @close="closeDialog"
                @resendMail="resendInvitationMail"
                @deleteAccount="deleteAccount"
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
  name: 'AccountListTable',
  mixins: [clickaway],
  props: {
    accountList: {
      type: Array,
      default: () => [],
      required: true,
    },
    searchText: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      selectIndex: -1,
      selectMenuDialogIndex: null,
    }
  },
  computed: {
    /**
     * 絞り込み検索（key:tenantUserId,nameの部分一致）
     */
    searchAccountList() {
      if (this.searchText === '') return this.accountList
      const searchKeyList = ['tenantUserId', 'name'] // 部分一致検索に利用するaccountListのkey指定
      const _searchText = this.searchText // 部分一致検索ワード
      return this.accountList.filter(function (item) {
        for (let index = 0; index < searchKeyList.length; index++) {
          const txt =
            Object.prototype.toString
              .call(item[searchKeyList[index]])
              .slice(8, -1)
              .toLowerCase() === 'string'
              ? item[searchKeyList[index]]
              : item[searchKeyList[index]].toString()
          if (txt.includes(_searchText)) {
            return true
          }
        }
        return false
      })
    },
  },
  methods: {
    /**
     * ダイアログを閉じる
     */
    closeDialog() {
      this.selectIndex = -1
    },
    /**
     * 招待メールを再送する
     *
     * @param {Object} account メール再送信するテナントユーザーID
     */
    resendInvitationMail(account) {
      this.closeDialog()
      this.$emit('resendMail', account)
    },
    /**
     * アカウントを削除する
     *
     * @param {Object} account アカウントを削除するテナントユーザーID
     */
    deleteAccount(account) {
      this.closeDialog()
      this.$emit('deleteAccount', account)
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
          &.id {
            width: 150px;
            min-width: 150px;
          }
          &.name {
            width: auto;
            min-width: 375px;
          }
          &.mailAddress {
            width: 250px;
            min-width: 250px;
          }
          &.status {
            width: 200px;
            min-width: 200px;
          }
          &.settings {
            width: 38px;
            min-width: 38px;
            padding-left: 0;
            text-align: center;
          }
        }
        td {
          &.settings {
            .icon {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
