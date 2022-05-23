<template>
  <div
    class="disclosure-range"
    :class="{ 'validation-error': validationMsg.length > 0 }"
  >
    <div class="disclosure-range-box">
      <component :is="currentSelectedIcon(value)" class="icon-select" />
      <select
        :value="value"
        :class="{ unselected: value === '' }"
        @change="updateValue"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option
          v-for="(data, index) in options"
          :key="index"
          :value="data.code"
        >
          {{ data.label }}
        </option>
      </select>
    </div>
    <ExpandMoreSVG class="icon-arrow" />
    <p v-if="validationMsg" class="validation-message font-size-small">
      <ErrorSVG class="icon-error" />{{ validationMsg }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'DisclosureRangeSelect',
  props: {
    value: { type: String, required: true },
    options: { type: Array, required: true, default: () => [] },
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      showValidationMsg: false,
      validationMsg: '',
    }
  },
  computed: {
    currentSelectedIcon() {
      return (select) => {
        let iconName = null
        switch (select) {
          case 'everyone':
            iconName = 'PublicSVG'
            break
          case 'connection':
            iconName = 'StarSVG'
            break
          case 'myself':
            iconName = 'StarSVG'
            break
          default:
            break
        }
        return iconName
      }
    },
  },
  mounted() {
    this.$emit('input', this.value)

    if (this.validation) {
      this.validationMsg = this.$common.getValidationMsg(
        this.validation,
        this.value
      )
    }
  },
  methods: {
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('input', inputVal)

      if (this.validation) {
        this.validationMsg = this.$common.getValidationMsg(
          this.validation,
          inputVal
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.disclosure-range {
  position: relative;
  &-box {
    display: flex;
    align-items: center;
    position: relative;
    min-width: 140px;
    select {
      position: absolute;
      right: 0;
      height: 32px;
      background: #f7f8f9;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      color: #1e1e1e;
      padding: 7px 0 8px 29px;
      outline: none;
    }
    .icon {
      &-select {
        position: absolute;
        left: 7px;
        width: 20px;
        height: 20px;
        z-index: 9999;
      }
    }
  }
}

.icon-arrow {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 7px;
  bottom: 0;
  margin: auto 0;
  pointer-events: none;
}

@media all and (-ms-high-contrast: none) {
  *::-ms-backdrop,
  .icon-arrow {
    top: 5px;
    margin: 0;
  }
  .icon-select {
    top: 6px;
  }
  .disclosure-range-box {
    select {
      height: 34px;
      padding: 8px 0 8px 29px;
    }
  }
}
</style>
