<template>
  <div class="import-contact">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">新規コンタクト登録</h2>
        <p class="header-sub">新しい担当者情報を登録します。</p>
      </div>
      <div class="contents">
        <div class="form-block">
          <div class="form-item">
            <h4 class="flex">
              登録方法<TooltipHelp
                label="複数件を一括登録する場合はcsvインポートがおすすめです"
                class="tooltip"
              />
            </h4>
            <CustomInputRadio
              v-model="registMethod"
              class="form-item"
              name="registMethod"
              layout-type="vertical"
              :options="registMethodOptions"
              :validation="
                $common.getFormItemsDetail(formItems, 'registMethod').validation
              "
              @input="linkCsvImportPage()"
            />
          </div>
        </div>
        <ContactDetailForm
          ref="contactDetailForm"
          :contact-detail="contactDetail"
          :form-items="formItems"
          :type="'create'"
        />
      </div>
      <div class="buttons">
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="createContactDetail()"
        >
          新規コンタクトを登録
        </button>
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      contactDetail: {
        registrationDate: this.$common.getFormatCurrentDate('YYYY/MM/DD'),
        salesPersonIdList: [],
        company: '',
        postcode: '',
        addressState: '',
        addressCity: '',
        addressLine1: '',
        addressLine2: '',
        position: '',
        department: '',
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        mail: '',
        tel1: '',
        tel2: '',
        tagIdList: [],
        newTagList: [],
        memo: '',
        additionalInformationList: [],
        deliveryFlag: '1',
      },
      registMethod: '1',
      registMethodOptions: [
        {
          value: '1',
          label: '手動入力',
        },
        {
          value: '2',
          label: 'CSVインポート',
        },
      ],
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
      ],
    }
  },
  computed: {
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
  created() {},
  mounted() {},
  methods: {
    /**
     * コンタクト新規登録CSVインポートページへ遷移
     */
    linkCsvImportPage() {
      if (this.registMethod === '2') {
        this.$router.push('/contact/create/import/')
      }
    },
    /**
     * コンタクト詳細情報新規作成
     */
    createContactDetail() {
      const paramData = this.getCreateContactDetailParamData()

      this.$common.addCallApiNum()
      this.$api
        .createContactDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
            this.$router.push('/contact/list/')
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
     * コンタクト詳細情報新規作成 リスエストパラメータの作成
     *
     * @returns {Object} コンタクト詳細情報新規作成 リスエストパラメータ
     */
    getCreateContactDetailParamData() {
      const param = JSON.parse(JSON.stringify(this.contactDetail))

      if (param.additionalInformationList) {
        param.additionalInformationList = param.additionalInformationList.map(
          (item) => {
            item.dataItemDefinitionId = Number(item.dataItemDefinitionId)
            return item
          }
        )
      }

      param.deliveryFlag = Number(param.deliveryFlag)
      return param
    },
  },
  head() {
    return {
      title: '新規コンタクト情報登録｜コンタクト',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    padding-bottom: 32px;
    border-bottom: 1px solid #e5e5e5;
    &-sub {
      margin-top: 8px;
    }
  }
  .contents {
    .form-block {
      padding: 32px 0;
      .form-item {
        margin-top: 32px;
        .input-form {
          margin-top: 12px;
        }
      }
    }
    ::v-deep .contact-detail-form {
      border-top: 1px solid #e5e5e5;
    }
    .download-link {
      display: flex;
      align-items: center;
      margin-top: 12px;
      .icon-download {
        width: 18px;
        height: 18px;
        fill: #007aff;
      }
      span {
        margin-left: 10px;
        color: #007aff;
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
        fill: #3a435c;
        margin-right: 16px;
      }
    }
  }
}
h5 {
  margin-bottom: 24px;
}
.read-csv-num {
  margin-bottom: 48px;
  padding: 20px;
  background: #f0fff4;
}
.edit-csv-form-table {
  table {
    width: auto;
  }
}
.csv-import-form {
  padding: 12px 0 48px 0;
  border-bottom: 1px solid #e5e5e5;
  ::v-deep .file-upload {
    margin-top: 12px;
  }
  .itemName {
    width: 153px;
    min-width: 153px;
  }
  .linkDestination {
    width: 568px;
    min-width: 568px;
    .select {
      width: 240px;
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
  .ignoreSpace {
    width: 217px;
    min-width: 217px;
  }
}
.icon-checkCircle {
  width: 20px;
  height: 20px;
  fill: #34c759;
  margin-right: 10px;
}
</style>
