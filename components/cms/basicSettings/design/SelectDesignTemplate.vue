<template>
  <div class="selectDesignTemplate">
    <div
      v-if="defaultSelectTemplateId && defaultSelectTemplateId.length === 3"
      class="selectTemplate"
    >
      <h4 class="heading">
        <CheckCircleSVG class="icon-checkCircle icon" /><span
          >現在選択中のデザイン</span
        >
      </h4>
      <div class="image-area">
        <div class="left-contents">
          <div class="template-info">
            <div class="left-contents">
              <p class="style">{{ getSelectTemplateInfo('styleName') }}</p>
              <p class="industry">
                {{ getSelectTemplateInfo('industryName') }}
              </p>
            </div>
            <div class="right-contents">
              <div
                class="select-color"
                :style="{
                  'background-color': getColorCode(
                    getSelectTemplateInfo('colorId')
                  ),
                }"
              ></div>
            </div>
          </div>
        </div>
        <div class="right-contents">
          <div class="image">
            <img :src="$common.getAssetsImgUrl(getSelectTemplateImage())" />
          </div>
        </div>
      </div>
    </div>
    <div class="form-block">
      <div class="check-filter">
        <div class="form-item">
          <p class="form-title">スタイル</p>
          <CustomInputCheckbox
            v-model="selectStyle"
            name="selectStyle"
            layout-type="vertical"
            :options="styleOptions"
          />
        </div>
        <div class="form-item">
          <p class="form-title">業種</p>
          <CustomInputCheckbox
            v-model="selectIndustry"
            name="selectIndustry"
            class="selectIndustry"
            layout-type="vertical"
            :options="getSelectIndustryOptions()"
          />
        </div>
      </div>
      <ul class="image-list">
        <li
          v-for="(data, index) in getFilterTemplateImageList()"
          :key="index"
          :class="{
            'width-setup': widthType === 0,
            'width-settings': widthType === 1,
            selected: checkSelectTemplateImage(data.templateImageId),
          }"
        >
          <div class="image">
            <img
              :src="
                $common.getAssetsImgUrl(
                  `images/cms/basicSettings/${data.styleId}_${data.industryId}.png`
                )
              "
            />
            <div class="select-image">
              <CheckCircleSVG class="icon-checkCircle icon" />
            </div>
          </div>
          <div class="image-context">
            <div class="template-info">
              <div class="left-contents">
                <p class="style">{{ data.styleName }}</p>
                <p class="industry">{{ data.industryName }}</p>
              </div>
              <div class="right-contents">
                <div
                  class="select-color"
                  :style="{ 'background-color': getColorCode(data.colorId) }"
                ></div>
              </div>
            </div>
            <div class="buttons">
              <button
                v-if="!checkSelectTemplateImage(data.templateImageId)"
                class="btn btn-basic btn-short"
                @click="selectImageTemplate(data.templateImageId, data.colorId)"
              >
                選択
              </button>
              <button
                v-if="checkSelectTemplateImage(data.templateImageId)"
                class="btn btn-cancel btn-short"
                @click="unselectImageTemplate()"
              >
                選択を解除
              </button>
              <button
                class="btn btn-secondary btn-short"
                @click="previewImageTemplate(data.templateImageId)"
              >
                プレビュー
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <PreviewSiteImageTemplateModal
      v-if="showPreviewSiteImageTemplateModalState"
      :init-color="getSelectTemplateColor()"
      :select-preview-image-template-id="selectPreviewImageTemplateId"
      @select="reflectTemplateInfo($event)"
      @close="hidePreviewSiteImageTemplateModal()"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SelectDesignTemplate',
  components: {},
  props: {
    defaultSelectTemplateId: {
      type: String,
      default: '',
      required: true,
    },
    selectTemplateId: {
      type: String,
      default: '',
      required: true,
    },
    templateImageList: {
      type: Array,
      default: () => [],
      required: true,
    },
    widthType: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      selectStyle: [],
      selectIndustry: [],
      defaultSelectTemplateInfo: {},
      showPreviewSiteImageTemplateModalState: false,
      selectPreviewImageTemplateId: '',
      styleOptions: [
        {
          value: 'simple',
          label: 'シンプル',
        },
        {
          value: 'stylish',
          label: 'スタイリッシュ',
        },
        {
          value: 'friendly',
          label: 'フレンドリー',
        },
      ],
    }
  },
  computed: {
    /**
     * 業種一覧の値の取得
     *
     * @return {object[]} 業種一覧の値
     */
    getSelectIndustryOptions() {
      return () => {
        const industryOptions = this.$common.getVersatileOptions(1, 'value')

        return industryOptions.filter((data) => data.value !== '13')
      }
    },
    /**
     * イメージテンプレートの選択チェック
     *
     * @param {number} templateImageId 選択したイメージテンプレートID
     * @return {boolean} true:選択中 false:非選択
     */
    checkSelectTemplateImage() {
      return (templateImageId) => {
        return this.selectTemplateId === templateImageId
      }
    },
    /**
     * 画面に表示するイメージテンプレートリストの取得
     *
     * @return {object[]} 画面に表示するイメージテンプレートリスト
     */
    getFilterTemplateImageList() {
      return () => {
        let filterTemplateImageList = []

        if (this.selectStyle.length === 0 && this.selectIndustry.length === 0) {
          filterTemplateImageList = this.templateImageList
        } else if (this.selectStyle.length === 0) {
          filterTemplateImageList = this.templateImageList.filter((data) => {
            let result = false
            const industryId = data.industryId

            if (this.selectIndustry.includes(industryId)) {
              result = true
            }

            return result
          })
        } else if (this.selectIndustry.length === 0) {
          filterTemplateImageList = this.templateImageList.filter((data) => {
            let result = false
            const styleId = data.styleId

            if (this.selectStyle.includes(styleId)) {
              result = true
            }

            return result
          })
        } else {
          filterTemplateImageList = this.templateImageList.filter((data) => {
            let result = false
            const styleId = data.styleId
            const industryId = data.industryId

            if (
              this.selectStyle.includes(styleId) &&
              this.selectIndustry.includes(industryId)
            ) {
              result = true
            }

            return result
          })
        }

        return filterTemplateImageList
      }
    },
    /**
     * 選択したテンプレートのカラーの取得
     *
     * @return {string} 選択したテンプレートのカラー
     */
    getSelectTemplateColor() {
      return () => {
        let selectTemplateColor = ''
        const selectTemplate = this.templateImageList.find(
          (data) => data.templateImageId === this.selectPreviewImageTemplateId
        )

        if (selectTemplate) {
          selectTemplateColor = selectTemplate.colorId
        }

        return selectTemplateColor
      }
    },
    /**
     * 選択中のテンプレートイメージのパスの取得
     *
     * @return {string} 選択中のテンプレートイメージのパス
     */
    getSelectTemplateImage() {
      return () => {
        const selectTemplate = this.templateImageList.find(
          (data) => data.templateImageId === this.defaultSelectTemplateId
        )
        const imagePath = `images/cms/basicSettings/${selectTemplate.styleId}_${selectTemplate.industryId}.png`

        return imagePath
      }
    },
    /**
     * カラーIDに紐づくカラーコードを取得
     *
     * @param {string} colorId カラーID
     * @return {return} カラーコード
     */
    getColorCode() {
      return (colorId) => {
        const colorCode = this.$common
          .getVersatileOptions(27)
          .find((data) => data.code === colorId).label

        return colorCode
      }
    },
    /**
     * 選択したテンプレートに紐づくkey情報の取得
     *
     * @param {string} key 取得対象のkey
     * @return {string} 選択したテンプレートに紐づくkey情報
     */
    getSelectTemplateInfo() {
      return (key) => {
        const selectTemplate = this.templateImageList.find(
          (data) => data.templateImageId === this.defaultSelectTemplateId
        )

        return selectTemplate[key]
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * イメージテンプレートの選択
     *
     * @param {string} templateImageId 選択したイメージテンプレートID
     * @param {string} colorId 選択したカラーID
     */
    selectImageTemplate(templateImageId, colorId) {
      const selectTemplateData = {
        templateImageId,
        colorId,
      }

      this.$emit('update', selectTemplateData)
    },
    /**
     * イメージテンプレートの選択解除
     */
    unselectImageTemplate() {
      const selectTemplateData = {
        templateImageId: '',
        colorId: '',
      }

      this.$emit('update', selectTemplateData)
    },
    /**
     * プレビュー画面で選択したテンプレート情報の反映
     *
     * @param {string} colorId 選択したカラーID
     */
    reflectTemplateInfo(colorId) {
      const findIndex = this.templateImageList.findIndex(
        (data) => data.templateImageId === this.selectPreviewImageTemplateId
      )

      if (findIndex >= 0) {
        this.templateImageList[findIndex].colorId = colorId
      }

      this.selectImageTemplate(this.selectPreviewImageTemplateId, colorId) // イメージテンプレートの選択
    },
    /**
     * イメージテンプレートのプレビュー
     *
     * @param {string} templateImageId 選択したイメージテンプレートID
     */
    previewImageTemplate(templateImageId) {
      this.selectPreviewImageTemplateId = templateImageId
      this.showPreviewSiteImageTemplateModalState = true
    },
    /**
     * デザインテンプレートプレビューモーダルの非表示
     */
    hidePreviewSiteImageTemplateModal() {
      this.showPreviewSiteImageTemplateModalState = false
    },
  },
}
</script>

<style lang="scss" scoped>
.selectDesignTemplate {
  padding: 32px 0 48px 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  .selectTemplate {
    background: #f0fff4;
    margin-bottom: 48px;
    padding: 24px;
    .heading {
      display: flex;
      align-items: center;
      .icon-checkCircle {
        fill: #34c759;
      }
      span {
        margin-left: 8px;
      }
    }
    .image-area {
      display: flex;
      width: 100%;
      margin-top: 24px;
      padding: 24px;
      background: #ffffff;
      .left-contents {
        width: 251px;
      }
      .image {
        margin-left: 40px;
        width: 320px;
        img {
          width: 100%;
        }
      }
    }
  }
  .form-block {
    display: flex;
    align-items: flex-start;
    .check-filter {
      width: 197px;
      min-width: 197px;
    }
    .image-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: -16px;
      margin-left: 40px;
      li {
        margin-right: 16px;
        border: 1px solid #e5e5e5;
        margin: 16px 16px 0 0;
        position: relative;
        &.width-setup {
          width: 222px;
          height: 300px;
          &:nth-child(-n + 3) {
            margin-top: 0;
          }
          &:nth-of-type(3n) {
            margin-right: 0;
          }
          .image {
            height: 148px;
          }
          .btn {
            min-width: 91px;
          }
        }
        &.width-settings {
          width: 255px;
          height: 322px;
          .image {
            height: 170px;
          }
          .btn {
            min-width: 108px;
          }
        }
        &.selected {
          .image {
            position: relative;
            .select-image {
              position: absolute;
              top: 0;
              width: 100%;
              height: 100%;
              background: #1e1e1e80 0% 0% no-repeat padding-box;
              .icon {
                display: block;
              }
            }
          }
        }
        .image {
          width: 100%;
          position: relative;
          img {
            width: 100%;
          }
          .icon {
            display: none;
            position: absolute;
            fill: #ffffff;
            width: 37.5px;
            height: 37.5px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .image-context {
          height: 152px;
          padding: 16px;
          border-top: 1px solid #e5e5e5;
          position: relative;
          .industry {
            width: 148px;
            margin-top: 4px;
          }
        }
        .buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 16px;
          .btn {
            &:not(:last-child) {
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
  .template-info {
    display: flex;
    justify-content: space-between;
    .select-color {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }
  }
  .form-item {
    &:not(:first-child) {
      margin-top: 48px;
    }
    .form-title {
      font-weight: 500;
      margin-bottom: 12px;
      &.main-text {
        margin-bottom: 0;
      }
    }
    ::v-deep .selectIndustry label {
      margin-bottom: 16px;
    }
  }
}
</style>
