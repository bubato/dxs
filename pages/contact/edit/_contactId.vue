<template>
  <div class="edit-contact">
    <div class="main-contents">
      <ToBackScreenLink
        label="コンタクト一覧へ戻る"
        @click="toBackContactListScreen()"
      />
      <div class="header">
        <h2 class="header-title">コンタクト情報編集</h2>
      </div>
      <div class="contents">
        <ContactDetailForm
          ref="contactDetailForm"
          :contact-detail="contactDetail"
          :form-items="formItems"
          :type="'edit'"
        />
      </div>
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultContactDetail,
              contactDetail
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateContactDetail()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
    />
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      defaultContactDetail: {},
      contactDetail: {},
      afterFunc: '',
      formItems: [
        {
          id: 'registMethod',
          validation: [],
        },
        {
          id: 'salesPersonIdList',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
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
          id: 'company',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'position',
          validation: [],
        },
        {
          id: 'department',
          validation: [],
        },
        {
          id: 'postcode',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'addressState',
          validation: [],
        },
        {
          id: 'addressCity',
          validation: [],
        },
        {
          id: 'addressLine1',
          validation: [],
        },
        {
          id: 'addressLine2',
          validation: [],
        },
        {
          id: 'mail',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mail,
              message: this.$common.getMasterMessage('ErrorMsg_Mail01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
        {
          id: 'tel1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'tel2',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'newTagList',
          validation: [],
        },
        {
          id: 'memo',
          validation: [],
        },
        {
          id: 'addInfoItem',
          validation: [],
        },
        {
          id: 'mailErrbounceMailCountorNum',
          validation: [],
        },
        {
          id: 'deliveryFlag',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
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

        if (Object.keys(this.contactDetail).length === 0) {
          return
        }

        const validationItems = {
          lastName: this.contactDetail.lastName,
          firstName: this.contactDetail.firstName,
          lastNameKana: this.contactDetail.lastNameKana,
          firstNameKana: this.contactDetail.firstNameKana,
          company: this.contactDetail.company,
          mail: this.contactDetail.mail,
          deliveryFlag: this.contactDetail.deliveryFlag,
        }

        for (const key in validationItems) {
          const value = validationItems[key]

          if (this.$common.checkExistValidation(this.formItems, key, value)) {
            result = true
            break
          }
        }

        // 営業担当者が未選択の場合
        if (this.$refs.contactDetailForm) {
          if (this.contactDetail.salesPersonIdList.length === 0) {
            result = true
          }
        }

        return result
      }
    },
  },
  created() {
    this.getDefinitions() // コンタクト定義情報取得の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    ...mapMutations('contact/contactList', ['setTagDefinitionList']),
    /**
     * コンタクト定義情報取得の取得
     */
    getDefinitions() {
      const paramData = {}
      this.$common.addCallApiNum()
      this.$api
        .getDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setTagDefinitionList(resData.data.tagDefinitionList)
            this.getContactDetail() // コンタクト詳細情報取得
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
     * コンタクト詳細情報取得
     */
    getContactDetail() {
      const paramData = {
        contactId: Number(this.$route.params.contactId),
      }

      this.$common.addCallApiNum()
      this.$api
        .getContactDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.contactDetail = resData.data.contactInformation
            this.contactDetail.additionalInformationList = this.contactDetail.additionalInformationList.map(
              (item) => {
                item.dataItemDefinitionId = item.dataItemDefinitionId.toString()
                return item
              }
            )
            this.contactDetail.deliveryFlag = this.contactDetail.deliveryFlag.toString()

            this.defaultContactDetail = JSON.parse(
              JSON.stringify(this.contactDetail)
            )
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
            this.$router.push('/contact/list/')
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * コンタクト詳細情報更新
     */
    updateContactDetail() {
      const paramData = this.contactDetail
      paramData.contactId = Number(this.$route.params.contactId)

      this.$common.addCallApiNum()
      this.$api
        .updateContactDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
            this.getContactDetail()
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
     * コンタクト一覧画面に戻る
     */
    toBackContactListScreen() {
      const sameInputDataFlg = this.$common.checkSameObject(
        this.defaultContactDetail,
        this.contactDetail
      )

      if (sameInputDataFlg) {
        this.$router.push('/contact/list/')
      } else {
        this.afterFunc = 'back'
        this.showCancelEditModal()
      }
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      if (this.afterFunc === 'back') {
        this.$router.push('/contact/list/')
      } else {
        this.contactDetail = JSON.parse(
          JSON.stringify(this.defaultContactDetail)
        )
      }

      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
  },
  head() {
    return {
      title:
        Object.keys(this.contactDetail).length > 0
          ? this.contactDetail.lastName + ' ' + this.contactDetail.firstName
          : '' + 'さんのコンタクト情報｜コンタクト',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-bottom: 32px;
    border-bottom: 1px solid #e5e5e5;
  }
  .contents {
    .form-block {
      padding: 32px 0;
      border-bottom: 1px solid #e5e5e5;
      .form-item {
        margin-top: 32px;
        .input-location {
          > * {
            &:not(:last-child) {
              margin-bottom: 16px;
            }
          }
          .btn {
            width: 109px;
            height: 48px;
          }
        }
        .flex {
          > * {
            &:not(:last-child) {
              margin-right: 16px;
            }
          }
        }
        .context {
          margin-top: 8px;
        }
        .input-form {
          margin-top: 12px;
        }
        .middle {
          width: 504px;
        }
        .short {
          width: 243px;
        }
        ::v-deep .custom-input-textarea-block {
          height: 128px;
        }
      }
    }
    .middle {
      width: 504px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    button {
      &:not(:last-child) {
        fill: #3a435c;
        margin-right: 16px;
      }
    }
  }
}
</style>
