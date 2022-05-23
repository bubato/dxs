<template>
  <div class="basic-settings">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2>デザイン</h2>
        <p class="header-sub">Webサイトのデザインを変更できます。</p>
      </div>
      <SelectDesignTemplate
        v-if="templateImageList.length > 0"
        :default-select-template-id="defaultSelectTemplateId"
        :select-template-id="selectTemplateId"
        :template-image-list="templateImageList"
        :width-type="1"
        @update="updateSelectTemplate($event)"
      />
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': checkChangeValue(),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateCmsBasicSettingsDesign()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <!-- /main-contents -->
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      defaultBasicSettings: {},
      templateImageList: [],
      basicSettings: {},
      defaultSelectTemplateId: '',
      selectTemplateId: '',
      selectColor: '',
    }
  },
  computed: {
    ...mapState('cms/basicSettingsStore', ['templateImageMaster']),
    ...mapState('common', ['showCancelEditModalFlg']),
    /**
     * ボタンの非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (!this.selectTemplateId) {
          result = true
        }

        return result
      }
    },
    /**
     * 入力内容変更チェック
     *
     * @return {boolean} true:変更あり false:変更なし
     */
    checkChangeValue() {
      return () => {
        return (
          this.selectTemplateId === this.defaultBasicSettings.templateImageId &&
          this.selectColor === this.defaultBasicSettings.colorId
        )
      }
    },
  },
  created() {
    this.getBasicSettings() // 基本設定情報の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', [
      'showCancelEditModal',
      'hideCancelEditModal',
      'setShowIncompleteBasicSettingsModalState',
    ]),
    /**
     * 基本設定情報の取得
     */
    getBasicSettings() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCmsBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const basicSettings = resData.data.basicSettings

            if ([0, 1, 2].includes(basicSettings.baseSettingStatus)) {
              this.setShowIncompleteBasicSettingsModalState(true)
            } else {
              this.defaultBasicSettings = JSON.parse(
                JSON.stringify(basicSettings)
              )
              this.defaultSelectTemplateId = basicSettings.templateImageId
              this.setTemplateImageInfo(basicSettings)
            }
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * テンプレート情報の設定
     *
     * @param {Object} basicSettings 基本設定情報
     */
    setTemplateImageInfo(basicSettings) {
      this.selectTemplateId = basicSettings.templateImageId
      this.selectColor = basicSettings.colorId
      this.templateImageList = JSON.parse(
        JSON.stringify(this.templateImageMaster)
      )
      this.setInitColorId(basicSettings.colorId)
    },
    /**
     * 現在選択中のテンプレートのカラーIDの設定
     *
     * @param {string} colorId カラーID
     */
    setInitColorId(colorId) {
      const findIndex = this.templateImageList.findIndex(
        (data) => data.templateImageId === this.selectTemplateId
      )

      if (findIndex >= 0) {
        this.templateImageList[findIndex].colorId = colorId
      }
    },
    /**
     * 基本設定デザイン更新APIの呼び出し
     */
    updateCmsBasicSettingsDesign() {
      const paramData = {
        basicSettings: {
          colorId: this.selectColor,
          templateImageId: this.selectTemplateId,
          recordVersion: this.defaultBasicSettings.recordVersion,
        },
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCmsBasicSettingsDesign(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getBasicSettings() // 基本設定情報の取得
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 選択したテンプレート情報の更新
     */
    updateSelectTemplate(selectTemplateInfo) {
      this.selectTemplateId = selectTemplateInfo.templateImageId
      this.selectColor = selectTemplateInfo.colorId
    },
    /**
     * 入力内容を元に戻す
     */
    restoreSettings() {
      const defaultBasicSettings = JSON.parse(
        JSON.stringify(this.defaultBasicSettings)
      )

      this.setTemplateImageInfo(defaultBasicSettings)
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
  },
  head() {
    return {
      title: 'デザイン｜基本設定｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-settings {
  .header {
    &-sub {
      margin-top: 8px;
    }
    padding-bottom: 40px;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    .btn {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
