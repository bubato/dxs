<template>
  <div class="analytics">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">共通設定</h2>
        <p class="header-sub">
          事務局から当テナントで登録されているユーザーでのログイン可否を設定します。
        </p>
      </div>
      <div class="contents">
        <div class="form-block">
          <h3>事務局ログイン設定</h3>
          <p>
            事務局から当テナントで登録されているユーザーでのログイン可否を設定します。
          </p>
          <div class="form-item">
            <p class="input-status any title">任意</p>
            <CustomInputSingleCheckbox
              v-model="commonSettings.checkLoginPermission"
              label="事務局からのログインを許可する"
              name="checkLoginPermission"
            />
          </div>
        </div>
        <div class="form-block">
          <h3>管理画面接続IPアドレス</h3>
          <p>
            管理画面にログインできるIPアドレスの設定を行います。ワイルドカードとして「*」を利用できます。<br />
            複数のIPアドレスを設定する場合は改行してIPアドレスを入力してください。
          </p>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="IPアドレス"
              :required="false"
            />
            <CustomInputTextarea
              v-model="commonSettings.connectionIpAddress"
              class="textarea"
              placeholder="IPアドレスを入力してください"
              :validation="
                $common.getFormItemsDetail(formItems, 'connectionIpAddress')
                  .validation
              "
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultCommonSettings,
              commonSettings
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          class="btn btn-basic btn-long"
          @click="updateAccountCommonSettings()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
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
      defaultCommonSettings: {},
      commonSettings: {
        checkLoginPermission: false,
        connectionIpAddress: '',
      },
      formItems: [
        {
          id: 'connectionIpAddress',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.ipAddressFormat,
              message: this.$common.getMasterMessage('ErrorMsg_Ip02'),
            },
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),

    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'connectionIpAddress',
            this.commonSettings.connectionIpAddress
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.getAccountCommonSettings()
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * 共通設定の取得
     */
    getAccountCommonSettings() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getAccountCommonSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const commonSettings = this.setNullInitData(resData.data.data)

            this.defaultCommonSettings = JSON.parse(
              JSON.stringify(commonSettings)
            )
            this.commonSettings = commonSettings
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
     * @param {object} commonSettings 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(commonSettings) {
      this.$common.setNullConvertStringValue(commonSettings, [])
      commonSettings.checkLoginPermission =
        commonSettings.checkLoginPermission || false

      return commonSettings
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      this.commonSettings = JSON.parse(
        JSON.stringify(this.defaultCommonSettings)
      )
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * 設定内容を保存ボタン押下処理
     */
    updateAccountCommonSettings() {
      const paramData = {
        data: {
          checkLoginPermission: this.commonSettings.checkLoginPermission,
          connectionIpAddress: this.commonSettings.connectionIpAddress,
          recordVersion: this.commonSettings.recordVersion,
        },
      }

      this.$common.addCallApiNum()
      this.$api
        .updateAccountCommonSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getAccountCommonSettings()
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
  },
  head() {
    return {
      title: '共通設定｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.analytics {
  .main-contents {
    .header {
      &-sub {
        margin-top: 8px;
      }
    }
    .contents {
      margin-top: 32px;
      .form-block {
        padding: 32px 0 40px 0;
        border-bottom: 1px solid #e5e5e5;
        p {
          margin-top: 8px;
        }
        &:not(:last-child) {
          border-top: 1px solid #e5e5e5;
        }
        .form-item {
          margin-top: 32px;
          &.tag {
            margin-top: 24px;
            .btn {
              margin-top: 12px;
            }
          }
          .title {
            margin-bottom: 10px;
          }
          .textarea {
            ::v-deep .custom-input-textarea-block {
              height: 128px;
            }
          }
          .input-status {
            width: 40px;
            font-size: 12px;
            line-height: 24px;
            text-align: center;
            &.require {
              color: #ffffff;
              background-color: #ff453a;
            }
            &.any {
              border: 1px solid #ff453a;
              color: #ff453a;
              background-color: #ffffff;
            }
          }
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
