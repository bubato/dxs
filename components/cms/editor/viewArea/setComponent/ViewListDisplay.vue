<template>
  <div class="view-listDisplay">
    <h2 class="heading">{{ component.title }}</h2>
    <div v-if="component.style === '1'" class="style-text">
      <div v-for="(pageInfo, index) in getPageList()" :key="index" class="list">
        <p class="create-date">{{ pageInfo.createDate }}</p>
        <a
          class="name link"
          v-bind="$common.getCmsEditorLinkAttr(pageInfo.path)"
          >{{ pageInfo.name }}</a
        >
      </div>
      <a
        v-if="allPageList.length > getShowDisp()"
        class="btn btn-middle btn-basic"
        v-bind="$common.getCmsEditorLinkAttr(pagePath)"
      >
        {{ getPathName(component.selectPageId) }}の一覧を見る
      </a>
    </div>
    <div v-if="component.style === '2'" class="style-image">
      <div v-for="(pageInfo, index) in getPageList()" :key="index" class="list">
        <img
          class="image"
          :src="
            pageInfo.image || $common.getAssetsImgUrl('images/no-image.png')
          "
          loading="lazy"
        />
        <p class="name">{{ pageInfo.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ViewListDisplay',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      allPageList: [],
      pagePath: '',
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['editorData']),
    getPageList() {
      return () => {
        const pageId = this.component.selectPageId
        const pageList = this.editorData.pageListData.underContents
        const showDisp = this.getShowDisp()
        let filterPageList = []

        if (this.$common.checkArrayValue(pageList)) {
          for (let i = 0; i < pageList.length; i++) {
            if (pageList[i].id === pageId) {
              this.allPageList = pageList[i].underContents || []
              this.pagePath = pageList[i].path
              filterPageList = this.allPageList.filter((item, i) => {
                return i < showDisp
              })
            }
          }
        }

        return filterPageList
      }
    },
    getPathName() {
      return (id) => {
        const pageInfo = this.editorData.pageListData.underContents.find(
          (item) => item.id === Number(id)
        )

        return pageInfo.name
      }
    },
  },
  methods: {
    getShowDisp() {
      let showDisp = 0

      switch (this.component.showDisp) {
        case '1':
          showDisp = 5
          break
        case '2':
          showDisp = 10
          break
        case '3':
          showDisp = 20
          break
      }

      return showDisp
    },
  },
}
</script>

<style lang="scss" scoped>
.view-listDisplay {
  .btn {
    max-width: 224px;
  }
}
.is-sp ul.view-components {
  .view-listDisplay {
    .buttons .btn {
      display: flex;
    }
  }
}
</style>
