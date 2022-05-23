<template>
  <div
    class="code-mirror"
    :class="{ 'validation-error': getErrorList().length > 0 }"
  >
    <ValidationMessage
      v-if="getErrorList().length > 0"
      :error-list="getErrorList()"
    />
    <codemirror v-model="inputCode" :options="cmOptions"></codemirror>
  </div>
</template>
<script>
export default {
  name: 'CodeMirrorEditor',
  components: {},
  props: {
    propCode: {
      type: String,
      default: '',
      required: false,
    },
    validation: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/javascript',
        lineWrapping: true,
        theme: 'base16-dark',
      },
      errorList: [],
    }
  },
  computed: {
    inputCode: {
      get() {
        return this.$props.propCode
      },
      set(value) {
        this.$emit('updateCode', value)
      },
    },
    getErrorList() {
      return () => {
        let validationList = []

        if (this.validation) {
          validationList = this.$common.getValidationMsg(
            this.validation,
            this.propCode
          )
        }

        return validationList
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.code-mirror {
  height: 100%;
}
::v-deep .CodeMirror,
.vue-codemirror {
  height: 100%;
}
</style>
