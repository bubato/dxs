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
      <div class="form-item">
        <p class="title">入力方式</p>
        <CustomInputRadio
          v-model="partsData.parts_attr.input_method"
          :options="NAME_INPUT_METHOD_OPTIONS"
          name="inputMethod"
          layout-type="vertical"
        />
        <CustomInputSingleCheckboxStr
          v-model="partsData.parts_attr.input_kana_flg"
          label="カナを入力する"
          name="inputMethodCheck"
          class="margin-t-24"
        />
      </div>
    </div>
    <div
      v-if="partsData.parts_attr.input_method === NAME_INPUT_METHOD.SPLIT_NAME"
      class="form-block"
    >
      <h5>お名前(姓)属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.name_last_name.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_last_name_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.name_last_name.parts_attr.label"
          maxlength="20"
          placeholder="入力例：氏"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_last_name_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.name_last_name.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.name_last_name.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_last_name_class_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div
      v-if="partsData.parts_attr.input_method === NAME_INPUT_METHOD.SPLIT_NAME"
      class="form-block"
    >
      <h5>お名前(名)属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.name_first_name.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_first_name_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.name_first_name.parts_attr.label"
          maxlength="20"
          placeholder="入力例：名"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_first_name_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.name_first_name.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.name_first_name.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_first_name_class_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div
      v-if="
        partsData.parts_attr.input_method === NAME_INPUT_METHOD.SPLIT_NAME &&
        partsData.parts_attr.input_kana_flg === '1'
      "
      class="form-block"
    >
      <h5>お名前(姓かな)属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.name_last_name_kana.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_last_name_kana_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.name_last_name_kana.parts_attr.label"
          maxlength="20"
          placeholder="入力例：氏（ふりがな）"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_last_name_kana_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.name_last_name_kana.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">文字制約</p>
        <CustomInputSelect
          v-model="partsData.name_last_name_kana.parts_attr.char_const"
          :options="NAME_CHAR_CONST_OPTIONS"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.name_last_name_kana.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'name_last_name_kana_class_attr'
            ).validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div
      v-if="
        partsData.parts_attr.input_method === NAME_INPUT_METHOD.SPLIT_NAME &&
        partsData.parts_attr.input_kana_flg === '1'
      "
      class="form-block"
    >
      <h5>お名前(名かな)属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.name_first_name_kana.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'name_first_name_kana_id_attr'
            ).validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.name_first_name_kana.parts_attr.label"
          maxlength="20"
          placeholder="入力例：名（ふりがな）"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_first_name_kana_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.name_first_name_kana.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">文字制約</p>
        <CustomInputSelect
          v-model="partsData.name_first_name_kana.parts_attr.char_const"
          :options="NAME_CHAR_CONST_OPTIONS"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.name_first_name_kana.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'name_first_name_kana_class_attr'
            ).validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div
      v-if="
        partsData.parts_attr.input_method === NAME_INPUT_METHOD.COMBINE_NAME
      "
      class="form-block"
    >
      <h5>お名前（姓名）属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.name_full_name.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_full_name_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.name_full_name.parts_attr.label"
          maxlength="20"
          placeholder="入力例：氏名"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_full_name_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.name_full_name.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.name_full_name.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_full_name_class_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div
      v-if="
        partsData.parts_attr.input_method === NAME_INPUT_METHOD.COMBINE_NAME &&
        partsData.parts_attr.input_kana_flg === '1'
      "
      class="form-block"
    >
      <h5>お名前（姓名かな）属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.name_full_name_kana.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_full_name_kana_id_attr')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="ラベル" :required="true" />
        <CustomInputText
          v-model="partsData.name_full_name_kana.parts_attr.label"
          maxlength="20"
          placeholder="入力例：氏名（ふりがな）"
          :validation="
            $common.getFormItemsDetail(formItems, 'name_full_name_kana_label')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.name_full_name_kana.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">文字制約</p>
        <CustomInputSelect
          v-model="partsData.name_full_name_kana.parts_attr.char_const"
          :options="NAME_CHAR_CONST_OPTIONS"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.name_full_name_kana.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(
              formItems,
              'name_full_name_kana_class_attr'
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
import {
  ANNOTATION_POSITION_OPTIONS,
  NAME_INPUT_METHOD,
  NAME_INPUT_METHOD_OPTIONS,
  NAME_CHAR_CONST_OPTIONS,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormEditPartsName',
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
      NAME_INPUT_METHOD,
      NAME_INPUT_METHOD_OPTIONS,
      NAME_CHAR_CONST_OPTIONS,
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
          id: 'name_last_name_id_attr',
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
          id: 'name_last_name_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'name_last_name_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'name_first_name_id_attr',
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
          id: 'name_first_name_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'name_first_name_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'name_last_name_kana_id_attr',
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
          id: 'name_last_name_kana_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'name_last_name_kana_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'name_first_name_kana_id_attr',
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
          id: 'name_first_name_kana_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'name_first_name_kana_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'name_full_name_id_attr',
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
          id: 'name_full_name_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'name_full_name_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'name_full_name_kana_id_attr',
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
          id: 'name_full_name_kana_label',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'name_full_name_kana_class_attr',
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
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const validationItems = {
        title: this.partsData.title,
        name_last_name_id_attr: this.partsData.name_last_name.id_attr,
        name_last_name_label: this.partsData.name_last_name.parts_attr.label,
        name_last_name_class_attr: this.partsData.name_last_name.class_attr,
        name_first_name_id_attr: this.partsData.name_first_name.id_attr,
        name_first_name_label: this.partsData.name_first_name.parts_attr.label,
        name_first_name_class_attr: this.partsData.name_first_name.class_attr,
        name_last_name_kana_id_attr: this.partsData.name_last_name_kana.id_attr,
        name_last_name_kana_label: this.partsData.name_last_name_kana.parts_attr
          .label,
        name_last_name_kana_class_attr: this.partsData.name_last_name_kana
          .class_attr,
        name_first_name_kana_id_attr: this.partsData.name_first_name_kana
          .id_attr,
        name_first_name_kana_label: this.partsData.name_first_name_kana
          .parts_attr.label,
        name_first_name_kana_class_attr: this.partsData.name_first_name_kana
          .class_attr,
        name_full_name_id_attr: this.partsData.name_full_name.id_attr,
        name_full_name_label: this.partsData.name_full_name.parts_attr.label,
        name_full_name_class_attr: this.partsData.name_full_name.class_attr,
        name_full_name_kana_id_attr: this.partsData.name_full_name_kana.id_attr,
        name_full_name_kana_label: this.partsData.name_full_name_kana.parts_attr
          .label,
        name_full_name_kana_class_attr: this.partsData.name_full_name_kana
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
