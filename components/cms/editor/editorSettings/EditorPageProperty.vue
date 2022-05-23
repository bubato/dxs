<template>
  <div v-if="editorData.pageProperty" class="editor-page-property">
    <div class="select-page-kind">
      <p class="flex">
        ページ種別<TooltipHelp
          label="選択したページ種別に応じて、ページ作成時に配置されるパーツが変更されます。はじめからページを作成する場合は「その他」を選択してください。"
          left="45"
          direction="bottom"
        />
      </p>
      <CustomInputSelect
        v-model="selectPageKind"
        :options="selectPageKindOptions"
        :is-disabled="true"
        placeholder="選択して下さい"
      />
    </div>
    <div class="input-url">
      <p class="flex">
        URL
        <TooltipHelp
          label="公開中のページURLです。"
          left="95"
          direction="bottom"
        />
      </p>
      <p class="link-text" @click="viewPageUrl()">
        {{ currentSettingPageUrl }}
        <LaunchSVG class="icon icon-launch" />
      </p>
    </div>
    <div class="input-title">
      <p class="flex">
        タイトル<TooltipHelp
          label="ページのタイトルを入力します。入力された値はページのタイトルとして表示されます。"
          left="60"
          direction="bottom"
        />
      </p>
      <CustomInputText
        v-model="inputTitle"
        maxlength="200"
        :validation="
          $common.getFormItemsDetail(formItems, 'inputTitle').validation
        "
      />
    </div>
    <div class="input-context">
      <p class="flex">
        説明<TooltipHelp
          label="ページの説明文を入力します。入力された値はページの説明文として表示されます。"
          left="90"
          direction="bottom"
        />
      </p>
      <CustomInputTextarea
        v-model="inputContext"
        maxlength="500"
        :validation="
          $common.getFormItemsDetail(formItems, 'inputContext').validation
        "
      />
    </div>
    <div v-if="editorData.breadcrumb.length < 3" class="select-show-menu">
      <p class="flex">
        メニュー<TooltipHelp
          label="このページをWebサイトのメニューに表示するかを選択します。上部メニュー（ヘッダー）と下部メニュー（フッター）のそれぞれで表示の選択ができます。"
          left="64"
          direction="bottom"
        />
      </p>
      <CustomInputSingleCheckbox
        v-model="inputShowHeader"
        name="inputShowHeader"
        class="show-header"
        label="ヘッダーに表示"
      />
      <CustomInputSingleCheckbox
        v-model="inputShowFooter"
        name="inputShowFooter"
        class="show-footer"
        label="フッターに表示"
      />
    </div>
    <div
      v-if="editorData.breadcrumb.length < 3"
      v-show="inputShowHeader || inputShowFooter"
      class="input-show-name"
    >
      <p>表示名</p>
      <CustomInputText
        v-model="inputShowName"
        maxlength="100"
        :validation="
          $common.getFormItemsDetail(formItems, 'inputShowName').validation
        "
      />
    </div>
    <div class="input-tag">
      <p class="flex">
        タグ<TooltipHelp
          label="指定の場所へ任意のタグを挿入することができます。"
          left="90"
          direction="bottom"
        />
      </p>
      <div class="input-tag-after-head">
        <p>&lt;head&gt;直後</p>
        <CustomInputTextarea
          v-model="inputAfterHeadTag"
          maxlength="2000"
          :validation="
            $common.getFormItemsDetail(formItems, 'inputAfterHeadTag')
              .validation
          "
        />
      </div>
      <div class="input-tag-before-head">
        <p>&lt;/head&gt;直前</p>
        <CustomInputTextarea
          v-model="inputBeforeHeadTag"
          maxlength="2000"
          :validation="
            $common.getFormItemsDetail(formItems, 'inputBeforeHeadTag')
              .validation
          "
        />
      </div>
      <div class="input-tag-after-body">
        <p>&lt;body&gt;直後</p>
        <CustomInputTextarea
          v-model="inputAfterBodyTag"
          maxlength="2000"
          :validation="
            $common.getFormItemsDetail(formItems, 'inputAfterBodyTag')
              .validation
          "
        />
      </div>
      <div class="input-tag-before-body">
        <p>&lt;/body&gt;直前</p>
        <CustomInputTextarea
          v-model="inputBeforeBodyTag"
          maxlength="2000"
          :validation="
            $common.getFormItemsDetail(formItems, 'inputBeforeBodyTag')
              .validation
          "
        />
      </div>
    </div>
    <div class="buttons">
      <button
        class="btn btn-basic btn-middle"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updatePageProperty()"
      >
        保存
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditorPageProperty',
  components: {},
  data() {
    return {
      selectPageKindOptions: [],
      formItems: [
        {
          id: 'inputTitle',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 200,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 200,
              }),
            },
          ],
        },
        {
          id: 'inputContext',
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
          id: 'inputShowName',
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
          id: 'inputAfterHeadTag',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'inputBeforeHeadTag',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'inputAfterBodyTag',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'inputBeforeBodyTag',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('cms/editorStore', [
      'editorData',
      'viewComponentList',
      'maxRequestDataSize',
      'currentSettingPageUrl',
    ]),
    selectPageKind: {
      get() {
        return this.editorData.pageProperty.pageKind
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.pageKind = val
        this.setEditorData(newEditorData)
      },
    },
    inputShowName: {
      get() {
        return this.editorData.pageProperty.showName
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.showName = val
        this.setEditorData(newEditorData)
      },
    },
    selectShowMenu: {
      get() {
        return this.editorData.pageProperty.showMenu
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.showMenu = val
        this.setEditorData(newEditorData)
      },
    },
    inputTitle: {
      get() {
        return this.editorData.pageProperty.title
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.title = val
        this.setEditorData(newEditorData)
      },
    },
    inputContext: {
      get() {
        return this.editorData.pageProperty.context
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.context = val
        this.setEditorData(newEditorData)
      },
    },
    inputShowHeader: {
      get() {
        return this.editorData.pageProperty.showHeader
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.showHeader = val
        this.setEditorData(newEditorData)
      },
    },
    inputShowFooter: {
      get() {
        return this.editorData.pageProperty.showFooter
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.showFooter = val
        this.setEditorData(newEditorData)
      },
    },
    inputAfterHeadTag: {
      get() {
        return this.editorData.pageProperty.afterHeadTag
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.afterHeadTag = val
        this.setEditorData(newEditorData)
      },
    },
    inputBeforeHeadTag: {
      get() {
        return this.editorData.pageProperty.beforeHeadTag
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.beforeHeadTag = val
        this.setEditorData(newEditorData)
      },
    },
    inputAfterBodyTag: {
      get() {
        return this.editorData.pageProperty.afterBodyTag
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.afterBodyTag = val
        this.setEditorData(newEditorData)
      },
    },
    inputBeforeBodyTag: {
      get() {
        return this.editorData.pageProperty.beforeBodyTag
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.pageProperty.beforeBodyTag = val
        this.setEditorData(newEditorData)
      },
    },
    checkBtnDisabled() {
      const validationItems = {
        inputTitle: this.inputTitle,
        inputContext: this.inputContext,
        inputShowName: this.inputShowName,
        inputAfterHeadTag: this.inputAfterHeadTag,
        inputBeforeHeadTag: this.inputBeforeHeadTag,
        inputAfterBodyTag: this.inputAfterBodyTag,
        inputBeforeBodyTag: this.inputBeforeBodyTag,
      }

      return () => {
        let result = false

        for (const key in validationItems) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              validationItems[key]
            )
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
  },
  created() {
    this.selectPageKindOptions = this.$common.getVersatileOptions(3)
  },
  methods: {
    ...mapMutations('cms/editorStore', [
      'setEditorData',
      'setUpdateCmsDataFlg',
      'setShowErrorRequestDataSizeModalState',
    ]),
    /**
     * 保存ボタン押下処理
     */
    updatePageProperty() {
      const paramData = this.getUpdatePagePropertyParamData() // ページデータ更新API
      const paramDataBytes = this.$common.getStrBytes(JSON.stringify(paramData))

      if (paramDataBytes > this.maxRequestDataSize) {
        this.setShowErrorRequestDataSizeModalState(true)
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCmsEditorPageData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setUpdateCmsDataFlg(true)
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
     * ページデータ更新APIのリクエストパラメータの取得
     */
    getUpdatePagePropertyParamData() {
      const paramData = {
        id: Number(this.$route.params.pageId),
        pageProperty: this.editorData.pageProperty,
        componentList: this.setClassName(this.viewComponentList),
        recordVersion: this.editorData.recordVersion,
      }

      return paramData
    },
    /**
     * 表示用classの追加
     */
    setClassName(componentList) {
      const newComponentList = JSON.parse(JSON.stringify(componentList))

      for (let index = 0; index < newComponentList.length; index++) {
        let className = ''
        if (
          newComponentList[index].className !== undefined ||
          newComponentList[index].className === ''
        ) {
          const classArray = newComponentList[index].className.split(' ')
          const resultClassArray = classArray.filter(function (className) {
            if (
              className.includes('next-') ||
              className.includes('prev-') ||
              className.includes('secondPrev-')
            ) {
              return ''
            } else {
              return className
            }
          })
          className = resultClassArray.join(' ')
        }
        if (newComponentList[index - 1]) {
          className += 'next-' + newComponentList[index - 1].id + '-component '
        }
        if (newComponentList[index + 1]) {
          className += 'prev-' + newComponentList[index + 1].id + '-component '
        }
        if (newComponentList[index]) {
          if (
            newComponentList[index].id === 'conversion' &&
            newComponentList[index - 2]
          ) {
            className +=
              'secondPrev-' + newComponentList[index - 2].id + '-component '
          }
        }
        newComponentList[index].className = className
      }
      return newComponentList
    },
    viewPageUrl() {
      window.open(this.currentSettingPageUrl, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-page-property {
  display: block;
  > div {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
    > p {
      font-weight: 500;
      margin-bottom: 10px;
    }
  }
  .icon-launch {
    width: 1em;
    height: 1em;
    fill: #007aff;
  }
  .input-tag {
    > p {
      font-weight: 500;
      margin-bottom: 10px;
    }
    > div {
      &:not(:last-child) {
        margin-bottom: 24px;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
  .select-show-menu {
    .show-footer {
      margin-top: 12px;
    }
  }
  .textarea {
    ::v-deep .custom-input-textarea-block {
      height: 128px;
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
  }
}
</style>
