<template>
  <div class="single-separator">
    <div class="select-text-color">
      <p class="title">線の色</p>
      <ul class="select-color-list">
        <li
          v-for="colorCode in textColorList"
          :key="colorCode"
          @click="component.color = colorCode"
        >
          <label
            :style="{ 'background-color': colorCode }"
            class="color"
            :class="{
              selected: component.color === colorCode,
            }"
          >
            <input v-model="component.color" type="radio" :value="colorCode" />
            <CheckSVG
              v-if="component.color === colorCode"
              class="icon icon-check"
              :class="{
                'icon-color-black': component.color === '#ffffff',
              }"
            />
          </label>
        </li>
      </ul>
    </div>
    <div class="input-height">
      <p class="title">高さ</p>
      <CustomInputSelect
        v-model="component.selectHeight"
        class="select-height"
        :options="heightKinds"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MailEditSingleSeparator',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      formItems: [],
      heightKinds: [
        {
          code: '1',
          label: '1',
        },
        {
          code: '2',
          label: '2',
        },
        {
          code: '3',
          label: '3',
        },
        {
          code: '4',
          label: '4',
        },
        {
          code: '5',
          label: '5',
        },
      ],
    }
  },
  computed: {
    ...mapState('mail/editMailSettings', ['textColorList']),
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false

      for (const key in this.component) {
        if (
          this.$common.checkExistValidation(
            this.formItems,
            key,
            this.component[key]
          )
        ) {
          result = true
          break
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
.single-separator {
  width: 600px;
  max-height: 760px;
  .select-text-color {
    .select-color-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 12px;
      width: 440px;
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
  .select-height {
    width: 120px;
  }
  > div {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
    .flex,
    > p {
      margin-bottom: 8px;
    }
  }
}
</style>
