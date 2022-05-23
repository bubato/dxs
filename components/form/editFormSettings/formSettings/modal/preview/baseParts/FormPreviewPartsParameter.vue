<template>
  <div class="form-parameter">
    <p class="title">{{ partsData.title }}</p>
    <div class="contents">
      <CustomInputText
        v-model="partsData.parts_attr.default_value"
        :is-disabled="true"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormPreviewPartsParameter',
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
.form-parameter {
  .contents {
    margin-top: 8px;
  }
}
</style>
