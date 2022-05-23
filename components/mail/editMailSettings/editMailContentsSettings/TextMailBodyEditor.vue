<template>
  <div
    class="custom-input-textarea"
    :class="[{ 'validation-error': getErrorList().length > 0 }]"
    @contextmenu.prevent="$refs.contextMenu.open"
  >
    <ValidationMessage
      v-if="getErrorList().length > 0"
      :error-list="getErrorList()"
    />
    <codemirror
      ref="editor"
      v-model="editorDocument"
      :placeholder="placeholder"
      class="cm-editor-input"
      :options="cmOptions"
      @input="updateValue"
    />
    <vue-context ref="contextMenu" class="context-menu">
      <li
        v-for="(data, index) in mergeStringMenu"
        :key="index"
        :class="{ 'v-context__sub': data.hasOwnProperty('child') }"
      >
        <p v-if="data.type === 'heading'" class="heading">{{ data.title }}</p>
        <p v-if="data.type === 'parent'" class="parent">
          {{ data.title
          }}<KeyboardArrowRightSVG class="icon-keyboardArrowRight" />
        </p>
        <p
          v-if="data.type === 'main' || data.type === 'link'"
          @click="insertAnswer(data.id, data.type)"
        >
          + {{ data.title }}
        </p>
        <ul v-if="data.hasOwnProperty('child')" class="v-context">
          <li
            v-for="(child1, childIndex1) in data.child"
            :key="childIndex1"
            :class="{ 'v-context__sub': child1.hasOwnProperty('child') }"
          >
            <p v-if="child1.type === 'parent'" class="parent">
              {{ child1.title
              }}<KeyboardArrowRightSVG class="icon-keyboardArrowRight" />
            </p>
            <p
              v-if="child1.type === 'main' || child1.type === 'link'"
              @click="insertAnswer(child1.id, child1.type)"
            >
              + {{ child1.title }}
            </p>
            <ul v-if="child1.hasOwnProperty('child')" class="v-context">
              <li
                v-for="(child2, childIndex2) in child1.child"
                :key="childIndex2"
                :class="{ 'v-context__sub': child2.hasOwnProperty('child') }"
              >
                <p v-if="child2.type === 'parent'" class="parent">
                  {{ child2.title
                  }}<KeyboardArrowRightSVG class="icon-keyboardArrowRight" />
                </p>
                <p
                  v-if="child2.type === 'main' || child2.type === 'link'"
                  @click="insertAnswer(child2.id, child2.type)"
                >
                  + {{ child2.title }}
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </vue-context>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueContext from 'vue-context'
import 'codemirror/addon/display/placeholder.js'
import '~/components/common/editor/codemirror/plugins/mdx_placeholder.js'
import 'vue-context/dist/css/vue-context.css'
import 'codemirror/lib/codemirror.css'

export default {
  name: 'TextMailBodyEditor',
  components: {
    VueContext,
  },
  props: {
    value: { type: String, required: false, default: '' },
    placeholder: { type: String, required: false, default: '' },
    validation: { type: Array, required: false, default: () => [] },
    isAdmin: { type: Boolean, required: false, default: false },
    formInfo: { type: Object, required: false, default: () => {} },
  },
  data() {
    const matchPlaceholder = {
      match: /{@@([A-Za-z0-9_.]{0,64})@@}/,
      group: 1,
    }

    return {
      initFlg: false,
      editorDocument: this.value,
      cmOptions: {
        tabSize: 4,
        lineNumbers: false,
        mdxPlaceholder: {
          className: 'mail-placeholder',
          replace: matchPlaceholder,
          placeholderTexts: {},
          invalid: {
            className: 'mail-placeholder-invalid',
            text: 'x 項目なし',
          },
        },
      },
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['pageListData', 'topPagePath']),
    /**
     * コンテキストメニューの取得
     *
     * @return {Object[]} コンテキストメニュー
     */
    mergeStringMenu() {
      const mergeString = [
        {
          type: 'heading',
          title: 'コンタクト情報の挿入',
        },
        {
          type: 'parent',
          title: 'コンタクト情報',
          child: [
            {
              type: 'main',
              title: '姓',
              id: 'CONTACT.last_name',
            },
            {
              type: 'main',
              title: '名',
              id: 'CONTACT.first_name',
            },
            {
              type: 'main',
              title: '姓(カナ)',
              id: 'CONTACT.last_name_kana',
            },
            {
              type: 'main',
              title: '名(カナ)',
              id: 'CONTACT.first_name_kana',
            },
            {
              type: 'main',
              title: '企業名',
              id: 'CONTACT.company_name_input',
            },
            {
              type: 'main',
              title: '部署名',
              id: 'CONTACT.department',
            },
            {
              type: 'main',
              title: '役職名',
              id: 'CONTACT.position',
            },
            {
              type: 'main',
              title: 'メールアドレス',
              id: 'CONTACT.mail_address',
            },
          ],
        },
        {
          type: 'parent',
          title: '営業担当者情報',
          child: [
            {
              type: 'main',
              title: '営業担当者 姓',
              id: 'TENANT.last_name',
            },
            {
              type: 'main',
              title: '営業担当者 名',
              id: 'TENANT.first_name',
            },
            {
              type: 'main',
              title: '営業担当者メールアドレス',
              id: 'TENANT.mail_address',
            },
          ],
        },
        {
          type: 'heading',
          title: 'リンクの設定',
        },
        {
          type: 'link',
          title: 'トップページ',
          id: this.topPagePath,
        },
        {
          type: 'parent',
          title: '下層ページ',
          child: this.getUnderContentsPage(),
        },
        {
          type: 'link',
          title: 'メール配信停止',
          id: this.topPagePath + '/stopMail',
        },
      ]

      return mergeString
    },
    /**
     * エラーリストの取得
     *
     * @return {Object{}} エラーリスト
     */
    getErrorList() {
      return () => {
        let validationList = []

        if (!this.initFlg) {
          return []
        }

        if (this.validation) {
          validationList = this.$common.getValidationMsg(
            this.validation,
            this.value
          )
        }

        return validationList
      }
    },
  },
  watch: {
    value(value) {
      this.editorDocument = value
    },
  },
  created() {
    this.cmOptions.mdxPlaceholder.placeholderTexts = this.getMailPlaceholderList()
  },
  methods: {
    /**
     * 差し込み文字列のマスターの取得
     *
     * @return {Object[]} 差し込み文字列のマスター
     */
    getMailPlaceholderList() {
      const list = {}
      const placeholder = [
        {
          id: 'CONTACT.ktr_cltid',
          title: '顧客ID',
        },
        {
          id: 'CONTACT.company_name_input',
          title: '会社名​',
        },
        {
          id: 'CONTACT.last_name',
          title: '姓',
        },
        {
          id: 'CONTACT.first_name',
          title: '名',
        },
        {
          id: 'CONTACT.last_name_kana',
          title: '姓（カナ）',
        },
        {
          id: 'CONTACT.first_name_kana',
          title: '名（カナ）',
        },

        {
          id: 'CONTACT.mail_address',
          title: 'メールアドレス',
        },
        {
          id: 'CONTACT.department​',
          title: '部門​',
        },
        {
          id: 'CONTACT.position',
          title: '部門​',
        },
        {
          id: 'CONTACT.phone_number_1',
          title: '電話番号1',
        },
        {
          id: 'CONTACT.pho2ne_number_2',
          title: '電話番号2',
        },
      ]

      placeholder.forEach((data) => {
        list[data.id] = data.title
      })

      return list
    },
    /**
     * 差し込み文字列の追加
     *
     * @param {string} id 項目ID
     * @param {string} type 項目タイプ
     */
    insertAnswer(id, type) {
      const cm = this.$refs.editor.codemirror

      if (cm) {
        if (type === 'main') {
          cm.replaceRange('{@@' + id + '@@}', cm.getDoc().getCursor())
        } else if (type === 'link') {
          cm.replaceRange(id, cm.getDoc().getCursor())
        }
      }
    },
    /**
     * 下層ページの取得
     *
     * @return {Object} 下層ページのコンテキストメニュー
     */
    getUnderContentsPage() {
      const underPageList = this.pageListData.underContents
      const returnData = []

      for (let i = 0; i < underPageList.length; i++) {
        returnData.push({
          type: 'link',
          title: underPageList[i].name,
          id: this.topPagePath + underPageList[i].path,
        })

        if (this.$common.checkArrayValue(underPageList[i].underContents)) {
          const addData = {
            type: 'parent',
            title: underPageList[i].name,
            child: [],
          }

          for (let j = 0; j < underPageList[i].underContents.length; j++) {
            addData.child.push({
              type: 'link',
              title: underPageList[i].underContents[j].name,
              id: this.topPagePath + underPageList[i].underContents[j].path,
            })
          }

          returnData.push(addData)
        }
      }

      return returnData
    },
    /**
     * 入力値の更新
     */
    updateValue() {
      this.$emit('input', this.editorDocument)
      this.initFlg = true
    },
  },
}
</script>

<style scoped lang="scss">
.cm-editor-input {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  background: #f7f8f9;
}

::v-deep {
  .CodeMirror {
    position: relative;
    padding: 16px;
    height: 100%;
    background: none;
    &-empty {
      color: #d2d2d2;
    }
  }
  .mail-placeholder {
    border: 1px solid;
    border-radius: 4px;
    padding: 0px 2px 0px 2px;
    margin: 0px 1px;
  }

  .mail-placeholder-invalid {
    color: #f00;
    border: 1px solid;
    border-radius: 4px;
    padding: 0px 2px 0px 2px;
    margin: 0px 1px;
  }
}

.editor-container {
  position: relative;
  width: calc(100% - 290px);
  height: 128px;
  // height: 100%;
  // margin-left: 32px;
}

.vue-codemirror {
  position: relative;
  background: #f7f8f9;
}

.context-menu {
  padding: 0px;
  > li {
    padding: 10px;
    position: relative;
    &:hover {
      background-color: #f8f9fa;
    }
    &:not(:last-child) {
      border-bottom: 1px solid;
    }
    .heading {
      font-weight: 500;
    }
    .parent {
      .icon-keyboardArrowRight {
        position: absolute;
        right: 4px;
      }
    }
    .v-context {
      padding: 0;
      li {
        padding: 10px;
        position: relative;
      }
    }
  }
}
</style>
