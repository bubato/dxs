<template>
  <header>
    <div class="title">
      <HeaderLogo />
    </div>
    <div class="btn-area">
      <button
        class="btn btn-middle btn-secondary"
        @click="updateEditorPage('preview')"
        @mouseover="
          $common.setAreaLabel(
            $event,
            'bottom',
            '編集内容を保存してページのプレビューを表示します。ページは公開されません。'
          )
        "
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
      >
        プレビュー
      </button>
      <button
        class="btn btn-middle btn-basic"
        @click="updateEditorPage('save')"
      >
        保存
      </button>
      <button
        class="btn btn-middle btn-primary"
        @click="updateEditorPage('publishNow')"
      >
        今すぐ公開
      </button>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditorHeader',
  data() {
    return {}
  },
  computed: {
    ...mapState('cms/editorStore', [
      'editorData',
      'viewComponentList',
      'maxRequestDataSize',
    ]),
  },
  methods: {
    ...mapMutations('cms/editorStore', [
      'setUpdateCmsDataFlg',
      'setShowCheckPagePublishModalState',
      'setShowErrorRequestDataSizeModalState',
      'setCheckPublishType',
    ]),
    /**
     * プレビューボタン押下処理
     */
    updateEditorPage(btnType) {
      const paramData = this.getUpdateCmsEditorPageRequestData(btnType) // 公開APIのリクエストパラメータの取得
      const paramDataBytes = this.$common.getStrBytes(JSON.stringify(paramData))

      if (paramDataBytes > this.maxRequestDataSize) {
        this.setShowErrorRequestDataSizeModalState(true)
        return
      }

      // 画面遷移させるための一時的なテストコード
      if (btnType === 'preview' && process.env.environment === 'development') {
        window.open(
          '/site/pages/preview/' + this.$route.params.pageId,
          '_blank'
        )
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCmsEditorPageData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            switch (btnType) {
              case 'preview':
                window.open(
                  `/site/pages/preview/${this.$route.params.pageId}`,
                  '_blank'
                )
                this.setUpdateCmsDataFlg(true)
                break
              case 'save':
                this.$common.showCompletePopAlert('ActionMsg_Gen01')
                this.setUpdateCmsDataFlg(true)
                break
              case 'publishNow':
                this.setCheckPublishType('public')
                this.setShowCheckPagePublishModalState(true)
                break
              default:
                break
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
     * ページデータ更新取得APIのリクエストパラメータの取得
     * @param {string} btnType ボタンの種類 preview:プレビュー close:保存して閉じる publishNow:今すぐ公開する
     */
    getUpdateCmsEditorPageRequestData(btnType) {
      const paramData = {
        id: Number(this.$route.params.pageId),
        pageProperty: this.editorData.pageProperty,
        componentList: this.setClassName(this.viewComponentList),
        publishingSettings: {},
        recordVersion: this.editorData.recordVersion,
      }

      switch (btnType) {
        case 'preview':
          paramData.publishingSettings.publishingMethod = '5'
          break
        case 'save':
          paramData.publishingSettings.publishingMethod = '6'
          break
        case 'publishNow':
          paramData.publishingSettings.publishingMethod = '2'
          break
        default:
          break
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
  },
}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #f7f8f9;
  box-shadow: 0px 1px 4px #00000014 inset;
  .btn-area {
    display: flex;
    align-items: center;
    button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
