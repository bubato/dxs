<template>
  <div
    class="custom-input-number"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div class="custom-input-text-block">
      <input
        v-model.number="num"
        type="number"
        :readonly="isDisabled"
        :placeholder="placeholder"
        :class="{ 'is-disabled': isDisabled }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputNumber',
  props: {
    value: {
      required: true,
      default: null,
      validator: (prop) =>
        typeof prop === 'number' || prop === '' || prop === null,
    },
    placeholder: { type: String, required: false, default: '' },
    maxlength: {
      required: false,
      default: '',
      validator: (prop) => {
        if (prop === '' || prop === null) {
          return true
        }
        return /[1-9]\d*/.test(prop)
      },
    },
    validation: { type: Array, required: false, default: () => [] },
    viewType: { type: String, required: false, default: '' },
    isDisabled: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      errorList: [],
      isFocus: false,
      canSubmit: false,
    }
  },
  computed: {
    num: {
      get() {
        return this.value
      },
      set(val) {
        this.updateValue(val)
      },
    },
  },
  created() {
    if (this.value) {
      this.validationCheck(this.value)
    }
  },
  methods: {
    updateValue(value) {
      let inputVal = value

      if (Number(this.maxlength) > 1) {
        inputVal = this.checkNumberValue(inputVal)
      }

      this.$emit('input', inputVal)

      this.validationCheck(inputVal)
    },
    focusInput() {
      this.isFocus = true
    },
    blurInput() {
      this.isFocus = false
    },
    /**
     * サブミット判定処理
     */
    submit() {
      if (!this.canSubmit) return

      this.canSubmit = false
      this.submitText()
    },
    /**
     * サブミット処理
     */
    submitText() {
      this.$emit('submit', this.value)
    },
    /**
     * サブミット許容処理
     */
    enableSubmit() {
      this.canSubmit = true
    },
    deleteInputText() {
      this.$emit('input', '')

      this.validationCheck('')
    },
    /**
     * 数値のフォーマットチェック
     */
    checkNumberValue(inputVal) {
      const maxlength = Number(this.maxlength)

      inputVal = parseInt(inputVal)
      if (isNaN(inputVal)) {
        inputVal = ''
      }
      if (String(inputVal).length > maxlength) {
        inputVal = Number(String(inputVal).slice(0, maxlength))
      }

      return inputVal
    },
    validationCheck(inputVal) {
      if (this.validation) {
        this.errorList = this.$common.getValidationMsg(
          this.validation,
          inputVal
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-number {
  position: relative;
  .custom-input-text-block {
    position: relative;
    &.type-search {
      input {
        padding-right: 60px;
        &.is-focus {
          padding-right: 80px;
        }
      }
      .icon-search-block,
      .icon-close-block {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .icon-search-block {
        width: 48px;
        height: 46px;
        right: 0;
        border-left: 1px solid #e5e5e5;
      }
      .icon-close-block {
        position: absolute;
        width: 32px;
        right: 48px;
      }
    }
    input {
      &.is-disabled {
        background: #cdced0;
      }
    }
  }
}
</style>
