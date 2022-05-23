<template>
  <div
    ref="rootContainer"
    class="layout-container"
    @drop="onDrop"
    @dragover.stop.prevent="onDragOver($event)"
    @dragleave.prevent="onDragLeave($event)"
  >
    <transition-group
      ref="componentListRoot"
      class="view-components"
      :class="{ preview: viewMode === 'preview' }"
      :data-componentIndex="componentIndex"
      name="component-list"
      tag="ul"
    >
      <li
        v-for="(component, index) in editorComponentList"
        :key="component.sequence"
        class="component"
        :class="[
          { clone: component.data.componentKind === 'clone' },
          componentClass(component.data.componentKind),
          {
            hover: checkHoverClass(
              index,
              parentIndex,
              component.data.componentKind
            ),
          },
          component.data.className,
          component.data.componentKind !== 'formComponent'
            ? component.data.id + 'Component'
            : '',
        ]"
        :data-componentkind="component.data.componentKind"
        :data-parent-layout-component="parentLayoutComponent"
        :data-parent-index="parentIndex"
        :data-index="index"
        @mousemove="
          setHoverComponent(
            index,
            parentIndex,
            parentLayoutComponent,
            component.data.componentKind,
            true,
            $event
          )
        "
        @mouseleave="
          setHoverComponent(
            index,
            parentIndex,
            parentLayoutComponent,
            component.data.componentKind,
            false,
            $event
          )
        "
        @dragstart="onDragSelectParts"
      >
        <span
          v-if="
            checkShowComponentName(
              component.data.componentKind,
              parentLayoutComponent
            ) &&
            checkHoverClass(index, parentIndex, component.data.componentKind)
          "
          class="component-name"
        >
          {{ component.data.name }}
        </span>
        <div
          v-if="
            checkHoverClass(index, parentIndex, component.data.componentKind) &&
            viewMode === 'editor'
          "
          class="menu_buttons"
        >
          <button
            :class="{
              'btn-disabled': checkDisabledEditBtn(
                component.data.id,
                component.data.componentKind
              ),
            }"
            @mouseover="$common.setAreaLabel($event, 'top', '編集')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
            @click="editComponent(index, component.data.componentKind, $event)"
          >
            <CreateSVG />
          </button>
          <button
            v-if="component.data.componentKind !== 'formComponent'"
            :class="{
              'btn-disabled': checkDisabledEditBtn(
                component.data.id,
                component.data.componentKind
              ),
            }"
            @click="saveCustomPartsComponent(component.data)"
            @mouseover="$common.setAreaLabel($event, 'top', '保存')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          >
            <GradeSVG />
          </button>
          <button
            v-if="
              (componentIndex === 0 &&
                index != 0 &&
                index != componentList.length - 1) ||
              componentIndex > 0
            "
            :class="{
              'btn-disabled': checkDisabledDeleteBtn(componentIndex, index),
            }"
            @click="exeDelete(index, $event)"
            @mouseover="$common.setAreaLabel($event, 'top', '削除')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          >
            <DeleteForeverSVG />
          </button>
          <button
            :class="{
              'btn-disabled': isDisabledUpwardBtn(componentIndex, index),
            }"
            @mouseover="$common.setAreaLabel($event, 'top', '上に移動')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
            @click="moveComponent(index, $event, 'upward')"
          >
            <ArrowUpwardSVG />
          </button>
          <button
            :class="{
              'btn-disabled': isDisabledDownwardBtn(componentIndex, index),
            }"
            @mouseover="$common.setAreaLabel($event, 'top', '下に移動')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
            @click="moveComponent(index, $event, 'downward')"
          >
            <ArrowDownwardSVG />
          </button>
        </div>
        <div
          v-if="component.data.componentKind === 'setComponent'"
          class="set-component-area"
        >
          <ViewHeader
            v-if="component.data.id === 'header'"
            :component="component.data"
          />
          <ViewMainArea
            v-if="component.data.id === 'mainArea'"
            :component="component.data"
          />
          <ViewBreadcrumb
            v-if="component.data.id === 'breadcrumb'"
            :component="component.data"
          />
          <ViewMessage
            v-if="component.data.id === 'message'"
            :component="component.data"
          />
          <ViewOneLineNews
            v-if="component.data.id === 'oneLineNews'"
            :component="component.data"
          />
          <ViewTextWithTopImages
            v-if="component.data.id === 'textWithTopImages'"
            :component="component.data"
          />
          <ViewTextWithLeftAndRightImages
            v-if="component.data.id === 'textWithLeftAndRightImages'"
            :component="component.data"
          />
          <ViewListDisplay
            v-if="component.data.id === 'listDisplay'"
            :component="component.data"
          />
          <ViewCompanyOverview
            v-if="component.data.id === 'companyOverview'"
            :component="component.data"
          />
          <ViewMap
            v-if="component.data.id === 'map'"
            :component="component.data"
          />
          <ViewConversion
            v-if="component.data.id === 'conversion'"
            :component="component.data"
          />
          <ViewStep
            v-if="component.data.id === 'step'"
            :component="component.data"
          />
          <ViewCustomerVoice
            v-if="component.data.id === 'customerVoice'"
            :component="component.data"
          />
          <ViewOptOut
            v-if="component.data.id === 'optOut'"
            :component="component.data"
          />
          <ViewFooter
            v-if="component.data.id === 'footer'"
            :component="component.data"
          />
        </div>
        <div
          v-if="component.data.componentKind === 'layoutComponent'"
          class="layout-column-area"
          :class="[
            mixin_getSpaceClass(component.data.spaceInfo),
            {
              hover: checkHoverClass(
                index,
                parentIndex,
                component.data.componentKind
              ),
            },
          ]"
        >
          <div
            v-for="(layout, num) in component.data.layoutNum"
            :key="num"
            class="layout-column component"
            :class="[
              'column-' + component.data.layoutNum,
              getLayoutClass(
                component.data.layoutNum,
                component.data.layoutType,
                num
              ),
            ]"
            :data-layoutIndex="num"
            :data-componentkind="component.data.componentKind"
          >
            <ViewComponent
              v-model="component.data.componentList[num]"
              :parent-layout-component="true"
              :parent-index="index"
              :component-index="componentIndex + 1"
              :view-mode="viewMode"
              :nested-level="nestedLevel + 1"
              @targeted="onChildTargetedStateChanged(true)"
              @unTargeted="onChildTargetedStateChanged(false)"
            />
          </div>
        </div>
        <div
          v-if="component.data.componentKind === 'singleComponent'"
          class="single_component_content"
        >
          <ViewHeading1
            v-if="component.data.id === 'heading1'"
            :component="component.data"
          />
          <ViewHeading2
            v-if="component.data.id === 'heading2'"
            :component="component.data"
          />
          <ViewHeading3
            v-if="component.data.id === 'heading3'"
            :component="component.data"
          />
          <ViewHeading4
            v-if="component.data.id === 'heading4'"
            :component="component.data"
          />
          <ViewText
            v-if="component.data.id === 'text'"
            :component="component.data"
          />
          <ViewAnnotation
            v-if="component.data.id === 'annotation'"
            :component="component.data"
          />
          <ViewList
            v-if="component.data.id === 'list'"
            :component="component.data"
          />
          <ViewImage
            v-if="component.data.id === 'image'"
            :component="component.data"
          />
          <ViewTable
            v-if="component.data.id === 'table'"
            :component="component.data"
          />
          <ViewSeparator
            v-if="component.data.id === 'separator'"
            :component="component.data"
          />
          <ViewButton
            v-if="component.data.id === 'button'"
            :component="component.data"
          />
          <ViewSpace
            v-if="component.data.id === 'space'"
            :component="component.data"
          />
          <ViewMovie
            v-if="component.data.id === 'movie'"
            :component="component.data"
          />
          <ViewAccordion
            v-if="component.data.id === 'accordion'"
            :component="component.data"
          />
        </div>
        <div
          v-if="component.data.componentKind === 'formComponent'"
          class="form_component_content"
        >
          <div v-if="viewMode === 'editor'" class="form-name">
            <FormIconSVG />
            <span>{{ component.data.name }}</span>
          </div>
          <div id="xhm-form"></div>
          <template v-if="viewMode === 'preview'">
            <script
              type="application/javascript"
              :src="component.data.previewSrc"
              defer
              charset="UTF-8"
            ></script>
          </template>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'
import ViewComponent from '~/components/cms/editor/viewArea/ViewComponent'

export default {
  name: 'ViewComponent',
  components: {
    ViewComponent,
  },
  mixins: [cmsEditorCommonMixin],
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    viewMode: {
      type: String,
      default: '',
    },
    nestedLevel: {
      type: Number,
      default: 0,
    },
    parentLayoutComponent: {
      type: Boolean,
      default: false,
    },
    parentIndex: {
      type: Number,
      default: null,
    },
    componentIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    const componentList = this.value.map((e, sequence) => {
      return {
        sequence,
        fixed: true,
        data: e,
      }
    })

    return {
      sequence: componentList.length + 1,
      cellListInfo: null,
      dropRect: null,
      hasClone: false,
      isEmitting: false,
      componentList,
      cloneIndex: -1,
      isChildTarget: false,
      editorComponentList: componentList.map((e) => e),
      hoverTarget: {
        index: null,
        parentIndex: null,
        parentLayoutComponent: false,
        componentKind: '',
        hoverFlg: false,
      },
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    ...mapState('cms/editorStore', [
      'dragComponent',
      'initComponentsJson',
      // 'viewComponentList',
      'targetComponent',
      'dragFlg',
      'editorFormList',
      'customPartsList',
    ]),
    getLayoutClass() {
      return (layoutNum, layoutType, index) => {
        let returnClassName = ''

        if (layoutNum === 2) {
          if (layoutType === '1') {
            returnClassName = 'layout-50'
          } else if (layoutType === '2') {
            if (index === 0) {
              returnClassName = 'layout-33'
            } else if (index === 1) {
              returnClassName = 'layout-66'
            }
          } else if (layoutType === '3') {
            if (index === 0) {
              returnClassName = 'layout-66'
            } else if (index === 1) {
              returnClassName = 'layout-33'
            }
          }
        } else if (layoutNum === 3) {
          if (layoutType === '1') {
            returnClassName = 'layout-33'
          } else if (layoutType === '2') {
            if (index === 0) {
              returnClassName = 'layout-50'
            } else if (index === 1) {
              returnClassName = 'layout-25'
            } else if (index === 2) {
              returnClassName = 'layout-25'
            }
          } else if (layoutType === '3') {
            if (index === 0) {
              returnClassName = 'layout-25'
            } else if (index === 1) {
              returnClassName = 'layout-50'
            } else if (index === 2) {
              returnClassName = 'layout-25'
            }
          } else if (layoutType === '4') {
            if (index === 0) {
              returnClassName = 'layout-25'
            } else if (index === 1) {
              returnClassName = 'layout-25'
            } else if (index === 2) {
              returnClassName = 'layout-50'
            }
          }
        } else if (layoutNum === 4) {
          returnClassName = 'layout-25'
        }

        return returnClassName
      }
    },
    /**
     * コンポーネントに紐づくクラスの取得
     *
     * @param {string} componentKind コンポーネントの種類
     */
    componentClass() {
      return (componentKind) => {
        let returnClassName = ''

        if (componentKind === 'setComponent') {
          returnClassName = 'set-component'
        } else if (componentKind === 'layoutComponent') {
          returnClassName = 'layout-component'
        } else if (componentKind === 'singleComponent') {
          returnClassName = 'single-component'
        } else if (componentKind === 'formComponent') {
          returnClassName = 'form-component'
        }

        return returnClassName
      }
    },
    /**
     * コンポーネント名表示判定
     *
     * @param {string} componentKind コンポーネントの種類
     */
    checkShowComponentName() {
      return (componentKind) => {
        let result = false

        if (
          !['layoutComponent', 'clone'].includes(componentKind) &&
          this.viewMode === 'editor'
        ) {
          result = true
        }

        return result
      }
    },
    /**
     * ホバークラスの付与判定
     */
    checkHoverClass() {
      return (index, parentIndex, componentKind) => {
        let result = false

        if (
          this.hoverTarget.hoverFlg &&
          index === this.hoverTarget.index &&
          parentIndex === this.hoverTarget.parentIndex &&
          componentKind === this.hoverTarget.componentKind
        ) {
          if (this.hoverTarget.componentKind === 'setComponent') {
            result = true
          } else if (
            ['layoutComponent', 'singleComponent', 'formComponent'].includes(
              this.hoverTarget.componentKind
            ) &&
            this.hoverTarget === this.targetComponent
          ) {
            result = true
          }
        }

        return result
      }
    },
  },
  watch: {
    value(value) {
      if (this.isEmitting) {
        return
      }
      this.componentList.splice(0)
      value.forEach((e, index) => {
        this.componentList.push({
          sequence: this.generateSequence(),
          fixed: true,
          data: e,
        })
      })
    },
    componentList(value) {
      this.editorComponentList.splice(0)
      value.forEach((e) => {
        this.editorComponentList.push(e)
      })
    },
    cloneIndex(value) {
      const clone = {
        sequence: -1,
        fixed: true,
        data: {
          id: 'clone',
          name: 'clone',
          componentKind: 'clone',
          componentList: [],
        },
      }
      const list = this.componentList.map((e) => e)
      if (value > -1) {
        list.splice(value, 0, clone)
      }
      this.editorComponentList = list
    },
    dragFlg(value) {
      if (value) {
        this.hasClone = false
        this.dropRect = this.createDropRect()
        this.cellListInfo = this.createListHeightList()
      } else {
        this.hasClone = false
        this.dropRect = null
        this.cellListInfo = null
        this.deleteClone()
      }
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('cms/editorStore', [
      'setEditComponentModalData',
      'showEditSetComponentModal',
      // 'setViewComponentList',
      'setTargetComponent',
      'setSelectDeleteEditorInfo',
      'showDeleteEditorPartsModal',
      'setDragComponent',
      'setDragFlg',
      'setShowSaveCustomPartsComponentModalState',
      'setSelectComponentParts',
    ]),
    onDragSelectParts(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    generateSequence() {
      this.sequence += 1
      return this.sequence
    },
    insertComponent(index, componentInfo) {
      if (index > -1) {
        this.componentList.splice(index, 0, {
          sequence: this.generateSequence(),
          data: JSON.parse(JSON.stringify(componentInfo)),
        })
      }
      this.emitEditorData()
    },
    /**
     * コンポーネントJSONの初期値取得
     *
     * @param {string} componentType setComponent or singleComponent
     */
    getInitComponent(componentType) {
      let initComponentObj = {}

      if (componentType === 'formComponent') {
        initComponentObj = {
          componentKind: 'formComponent',
          id: this.dragComponent.id,
          name: this.dragComponent.name,
          previewSrc: this.getFormPartsSrc(this.dragComponent.id),
        }
      } else if (componentType === 'customComponent') {
        const customPartsInfo = this.customPartsList.find(
          (data) => data.partsId === Number(this.dragComponent.id)
        )

        initComponentObj = customPartsInfo.partsJson
        initComponentObj.customPartsId = customPartsInfo.partsId
      } else {
        initComponentObj = this.initComponentsJson[componentType][
          this.dragComponent.id
        ]
      }

      if (!initComponentObj) {
        initComponentObj = {}
      }

      return initComponentObj
    },
    /**
     * フォームのsrc属性の取得
     */
    getFormPartsSrc(formId) {
      const targetForm = this.editorFormList.find(
        (data) => data.formId === Number(formId)
      )
      const previewTag = targetForm.previewScriptTag
      let scriptSrc = previewTag.match(/src="(\\.|[^"\\])*"/g)

      if (scriptSrc !== null) {
        scriptSrc = scriptSrc[0].replace('src=', '').replace(/"/g, '')
      }

      return scriptSrc
    },
    emitEditorData() {
      this.isEmitting = true
      this.$emit(
        'input',
        this.componentList.map((c) => {
          return c.data
        })
      )
      this.$nextTick(() => {
        this.isEmitting = false
      })
    },
    onDrop() {
      if (!this.dragComponent.id) {
        return
      }

      this.insertComponent(
        this.cloneIndex,
        this.getInitComponent(this.dragComponent.componentKind)
      )
      this.cloneIndex = -1
      this.isChildTarget = false
    },
    isAcceptableParts(componentKind) {
      if (this.nestedLevel > 0) {
        const index = [
          'setComponent',
          'layoutComponent',
          'formComponent',
        ].indexOf(componentKind)
        if (index > -1) {
          return false
        }
      }
      return true
    },
    isInsideComponentEvent(e) {
      const rect = this.dropRect
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      const marginH = 0
      const marginW = 0

      if (point.y < 0) {
        return false
      }
      if (this.nestedLevel) {
        if (point.y > rect.height + marginH) {
          return false
        }
      }
      if (point.x < 0) {
        return false
      }
      if (point.x > rect.width + marginW) {
        return false
      }
      return true
    },
    createListHeightList() {
      let baseY = 0
      let cloneInfo = null
      const list = []
      this.$refs.componentListRoot.children.some((c, i) => {
        const cell = c.elm
        const rect = cell.getBoundingClientRect()

        const style = getComputedStyle(cell)
        const margin =
          (parseFloat(style.marginTop) || 0) +
          (parseFloat(style.marginBottom) || 0)
        if (i < 1) {
          baseY = rect.top - (parseFloat(style.marginTop) || 0)
        }

        const height = cell.getBoundingClientRect().height + margin
        const isClone = cell.classList.contains('clone')
        const cellInfo = {
          height,
          clone: isClone,
          layout: cell.classList.contains('layout-component'),
        }
        if (isClone) {
          cloneInfo = cellInfo
        }
        list.push(cellInfo)
      })
      return {
        cells: list,
        cloneInfo,
        baseOffsetY: baseY,
      }
    },
    moveClone(index) {
      if (!this.cellListInfo.cells) {
        return
      }

      const cells = []
      this.cellListInfo.cells.forEach((c, i) => {
        if (!c.clone) {
          cells.push(c)
        } else if (i === index) {
          cells.push(c)
        }
      })
      this.cellListInfo.cells = cells
    },
    createDropRect() {
      const rect = this.$refs.rootContainer.getBoundingClientRect()
      const style = getComputedStyle(this.$refs.rootContainer)
      const marginW =
        (parseFloat(style.marginLeft) || 0) +
        (parseFloat(style.marginRight) || 0)

      return {
        top: rect.top,
        left: rect.left,
        width: rect.width + marginW,
        height: rect.height,
      }
    },
    onDragOver($event) {
      if (!this.dragComponent.id) {
        return
      }

      if (!this.isAcceptableParts(this.dragComponent.componentKind)) {
        return
      }

      if (this.isChildTarget) {
        return
      }

      let cloneIndex = 0

      if (this.componentList.length < 1) {
        this.cloneIndex = cloneIndex
        this.$emit('targeted', this)
        return
      }

      let isFound = false

      if (!this.cellListInfo.cloneInfo) {
        if (this.cloneIndex > -1) {
          this.cellListInfo = this.createListHeightList()
        }
      }

      this.moveClone(this.cloneIndex)

      const cellListInfo = this.cellListInfo
      const rect = this.dropRect
      const x = $event.clientX - rect.left
      let y = $event.clientY - rect.top

      if (x < 0 || x > rect.width || y < 0) {
        cloneIndex = -1
      } else {
        isFound = cellListInfo.cells.some((c, i) => {
          if (y < c.height * 0.5) {
            return true
          }

          if (cellListInfo.cells === cellListInfo.cells.length - 1) {
            if (y <= c.height) {
              if (c.layout) {
                return false
              }
              return true
            }
          }

          y -= c.height

          if (!c.clone) {
            cloneIndex++
            if (this.nestedLevel > 0) {
              if (i >= cellListInfo.cells.length - 1) {
                return true
              }
            }
          }
        })
      }

      if (isFound) {
        if (this.nestedLevel < 1) {
          if (cloneIndex < 1) {
            cloneIndex = 1
          }
          if (cloneIndex >= this.componentList.length) {
            cloneIndex = this.componentList.length - 1
          }
        }

        this.cloneIndex = cloneIndex
        this.$emit('targeted', this)
      } else {
        this.cloneIndex = -1
        this.$emit('unTargeted', this)
      }
    },
    onChildTargetedStateChanged(isTargeted, component) {
      this.isChildTarget = isTargeted

      if (isTargeted) {
        this.$refs.componentListRoot.children.forEach((e) => {
          if (e !== component) {
            if (e.deleteClone) {
              e.deleteClone()
            }
          }
        })

        this.cloneIndex = -1
        this.$emit('targeted', this)
      } else {
        this.$emit('unTargeted', this)
      }
    },
    onDragLeave(e) {
      if (!this.isInsideComponentEvent(e)) {
        this.cloneIndex = -1
        this.$emit('unTargeted', this)
      }
    },
    setHoverComponent(
      index,
      parentIndex,
      parentLayoutComponent,
      componentKind,
      hoverFlg,
      e
    ) {
      if (hoverFlg) {
        if (e.buttons) {
          e.stopPropagation()
          return
        }
      }
      this.hoverTarget = {
        index,
        parentIndex,
        parentLayoutComponent,
        componentKind,
        hoverFlg,
      }

      if (
        e.target
          .closest('[data-componentKind]')
          .getAttribute('data-componentKind') === 'singleComponent'
      ) {
        e.stopPropagation()
      }

      this.setTargetComponent(this.hoverTarget)
    },
    /**
     * コンポーネントメニュー 編集ボタンの非活性判定
     */
    checkDisabledEditBtn(componentId, componentKind) {
      const disabledIds = ['header', 'breadcrumb', 'separator', 'footer']

      return (
        disabledIds.includes(componentId) || componentKind === 'formComponent'
      )
    },
    /**
     * コンポーネントメニュー 削除ボタンの非活性判定
     */
    checkDisabledDeleteBtn() {
      return false
    },
    /**
     * コンポーネントメニュー 上に移動ボタンの非活性判定
     */
    isDisabledUpwardBtn(componentIndex, index) {
      let result = false

      if (componentIndex === 0) {
        if (
          index === 0 ||
          index < 2 ||
          index === this.componentList.length - 1
        ) {
          result = true
        }
      } else if (index === 0) {
        result = true
      }

      return result
    },
    /**
     * コンポーネントメニュー 下に移動ボタンの非活性判定
     */
    isDisabledDownwardBtn(componentIndex, index) {
      let result = false

      if (componentIndex === 0) {
        if (
          index === 0 ||
          index > this.componentList.length - 3 ||
          index === this.componentList.length - 1
        ) {
          result = true
        }
      } else if (index === this.componentList.length - 1) {
        result = true
      }

      return result
    },
    /**
     * コンポーネント編集モーダルを表示
     *
     * @param {int} index コンポーネントインデックス
     * @param {string} componentKind コンポーネントの種類
     * @param {obj} e クリックオブジェクト
     */
    editComponent(index, componentKind, e) {
      const editComponentModalData = {
        selectComponentInfo: {
          componentName: this.componentList[index].data.name,
          componentKind,
          parentIndex: null,
          layoutIndex: null,
          index,
        },
        targetComponent: {},
      }
      const parentIndex = e.target.closest('[data-layoutIndex]')
        ? e.target.closest('.layout-component').getAttribute('data-index')
        : null
      const layoutIndex = e.target.closest('[data-layoutIndex]')
        ? e.target
            .closest('[data-layoutIndex]')
            .getAttribute('data-layoutIndex')
        : null

      if (e.target.closest('[data-layoutIndex]')) {
        editComponentModalData.selectComponentInfo.parentIndex = parentIndex
        editComponentModalData.selectComponentInfo.layoutIndex = layoutIndex
      }

      editComponentModalData.targetComponent = this.componentList[index].data

      if (componentKind === 'layoutComponent') {
        editComponentModalData.selectComponentInfo.componentName =
          'レイアウトパーツ：' +
          editComponentModalData.selectComponentInfo.componentName
      }

      this.setEditComponentModalData(editComponentModalData)
      this.showEditSetComponentModal()
    },
    /**
     * カスタムパーツとして保存処理
     *
     * @param {object} component コンポーネント
     */
    saveCustomPartsComponent(component) {
      this.setSelectComponentParts(component)
      this.setShowSaveCustomPartsComponentModalState(true)
    },
    /**
     * 削除ボタン押下処理
     */
    exeDelete(index, e) {
      const parentIndex = e.target.closest('[data-layoutIndex]')
        ? e.target.closest('.layout-component').getAttribute('data-index')
        : null
      const layoutIndex = e.target.closest('[data-layoutIndex]')
        ? e.target
            .closest('[data-layoutIndex]')
            .getAttribute('data-layoutIndex')
        : null
      this.setSelectDeleteEditorInfo({
        parentIndex,
        layoutIndex,
        index,
      })
      this.showDeleteEditorPartsModal()
    },
    /**
     * コンポーネントの削除
     *
     * @param {int} index コンポーネントインデックス
     * @param {obj} e クリックオブジェクト
     * @param {string} moveType delete(削除) or upward(上に移動) or downward(下に移動)
     */
    moveComponent(index, e, moveType) {
      const newComponentList = this.componentList
      if (moveType === 'delete') {
        // not used....
      } else if (moveType === 'upward') {
        newComponentList.splice(
          index - 1,
          2,
          newComponentList[index],
          newComponentList[index - 1]
        )
        if (index > 0) {
          this.componentList = newComponentList
        }
      } else if (moveType === 'downward') {
        newComponentList.splice(
          index,
          2,
          newComponentList[index + 1],
          newComponentList[index]
        )
        this.componentList = newComponentList
      }

      this.emitEditorData()
    },
    deleteClone() {
      if (this.cloneIndex < 0) {
        return
      }

      this.cloneIndex = -1
    },
  },
}
</script>

<style lang="scss" scoped>
.component-list-move {
  transition: transform 0.1s;
}
li.clone {
  pointer-events: none;
}
ul.view-components .menu_buttons button.btn-disabled {
  background: #cdced0;
  &::before {
    border-radius: none;
    background: none;
  }
  icon {
    fill: #b0b3be;
  }
}
ul.view-components .menu_buttons button:not(:last-child):after {
  content: '';
  display: block;
  position: absolute;
  top: 1px;
  right: 0;
  height: calc(100% - 2px);
  content: '';
  width: 1px;
  background-color: #e5e5e5;
  left: auto;
  z-index: 0;
}
ul.view-components .menu_buttons button.btn-disabled:not(:last-child):after {
  background-color: #fff;
}
ul.view-components .form-name {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
ul.view-components .form-name span {
  padding-left: 1em;
  font-size: 16px;
}
</style>
