<template>
  <div v-if="errorList.length > 0" class="validation-message">
    <ul class="validation-message-list">
      <li v-for="(errorMsg, index) in errorList" :key="index">
        <ErrorSVG class="icon icon-error" />{{ errorMsg }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ValidationMessage',
  props: {
    errorList: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
