<template>
  <div
    class="custom-input-select"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div class="custom-input-select-block">
      <select
        v-on-clickaway="away"
        :value="value"
        :class="[{ unselected: value === '' }, { 'is-disabled': isDisabled }]"
        @change="updateValue"
        @click="openMenu"
      >
        <option v-if="placeholder" value="" class="initOption">
          {{ placeholder }}
        </option>
        <option
          v-for="data in options"
          :key="data.code"
          :value="data.code"
          :disabled="data.disabled"
        >
          {{ data.label }}
        </option>
      </select>
      <ExpandMoreSVG v-show="!open" class="icon-arrow icon-expandMore" />
      <ExpandLessSVG v-show="open" class="icon-arrow icon-expandLess" />
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {
  name: 'CustomInputSelect',
  mixins: [clickaway],
  props: {
    value: { type: [String, Number], required: true, default: '' },
    isDisabled: { type: Boolean, required: false, default: false },
    options: { type: Array, required: true, default: () => [] },
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      open: false,
      showValidationMsg: false,
      errorList: [],
    }
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
      this.$emit('change', inputVal)

      if (this.validation) {
        this.errorList = this.$common.getValidationMsg(
          this.validation,
          inputVal
        )
      }
    },
    openMenu() {
      this.open = !this.open
    },
    away() {
      this.open = false
    },
    resetErrorList() {
      this.errorList = []
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-select {
  position: relative;
  &-block {
    position: relative;
    select {
      option {
        &.initOption,
        &:disabled {
          color: #e5e5e5;
        }
      }
    }
    .icon-arrow {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      margin: auto;
      pointer-events: none;
    }
  }
}
</style>
