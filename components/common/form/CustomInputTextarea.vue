<template>
  <div
    class="custom-input-textarea"
    :class="[
      { 'validation-error': getErrorList().length > 0 },
      { 'height-variable': heightVariable },
      { 'padding-zero': paddingType === 1 },
    ]"
  >
    <ValidationMessage
      v-if="getErrorList().length > 0"
      :error-list="getErrorList()"
    />
    <div class="custom-input-textarea-block">
      <textarea
        ref="textArea"
        :value="value"
        :rows="rows"
        :class="{ 'is-disabled': isDisabled }"
        :readonly="isDisabled"
        @input="updateValue"
      />
      <!-- eslint-disable -->
      <div
        v-if="value.length === 0"
        class="placeholder"
        @click="focusTextarea()"
        v-html="placeholder"
      ></div>
      <!-- eslint-disable -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputTextarea',
  props: {
    value: { type: String, required: true, default: '' },
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
    rows: { type: String, required: false, default: '' },
    heightVariable: { type: Boolean, required: false, default: false },
    initShowRow: { type: Number, required: false, default: 1 },
    maxShowRow: { type: Number, required: false, default: 5 },
    paddingType: { type: Number, required: false, default: 0 },
    isDisabled: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      errorList: '',
      initFlg: false,
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
  watch: {
    value() {
      if (this.heightVariable) {
        this.$nextTick(() => this.adjustHeight())
      }
    },
  },
  mounted() {
    if (this.heightVariable) {
      this.initSetHeight()
    }
  },
  methods: {
    /**
     * テキストエリアの高さの初期値設定
     */
    initSetHeight() {
      const textarea = this.$refs.textArea
      const resetHeight = new Promise((resolve) => {
        resolve((textarea.style.height = 'auto'))
      })

      resetHeight.then(() => {
        textarea.style.height = this.initShowRow * 22 + 26 + 'px'
        textarea.style.minHeight = this.initShowRow * 22 + 26 + 'px'
        textarea.style.maxHeight = this.maxShowRow * 22 + 26 + 'px'
      })
    },
    adjustHeight() {
      const textarea = this.$refs.textArea
      const lines = (this.value + '\n').match(/\n/g).length
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = 'auto'))
      })

      resetHeight.then(function () {
        textarea.style.height = lines * 22 + 26 + 'px'
      })
    },
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('input', inputVal)

      this.initFlg = true
    },
    focusTextarea() {
      this.$nextTick(() => this.$refs.textArea.focus())
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-textarea {
  position: relative;
  height: 100%;
  &-block {
    height: 100%;
  }
  &.height-variable {
    textarea {
      line-height: 22px;
      padding: 12px 80px 12px 16px;
      font-size: 15px;
      overflow: auto;
    }
  }
  &.padding-zero {
    textarea {
      padding: 12px 0;
    }
  }
  &-block {
    position: relative;
  }
  .placeholder {
    position: absolute;
    top: 13px;
    left: 16px;
  }
}
</style>
