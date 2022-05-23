<template>
  <div class="mail-settings">
    <div v-if="Object.keys(mailInformation).length > 0" class="main-contents">
      <ToBackScreenLink
        label="メール一覧へ戻る"
        @click="backMailListScreen()"
      />
      <div class="header">
        <h2 class="title">
          {{ mailInformation.mailTitle
          }}<EditSVG
            class="icon icon-edit"
            @click="showChangeMailTitleModal()"
            @mouseover="
              $common.setAreaLabel(
                $event,
                'top',
                'メールタイトルを変更します。'
              )
            "
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
        </h2>
        <p class="sub-title">
          配信するメールの宛先や本文、配信日時を設定します。
        </p>
        <p class="mail-id"><span>メールID:</span>{{ $route.params.mailId }}</p>
      </div>
      <div class="contents">
        <div class="nav">
          <FormNav
            :nav-list="navList"
            :select-index="selectTabIndex"
            :can-click="true"
            @click="exeSelectTab($event)"
          />
          <button
            class="btn btn-secondary btn-long"
            :class="{ 'btn-disabled': updateBtnDisabledFlg }"
            @click="showMailPreview()"
          >
            プレビュー
            <OpenInNewSVG class="icon-openInNew" />
          </button>
        </div>
        <EditMailDestinationSettingsComponent
          v-if="
            selectTabIndex === 0 &&
            Object.keys(contactsDistributionMaster).length > 0
          "
          ref="sendCondition"
          :prop-mail-settings="mailInformation.sendCondition"
          :account-list="accountList"
          @update="updateEditMailSettings($event)"
        />
        <EditMailContentsSettingsComponent
          v-if="selectTabIndex === 1"
          ref="mailContent"
          :prop-mail-settings="mailInformation.mailContent"
          @update="updateEditMailSettings($event)"
        />
        <EditMailPublishSettingsComponent
          v-if="selectTabIndex === 2"
          ref="sendConfiguration"
          :prop-mail-settings="mailInformation.sendConfiguration"
          :prop-send-condition="mailInformation.sendCondition"
          @update="updateEditMailSettings($event)"
          @refresh="getMailDetail()"
        />
      </div>
    </div>
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="exeCloseCancelEditModal()"
    />
    <ChangeMailTitleModal
      v-if="showChangeMailTitleModalFlg"
      :prop-mail-title="mailInformation.mailTitle"
      @reflect="changeMailTitle($event)"
      @close="hideChangeMailTitleModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      defaultMailInformation: {},
      mailInformation: {},
      mailRecordVersion: null,
      navList: ['宛先設定', 'メール設定', '配信設定'],
      showChangeMailTitleModalFlg: false,
      updateBtnDisabledFlg: false,
      selectTabIndex: 0,
      selectTabBefore: null,
      accountList: [],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    ...mapState('mail/editMailSettings', [
      'cancelAfterFunc',
      'contactsDistributionMaster',
    ]),
  },
  created() {
    this.getMailDetail() // メール情報取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    ...mapMutations('mail/editMailSettings', [
      'setCancelAfterFunc',
      'setContactsDistributionMaster',
      'setFormInformation',
      'setMailStatus',
      'setShowEditMailComponentModalState',
    ]),
    /**
     * メール情報取得
     */
    getMailDetail() {
      const paramData = {
        mailId: this.$route.params.mailId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const mailInformation = resData.data.mailInformation

            this.defaultMailInformation = JSON.parse(
              JSON.stringify(mailInformation)
            )
            this.mailInformation = mailInformation
            this.mailRecordVersion = resData.data.recordVersion
            this.setFormInformation(resData.data.formInformation)
            this.setMailStatus(resData.data.mailStatus)
            this.getMailContactsDistribution() // 宛先情報一覧の取得
            this.getAccountList() // アカウントリストの取得
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
     * 宛先設定-配信情報一覧取得
     */
    getMailContactsDistribution() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getMailContactsDistribution(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setContactsDistributionMaster(resData.data.contactCondition)
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
     * アカウントリストの取得
     */
    getAccountList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getAccountList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
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
     * メール情報更新API
     *
     * @param {object} data 更新情報 data.requestParam:リクエストパラメータ data.afterFunc:更新処理成功後の処理
     */
    updateEditMailSettings(data) {
      const paramData = {}

      paramData.mailId = this.$route.params.mailId
      paramData.recordVersion = this.mailRecordVersion
      paramData.mailInformation = data.requestParam

      this.$common.addCallApiNum()
      this.$api
        .updateEditMailSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getMailDetail()
            this.$common.showCompletePopAlert('ActionMsg_Gen01')

            if (data.afterFunc === 'next') {
              this.updateSelectTab(this.selectTabIndex + 1)
            } else if (['send', 'sendTest'].includes(data.afterFunc)) {
              this.sendMailData(data.afterFunc === 'sendTest' ? '1' : '0') // メール配信
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
     * タブ押下時の処理
     *
     * @param {number} value タブ値
     */
    exeSelectTab(value) {
      this.selectTabBefore = value

      this.$nextTick(() => {
        const changeDataFlg = this.getChangeDataFlg()

        if (changeDataFlg) {
          this.setCancelAfterFunc('move')
          this.showCancelEditModal()
        } else {
          this.updateSelectTab(this.selectTabBefore)
          this.selectTabBefore = null
        }
      })
    },
    /**
     * メール配信
     *
     * @param {string} testFlag テスト配信フラグ 0:本番 1:テスト
     */
    sendMailData(testFlag) {
      const paramData = {
        mailId: this.$route.params.mailId,
        recordVersion: this.mailRecordVersion,
        reserveFlag: this.mailInformation.sendConfiguration.sendType,
        sendSectionFlag: '0',
        testFlag,
      }

      this.$common.addCallApiNum()
      this.$api
        .sendMailData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * 値変更フラグの取得
     *
     * @return {boolean} 値変更フラグ
     */
    getChangeDataFlg() {
      let changeDataFlg = false

      switch (this.selectTabIndex) {
        case 0:
          changeDataFlg = this.$refs.sendCondition.checkChangeInputData()
          break
        case 1:
          changeDataFlg = this.$refs.mailContent.checkChangeInputData()
          break
        case 2:
          changeDataFlg = this.$refs.sendConfiguration.checkChangeInputData()
          break
        default:
          break
      }

      return changeDataFlg
    },
    /**
     * メール一覧画面に戻る
     */
    backMailListScreen() {
      const changeDataFlg = this.getChangeDataFlg()

      if (changeDataFlg) {
        this.setCancelAfterFunc('back')
        this.showCancelEditModal()
      } else {
        this.$router.push('/mail/list/')
      }
    },
    /**
     * タブ切り替え処理
     *
     * @param {number} value 選択したタブのインデックス
     */
    updateSelectTab(value) {
      this.selectTabIndex = value
      this.$common.initScrollTop()
    },
    /**
     * メールタイトル変更モーダルの表示
     */
    showChangeMailTitleModal() {
      this.showChangeMailTitleModalFlg = true
    },
    /**
     * メールタイトル変更モーダルの非表示
     */
    hideChangeMailTitleModal() {
      this.showChangeMailTitleModalFlg = false
    },
    /**
     * メールタイトル変更処理
     *
     * @param {string} mailTitle メールタイトル
     */
    changeMailTitle(mailTitle) {
      const paramData = {
        requestParam: {
          mailTitle,
        },
      }

      this.updateEditMailSettings(paramData)
    },
    /**
     * メールプレビュー画面の表示
     */
    showMailPreview() {
      window.open(`/mail/preview/${this.$route.params.mailId}`, '_blank')
    },
    /**
     * 編集破棄モーダルの非表示
     */
    exeCloseCancelEditModal() {
      this.selectTabBefore = null
      this.setCancelAfterFunc('')
      this.hideCancelEditModal()
    },
    /**
     * 編集破棄モーダル(パーツ)の非表示
     */
    exeCloseCancelEditPartsModal() {
      this.setCancelAfterFunc('')
      this.hideCancelEditModal()
      this.setShowEditMailComponentModalState(false)
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      if (this.cancelAfterFunc === 'editModalClose') {
        this.exeCloseCancelEditPartsModal()
      } else if (this.cancelAfterFunc === 'back') {
        this.$router.push('/mail/list/')
      } else if (this.cancelAfterFunc === 'move') {
        this.updateSelectTab(this.selectTabBefore)
        this.selectTabBefore = null
      } else {
        switch (this.selectTabIndex) {
          case 0:
            this.$refs.sendCondition.restoreSettings()
            break
          case 1:
            this.$refs.mailContent.restoreSettings()
            break
          case 2:
            this.$refs.sendConfiguration.restoreSettings()
            break
          default:
            break
        }

        this.$common.showCompletePopAlert('ActionMsg_Gen02')
      }
    },
  },
  head() {
    return {
      title:
        (Object.keys(this.mailInformation).length > 0
          ? this.mailInformation.mailTitle
          : '') + '配信レポート｜メール',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .link-text {
    display: flex;
    align-items: center;
    .btn-back {
      fill: #007aff;
      transform: scale(-1, 1);
    }
  }
  .header {
    margin-top: 17px;
    padding-bottom: 40px;
    .title {
      display: flex;
      align-items: center;
      .icon {
        margin-left: 18px;
        cursor: pointer;
      }
    }
    .sub-title {
      margin-top: 8px;
    }
    .mail-id {
      margin-top: 24px;
      span {
        font-weight: 500;
        margin-right: 24px;
      }
    }
  }
  .contents {
    padding-top: 32px;
    border-top: 1px solid #e0e0e0;
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 48px;
      .btn {
        display: flex;
        align-items: center;
        margin-left: 40px;
        position: relative;
        .icon-openInNew {
          width: 16px;
          height: 16px;
          fill: #4f7df0;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
