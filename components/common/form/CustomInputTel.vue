<template>
  <div
    class="custom-input-number"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div
      v-if="viewType === 'search'"
      class="custom-input-text-block type-search"
    >
      <input
        type="tel"
        :value="value"
        :placeholder="placeholder"
        :class="{ 'is-focus': isFocus }"
        @input="updateValue"
        @focus="focusInput()"
        @blur="blurInput()"
        @keypress.prevent.enter.exact="enableSubmit"
        @keyup.prevent.enter.exact="submit"
      />
      <div v-show="isFocus" class="icon-close-block">
        <CloseSVG class="icon-close" @mousedown="deleteInputText()" />
      </div>
      <div class="icon-search-block" @click="submitText()">
        <SearchSVG class="icon-search" />
      </div>
    </div>
    <div v-else class="custom-input-text-block">
      <input
        type="tel"
        :value="value"
        :readonly="isDisabled"
        :placeholder="placeholder"
        :class="{ 'is-disabled': isDisabled }"
        :maxlength="maxlength"
        @input="updateValue"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputTel',
  props: {
    value: { type: String, required: true, default: '' },
    maxlength: { type: String, required: false, default: null },
    placeholder: { type: String, required: false, default: '' },
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
  created() {
    if (this.value.length > 0) {
      this.validationCheck(this.value)
    }
  },
  methods: {
    updateValue(e) {
      const inputVal = e.target.value

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
