<template>
  <div
    class="select_days_area"
    :class="{ 'validation-error': getErrorList().length > 0 }"
  >
    <ValidationMessage
      v-if="getErrorList().length > 0"
      :error-list="getErrorList()"
    />
    <datepicker
      ref="picker"
      class="select_days"
      :class="{ 'is-disabled': isDisabled }"
      :format="customFormatter"
      :value="value"
      :typeable="true"
      :disabled-dates="disabledDates"
      placeholder="日付を選択"
      locale="jp-ja"
      @input="updateValue"
      ><CalendarSVG
        v-if="showIcon"
        slot="afterDateInput"
        class="icon-calendar"
        @click="doOpen()"
    /></datepicker>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'CustomDatePicker',
  components: {},
  props: {
    value: { type: String, required: false, default: '' },
    showIcon: { type: Boolean, required: false, default: true },
    isDisabled: { type: Boolean, required: false, default: false },
    validation: { type: Array, required: false, default: () => [] },
    disabledDates: { type: Object, required: false, default: () => {} },
  },
  data() {
    return {
      errorList: [],
      initFlg: false,
      validationMsg: '',
      DatePickerFormat: 'yyyy/MM/dd',
    }
  },
  computed: {
    getErrorList() {
      return () => {
        let validationList = []

        if (!this.initFlg) {
          return []
        }

        if (this.validation) {
          validationList = this.$common.getValidationMsg(
            this.validation,
            this.value
          )
        }

        return validationList
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    updateValue(val) {
      const formatValue = val ? dayjs(val).format('YYYY/MM/DD') : ''

      this.initFlg = true

      this.$emit('input', formatValue)
    },
    customFormatter(date) {
      return dayjs(date).format('YYYY/MM/DD')
    },
    doOpen() {
      if (!this.$refs.picker.isOpen) {
        this.$refs.picker.$el.querySelector('input').focus()
        this.$refs.picker.showCalendar()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.select_days_area {
  position: relative;
  .icon-calendar {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 8px;
    margin: auto;
  }
  ::v-deep .vdp-datepicker__calendar {
    header {
      display: flex;
      height: 40px;
      align-items: center;
      .prev {
        order: 2;
      }
      .day__month_btn {
        order: 1;
      }
      .next {
        order: 3;
      }
    }
    .cell {
      &.day-header {
        &:nth-of-type(1) {
          color: #ff453a;
        }
        &:nth-of-type(7) {
          color: #007aff;
        }
      }
      &.selected {
        color: #ffffff;
        background: #4f7df0;
      }
    }
  }
  ::v-deep .is-disabled input {
    background: #cdced0;
    color: #8e8e8e;
    pointer-events: none;
  }
}
</style>
