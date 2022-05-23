<template>
  <div class="cancel">
    <div class="header">
      <MainLogoSVG class="logo" />
      <h4 class="title">bizskyDX 解約フォーム</h4>
    </div>
    <p class="context">いつもbizskyDXをご利用いただきありがとうございます。</p>
    <div class="form-block">
      <div class="form-item">
        <p class="title">テナントID</p>
        {{ tenantId }}
      </div>
      <div class="form-item">
        <p class="title">解約希望月（翌月以降から選択できます）</p>
        <CustomInputSelect
          v-model="cancelPreferMonth"
          name="cancelPreferMonth"
          :options="cancelPreferMonthOptions"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="解約理由" :required="true" />
        <CustomInputSelect
          v-model="cancelReason"
          name="cancelReason"
          placeholder="選択してください"
          class="custom-input select"
          :options="this.$common.getVersatileOptions(6)"
          :validation="
            $common.getFormItemsDetail(formItems, 'cancelReason').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="解約理由（詳細）"
          :required="false"
        />
        <CustomInputTextarea
          v-model="cancelDetailReason"
          placeholder="入力してください"
          name="cancelDetailReason"
          :validation="
            $common.getFormItemsDetail(formItems, 'cancelDetailReason')
              .validation
          "
        />
      </div>
    </div>
    <div class="option">
      <CustomLinkText
        text="サービス解約規約"
        link="https://www.bizsky.io/terms/"
      />
      <CustomInputSingleCheckbox
        v-model="checkEnableCancellation"
        name="checkEnableCancellation"
        label="規約に同意する（規約をクリック後選択可能になります）"
        :validation="
          $common.getFormItemsDetail(formItems, 'checkEnableCancellation')
            .validation
        "
      />
    </div>
    <div class="buttons">
      <button
        class="btn btn-long btn-basic"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="putCancellation()"
      >
        解約を申し込む
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {
      tenantId: '',
      cancelPreferMonth: '',
      cancelReason: '',
      cancelDetailReason: '',
      contractRecordVersion: '',
      checkEnableCancellation: false,
      cancelPreferMonthOptions: [],
      formItems: [
        {
          id: 'cancelReason',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'cancelDetailReason',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'checkEnableCancellation',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required03'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    checkBtnDisabled() {
      return () => {
        let result = false

        const validationItems = {
          cancelReason: this.cancelReason,
          cancelDetailReason: this.cancelDetailReason,
          checkEnableCancellation: this.checkEnableCancellation,
        }

        for (const key in validationItems) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              validationItems[key]
            )
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
  },
  watch: {},
  created() {
    this.setInitData()
  },
  methods: {
    /**
     * 解約申し込みフォーム レコードバージョンの取得
     */
    getContractRecordVersion() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getContractRecordVersion(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (resData.data.cancelDate) {
              this.$router.push('/cancel/done/')
            } else {
              this.contractRecordVersion = resData.data.recordVersion
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
     * テナントIDの値の設定
     * レコードバージョンの取得
     * 解約希望月のセレクトボックスの値の設定
     */
    setInitData() {
      this.tenantId = this.masterData.tenantId
      this.getContractRecordVersion() // レコードバージョンの取得
      this.setCancelPreferMonthOptions() // 解約希望月のセレクトボックスの値の設定
    },
    /**
     * 解約希望月のセレクトボックスの値の設定
     */
    setCancelPreferMonthOptions() {
      const date = new Date()
      date.setMonth(date.getMonth() + 1) // 翌月に設定 // 翌月から6か月間の年月をプルダウンに設定
      for (let i = 0; i < 6; i++) {
        const month = date.getMonth() + 1 // プルダウンに設定する月
        const dateValue = date.getFullYear() + '/' + ('00' + month).slice(-2)
        if (i === 0) {
          this.cancelPreferMonth = dateValue // 初期値設定
        }
        this.cancelPreferMonthOptions.push({
          code: dateValue,
          label: dateValue,
        })
        date.setMonth(date.getMonth() + 1)
      }
    },
    /**
     * 解約申し込み処理
     */
    putCancellation() {
      const paramData = {
        cancelPreferMonth: this.cancelPreferMonth,
        cancelReason: this.cancelReason,
        cancelDetailReason: this.cancelDetailReason,
        contractRecordVersion: this.contractRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .putCancellation(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/cancel/complete/')
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
      title: 'bizskyDXを解約する｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.cancel {
  width: 468px;
  background: #ffffff;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 40px 24px;
  margin: 30px auto 0 auto;
  .header {
    text-align: center;
    .logo {
      width: 116px;
      height: 40px;
    }
    .title {
      margin-top: 8px;
    }
  }
  .context {
    text-align: center;
    margin-top: 16px;
  }
  .form-block {
    margin-top: 32px;
    .form-item {
      margin-bottom: 24px;
      .title {
        margin-bottom: 12px;
        font-weight: 500;
      }
      ::v-deep .custom-input-textarea-block {
        height: 128px;
      }
    }
  }
  .option {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    ::v-deep .link-text {
      margin-bottom: 16px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
  }
}
</style>
