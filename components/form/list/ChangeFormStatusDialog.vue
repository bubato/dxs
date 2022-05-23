<template>
  <div class="change-form-status-dialog">
    <p class="title">
      変更したいステータスを選択して<br />ボタンをクリックしてください。
    </p>
    <CustomInputSelect
      v-model="selectStatus"
      class="select-status"
      :options="formStatusOptions"
    />
    <div class="buttons">
      <button class="btn btn-basic btn-middle" @click="updateFormStatus()">
        ステータスを変更
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChangeFormStatusDialog',
  props: {},
  data() {
    return {
      selectStatus: '',
      formStatusOptions: [],
      privateOption: {
        code: '1',
        label: 'フォームを非公開',
      },
      startPeriodOption: {
        code: '3',
        label: '受付を開始',
      },
      endPeriodOption: {
        code: '4',
        label: '受付を終了',
      },
    }
  },
  computed: {
    ...mapState('form/formList', ['selectFormInfo']),
  },
  created() {
    this.setStatusOption() // フォームステータスのオプション設定
  },
  methods: {
    /**
     * フォームステータスのオプション設定
     */
    setStatusOption() {
      const formStatus = this.selectFormInfo.status
      const receptionPeriodFlag = this.selectFormInfo.receptionPeriodFlag

      if (['2', '3', '4'].includes(formStatus)) {
        this.formStatusOptions.push(this.privateOption)
      }

      if (formStatus === '2' && receptionPeriodFlag === 1) {
        this.formStatusOptions.push(this.startPeriodOption)
      } else if (formStatus === '3' && receptionPeriodFlag === 1) {
        this.formStatusOptions.push(this.endPeriodOption)
      }

      if (this.formStatusOptions.length > 0) {
        this.selectStatus = this.formStatusOptions[0].code
      }
    },
    updateFormStatus() {
      if (this.selectFormInfo.status === this.selectStatus) {
        this.$emit('close')
        return
      }

      const paramData = {
        formId: this.selectFormInfo.formId,
        status: this.selectStatus,
        recordVersion: this.selectFormInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateFormStatus(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
            this.$common.showCompletePopAlert('ActionMsg_Gen05')
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

<style scoped lang="scss">
.change-form-status-dialog {
  position: absolute;
  width: 312px;
  padding: 24px 16px;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  background: #ffffff;
  margin-left: -144px;
  z-index: 1;
  .select-status,
  .buttons {
    margin-top: 16px;
  }
}
</style>
