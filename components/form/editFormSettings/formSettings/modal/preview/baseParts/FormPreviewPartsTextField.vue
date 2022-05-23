<template>
  <div class="form-textField">
    <RequiredFormLabel
      class="title"
      :label="partsData.title"
      :required="partsData.required_flg"
    />
    <div class="contents">
      <p
        v-if="
          partsData.parts_attr.annotation_pos === ANNOTATION_POSITION.ABOVE_FORM
        "
        class="annotation-top"
      >
        {{ partsData.parts_attr.annotation }}
      </p>
      <CustomInputText
        v-model="inputText"
        type="text"
        :placeholder="partsData.parts_attr.placeholder"
        :maxlength="partsData.parts_attr.char_limit"
        class="textfield"
        :style="previewInputStyle"
      />
      <p
        v-if="
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
  ANNOTATION_POSITION,
  HORIZONTAL_SIZE_UNIT,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsTextField',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      ANNOTATION_POSITION,
      HORIZONTAL_SIZE_UNIT,
      inputText: '',
    }
  },
  computed: {
    previewInputStyle() {
      return {
        width:
          '' +
          this.partsData.parts_attr.width +
          (this.partsData.parts_attr.width_unit === HORIZONTAL_SIZE_UNIT.PX
            ? 'px'
            : '%'),
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-textField {
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
