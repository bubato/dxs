<template>
  <div
    class="custom-input-single-checkbox-str"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <label>
      <input
        type="checkbox"
        :value="value"
        :name="name"
        :checked="value === '1'"
        class="input-checkbox"
        @change="updateValue"
      />
      <p>
        <span :class="{ 'no-data': label.length === 0 }">{{ label }}</span>
      </p>
    </label>
  </div>
</template>

<script>
export default {
  name: 'CustomInputSingleCheckboxStr',
  props: {
    value: { type: String, required: true, default: '0' },
    name: { type: String, required: true },
    label: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      errorList: [],
    }
  },
  mounted() {},
  methods: {
    updateValue(e) {
      const inputVal = e.target.checked
      const updateVal = inputVal ? '1' : '0'

      this.$emit('input', updateVal)
      this.errorList = this.getValidationList(updateVal)
    },
    getValidationList(inputVal) {
      let validationList = []

      if (this.validation) {
        validationList = this.$common.getValidationMsg(
          this.validation,
          inputVal
        )
      }

      return validationList
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-single-checkbox-str {
  position: relative;
}

label {
  display: block;
  p {
    display: flex;
    align-items: center;
    // height: 18px;
    cursor: pointer;
    span {
      padding-left: 30px;
      &.no-data {
        padding-left: 18px;
      }
    }
  }
}
/**
* デザイン調整
*/
// .input-checkbox {
//   display: none;
//   & + p {
//     cursor: pointer;
//     position: relative;
//     min-height: 21px;
//   }
//   & + p::before {
//     content: '';
//     background: #f7f8f9;
//     border: #d3d3d3 1px solid;
//     border-radius: 4px;
//     display: block;
//     height: 18px;
//     left: 0;
//     position: absolute;
//     width: 18px;
//   }

//   &:checked + p::before {
//     background: #007aff;
//     border: none;
//   }
//   & + p::after {
//     content: '';
//     -webkit-transform: translateY(-50%) rotate(-45deg);
//     border-bottom: 2px solid #fff;
//     border-left: 2px solid #fff;
//     display: block;
//     height: 7px;
//     left: 3px;
//     margin-top: -0.2em;
//     opacity: 0;
//     position: absolute;
//     top: calc(50% + 1px);
//     transform: translateY(-50%) rotate(-45deg);
//     width: 11px;
//   }
//   &:checked + p::after {
//     opacity: 1;
//   }
// }
</style>
