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
      <h5>生年月日属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性(年)" :required="true" />
        <CustomInputText
          v-model="partsData.year.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'year_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性(月)" :required="true" />
        <CustomInputText
          v-model="partsData.month.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'month_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性(日)" :required="true" />
        <CustomInputText
          v-model="partsData.day.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'day_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="年設定" :required="true" />
        <p class="sub-text">今日を起点に:</p>
        <div class="flex">
          <CustomInputText
            v-model="partsData.year.parts_attr.year_from"
            class="width-short"
            maxlength="3"
            :validation="
              $common.getFormItemsDetail(formItems, 'year_from').validation
            "
            @input="checkValidation()"
          /><span class="margin-l-16">歳～</span>
          <CustomInputText
            v-model="partsData.year.parts_attr.year_to"
            class="width-short margin-l-16"
            maxlength="3"
            :validation="
              $common.getFormItemsDetail(formItems, 'year_to').validation
            "
            @input="checkValidation()"
          /><span class="margin-l-16">歳までの年表示</span>
        </div>
        <div class="flex margin-t-12">
          <span>初期選択年齢</span>
          <CustomInputText
            v-model="partsData.year.parts_attr.year_default"
            class="width-short margin-l-16"
            maxlength="3"
            :validation="
              $common.getFormItemsDetail(formItems, 'year_default').validation
            "
            @input="checkValidation()"
          /><span class="margin-l-16">歳</span>
        </div>
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.year.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'year_class_attr').validation
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
  name: 'FormEditPartsBirthday',
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
          id: 'year_id_attr',
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
          id: 'month_id_attr',
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
          id: 'day_id_attr',
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
          id: 'year_from',
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
          id: 'year_to',
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
          id: 'year_default',
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
          id: 'year_class_attr',
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
        year_id_attr: this.partsData.year.id_attr,
        month_id_attr: this.partsData.month.id_attr,
        day_id_attr: this.partsData.day.id_attr,
        year_from: this.partsData.year.parts_attr.year_from,
        year_to: this.partsData.year.parts_attr.year_to,
        year_default: this.partsData.year.parts_attr.year_default,
        year_class_attr: this.partsData.year.class_attr,
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
