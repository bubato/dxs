<template>
  <div
    class="custom-input-text"
    :class="{ 'validation-error': getErrorList().length > 0 && !isDisabled }"
  >
    <ValidationMessage
      v-if="getErrorList().length > 0 && !isDisabled"
      :error-list="getErrorList()"
    />
    <div
      v-if="viewType === 'search'"
      class="custom-input-text-block type-search"
    >
      <input
        type="text"
        :value="value"
        :placeholder="placeholder"
        :class="{ 'is-focus': isFocus }"
        :maxlength="maxlength"
        @input="updateValue"
        @focus="focusInput()"
        @blur="blurInput(1)"
        @keypress.prevent.enter.exact="enableSubmit"
        @keyup.prevent.enter.exact="submit"
      />
      <div v-show="isFocus" class="icon-close-block">
        <CloseSVG class="icon-close" @mousedown="deleteInputText()" />
      </div>
      <div class="icon-search-block" @click="submitText()">
        <SearchSVG
          class="icon-search"
          @mouseover="$common.setAreaLabel($event, 'top', '検索')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
        />
      </div>
    </div>
    <div v-else class="custom-input-text-block">
      <input
        type="text"
        :value="value"
        :readonly="isDisabled"
        :placeholder="placeholder"
        :class="{ 'is-disabled': isDisabled }"
        :maxlength="maxlength"
        @input="updateValue"
        @change="updateChangeValue"
        @blur="blurInput(0)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputText',
  props: {
    value: { type: null, required: true, default: '' },
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
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
    viewType: { type: String, required: false, default: '' },
    isDisabled: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      initFlg: false,
      errorList: [],
      isFocus: false,
      canSubmit: false,
    }
  },
  computed: {
    getErrorList() {
      return () => {
        let validationList = []

        if (!this.initFlg) {
          return []
        }

        if (this.validation) {
          validationList = this.$common.getValidationMsg(
            this.validation,
            this.value
          )
        }

        return validationList
      }
    },
  },
  created() {},
  methods: {
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('input', inputVal)

      this.setInitFlg()
    },
    updateChangeValue(e) {
      const inputVal = e.target.value

      this.$emit('change', inputVal)

      this.setInitFlg()
    },
    setInitFlg() {
      this.initFlg = true
    },
    focusInput() {
      this.isFocus = true
    },
    blurInput(type) {
      if (type === 1) {
        this.isFocus = false
      }
      this.$emit('blur')
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
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-text {
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
  }
}
</style>
