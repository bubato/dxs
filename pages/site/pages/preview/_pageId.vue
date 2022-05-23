<template>
  <div class="preview editor_preview">
    <div class="header">
      <ul>
        <li
          :class="{ selected: selectDispType === 1 }"
          @click="selectDispType = 1"
        >
          <PcSVG class="icon icon-pc" />PC
        </li>
        <li
          :class="{ selected: selectDispType === 2 }"
          @click="selectDispType = 2"
        >
          <SmartPhoneSVG class="icon sp icon-smartPhone" />スマホ
        </li>
      </ul>
    </div>
    <div class="contents" :class="{ sp: selectDispType === 2 }">
      <ViewArea view-mode="preview" :device-mode="selectDispType" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      selectDispType: 1,
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['editorData']),
  },
  watch: {},
  created() {
    // this.debugFUnc() // テストコード
    this.getCmsEditorData() // エディター画面の表示データ
  },
  mounted() {},
  methods: {
    ...mapMutations('cms/editorStore', [
      'setEditorData',
      'setDesignTemplate',
      'setSiteColor',
      'setViewComponentList',
    ]),
    /**
     * デバッグコード ローカルストレージから表示データを取得
     */
    debugFUnc() {
      this.setEditorData(JSON.parse(localStorage.getItem('editorData')))
      this.setViewComponentList(
        JSON.parse(localStorage.getItem('viewComponentList'))
      )
      this.showViewAreaFlg = true
    },
    /**
     * エディター画面の表示データの取得
     */
    getCmsEditorData() {
      const paramData = {
        id: Number(this.$route.params.pageId),
      }

      this.$common.addCallApiNum()
      this.$api
        .getCmsEditorData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setEditorData(resData.data)
            this.setDesignTemplate(resData.data.templateImageId)
            this.setSiteColor(resData.data.colorId)
            this.setViewComponentList(resData.data.componentList)
            this.showViewAreaFlg = true
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
  head() {
    return {
      title: this.editorData.pageProperty
        ? this.editorData.pageProperty.title + 'ページ編集｜Webサイト｜bizskyDX'
        : 'ページ編集｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.editor_preview {
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    background: #cdced0;
    ul {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      overflow: hidden;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 83px;
        height: 30px;
        background: #ffffff;
        cursor: pointer;
        &.selected {
          background: #ebeced;
          color: #007aff;
          .icon {
            fill: #007aff;
          }
        }
        .icon {
          margin-right: 8px;
          height: 22px;
          width: auto;
          &.sp {
            margin-right: 2px;
          }
        }
      }
    }
  }
  .contents {
    width: 1366px;
    min-width: 1366px;
    margin: auto;
    margin-top: 24px;
    padding-bottom: 20px;
    border: #e5e5e5 1px solid;
    &.sp {
      width: 375px;
      min-width: 375px;
    }
  }
}
#htmlData {
  display: none;
}
</style>
