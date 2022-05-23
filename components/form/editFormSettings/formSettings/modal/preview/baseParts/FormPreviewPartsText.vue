<template>
  <div
    class="form-text"
    :class="{
      'flex-end': partsData.parts_attr.arrangement === ARRANGEMENT.INPUT_AREA,
    }"
  >
    <!-- eslint-disable vue/no-v-html -->
    <p v-html="partsData.parts_attr.text.replace(/\n/g, '<br/>')" />
  </div>
</template>

<script>
import {
  ARRANGEMENT,
  ARRANGEMENT_OPTIONS,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsText',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      ARRANGEMENT,
      ARRANGEMENT_OPTIONS,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-text {
  display: flex;
  &.flex-end {
    justify-content: flex-end;
  }
  p {
    flex: 0 0 72%;
  }
}
</style>
