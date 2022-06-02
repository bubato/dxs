<template>
  <div>
    <div v-if="label != null" class="search-caption mb-1 h-21">
      <span>{{label}}</span>
    </div>
    <span class="tab-buttons-container">
      <button
        v-for="(t, index) in tabs"
        :key="index"
        class="tab-button"
        :class="{ active: index === selected }"
        @click="onSelected(index)"
      >
        {{ t.title }}
      </button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TabButtons',
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    defaultSelected: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selected: parseInt(this.defaultSelected, 10) || 0,
    }
  },
  watch: {
    value(v) {
      if (v === this.selected) {
        return
      }
      this.selected = v
      this.$emit('selected', this.selected)
    },
  },
  methods: {
    onSelected(index) {
      if (this.selected === index) {
        return
      }

      this.selected = index
      this.$emit('selected', index)
      this.$emit('input', index)
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-buttons-container {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  button {
    font-size: 15px;
    width: 156px;
    height: 40px;
    &:not(.active) {
      cursor: pointer;
    }
    &.active,
    &:hover {
      background: #ebeced;
    }
    &.active {
      color: #007aff;
    }
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
  }
}
.mb-1 {
  margin-bottom: 1rem;
}
.h-21 {
  height: 21px
}
</style>
