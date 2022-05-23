<template>
  <div class="form-spacer"></div>
</template>

<script>
export default {
  name: 'FormPreviewPartsSpacer',
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
.form-spacer {
  height: 20px;
  vertical-align: top;
}
</style>
