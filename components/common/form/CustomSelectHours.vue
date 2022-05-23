<template>
  <div
    class="custom-select-hours"
    :class="{ 'validation-error': errorList.length > 0 }"
  >
    <select
      v-model="selectValue"
      class="select_hours"
      :class="[
        { unselected: value === '' && !requiredFlg },
        { 'is-disabled': isDisabled },
      ]"
      @change="updateValue"
    >
      <option v-if="!requiredFlg" value="" class="initOption">時</option>
      <option v-for="(data, index) in 24" :key="index" :value="index">
        {{ data - 1 }}時
      </option>
    </select>
    <ExpandMoreSVG v-show="!open" class="icon-arrow icon-expandMore" />
    <ExpandLessSVG v-show="open" class="icon-arrow icon-expandLess" />
  </div>
</template>

<script>
export default {
  name: 'CustomSelectHours',
  components: {},
  props: {
    value: { type: String, required: false, default: '' },
    isDisabled: { type: Boolean, required: false, default: false },
    requiredFlg: { type: Boolean, required: false, default: true },
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
.custom-select-hours {
  width: 120px;
  position: relative;
  .select_hours {
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
