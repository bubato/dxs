<template>
  <div class="form-heading2">
    <h2>{{ partsData.parts_attr.heading }}</h2>
  </div>
</template>

<script>
export default {
  name: 'FormPreviewPartsHeading2',
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
.form-heading2 {
  h2 {
    padding: 0.25em 0.5em;
    font-size: 16px;
    color: black;
    background: transparent;
    border-left: solid 4px #00b0f0;
  }
}
</style>
