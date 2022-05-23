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
      <template>
        <li class="contextmenu-title">
          <b>フォーム管理情報</b>
        </li>
        <li v-for="a in getAdminPlaceholders()" :key="a.id">
          <a @click="insertAnswer(a.id, null)">
            {{ a.title }}
          </a>
        </li>
      </template>
      <li class="contextmenu-title">
        <b>回答情報</b>
      </li>
      <li
        v-for="(p, index) in mailPlaceholders"
        :key="index"
        :class="{ 'v-context__sub': p.children.length }"
      >
        <a @click="insertAnswer(p.parent.partsId, 'selectParts')">
          {{ p.parent.partsData.title }}
        </a>
        <ul v-if="p.children.length" class="v-context">
          <li>
            <b>{{ p.parent.partsData.title }}の要素</b>
          </li>
          <li v-for="(c, childIndex) in p.children" :key="childIndex">
            <a @click="insertAnswer(c.partsId, 'selectParts')">
              {{ c.title }}
            </a>
          </li>
        </ul>
      </li>
    </vue-context>
  </div>
</template>

<script>
import VueContext from 'vue-context'
import 'codemirror/addon/display/placeholder.js'
import '~/components/common/editor/codemirror/plugins/mdx_placeholder.js'
import 'vue-context/dist/css/vue-context.css'
import 'codemirror/lib/codemirror.css'

export default {
  name: 'MailBodyEditor',
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

    const adminPlaceholders = [
      { id: 'cUrlAdminAnswerPage', title: 'FORM:回答ページURL' },
      { id: 'cTenantId', title: 'FORM:テナントID' },
      { id: 'cFormTitle', title: 'FORM:フォーム名' },
    ]

    return {
      initFlg: false,
      editorDocument: this.value,
      adminPlaceholders,
      cmOptions: {
        tabSize: 4,
        lineNumbers: false,
        mdxPlaceholder: {
          className: 'mail-placeholder',
          replace: matchPlaceholder,
          placeholderTexts: this.getMailPlaceholderList(adminPlaceholders),
          invalid: {
            className: 'mail-placeholder-invalid',
            text: 'x 項目なし',
          },
        },
      },
    }
  },
  computed: {
    mailPlaceholders() {
      const placeholders = []

      this.formInfo.selectParts.forEach((parts) => {
        if (parts.partsData.title) {
          const partsInfo = {
            parent: parts,
            children: [],
          }

          for (const c in parts.partsData) {
            if (parts.partsData[c] instanceof Object) {
              if (
                parts.partsData[c].parts_attr &&
                parts.partsData[c].parts_attr.label
              ) {
                partsInfo.children.push({
                  partsId: parts.partsData[c].partsId,
                  title: parts.partsData[c].parts_attr.label,
                })
              }
            }
          }

          placeholders.push(partsInfo)
        }
      })

      return placeholders
    },
    /**
     * 管理者用の差し込み文字列の取得
     *
     * @return {Object[]} 管理者用の差し込み文字列
     */
    getAdminPlaceholders() {
      return () => {
        let adminPlaceholders = []

        if (this.isAdmin) {
          adminPlaceholders = [
            { id: 'cUrlAdminAnswerPage', title: 'FORM:回答ページURL' },
            { id: 'cTenantId', title: 'FORM:テナントID' },
            { id: 'cFormTitle', title: 'FORM:フォーム名' },
          ]
        } else {
          adminPlaceholders = [{ id: 'cFormTitle', title: 'FORM:フォーム名' }]
        }

        return adminPlaceholders
      }
    },
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
  methods: {
    getMailPlaceholderList(adminPlaceholders) {
      const list = {}

      adminPlaceholders.forEach((admin) => {
        list[admin.id] = admin.title
      })

      this.formInfo.selectParts.forEach((parts) => {
        if (parts.partsData) {
          list[`p${parts.partsId}`] = parts.partsData.title
        }
        for (const c in parts.partsData) {
          if (parts.partsData[c] instanceof Object) {
            if (
              parts.partsData[c].parts_attr &&
              parts.partsData[c].parts_attr.label
            ) {
              list[
                `p${parts.partsData[c].partsId}`
              ] = `${parts.partsData.title}:${parts.partsData[c].parts_attr.label}`
            }
          }
        }
      })

      return list
    },
    insertAnswer(id, type) {
      const cm = this.$refs.editor.codemirror

      if (cm) {
        const mailPlaceholder =
          '{@@' + (type === 'selectParts' ? 'p' : '') + id + '@@}'

        cm.replaceRange(mailPlaceholder, cm.getDoc().getCursor())
      }
    },
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
    font-family: 'Noto Sans JP', sans-serif;
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

.context-menu li {
  padding: 0px 8px;
}
</style>
