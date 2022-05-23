<template>
  <div class="form-yearMonth">
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
      <div class="input-birthday">
        <CustomInputSelect
          v-model="yearPreview"
          class="input-year"
          :options="yearOptions()"
        />
        <CustomInputSelect
          v-if="partsData.parts_attr.select_month_flg"
          v-model="monthPreview"
          class="input-month"
          :options="monthOptions()"
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
import {
  ANNOTATION_POSITION,
  NAME_INPUT_METHOD,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsYearMonth',
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
      requestFlg: this.partsData.required_flg,
      yearPreview: '0',
      monthPreview: '0',
    }
  },
  computed: {
    yearOptions() {
      return () => {
        const yearOptions = []
        let options = {}

        if (!this.partsData.required_flg) {
          yearOptions.push({
            code: '0',
            label: '年を選択',
          })
        }

        const currentYear = Number(new Date().getFullYear())
        const startYear =
          currentYear - Number(this.partsData.year.parts_attr.year_from)
        const endYear =
          currentYear + Number(this.partsData.year.parts_attr.year_to)

        for (let i = startYear; i <= endYear; i++) {
          options = {}
          options.code = String(i)
          options.label = String(i) + '年'

          yearOptions.push(options)
        }

        return yearOptions
      }
    },
    monthOptions() {
      return () => {
        const monthOptions = []
        let options = {}

        if (!this.partsData.required_flg) {
          monthOptions.push({
            code: '0',
            label: '月を選択',
          })
        }

        for (let i = 1; i <= 12; i++) {
          const month = ('00' + i).slice(-2)

          options = {}
          options.code = month
          options.label = month + '月'

          monthOptions.push(options)
        }

        return monthOptions
      }
    },
  },
  watch: {},
  created() {
    const currentYear = Number(new Date().getFullYear())
    const endYear = currentYear + Number(this.partsData.year.parts_attr.year_to)
    this.yearPreview = this.partsData.required_flg ? String(endYear) : '0'
    this.monthPreview = this.partsData.required_flg ? '01' : '0'
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-yearMonth {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .input-birthday {
      display: flex;
      align-items: center;
      ::v-deep .custom-input-select {
        width: 100%;
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
