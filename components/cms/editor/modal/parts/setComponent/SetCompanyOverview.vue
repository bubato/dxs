<template>
  <div class="set-company-overview">
    <div class="input-company-name">
      <p>会社名</p>
      <CustomInputText
        v-model="component.companyName"
        placeholder="入力例：株式会社田中商事"
        maxlength="50"
        :validation="
          $common.getFormItemsDetail(formItems, 'companyName').validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-comparepresentative-name">
      <p>代表者名</p>
      <CustomInputText
        v-model="component.representativeName"
        placeholder="入力例：佐藤 太郎"
        maxlength="60"
        :validation="
          $common.getFormItemsDetail(formItems, 'representativeName').validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-comparepresentative-number">
      <p>代表電話番号</p>
      <CustomInputText
        v-model="component.representativeNumber"
        placeholder="入力例：0312345678"
        maxlength="11"
        :validation="
          $common.getFormItemsDetail(formItems, 'representativeNumber')
            .validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-comparepresentative-location">
      <p>本社所在地</p>
      <div class="flex">
        <CustomInputText
          v-model="component.headquartersPostalCode"
          class="input-postal-code"
          placeholder="入力例：1234567"
          maxlength="7"
          :validation="
            $common.getFormItemsDetail(formItems, 'headquartersPostalCode')
              .validation
          "
          @input="deleteCustomValidation()"
        />
        <button class="btn btn-utility" @click="searchZipCode()">
          住所検索
        </button>
      </div>
      <CustomInputText
        v-model="component.headquartersLocation1"
        class="input-location"
        placeholder=""
        maxlength="100"
        :validation="
          $common.getFormItemsDetail(formItems, 'headquartersLocation1')
            .validation
        "
        @input="checkValidation()"
      />
      <CustomInputText
        v-model="component.headquartersLocation2"
        class="input-location"
        placeholder="入力例：港区赤坂"
        maxlength="20"
        :validation="
          $common.getFormItemsDetail(formItems, 'headquartersLocation2')
            .validation
        "
        @input="checkValidation()"
      />
      <CustomInputText
        v-model="component.headquartersLocation3"
        class="input-location"
        placeholder="入力例：7-1-1"
        maxlength="255"
        :validation="
          $common.getFormItemsDetail(formItems, 'headquartersLocation3')
            .validation
        "
        @input="checkValidation()"
      />
      <CustomInputText
        v-model="component.headquartersLocation4"
        class="input-location"
        placeholder="入力例：青山安田ビル"
        maxlength="255"
        :validation="
          $common.getFormItemsDetail(formItems, 'headquartersLocation4')
            .validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-founding-date">
      <p>創業日</p>
      <CustomInputText
        v-model="component.foundingDate"
        placeholder="入力例：2021年7月"
        maxlength="20"
        :validation="
          $common.getFormItemsDetail(formItems, 'foundingDate').validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-number-of-employees">
      <p>従業員数</p>
      <CustomInputText
        v-model="component.numberOfEmployees"
        placeholder="入力例：30名"
        maxlength="20"
        :validation="
          $common.getFormItemsDetail(formItems, 'numberOfEmployees').validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-capital">
      <p>資本金</p>
      <CustomInputText
        v-model="component.capital"
        placeholder="入力例：1,000万円"
        maxlength="20"
        :validation="
          $common.getFormItemsDetail(formItems, 'capital').validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="input-officer">
      <p>役員</p>
      <div class="officer">
        <draggable
          :list="component.officer"
          tag="ul"
          class="drag-list"
          group="radio"
        >
          <li v-for="(item, index) in component.officer" :key="index">
            <div class="icon-block">
              <DehazeSVG class="icon-dehaze" />
            </div>
            <input
              v-model="item.position"
              type="text"
              class="position"
              maxlength="10"
            />
            <input
              v-model="item.name"
              type="text"
              class="name"
              maxlength="10"
            />
            <div class="icon-block">
              <CancelSVG
                v-show="index > 0"
                class="icon-cancel"
                @click="deleteOfficer(index)"
                @mouseover="$common.setAreaLabel($event, 'right', '削除')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              />
            </div>
          </li>
        </draggable>
        <AddItem
          label="項目を追加"
          class="margin-t-16"
          @addItem="addOfficer()"
        />
      </div>
    </div>
    <div class="input-business-content">
      <p>事業内容</p>
      <CustomInputTextarea
        v-model="component.businessContent"
        placeholder="事業内容を入力してください"
        maxlength="2000"
        class="textarea"
        :validation="
          $common.getFormItemsDetail(formItems, 'businessContent').validation
        "
        @input="checkValidation()"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'SetCompanyOverview',
  components: {
    draggable,
  },
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      formItems: [
        {
          id: 'companyName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 50,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 50,
              }),
            },
          ],
        },
        {
          id: 'representativeName',
          validation: [
            {
              type: 'maxlength',
              maxlength: 60,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 60,
              }),
            },
          ],
        },
        {
          id: 'representativeNumber',
          validation: [
            {
              type: 'maxlength',
              maxlength: 11,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 11,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'headquartersPostalCode',
          validation: [
            {
              type: 'maxlength',
              maxlength: 7,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 7,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'headquartersLocation1',
          validation: [
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
          ],
        },
        {
          id: 'headquartersLocation2',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'headquartersLocation3',
          validation: [
            {
              type: 'maxlength',
              maxlength: 255,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 255,
              }),
            },
          ],
        },
        {
          id: 'headquartersLocation4',
          validation: [
            {
              type: 'maxlength',
              maxlength: 255,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 255,
              }),
            },
          ],
        },
        {
          id: 'officerPosition',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'officerName',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'foundingDate',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'numberOfEmployees',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'capital',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20,
              }),
            },
          ],
        },
        {
          id: 'businessContent',
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
      ],
    }
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    addOfficer() {
      this.component.officer.push({ position: '', name: '' })
      this.checkValidation()
    },
    deleteOfficer(index) {
      this.component.officer.splice(index, 1)
      this.checkValidation()
    },
    searchZipCode() {
      const zipcode = this.component.headquartersPostalCode.replace(/-/g, '')
      const postCodeValidation = this.formItems.find(
        (data) => data.id === 'headquartersPostalCode'
      ).validation

      if (zipcode.length !== 7) {
        postCodeValidation.push({
          type: 'custom',
          message: '7桁の郵便番号を入力してください',
        })
        this.checkValidation()
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .getAddress(zipcode)
        .then((resData) => {
          // 存在しない郵便番号でapiを叩くと200以外のステータスが返ってくる
          if (resData.data.status !== 200 || resData.data.results === null) {
            postCodeValidation.push({
              type: 'custom',
              message: '該当する郵便番号がありません。',
            })
            this.checkValidation()
          } else {
            // 返却されたデータを挿入する
            this.component.headquartersLocation1 =
              resData.data.results[0].address1
            this.component.headquartersLocation2 =
              resData.data.results[0].address2 +
              resData.data.results[0].address3
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    deleteCustomValidation() {
      const postCodeValidation = this.formItems.find(
        (data) => data.id === 'headquartersPostalCode'
      ).validation
      const findIndex = postCodeValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        postCodeValidation.splice(findIndex, 1)
      }

      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const validationItems = {
        companyName: this.component.companyName,
        representativeName: this.component.representativeName,
        representativeNumber: this.component.representativeNumber,
        headquartersPostalCode: this.component.headquartersPostalCode,
        headquartersLocation1: this.component.headquartersLocation1,
        headquartersLocation2: this.component.headquartersLocation2,
        headquartersLocation3: this.component.headquartersLocation3,
        headquartersLocation4: this.component.headquartersLocation4,
        officerPosition: this.component.officer,
        officerName: this.component.officer,
        foundingDate: this.component.foundingDate,
        numberOfEmployees: this.component.numberOfEmployees,
        capital: this.component.capital,
        businessContent: this.component.businessContent,
      }

      for (const key in validationItems) {
        if (key === 'officerPosition') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const value = validationItems[key][i].position
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        } else if (key === 'officerName') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const value = validationItems[key][i].name
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        } else {
          const value = validationItems[key]
          if (this.$common.checkExistValidation(this.formItems, key, value)) {
            result = true
            break
          }
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
.set-company-overview {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    > p {
      margin-bottom: 10px;
    }
  }
  .input-comparepresentative-location {
    .flex {
      margin-bottom: 10px;
      .input-postal-code {
        width: 140px;
      }
      .btn {
        height: 48px;
        margin-left: 10px;
      }
    }
    .input-location {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
  .input-officer {
    .drag-list {
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f8f9;
        height: 65px;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        ::v-deep input {
          background: #ffffff;
          &.is-disabled {
            background: #cdced0;
            pointer-events: none;
          }
        }
        .icon-block {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          min-width: 40px;
          padding: 0 10px;
          cursor: pointer;
        }
        .position {
          width: 160px;
        }
        .name {
          width: 335px;
          margin-left: 12px;
        }
      }
    }
    .add-item {
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .input-business-content {
    .textarea {
      ::v-deep .custom-input-textarea-block {
        height: 128px;
      }
    }
  }
}
</style>
