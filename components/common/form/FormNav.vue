<template>
  <ul class="nav-list" :class="{ 'can-click': canClick }">
    <li
      v-for="(nav, index) in navList"
      :key="index"
      :class="[
        { first: index === 0 },
        { last: index === navList.length - 1 },
        { selected: selectIndex === index },
      ]"
      @click="selectNav(index)"
    >
      <span>
        <span class="index">{{ index + 1 }}</span>
        {{ nav }}
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FormNav',
  components: {},
  props: {
    navList: { type: Array, required: false, default: () => [] },
    selectIndex: { type: Number, required: false, default: null },
    canClick: { type: Boolean, required: false, default: false },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {
    this.$emit('input', this.value)
  },
  methods: {
    selectNav(index) {
      if (this.selectIndex !== index) {
        this.$emit('click', index)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin stt-color($baseColor: #ebeced, $fontColor: #444) {
  > span {
    background: $baseColor;
    border-color: $baseColor;
    color: $fontColor;
  }
  &:not(.first) > span::before {
    border-color: $baseColor $baseColor $baseColor transparent;
  }
  &:not(.last) > span::after {
    border-color: transparent transparent transparent $baseColor;
  }
}
ul.nav-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  li {
    margin: 0 13px;
    height: 40px;
    flex-grow: 1;
    @include stt-color();
    &.first {
      margin-left: 0;
    }
    &.last {
      margin-right: 0;
    }
    > span {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:not(.first) > span::before {
      content: '';
      position: absolute;
      top: 0;
      border-width: 20px 0 20px 16px;
      border-style: solid;
      left: -16px;
    }
    &:not(.last) > span::after {
      content: '';
      position: absolute;
      top: calc(50% - 20px);
      border-width: 20px 0 20px 16px;
      border-style: solid;
      right: -16px;
    }
    .index {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      color: #4f7df0;
      background: #ffffff;
      line-height: 20px;
      text-align: center;
      margin-right: 8px;
    }
    &.selected {
      @include stt-color(#4f7df0, #ffffff);
    }
  }
  &.can-click {
    li:not(.selected) {
      cursor: pointer;
    }
  }
}
</style>
