<template>
  <div
    class="pseudo-select-box"
    :class="{ community: this.$route.path.includes('community') }"
  >
    <div
      v-on-clickaway="away"
      class="select"
      :class="{ focus: open }"
      @click="openMenu"
    >
      <component :is="selectingOption().icon" class="icon-menu" />
      <span>{{ selectingOption().label }} </span>
      <ExpandMoreSVG v-show="!open" class="icon-arrow icon-expandMore" />
      <ExpandLessSVG v-show="open" class="icon-arrow icon-expandLess" />
    </div>
    <div v-show="open" class="option">
      <ul>
        <li
          v-for="(list, i) in options"
          :key="i"
          class="label"
          @click="selectOption(i)"
        >
          <component :is="list.icon" class="icon-menu" />
          <span>{{ list.label }} </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'PseudoSelectBox',
  mixins: [clickaway],
  props: {
    value: { type: String, required: true, default: '' },
    /**
     * 表示するメニュー
     */
    options: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    selectingOption() {
      return () => {
        let resultOption = {}

        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].code === this.value) {
            resultOption = this.options[i]
            break
          }
        }

        return resultOption
      }
    },
  },
  created() {
    this.$emit('input', this.value)
  },
  mounted() {},
  methods: {
    openMenu() {
      this.open = !this.open
    },
    away() {
      this.open = false
    },
    selectOption(index) {
      this.$emit('input', this.options[index].code)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.select {
  position: relative;
  min-width: 140px;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  color: #1e1e1e;
  font-size: 13px;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: default;
}

.option {
  .community & {
    @include spContentWidth();
  }
  position: absolute;
  min-width: 140px;
  font-size: 13px;
  box-shadow: 0px 0px 3px 1px #8d8d8d;
  border: 1px solid #767676;
  cursor: default;
  background: #f7f8f9;
  z-index: 9999;
  ul {
    width: 100%;
  }
  li {
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 12px;
    &:hover {
      color: #ffffff;
      background-color: #1e90ff;
      .icon-menu {
        fill: #ffffff;
      }
    }
    &:not(:last-of-type) {
      margin: 0 0 5px 0;
    }
  }
}

.focus {
  box-shadow: 0px 0px 3px 1px #007aff;
  border: 1px solid #007aff;
}

.icon {
  &-arrow {
    position: absolute;
    right: 6px;
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
  &-menu {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}
</style>
