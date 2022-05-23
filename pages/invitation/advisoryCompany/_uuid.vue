<template>
  <div class="invited">
    <div class="header">
      <MainLogoSVG class="logo" />
    </div>
    <p class="context">
      会計データとMJSデータレイクの連携を<br />許可する依頼が届いています。<br />同意いただける方は必要情報を入力してください。
    </p>
    <div class="form-block">
      <div class="form-item">
        <p class="title">
          メールアドレス（招待メールを受信したメールアドレス）
        </p>
        <CustomInputText
          v-model="form.mailAddress"
          placeholder="入力例：account@tanaka.co.jp"
          maxlength="254"
          :validation="
            $common.getFormItemsDetail(formItems, 'mailAddress').validation
          "
        />
      </div>
    </div>
    <div
      v-for="(id, index) in teamsSetting.requireConsentIdList"
      :key="`first-${index}`"
    >
      <TeamsTemplate :id="id" />
    </div>
    <div class="buttons">
      <button
        class="btn btn-long btn-basic"
        :class="{
          'btn-disabled': checkBtnDisabled(),
        }"
        @click="postAdvisoryCompany()"
      >
        登録を完了
      </button>
    </div>
    <div
      v-for="(id, index) in teamsSetting.requireConsentIdList"
      :key="`second-${index}`"
    >
      <TeamsModal v-if="teamsSetting.modalOpenFlgId === id" :id="id" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  layout: 'onlyHeaderLogo',
  data() {
    return {
      recordVersion: {},
      consentRequiredTeams: [3], // 表示する利用規約IDを指定
      form: {
        mailAddress: '',
      },
      formItems: [
        {
          id: 'mailAddress',
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
      ],
    }
  },
  computed: {
    ...mapState('request/input', ['teamsSetting', 'teamsVersionIDList']),
    /**
     * ログインボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false
        const validationItems = {
          mailAddress: this.form.mailAddress,
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

        if (!result && this.checkTeamsAgree()) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.initTeamsData() // 利用規約表示設定の初期化
    this.getAdvisoryCompanyRecordVersion() // MJSデータレイクとの連携同意レコードバージョンの取得
  },
  mounted() {},
  methods: {
    ...mapMutations('request/input', [
      'initTeamsSettingData',
      'setTeamsSetting',
    ]),
    /**
     * 利用規約表示設定の初期化
     */
    initTeamsData() {
      this.initTeamsSettingData()
      const teamsSettingData = JSON.parse(JSON.stringify(this.teamsSetting))

      teamsSettingData.requireConsentIdList = teamsSettingData.requireConsentIdList.concat(
        this.consentRequiredTeams
      )
      this.setTeamsSetting(teamsSettingData)
    },
    /**
     * 利用規約の同意確認
     *
     * @return {bool} 全ての利用規約が同意されているか
     */
    checkTeamsAgree() {
      return (
        this.teamsSetting.agreeIdList.length !==
        this.teamsSetting.requireConsentIdList.length
      )
    },
    /**
     * MJSデータレイクとの連携同意レコードバージョンの取得
     */
    getAdvisoryCompanyRecordVersion() {
      const paramData = {
        uuid: this.$route.params.uuid,
      }

      this.$common.addCallApiNum()
      this.$api
        .getAdvisoryCompanyRecordVersion(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.recordVersion = resData.data
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
     * 登録を完了ボタンの処理
     */
    postAdvisoryCompany() {
      const paramData = {
        uuid: this.$route.params.uuid,
        termsOfServiceVersionId: Number(
          this.teamsVersionIDList[this.consentRequiredTeams]
        ),
        tenantRecordVersion: this.recordVersion.tenantRecordVersion,
        clientStatusRecordVersion: this.recordVersion.clientStatusRecordVersion,
        tenantConnectionRecordVersion: this.recordVersion
          .tenantConnectionRecordVersion,
        termsConsentHistoryRecordVersion: this.recordVersion
          .termsConsentHistoryRecordVersion,
        mailAddress: this.form.mailAddress,
      }

      this.$common.addCallApiNum()
      this.$api
        .postAdvisoryCompany(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/invitation/advisoryCompany/complete/')
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
      title: 'MJSデータレイクとの連携同意｜bizskyDX',
    }
  },
}
</script>
<style lang="scss" scoped>
.invited {
  width: 468px;
  background: #ffffff;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 40px 24px;
  margin: 40px auto 0 auto;
  .header {
    text-align: center;
    .title {
      margin-top: 8px;
    }
  }
  .context {
    font-size: 15px;
    margin-top: 8px;
    padding: 0 13px;
  }
  .form-block {
    margin-top: 32px;
    .form-item {
      margin-bottom: 24px;
      .title {
        font-weight: 500;
        margin-bottom: 14px;
      }
    }
  }
  .error {
    color: #ff0000;
    font-weight: 500;
    text-align: center;
    margin-top: 20px;
  }
  .option {
    display: flex;
    justify-content: center;
    flex-direction: column;
    ::v-deep .link-text {
      margin-bottom: 16px;
    }
    .title {
      font-weight: 500;
      margin-bottom: 5px;
    }
    .custom-input-single-checkbox {
      padding: 0 0 14px 0;
    }
  }
  .buttons {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 17px;
  }
}
</style>
