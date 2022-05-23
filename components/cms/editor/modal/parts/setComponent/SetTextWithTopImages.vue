<template>
  <div class="set-text-with-top-images">
    <div class="select-layout">
      <p>レイアウト</p>
      <CustomInputRadio
        v-model="component.layoutType"
        name="selectLayout"
        :options="layoutList"
      />
    </div>
    <div class="input-title">
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
    <div
      v-for="(imageInfo, index) in component.images"
      :key="index"
      class="input-images"
    >
      <div v-if="index > 0" class="heading">
        <p>{{ index + 1 }}番目のブロック</p>
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
          v-model="imageInfo.title"
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
          v-model="imageInfo.text"
          class="textarea"
          placeholder="{テキスト}を入力してください"
          maxlength="500"
          :validation="$common.getFormItemsDetail(formItems, 'text').validation"
          @input="checkValidation()"
        />
      </div>
      <div class="select-image">
        <div class="title">
          <p>画像</p>
          <p class="sub-text">
            アップロード可能なファイルサイズは1MBまで。拡張子は.{{
              imageAllowExts.join('、')
            }}が利用できます。
          </p>
        </div>
        <SelectImageFile
          :image-path="imageInfo.image"
          :image-name="imageInfo.imageName"
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
          :initial-link="imageInfo.link"
          @selectLink="selectLink($event, index)"
        />
      </div>
    </div>
    <AddBlockItem
      class="add-item"
      label="ブロックを追加"
      @addItem="addBlock()"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SetTextWithTopImages',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      isValidation: false,
      layoutList: [
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
      defaultImageInfo: {
        title: '',
        text: '',
        image: '',
        imageName: '',
        link: '',
        linkType: '0',
      },
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      formItems: [
        {
          id: 'heading',
          validation: [
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
  computed: {},
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    addBlock() {
      this.component.images.push(
        JSON.parse(JSON.stringify(this.defaultImageInfo))
      )
      this.checkValidation()
    },
    deleteBlock(index) {
      this.component.images = this.component.images.filter(
        (n, i) => i !== index
      )
      this.checkValidation()
    },
    imageUploaded(imageData, index) {
      this.component.images[index].image = imageData.path
      this.component.images[index].imageName = imageData.fileName
    },
    selectLink(selectLink, index) {
      this.component.images[index].link = selectLink.value
      this.component.images[index].linkType = selectLink.linkType
      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const validationItems = {
        heading: this.component.heading,
        title: this.component.images,
        text: this.component.images,
        link: this.component.images,
      }

      for (const key in validationItems) {
        if (key === 'title') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const value = validationItems[key][i].title
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        } else if (key === 'text') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const value = validationItems[key][i].text
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        } else if (key === 'link') {
          for (let i = 0; i < validationItems[key].length; i++) {
            const targetIndex = this.formItems.findIndex(
              (data) => data.id === 'link'
            )
            if (this.component.images[i].linkType === 1) {
              this.formItems[targetIndex].validation = this.linkValidation
            } else if (this.component.images[i].linkType === 2) {
              this.formItems[targetIndex].validation = this.anchorLinkValidation
            } else if (
              this.component.images[i].linkType === 0 ||
              this.component.images[i].linkType === undefined
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
.set-text-with-top-images {
  width: 640px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .flex,
    .title,
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
  .select-image {
    .title {
      display: flex;
      align-items: center;
      .sub-text {
        font-size: 12px;
        margin-left: 12px;
      }
    }
  }
  .input-images {
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

  .add-item {
    margin-top: 10px;
  }
}
</style>
