<template>
  <div class="single-image">
    <p class="sub-text">
      アップロード可能なファイルサイズは1MBまで。拡張子は.{{
        imageAllowExts.join('、')
      }}が利用できます。
    </p>
    <div class="input-image">
      <p>画像</p>
      <SelectImageFile
        :image-path="component.image"
        :image-name="component.imageName"
        @uploaded="imageUploaded($event)"
      />
    </div>
    <div v-if="component.image" class="input-detail-area">
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
      <div class="input-alternate-text">
        <p>代替テキスト</p>
        <CustomInputText
          v-model="component.alternateText"
          maxlength="100"
          placeholder="画像の説明を入力してください"
          :validation="
            $common.getFormItemsDetail(formItems, 'alternateText').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="input-style">
        <div class="input-width">
          <p>横幅</p>
          <CustomInputText
            v-model="component.width"
            class="custom-text"
            maxlength="4"
            placeholder="入力例：200"
            :validation="
              $common.getFormItemsDetail(formItems, 'width').validation
            "
            @input="checkValidation()"
          /><span>px</span>
        </div>
        <div class="input-height">
          <p>縦幅</p>
          <CustomInputText
            v-model="component.height"
            class="custom-text"
            maxlength="4"
            placeholder="入力例：150"
            :validation="
              $common.getFormItemsDetail(formItems, 'height').validation
            "
            @input="checkValidation()"
          /><span>px</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MailEditSingleImage',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      formItems: [
        {
          id: 'alternateText',
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
    /**
     * 表示位置の変更
     *
     * @param {string} val 表示位置の値
     */
    changeAlign(val) {
      this.component.align = val.selectVal
    },
    /**
     * 画像アップロード処理
     *
     * @param {Object} imageData アップロード画像情報
     */
    imageUploaded(imageData) {
      this.component.image = imageData.path
      this.component.imageName = imageData.fileName

      const image = new Image()

      image.onload = () => {
        this.component.width = String(image.naturalWidth)
        this.component.height = String(image.naturalHeight)
      }

      image.src = this.component.image
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
.single-image {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  .sub-text {
    font-size: 12px;
    margin: 8px 0 20px 0;
  }
  .input-image {
    > * {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
  .input-detail-area {
    margin-top: 8px;
    > div {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .flex,
      > p {
        margin-bottom: 8px;
      }
    }
    .input-style {
      display: flex;
      .input-width,
      .input-height {
        display: flex;
        align-items: center;
        p {
          margin-right: 8px;
          white-space: nowrap;
        }
        .custom-text {
          width: 150px;
        }
        span {
          margin-left: 8px;
          white-space: nowrap;
        }
      }
      .input-width {
        margin-right: 30px;
      }
    }
  }
}
</style>
