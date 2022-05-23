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
      <h5>テキストフィールド属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.id_attr"
          placeholder=""
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">凡例</p>
        <CustomInputText
          v-model="partsData.parts_attr.placeholder"
          maxlength="100"
          placeholder="凡例を入力してください"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="横サイズ" :required="true" />
        <div class="flex">
          <CustomInputNumber
            v-model="partsData.parts_attr.width"
            maxlength="3"
            class="width-middle"
            placeholder="入力例：100"
            :validation="
              $common.getFormItemsDetail(formItems, 'width').validation
            "
            @input="checkValidation()"
          />
          <CustomInputSelect
            v-model="partsData.parts_attr.width_unit"
            class="width-short margin-l-16"
            :options="HORIZONTAL_SIZE_OPTIONS"
          />
        </div>
      </div>
      <div class="form-item">
        <p class="title">文字数制限</p>
        <CustomInputNumber
          v-model="partsData.parts_attr.char_limit"
          maxlength="3"
          class="width-middle"
          placeholder="入力例：10"
        />
      </div>
      <div class="form-item">
        <p class="title">文字制約</p>
        <CustomInputSelect
          v-model="partsData.parts_attr.char_const"
          :options="CHARACTER_CONSTRAINT_OPTIONS"
          class="width-middle"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'class_attr').validation
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
  ANNOTATION_POSITION,
  ANNOTATION_POSITION_OPTIONS,
  CHARACTER_CONSTRAINT_OPTIONS,
  HORIZONTAL_SIZE_OPTIONS,
  TEXT_FIELD_FIELD,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormEditPartsTextField',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      ANNOTATION_POSITION,
      ANNOTATION_POSITION_OPTIONS,
      CHARACTER_CONSTRAINT_OPTIONS,
      HORIZONTAL_SIZE_OPTIONS,
      TEXT_FIELD_FIELD,
      characterConstraintsOptions: [
        {
          code: '0',
          label: 'なし',
        },
        {
          code: '1',
          label: '半角数字',
        },
        {
          code: '2',
          label: '半角英字',
        },
        {
          code: '3',
          label: '半角英数字',
        },
        {
          code: '4',
          label: '全角かな',
        },
        {
          code: '5',
          label: '全角カナ',
        },
        {
          code: '5',
          label: '全角カナ',
        },
        {
          code: '6',
          label: 'メールアドレス',
        },
        {
          code: '7',
          label: '電話番号',
        },
        {
          code: '8',
          label: 'URL',
        },
      ],
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
          id: 'id_attr',
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
          id: 'width',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'class_attr',
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
        id_attr: this.partsData.id_attr,
        width: this.partsData.parts_attr.width,
        class_attr: this.partsData.class_attr,
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
