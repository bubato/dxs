<template>
  <div class="form-selectbox">
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
          v-for="(option, index) in previewOptions()"
          :key="index"
          :value="option.opt_value"
        >
          {{ option.opt_label }}
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
  LINE_ARRANGEMENT,
  ANNOTATION_POSITION,
  GROUP_ITEM_TYPE,
  HORIZONTAL_SIZE_UNIT,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsSelectbox',
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
    }
  },
  computed: {
    previewOptions() {
      return () => {
        const previewOptions = []

        for (let i = 0; i < this.partsData.options.length; i++) {
          const addData = {}

          addData.opt_kbn = this.partsData.options[i].opt_kbn

          if (addData.opt_kbn === this.GROUP_ITEM_TYPE.OPTION) {
            addData.opt_label = this.partsData.options[i].opt_label
            addData.opt_value = this.partsData.options[i].opt_value
          } else {
            addData.opt_label = this.partsData.options[i].opt_label
          }

          previewOptions.push(addData)
        }

        return previewOptions
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
.form-selectbox {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .checkbox-list {
      &.horizon {
        display: flex;
        align-items: center;
        li {
          &:not(:last-child) {
            margin-right: 8px;
          }
        }
      }
      li {
        display: flex;
        align-items: center;
        input {
          margin-right: 12px;
        }
        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
