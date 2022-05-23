<template>
  <div class="layouts">
    <div class="select-layout">
      <div class="select-layout-list">
        <label>
          <input
            v-model="component.layoutType"
            type="radio"
            value="1"
            name="selectLayout"
          />
          <span>1：1：1</span>
        </label>
        <div class="layout-example">
          <div class="layout layout-33"></div>
          <div class="layout layout-33"></div>
          <div class="layout layout-33"></div>
        </div>
      </div>
      <div class="select-layout-list">
        <label>
          <input
            v-model="component.layoutType"
            type="radio"
            value="2"
            name="selectLayout"
          />
          <span>2：1：1</span>
        </label>
        <div class="layout-example">
          <div class="layout layout-50"></div>
          <div class="layout layout-25"></div>
          <div class="layout layout-25"></div>
        </div>
      </div>
      <div class="select-layout-list">
        <label>
          <input
            v-model="component.layoutType"
            type="radio"
            value="3"
            name="selectLayout"
          />
          <span>1：2：1</span>
        </label>
        <div class="layout-example">
          <div class="layout layout-25"></div>
          <div class="layout layout-50"></div>
          <div class="layout layout-25"></div>
        </div>
      </div>
      <div class="select-layout-list">
        <label>
          <input
            v-model="component.layoutType"
            type="radio"
            value="4"
            name="selectLayout"
          />
          <span>1：1：2</span>
        </label>
        <div class="layout-example">
          <div class="layout layout-25"></div>
          <div class="layout layout-25"></div>
          <div class="layout layout-50"></div>
        </div>
      </div>
    </div>
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
export default {
  name: 'LayoutThreeColumn',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.layouts {
  .select-layout {
    display: flex;
    justify-content: center;
    &-list {
      &:not(:last-child) {
        margin-right: 40px;
      }
      label {
        cursor: pointer;
        span {
          margin-left: 10px;
        }
      }
      .layout-example {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        width: 133px;
        height: 80px;
        border: 1px solid #e7e7e8;
        background: #f7f8f9;
        .layout {
          height: 56px;
          border: 1px dashed #cccccc;
          background: #ffffff;
          &:not(:last-child) {
            margin-right: 8px;
          }
          &.layout-25 {
            width: 23px;
          }
          &.layout-33 {
            width: 31px;
          }
          &.layout-50 {
            width: 47px;
          }
        }
      }
    }
  }
  .checkSameHeader {
    margin-top: 32px;
  }
  .space-settings {
    margin-top: 32px;
  }
}
</style>
