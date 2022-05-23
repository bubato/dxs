<template>
  <div class="js-tab">
    <div class="heading">
      <RequiredFormLabel
        class="title"
        label="JavaScript設定"
        :required="false"
      />
      <p class="sub-text">
        任意のJavaScriptを設定します。<br />
        ここで設定されたJavaScriptは、入力・確認・完了画面で読み込まれます。
      </p>
    </div>
    <div class="editor">
      <CodeMirrorEditor
        :prop-code="jsSettings.code"
        :validation="$common.getFormItemsDetail(formItems, 'code').validation"
        @updateCode="updateCode($event)"
      />
    </div>
    <div class="form-block">
      <div class="title">
        <h3 class="form-title">送信先の情報を設定</h3>
        <p class="sub-text">
          確認画面および完了画面表示時にGoogleアナリティクス計測を行います。<br />
          page入力項目に任意の値を入力してください。<br />
          pageパラメータに入力された値を「go(‘send’,’pageview’,’page’);」でGoogleアナリティクスにデータ送信します。
        </p>
      </div>
      <div class="contents">
        <div class="form-item">
          <RequiredFormLabel
            class="title"
            label="計測の有無"
            :required="true"
          />
          <CustomInputRadio
            v-model="jsSettings.googleAnalytics.presenceOrAbsenceOfMeasurement"
            name="presenceOrAbsenceOfMeasurement"
            :options="presenceOrAbsenceOfMeasurementOptions"
            view-type="vertical"
          />
        </div>
        <div
          v-show="
            jsSettings.googleAnalytics.presenceOrAbsenceOfMeasurement === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel
            class="title"
            label="トラッキングID"
            :required="true"
          />
          <CustomInputText
            v-model="jsSettings.googleAnalytics.trackingId"
            placeholder="入力例：UA-000000-0"
            maxlength="20"
            :validation="
              $common.getFormItemsDetail(formItems, 'trackingId').validation
            "
          />
        </div>
        <div
          v-show="
            jsSettings.googleAnalytics.presenceOrAbsenceOfMeasurement === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel class="title" label="確認画面" :required="true" />
          <CustomInputText
            v-model="jsSettings.googleAnalytics.confirmScreen"
            placeholder="入力例：form-confirm"
            maxlength="20"
            :validation="
              $common.getFormItemsDetail(formItems, 'confirmScreen').validation
            "
          />
        </div>
        <div
          v-show="
            jsSettings.googleAnalytics.presenceOrAbsenceOfMeasurement === '1'
          "
          class="form-item"
        >
          <RequiredFormLabel class="title" label="完了画面" :required="true" />
          <CustomInputText
            v-model="jsSettings.googleAnalytics.completeScreen"
            placeholder="入力例：form-complete"
            maxlength="20"
            :validation="
              $common.getFormItemsDetail(formItems, 'completeScreen').validation
            "
          />
        </div>
      </div>
    </div>
    <div class="buttons">
      <button
        class="btn btn-long btn-cancel"
        :class="{
          'btn-disabled': $common.checkSameObject(propFormJs, jsSettings),
        }"
        @click="showCancelEditModal()"
      >
        キャンセルして元に戻す
      </button>
      <button
        class="btn btn-long btn-primary"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateJsSettings()"
      >
        JavaScript設定を保存
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'OtherSettingsJsTab',
  components: {},
  props: {
    propFormJs: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      selectTab: 1,
      defaultJsSettings: {},
      jsSettings: {},
      presenceOrAbsenceOfMeasurementOptions: [
        {
          value: '1',
          label: '計測する',
        },
        {
          value: '0',
          label: '計測しない',
        },
      ],
      formItems: [
        {
          id: 'code',
          validation: [
            {
              type: 'maxlength',
              maxlength: 5000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 5000,
              }),
            },
          ],
        },
        {
          id: 'trackingId',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'confirmScreen',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'completeScreen',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    /**
     * ログインボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.jsSettings.googleAnalytics.presenceOrAbsenceOfMeasurement === '1'
        ) {
          for (const key in this.jsSettings.googleAnalytics) {
            if (!this.jsSettings.googleAnalytics[key]) {
              result = true
              break
            }
          }
        }

        return result
      }
    },
  },
  watch: {
    propFormJs() {
      this.jsSettings = JSON.parse(JSON.stringify(this.propFormJs))
      this.setDefaultEditItemList(this.propFormJs)
    },
  },
  created() {
    this.jsSettings = JSON.parse(JSON.stringify(this.propFormJs))
    this.setDefaultEditItemList(this.propFormJs)
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * codemirrorの入力値を更新する
     */
    updateCode(newCode) {
      this.jsSettings.code = newCode
    },
    /**
     * JS設定の初期値設定
     */
    setDefaultEditItemList(jsSettings) {
      this.defaultJsSettings = JSON.parse(JSON.stringify(jsSettings))
    },
    /**
     * オブジェクト一致チェック(親画面から呼び出される関数)
     *
     * @param {object} objA オブジェクトA
     * @param {object} objB オブジェクトB
     * @return {boolean} 入力内容に変更があった場合は、true それ以外はfalseを返す
     */
    checkChangeInputData() {
      return !this.$common.checkSameObject(
        this.defaultJsSettings,
        this.jsSettings
      )
    },
    /**
     * 入力値を元に戻す
     */
    restoreSettings() {
      this.jsSettings = JSON.parse(JSON.stringify(this.defaultJsSettings))
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * JS設定の更新
     */
    updateJsSettings() {
      const paramData = {
        js: this.getRequestJsSettings(),
      }

      this.$emit('update', paramData)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     */
    getRequestJsSettings() {
      const requestJsSettings = JSON.parse(JSON.stringify(this.jsSettings))

      if (
        requestJsSettings.googleAnalytics.presenceOrAbsenceOfMeasurement === '0'
      ) {
        delete requestJsSettings.googleAnalytics.trackingId
        delete requestJsSettings.googleAnalytics.confirmScreen
        delete requestJsSettings.googleAnalytics.completeScreen
      }

      return requestJsSettings
    },
  },
}
</script>

<style lang="scss" scoped>
.js-tab {
  .heading {
    margin-top: 32px;
    .title {
      font-size: 22px;
    }
    .sub-text {
      margin-top: 8px;
      font-size: 13px;
    }
  }
  .editor {
    width: 100%;
    height: 550px;
    margin-top: 32px;
  }
  .form-block {
    margin-top: 50px;
    padding-top: 32px;
    border-top: 1px solid #e5e5e5;
    .title {
      margin-bottom: 32px;
      .form-title {
        font-size: 22px;
        font-weight: 500;
      }
      .sub-text {
        font-size: 13px;
        margin-top: 8px;
      }
    }
    .contents {
      margin-bottom: 32px;
    }
    .form-item {
      ::v-deep input[type='text'] {
        width: 680px;
      }
      .title {
        margin-bottom: 10px;
      }
      .sub-text {
        margin-bottom: 12px;
      }
      &:not(:last-child) {
        margin-bottom: 48px;
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid #e5e5e5;
    button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
