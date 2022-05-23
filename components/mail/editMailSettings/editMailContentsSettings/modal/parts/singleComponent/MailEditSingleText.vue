<template>
  <div class="single-text">
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
    <div class="input-text">
      <div class="flex flex-between">
        <p class="flex">
          テキスト<TooltipHelp
            label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
            top="10"
          />
        </p>
        <SelectTextAlign
          :value="component.align"
          type="title"
          @changeAlign="changeAlign($event)"
        />
      </div>
      <CustomInputTextarea
        v-model="component.context"
        class="input-textarea"
        maxlength="500"
        placeholder="テキストを入力してください"
        :validation="$common.getFormItemsDetail(formItems, 'text').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="input-link">
      <p class="flex">
        リンク<TooltipHelp
          label="作成したページから選択できます。外部のページへリンクする場合は「URLを直接入力」を選択してください。"
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
  name: 'MailEditSingleText',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      formItems: [
        {
          id: 'text',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 500,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 500,
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
    ...mapState('mail/editMailSettings', ['textColorList']),
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
  },
}
</script>

<style lang="scss" scoped>
.single-text {
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
  .input-text {
    .input-textarea {
      height: 148px;
    }
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
