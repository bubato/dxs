<template>
  <div class="form-birthday">
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
          v-model="monthPreview"
          class="input-month"
          :options="monthOptions()"
        />
        <CustomInputSelect
          v-model="dayPreview"
          class="input-day"
          :options="dayOptions()"
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
  name: 'FormPreviewPartsBirthday',
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
      yearPreview: '',
      monthPreview: '',
      dayPreview: '',
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
            disabled: true,
          })
        }

        for (
          let i = this.partsData.year.parts_attr.year_from;
          i <= this.partsData.year.parts_attr.year_to;
          i++
        ) {
          const year = String(new Date().getFullYear() - i)

          options = {}
          options.code = year
          options.label = year + '年'

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
            disabled: true,
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
    dayOptions() {
      return () => {
        const daysInMonth = new Date(
          this.yearPreview,
          this.monthPreview,
          0
        ).getDate()
        const dayOptions = []
        let options = {}

        if (!this.partsData.required_flg) {
          dayOptions.push({
            code: '0',
            label: '日を選択',
            disabled: true,
          })
        }

        for (let i = 1; i <= daysInMonth; i++) {
          const day = ('00' + i).slice(-2)

          options = {}
          options.code = day
          options.label = day + '日'

          dayOptions.push(options)
        }
        return dayOptions
      }
    },
  },
  watch: {},
  created() {
    this.yearPreview = String(
      new Date().getFullYear() - this.partsData.year.parts_attr.year_default
    )
    this.monthPreview = this.partsData.required_flg ? '01' : '0'
    this.dayPreview = this.partsData.required_flg ? '01' : '0'
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-birthday {
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
        width: 124px;
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
