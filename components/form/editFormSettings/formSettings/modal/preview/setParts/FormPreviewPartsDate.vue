<template>
  <div class="form-date">
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
      <div class="input-day">
        <CustomInputSelect
          v-if="partsData.parts_attr.calendar_flg === '0'"
          v-model="selectDate"
          :options="getDateOptions()"
          class="date-picker"
        />
        <CustomDatePicker
          v-if="partsData.parts_attr.calendar_flg === '1'"
          :disabled-dates="getDisabledDates()"
          class="date-picker"
        />
        <CustomInputSelect
          v-if="
            partsData.parts_attr.disp_config === '1' ||
            partsData.parts_attr.disp_config === '2'
          "
          :id="partsData.hour.id_attr"
          v-model="selectHours"
          :options="getHoursOptions()"
          :class="partsData.hour.class_attr"
          placeholder="時"
        />
        <CustomInputSelect
          v-if="partsData.parts_attr.disp_config === '2'"
          :id="partsData.minute.id_attr"
          v-model="selectMinutes"
          :options="getMinutesOptions()"
          :class="partsData.minute.class_attr"
          placeholder="分"
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
  MINUTE_UNIT_OPTIONS,
  DAY_OF_WEEK_CONFIG_DEFAULT,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormPreviewPartsDate',
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
      MINUTE_UNIT_OPTIONS,
      DAY_OF_WEEK_CONFIG_DEFAULT,
      selectDate: '',
      selectHours: '',
      selectMinutes: '',
    }
  },
  computed: {
    /**
     * 選択不可日付情報の取得
     */
    getDisabledDates() {
      return () => {
        const disabledDates = {
          to: this.getDisabledFromDate(), // 本日以前の日付は選択不可
          from: this.getDisabledToDate(), // 本日以降の日付が選択不可
          days: this.getDisabledWeek(),
        }

        return disabledDates
      }
    },
    /**
     * 日付のセレクトボックスの値取得
     */
    getDateOptions() {
      return () => {
        const date = new Date()
        const diffDate =
          this.partsData.day.parts_attr.day_to -
          this.partsData.day.parts_attr.day_from
        const options = []
        const disabledWeek = this.getDisabledWeek()

        date.setDate(
          date.getDate() + this.partsData.day.parts_attr.day_from - 1
        )

        for (let i = 0; i <= diffDate; i++) {
          date.setDate(date.getDate() + 1)

          if (!disabledWeek.includes(date.getDay())) {
            const targetDate = `
            ${date.getFullYear()}/${('00' + (date.getMonth() + 1)).slice(
              -2
            )}/${('00' + date.getDate()).slice(-2)}`

            options.push({
              code: targetDate,
              label: targetDate,
            })

            if (i === 0) {
              this.selectDate = targetDate
            }
          }
        }

        return options
      }
    },
    /**
     * 選択可能時間の取得
     */
    getHoursOptions() {
      return () => {
        const selectHours = this.partsData.hour.parts_attr.disp_time
        const hoursOptions = []

        for (let i = 0; i < selectHours.length; i++) {
          const option = {}
          option.code = selectHours[i]
          option.label = selectHours[i] + '時'
          hoursOptions.push(option)
        }

        return hoursOptions
      }
    },
    /**
     * 選択可能時間の取得
     */
    getMinutesOptions() {
      return () => {
        const selectMinutes = Number(
          this.partsData.minute.parts_attr.minute_unit
        )
        const minutesOptions = []

        for (let i = 0; i < 60; i += selectMinutes) {
          const option = {}
          option.code = String(i)
          option.label = String(i) + '分'
          minutesOptions.push(option)
        }

        return minutesOptions
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getDisabledFromDate() {
      const fromDt = new Date()

      if (this.partsData.day.parts_attr.day_from > 0) {
        fromDt.setDate(
          fromDt.getDate() + this.partsData.day.parts_attr.day_from - 1
        )
      } else {
        fromDt.setDate(
          fromDt.getDate() + this.partsData.day.parts_attr.day_from - 1
        )
      }

      return fromDt
    },
    getDisabledToDate() {
      const toDt = new Date()

      if (this.partsData.day.parts_attr.day_to > 0) {
        toDt.setDate(toDt.getDate() + this.partsData.day.parts_attr.day_to)
      } else {
        toDt.setDate(toDt.getDate() + this.partsData.day.parts_attr.day_to)
      }

      return toDt
    },
    getDisabledWeek() {
      const disabledDays = []
      const selectDayOfWeek = this.partsData.day.parts_attr.day_of_week_config
      const unSelectDayOfWeek = this.DAY_OF_WEEK_CONFIG_DEFAULT.filter(
        (i) => !selectDayOfWeek.includes(i)
      )

      for (let i = 0; i < unSelectDayOfWeek.length; i++) {
        const dayOfWeek = unSelectDayOfWeek[i]
        let addValue = null
        switch (dayOfWeek) {
          case 'sun':
            addValue = 0
            break
          case 'mon':
            addValue = 1
            break
          case 'tue':
            addValue = 2
            break
          case 'wed':
            addValue = 3
            break
          case 'thu':
            addValue = 4
            break
          case 'fri':
            addValue = 5
            break
          case 'sat':
            addValue = 6
            break
        }

        disabledDays.push(addValue)
      }

      return disabledDays
    },
  },
}
</script>

<style lang="scss" scoped>
.form-date {
  .contents {
    margin-top: 8px;
    .annotation-top {
      margin-bottom: 8px;
    }
    .annotation-bottom {
      margin-top: 8px;
    }
    .input-day {
      display: flex;
      align-items: center;
      > * {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
