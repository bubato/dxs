<template>
  <div class="profile-form-component">
    <div
      v-for="(formDetail, index) in filterFormDetailList()"
      :key="index"
      class="form-detail"
    >
      <RequiredFormLabel
        class="form-detail-title"
        :label="formDetail.name"
        :required="formDetail.required"
      />
      <div
        class="form-contents flex"
        :class="{ 'two-items': formDetail.form.length === 2 }"
      >
        <template v-for="form in formDetail.form">
          <template v-if="form.formType === 'inputText'">
            <CustomInputText
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input text"
              :placeholder="form.placeholder"
              :maxlength="form.maxLength"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'textarea'">
            <CustomInputTextarea
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input textarea"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'select'">
            <CustomInputSelect
              :key="form.id"
              v-model="editProfileData[form.id]"
              :placeholder="form.placeholder"
              :options="form.options"
              class="custom-input select"
              :class="form.class"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'radio'">
            <CustomInputRadio
              :key="form.id"
              v-model="editProfileData[form.id]"
              :name="form.id + '_' + formIndex"
              layout-type="vertical"
              :options="form.options"
              class="custom-input radio"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'check'">
            <CustomInputSingleCheckbox
              :key="form.id"
              v-model="editProfileData[form.id]"
              :name="form.id"
              :label="form.label"
              class="custom-input check"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'singleCheckbox'">
            <CustomInputSingleCheckbox
              :key="form.id"
              v-model="editProfileData[form.id]"
              :placeholder="form.placeholder"
              :name="form.id"
              :label="form.label"
              :options="form.options"
              :class="form.class"
              @input="singleCheckboxSelectValueSetting(form.id, $event)"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileFormComponent',
  props: {
    formDetailList: {
      type: Array,
      default: () => [],
      required: true,
    },
    formIndex: {
      type: Number,
      default: () => null,
      required: true,
    },
    editProfileData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    filterFormDetailList() {
      return () => {
        const newFormDetailList = this.formDetailList.filter((formData) => {
          let showResult = true

          if (formData.name === '退職月') {
            if (this.editProfileData.employmentStatus === '1') {
              showResult = false
            }
          }

          if (formData.name === '有効期限年月') {
            if (this.editProfileData.checkExpiration) {
              showResult = false
            }
          }

          return showResult
        })

        return newFormDetailList
      }
    },
  },
  created() {},
  methods: {
    /**
     * singleCheckbox選択値に応じた入力項目の変更がある場合、入力値の初期化
     * @param String id key
     * @param String data radioボタン入力値
     */
    singleCheckboxSelectValueSetting(id, data) {
      // 代表プロフィール > 有効期限
      if (id === 'checkExpiration' && !data) {
        this.editProfileData.expirationYear = ''
        this.editProfileData.expirationMonth = ''
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/scss/sp/mediaQuery.scss';
.form-detail {
  &:not(:last-child) {
    margin-bottom: 32px;
  }
  &-title {
    margin-bottom: 12px;
  }
  .form-contents {
    .custom-input {
      &.text,
      &.select,
      &.textarea {
        width: 100%;
      }
      &.textarea {
        ::v-deep .custom-input-textarea-block {
          height: 128px;
        }
      }
    }
    &.two-items {
      .custom-input {
        &.text {
          width: 50%;
          &:not(:last-child) {
            margin-right: 8px;
          }
        }
        &.select {
          &:nth-of-type(1) {
            width: 167px;
            margin: 0 8px 0 0;
          }
          &:nth-of-type(2) {
            width: 106px;
            margin: 0 0 0 8px;
          }
        }
      }
    }
  }
}
// MQ
@include mq(sp) {
  .form-detail .form-contents.two-items .custom-input.text:not(:last-child) {
    margin-right: 16px;
  }
}
// MQ
</style>
