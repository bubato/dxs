<template>
  <div class="color-picker">
    <div
      class="current-color"
      :style="{ 'background-color': currentColor }"
    ></div>
    <CustomInputText ref="colorPicker" v-model="currentColor" />
    <SearchSVG
      class="btn-color-change icon-search"
      @click="isSelecting = !isSelecting"
    />
    <div v-show="isSelecting" class="color-picker-panel">
      <p>カラーを選択してください。</p>
      <ul class="color-picker-list">
        <li v-for="(color, i) in colorList" :key="i">
          <button
            class="color-picker-item"
            :style="{ 'background-color': color }"
            @click="changeCurrentColor(color)"
          ></button>
        </li>
      </ul>
      <button @click="cancelColorChange">キャンセル</button>
      <button @click="decisionColorChange">決定</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomColorPicker',
  model: {
    prop: 'selectingColor',
  },
  props: {
    defaultColor: {
      type: String,
      default: '',
      required: false,
    },
    selectingColor: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      isSelecting: false,
      currentColor: this.defaultColor,
      colorList: ['#ffcc00', '#34c759', '#4f7df0', '#e60012'],
    }
  },
  computed: {},
  mounted() {
    this.$refs.colorPicker.$el.children[0].children[0].classList.add(
      'is-readonly'
    )
    this.$refs.colorPicker.$el.children[0].children[0].readOnly = true
  },
  methods: {
    changeCurrentColor(color) {
      this.currentColor = color
    },
    cancelColorChange() {
      this.currentColor = this.selectingColor
      this.isSelecting = !this.isSelecting
    },
    decisionColorChange() {
      this.$emit('changColorPicker', this.currentColor)
      this.isSelecting = !this.isSelecting
    },
  },
}
</script>

<style lang="scss" scoped>
.color-picker {
  width: 400px;
  position: relative;
  display: flex;
  align-items: center;
  &-panel {
    position: absolute;
    right: -180px;
    padding: 20px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    background-color: #ffffff;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  &-item {
    margin: 0 10px 0 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
  }
}

.current-color {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin: 0 10px 0 0;
}

.btn {
  &-color-change {
    width: 40px;
    height: 40px;
    margin: 0 0 0 10px;
    cursor: pointer;
  }
}

.custom-input-text /deep/ {
  .is {
    &-readonly {
      font-size: 15px;
      color: #8e8e8e;
    }
  }
}
</style>
