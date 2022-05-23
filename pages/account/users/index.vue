<template>
  <div class="account-list">
    <div class="main-contents">
      <div class="header">
        <div class="header-txt">
          <h2 class="header-title">アカウント一覧</h2>
          <p class="header-sub">
            現在利用可能なアカウントは{{ limitAccountNum }}名までです。
          </p>
        </div>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkNewBtnDisabled() }"
          @click="linkNewAccount()"
        >
          新規アカウント作成
        </button>
      </div>
      <div class="header-search">
        <p class="header-search-title">キーワード検索</p>
        <div class="input-text">
          <CustomInputText
            v-model="searchText"
            placeholder="アカウントIDや氏名を入力して検索"
            view-type="search"
            maxlength=""
            @submit="changeListSearchWord($event)"
          />
        </div>
      </div>
      <div class="contents">
        <AccountListTable
          :account-list="accountList"
          :search-text="submitSearchText"
          @resendMail="resendInvitationMail($event)"
          @deleteAccount="deleteAccount($event)"
        />
      </div>
      <ResendInvitationMailModal
        v-if="sendMail.popupFlg"
        :account="sendMail.userId"
        @close="hideModal()"
        @send="sendMailEvt()"
      />
      <AccountDeleteModal
        v-if="accountDeleteModalFlg"
        :delete-account-data="deleteAccountData"
        @deleted="reload()"
        @close="hideModal()"
      />
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      accountDeleteModalFlg: false,
      deleteAccountData: {},
      accountList: [],
      limitAccountNum: 0,
      searchText: '',
      submitSearchText: '',
      sendMail: {
        popupFlg: false,
        userId: '',
      },
    }
  },
  computed: {},
  created() {
    this.getAccountList() // アカウントリストの取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setCompletePopAlertLabel']),
    /**
     * アカウント削除後、モーダルの非表示、アカウントリスト更新
     */
    reload() {
      this.hideModal()
      this.getAccountList()
    },
    /**
     * アカウント新規作成ボタンDisabled処理
     */
    checkNewBtnDisabled() {
      return this.accountList.length >= this.limitAccountNum
    },
    /**
     * アカウントリストの取得
     */
    getAccountList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getAccountList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.limitAccountNum = resData.data.limitAccountNum
            this.accountList = resData.data.accountList
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
     * 検索ワードにて絞り込み実行
     *
     * @param {String} searchWord 検索ワード
     */
    changeListSearchWord(searchWord) {
      this.submitSearchText = searchWord
    },
    /**
     * 新規アカウント作成ボタン押下時アクション
     */
    linkNewAccount() {
      this.$router.push('/account/users/edit/')
    },
    /**
     * 招待メールを再送する
     *
     * @param {Object} account メール再送信するテナントユーザデータ
     */
    resendInvitationMail(account) {
      this.sendMail.userId = account
      this.sendMail.popupFlg = true
    },
    /**
     * アカウントを削除する。削除後はアカウント一覧の再取得
     *
     * @param {Object} account アカウントを削除するテナントユーザデータ
     */
    deleteAccount(account) {
      this.accountDeleteModalFlg = true
      this.deleteAccountData = account
    },
    /**
     * 再招待メール送信後、リストの再取得
     */
    sendMailEvt() {
      this.setCompletePopAlertLabel('招待メールが再送されました')
      this.hideModal()
      this.getAccountList()
    },
    /**
     * モーダルの非表示
     */
    hideModal() {
      this.accountDeleteModalFlg = false
      this.sendMail.popupFlg = false
    },
  },

  head() {
    return {
      title: 'アカウント一覧｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    &-sub {
      margin-top: 8px;
    }
  }
}
// 検索ボックス
.header-search {
  margin: 40px 0 0 0;
  &-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  .input-text {
    position: relative;
    margin: 0 0 32px 0;
  }
  .icon {
    &-close {
      position: absolute;
      top: 12px;
      right: 60px;
      cursor: pointe;
    }
    &-search {
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
  }
}
</style>
