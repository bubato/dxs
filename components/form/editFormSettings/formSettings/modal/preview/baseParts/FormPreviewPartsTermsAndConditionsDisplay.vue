<template>
  <div class="form-termsAndConditionsDisplay">
    <RequiredFormLabel
      class="title"
      :label="partsData.title"
      :required="partsData.required_flg"
    />
    <div class="contents">
      <p
        v-show="
          partsData.parts_attr.annotation_pos === ANNOTATION_POSITION.ABOVE_FORM
        "
        class="annotation-top"
      >
        {{ partsData.parts_attr.annotation }}
      </p>
      <CustomInputSingleCheckbox
        v-model="previewCheck"
        :label="partsData.parts_attr.label"
        name="previewCheck"
      />
      <p
        v-show="
          partsData.parts_attr.annotation_pos === ANNOTATION_POSITION.BELOW_FORM
        "
        class="annotation-bottom"
      >
        {{ partsData.parts_attr.annotation }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  LINE_ARRANGEMENT,
  ANNOTATION_POSITION,
  GROUP_ITEM_TYPE,
  HORIZONTAL_SIZE_UNIT,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsTermsAndConditionsDisplay',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      LINE_ARRANGEMENT,
      ANNOTATION_POSITION,
      GROUP_ITEM_TYPE,
      HORIZONTAL_SIZE_UNIT,
      previewCheck: false,
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
.form-termsAndConditionsDisplay {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
  }
}
</style>
