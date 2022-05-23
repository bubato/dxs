<template>
  <div
    class="custom-change-textarea"
    :class="{
      'validation-error': validationMsg.length > 0 || !errorList.state,
    }"
  >
    <textarea ref="textArea" :value="value" @change="updateValue" />
    <!-- eslint-disable -->
    <div
      v-if="value.length === 0"
      class="placeholder"
      @click="focusTextarea()"
      v-html="placeholder"
    ></div>
    <!-- eslint-disable -->
    <div v-show="!errorList.state">
      <ul>
        <li v-for="(error, i) in errorList.data" :key="i">
          <p class="validation-message font-size-small">
            <ErrorSVG class="icon-error" />{{
              `${errorList.data[i]}${errorList.message}`
            }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomChangeTextarea',
  props: {
    value: { type: String, required: true, default: '' },
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
    errorList: { type: Object, required: false, default: () => {} },
  },
  data() {
    return {
      validationMsg: '',
    }
  },
  methods: {
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('change', inputVal)

      if (this.validation) {
        this.validationMsg = this.$common.getValidationMsg(
          this.validation,
          inputVal
        )
      }
    },
    focusTextarea() {
      this.$nextTick(() => this.$refs.textArea.focus())
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-change-textarea {
  position: relative;
  .placeholder {
    position: absolute;
    top: 16px;
    left: 16px;
  }
}
</style>
