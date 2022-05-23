<template>
  <div class="single-button">
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
    <div class="select-text-color">
      <p class="title">テキストカラー</p>
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
    <div class="input-kind">
      <p>表示スタイル</p>
      <CustomInputSelect
        v-model="component.kind"
        :options="buttonKinds"
        @input="changeKind"
      />
    </div>
    <div class="input-style">
      <div class="input-width">
        <p>横幅</p>
        <div class="flex">
          <CustomInputText
            v-model="component.width"
            class="custom-text"
            maxlength="4"
            :validation="
              $common.getFormItemsDetail(formItems, 'width').validation
            "
            @input="checkValidation()"
          /><span>px</span>
        </div>
      </div>
      <div class="input-height">
        <p>縦幅</p>
        <div class="flex">
          <CustomInputText
            v-model="component.height"
            class="custom-text"
            maxlength="4"
            :validation="
              $common.getFormItemsDetail(formItems, 'height').validation
            "
            @input="checkValidation()"
          /><span>px</span>
        </div>
      </div>
    </div>
    <div class="select-align">
      <div class="flex flex-between">
        <p>表示位置</p>
        <SelectTextAlign
          :value="component.align"
          type="title"
          @changeAlign="changeAlign($event)"
        />
      </div>
    </div>
    <div class="input-text">
      <p>ボタンテキスト</p>
      <CustomInputText
        v-model="component.text"
        maxlength="30"
        :validation="$common.getFormItemsDetail(formItems, 'text').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="select-link">
      <p class="flex">
        ボタンのリンク<TooltipHelp
          label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
        />
      </p>
      <CustomInputSelectLink
        :initial-link="component.link"
        @selectLink="selectLink($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MailEditSingleButton',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      buttonKinds: [
        {
          code: '1',
          label: '強調',
        },
        {
          code: '2',
          label: '標準',
        },
        {
          code: '3',
          label: 'シンプル',
        },
      ],
      formItems: [
        {
          id: 'width',
          validation: [
            {
              type: 'maxlength',
              maxlength: 4,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 4,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'height',
          validation: [
            {
              type: 'maxlength',
              maxlength: 4,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 4,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'text',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 30,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 30,
              }),
            },
          ],
        },
        {
          id: 'link',
          validation: [],
        },
      ],
      linkValidation: [
        {
          type: 'maxlength',
          maxlength: 2000,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 2000,
          }),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.domain,
          message: this.$common.getMasterMessage('ErrorMsg_Url02'),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.protocol,
          message: this.$common.getMasterMessage('ErrorMsg_Url03'),
        },
      ],
      anchorLinkValidation: [
        {
          type: 'maxlength',
          maxlength: 100,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 100,
          }),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.anchor,
          message: this.$common.getMasterMessage('ErrorMsg_Url07'),
        },
      ],
    }
  },
  computed: {
    ...mapState('mail/editMailSettings', [
      'backgroundColorList',
      'textColorList',
    ]),
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    /**
     * 表示位置の変更
     *
     * @param {string} val 表示位置の値
     */
    changeAlign(val) {
      this.component.align = val.selectVal
    },
    /**
     * リンクの変更
     *
     * @param {Object} selectLink リンク情報
     */
    selectLink(selectLink) {
      this.component.link = selectLink.value
      this.component.linkType = selectLink.linkType
      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false

      for (const key in this.component) {
        if (key === 'link') {
          const targetIndex = this.formItems.findIndex(
            (data) => data.id === 'link'
          )

          if (this.component.linkType === 1) {
            this.formItems[targetIndex].validation = this.linkValidation
          } else if (this.component.linkType === 2) {
            this.formItems[targetIndex].validation = this.anchorLinkValidation
          } else if (this.component.linkType === 0) {
            this.formItems[targetIndex].validation = []
          }
        }
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
    /**
     * 表示スタイルの変更
     */
    changeKind() {
      switch (this.component.kind) {
        case '1':
          this.component.width = '248'
          this.component.height = '64'
          break
        case '2':
          this.component.width = '224'
          this.component.height = '56'
          break
        case '3':
          this.component.width = '200'
          this.component.height = '47'
          break
        default:
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.single-button {
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .flex,
    > p {
      margin-bottom: 8px;
    }
  }
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
  .input-style {
    display: flex;
    .input-width,
    .input-height {
      p {
        margin-bottom: 8px;
      }
      .custom-text {
        width: 150px;
      }
      span {
        margin-left: 8px;
      }
    }
    .input-width {
      margin-right: 30px;
    }
  }
  .space-settings {
    margin-top: 32px;
  }
}
</style>
