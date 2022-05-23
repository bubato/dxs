<template>
  <div class="form-checkbox">
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
      <ul
        class="checkbox-list"
        :class="{
          horizon: partsData.parts_attr.direction !== LINE_ARRANGEMENT.BREAK,
        }"
      >
        <li v-for="(optionItem, index) of previewOptions()" :key="index">
          <template v-if="optionItem.opt_kbn === GROUP_ITEM_TYPE.OPTION">
            <input
              :id="'checkbox-preview-' + index"
              type="checkbox"
              :value="optionItem.opt_value"
              name="checkbox-preview"
            />
            <label :for="'checkbox-preview-' + index" class="checkbox-label">
              <span>{{ optionItem.opt_label }}</span>
            </label>
          </template>
          <template v-else>
            <span>{{ optionItem.opt_label }}</span>
          </template>
        </li>
      </ul>
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
  name: 'FormPreviewPartsCheckbox',
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
.form-checkbox {
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
          margin-right: 8px;

          &:last-child {
            margin-bottom: 8px;
          }
        }
      }
      li {
        display: flex;
        align-items: center;
        input {
          display: none;
          & + label {
            cursor: pointer;
            display: inline-block;
            position: relative;
            padding-left: 30px;
          }
          & + label::before {
            -webkit-transform: translateY(-50%);
            background: #f7f8f9;
            border: #d3d3d3 1px solid;
            border-radius: 4px;
            content: '';
            display: block;
            height: 18px;
            left: 0;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
          }

          &:checked + label::before {
            background: #007aff;
            border: none;
          }
          & + label::after {
            -webkit-transform: translateY(-50%) rotate(-45deg);
            border-bottom: 2px solid #fff;
            border-left: 2px solid #fff;
            content: '';
            display: block;
            height: 7px;
            left: 3px;
            margin-top: -0.2em;
            opacity: 0;
            position: absolute;
            top: 13px;
            transform: translateY(-50%) rotate(-45deg);
            width: 11px;
          }
          &:checked + label::after {
            opacity: 1;
          }
        }
        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
