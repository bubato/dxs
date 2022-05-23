<template>
  <div class="account-list">
    <div class="main-contents">
      <div class="header">
        <div class="header-txt">
          <h2 class="header-title">顧問先招待</h2>
          <p class="header-sub">
            選択した顧問先へbizskyDXへの招待メールを配信できます。<br />招待メールを送りたいアドレスを選択して「招待」ボタンをクリックしてください。
          </p>
        </div>
      </div>
      <div class="contents">
        <InvitationListTable
          :invitation-list="invitationListData"
          @send="checkSendInvitationMail($event)"
        />
      </div>
      <SendInvitationMailModal
        v-if="sendMailModal.flg"
        :send-mailaddress="sendMailModal.mailaddress"
        @close="hideModal()"
        @send="sendMailEvt()"
      />
      <SendInvitationMailErrorModal
        v-if="sendInvitationMailErrorModal.flg"
        :error-type="sendInvitationMailErrorModal.type"
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
      sendInvitationMailErrorModal: {
        type: 0,
        flg: false,
      },
      sendMailModal: {
        mailaddress: '',
        flg: false,
      },
      invitationListData: [],
      selectDataObj: {},
      sendMailString: '',
    }
  },
  computed: {},
  created() {
    this.getInvitationList() // 顧問先リストの取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setCompletePopAlertLabel']),
    /**
     * 顧問先リストの取得
     */
    getInvitationList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getInvitationList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.invitationListData = resData.data.client
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
     * 招待メールが送信可能なアドレスかチェック
     *
     * @param { Object } selectData mail: メールアドレス, number: 選択した顧問先カンパニーコード
     */
    checkSendInvitationMail(selectData) {
      const selectDataObj = this.invitationListData.find(
        (data) => data.companyCode === selectData.companyCode
      )
      this.sendMailString = selectData.mail
      this.selectDataObj = selectDataObj
      const paramData = {
        sendMailFlag: false,
        linkageId: this.selectDataObj.linkageId,
        mailAddress: this.sendMailString,
        clientStatusRecordVersion: this.selectDataObj.clientStatusRecordVersion,
        inviteRecordVersion: this.selectDataObj.inviteRecordVersion,
      }

      this.sendInvitationMail(paramData)
    },
    /**
     * 招待メール送信
     */
    sendMailEvt() {
      const paramData = {
        sendMailFlag: true,
        linkageId: this.selectDataObj.linkageId,
        mailAddress: this.sendMailString,
        clientStatusRecordVersion: this.selectDataObj.clientStatusRecordVersion,
        inviteRecordVersion: this.selectDataObj.inviteRecordVersion,
      }

      this.sendInvitationMail(paramData)
    },
    /**
     * 招待メールチェック送信API
     *
     * @param {Object} paramData 顧問先招待メール送信APIリクエストパラメータ
     */
    sendInvitationMail(paramData) {
      this.$common.addCallApiNum(this.sendMailModal.mailaddress)
      this.$api
        .sendInvitationMail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (paramData.sendMailFlag) {
              // メール送信完了
              this.setCompletePopAlertLabel('招待メールが送信されました')
              this.hideModal()
              this.getInvitationList()
              this.sendMailModal.mailaddress = ''
              this.selectDataObj = {}
            } else if (resData.data.messageType === 0) {
              // メールチェックOK
              this.sendMailModal.mailaddress = this.sendMailString
              this.sendMailModal.flg = true
            } else {
              // メールチェックNG
              this.sendInvitationMailErrorModal.type = resData.data.messageType
              this.sendInvitationMailErrorModal.flg = true
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
     * モーダルの非表示
     */
    hideModal() {
      this.sendMailModal.flg = false
      this.sendInvitationMailErrorModal.flg = false
      this.selectDataObj = {}
    },
  },

  head() {
    return {
      title: '顧問先招待｜アカウント｜bizskyDX',
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
</style>
