<template>
  <div class="edit-area">
    <div class="form-block">
      <div class="form-item">
        <RequiredFormLabel class="title" label="タイトル" :required="true" />
        <CustomInputText
          v-model="partsData.title"
          maxlength="20"
          placeholder="タイトルを入力してください"
          :validation="
            $common.getFormItemsDetail(formItems, 'title').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">注釈</p>
        <CustomInputSelect
          v-model="partsData.parts_attr.annotation_pos"
          :options="ANNOTATION_POSITION_OPTIONS"
          name="annotationList"
          class="width-middle"
        />
      </div>
      <div v-if="partsData.parts_attr.annotation_pos != '0'" class="form-item">
        <CustomInputText
          v-model="partsData.parts_attr.annotation"
          maxlength="100"
          placeholder="注釈を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">必須</p>
        <CustomInputSingleCheckbox
          v-model="partsData.required_flg"
          name="required"
          label="必須項目にする"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>郵便番号属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.postal_code_attr.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'postal_code_attr_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.postal_code_attr.parts_attr.label"
          maxlength="20"
          placeholder="入力例：郵便番号"
          :validation="
            $common.getFormItemsDetail(formItems, 'postal_code_attr_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.postal_code_attr.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.postal_code_attr.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'postal_code_attr_class_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>住所検索ボタン属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.auto_fill_btn_attr.parts_attr.label"
          maxlength="20"
          placeholder="入力例：住所検索"
          :validation="
            $common.getFormItemsDetail(formItems, 'auto_fill_btn_attr_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.auto_fill_btn_attr.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'auto_fill_btn_attr_class_attr'
            ).validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>都道府県属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.prefecture_attr.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'prefecture_attr_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.prefecture_attr.parts_attr.label"
          placeholder="入力例：都道府県"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'prefecture_attr_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.prefecture_attr.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'prefecture_attr_class_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>市区町村属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.city_attr.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'city_attr_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.city_attr.parts_attr.label"
          placeholder="入力例：市区町村"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'city_attr_label').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.city_attr.parts_attr.placeholder"
          maxlength="100"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.city_attr.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'city_attr_class_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>番地属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.street_address_attr.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'street_address_attr_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="ラベル"
          :required="true"
          maxlength="20"
        />
        <CustomInputText
          v-model="partsData.street_address_attr.parts_attr.label"
          placeholder="入力例：番地"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'street_address_attr_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.street_address_attr.parts_attr.placeholder"
          maxlength="100"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.street_address_attr.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'street_address_attr_class_attr'
            ).validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>建物名属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.building_name_attr.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'building_name_attr_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.building_name_attr.parts_attr.label"
          placeholder="入力例：建物・ビル名"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'building_name_attr_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.building_name_attr.parts_attr.placeholder"
          maxlength="100"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.building_name_attr.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'building_name_attr_class_attr'
            ).validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>パーツ属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.parts_id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'parts_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.parts_class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'parts_class_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { ANNOTATION_POSITION_OPTIONS } from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormEditPartsAddress',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      ANNOTATION_POSITION_OPTIONS,
      formItems: [
        {
          id: 'title',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'postal_code_attr_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'postal_code_attr_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'postal_code_attr_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'auto_fill_btn_attr_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'auto_fill_btn_attr_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'prefecture_attr_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'prefecture_attr_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'prefecture_attr_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'city_attr_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'city_attr_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'city_attr_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'street_address_attr_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'street_address_attr_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'street_address_attr_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'building_name_attr_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'building_name_attr_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'building_name_attr_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'parts_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'parts_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    checkValidation() {
      let result = false
      const validationItems = {
        title: this.partsData.title,
        postal_code_attr_id_attr: this.partsData.postal_code_attr.id_attr,
        postal_code_attr_label: this.partsData.postal_code_attr.parts_attr
          .label,
        postal_code_attr_class_attr: this.partsData.postal_code_attr.class_attr,
        auto_fill_btn_attr_label: this.partsData.auto_fill_btn_attr.parts_attr
          .label,
        auto_fill_btn_attr_class_attr: this.partsData.auto_fill_btn_attr
          .class_attr,
        prefecture_attr_id_attr: this.partsData.prefecture_attr.id_attr,
        prefecture_attr_label: this.partsData.prefecture_attr.parts_attr.label,
        prefecture_attr_class_attr: this.partsData.prefecture_attr.class_attr,
        city_attr_id_attr: this.partsData.city_attr.id_attr,
        city_attr_label: this.partsData.city_attr.parts_attr.label,
        city_attr_class_attr: this.partsData.city_attr.class_attr,
        street_address_attr_id_attr: this.partsData.street_address_attr.id_attr,
        street_address_attr_label: this.partsData.street_address_attr.parts_attr
          .label,
        street_address_attr_class_attr: this.partsData.street_address_attr
          .class_attr,
        building_name_attr_id_attr: this.partsData.building_name_attr.id_attr,
        building_name_attr_label: this.partsData.building_name_attr.parts_attr
          .label,
        building_name_attr_class_attr: this.partsData.building_name_attr
          .class_attr,
        parts_id_attr: this.partsData.parts_id_attr,
        parts_class_attr: this.partsData.parts_class_attr,
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

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/form/edit/formEditPartsDetailModal.scss';
</style>
