<template>
  <div class="form-attachingFile">
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
      <FileUpload
        :file-data="fileData"
        file-type="all"
        @uploaded="uploaded($event)"
        @deleted="deleted()"
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
import { ANNOTATION_POSITION } from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsAttachingFile',
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
      fileData: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    uploaded(val) {
      this.fileData = val.fileData
    },
    deleted() {
      this.fileData = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.form-attachingFile {
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
