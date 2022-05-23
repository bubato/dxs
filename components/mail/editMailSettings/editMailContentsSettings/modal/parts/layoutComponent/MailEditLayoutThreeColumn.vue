<template>
  <div class="layouts">
    <div class="select-background-color">
      <p class="title">背景色</p>
      <ul class="select-color-list">
        <li
          v-for="colorCode in backgroundColorList"
          :key="colorCode"
          @click="component.backgroundColor = colorCode"
        >
          <label
            :style="{ 'background-color': colorCode }"
            class="color"
            :class="{
              selected: component.backgroundColor === colorCode,
            }"
          >
            <input
              v-model="component.backgroundColor"
              type="radio"
              :value="colorCode"
            />
            <CheckSVG
              v-if="component.backgroundColor === colorCode"
              class="icon icon-check"
              :class="{
                'icon-color-black': component.backgroundColor === '#ffffff',
              }"
            />
          </label>
        </li>
      </ul>
    </div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MailEditLayoutThreeColumn',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('mail/editMailSettings', ['backgroundColorList']),
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.layouts {
  .select-background-color {
    .select-color-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 12px;
      width: 552px;
      li {
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 8px;
        }
        label {
          display: block;
          width: 48px;
          height: 48px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          position: relative;
          &.selected {
            border: 1px solid #007aff;
            box-shadow: 0px 0px 4px #007affb8;
            border-radius: 8px;
          }
          .icon {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            fill: #ffffff;
            &.icon-color-black {
              fill: #1e1e1e;
            }
          }
          input {
            display: none;
          }
        }
      }
    }
  }
  .select-layout {
    display: flex;
    justify-content: center;
    margin-top: 32px;
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
