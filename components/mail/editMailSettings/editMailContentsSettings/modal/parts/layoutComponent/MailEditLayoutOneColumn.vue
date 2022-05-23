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
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MailEditLayoutFourColumn',
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
      width: 440px;
      li {
        cursor: pointer;
        &:not(:nth-of-type(8n)) {
          margin-right: 8px;
        }
        &:nth-child(n + 9) {
          margin-top: 8px;
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
}
</style>
