<template>
  <div
    v-if="Object.keys(contactDetailData).length > 0"
    class="contact-detail-form"
  >
    <div class="form-block">
      <h3>営業担当者情報</h3>
      <div class="form-item">
        <p class="title">登録日</p>
        <p class="context">{{ contactDetailData.registrationDate }}</p>
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="担当者" :required="true" />
        <SuggestTextarea
          :select-ids="checkArray(contactDetailData.salesPersonIdList)"
          placeholder="氏名を入力してください"
          :suggest-type="3"
          class="input-form"
          @input="setSalesPersonIdListData($event)"
        />
      </div>
    </div>
    <div class="form-block">
      <h3>基本設定</h3>
      <div class="form-item">
        <RequiredFormLabel class="title" label="氏名" :required="true" />
        <div class="flex input-form">
          <CustomInputText
            v-model="contactDetailData.lastName"
            placeholder="入力例：佐藤"
            maxlength="30"
            class="short"
            :validation="
              $common.getFormItemsDetail(formItems, 'lastName').validation
            "
          />
          <CustomInputText
            v-model="contactDetailData.firstName"
            placeholder="入力例：太郎"
            maxlength="30"
            class="short input-form"
            :validation="
              $common.getFormItemsDetail(formItems, 'firstName').validation
            "
          />
        </div>
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="フリガナ" :required="true" />
        <div class="flex input-form">
          <CustomInputText
            v-model="contactDetailData.lastNameKana"
            placeholder="入力例：サトウ"
            maxlength="30"
            class="short"
            :validation="
              $common.getFormItemsDetail(formItems, 'lastNameKana').validation
            "
          />
          <CustomInputText
            v-model="contactDetailData.firstNameKana"
            placeholder="入力例：タロウ"
            maxlength="30"
            class="short"
            :validation="
              $common.getFormItemsDetail(formItems, 'firstNameKana').validation
            "
          />
        </div>
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="企業名" :required="true" />
        <CustomInputText
          v-model="contactDetailData.company"
          placeholder="入力例：株式会社田中商事"
          maxlength="200"
          class="input-form"
          :validation="
            $common.getFormItemsDetail(formItems, 'company').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="役職名" :required="false" />
        <CustomInputText
          v-model="contactDetailData.position"
          placeholder="入力例：代表取締役"
          maxlength="100"
          class="middle input-form"
          :validation="
            $common.getFormItemsDetail(formItems, 'position').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="部署名" :required="false" />
        <CustomInputText
          v-model="contactDetailData.department"
          placeholder="入力例：営業部"
          maxlength="100"
          class="middle input-form"
          :validation="
            $common.getFormItemsDetail(formItems, 'department').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="住所" :required="false" />
        <div class="input-location input-form">
          <div class="flex">
            <CustomInputText
              v-model="contactDetailData.postcode"
              placeholder="入力例：1234567（ハイフンは不要です）"
              maxlength="7"
              class="short"
              @input="deleteCustomValidation()"
            />
            <button
              class="btn btn-secondary"
              :class="{
                'btn-disabled': contactDetailData.postcode.length === 0,
              }"
              @click="searchZipCode()"
            >
              住所検索
            </button>
          </div>
          <CustomInputSelect
            v-model="contactDetailData.addressState"
            class="middle"
            :options="$common.getVersatileOptions(17)"
            :validation="
              $common.getFormItemsDetail(formItems, 'addressState').validation
            "
          />
          <CustomInputText
            v-model="contactDetailData.addressCity"
            placeholder="入力例：港区赤坂"
            maxlength="20"
            class="middle"
            :validation="
              $common.getFormItemsDetail(formItems, 'addressCity').validation
            "
          />
          <CustomInputText
            ref="addressLine1"
            v-model="contactDetailData.addressLine1"
            maxlength="255"
            placeholder="入力例：7-1-1（半角で入力してください）"
            class="middle"
            :validation="
              $common.getFormItemsDetail(formItems, 'addressLine1').validation
            "
          />
          <CustomInputText
            v-model="contactDetailData.addressLine2"
            placeholder="入力例：青山安田ビル"
            maxlength="255"
            class="middle"
            :validation="
              $common.getFormItemsDetail(formItems, 'addressLine2').validation
            "
          />
        </div>
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="メール" :required="true" />
        <CustomInputText
          v-model="contactDetailData.mail"
          placeholder="入力例：account@tanaka.co.jp"
          maxlength="254"
          class="middle input-form"
          :validation="$common.getFormItemsDetail(formItems, 'mail').validation"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="電話番号1" :required="false" />
        <CustomInputText
          v-model="contactDetailData.tel1"
          placeholder="入力例：0312345678（ハイフンは不要です）"
          maxlength="11"
          class="middle input-form"
          :validation="$common.getFormItemsDetail(formItems, 'tel1').validation"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="電話番号2" :required="false" />
        <CustomInputText
          v-model="contactDetailData.tel2"
          placeholder="入力例：0312345678（ハイフンは不要です）"
          maxlength="11"
          class="middle input-form"
          :validation="$common.getFormItemsDetail(formItems, 'tel2').validation"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="タグ" :required="false" />
        <SuggestTextarea
          :select-ids="checkArray(contactDetailData.tagIdList)"
          placeholder=""
          :max-ids="10"
          :suggest-type="6"
          class="suggestTextarea"
          @update="updateTagDefinitionIdList($event)"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="メモ" :required="false" />
        <CustomInputTextarea
          v-model="contactDetailData.memo"
          placeholder="メモ欄としてご自由にお使いください"
          maxlength="2000"
          class="input-form"
          :validation="$common.getFormItemsDetail(formItems, 'memo').validation"
        />
      </div>
    </div>
    <div v-if="dataItemDefinitionList.length !== 0" class="form-block">
      <h3>追加情報</h3>
      <div class="form-item">
        <RequiredFormLabel class="title" label="項目名" :required="false" />
        <div
          v-for="(item, index) in contactDetailData.additionalInformationList"
          :key="index"
          class="additionalInformationList flex"
        >
          <CustomInputSelect
            v-model="item.dataItemDefinitionId"
            :options="dataItemDefinitionListSelectData"
            placeholder="選択してください"
            class="additionalInformationList-select"
          />
          <CustomInputText
            v-if="
              checkDataType(item.dataItemDefinitionId) === 1 ||
              checkDataType(item.dataItemDefinitionId) === 2
            "
            v-model="item.data"
            placeholder=""
            maxlength="100"
            class="additionalInformationList-input"
          />
          <CustomDatePicker
            v-if="checkDataType(item.dataItemDefinitionId) === 3"
            v-model="item.data"
            class="date-picker additionalInformationList-datepicker"
          />
          <CancelSVG
            class="btn-close icon-cancel"
            @click="deleteItem(index)"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
        </div>
        <AddItem
          label="項目を追加"
          class="margin-t-16"
          @addItem="appendItemInformationList()"
        />
      </div>
    </div>
    <div class="form-block">
      <h3>メール配信</h3>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="メール配信許諾"
          :required="true"
        />
        <p class="context"></p>
        <CustomInputRadio
          v-model="contactDetailData.deliveryFlag"
          :options="deliveryFlag"
          name="listingClassificationRadio"
          layout-type="vertical"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="配信エラー回数"
          :required="false"
        />
        <p class="context">
          エラー回数が3回以上になると配信対象から除外されます。<br />配信対象に戻す場合は数値を0にして保存してください。
        </p>
        <CustomInputText
          v-model="contactDetailData.bounceMailCount"
          class="input-form"
          placeholder=""
          maxlength="4"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ContactDetailForm',
  props: {
    contactDetail: {
      type: Object,
      default: () => {},
      required: true,
    },
    formItems: {
      type: Array,
      default: () => [],
      required: true,
    },
    type: {
      type: String,
      default: 'edit',
      required: false,
    },
  },
  data() {
    return {
      deliveryFlag: [
        {
          value: '0',
          label: '許可しない',
        },
        {
          value: '1',
          label: '許可する',
        },
      ],
      contactDetailData: {},
    }
  },
  computed: {
    ...mapState('contact/contactList', [
      'dataItemDefinitionList',
      'tagDefinitionList',
    ]),
    dataItemDefinitionListSelectData() {
      return this.dataItemDefinitionList.map((item) => {
        const data = {
          code: item.dataItemDefinitionId.toString(),
          label: item.title,
        }
        return data
      })
    },
  },
  watch: {
    contactDetail() {
      this.contactDetailData = this.contactDetail
    },
  },
  created() {
    this.getDataItemDefinitions() // データ項目定義の取得
    this.contactDetailData = this.contactDetail
  },
  mounted() {},
  methods: {
    ...mapMutations('contact/contactList', ['setDataItemDefinitionList']),
    /**
     * 追加項目の削除
     *
     * @param {number} index index
     */
    deleteItem(index) {
      this.contactDetailData.additionalInformationList.splice(index, 1)
    },
    /**
     * データ形式が配列かチェック、配列出ない場合は配列に変換
     *
     * @param {number[]} 選択したユーザーIDの配列
     */
    checkArray(data) {
      if (Array.isArray(data)) {
        return data
      } else if (data) {
        return data.split(',')
      }
    },
    /**
     * タグ選択リストの更新
     *
     * @param {number[]} 選択したユーザーIDの配列
     */
    updateTagDefinitionIdList(selectIds) {
      this.contactDetailData.tagIdList = selectIds
      this.contactDetailData.newTagList = selectIds.map((item) => {
        return this.tagDefinitionList.find((data) => {
          return item === data.tagDefinitionId
        }).name
      })
    },
    /**
     * 追加情報項目の追加
     */
    appendItemInformationList() {
      this.contactDetailData.additionalInformationList.push({
        dataItemDefinitionId: NaN,
        data: '',
      })
    },
    /**
     * 住所検索処理
     */
    searchZipCode() {
      const zipcode = this.contactDetailData.postcode.replace(/-/g, '')
      const postCodeValidation = this.formItems.find(
        (data) => data.id === 'postcode'
      ).validation

      if (zipcode.length !== 7) {
        postCodeValidation.push({
          type: 'custom',
          message: '7桁の郵便番号を入力してください',
        })
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
          } else {
            // 返却されたデータを挿入する
            this.contactDetailData.addressState = (
              '00' + resData.data.results[0].prefcode
            ).slice(-2)
            this.contactDetailData.addressCity =
              resData.data.results[0].address2 +
              resData.data.results[0].address3
            this.$refs.addressLine1.setInitFlg() // 番地1を強制バリデーションチェック
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * カスタムバリデーションの削除
     */
    deleteCustomValidation() {
      const postCodeValidation = this.formItems.find(
        (data) => data.id === 'postcode'
      ).validation
      const findIndex = postCodeValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        postCodeValidation.splice(findIndex, 1)
      }
    },
    /**
     * データ項目定義の取得
     */
    getDataItemDefinitions() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getDataItemDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setDataItemDefinitionList(resData.data.dataItemDefinitionList)
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
     * データ項目定義データアイテムタイプの取得
     *
     * @param {Number} id 該当項目のdataItemDefinitionId
     */
    checkDataType(id) {
      let result = 0

      if (typeof id === 'string') {
        id = Number(id)
      }

      const data = this.dataItemDefinitionList.find(
        (data) => data.dataItemDefinitionId === id
      )

      if (data !== undefined) {
        result = data.dataItemType
      }

      return result
    },
    /**
     * 営業担当者情報更新
     *
     * @param {Array} salesPersonIdList 営業担当者リスト
     */
    setSalesPersonIdListData(salesPersonIdList) {
      this.contactDetailData.salesPersonIdList = salesPersonIdList
        .split('@@}')
        .map((item) => {
          return Number(item.replace('{@@', ''))
        })
      this.contactDetailData.salesPersonIdList.pop()
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-detail-form {
  .form-block {
    padding: 32px 0;
    border-bottom: 1px solid #e5e5e5;
    .form-item {
      margin-top: 32px;
      .title {
        font-weight: 500;
      }
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
}
.additionalInformationList {
  margin-top: 12px;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
  &-select {
    width: 417px;
  }
  &-input,
  &-datepicker {
    width: calc(100% - 417px);
  }
}
</style>
