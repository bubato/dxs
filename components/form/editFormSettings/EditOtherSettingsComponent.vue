<template>
  <div class="other-settings">
    <ul class="tab-list">
      <li :class="{ selected: selectTabIndex === 1 }" @click="exetSelectTab(1)">
        タグ
      </li>
      <li :class="{ selected: selectTabIndex === 2 }" @click="exetSelectTab(2)">
        CSS
      </li>
      <li :class="{ selected: selectTabIndex === 3 }" @click="exetSelectTab(3)">
        JavaScript
      </li>
    </ul>
    <div class="contents">
      <OtherSettingsFormTab
        v-if="selectTabIndex === 1"
        ref="formTab"
        :prop-form-tag="otherSettings.formTag"
      />
      <OtherSettingsCssTab
        v-if="selectTabIndex === 2"
        ref="cssTab"
        :prop-form-css="otherSettings.css"
        @update="updateEditOtherSettings($event, 'css')"
      />
      <OtherSettingsJsTab
        v-if="selectTabIndex === 3"
        ref="jsTab"
        :prop-form-js="otherSettings.js"
        @update="updateEditOtherSettings($event, 'js')"
      />
    </div>
    <CancelEditModal
      v-if="showOtherSettingsCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="exeCloseModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditOtherSettingsComponent',
  components: {},
  props: {
    propOtherSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      otherSettings: {},
      selectTabIndex: 1,
      selectTabBefore: null,
    }
  },
  computed: {
    ...mapState('form/editFormSettings', [
      'showOtherSettingsCancelEditModalFlg',
    ]),
  },
  watch: {
    propOtherSettings() {
      this.otherSettings = JSON.parse(JSON.stringify(this.propOtherSettings))
    },
  },
  created() {
    this.otherSettings = JSON.parse(JSON.stringify(this.propOtherSettings))
  },
  methods: {
    ...mapMutations('form/editFormSettings', [
      'showOtherSettingsCancelEditModal',
      'hideOtherSettingsCancelEditModal',
    ]),
    /**
     * タブ押下時の処理
     *
     * @param {number} index 選択したタブのインデックス
     */
    exetSelectTab(value) {
      this.selectTabBefore = value

      this.$nextTick(function () {
        let changeDataFlg = false

        switch (this.selectTabIndex) {
          case 2:
            changeDataFlg = this.$refs.cssTab.checkChangeInputData()
            break
          case 3:
            changeDataFlg = this.$refs.jsTab.checkChangeInputData()
            break
          default:
            break
        }

        if (changeDataFlg) {
          this.showOtherSettingsCancelEditModal()
        } else {
          this.updateSelectTab(this.selectTabBefore)
          this.selectTabBefore = null
        }
      })
    },
    /**
     * タブ切り替え処理
     */
    updateSelectTab(value) {
      this.selectTabIndex = value
      this.$common.initScrollTop()
    },
    /**
     * 編集破棄モーダルのクローズ処理
     */
    exeCloseModal() {
      this.selectTabBefore = null
      this.hideOtherSettingsCancelEditModal()
    },
    /**
     * 保存してリクエストデータを親に送る
     */
    updateEditOtherSettings(requestData, type) {
      const data = {
        requestParam: {
          otherSettings: this.otherSettings,
        },
        afterFunc: 'save',
      }

      if (type === 'css') {
        data.requestParam.otherSettings.css = requestData.css
        delete data.requestParam.otherSettings.formTag
        delete data.requestParam.otherSettings.js
      } else if (type === 'js') {
        data.requestParam.otherSettings.js = requestData.js
        delete data.requestParam.otherSettings.formTag
        delete data.requestParam.otherSettings.css
      }

      this.$emit('update', data)
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
        this.propOtherSettings,
        this.otherSettings
      )
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      if (this.selectTabBefore != null) {
        this.updateSelectTab(this.selectTabBefore)
        this.selectTabBefore = null
      } else {
        switch (this.selectTabIndex) {
          case 2:
            this.$refs.cssTab.restoreSettings()
            break
          case 3:
            this.$refs.jsTab.restoreSettings()
            break
          default:
            break
        }

        this.$common.showCompletePopAlert('ActionMsg_Gen02')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.other-settings {
  .tab-list {
    display: flex;
    align-items: center;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 16px;
      border: 1px solid #e0e0e0;
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:not(:last-child) {
        border-right: none;
      }
      cursor: pointer;
      &.selected {
        background: #ebeced;
        color: #007aff;
      }
    }
  }
}
</style>
