<template>
  <div class="editor-settings" :class="{ open: showSettingMenuFlg }">
    <div v-if="showSettingMenuFlg" class="show_setting_menu">
      <ul class="select_tabs">
        <li
          :class="{ selected: selectSettingTab === 1 }"
          @click="changeSelectSettingTab(1)"
        >
          コンテンツ
        </li>
        <li
          :class="{ selected: selectSettingTab === 2 }"
          @click="changeSelectSettingTab(2)"
        >
          ページプロパティ
        </li>
        <li
          :class="{ selected: selectSettingTab === 3 }"
          @click="changeSelectSettingTab(3)"
        >
          公開設定
        </li>
      </ul>
      <div class="tab_contents">
        <EditorContents v-if="selectSettingTab === 1" />
        <EditorPageProperty v-if="selectSettingTab === 2" />
        <EditorPublishingSettings v-if="selectSettingTab === 3" />
      </div>
    </div>
    <div class="toggle_sideMenu">
      <KeyBoardTabSVG
        class="toggle_btn icon-keyBoardTab"
        @click="toggleSettingMenu()"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import EditorPageProperty from '~/components/cms/editor/editorSettings/EditorPageProperty.vue'
import EditorContents from '~/components/cms/editor/editorSettings/EditorContents.vue'
import EditorPublishingSettings from '~/components/cms/editor/editorSettings/EditorPublishingSettings.vue'

export default {
  name: 'EditorSettings',
  components: {
    EditorPageProperty,
    EditorContents,
    EditorPublishingSettings,
  },
  computed: {
    ...mapState('cms/editorStore', ['selectSettingTab', 'showSettingMenuFlg']),
  },
  created() {},
  methods: {
    ...mapMutations('cms/editorStore', [
      'showSettingMenu',
      'hideSettingMenu',
      'changeSelectSettingTab',
    ]),
    toggleSettingMenu() {
      if (this.showSettingMenuFlg) {
        this.hideSettingMenu()
      } else {
        this.showSettingMenu()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-settings {
  display: flex;
  height: 100%;
  background: #f7f8f9;
  .show_setting_menu {
    display: flex;
    background: #ffffff;
    .select_tabs {
      width: 144px;
      height: 100%;
      padding-top: 25px;
      border-right: 1px solid #e5e5e5;
      li {
        display: flex;
        align-items: center;
        padding-left: 16px;
        color: #333333;
        height: 40px;
        font-size: 13px;
        text-align: center;
        background: #ffffff;
        position: relative;
        cursor: pointer;
        &*hover {
          opacity: 0.7;
        }

        &.selected {
          background: #ebeced;
        }
      }
    }
    .tab_contents {
      width: 330px;
      padding: 32px 16px;
      border-right: 1px solid #e5e5e5;
      overflow: scroll;
      -ms-overflow-style: none; /* IE, Edge 対応 */
      scrollbar-width: none; /* Firefox 対応 */
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .toggle_sideMenu {
    width: 43px;
    height: 100%;
    background: #ffffff;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-right: 1px solid #e5e5e5;
    align-items: center;
    .toggle_btn {
      cursor: pointer;
    }
  }
  &.open {
    .toggle_btn {
      transform: scale(-1, 1);
    }
  }
}
.icon-keyBoardTab {
  fill: #3a435c;
}
</style>
