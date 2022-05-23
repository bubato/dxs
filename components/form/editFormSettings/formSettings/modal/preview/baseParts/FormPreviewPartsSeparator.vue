<template>
  <div class="form-separator"><hr /></div>
</template>

<script>
export default {
  name: 'FormPreviewPartsSeparator',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-separator {
  hr {
    height: 1px;
    background-color: #d2d2d2;
    border: none;
  }
}
</style>
