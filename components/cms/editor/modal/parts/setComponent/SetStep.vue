<template>
  <div class="set-step">
    <div class="input-heading">
      <p>見出し</p>
      <CustomInputText
        v-model="component.heading"
        placeholder="{パーツの見出し}を入力してください"
        maxlength="100"
        :validation="
          $common.getFormItemsDetail(formItems, 'heading').validation
        "
        @input="checkValidation()"
      />
    </div>
    <div class="select-layout">
      <p>レイアウト</p>
      <CustomInputRadio
        v-model="component.layoutDirection"
        name="selectLayout"
        layout-type="vertical"
        :options="layoutDirectionOptions"
      />
    </div>
    <div
      v-for="(data, index) in component.contents"
      :key="index"
      class="input-text-block"
    >
      <div v-if="index > 0" class="heading">
        <p>{{ index + 1 }}番目のステップ</p>
        <DeleteSVG
          v-show="index > 0"
          class="icon icon-delete"
          @click="deleteBlock(index)"
          @mouseover="$common.setAreaLabel($event, 'top', '削除')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        />
      </div>
      <div class="input-title">
        <div class="flex flex-between">
          <p class="flex">
            タイトル(HTML利用可能)<TooltipHelp
              label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
            />
          </p>
        </div>
        <CustomInputText
          v-model="data.title"
          placeholder="{タイトル}を入力してください"
          maxlength="100"
          :validation="
            $common.getFormItemsDetail(formItems, 'title').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="input-text">
        <p class="flex">
          テキスト(HTML利用可能)<TooltipHelp
            label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
          />
        </p>
        <CustomInputTextarea
          v-model="data.text"
          class="textarea"
          placeholder="{テキスト}を入力してください"
          maxlength="500"
          :validation="$common.getFormItemsDetail(formItems, 'text').validation"
          @input="checkValidation()"
        />
      </div>
    </div>
    <AddBlockItem
      class="add-item"
      label="ステップを追加"
      @addItem="addBlock()"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SetStep',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      layoutDirectionOptions: [
        {
          value: '1',
          label: '横並び',
        },
        {
          value: '2',
          label: '縦並び',
        },
      ],
      formItems: [
        {
          id: 'heading',
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
    addBlock() {
      this.component.contents.push({
        title: '',
        text: '',
      })
    },
    deleteBlock(index) {
      this.component.contents.splice(index, 1)
      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const contents = JSON.parse(JSON.stringify(this.component.contents))

      if (
        this.$common.checkExistValidation(
          this.formItems,
          'heading',
          this.component.heading
        )
      ) {
        result = true
      }

      for (let i = 0; i < contents.length; i++) {
        for (const key in contents[i]) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              contents[i][key]
            )
          ) {
            result = true
            break
          }
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
.set-step {
  width: 600px;
  max-height: calc(100vh - 240px);
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
  .input-text-block {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    > div {
      &:not(.heading):not(:last-child) {
        margin-bottom: 20px;
      }
      .flex,
      > p {
        margin-bottom: 10px;
      }
    }
    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
}
</style>
