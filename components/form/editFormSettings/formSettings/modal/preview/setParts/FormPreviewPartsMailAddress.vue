<template>
  <div class="form-mailAddress">
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
      <div class="input-mail">
        <input
          :id="partsData.id_attr"
          type="text"
          :class="partsData.class_attr"
          :placeholder="partsData.parts_attr.placeholder"
        />
        <input
          v-if="partsData.parts_attr.mail_confirm_flg"
          :id="partsData.confirm_email.id_attr"
          type="text"
          :class="partsData.confirm_email.class_attr"
          :placeholder="partsData.confirm_email.parts_attr.placeholder"
        />
      </div>
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
  name: 'FormPreviewPartsMailAddress',
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
.form-mailAddress {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .input-mail {
      > input {
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>
