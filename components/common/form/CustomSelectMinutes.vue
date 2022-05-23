<template>
  <div
    class="custom-select-minutes"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <select
      v-model="selectValue"
      class="select_minutes"
      :class="[
        { unselected: value === '' && !requiredFlg },
        { 'is-disabled': isDisabled },
      ]"
      @change="updateValue"
    >
      <option v-if="!requiredFlg" value="" class="initOption">分</option>
      <option
        v-for="(data, index) in getMinutesOptions()"
        :key="index"
        :value="data"
      >
        {{ data }}分
      </option>
    </select>
    <ExpandMoreSVG v-show="!open" class="icon-arrow icon-expandMore" />
    <ExpandLessSVG v-show="open" class="icon-arrow icon-expandLess" />
  </div>
</template>

<script>
export default {
  name: 'CustomSelectMinutes',
  components: {},
  props: {
    value: { type: String, required: false, default: '' },
    isDisabled: { type: Boolean, required: false, default: false },
    requiredFlg: { type: Boolean, required: false, default: true },
    optionNum: { type: Number, required: false, default: 1 },
  },
  data() {
    return {
      open: false,
      validationMsg: '',
      errorList: [],
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    getMinutesOptions() {
      return () => {
        const options = []

        for (let i = 0; i < 60; i += this.optionNum) {
          options.push(i)
        }

        return options
      }
    },
  },
  created() {},
  mounted() {
    this.$emit('input', this.value)
  },
  methods: {
    updateValue(e) {
      this.$emit('input', e.target.value)
    },
    openMenu() {
      this.open = !this.open
    },
    away() {
      this.open = false
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-select-minutes {
  width: 120px;
  position: relative;
  .select_minutes {
    option {
      &.initOption {
        color: #e5e5e5;
      }
      color: #1e1e1e;
    }
  }
  .icon-arrow {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    pointer-events: none;
  }
}
</style>
