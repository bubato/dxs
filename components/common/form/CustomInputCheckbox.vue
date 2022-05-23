<template>
  <div
    class="custom-input-checkbox"
    :class="[
      layoutType === 'vertical' ? 'vertical-layout' : 'horizon-layout',
      { 'validation-error': getErrorList().length > 0 },
    ]"
  >
    <ValidationMessage
      v-if="getErrorList().length > 0"
      :error-list="getErrorList()"
    />
    <div class="checkbox_list">
      <label
        v-for="(option, index) in options"
        :key="index"
        :class="{ 'is-disabled': option.disabled }"
      >
        <input
          type="checkbox"
          :value="option.value"
          :name="name"
          :checked="value.includes(option.value)"
          class="input-checkbox"
          @change="updateValue"
        />
        <p>
          <component
            :is="option.icon"
            v-if="option.icon"
            class="icon"
            :class="option.iconClass"
          />{{ option.label }}
        </p>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputCheckbox',
  props: {
    value: { type: Array, required: true, default: () => [] },
    name: { type: String, required: true },
    options: { type: Array, required: true },
    layoutType: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      errorList: [],
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
  mounted() {},
  methods: {
    updateValue(e) {
      this.newValue = JSON.parse(JSON.stringify(this.value))

      if (e.target.checked) {
        this.newValue.push(e.target.value)
      } else {
        this.newValue = this.newValue.filter((v) => v !== e.target.value)
      }

      this.initFlg = true

      this.$emit('input', this.newValue)
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-checkbox {
  position: relative;
  &.vertical-layout {
    .checkbox_list {
      flex-direction: column;

      label {
        &:not(:last-child) {
          margin-bottom: 12px;
        }
        p {
          padding-left: 30px;
        }
      }
    }
  }
  &.horizon-layout {
    .checkbox_list {
      label {
        &:not(:last-child) {
          margin-right: 12px;
        }
        p {
          padding-left: 30px;
          padding-right: 24px;
        }
      }
    }
  }

  .checkbox_list {
    display: flex;
    flex-wrap: wrap;
    label {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      cursor: pointer;
      &.is-disabled {
        pointer-events: none;
        p {
          display: flex;
          align-items: center;
          color: #a5a5a5;
          &::before {
            opacity: 0.5;
          }
        }
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
//     display: inline-block;
//     position: relative;
//   }
//   & + p::before {
//     -webkit-transform: translateY(-50%);
//     background: #f7f8f9;
//     border: #d3d3d3 1px solid;
//     border-radius: 4px;
//     content: '';
//     display: block;
//     height: 18px;
//     left: 0;
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     width: 18px;
//   }

//   &:checked + p::before {
//     background: #007aff;
//     border: none;
//   }
//   & + p::after {
//     -webkit-transform: translateY(-50%) rotate(-45deg);
//     border-bottom: 2px solid #fff;
//     border-left: 2px solid #fff;
//     content: '';
//     display: block;
//     height: 7px;
//     left: 3px;
//     margin-top: -0.2em;
//     opacity: 0;
//     position: absolute;
//     top: 13px;
//     transform: translateY(-50%) rotate(-45deg);
//     width: 11px;
//   }
//   &:checked + p::after {
//     opacity: 1;
//   }
// }
.icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
  &-checkCircle {
    fill: #34c759;
  }
  &-warning {
    fill: #ffcc00;
  }
  &-error {
    fill: #e60012;
  }
}
</style>
