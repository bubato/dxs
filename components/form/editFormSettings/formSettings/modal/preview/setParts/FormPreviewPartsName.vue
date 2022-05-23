<template>
  <div class="form-name">
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
      <div class="input-name">
        <div
          v-if="
            partsData.parts_attr.input_method === NAME_INPUT_METHOD.SPLIT_NAME
          "
          class="name"
        >
          <div class="last-name">
            <p class="title">{{ partsData.name_last_name.parts_attr.label }}</p>
            <input
              :id="partsData.name_last_name.id_attr"
              v-model="inputLastName"
              type="text"
              :class="partsData.name_last_name.class_attr"
              :placeholder="partsData.name_last_name.parts_attr.placeholder"
            />
          </div>
          <div class="first-name">
            <p class="title">
              {{ partsData.name_first_name.parts_attr.label }}
            </p>
            <input
              :id="partsData.name_first_name.id_attr"
              v-model="inputFirstName"
              type="text"
              :class="partsData.name_first_name.class_attr"
              :placeholder="partsData.name_first_name.parts_attr.placeholder"
            />
          </div>
        </div>
        <div
          v-if="
            partsData.parts_attr.input_method ===
              NAME_INPUT_METHOD.SPLIT_NAME &&
            partsData.parts_attr.input_kana_flg === '1'
          "
          class="name-kana"
        >
          <div class="last-name">
            <p class="title">
              {{ partsData.name_last_name_kana.parts_attr.label }}
            </p>
            <input
              :id="partsData.name_last_name_kana.id_attr"
              v-model="inputLastNameKana"
              type="text"
              :class="partsData.name_last_name_kana.class_attr"
              :placeholder="
                partsData.name_last_name_kana.parts_attr.placeholder
              "
            />
          </div>
          <div class="first-name">
            <p class="title">
              {{ partsData.name_first_name_kana.parts_attr.label }}
            </p>
            <input
              :id="partsData.name_first_name_kana.id_attr"
              v-model="inputFirstNameKana"
              type="text"
              :class="partsData.name_first_name_kana.class_attr"
              :placeholder="
                partsData.name_first_name_kana.parts_attr.placeholder
              "
            />
          </div>
        </div>
        <div
          v-if="
            partsData.parts_attr.input_method === NAME_INPUT_METHOD.COMBINE_NAME
          "
          class="name-full"
        >
          <div class="last-name">
            <p class="title">{{ partsData.name_full_name.parts_attr.label }}</p>
            <input
              :id="partsData.name_full_name.id_attr"
              v-model="inputFullName"
              type="text"
              :class="partsData.name_full_name.class_attr"
              :placeholder="partsData.name_full_name.parts_attr.placeholder"
            />
          </div>
        </div>
        <div
          v-if="
            partsData.parts_attr.input_method ===
              NAME_INPUT_METHOD.COMBINE_NAME &&
            partsData.parts_attr.input_kana_flg === '1'
          "
          class="name-full-kana"
        >
          <div class="last-name">
            <p class="title">
              {{ partsData.name_full_name_kana.parts_attr.label }}
            </p>
            <input
              :id="partsData.name_full_name_kana.id_attr"
              v-model="inputFullNameKana"
              type="text"
              :class="partsData.name_full_name_kana.class_attr"
              :placeholder="
                partsData.name_full_name_kana.parts_attr.placeholder
              "
            />
          </div>
        </div>
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
import {
  ANNOTATION_POSITION,
  NAME_INPUT_METHOD,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsName',
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
      NAME_INPUT_METHOD,
      inputLastName: '',
      inputFirstName: '',
      inputLastNameKana: '',
      inputFirstNameKana: '',
      inputFullName: '',
      inputFullNameKana: '',
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
.form-name {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .input-name {
      .name,
      .name-kana {
        display: flex;
        > div {
          &:not(:last-child) {
            margin-right: 16px;
          }
        }
      }
      > div {
        &:not(:last-child) {
          margin-bottom: 12px;
        }
        .title {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
