<template>
  <div class="set-message">
    <div class="input-title">
      <div class="flex flex-between">
        <p class="flex">
          タイトル(HTML利用可能)<TooltipHelp
            label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
            top="10"
          />
        </p>
        <SelectTextAlign
          :value="component.title.align"
          type="title"
          @changeAlign="changeAlign($event)"
        />
      </div>
      <CustomInputText
        v-model="component.title.context"
        placeholder="{顧客へ伝えたいメッセージ}を入力してください"
        maxlength="100"
        :validation="$common.getFormItemsDetail(formItems, 'title').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="input-text">
      <div class="flex flex-between">
        <p class="flex">
          テキスト(HTML利用可能)<TooltipHelp
            label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
          />
        </p>
        <SelectTextAlign
          :value="component.text.align"
          type="text"
          @changeAlign="changeAlign($event)"
        />
      </div>
      <CustomInputTextarea
        v-model="component.text.context"
        class="textarea"
        placeholder="{顧客へ伝えたいメッセージ}を補足する説明文を入力してください"
        maxlength="500"
        :validation="$common.getFormItemsDetail(formItems, 'text').validation"
        @input="checkValidation()"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SetMessage',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      formItems: [
        {
          id: 'title',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
          ],
        },
        {
          id: 'text',
          validation: [
            {
              type: 'maxlength',
              maxlength: 500,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 500,
              }),
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    updateValue(e) {
      const inputVal = e.target.value

      this.$emit('input', inputVal)
    },
    changeAlign(val) {
      this.component[val.type].align = val.selectVal
    },
    additem() {
      this.component.buttons.push({ text: '', link: '' })
    },
    uploaded(val) {
      this.component.backgroundImage = val.fileImgPath
    },
    deleted() {
      this.component.backgroundImage = ''
    },
    deleteBtn(index) {
      this.component.buttons = this.component.buttons.filter(
        (n, i) => i !== index
      )
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const validationItems = {
        title: this.component.title.context,
        text: this.component.text.context,
      }

      for (const key in validationItems) {
        if (
          this.$common.checkExistValidation(
            this.formItems,
            key,
            validationItems[key]
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
.set-message {
  width: 600px;
  max-height: 760px;
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .flex,
    > p {
      margin-bottom: 10px;
    }
  }
  .input-text {
    ::v-deep .custom-input-textarea-block {
      height: 108px;
    }
  }
}
</style>
