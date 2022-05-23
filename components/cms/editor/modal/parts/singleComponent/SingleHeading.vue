<template>
  <div class="single-heading">
    <div class="input-title">
      <div class="flex flex-between">
        <p class="flex">
          タイトル(HTML利用可能)<TooltipHelp
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
      <CustomInputText
        v-model="component.context"
        maxlength="100"
        :placeholder="component.placeholder"
        :validation="
          $common.getFormItemsDetail(formItems, 'context').validation
        "
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
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'SingleHeading',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      isValidation: false,
      formItems: [
        {
          id: 'context',
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
  },
}
</script>

<style lang="scss" scoped>
.single-heading {
  width: 600px;
  max-height: 760px;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .flex,
    > p {
      margin-bottom: 10px;
    }
  }
}
</style>
