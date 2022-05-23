<template>
  <div class="form-address">
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
      <div class="input-address">
        <div class="input-postcode">
          <p class="title">
            {{ partsData.postal_code_attr.parts_attr.label }}
          </p>
          <div class="contents">
            <div class="flex">
              <CustomInputText
                v-model="preview.postal_code"
                :placeholder="partsData.postal_code_attr.parts_attr.placeholder"
              />
              <button
                class="btn btn-middle btn-secondary"
                :class="partsData.auto_fill_btn_attr.class_attr"
                @click="searchZipCode()"
              >
                {{ partsData.auto_fill_btn_attr.parts_attr.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="input-prefectures">
          <p class="title">{{ partsData.prefecture_attr.parts_attr.label }}</p>
          <div class="contents">
            <CustomInputSelect
              v-model="preview.prefecture"
              :options="PROVINCES_CODE_LIST"
              class="width-200"
              placeholder="選択してください"
            />
          </div>
        </div>
        <div class="input-city">
          <p class="title">{{ partsData.city_attr.parts_attr.label }}</p>
          <div class="contents">
            <CustomInputText
              v-model="preview.city"
              :placeholder="partsData.city_attr.parts_attr.placeholder"
            />
          </div>
        </div>
        <div class="input-streetAddress">
          <p class="title">
            {{ partsData.street_address_attr.parts_attr.label }}
          </p>
          <div class="contents">
            <CustomInputText
              v-model="preview.street_address"
              :placeholder="
                partsData.street_address_attr.parts_attr.placeholder
              "
            />
          </div>
        </div>
        <div class="input-buildingName">
          <p class="title">
            {{ partsData.building_name_attr.parts_attr.label }}
          </p>
          <div class="contents">
            <CustomInputText
              v-model="preview.building_name"
              :placeholder="partsData.building_name_attr.parts_attr.placeholder"
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
  PROVINCES_CODE_LIST,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsAddress',
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
      preview: {
        postal_code: '',
        prefecture: '',
        city: '',
        street_address: '',
        building_name: '',
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    searchZipCode() {
      const zipCode = this.preview.postal_code.replace(/-/g, '')

      // 郵便番号のバリデーションチェック
      const reg = /^\d{7}$/
      if (!reg.test(zipCode)) {
        return
      }

      this.$api
        .getAddress(zipCode)
        .then((resData) => {
          // 存在しない郵便番号でapiを叩くと200以外のステータスが返ってくる
          if (resData.data.status !== 200 || resData.data.results === null) {
            this.preview.postal_code = ''
            this.preview.prefecture = ''
            this.preview.city = ''
            this.preview.street_address = ''
            this.preview.building_name = ''
          } else {
            // 返却されたデータを挿入する
            this.preview.prefecture = (
              '00' + resData.data.results[0].prefcode
            ).slice(-2)
            this.preview.city = resData.data.results[0].address2
            this.preview.street_address = resData.data.results[0].address3
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/form/edit/formPreviewPartsDetailModal.scss';

.form-address {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .input-address {
      > div {
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
      .input-postcode {
        .contents {
          .flex {
            > div:not(:last-child) {
              margin-right: 16px;
            }
          }
          .btn {
            height: 48px;
          }
        }
      }
    }
  }
}
</style>
