<template>
  <div class="form-newPage">
    <button class="btn btn-middle btn-cancel">
      {{ partsData.parts_attr.label_prev }}
    </button>
    <button class="btn btn-middle btn-basic">
      {{ partsData.parts_attr.label_next }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'FormPreviewPartsNewPage',
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
.form-newPage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 180px;
    height: 48px;
    &:not(:last-child) {
      margin-right: 16px;
    }
  }
}
</style>
