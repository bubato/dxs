<template>
  <div
    class="custom-input-password"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div class="custom-input-password-block">
      <input
        :type="inputType"
        :value="value"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="updateValue"
      />
      <VisibilitySVG
        v-if="inputType === 'text'"
        class="icon icon-visibility"
        @click="changeInputType('password')"
      />
      <VisibilityOffSVG
        v-if="inputType === 'password'"
        class="icon icon-visibilityOff"
        @click="changeInputType('text')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputPassword',
  props: {
    value: { type: String, required: true, default: '' },
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
    autocomplete: { type: String, required: false, default: 'on' },
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
  },
  data() {
    return {
      errorList: [],
      isFocus: false,
      canSubmit: false,
      inputType: 'password',
    }
  },
  created() {
    if (this.value.length > 0) {
      this.validationCheck()
    }
  },
  methods: {
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('input', inputVal)

      this.validationCheck(inputVal)
    },
    changeInputType(type) {
      this.inputType = type
    },
    validationCheck(inputVal = this.value) {
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
.custom-input-password {
  position: relative;
  .custom-input-password-block {
    position: relative;
    input {
      width: 100%;
      padding-right: 60px;
      &.is-disabled {
        background: #cdced0;
      }
    }
    .icon {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      right: 17px;
      fill: #b0b3be;
      cursor: pointer;
    }
  }
}
</style>
