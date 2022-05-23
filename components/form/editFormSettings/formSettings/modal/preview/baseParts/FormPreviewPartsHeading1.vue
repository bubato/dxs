<template>
  <div class="form-heading1">
    <h1>{{ partsData.parts_attr.heading }}</h1>
  </div>
</template>

<script>
export default {
  name: 'FormPreviewPartsHeading1',
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
.form-heading1 {
  h1 {
    width: calc(100% - 15px);
    padding: 10px 0 10px 15px;
    font-size: 20px;
    line-height: 2;
    color: black;
    background-color: #f2f2f2;
  }
}
</style>
