<template>
  <div class="mail-settings">
    <!-- eslint-disable vue/no-v-html -->
    <div class="form-block">
      <div class="form-item">
        <RequiredFormLabel class="title" label="メール件名" :required="true" />
        <CustomInputText
          v-model="mailSettings.mailSubject"
          class="mailSubject"
          placeholder="メールの送信元を入力してください"
          maxlength="50"
          :validation="
            $common.getFormItemsDetail(formItems, 'mailSubject').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="メール本文" :required="true" />
        <CustomInputRadio
          v-model="mailSettings.mailType"
          name="conditionKind"
          :options="mailTypeOptions"
        />
        <div v-if="mailSettings.mailType === '0'" class="merge-string-mode">
          <p class="context">
            右クリックで差し込み可能な項目が表示されます。項目をクリックすると本文に入力されます。
          </p>
          <TextMailBodyEditor
            v-if="pageListData"
            v-model="mailSettings.mailBody"
            class="mailBody"
            :placeholder="textMailPlaceholder"
            :validation="
              $common.getFormItemsDetail(formItems, 'mailBody').validation
            "
          />
        </div>
        <div v-else-if="mailSettings.mailType === '1'" class="edit-html-mode">
          <p class="context">
            点線で括られたエリアに下のフォームパーツをドラッグ＆ドロップして設置してください。
          </p>
          <div class="edit-html-mail">
            <div class="setting-parts">
              <div class="parts-info">
                <p class="title">背景色</p>
                <ul class="select-color-list">
                  <li
                    v-for="colorCode in backgroundColorList"
                    :key="colorCode"
                    @click="selectBackgroundColor = colorCode"
                  >
                    <label
                      :style="{ 'background-color': colorCode }"
                      class="color"
                      :class="{ selected: selectBackgroundColor === colorCode }"
                    >
                      <input
                        v-model="selectBackgroundColor"
                        type="radio"
                        :value="colorCode"
                      />
                      <CheckSVG
                        v-if="selectBackgroundColor === colorCode"
                        class="icon icon-check"
                        :class="{
                          'icon-color-black':
                            selectBackgroundColor === '#ffffff',
                        }"
                      />
                    </label>
                  </li>
                </ul>
              </div>
              <div class="parts-info">
                <p class="title">本文背景色</p>
                <ul class="select-color-list">
                  <li
                    v-for="colorCode in backgroundColorList"
                    :key="colorCode"
                    @click="selectMainBackgroundColor = colorCode"
                  >
                    <label
                      :style="{ 'background-color': colorCode }"
                      class="color"
                      :class="{
                        selected: selectMainBackgroundColor === colorCode,
                      }"
                    >
                      <input
                        v-model="selectMainBackgroundColor"
                        type="radio"
                        :value="colorCode"
                      />
                      <CheckSVG
                        v-if="selectMainBackgroundColor === colorCode"
                        class="icon icon-check"
                        :class="{
                          'icon-color-black':
                            selectMainBackgroundColor === '#ffffff',
                        }"
                      />
                    </label>
                  </li>
                </ul>
              </div>
              <div class="parts-info">
                <p class="title">テキストカラー</p>
                <ul class="select-color-list">
                  <li
                    v-for="colorCode in textColorList"
                    :key="colorCode"
                    @click="selectTextColor = colorCode"
                  >
                    <label
                      :style="{ 'background-color': colorCode }"
                      class="color"
                      :class="{
                        selected: selectTextColor === colorCode,
                      }"
                    >
                      <input
                        v-model="selectTextColor"
                        type="radio"
                        :value="colorCode"
                      />
                      <CheckSVG
                        v-if="selectTextColor === colorCode"
                        class="icon icon-check"
                        :class="{
                          'icon-color-black': selectTextColor === '#ffffff',
                        }"
                      />
                    </label>
                  </li>
                </ul>
              </div>
              <div class="parts-info">
                <p class="title">レイアウトパーツ</p>
                <draggable
                  tag="ul"
                  class="select-layout-components"
                  :group="{ name: 'components', pull: 'clone', put: false }"
                  :sort="false"
                  @start="dragStart($event, 'layoutComponent')"
                  @end="dragEnd"
                >
                  <li
                    v-for="(component, index) in layoutComponents"
                    :key="index"
                  >
                    <MailLayoutComponentIcon :parts-id="component.id" />
                    <div class="name">
                      <p :data-id="component.id" v-html="component.name"></p>
                    </div>
                  </li>
                </draggable>
              </div>
              <div class="parts-info">
                <p class="title">シングルパーツ</p>
                <draggable
                  tag="ul"
                  class="select-single-components"
                  :group="{ name: 'components', pull: 'clone', put: false }"
                  :sort="false"
                  @start="dragStart($event, 'singleComponent')"
                  @end="dragEnd"
                >
                  <li
                    v-for="(component, index) in singleComponents"
                    :key="index"
                  >
                    <MailSingleComponentIcon :parts-id="component.id" />
                    <div class="name">
                      <p :data-id="component.id" v-html="component.name"></p>
                    </div>
                  </li>
                </draggable>
              </div>
            </div>
            <div class="editor-area">
              <div
                ref="rootContainer"
                class="rootContainer"
                :style="{ 'background-color': selectBackgroundColor }"
                @drop="onDrop"
                @dragover.stop.prevent="onDragOver($event)"
                @dragleave.prevent="onDragLeave($event)"
              >
                <div
                  class="view-components"
                  :style="[
                    { 'background-color': selectMainBackgroundColor },
                    { color: selectTextColor },
                  ]"
                >
                  <div
                    v-for="(component, index) in editorComponentList"
                    :key="index"
                    class="component"
                    :class="[{ clone: component.clone }]"
                    :data-componentIndex="index"
                    @mouseover="mouseOverAction"
                    @mouseleave="mouseLeaveAction"
                  >
                    <MailComponentHoverElements
                      v-if="!component.clone && hoverFlag"
                      :component="component"
                      :upward-btn-disabled="index === 0"
                      :downward-btn-disabled="
                        index === editorComponentList.length - 1
                      "
                      :index-obj="{
                        index: index,
                      }"
                      @up="
                        moveComponent(
                          {
                            index: index,
                          },
                          'upward'
                        )
                      "
                      @down="
                        moveComponent(
                          {
                            index: index,
                          },
                          'downward'
                        )
                      "
                    />
                    <table
                      v-if="
                        component.componentKind === 'layoutComponent' &&
                        !component.clone
                      "
                      class="layout-component"
                    >
                      <tbody>
                        <tr class="layout-column-area">
                          <td
                            v-for="(layout, index2) in component.componentList"
                            :key="index2"
                            class="layout-column"
                            :class="[
                              'column-' + component.layoutNum,
                              getLayoutClass(
                                component.layoutNum,
                                component.layoutType,
                                index2
                              ),
                            ]"
                            :style="{
                              'background-color': component.backgroundColor,
                            }"
                            :data-layoutIndex="index2"
                            :data-componentkind="component.componentKind"
                          >
                            <div class="view-components">
                              <div
                                v-for="(singleComponent, index3) in layout"
                                :key="index3"
                                class="child-component"
                                :class="[{ clone: singleComponent.clone }]"
                              >
                                <template v-if="!singleComponent.clone">
                                  <MailComponentHoverElements
                                    v-if="!component.clone"
                                    :component="singleComponent"
                                    :upward-btn-disabled="index3 === 0"
                                    :downward-btn-disabled="
                                      index3 === layout.length - 1
                                    "
                                    :index-obj="{
                                      index: index,
                                      layoutIndex1: index2,
                                      layoutIndex2: index3,
                                    }"
                                    @up="
                                      moveComponent(
                                        {
                                          index: index,
                                          layoutIndex1: index2,
                                          layoutIndex2: index3,
                                        },
                                        'upward'
                                      )
                                    "
                                    @down="
                                      moveComponent(
                                        {
                                          index: index,
                                          layoutIndex1: index2,
                                          layoutIndex2: index3,
                                        },
                                        'downward'
                                      )
                                    "
                                  />
                                  <MailSingleComponent
                                    :component="singleComponent"
                                  />
                                </template>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      v-if="
                        component.componentKind === 'singleComponent' &&
                        !component.clone
                      "
                      class="single-component"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <MailSingleComponent :component="component" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- 最終的には消す
                <ul
                  ref="componentListRoot"
                  class="view-components"
                  :style="[
                    { 'background-color': selectMainBackgroundColor },
                    { color: selectTextColor },
                  ]"
                  name="component-list"
                >
                  <li
                    v-for="(component, index) in editorComponentList"
                    :key="index"
                    class="component"
                    :class="[
                      { clone: component.clone },
                      componentClass(component.componentKind),
                    ]"
                    :data-componentIndex="index"
                    @mouseover="mouseOverAction"
                    @mouseleave="mouseLeaveAction"
                  >
                    <MailComponentHoverElements
                      v-if="!component.clone && hoverFlag"
                      :component="component"
                      :upward-btn-disabled="index === 0"
                      :downward-btn-disabled="
                        index === editorComponentList.length - 1
                      "
                      :index-obj="{
                        index: index,
                      }"
                      @up="
                        moveComponent(
                          {
                            index: index,
                          },
                          'upward'
                        )
                      "
                      @down="
                        moveComponent(
                          {
                            index: index,
                          },
                          'downward'
                        )
                      "
                    />
                    <div
                      v-if="
                        component.componentKind === 'layoutComponent' &&
                        !component.clone
                      "
                      class="layout-column-area"
                    >
                      <div
                        v-for="(layout, index2) in component.componentList"
                        :key="index2"
                        class="layout-column"
                        :class="[
                          'column-' + component.layoutNum,
                          getLayoutClass(
                            component.layoutNum,
                            component.layoutType,
                            index2
                          ),
                        ]"
                        :style="{
                          'background-color': component.backgroundColor,
                        }"
                        :data-layoutIndex="index2"
                        :data-componentkind="component.componentKind"
                      >
                        <ul class="view-components">
                          <li
                            v-for="(singleComponent, index3) in layout"
                            :key="index3"
                            class="child-component"
                            :class="[{ clone: singleComponent.clone }]"
                          >
                            <template v-if="!singleComponent.clone">
                              <MailComponentHoverElements
                                v-if="!component.clone"
                                :component="singleComponent"
                                :upward-btn-disabled="index3 === 0"
                                :downward-btn-disabled="
                                  index3 === layout.length - 1
                                "
                                :index-obj="{
                                  index: index,
                                  layoutIndex1: index2,
                                  layoutIndex2: index3,
                                }"
                                @up="
                                  moveComponent(
                                    {
                                      index: index,
                                      layoutIndex1: index2,
                                      layoutIndex2: index3,
                                    },
                                    'upward'
                                  )
                                "
                                @down="
                                  moveComponent(
                                    {
                                      index: index,
                                      layoutIndex1: index2,
                                      layoutIndex2: index3,
                                    },
                                    'downward'
                                  )
                                "
                              />
                              <MailSingleComponent
                                :component="singleComponent"
                              />
                            </template>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <template
                      v-if="
                        component.componentKind === 'singleComponent' &&
                        !component.clone
                      "
                    >
                      <MailSingleComponent :component="component" />
                    </template>
                  </li>
                </ul>
                <!-->
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-long" @click="showMailPreview()">
            プレビュー<OpenInNewSVG class="icon-openInNew" />
          </button>
        </div>
      </div>
    </div>
    <SendErrorContext v-if="mailStatus === '4'" />
    <div v-else class="buttons">
      <button
        class="btn btn-cancel btn-long"
        :class="{
          'btn-disabled': !checkChangeInputData(),
        }"
        @click="showCancelEditModal()"
      >
        キャンセルして元に戻す
      </button>
      <button
        class="btn btn-long btn-cancel"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateEditMailSettings('save')"
      >
        メール設定を保存
      </button>
      <button
        class="btn btn-long btn-basic"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateEditMailSettings('next')"
      >
        メール設定を保存して配信設定へ進む
      </button>
    </div>
    <EditMailComponentModal
      v-if="showEditMailComponentModalState"
      @update="updateEditComponent($event)"
      @close="setShowEditMailComponentModalState(false)"
    />
    <DeleteMailComponentModal
      v-if="showDeleteMailComponentModalState"
      @delete="deleteComponent()"
      @close="setShowDeleteMailComponentModalState(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import '~/assets/styles/scss/mail/editor.scss'
import draggable from 'vuedraggable'

export default {
  name: 'EditMailContentsSettingsComponent',
  components: {
    draggable,
  },
  props: {
    propMailSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      mailSettings: {},
      mailTypeOptions: [
        {
          value: '0',
          label: 'テキスト',
        },
        {
          value: '1',
          label: 'HTML',
        },
      ],
      textMailPlaceholder:
        'いつもお世話になっております。\n今週もお得な情報を紹介いたします！\n _/_/　３月末まで！初期費用５０%OFF!　 _/_/_/_/_/_/_/_/_/_/_/_/_/ \n年度末の乗り換えキャンペーンとしまして、３月末までに\n お申し込みいただいたお客様は、初期費用５０%OFFでご提供します！\n ↓詳しくはコチラ！↓\n ▼───────────────────────▼ \nhttp://URL/ \n▲───────────────────────▲',
      dragItem: null,
      selectBackgroundColor: '#1e1e1e',
      selectMainBackgroundColor: '#ffffff',
      selectTextColor: '#1e1e1e',
      hoverFlag: false,
      layoutComponents: [
        {
          id: 'layout-1',
          name: '1列',
        },
        {
          id: 'layout-2',
          name: '2列',
        },
        {
          id: 'layout-3',
          name: '3列',
        },
      ],
      singleComponents: [
        {
          id: 'heading1',
          name: '見出し1',
        },
        {
          id: 'heading2',
          name: '見出し2',
        },
        {
          id: 'heading3',
          name: '見出し3',
        },
        {
          id: 'text',
          name: 'テキスト',
        },
        {
          id: 'list',
          name: 'リスト',
        },
        {
          id: 'annotation',
          name: '注釈',
        },
        {
          id: 'image',
          name: '画像',
        },
        {
          id: 'button',
          name: 'ボタン',
        },
        {
          id: 'separator',
          name: '区切り線',
        },
        {
          id: 'space',
          name: '空白',
        },
      ],
      defaultEditorComponentList: [],
      editorComponentList: [],
      formItems: [
        {
          id: 'mailSubject',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'mailBody',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 4000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 4000,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('mail/editMailSettings', [
      'initComponentsJson',
      'mailBodyEditor',
      'backgroundColorList',
      'textColorList',
      'showDeleteMailComponentModalState',
      'selectComponentIndexObj',
      'showEditMailComponentModalState',
      'mailStatus',
    ]),
    ...mapState('cms/editorStore', ['pageListData']),
    /**
     * ボタンの非活性処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.mailSettings) {
          if (key === 'mailBody' && this.mailSettings.mailType !== '0') {
            continue
          }

          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.mailSettings[key]
            )
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
    /**
     * コンポーネントに紐づくクラスの取得
     *
     * @param {string} componentKind コンポーネントの種類
     * @return {string} コンポーネントに紐づくクラス
     */
    componentClass() {
      return (componentKind) => {
        let returnClassName = ''

        if (componentKind === 'layoutComponent') {
          returnClassName = 'layout-component'
        } else if (componentKind === 'singleComponent') {
          returnClassName = 'single-component'
        }

        return returnClassName
      }
    },
    /**
     * レイアウトコンポーネントのクラス名の取得
     *
     * @param {number} layoutNum レイアウト数
     * @param {string} layoutType レイアウトタイプ
     * @param {number} index レイアウトのインデックス
     * @return {string} レイアウトコンポーネントのクラス名
     */
    getLayoutClass() {
      return (layoutNum, layoutType, index) => {
        let returnClassName = ''

        if (layoutNum === 1) {
          returnClassName = 'layout-100'
        } else if (layoutNum === 2) {
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
        }

        return returnClassName
      }
    },
  },
  watch: {
    propMailSettings() {
      this.initFunc() // 初期値設定処理
    },
  },
  created() {
    this.initFunc() // 初期値設定処理
    this.getCreateWebPage() // ページ構成取得APIの呼び出し
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('mail/editMailSettings', [
      'setShowDeleteMailComponentModalState',
      'setShowEditMailComponentModalState',
    ]),
    ...mapMutations('cms/editorStore', ['setPageListData', 'setTopPagePath']),
    /**
     * 初期値設定処理
     */
    initFunc() {
      this.mailSettings = JSON.parse(JSON.stringify(this.propMailSettings))
      this.defaultEditorComponentList = this.mailSettings.mailBodySettingJson
        ? JSON.parse(this.mailSettings.mailBodySettingJson)
        : []
      this.editorComponentList = JSON.parse(
        JSON.stringify(this.defaultEditorComponentList)
      )
    },
    /**
     * ページ構成取得APIの呼び出し
     */
    getCreateWebPage() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCreateWebPage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setPageListData(resData.data.pageListData)
            this.setTopPagePath(resData.data.topPagePath)
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
     * オブジェクト一致チェック(親画面からも呼び出される関数)
     *
     * @return {boolean} 入力内容に変更があった場合は、true それ以外はfalseを返す
     */
    checkChangeInputData() {
      let result = false
      const mailSettings = JSON.parse(JSON.stringify(this.mailSettings))

      if (
        !this.$common.checkSameObject(this.propMailSettings, mailSettings) ||
        !this.$common.checkSameObject(
          this.defaultEditorComponentList,
          this.editorComponentList
        )
      ) {
        result = true
      }

      return result
    },
    /**
     * 配信条件設定内容の入力ブロックの追加
     */
    addInputCondition() {
      this.mailSettings.conditionContents.push({
        contentId: null,
        contentName: '',
        contentValue: '',
        contentSearchType: '',
      })
    },
    /**
     * 選択した配信条件設定内容の入力ブロックの削除
     *
     * @param {number} index 削除対象のインデックス
     */
    deleteCondition(index) {
      this.mailSettings.conditionContents.splice(index, 1)
    },
    /**
     * ドロップイベント
     */
    onDrop() {
      if (this.dragItem === null) {
        return
      }

      this.replaceCloneComponent() // クローンコンポーネントを実際のコンポーネントに置き換え
    },
    /**
     * ドラッグ開始イベント
     *
     * @param {Object} e イベントオブジェクト
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

      this.dragItem = dragItem
    },
    /**
     * ドラッグ中イベント
     *
     * @param {Object} e イベントオブジェクト
     */
    onDragOver(e) {
      // ドラッグコンポーネントが存在しない場合 または ルートエリア以外はクローンコンポーネントを削除してreturn
      if (this.dragItem === null) {
        return
      }

      if (
        e.target.closest('.component:not(.clone) .single-component') ||
        e.target.closest('.layout-column .child-component:not(.clone)') ||
        (e.target.closest('.layout-component') &&
          !e.target.closest('.layout-column'))
      ) {
        this.deleteCloneComponent()
        return
      }

      const eY = e.pageY
      let targetIndex = -1

      if (e.target.closest('.layout-column')) {
        // レイアウトコンポーネント内はシングルコンポーネントのみ設置可
        if (this.dragItem.componentKind !== 'singleComponent') {
          return
        }

        const layoutComponentIndex = Number(
          e.target.closest('.component').getAttribute('data-componentIndex')
        )
        const layoutIndex = Number(
          e.target.closest('.layout-column').getAttribute('data-layoutIndex')
        )
        const targetSle = document.querySelectorAll(
          `.component[data-componentIndex='${layoutComponentIndex}'] .layout-column[data-layoutIndex='${layoutIndex}'] .child-component`
        )
        const targetLayoutComponent = this.editorComponentList[
          layoutComponentIndex
        ].componentList[layoutIndex]
        const componentInfo = JSON.parse(
          JSON.stringify(
            this.initComponentsJson[this.dragItem.componentKind][
              this.dragItem.id
            ]
          )
        )

        for (let i = 0; i < targetSle.length; i++) {
          if (
            eY >
            targetSle[i].getBoundingClientRect().top + targetSle[i].offsetHeight
          ) {
            targetIndex = i
          } else {
            break
          }
        }

        this.$set(componentInfo, 'clone', true)
        this.deleteCloneComponent(layoutComponentIndex, layoutIndex)
        targetLayoutComponent.splice(targetIndex + 1, 0, componentInfo)
      } else {
        const targetSle2 = document.querySelectorAll(
          '.rootContainer .component'
        )

        for (let i = 0; i < targetSle2.length; i++) {
          if (
            eY >
            targetSle2[i].getBoundingClientRect().top +
              targetSle2[i].offsetHeight
          ) {
            targetIndex = i
          } else {
            break
          }
        }

        const componentInfo = JSON.parse(
          JSON.stringify(
            this.initComponentsJson[this.dragItem.componentKind][
              this.dragItem.id
            ]
          )
        )

        this.$set(componentInfo, 'clone', true)
        this.deleteCloneComponent()
        this.editorComponentList.splice(targetIndex + 1, 0, componentInfo)
      }
    },
    /**
     * クローンコンポーネントを実際のコンポーネントに置き換え
     */
    replaceCloneComponent() {
      for (let i = 0; i < this.editorComponentList.length; i++) {
        if (this.editorComponentList[i].clone) {
          this.editorComponentList[i].clone = false
          continue
        }

        if (this.editorComponentList[i].componentKind === 'layoutComponent') {
          for (
            let j = 0;
            j < this.editorComponentList[i].componentList.length;
            j++
          ) {
            const targetIndex = this.editorComponentList[i].componentList[
              j
            ].findIndex((data) => data.clone)

            if (targetIndex >= 0) {
              this.editorComponentList[i].componentList[j][
                targetIndex
              ].clone = false
            }
          }
        }
      }
    },
    /**
     * クローンコンポーネントの削除
     */
    deleteCloneComponent() {
      for (let i = 0; i < this.editorComponentList.length; i++) {
        if (this.editorComponentList[i].clone) {
          this.editorComponentList.splice(i, 1)
          continue
        }

        if (this.editorComponentList[i].componentKind === 'layoutComponent') {
          for (
            let j = 0;
            j < this.editorComponentList[i].componentList.length;
            j++
          ) {
            const targetIndex = this.editorComponentList[i].componentList[
              j
            ].findIndex((data) => data.clone)

            if (targetIndex >= 0) {
              this.editorComponentList[i].componentList[j].splice(
                targetIndex,
                1
              )
            }
          }
        }
      }
    },
    /**
     * レイアウトコンポーネント内のクローンコンポーネントの削除
     *
     * @param {number} layoutComponentIndex レイアウト列のインデックス
     * @param {number} layoutIndex レイアウト内のシングルコンポーネントのインデックス
     */
    deleteCloneLayoutComponent(layoutComponentIndex, layoutIndex) {
      const targetIndex = this.editorComponentList[
        layoutComponentIndex
      ].componentList[layoutIndex].findIndex((data) => data.clone)

      if (targetIndex >= 0) {
        this.editorComponentList[layoutComponentIndex].componentList[
          layoutIndex
        ].splice(targetIndex, 1)
      }
    },
    /**
     * ドラッグ終了イベント
     */
    dragEnd() {
      this.dragItem = null
    },
    /**
     * ドラッグエリア外イベント
     *
     * @param {Object} e イベントオブジェクト
     */
    onDragLeave(e) {
      if (!e.relatedTarget || !e.relatedTarget.closest('.rootContainer')) {
        this.deleteCloneComponent()
      }
    },
    /**
     * コンポーネントの移動
     *
     * @param {Object} indexObj コンポーネントのインデックスオブジェクト
     * @param {string} moveType 移動タイプ
     */
    moveComponent(indexObj, moveType) {
      const newEditorComponentList = JSON.parse(
        JSON.stringify(this.editorComponentList)
      )

      if (indexObj.layoutIndex1 === undefined) {
        const val1 = newEditorComponentList[indexObj.index]

        if (moveType === 'upward') {
          const val2 = newEditorComponentList[indexObj.index - 1]

          newEditorComponentList[indexObj.index] = val2
          newEditorComponentList[indexObj.index - 1] = val1
        } else if (moveType === 'downward') {
          const val2 = newEditorComponentList[indexObj.index + 1]

          newEditorComponentList[indexObj.index] = val2
          newEditorComponentList[indexObj.index + 1] = val1
        }
      } else {
        const val1 =
          newEditorComponentList[indexObj.index].componentList[
            indexObj.layoutIndex1
          ][indexObj.layoutIndex2]

        if (moveType === 'upward') {
          const val2 =
            newEditorComponentList[indexObj.index].componentList[
              indexObj.layoutIndex1
            ][indexObj.layoutIndex2 - 1]

          newEditorComponentList[indexObj.index].componentList[
            indexObj.layoutIndex1
          ][indexObj.layoutIndex2] = val2
          newEditorComponentList[indexObj.index].componentList[
            indexObj.layoutIndex1
          ][indexObj.layoutIndex2 - 1] = val1
        } else if (moveType === 'downward') {
          const val2 =
            newEditorComponentList[indexObj.index].componentList[
              indexObj.layoutIndex1
            ][indexObj.layoutIndex2 + 1]

          newEditorComponentList[indexObj.index].componentList[
            indexObj.layoutIndex1
          ][indexObj.layoutIndex2] = val2
          newEditorComponentList[indexObj.index].componentList[
            indexObj.layoutIndex1
          ][indexObj.layoutIndex2 + 1] = val1
        }
      }

      this.editorComponentList = newEditorComponentList
    },
    /**
     * 編集したコンポーネントデータの反映
     *
     * @param {Object} editComponentData 編集したコンポーネントデータ
     */
    updateEditComponent(editComponentData) {
      const newEditorComponentList = JSON.parse(
        JSON.stringify(this.editorComponentList)
      )

      if (this.selectComponentIndexObj.layoutIndex1 === undefined) {
        newEditorComponentList[
          this.selectComponentIndexObj.index
        ] = editComponentData
      } else {
        newEditorComponentList[
          this.selectComponentIndexObj.index
        ].componentList[this.selectComponentIndexObj.layoutIndex1][
          this.selectComponentIndexObj.layoutIndex2
        ] = editComponentData
      }

      this.editorComponentList = newEditorComponentList
    },
    /**
     * コンポーネントの削除
     */
    deleteComponent() {
      const newEditorComponentList = JSON.parse(
        JSON.stringify(this.editorComponentList)
      )

      if (this.selectComponentIndexObj.layoutIndex1 === undefined) {
        newEditorComponentList.splice(this.selectComponentIndexObj.index, 1)
      } else {
        newEditorComponentList[
          this.selectComponentIndexObj.index
        ].componentList[this.selectComponentIndexObj.layoutIndex1].splice(
          this.selectComponentIndexObj.layoutIndex2,
          1
        )
      }

      this.editorComponentList = newEditorComponentList
    },
    /**
     * 保存してリクエストデータを親に送る
     *
     * @param {string} afterFunc 保存後の処理
     */
    updateEditMailSettings(afterFunc) {
      const data = {
        requestParam: {
          mailContent: this.getRequestMailSettings(),
        },
        afterFunc,
      }

      this.$emit('update', data)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     *
     * @return {Object[]} メール情報登録APIのリクエストパラメータ
     */
    getRequestMailSettings() {
      const requestMailSettings = JSON.parse(JSON.stringify(this.mailSettings))

      if (this.mailSettings.mailType === '1') {
        const editorArea = document.querySelector('.editor-area')
        const htmlBody = editorArea.innerHTML

        requestMailSettings.mailBodySettingJson = JSON.stringify(
          this.editorComponentList
        )
        requestMailSettings.mailBody = this.mailBodyEditor.replace(
          '{{ replaceBodyText }}',
          htmlBody
        )
      }

      return requestMailSettings
    },
    /**
     * メールプレビュー画面の表示
     */
    showMailPreview() {
      window.open(`/mail/preview/${this.$route.params.mailId}`, '_blank')
    },
    /**
     * コンポーネントにマウスホバーした際にホバー用の変数をtrueに設定
     */
    mouseOverAction() {
      this.hoverFlag = true
    },
    /**
     * コンポーネントにマウスホバーが離脱した際にホバー用の変数をfalseに設定
     */
    mouseLeaveAction() {
      this.hoverFlag = false
    },
    /**
     * 親画面から呼び出される関数 入力内容を元に戻す
     */
    restoreSettings() {
      this.initFunc() // 初期値設定処理
    },
  },
}
</script>

<style lang="scss" scoped>
.mail-settings {
  .form-block {
    .title {
      margin-bottom: 32px;
      .form-title {
        font-size: 22px;
        font-weight: 500;
      }
      .sub-text {
        font-size: 13px;
        margin-top: 8px;
      }
    }
    .contents {
      margin-bottom: 32px;
    }
    .form-item {
      &:not(:last-child) {
        margin-bottom: 24px;
      }
      .title {
        margin-bottom: 10px;
      }
      .context {
        font-size: 13px;
        margin-top: 12px;
      }
      .mailSubject {
        max-width: 775px;
      }
      .mailBody {
        max-width: 775px;
        height: 280px;
        margin-top: 24px;
      }
      .edit-html-mode {
        .edit-html-mail {
          display: flex;
          margin-top: 24px;
          .setting-parts {
            width: 320px;
            padding: 32px 16px;
            border: 1px solid #e5e5e5;
            .parts-info {
              &:not(:last-child) {
                margin-bottom: 40px;
              }
              .select-color-list {
                display: flex;
                flex-wrap: wrap;
                margin-top: 12px;
                li {
                  cursor: pointer;
                  &:not(:nth-of-type(5n)) {
                    margin-right: 8px;
                  }
                  &:nth-child(n + 6) {
                    margin-top: 8px;
                  }
                  label {
                    display: block;
                    width: 50px;
                    height: 50px;
                    border: 1px solid #e5e5e5;
                    border-radius: 6px;
                    position: relative;
                    &.selected {
                      border: 1px solid #007aff;
                      box-shadow: 0px 0px 4px #007affb8;
                      border-radius: 8px;
                    }
                    .icon {
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      margin: auto;
                      fill: #ffffff;
                      &.icon-color-black {
                        fill: #1e1e1e;
                      }
                    }
                    input {
                      display: none;
                    }
                  }
                }
              }
              .select-layout-components,
              .select-single-components {
                display: flex;
                flex-wrap: wrap;
                li {
                  .name {
                    text-align: center;
                    margin-top: 8px;
                    font-size: 13px;
                  }
                }
              }
              .select-layout-components {
                li {
                  &:not(:first-child) {
                    margin-left: 8px;
                  }
                  ::v-deep svg {
                    width: 90px;
                    height: 40px;
                  }
                }
              }
              .select-single-components {
                li {
                  &:not(:nth-of-type(4n)) {
                    margin-right: 8px;
                  }
                  &:nth-child(n + 5) {
                    margin-top: 16px;
                  }
                  ::v-deep svg {
                    width: 65px;
                    height: 40px;
                  }
                }
              }
            }
          }
        }
        .btn {
          display: flex;
          align-items: center;
          margin: 48px auto 0 auto;
          position: relative;
          .icon-openInNew {
            width: 16px;
            height: 16px;
            fill: #4f7df0;
            margin-left: 4px;
          }
        }
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 48px;
    padding-top: 40px;
    border-top: 1px solid #e5e5e5;
    button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
