<template>
  <div class="form-gender">
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
        <li v-for="(optionItem, index) of getFilterOptions()" :key="index">
          <input
            :id="'radio-preview-' + index"
            v-model="selectVal"
            type="radio"
            :value="optionItem.opt_value"
            name="radio-preview"
          />
          <label :for="'radio-preview-' + index" class="radio-label">
            <span>{{ optionItem.opt_label }}</span>
          </label>
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
  ANNOTATION_POSITION,
  LINE_ARRANGEMENT,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsGender',
  components: {},
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
      LINE_ARRANGEMENT,
      selectVal: '男性',
    }
  },
  computed: {
    getFilterOptions() {
      return () => {
        const customizeOption = this.partsData.parts_attr.customize_options_flg
        const filterOptions = this.partsData.options.filter((data) => {
          let result = true

          if (!customizeOption && data.opt_value === 'その他') {
            result = false
            this.selectVal = '男性'
          }

          return result
        })

        return filterOptions
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
.form-gender {
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
