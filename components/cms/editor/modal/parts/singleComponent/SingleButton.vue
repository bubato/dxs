<template>
  <div class="single-button">
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
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SingleButton',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      isValidation: false,
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
  computed: {},
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    changeAlign(val) {
      this.component.align = val.selectVal
    },
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
      margin-bottom: 10px;
    }
  }
  .input-style {
    display: flex;
    .input-width,
    .input-height {
      p {
        margin-bottom: 10px;
      }
      .custom-text {
        width: 150px;
      }
      span {
        margin-left: 10px;
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
