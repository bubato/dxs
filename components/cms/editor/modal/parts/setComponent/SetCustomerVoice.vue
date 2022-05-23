<template>
  <div class="set-customer-voice">
    <p class="context">
      アップロード可能なファイルサイズは2MBまで。<br />
      拡張子は.gif、jpg、png、svgが利用できます。
    </p>
    <div class="input-heading">
      <div class="flex flex-between">
        <p class="flex">見出し</p>
        <SelectTextAlign
          :value="component.heading.align"
          type="title"
          @changeAlign="changeAlign($event)"
        />
      </div>
      <CustomInputText
        v-model="component.heading.context"
        placeholder="お客さまから寄せられた声"
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
        name="layoutDirection"
        class="layoutDirection"
        :options="layoutDirectionOptions"
        @input="component.layoutType = '1'"
      />
      <CustomInputRadio
        v-model="component.layoutType"
        name="layoutType"
        class="layoutType"
        :options="
          component.layoutDirection === '1'
            ? layoutHorizonOptions
            : layoutVerticalOptions
        "
      />
    </div>
    <div
      v-for="(data, index) in component.contents"
      :key="index"
      class="input-text-block"
    >
      <div v-if="index > 0" class="heading">
        <p>{{ index + 1 }}番目のお客さまの声</p>
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
      <div class="select-image">
        <div class="flex flex-between">
          <div class="title">
            <p class="sub-title">画像</p>
          </div>
        </div>
        <SelectImageFile
          :image-path="data.image"
          :image-name="data.imageName"
          @uploaded="imageUploaded($event, index)"
        />
      </div>
      <div class="select-link">
        <p class="flex">
          リンク<TooltipHelp
            label="作成したページから選択できます。外部のページへリンクする場合は「URLを直接入力」を選択してください。"
          />
        </p>
        <CustomInputSelectLink
          :initial-link="data.link"
          @selectLink="selectLink($event, index)"
        />
      </div>
    </div>
    <AddBlockItem
      class="add-item"
      label="お客さまの声を追加"
      @addItem="addBlock()"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SetCustomerVoice',
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
      layoutHorizonOptions: [
        {
          value: '1',
          label: '2列',
        },
        {
          value: '2',
          label: '3列',
        },
        {
          value: '3',
          label: '4列',
        },
      ],
      layoutVerticalOptions: [
        {
          value: '1',
          label: '1列',
        },
        {
          value: '2',
          label: '2列',
        },
      ],
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
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
    this.checkValidation() // バリデーションチェック
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    /**
     * 表示位置の変更
     *
     * @param {object} val 選択値
     */
    changeAlign(val) {
      this.component.heading.align = val.selectVal
    },
    /**
     * お客さまの声ブロックの追加
     */
    addBlock() {
      this.component.contents.push({
        title: '',
        text: '',
        image: '',
        imageName: '',
        imageAlign: '1',
        link: '',
      })
    },
    /**
     * お客さまの声ブロックの削除
     *
     * @param {number} index 対象のインデックス
     */
    deleteBlock(index) {
      this.component.contents.splice(index, 1)
      this.checkValidation() // バリデーションチェック
    },
    /**
     * 画像のアップロード
     *
     * @param {object} imageData ファイルデータ
     * @param {number} index 対象のインデックス
     */
    imageUploaded(imageData, index) {
      this.component.contents[index].image = imageData.path
      this.component.contents[index].imageName = imageData.fileName
    },
    /**
     * リンクの設定
     *
     * @param {object} selectLink リンク情報
     * @param {number} index 対象のインデックス
     */
    selectLink(selectLink, index) {
      this.component.contents[index].link = selectLink.value
      this.component.contents[index].linkType = selectLink.linkType
      this.checkValidation() // バリデーションチェック
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
          this.component.heading.context
        )
      ) {
        result = true
      }

      for (let i = 0; i < contents.length; i++) {
        for (const key in contents[i]) {
          if (key === 'link') {
            const targetIndex = this.formItems.findIndex(
              (data) => data.id === 'link'
            )

            if (contents[i].linkType === 1) {
              this.formItems[targetIndex].validation = this.linkValidation
            } else if (contents[i].linkType === 2) {
              this.formItems[targetIndex].validation = this.anchorLinkValidation
            } else {
              this.formItems[targetIndex].validation = []
            }
          }

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
.set-customer-voice {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  .context {
    text-align: center;
    margin-top: 8px;
  }
  > div {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
    .flex,
    > p {
      margin-bottom: 10px;
    }
  }
  .input-heading {
    margin-top: 24px;
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
  .select-layout {
    .layoutType {
      margin-top: 8px;
    }
  }
}
</style>
