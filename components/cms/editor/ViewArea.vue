<template>
  <div
    class="view-area"
    :class="[
      { wide: !showSettingMenuFlg },
      {
        'template-simple': designTemplate.slice(0, 1) === '1',
      },
      { 'template-rich': designTemplate.slice(0, 1) === '2' },
      {
        'template-stylish': designTemplate.slice(0, 1) === '3',
      },
      {
        'template-friendly': designTemplate.slice(0, 1) === '4',
      },
      { 'siteColor-black': siteColor === '1' },
      { 'siteColor-darkGray': siteColor === '2' },
      { 'siteColor-gray': siteColor === '3' },
      { 'siteColor-lightBlue': siteColor === '4' },
      { 'siteColor-blueGreen': siteColor === '5' },
      { 'siteColor-darkBlue': siteColor === '6' },
      { 'siteColor-darkGreen': siteColor === '7' },
      { 'siteColor-green': siteColor === '8' },
      { 'siteColor-lightGreen': siteColor === '9' },
      { 'siteColor-yellowGreen': siteColor === '10' },
      { 'siteColor-orange': siteColor === '11' },
      { 'siteColor-red': siteColor === '12' },
      { 'siteColor-darkPink': siteColor === '13' },
      { 'siteColor-violet': siteColor === '14' },
      { 'siteColor-purple': siteColor === '15' },
      { 'siteColor-paleBlue': siteColor === '16' },
      { 'siteColor-palePurple': siteColor === '17' },
      { 'siteColor-pink': siteColor === '18' },
      { 'siteColor-gold': siteColor === '19' },
      { 'siteColor-brown': siteColor === '20' },
      { 'is-pc': deviceMode === 1 },
      { 'is-sp': deviceMode === 2 },
    ]"
  >
    <ViewComponent
      ref="editorView"
      v-model="componentList"
      :component-index="componentIndex"
      :view-mode="viewMode"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import '~/assets/styles/scss/editor/editor.scss'
import '~/assets/styles/scss/template/commonTemplate_common.scss'

export default {
  name: 'ViewArea',
  components: {},
  props: {
    viewMode: {
      type: String,
      default: '',
    },
    deviceMode: {
      type: Number,
      require: false,
      default: 1, // 1:PC,2:SP
    },
  },
  data() {
    return {
      isGlobalEmitting: false,
      componentList: [],
      componentIndex: 0,
      dragTarget: {},
      dragTargetInfo: {},
      cloneComponent: {},
    }
  },
  computed: {
    ...mapState('cms/editorStore', [
      'editorData',
      'viewComponentList',
      'dragComponent',
      'initComponentsJson',
      'showSettingMenuFlg',
      'designTemplate',
      'siteColor',
      'companyData',
    ]),
  },
  watch: {
    componentList(value) {
      this.isGlobalEmitting = true
      this.setViewComponentList(JSON.parse(JSON.stringify(value)))
      this.$nextTick(() => {
        this.isGlobalEmitting = false
      })
    },
    viewComponentList(value) {
      if (!this.isGlobalEmitting) {
        this.componentList = JSON.parse(JSON.stringify(value))
      }
    },
  },
  created() {},
  mounted() {
    this.componentList = JSON.parse(JSON.stringify(this.viewComponentList))
  },
  methods: {
    ...mapMutations('cms/editorStore', [
      'setDragComponent',
      'setDragFlg',
      'setViewComponentList',
    ]),
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
    /**
     * 選択中のドラッグ情報のリセット
     */
    resetDrag() {
      this.setDragComponent({})
      this.deleteClone()
      this.setDragFlg(false)
      this.$refs.editorView.cloneIndex = -1
    },
    /**
     * クローンコンポーネントの削除
     */
    deleteClone() {
      if (this.cloneComponent) {
        const newComponentList = JSON.parse(
          JSON.stringify(this.viewComponentList)
        )

        if (this.cloneComponent.onComponentKind === 'viewComponent') {
          newComponentList.splice(this.cloneComponent.componentIndex, 1)
        } else if (this.cloneComponent.onComponentKind === 'layoutComponent') {
          newComponentList[this.cloneComponent.componentIndex].componentList[
            this.cloneComponent.layoutIndex
          ].splice(this.cloneComponent.layoutComponentIndex, 1)
        }
        this.cloneComponent = null

        // this.setViewComponentList(newComponentList)
        // this.$refs.editorView.cloneIndex = -1
      }
    },
  },
  head() {
    return {
      link: [
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500&display=swap',
        },
      ],
      bodyAttrs: {
        class: this.deviceMode === 1 ? 'is-pc' : 'is-sp',
      },
    }
  },
}
</script>

<style lang="scss">
.is-pc {
  @import '~assets/styles/scss/template/commonTemplate_pc.scss';
}
.is-sp {
  @import '~assets/styles/scss/template/commonTemplate_sp.scss';
}
.is-pc .view-area,
.is-sp .view-area {
  &.template {
    &-simple {
      @import '~assets/styles/scss/template/simpleTemplate_common.scss';
      &.is-pc {
        @import '~assets/styles/scss/template/simpleTemplate_pc.scss';
      }
      &.is-sp {
        @import '~assets/styles/scss/template/simpleTemplate_sp.scss';
      }
    }
    &-rich {
      @import '~assets/styles/scss/template/richTemplate_common.scss';
      &.is-pc {
        @import '~assets/styles/scss/template/richTemplate_pc.scss';
      }
      &.is-sp {
        @import '~assets/styles/scss/template/richTemplate_sp.scss';
      }
    }
    &-stylish {
      @import '~assets/styles/scss/template/stylishTemplate_common.scss';
      &.is-pc {
        @import '~assets/styles/scss/template/stylishTemplate_pc.scss';
      }
      &.is-sp {
        @import '~assets/styles/scss/template/stylishTemplate_sp.scss';
      }
    }
    &-friendly {
      @import '~assets/styles/scss/template/friendlyTemplate_common.scss';
      &.is-pc {
        @import '~assets/styles/scss/template/friendlyTemplate_pc.scss';
      }
      &.is-sp {
        @import '~assets/styles/scss/template/friendlyTemplate_sp.scss';
      }
    }
  }
}
</style>
