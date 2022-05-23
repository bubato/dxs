<template>
  <div class="set-main-area">
    <div class="select-color">
      <p>テキストカラー</p>
      <ColorList
        :color-list="textColors"
        :color-id="component.textColor"
        @input="component.textColor = $event"
      />
    </div>
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
        placeholder="{会社やサービスのコンセプト}を入力してください"
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
        placeholder="{会社やサービスのコンセプト}を補足する説明文を入力してください"
        maxlength="500"
        :validation="$common.getFormItemsDetail(formItems, 'text').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="background-image">
      <p>背景画像(推奨横幅:2000px)</p>
      <SelectImageFile
        :image-path="component.backgroundImage"
        :image-name="component.imageName"
        @uploaded="imageUploaded($event)"
      />
    </div>
    <div class="input-buttons">
      <div
        v-for="(button, index) in component.buttons"
        :key="index"
        class="input-button"
      >
        <div v-if="index > 0" class="heading">
          <p>{{ index + 1 }}番目のボタン</p>
          <DeleteSVG
            v-show="index > 0"
            class="icon icon-delete"
            @click="deleteBtn(index)"
            @mouseover="$common.setAreaLabel($event, 'top', '削除')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
        </div>
        <div class="input-button-text">
          <div class="flex flex-between">
            <p>ボタンの文字</p>
          </div>
          <CustomInputText
            v-model="button.text"
            maxlength="30"
            :validation="
              $common.getFormItemsDetail(formItems, 'buttonText').validation
            "
            @input="checkValidation()"
          />
        </div>
        <div class="input-button-link">
          <p class="title flex">
            ボタンのリンク<TooltipHelp
              label="作成したページから選択できます。外部のページへリンクする場合は「URLを直接入力」を選択してください。"
            />
          </p>
          <CustomInputSelectLink
            :initial-link="button.link"
            @selectLink="selectLink($event, index)"
          />
        </div>
      </div>
    </div>
    <AddBlockItem class="add-item" label="ボタンを追加" @addItem="addBtn()" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'SetMainArea',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      isValidation: false,
      textColors: [
        {
          id: '1',
          color: '#1e1e1e',
        },
        {
          id: '2',
          color: '#696969',
        },
        {
          id: '3',
          color: '#b4b4b4',
        },
        {
          id: '4',
          color: '#ffffff',
        },
      ],
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
        {
          id: 'buttonText',
          validation: [
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
          id: 'buttonLink',
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
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    changeAlign(val) {
      this.component[val.type].align = val.selectVal
    },
    addBtn() {
      this.component.buttons.push({ text: '', link: '', linkType: 0 })
      this.checkValidation()
    },
    deleteBtn(index) {
      this.component.buttons.splice(index, 1)
      this.checkValidation()
    },
    imageUploaded(imageData) {
      this.component.backgroundImage = imageData.path
      this.component.imageName = imageData.fileName
    },
    selectLink(selectLink, index) {
      this.component.buttons[index].link = selectLink.value
      this.component.buttons[index].linkType = selectLink.linkType
      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const validationItems = {
        title: this.component.title.context,
        text: this.component.text.context,
        buttonText: this.component.buttons,
        buttonLink: this.component.buttons,
      }

      for (const key in validationItems) {
        if (key === 'buttonText') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const value = validationItems[key][i].text
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        } else if (key === 'buttonLink') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const targetIndex = this.formItems.findIndex(
              (data) => data.id === 'buttonLink'
            )
            if (this.component.buttons[i].linkType === 1) {
              this.formItems[targetIndex].validation = this.linkValidation
            } else if (this.component.buttons[i].linkType === 2) {
              this.formItems[targetIndex].validation = this.anchorLinkValidation
            } else if (
              this.component.buttons[i].linkType === 0 ||
              this.component.buttons[i].linkType === undefined
            ) {
              this.formItems[targetIndex].validation = []
            }
            const value = validationItems[key][i].link
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        } else {
          const value = validationItems[key]
          if (this.$common.checkExistValidation(this.formItems, key, value)) {
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
.set-main-area {
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
    .textarea {
      ::v-deep .custom-input-textarea-block {
        height: 108px;
      }
    }
  }
  .input-buttons {
    .input-button {
      &:not(:last-child) {
        margin-bottom: 30px;
      }
      .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .input-button-text {
        margin-bottom: 20px;
        .title {
          margin-bottom: 10px;
        }
      }
      .input-button-link {
        .title {
          margin-bottom: 10px;
        }
      }
    }
  }
  .add-item {
    margin-top: 20px;
  }
}
</style>
