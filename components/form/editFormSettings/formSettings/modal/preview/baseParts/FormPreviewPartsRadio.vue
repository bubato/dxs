<template>
  <div class="form-radio">
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
        class="radio-list"
        :class="{
          horizon: partsData.parts_attr.direction !== LINE_ARRANGEMENT.BREAK,
        }"
      >
        <li v-for="(optionItem, index) of previewOptions()" :key="index">
          <template v-if="optionItem.opt_kbn === GROUP_ITEM_TYPE.OPTION">
            <input
              :id="'radio-preview-' + index"
              v-model="inputValue"
              type="radio"
              :value="optionItem.opt_value"
              name="radio-preview"
            />
            <label :for="'radio-preview-' + index" class="radio-label">
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
  name: 'FormPreviewPartsRadio',
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
      inputValue: '',
    }
  },
  computed: {
    previewOptions() {
      return () => {
        const previewOptions = []
        let firstFlg = false

        for (let i = 0; i < this.partsData.options.length; i++) {
          const addData = {}

          addData.opt_kbn = this.partsData.options[i].opt_kbn

          if (addData.opt_kbn === this.GROUP_ITEM_TYPE.OPTION) {
            addData.opt_label = this.partsData.options[i].opt_label
            addData.opt_value = this.partsData.options[i].opt_value

            if (!firstFlg) {
              this.inputValue = addData.opt_value
              firstFlg = true
            }
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
.form-radio {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .radio-list {
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
            padding-left: 28px;
            cursor: pointer;
            display: inline-block;
            position: relative;
          }
          & + label::before {
            background: #f7f8f9;
            border: 1px solid #d3d3d3;
            border-radius: 50%;
            content: '';
            display: block;
            height: 18px;
            left: 0;
            position: absolute;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            width: 18px;
          }
          &:checked + label::before {
            background: #fff;
            border: 5px solid #007aff;
            border-radius: 50%;
            content: '';
            display: block;
            height: 18px;
            left: 0;
            position: absolute;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            width: 18px;
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
