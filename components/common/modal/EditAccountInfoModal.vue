<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4 class="header-title">アカウント情報の編集</h4>
          </div>
          <div class="modal_contents">
            <div class="contents">
              <div class="contents_read">
                <p>氏名、フリガナ、メールアドレスを編集できます。</p>
                <p>
                  利用可能機能やオプション機能の変更はアカウント設定から変更ください。
                </p>
              </div>
              <div class="form-block">
                <div class="form-item">
                  <RequiredFormLabel
                    class="title"
                    label="氏名"
                    :required="true"
                  />
                  <div class="name">
                    <CustomInputText
                      v-model="accountDetail.lastName"
                      class="last-name"
                      maxlength="30"
                      placeholder="渡来"
                      :validation="
                        $common.getFormItemsDetail(formItems, 'lastName')
                          .validation
                      "
                    />
                    <CustomInputText
                      v-model="accountDetail.firstName"
                      class="first-name"
                      maxlength="30"
                      placeholder="太郎"
                      :validation="
                        $common.getFormItemsDetail(formItems, 'firstName')
                          .validation
                      "
                    />
                  </div>
                </div>
                <div class="form-item">
                  <RequiredFormLabel
                    class="title"
                    label="フリガナ"
                    :required="true"
                  />
                  <div class="name">
                    <CustomInputText
                      v-model="accountDetail.lastNameKana"
                      class="last-name"
                      maxlength="30"
                      placeholder="トライ"
                      :validation="
                        $common.getFormItemsDetail(formItems, 'lastNameKana')
                          .validation
                      "
                    />
                    <CustomInputText
                      v-model="accountDetail.firstNameKana"
                      class="first-name"
                      maxlength="30"
                      placeholder="タロウ"
                      :validation="
                        $common.getFormItemsDetail(formItems, 'firstNameKana')
                          .validation
                      "
                    />
                  </div>
                </div>
                <div class="form-item">
                  <RequiredFormLabel
                    class="title"
                    label="メールアドレス"
                    :required="true"
                  />
                  <CustomInputText
                    v-model="accountDetail.mailAddress"
                    maxlength="254"
                    placeholder="sample@tribeck.jp"
                    :validation="
                      $common.getFormItemsDetail(formItems, 'mailAddress')
                        .validation
                    "
                    @blur="checkSameMailAddress()"
                  />
                </div>
              </div>
            </div>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-middle btn-basic"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="updateAccountDetailHeader()"
              >
                アカウント情報を保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChangeAccountId',
  components: {},
  props: {},
  data() {
    return {
      defaultAccountDetail: {},
      accountDetail: {
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        mailAddress: '',
      },
      formItems: [
        {
          id: 'lastName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'firstName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'lastNameKana',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.zenKana,
              message: this.$common.getMasterMessage('ErrorMsg_Format04'),
            },
          ],
        },
        {
          id: 'firstNameKana',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.zenKana,
              message: this.$common.getMasterMessage('ErrorMsg_Format04'),
            },
          ],
        },
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
    ...mapState('common', ['masterData']),
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.accountDetail) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.accountDetail[key]
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
  created() {
    this.tenantUserId = this.masterData.tenantUserId
    this.getAccountDetailHeader() // アカウント情報取得
  },
  methods: {
    /**
     * アカウント情報取得
     */
    getAccountDetailHeader() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getAccountDetailHeader(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.defaultAccountDetail = JSON.parse(
              JSON.stringify(resData.data.detailData)
            )
            this.accountDetail = resData.data.detailData
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
     * アカウント情報を保存ボタンの処理
     */
    updateAccountDetailHeader() {
      const paramData = this.getAccountDetailParam()

      this.$common.addCallApiNum()
      this.$api
        .updateAccountDetailHeader(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.getMasterData()
            this.$emit('close')
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
     * アカウント情報更新APIのリクエストパラメータの取得
     */
    getAccountDetailParam() {
      const paramData = {}

      paramData.detailData = this.accountDetail

      return paramData
    },
    /**
     * メールアドレスの重複チェック
     */
    checkSameMailAddress() {
      const paramData = {
        email: this.accountDetail.mailAddress,
      }

      if (
        this.accountDetail.mailAddress.length === 0 ||
        this.defaultAccountDetail.mailAddress ===
          this.accountDetail.mailAddress ||
        this.$common.checkExistValidation(
          this.formItems,
          'mailAddress',
          this.accountDetail.mailAddress,
          true
        )
      ) {
        this.deleteCustomMailAddressValidation() // メールアドレス重複チェックのバリデーションエラーの削除
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .checkSameMailAddress(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (resData.data.isDuplicated === 1) {
              this.addCustomMailAddressValidation()
            } else {
              this.deleteCustomMailAddressValidation() // メールアドレス重複チェックのバリデーションエラーの削除
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
     * メールアドレス重複チェックのバリデーションエラーの追加
     */
    addCustomMailAddressValidation() {
      const mailAddressValidation = this.formItems.find(
        (data) => data.id === 'mailAddress'
      ).validation

      if (
        mailAddressValidation.findIndex((data) => data.type === 'custom') < 0
      ) {
        mailAddressValidation.push({
          type: 'custom',
          message: this.$common.getMasterMessage('ErrorMsg_Mail04'),
        })
      }
    },
    /**
     * メールアドレス重複チェックのバリデーションエラーの削除
     */
    deleteCustomMailAddressValidation() {
      const mailAddressValidation = this.formItems.find(
        (data) => data.id === 'mailAddress'
      ).validation
      const findIndex = mailAddressValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        mailAddressValidation.splice(findIndex, 1)
      }
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    align-items: center;
    justify-content: center;
    .header-title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 8px;
    }
  }
  .modal_contents {
    .contents_read {
      p {
        text-align: center;
      }
    }
  }
}
.contents {
  .form-block {
    padding: 24px 0 18px 0;
    .form-item {
      margin-bottom: 8px;
      .title {
        margin-bottom: 10px;
      }
      &:not(:last-child) {
        margin-bottom: 30px;
      }
      .name {
        display: flex;
        align-items: center;
        .last-name,
        .first-name {
          width: 100%;
        }
        .first-name {
          margin-left: 16px;
        }
      }
    }
  }
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  button {
    width: 200px;
    padding: 24px;
    font-size: 15px;
    &:not(:last-child) {
      margin-right: 16px;
    }
  }
}
</style>
