<template>
  <div
    class="custom-input-radio"
    :class="[
      layoutType === 'vertical' ? 'vertical-layout' : 'horizon-layout',
      { 'validation-error': errorList.length > 0 },
    ]"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div class="radio_list">
      <label
        v-for="(option, index) in options"
        :key="index"
        :class="{ 'is-disabled': isDisabled }"
      >
        <input
          type="radio"
          :value="option.value"
          :name="name"
          :checked="option.value === value"
          class="input-radio"
          @change="updateValue"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputRadio',
  props: {
    value: { type: String, required: true },
    name: { type: String, required: true },
    options: { type: Array, required: true },
    layoutType: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
    isDisabled: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      errorList: [],
    }
  },
  created() {
    this.validationCheck(this.value)
  },
  methods: {
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('input', inputVal)

      this.validationCheck(inputVal)
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
.custom-input-radio {
  position: relative;
  &.vertical-layout {
    .radio_list {
      flex-direction: column;

      label {
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
  }
  &.horizon-layout {
    .radio_list {
      label {
        &:not(:last-child) {
          margin-right: 24px;
        }
      }
    }
  }

  .radio_list {
    display: flex;
    flex-wrap: wrap;
    label {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      cursor: pointer;
      &.is-disabled {
        pointer-events: none;
        opacity: 0.5;
        span * {
          color: #a5a5a5;
        }
      }
      span {
        padding-left: 28px;
      }
    }
  }
}
/**
* デザイン調整
*/
.input-radio {
  display: none;
  & + span {
    cursor: pointer;
    display: inline-block;
    position: relative;
  }

  & + span::before {
    -webkit-transform: translateY(-50%);
    background: #f7f8f9;
    border: 1px solid #d3d3d3;
    border-radius: 50%;
    content: '';
    display: block;
    height: 18px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
  }

  // & + span::after {
  //   -webkit-transform: translateY(-50%);
  //   background: rgba(0, 0, 0, 0.32);
  //   border: 1px solid transparent;
  //   border-radius: 50%;
  //   content: '';
  //   height: 8px;
  //   left: 4px;
  //   opacity: 0;
  //   padding: 2px;
  //   position: absolute;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   transition: all 0.3s ease 0s;
  //   width: 8px;
  // }
  &:checked + span::before {
    -webkit-transform: translateY(-50%);
    background: #fff;
    border: 5px solid #007aff;
    border-radius: 50%;
    content: '';
    display: block;
    height: 18px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
  }
  // &:checked + span::after {
  //   opacity: 1;
  // }
}
</style>
