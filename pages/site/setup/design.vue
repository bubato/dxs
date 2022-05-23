<template>
  <div class="basic-settings">
    <FormNav :nav-list="navList" :select-index="selectTabIndex" />
    <div class="header">
      <h2>サイトデザイン</h2>
      <p class="header-sub">
        Webサイトのデザインテンプレートを選択してください。<br />デザインは後で変更することもできます。
      </p>
    </div>
    <SelectDesignTemplate
      :default-select-template-id="defaultSelectTemplateId"
      :select-template-id="selectTemplateId"
      :template-image-list="templateImageList"
      :width-type="0"
      @update="updateSelectTemplate($event)"
    />
    <div class="buttons">
      <button class="btn btn-cancel btn-long" @click="toBackDomainSettings()">
        前に戻る
      </button>
      <button
        class="btn btn-primary btn-long"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateCmsBasicSettingsDesign()"
      >
        保存して完了
      </button>
    </div>
    <CheckSetupStatusModal
      v-if="showCheckSetupStatusModalFlg"
      @close="showCheckSetupStatusModalFlg = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'servicelauncher',
  components: {},
  data() {
    return {
      navList: ['サイトURL', 'サイト基本情報', 'サイトデザイン'],
      selectTabIndex: 2,
      defaultBasicSettings: {},
      defaultSelectTemplateId: '',
      selectTemplateId: '',
      selectColor: '',
      showCheckSetupStatusModalFlg: false,
    }
  },
  computed: {
    ...mapState('cms/basicSettingsStore', ['templateImageMaster']),
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
  },
  created() {
    this.getBasicSettings() // 基本設定情報の取得
    this.templateImageList = JSON.parse(
      JSON.stringify(this.templateImageMaster)
    )
  },
  mounted() {},
  methods: {
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

            this.defaultBasicSettings = JSON.parse(
              JSON.stringify(basicSettings)
            )
            this.defaultSelectTemplateId = basicSettings.templateImageId
            this.selectTemplateId = basicSettings.templateImageId
            this.selectColor = basicSettings.colorId
            this.setInitColorId(basicSettings.colorId)
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
     * 初期セットアップ(サイト基本情報)画面に戻る
     */
    toBackDomainSettings() {
      this.$router.push('/site/setup/basic/')
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
            this.updateCmsBasicSettings() // 基本設定データ更新APIの呼び出し
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
     * 基本設定データ更新APIの呼び出し
     */
    updateCmsBasicSettings() {
      const paramData = {
        industry: this.templateImageMaster.find(
          (data) => data.templateImageId === this.selectTemplateId
        ).industryId,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCmsBasicSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.showCheckSetupStatusModalFlg = true
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

      this.selectTemplateId = defaultBasicSettings.templateImageId
      this.selectColor = defaultBasicSettings.colorId
      this.setInitColorId(defaultBasicSettings.colorId)
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
  },

  head() {
    return {
      title: '初期セットアップ（サイトデザイン）｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-settings {
  width: 935px;
  padding-top: 48px;
  margin: auto;
  .nav-list {
    width: 640px;
    margin: auto;
  }
  .header {
    width: 420px;
    margin: 40px auto 0 auto;
    h2 {
      text-align: center;
    }
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
