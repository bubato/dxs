<template>
  <div class="set-one-line-news">
    <div class="input-date">
      <p>日付</p>
      <CustomDatePicker
        v-model="component.date"
        class="date_picker"
        maxlength="10"
        :validation="$common.getFormItemsDetail(formItems, 'date').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="input-title">
      <p>タイトル</p>
      <CustomInputText
        v-model="component.title"
        placeholder="{お知らせタイトルなど}を入力してください"
        maxlength="100"
        :validation="$common.getFormItemsDetail(formItems, 'title').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="input-label">
      <p>ラベル</p>
      <CustomInputText
        v-model="component.label"
        placeholder="入力例：お知らせ"
        maxlength="10"
        :validation="$common.getFormItemsDetail(formItems, 'label').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="select-link">
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
import { mapMutations } from 'vuex'

export default {
  name: 'SetOneLineNews',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      isValidation: false,
      formItems: [
        {
          id: 'date',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 10,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 10,
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
          id: 'label',
          validation: [
            {
              type: 'maxlength',
              maxlength: 10,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 10,
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
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
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
.set-one-line-news {
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
}
</style>
