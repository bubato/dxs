<template>
  <div class="form-list">
    <div v-if="Object.keys(editFormData).length > 0" class="main-contents">
      <ToBackScreenLink
        label="フォーム一覧へ戻る"
        @click="backFormListScreen()"
      />
      <div class="header">
        <h2 class="title">
          {{ editFormData.formTitle
          }}<EditSVG
            class="icon icon-edit"
            @click="showChangeFormTitleModal()"
            @mouseover="
              $common.setAreaLabel(
                $event,
                'top',
                'フォームタイトルを変更します。'
              )
            "
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
        </h2>
        <p class="sub-title">公開するフォームの項目や公開日時を設定します。</p>
        <p class="form-id"><span>フォームID:</span>{{ editFormData.formId }}</p>
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
            @click="showFormPreview()"
          >
            プレビュー
          </button>
        </div>
        <EditFormSettingsComponent
          v-if="selectTabIndex === 0 && editFormData.formSettings"
          ref="formSettings"
          :prop-form-settings="editFormData.formSettings"
          @update="updateEditFormSettings($event)"
        />
        <EditMailSettingsComponent
          v-if="selectTabIndex === 1 && editFormData.mailSettings"
          ref="mailSettings"
          :prop-mail-settings="editFormData.mailSettings"
          @update="updateEditFormSettings($event)"
        />
        <EditPublishSettingsComponent
          v-if="selectTabIndex === 2 && editFormData.publishSettings"
          ref="publishSettings"
          :prop-publish-settings="editFormData.publishSettings"
          @update="updateEditFormSettings($event)"
          @refresh="getEditFormSettings()"
        />
        <EditOtherSettingsComponent
          v-if="selectTabIndex === 3 && editFormData.otherSettings"
          ref="otherSettings"
          :prop-other-settings="editFormData.otherSettings"
          @update="updateEditFormSettings($event)"
        />
      </div>
    </div>
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="exeCloseCancelEditModal()"
    />
    <ChangeFormTitleModal
      v-if="showChangeFormTitleModalFlg"
      :prop-form-title="editFormData.formTitle"
      @reflect="changeFormTitle($event)"
      @close="hideChangeFormTitleModal"
    />
    <CompleteFormPublishModal
      v-if="showCompleteFormPublishModalState"
      @reflect="updateSelectTab(selectTabIndex + 1)"
      @close="setShowCompleteFormPublishModalState(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      selectTabIndex: 0,
      selectTabBefore: null,
      navList: ['フォーム設定', 'メール設定', '公開設定', 'タグ・CSS・JS'],
      defaultEditFormData: {},
      editFormData: {},
      showChangeFormTitleModalFlg: false,
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    ...mapState('form/editFormSettings', [
      'formInfo',
      'updateBtnDisabledFlg',
      'cancelAfterFunc',
      'showCompleteFormPublishModalState',
    ]),
  },
  created() {},
  mounted() {
    this.getEditFormSettings() // フォーム基本設定表示データ取得API
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    ...mapMutations('form/editFormSettings', [
      'setFormInfo',
      'setCancelAfterFunc',
      'setShowCompleteFormPublishModalState',
      'setShowFormEditPartsDetailModalState',
    ]),
    /**
     * フォーム一覧画面に戻る
     */
    backFormListScreen() {
      const changeDataFlg = this.getChangeDataFlg()

      if (changeDataFlg) {
        this.setCancelAfterFunc('back')
        this.showCancelEditModal()
      } else {
        this.$router.push('/form/list/')
      }
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
          this.setCancelAfterFunc('next')
          this.showCancelEditModal()
        } else {
          this.updateSelectTab(this.selectTabBefore)
          this.selectTabBefore = null
        }
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
          changeDataFlg = this.$refs.formSettings.checkChangeInputData()
          break
        case 1:
          changeDataFlg = this.$refs.mailSettings.checkChangeInputData()
          break
        case 2:
          changeDataFlg = this.$refs.publishSettings.checkChangeInputData()
          break
        case 3:
          changeDataFlg = this.$refs.otherSettings.checkChangeInputData()
          break
        default:
          break
      }

      return changeDataFlg
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
     * フォーム基本設定表示データ取得API
     *
     * @param {string} afterFunc 取得後の処理
     */
    getEditFormSettings(afterFunc) {
      const paramData = {
        formId: this.$route.params.formId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getEditFormSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const editFormData = this.setNullInitData(resData.data.editFormData)

            this.defaultEditFormData = JSON.parse(JSON.stringify(editFormData))
            this.editFormData = editFormData
            this.setFormInfo({
              formId: resData.data.editFormData.formId,
              formTitle: resData.data.editFormData.formTitle,
              selectParts: resData.data.editFormData.formSettings.selectParts,
              recordVersion: resData.data.editFormData.recordVersion,
              formPatternRecordVersion:
                resData.data.editFormData.formPatternRecordVersion,
            })

            if (afterFunc === 'next') {
              this.updateSelectTab(this.selectTabIndex + 1)
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
     * nullが返ってきたデータの初期値設定
     *
     * @param {object} editFormData 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(editFormData) {
      // nullで返ってきた文字列を空文字に変換
      this.$common.setNullConvertStringValue(editFormData.formSettings, [])
      this.$common.setNullConvertStringValue(
        editFormData.mailSettings.sourceSettings,
        []
      )
      this.$common.setNullConvertStringValue(
        editFormData.mailSettings.sendSettings,
        []
      )
      this.$common.setNullConvertStringValue(
        editFormData.mailSettings.answerSettings,
        []
      )
      this.$common.setNullConvertStringValue(
        editFormData.publishSettings.receptionPeriodSettings,
        []
      )
      this.$common.setNullConvertStringValue(
        editFormData.publishSettings.capacitySettings,
        []
      )
      this.$common.setNullConvertStringValue(
        editFormData.publishSettings.securitySettings,
        ['antiSpamFunction']
      )
      this.$common.setNullConvertStringValue(
        editFormData.publishSettings.otherSettings,
        []
      )
      this.$common.setNullConvertStringValue(
        editFormData.otherSettings.formTag,
        []
      )
      this.$common.setNullConvertStringValue(editFormData.otherSettings.js, [
        'googleAnalytics',
      ])
      this.$common.setNullConvertStringValue(
        editFormData.otherSettings.js.googleAnalytics,
        []
      )

      editFormData.formSettings.selectParts =
        editFormData.formSettings.selectParts || []
      editFormData.formSettings.showConfirmScreen =
        editFormData.formSettings.showConfirmScreen || '1'
      editFormData.formSettings.showCompleteScreen =
        editFormData.formSettings.showCompleteScreen || '1'
      editFormData.formSettings.downloadFile =
        editFormData.formSettings.downloadFile || []
      editFormData.formSettings.completeScreenDownloadFileAttachmentFlag =
        editFormData.formSettings.completeScreenDownloadFileAttachmentFlag ||
        '1'
      editFormData.formSettings.showCompleteBtn =
        editFormData.formSettings.showCompleteBtn || '1'
      editFormData.mailSettings.answerSettings.autoReply =
        editFormData.mailSettings.answerSettings.autoReply || '1'
      editFormData.publishSettings.receptionPeriodSettings.receptionPeriod =
        editFormData.publishSettings.receptionPeriodSettings.receptionPeriod ||
        '1'
      editFormData.publishSettings.capacitySettings.limitAnswer =
        editFormData.publishSettings.capacitySettings.limitAnswer || '1'
      editFormData.publishSettings.otherSettings.statusManagement =
        editFormData.publishSettings.otherSettings.statusManagement || '1'
      editFormData.publishSettings.otherSettings.statusManagementTexts = editFormData
        .publishSettings.otherSettings.statusManagementTexts || ['']

      editFormData.otherSettings.js.googleAnalytics.presenceOrAbsenceOfMeasurement =
        editFormData.otherSettings.js.googleAnalytics
          .presenceOrAbsenceOfMeasurement || '1'

      return editFormData
    },
    /**
     * フォーム基本設定表示データ更新API
     *
     * @param {Object} data 更新情報 data.requestParam:リクエストパラメータ data.afterFunc:取得処理成功後の処理
     * @param {string} type 呼び出し元タイプ
     */
    updateEditFormSettings(data, type) {
      const paramData = data.requestParam

      if (type !== 'changeTitle') {
        paramData.formId = this.formInfo.formId
        paramData.recordVersion = this.formInfo.recordVersion
        paramData.formPatternRecordVersion = this.formInfo.formPatternRecordVersion
        paramData.title = this.editFormData.formTitle
      }

      this.$common.addCallApiNum()
      this.$api
        .updateEditFormSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getEditFormSettings(data.afterFunc)
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
     * フォームプレビューページに遷移
     */
    showFormPreview() {
      window.open('/form/preview/' + this.$route.params.formId, '_blank')
    },
    /**
     * フォームタイトル変更モーダルの表示
     */
    showChangeFormTitleModal() {
      this.showChangeFormTitleModalFlg = true
    },
    /**
     * フォームタイトル変更モーダルの非表示
     */
    hideChangeFormTitleModal() {
      this.showChangeFormTitleModalFlg = false
    },
    /**
     * フォームタイトル変更処理
     */
    changeFormTitle(formTitle) {
      const paramData = {
        requestParam: {
          formId: this.formInfo.formId,
          title: formTitle,
          recordVersion: this.formInfo.recordVersion,
          formPatternRecordVersion: this.formInfo.formPatternRecordVersion,
        },
      }

      this.updateEditFormSettings(paramData, 'changeTitle')
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
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      if (this.cancelAfterFunc === 'back') {
        this.$router.push('/form/list/')
      } else if (this.selectTabBefore !== null) {
        this.updateSelectTab(this.selectTabBefore)
        this.selectTabBefore = null
      } else {
        if (this.cancelAfterFunc === 'editPartsCancel') {
          this.setShowFormEditPartsDetailModalState(false)
        } else {
          switch (this.selectTabIndex) {
            case 0:
              this.$refs.formSettings.restoreSettings()
              break
            case 1:
              this.$refs.mailSettings.restoreSettings()
              break
            case 2:
              this.$refs.publishSettings.restoreSettings()
              break
            case 3:
              this.$refs.otherSettings.restoreSettings()
              break
            default:
              break
          }
        }

        this.$common.showCompletePopAlert('ActionMsg_Gen02')
      }
    },
  },
  head() {
    return {
      title: (this.editFormData.formTitle || '') + '編集｜フォーム｜bizskyDX',
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
    .form-id {
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
        margin-left: 40px;
      }
    }
  }
}
</style>
