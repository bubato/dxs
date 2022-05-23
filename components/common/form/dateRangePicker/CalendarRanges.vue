<template>
  <div class="ranges">
    <ul v-if="ranges">
      <li
        v-for="range in listedRanges"
        :key="range.label"
        :data-range-key="range.label"
        :class="range_class(range)"
        tabindex="0"
        @click="clickRange(range.value)"
      >
        {{ range.label }}
      </li>
      <li
        v-if="showCustomRangeLabel"
        :class="{ active: customRangeActive || !selectedRange }"
        tabindex="0"
        @click="clickCustomRange"
      >
        {{ localeData.customRangeLabel }}
      </li>
    </ul>
  </div>
</template>

<script>
import dateUtilMixin from './dateUtilMixin'

export default {
  mixins: [dateUtilMixin],
  props: {
    ranges: {
      type: Object,
      default: () => {},
    },
    selected: {
      type: Object,
      default: () => {},
    },
    localeData: {
      type: Object,
      default: () => {},
    },
    alwaysShowCalendars: Boolean,
  },
  data() {
    return {
      customRangeActive: false,
    }
  },
  computed: {
    listedRanges() {
      if (!this.ranges) return false
      return Object.keys(this.ranges).map((value) => {
        return {
          label: value,
          value: this.ranges[value],
          selected:
            this.$dateUtil.isSame(
              this.selected.startDate,
              this.ranges[value][0]
            ) &&
            this.$dateUtil.isSame(this.selected.endDate, this.ranges[value][1]),
        }
      })
    },
    selectedRange() {
      return this.listedRanges.find((r) => r.selected === true)
    },
    showCustomRangeLabel() {
      return !this.alwaysShowCalendars
    },
  },
  methods: {
    clickRange(range) {
      this.customRangeActive = false
      this.$emit('clickRange', range)
    },
    clickCustomRange() {
      this.customRangeActive = true
      this.$emit('showCustomRange')
    },
    range_class(range) {
      return { active: range.selected === true }
    },
  },
}
</script>
