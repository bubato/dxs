<template>
  <div>
    <codemirror v-model="code" :options="cmOptions"></codemirror>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      code: '',
      cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/javascript',
        lineWrapping: true,
        theme: 'base16-dark',
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
