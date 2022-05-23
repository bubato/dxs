<template>
  <div
    class="suggest-textarea"
    :class="{ community: this.$route.path.includes('community') }"
  >
    <ValidationMessage v-if="errorList.length > 0" :error-list="errorList" />
    <div class="textAreaWrap">
      <codemirror
        ref="editor"
        v-model="inputTextArea"
        :placeholder="placeholder"
        class="cm-editor-input"
        :options="cmOptions"
        @input="updateValue"
      />
      <div v-if="showSuggestListFlg" class="selectArea">
        <LoadingImage v-if="suggestList.length === 0" />
        <ul v-else v-on-clickaway="closeSuggest">
          <li
            v-for="(data, index) in suggestList"
            :key="index"
            class="selectAreaList"
            @click="selectSuggest(data.id)"
          >
            <div v-if="data.image" class="image">
              <img :src="$common.getProfileImg(data.image)" />
            </div>
            <div class="context">
              <p class="first-row">
                {{ data.firstRow }}
              </p>
              <p v-if="data.secondRow" class="second-row">
                {{ data.secondRow }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import 'codemirror/addon/display/placeholder.js'
import '~/components/common/editor/codemirror/plugins/mdx_placeholder.js'
import 'codemirror/lib/codemirror.css'

export default {
  name: 'SuggestTextarea',
  components: {},
  mixins: [clickaway],
  props: {
    selectIds: {
      type: Array,
      default: () => [],
      required: false,
    },
    excludeIds: {
      type: Array,
      default: () => [],
      required: false,
    },
    maxIds: {
      type: Number,
      required: false,
      default: 100,
    },
    placeholder: { type: String, required: false, default: '' },
    suggestType: { type: Number, required: true, default: 1 },
  },
  data() {
    return {
      timeId: null,
      editMode: false,
      inputTextArea: '', // テキストエリアの入力値
      suggestList: [], // サジェストリスト
      showSuggestListFlg: false, // サジェストリストの表示フラグ
      formItems: [],
      cmOptions: {
        // codeMirrorのオプション
        tabSize: 4,
        lineNumbers: false,
        mdxPlaceholder: {
          className: 'selectLabel',
          replace: {
            match: /{@@([A-Za-z0-9_.]{0,64})@@}/,
            group: 1,
          },
          placeholderTexts: {},
        },
      },
      selectIdList: [],
      errorList: [],
      initFlg: false,
    }
  },
  computed: {
    ...mapState('storage/storageList', ['selectStorageInfo']),
    ...mapState('mail/editMailSettings', ['contactsDistributionMaster']),
  },
  watch: {},
  mounted() {
    this.addSuggestRemoveEvent() // サジェスト削除処理イベントの追加
    this.init() // 初期選択値表示
  },
  methods: {
    /**
     * 初期選択値表示
     */
    init() {
      if (this.selectIds.length > 0) {
        this.initFlg = true

        if (this.suggestType === 3) {
          this.getSuggestList()
        }
      }
    },
    /**
     * 初期選択値表示
     */
    initSetData() {
      if (this.initFlg) {
        for (const index in this.selectIds) {
          this.updateInputText(this.selectIds[index])
        }

        this.initFlg = false
      }
    },
    /**
     * 初期値の表示処理
     */
    initSelectId() {
      if (this.suggestType === 4) {
        this.selectIdList = this.selectIds.map((id) => {
          const tagInfo = this.contactsDistributionMaster.tagInformation.find(
            (data) => data.tagId === id
          )

          return {
            id,
            label: tagInfo ? tagInfo.tagName : '',
          }
        })
        this.addSelectSuggestLabel()
      } else if (this.suggestType === 5) {
        this.selectIdList = this.selectIds.map((id) => {
          const targetInfo = this.contactsDistributionMaster.targetInformation.find(
            (data) => data.targetId === id
          )

          return {
            id,
            label: targetInfo ? targetInfo.targetName : '',
          }
        })
        this.addSelectSuggestLabel()
      }
    },
    /**
     * サジェスト削除処理イベントの追加
     */
    addSuggestRemoveEvent() {
      const selectLabelSle = document.querySelectorAll(
        '.CodeMirror .selectLabel'
      )

      selectLabelSle.forEach((elm) => {
        elm.addEventListener('click', (e) => {
          const clickPosRight = e.target.offsetWidth - e.offsetX
          const clickPostTop = e.offsetY

          // ×ボタン押下時のみ処理を実行
          if (
            clickPosRight < 28 &&
            clickPosRight > 12 &&
            clickPostTop > 7 &&
            clickPostTop < 28
          ) {
            const targetIndex = [].slice.call(selectLabelSle).indexOf(elm)

            this.selectIdList.splice(targetIndex, 1) // 選択したサジェストラベルを削除

            this.addSelectSuggestLabel() // テキストエリアにサジェストを反映
          }
        })
      })
    },
    /**
     * サジェスト結果をクローズ
     */
    closeSuggest() {
      this.showSuggestListFlg = false
      this.addSelectSuggestLabel() // テキストエリアにサジェストを反映
    },
    /**
     * 値変更処理
     *
     * @param {string} value 入力値
     */
    updateValue(value) {
      if (
        !value ||
        (value.match(/[^{}]+(?=\{[^{}]+\})|[^{}]+$/) !== null &&
          !value.match(/[^{}]+(?=\{[^{}]+\})|[^{}]+$/)[0].trim())
      ) {
        this.$refs.editor.codemirror.setValue(
          value.replace(/[\u{20}\u{3000}\t]/u, '')
        )
        this.$nextTick(() => {
          this.addSuggestRemoveEvent() // サジェスト削除処理イベントの追加
          this.$refs.editor.codemirror.setCursor(
            this.$refs.editor.codemirror.lineCount(),
            0
          )
        })
        return
      }

      this.$emit('input', value)

      if (!this.editMode) {
        if (this.inputTextArea.length > 0) {
          this.inputTextAreaCheck(value)
          const ids = this.getExistSelectIdList()

          this.selectIdList = this.selectIdList.filter((data) =>
            ids.includes(data.id)
          )
          this.emitSelectIds() // 選択したユーザーIDリストを親画面に反映
        } else {
          this.showSuggestListFlg = false
        }
      }
    },
    /**
     * テキストエリア入力判定とセレクト欄の表示
     *
     * @param {string} inputText 入力値
     */
    inputTextAreaCheck(inputText) {
      const inputTextAreaCheckMain = () => {
        const listInputTextArea = this.inputTextArea.split('{@@')
        let updateText = ''

        for (const i in listInputTextArea) {
          if (listInputTextArea[i].split('@@}')[1])
            updateText = listInputTextArea[i].split('@@}')[1]
        }

        if (
          (inputText === this.inputTextArea || updateText !== '') &&
          this.getInputText().length > 0
        ) {
          this.showSuggestListFlg = true
          this.getSuggestList()
        } else {
          this.showSuggestListFlg = false
          this.suggestList = []
        }
      }
      clearTimeout(this.timerId)
      this.timerId = setTimeout(inputTextAreaCheckMain, 500)
    },
    /**
     * サジェスト一覧の取得
     */
    getSuggestList() {
      switch (this.suggestType) {
        case 1:
          this.getCommunityGroupInvitationMember() // 投稿グループ招待メンバー検索API
          break
        case 2:
          this.getStorageShareableMembers() // 共有メンバー一覧の取得API
          break
        case 3:
          this.getDefinitions('salesPersonList') // コンタクト営業担当者取得API
          break
        case 4:
          this.getMailTagInformation() // メール_宛先設定-タグ情報取得
          break
        case 5:
          this.getMailTargetInformation() // メール_宛先設定-タグ情報取得
          break
        case 6:
          this.getDefinitions('tagDefinitionList') // コンタクトタグAPI
          break
        default:
          break
      }
    },
    /**
     * サジェスト結果選択処理
     *
     * @param {number} selectId 選択したサジェストのID
     */
    selectSuggest(selectId) {
      if (this.selectIdList.length < this.maxIds) {
        this.updateInputText(selectId) // テキストエリアの入力値の更新
      }

      this.resetSuggestList() // サジェストリストのリセット
    },
    /**
     * テキストエリアの入力値の更新
     *
     * @param {number} selectId 選択したサジェストのID
     */
    updateInputText(selectId) {
      const selectSuggest = this.suggestList.find(
        (data) => data.id === selectId
      )

      this.selectIdList.push({
        id: selectId,
        label: selectSuggest.firstRow,
      })

      this.addSelectSuggestLabel() // テキストエリアにサジェストを反映
    },
    /**
     * テキストエリアにサジェストラベルを反映
     */
    addSelectSuggestLabel() {
      const cm = this.$refs.editor.codemirror

      cm.setValue('')
      this.editMode = true

      for (const i in this.selectIdList) {
        const setPlaceholder = '{@@' + this.selectIdList[i].id + '@@}'

        this.cmOptions.mdxPlaceholder.placeholderTexts[
          this.selectIdList[i].id
        ] = this.selectIdList[i].label
        cm.replaceRange(setPlaceholder, cm.getDoc().getCursor())
      }

      this.editMode = false

      this.addSuggestRemoveEvent() // サジェスト削除処理イベントの追加
      this.emitSelectIds() // 選択したユーザーIDリストを親画面に反映
    },
    /**
     * 選択したユーザーIDリストを親画面に反映
     */
    emitSelectIds() {
      const selectIds = this.selectIdList.map((data) => {
        return data.id
      })

      this.$emit('update', selectIds)
    },
    /**
     * サジェスト既存入力項目の反映
     */
    getExistSelectIdList() {
      const cm = this.$refs.editor.codemirror
      const tempSelectSetList = cm.getValue().match(/{.*?}/g)
      const existSelectIdList = []

      for (const i in tempSelectSetList) {
        existSelectIdList.push(
          Number(tempSelectSetList[i].replace(/@|{|}/g, ''))
        )
      }

      return existSelectIdList
    },
    /**
     * サジェストリストのリセット
     */
    resetSuggestList() {
      this.suggestList = []
      this.showSuggestListFlg = false
    },
    /**
     * 投稿グループ招待メンバー検索API
     */
    getCommunityGroupInvitationMember() {
      const paramData = {
        keyword: this.getInputText(),
        postGroupId: this.$route.params.groupId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getCommunityGroupInvitationMember(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const userList = resData.data.users
            const suggestList = []

            for (let i = 0; i < userList.length; i++) {
              const checkExistIdIndex = this.selectIdList.findIndex(
                (data) => data.id === userList[i].profileMemberId
              )

              if (checkExistIdIndex >= 0) {
                continue
              }

              suggestList.push({
                id: userList[i].profileMemberId,
                image: userList[i].userImageUrl,
                firstRow: userList[i].userName,
                secondRow:
                  userList[i].userCompany + ' ' + userList[i].userPosition,
              })
            }

            if (suggestList.length === 0) {
              this.showSuggestListFlg = false
            }

            this.suggestList = suggestList
            this.initSetData()
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
     * 共有メンバー一覧の取得
     */
    getStorageShareableMembers() {
      const paramData = {
        shareFolderId: this.selectStorageInfo.objectId,
        keyword: this.getInputText(),
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageShareableMembers(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const userList = resData.data.shareableMembers
            const suggestList = []

            for (let i = 0; i < userList.length; i++) {
              const checkExistIdIndex = this.selectIdList.findIndex(
                (data) => data.id === userList[i].userId
              )
              const checkExcludeIdsIndex = this.excludeIds.findIndex(
                (data) => data === userList[i].userId
              )

              if (checkExistIdIndex >= 0 || checkExcludeIdsIndex >= 0) {
                continue
              }

              suggestList.push({
                id: userList[i].userId,
                image: userList[i].profileImageURL,
                firstRow: `${userList[i].lastName} ${userList[i].firstName}`,
                secondRow:
                  userList[i].companyName + ' ' + userList[i].occupationName,
              })
            }

            if (suggestList.length === 0) {
              this.showSuggestListFlg = false
            }

            this.suggestList = suggestList
            this.initSetData()
          } else {
            this.showSuggestListFlg = false
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * コンタクト定義情報取得の取得
     */
    getDefinitions(selectData) {
      const paramData = {}
      console.log(
        'getDefinitions(コンタクト定義情報取得の取得) : リクエスト　paramData : '
      )
      console.dir(paramData)
      this.$common.addCallApiNum()
      this.$api
        .getDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            console.log(
              'getDefinitions(コンタクト定義情報取得の取得) : レスポンス : '
            )
            console.dir(resData.data)
            const userList = resData.data[selectData]
            const suggestList = []
            const id =
              selectData === 'salesPersonList'
                ? 'salesPersonId'
                : 'tagDefinitionId'

            for (let i = 0; i < userList.length; i++) {
              const checkExistIdIndex = this.selectIdList.findIndex(
                (data) => data.id === userList[i][id]
              )
              const checkExcludeIdsIndex = this.excludeIds.findIndex(
                (data) => data === userList[i][id]
              )

              if (checkExistIdIndex >= 0 || checkExcludeIdsIndex >= 0) {
                continue
              }

              suggestList.push({
                id: userList[i][id],
                image: '',
                firstRow: userList[i].name,
                secondRow: '',
              })
            }

            if (suggestList.length === 0) {
              this.showSuggestListFlg = false
            }

            this.suggestList = suggestList

            this.initSetData()
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
     * メール_宛先設定-タグ情報取得
     */
    getMailTagInformation() {
      const suggestList = []
      const tagInformation = this.contactsDistributionMaster.tagInformation

      for (let i = 0; i < tagInformation.length; i++) {
        if (tagInformation[i].tagName.includes(this.getInputText())) {
          const checkExistIdIndex = this.selectIdList.findIndex(
            (data) => data.id === tagInformation[i].tagId
          )
          const checkExcludeIdsIndex = this.excludeIds.findIndex(
            (data) => data === tagInformation[i].tagId
          )

          if (checkExistIdIndex >= 0 || checkExcludeIdsIndex >= 0) {
            continue
          }

          suggestList.push({
            id: tagInformation[i].tagId,
            firstRow: tagInformation[i].tagName,
          })
        }
      }

      if (suggestList.length === 0) {
        this.showSuggestListFlg = false
      }

      this.suggestList = suggestList
    },
    /**
     * メール_宛先設定-タｰゲット情報取得
     */
    getMailTargetInformation() {
      const suggestList = []
      const targetInformation = this.contactsDistributionMaster
        .targetInformation

      for (let i = 0; i < targetInformation.length; i++) {
        if (targetInformation[i].targetName.includes(this.getInputText())) {
          const checkExistIdIndex = this.selectIdList.findIndex(
            (data) => data.id === targetInformation[i].targetId
          )
          const checkExcludeIdsIndex = this.excludeIds.findIndex(
            (data) => data === targetInformation[i].targetId
          )

          if (checkExistIdIndex >= 0 || checkExcludeIdsIndex >= 0) {
            continue
          }

          suggestList.push({
            id: targetInformation[i].targetId,
            firstRow: targetInformation[i].targetName,
          })
        }
      }

      if (suggestList.length === 0) {
        this.showSuggestListFlg = false
      }

      this.suggestList = suggestList
    },
    /**
     * 入力値のみを取得
     *
     * @return {string} 入力値
     */
    getInputText() {
      let inputText = ''

      if (this.inputTextArea.length > 0) {
        inputText = this.inputTextArea.match(/[^{}]+(?=\{[^{}]+\})|[^{}]+$/)[0]
      }

      return inputText
    },
    /**
     * 入力内容をリセット(親画面から呼び出す)
     */
    resetInputTextarea() {
      this.inputTextArea = ''
      this.selectIdList = []
      this.resetSuggestList()
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/scss/sp/mediaQuery.scss';
.suggest-textarea {
  position: relative;
  .selectArea {
    .community & {
      @include spContentWidth();
    }
    width: 440px;
    background: #ffffff;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    z-index: 10;
    position: absolute;
    top: 48px;
    left: 16px;
    max-height: 240px;
    overflow: auto;
    svg {
      width: 80px;
      height: 80px;
      margin: 12px;
    }
    .selectAreaList {
      display: flex;
      align-items: center;
      height: 80px;
      padding: 16px;
      border-bottom: 1px solid #e5e5e5;
      cursor: pointer;
      &:hover {
        background: #f8f9fa;
      }
      .image {
        width: 48px;
        img {
          width: 100%;
        }
      }
      .context {
        margin-left: 16px;
        .second-row {
          font-size: 13px;
        }
      }
    }
  }
}
::v-deep .CodeMirror {
  width: 100%;
  height: 200px;
  border: 1px solid #e5e5e5;
  background: #f7f8f9;
  border-radius: 4px;
  padding: 10px;
  outline: none;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 15px;
  .CodeMirror-sizer {
    width: 100%;
  }
  .CodeMirror-scroll {
    width: 105%;
  }
  .CodeMirror-hscrollbar {
    visibility: hidden;
  }
  .CodeMirror-scrollbar-filler {
    visibility: hidden;
  }
  .CodeMirror-lines {
    color: #d2d2d2;
    .CodeMirror-line {
      span {
        color: #1e1e1e;
      }
      min-height: 43px;
    }
  }
  pre {
    &.CodeMirror-line,
    &.CodeMirror-line-like {
      white-space: pre-wrap;
    }
  }
  .selectLabel {
    background: #d1e7ff;
    margin: 0 8px 8px 0;
    padding: 7px 12px;
    border-radius: 4px;
    display: inline-block;
    &:after {
      content: '×';
      font-size: 10px;
      display: inline-block;
      color: #fff;
      margin: 2px 0 0 10px;
      padding-left: 3px;
      padding-bottom: 8px;
      width: 16px;
      height: 16px;
      vertical-align: top;
      border-radius: 10px;
      background-color: #3a435c;
      cursor: pointer;
    }
  }
  .CodeMirror-cursors {
    position: absolute;
    bottom: 0;
    .CodeMirror-cursor {
      height: 33px;
      margin-top: -42px;
      max-height: 33px;
    }
  }
}
</style>
