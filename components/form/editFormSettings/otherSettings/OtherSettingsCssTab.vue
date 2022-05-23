<template>
  <div class="css-tab">
    <div class="heading">
      <RequiredFormLabel class="title" label="CSS設定" :required="false" />
      <p class="sub-text">
        CSS編集項目メニューから、CSSを直接編集したい項目を選択してください。<br />
        編集画面が表示され、CSSを直接編集することができます。
      </p>
    </div>
    <div class="form-item">
      <div class="parts-list">
        <p>CSS編集項目</p>
        <ul>
          <li
            v-for="(item, index) in cssSettings.editItemList"
            :key="index"
            :class="{ selected: selectCssIndex === index }"
            @click="showSelectItemCss(index)"
          >
            {{ getCssPartsName(item.id) }}
          </li>
        </ul>
      </div>
      <div class="editor">
        <CodeMirrorEditor
          v-if="$common.checkArrayValue(cssSettings.editItemList)"
          :prop-code="cssSettings.editItemList[selectCssIndex].css"
          :validation="
            $common.getFormItemsDetail(formItems, 'editItem').validation
          "
          @updateCode="updateCode($event)"
        />
      </div>
    </div>
    <div class="buttons">
      <button
        class="btn btn-long btn-cancel"
        :class="{
          'btn-disabled': $common.checkSameObject(propFormCss, cssSettings),
        }"
        @click="showCancelEditModal()"
      >
        キャンセルして元に戻す
      </button>
      <button class="btn btn-long btn-primary" @click="updateCssSettings()">
        CSS設定を保存
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'OtherSettingsCssTab',
  components: {},
  props: {
    propFormCss: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      defaultCssSettings: {},
      cssSettings: {},
      selectCssIndex: 0,
      formItems: [
        {
          id: 'editItem',
          validation: [
            {
              type: 'maxlength',
              maxlength: 20000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 20000,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
  },
  watch: {
    propFormCss() {
      this.cssSettings = JSON.parse(JSON.stringify(this.propFormCss))
      this.setDefaultEditItemList(this.propFormCss)
    },
  },
  created() {
    this.cssSettings = JSON.parse(JSON.stringify(this.propFormCss))
    this.setDefaultEditItemList(this.propFormCss)
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    showSelectItemCss(index) {
      this.selectCssIndex = index
    },
    /**
     * codemirrorの入力値を更新する
     */
    updateCode(newCode) {
      this.cssSettings.editItemList[this.selectCssIndex].css = newCode
    },
    /**
     * CSS設定リストの初期値設定
     */
    setDefaultEditItemList(cssSettings) {
      this.defaultCssSettings = JSON.parse(JSON.stringify(cssSettings))
    },
    /**
     * パーツIDに紐づくパーツ名称を取得
     */
    getCssPartsName(partsId) {
      let partsName = ''

      switch (partsId) {
        case 'xhm-step':
          partsName = 'ステップ'
          break
        case 'xhm-text-field':
          partsName = 'テキストフィールド'
          break
        case 'xhm-text-area':
          partsName = 'テキストエリア'
          break
        case 'xhm-radio':
          partsName = 'ラジオボタン'
          break
        case 'xhm-checkbox':
          partsName = 'チェックボックス'
          break
        case 'xhm-select':
          partsName = 'セレクトボックス'
          break
        case 'xhm-heading-main':
          partsName = '見出し（h1）'
          break
        case 'xhm-heading-sub':
          partsName = '見出し（h2）'
          break
        case 'xhm-text':
          partsName = 'テキスト'
          break
        case 'xhm-separator':
          partsName = '区切り線'
          break
        case 'xhm-file-download':
          partsName = 'ファイルダウンロード'
          break
        case 'xhm-attaching-file':
          partsName = 'ファイル添付'
          break
        case 'xhm-permission':
          partsName = 'お知らせ許諾'
          break
        case 'xhm-terms':
          partsName = '規約表示'
          break
        case 'xhm-spacer-20':
          partsName = 'スペーサー'
          break
        case 'xhm-new-page-buttons':
          partsName = '改ページボタン'
          break
        case 'xhm-parameter':
          partsName = 'パラメーター'
          break
        case 'xhm-prefectures':
          partsName = '都道府県'
          break
        case 'xhm-sex':
          partsName = '性別'
          break
        case 'xhm-name':
          partsName = 'お名前'
          break
        case 'xhm-mail-address':
          partsName = 'メールアドレス'
          break
        case 'xhm-birthday':
          partsName = '生年月日'
          break
        case 'xhm-year-and-month':
          partsName = '年月'
          break
        case 'xhm-calendar':
          partsName = 'カレンダー'
          break
        case 'xhm-address':
          partsName = '住所'
          break
        case 'xhm-title':
          partsName = 'タイトル'
          break
        case 'xhm-label':
          partsName = 'ラベル'
          break
        case 'xhm-annotation':
          partsName = '注釈'
          break
        case 'xhm-btn-post-search':
          partsName = '郵便番号検索ボタン'
          break
        case 'xhm-required':
          partsName = '必須・任意アイコン'
          break
        case 'xhm-message-error':
          partsName = 'エラーメッセージ'
          break
        case 'xhm-btn-submit':
          partsName = '送信ボタン'
          break
        case 'xhm-btn-next':
          partsName = '次へボタン'
          break
        case 'xhm-btn-prev':
          partsName = '戻るボタン'
          break
        case 'xhm-message-complete':
          partsName = '完了画面表示メッセージ'
          break
        case 'xhm-system-error':
          partsName = 'システムエラーメッセージ'
          break
        case 'xhm-style':
          partsName = 'ベース設定'
          break
        case 'xhm-other':
          partsName = 'その他'
          break
        default:
          break
      }

      return partsName
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
        this.defaultCssSettings,
        this.cssSettings
      )
    },
    /**
     * 入力値を元に戻す
     */
    restoreSettings() {
      this.cssSettings = JSON.parse(JSON.stringify(this.defaultCssSettings))
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * CSS設定の更新
     */
    updateCssSettings() {
      const paramData = {
        css: this.cssSettings,
      }

      this.$emit('update', paramData)
    },
  },
}
</script>

<style lang="scss" scoped>
.css-tab {
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
  .form-item {
    display: flex;
    align-items: center;
    margin-top: 32px;
    height: 500px;
    max-height: 500px;
    .parts-list {
      width: 290px;
      height: 100%;
      overflow: auto;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        color: #8d8d8d;
        background: #e2e3e5;
      }
      ul {
        li {
          display: flex;
          align-items: center;
          height: 55px;
          padding-left: 16px;
          border: 1px solid #e0e0e0;
          &:not(:last-child) {
            margin-bottom: none;
          }
          cursor: pointer;
          &.selected {
            border: 1px solid #007aff;
          }
        }
      }
    }
    .editor {
      width: calc(100% - 290px);
      height: 100%;
      margin-left: 32px;
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
