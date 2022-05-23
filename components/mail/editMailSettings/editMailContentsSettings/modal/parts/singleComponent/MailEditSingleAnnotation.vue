<template>
  <div class="single-annotation">
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
    <div class="select-symbol">
      <p>記号</p>
      <CustomInputSelect
        v-model="component.symbolType"
        class="custom-select"
        :options="symbolList"
      />
    </div>
    <ul class="input-annotation-list">
      <li v-for="(annotation, index) in component.annotationList" :key="index">
        <div class="input-text">
          <div class="flex flex-between">
            <h5 v-if="index > 0">{{ index + 1 }}番目の注釈</h5>
            <DeleteSVG
              v-if="index > 0"
              class="icon icon-delete"
              @click="deleteBlock(index)"
              @mouseover="$common.setAreaLabel($event, 'top', '削除')"
              @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')"
            />
          </div>
          <div class="flex flex-between">
            <p class="flex">
              テキスト(HTML利用可能)<TooltipHelp
                label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
              />
            </p>
          </div>
          <CustomInputText
            v-model="annotation.text"
            maxlength="500"
            placeholder="注釈を入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'text').validation
            "
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
            :initial-link="annotation.link"
            @selectLink="selectLink($event, index)"
          />
        </div>
      </li>
    </ul>
    <AddBlockItem class="add-item" label="注釈を追加" @addItem="addBlock()" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MailEditSingleAnnotation',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      symbolList: [
        {
          code: '1',
          label: '※',
        },
        {
          code: '2',
          label: '・',
        },
        {
          code: '3',
          label: '数字連番',
        },
        {
          code: '4',
          label: '※付き数字連番',
        },
      ],
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
     * リンクの変更
     *
     * @param {Object} selectLink リンク情報
     * @param {number} index 設定対象のインデックス
     */
    selectLink(selectLink, index) {
      this.component.annotationList[index].link = selectLink.value
      this.component.annotationList[index].linkType = selectLink.linkType
      this.checkValidation()
    },
    /**
     * 入力ブロックの追加
     */
    addBlock() {
      this.component.annotationList.push({ text: '', link: '', linkType: 0 })
      this.checkValidation()
    },
    /**
     * 入力ブロックの削除
     *
     * @param {number} index 削除対象のインデックス
     */
    deleteBlock(index) {
      this.component.annotationList.splice(index, 1)
      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const componentList = JSON.parse(
        JSON.stringify(this.component.annotationList)
      )
      for (let i = 0; i < componentList.length; i++) {
        for (const key in componentList[i]) {
          if (key === 'link') {
            const targetIndex = this.formItems.findIndex(
              (data) => data.id === 'link'
            )
            if (this.component.annotationList[i].linkType === 1) {
              this.formItems[targetIndex].validation = this.linkValidation
            } else if (this.component.annotationList[i].linkType === 2) {
              this.formItems[targetIndex].validation = this.anchorLinkValidation
            } else if (
              this.component.annotationList[i].linkType === 0 ||
              this.component.annotationList[i].linkType === undefined
            ) {
              this.formItems[targetIndex].validation = []
            }
          }
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              componentList[i][key]
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
.single-annotation {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
    .flex,
    > p {
      margin-bottom: 8px;
    }
  }
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
  .select-symbol {
    .custom-select {
      width: 180px;
    }
  }
  .input-annotation-list {
    li {
      &:not(:first-child) {
        margin-top: 32px;
        padding: 24px;
        border: 1px dashed #e5e5e5;
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
  }
  .add-item {
    margin-top: 32px;
  }
}
</style>
