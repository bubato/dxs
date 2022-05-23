<template>
  <div class="form-prefectures">
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
      <select
        :id="'selectbox-preview'"
        type="checkbox"
        class="selectbox"
        name="checkbox-preview"
      >
        <option>選択してください</option>
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
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
  ANNOTATION_POSITION,
  PROVINCES_CODE_LIST,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsPrefectures',
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
      PROVINCES_CODE_LIST,
      options: PROVINCES_CODE_LIST.map((e) => ({
        code: e.code,
        group: e.group,
        label: e.label,
        value: e.label,
      })),
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
@import '~assets/styles/scss/form/edit/formEditPartsDetailModal.scss';
.form-prefectures {
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
