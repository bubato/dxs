<template>
  <div class="editor-contents">
    <!-- eslint-disable vue/no-v-html -->
    <div class="custom-component">
      <p class="title flex">
        カスタムパーツ<TooltipHelp
          label="カスタムパーツの説明"
          class="tooltip"
          direction="bottom"
        />
      </p>
      <draggable
        tag="ul"
        :group="{ name: 'components', pull: 'clone', put: false }"
        :sort="false"
        @start="dragStart($event, 'customComponent')"
        @end="dragEnd"
      >
        <li
          v-for="(component, index) in customPartsList"
          :key="index"
          :class="{ 'is-disabled': checkExistFormParts() }"
        >
          <SetComponentIcon
            v-if="component.partsJson.componentKind === 'setComponent'"
            :parts-id="component.partsJson.id"
          />
          <LayoutComponentIcon
            v-if="component.partsJson.componentKind === 'layoutComponent'"
            :parts-id="component.partsJson.id"
          />
          <SingleComponentIcon
            v-if="component.partsJson.componentKind === 'singleComponent'"
            :parts-id="component.partsJson.id"
          />
          <DeleteForeverSVG
            class="icon-delete"
            @click="showDeleteCustomPartsComponentModal(component)"
            @mouseover="$common.setAreaLabel($event, 'top', '削除')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="name">
            <p :data-id="component.partsId" v-html="component.partsName"></p>
          </div>
        </li>
      </draggable>
    </div>
    <div class="sets-component">
      <p class="title flex">
        セットパーツ<TooltipHelp
          label="予めレイアウトパーツとシングルパーツを組み合わせたパーツです。"
          class="tooltip"
          direction="bottom"
          left="20"
        />
      </p>
      <draggable
        tag="ul"
        :group="{ name: 'components', pull: 'clone', put: false }"
        :sort="false"
        @start="dragStart($event, 'setComponent')"
        @end="dragEnd"
      >
        <li
          v-for="(component, index) in componentParts.setComponents"
          :key="index"
        >
          <SetComponentIcon :parts-id="component.id" />
          <div class="name">
            <p :data-id="component.id" v-html="component.name"></p>
          </div>
        </li>
      </draggable>
    </div>
    <div class="layouts-component">
      <p class="title flex">
        レイアウトパーツ<TooltipHelp
          label="1～4列のレイアウトを指定するためのパーツです。横に要素を並べたい時に利用します。"
          class="tooltip"
          direction="bottom"
        />
      </p>
      <draggable
        tag="ul"
        :group="{ name: 'components', pull: 'clone', put: false }"
        :sort="false"
        @start="dragStart($event, 'layoutComponent')"
        @end="dragEnd"
      >
        <li
          v-for="(component, index) in componentParts.layoutComponents"
          :key="index"
        >
          <LayoutComponentIcon :parts-id="component.id" />
          <div class="name">
            <p :data-id="component.id" v-html="component.name"></p>
          </div>
        </li>
      </draggable>
    </div>
    <div class="single-component">
      <p class="title flex">
        シングルパーツ<TooltipHelp
          label="ボタンやテキストなど、ページを構成する要素ごとのパーツです。"
          class="tooltip"
          direction="bottom"
        />
      </p>
      <draggable
        tag="ul"
        :group="{ name: 'components', pull: 'clone', put: false }"
        :sort="false"
        @start="dragStart($event, 'singleComponent')"
        @end="dragEnd"
      >
        <li
          v-for="(component, index) in componentParts.singleComponents"
          :key="index"
        >
          <SingleComponentIcon :parts-id="component.id" />
          <div class="name">
            <p :data-id="component.id" v-html="component.name"></p>
          </div>
        </li>
      </draggable>
    </div>
    <div class="form-component">
      <p class="title flex">
        フォームパーツ<TooltipHelp
          label="フォーム機能で作成したフォームをパーツとして利用することができます。"
          class="tooltip"
          direction="bottom"
        />
      </p>
      <draggable
        tag="ul"
        :group="{ name: 'components', pull: 'clone', put: false }"
        :sort="false"
        @start="dragStart($event, 'formComponent')"
        @end="dragEnd"
      >
        <li
          v-for="(component, index) in editorFormList"
          :key="index"
          :class="{ 'is-disabled': checkExistFormParts() }"
        >
          <FormPartsFormName />
          <div class="status">
            <RemoveCircleSVG
              v-if="component.status === '1'"
              class="icon icon-removeCircle"
            />
            <WatchLaterSVG
              v-if="component.status === '2'"
              class="icon icon-watchLater"
            />
            <CheckCircleSVG
              v-if="component.status === '3'"
              class="icon icon-checkCircle now"
            />

            <CheckCircleSVG
              v-if="component.status === '4'"
              class="icon icon-checkCircle end"
            />
          </div>
          <div class="name">
            <p :data-id="component.formId" v-html="component.title"></p>
          </div>
        </li>
      </draggable>
    </div>
    <DeleteCustomPartsComponentModal
      v-if="showDeleteCustomPartsComponentModalFlg"
      :delete-parts-info="deletePartsInfo"
      @close="showDeleteCustomPartsComponentModalFlg = false"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapMutations } from 'vuex'
import FormPartsFormName from '~/assets/svg/editor/formparts_formName.svg'

export default {
  name: 'EditorContents',
  components: {
    draggable,
    FormPartsFormName,
  },
  data() {
    return {
      showDeleteCustomPartsComponentModalFlg: false,
      deletePartsInfo: {},
    }
  },
  computed: {
    ...mapState('cms/editorStore', [
      'componentParts',
      'editorFormList',
      'viewComponentList',
      'customPartsList',
    ]),
    /**
     * 既にフォームパーツが選択されている場合は非活性にする。
     */
    checkExistFormParts() {
      return () => {
        return this.viewComponentList.find(
          (data) => data.componentKind === 'formComponent'
        )
      }
    },
  },
  created() {},
  methods: {
    ...mapMutations('cms/editorStore', ['setDragComponent', 'setDragFlg']),
    /**
     * ドラッグイベント
     * @param {object} e イベントオブジェクト
     * @param {string} componentKind コンポーネントの種類
     */
    dragStart(e, componentKind) {
      const dragItem = {
        componentKind,
        name: e.item.querySelector('.name p').textContent,
        id: e.item.querySelector('.name p').getAttribute('data-id'),
      }

      if (componentKind === 'layoutComponent') {
        dragItem.layoutNum = Number(
          e.item.querySelector('.name p').textContent.slice(0, 1)
        )
      }

      this.setDragFlg(true)
      this.setDragComponent(dragItem)
    },
    dragEnd() {
      this.setDragFlg(false)
      // this.setDragComponent({})
    },
    /**
     * カスタムパーツ削除確認モーダルの表示
     */
    showDeleteCustomPartsComponentModal(deleteParts) {
      this.deletePartsInfo = deleteParts
      this.showDeleteCustomPartsComponentModalFlg = true
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-contents {
  .title {
    font-weight: 500;
  }

  .sortable-ghost {
    outline: 3px solid #dce5fc;
  }
  ul {
    margin-top: 16px;
    margin-bottom: 40px;
    li {
      display: flex;
      flex-direction: column;
      font-size: 13px;
      background: #ffffff;
      cursor: pointer;
    }
  }
  .custom-component,
  .sets-component,
  .layouts-component,
  .single-component,
  .form-component {
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        text-align: center;
        margin-bottom: 16px;
        position: relative;
        .status {
          width: 16px;
          height: 16px;
          line-height: 1;
          position: absolute;
          top: 4px;
          left: 4px;
          .icon {
            width: 16px;
            height: 16px;
            fill: #b0b3be;
            &.icon-checkCircle.now {
              fill: #34c759;
            }
          }
        }
        .name {
          text-align: center;
          p {
            margin-top: 8px;
            display: inline-block;
            text-align: left;
          }
        }
      }
    }
  }
  .custom-component,
  .sets-component,
  .layouts-component,
  .single-component {
    ul {
      li {
        width: 93px;
        &:not(:nth-child(3n)) {
          margin-right: 8px;
        }
      }
    }
  }
  .custom-component {
    .component-icon {
      position: relative;
      &:hover {
        + .icon-delete {
          display: block;
        }
      }
    }
    .icon-delete {
      display: none;
      position: absolute;
      top: 4px;
      right: 4px;
      &:hover {
        display: block;
      }
    }
  }
  .form-component {
    ul {
      li {
        width: 68px;
        &.is-disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        &:not(:nth-child(4n)) {
          margin-right: 8px;
        }
      }
    }
  }
}
.tooltip {
  margin-left: 7px;
}
</style>
