<template>
  <div class="contact-list">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">コンタクト一覧</h2>
      </div>
      <div v-if="searchResultNum.all > 0" class="contents">
        <div class="search-conditions">
          <div class="first-row">
            <div class="left-contents">
              <CustomInputText
                v-model="keyword"
                placeholder="氏名や企業名を入力して検索してください"
                view-type="search"
                maxlength="50"
                @submit="showSearchResultContactList()"
              />
              <button
                class="btn btn-utility font-size-normal font-weight-medium btn-utility-long"
                @click="showSearchDetailContactModal()"
              >
                詳細検索
              </button>
            </div>
            <div class="right-contents">
              <button
                class="btn btn-basic btn-long"
                @click="transitionCreateContactScreen()"
              >
                新規コンタクト登録
              </button>
            </div>
          </div>
          <div class="second-row">
            <SelectSearchResult
              :select-search-result-type="
                getSelectSearchResultType(showSearchType)
              "
              :search-result-all="searchResultNum.all"
              :search-result-filter="searchResultNum.filter"
              :disabled-btn-name-list="checkDisabled"
              @changeSelectSearchResult="changeSelectSearchResult($event)"
            />
            <button
              class="btn btn-utility btn-selectNow btn-searchResult"
              :class="[
                { active: showSearchType === 2 },
                { 'btn-disabled': checkContactList.length === 0 },
              ]"
              @click="showCheckContactList()"
            >
              選択中<span class="number">({{ checkContactList.length }})</span>
            </button>
            <CustomInputSingleCheckbox
              v-model="myContactsOnlyFlag"
              name="myContactsOnlyFlag"
              class="myContactsOnlyFlag"
              label="自分が担当"
              @input="showSearchResultContactList()"
            />
          </div>
        </div>
        <div
          v-if="
            searchResultNum.filter === 0 &&
            searchResultNum.all !== 0 &&
            contactList.length === 0
          "
          class="table-area"
        >
          <div class="flex flex-center">
            <img
              :src="$common.getAssetsImgUrl('images/invitation/expire.png')"
              width="360"
              height="270"
            />
          </div>
          <p class="flex flex-center">
            検索条件に一致するコンタクトがありませんでした。<br />
            氏名や企業名を省略しないで検索するなど別の方法をお試しください。
          </p>
        </div>
        <div v-else class="table-area">
          <div class="table-options-buttons">
            <div class="left-contents">
              <button
                class="btn btn-utility"
                :class="{ 'btn-disabled': checkSelectContactState() }"
                @click="downloadContactList()"
                @mouseover="
                  $common.setAreaLabel(
                    $event,
                    'top',
                    '選択したコンタクト情報をダウンロードします'
                  )
                "
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              >
                ダウンロード
              </button>
              <button
                class="btn btn-utility"
                :class="{ 'btn-disabled': checkSelectContactState() }"
                @click="deleteCheckContactList()"
                @mouseover="
                  $common.setAreaLabel(
                    $event,
                    'top',
                    '選択したコンタクトを削除します'
                  )
                "
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              >
                削除
              </button>
              <button
                class="btn btn-utility"
                :class="{ 'btn-disabled': checkSelectContactState() }"
                @click="showTargetListModalFlg = true"
                @mouseover="
                  $common.setAreaLabel(
                    $event,
                    'top',
                    '表示中のコンタクトへメールを送る'
                  )
                "
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              >
                メール
              </button>
            </div>
            <div class="right-contents">
              <button
                class="btn btn-utility"
                @click="showChangeTableItemModal()"
                @mouseover="
                  $common.setAreaLabel(
                    $event,
                    'top',
                    '一覧に表示する情報を変更します'
                  )
                "
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              >
                表示項目を変更
              </button>
              <SettingShowNum
                :setting-show-num="contactListPaging.limit"
                @update="updateSettingShowNum($event)"
              />
              <PageNav
                :current-page="contactListPaging.offset"
                :setting-show-num="contactListPaging.limit"
                :max-data-num="contactListPaging.maxDataNum"
                @showPrevPage="showPrevPage()"
                @showNextPage="showNextPage()"
              />
            </div>
          </div>
          <ContactListTable
            :prop-disp-items="contactTableDispItems"
            @update="getContactList()"
            @detail="showContactDetailDrawer($event)"
          />
        </div>
      </div>
      <div v-else class="no-contents">
        <h3>商談化率の向上には「顧客管理」と「顧客の見える化」が重要です。</h3>
        <button
          class="btn btn-long btn-basic"
          @click="transitionCreateContactScreen()"
        >
          新規コンタクト登録
        </button>
        <div class="image">
          <img :src="$common.getAssetsImgUrl('images/common/nodata_1.png')" />
        </div>
      </div>
    </div>
    <SearchDetailContactModal
      v-if="showSearchDetailContactModalState"
      @update="showSearchResultContactList()"
      @close="hideSearchDetailContactModal()"
    />
    <!-- Ph2.2 対象外 -->
    <!-- <ContactTagModal
      v-if="showContactTagModalState"
      @close="hideContactTagModal()"
    /> -->
    <!-- / Ph2.2 対象外 -->
    <DeleteContactModal
      v-if="showDeleteContactModalState"
      @delete="deleteContact()"
      @close="hideDeleteContactModal()"
    />
    <ChangeTableItemModal
      v-if="showChangeTableItemModalState"
      :prop-can-add-items="canAddItems"
      :prop-disp-items="dispItems"
      @update="updateChangeTableItem($event)"
      @close="hideChangeTableItemModal()"
    />
    <ContactDetailDrawer
      :is-select-contact-id="isShowContactDetailDrawer"
      :detail-id="detailId"
      @close="hideContactDetailDrawer()"
    />
    <TargetListModal
      v-if="showTargetListModalFlg"
      @close="hideTargetListModal()"
      @saveToClose="saveToClose($event)"
      @saveToCreateMail="saveToCreateMail($event)"
    />
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      showTargetListModalFlg: false,
      isShowContactDetailDrawer: false,
      detailId: 0,
      keyword: '', // 検索キーワード
      checkDeleteMode: false, // チェックボックスからの削除:true ダイアログからの削除:false
      showSearchType: 0, // 0:すべて 1:検索結果 2:選択中
      myContactsOnlyFlag: false, // 自分が担当のチェックボックス
      contactListPaging: {
        // コンタクト一覧テーブルのページング情報
        limit: 20,
        offset: 1,
        maxDataNum: 0,
      },
      searchResultNum: {
        all: 0,
        filter: 0,
      },
      canAddItems: [],
      dispItems: [],
      allDataList: [],
      contactTableDispItems: [],
      requiredLabel: ['氏名', '企業名', 'メールアドレス'],
      renameDataList: [
        {
          defaultDataItemDefinitionId: 7,
          concatData: [8],
          renameTitle: '氏名',
        },
        {
          defaultDataItemDefinitionId: 9,
          concatData: [10],
          renameTitle: 'シメイ',
        },
        {
          defaultDataItemDefinitionId: 13,
          concatData: [14, 15, 16],
          renameTitle: '住所',
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    ...mapState('contact/contactList', [
      'contactList',
      'checkContactList',
      'selectContactInfo',
      'contactSelectSortType',
      'showSearchDetailContactModalState',
      'showContactTagModalState',
      'showDeleteContactModalState',
      'showChangeTableItemModalState',
      'searchDetailOptions',
      'salesPersonList',
    ]),
    /**
     * 検索結果ボタン表示制御のためが0件の場合の['filter'] 検索結果がある場合[]を返却
     *
     * @return {Array} 検索結果の件数に応じ['filter'] or []
     */
    checkDisabled() {
      return this.searchResultNum.filter <= 0 ? ['filter'] : []
    },
    /**
     * 表示しているテーブルにて1つもチェックしていない場合はtrue,それ以外はfalseを返す
     *
     * @return {boolean} true:チェック済み false:未チェック
     */
    checkSelectContactState() {
      return () => {
        const checkShowContactNum = this.getCheckShowContactList().length // 表示しているテーブルで現在チェックしている項目数
        const result = checkShowContactNum === 0

        return result
      }
    },
  },
  created() {
    this.resetDefaultState()
    this.getContactList() // コンタクト一覧の取得
    this.getDefinitions() // コンタクト定義情報取得の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('contact/contactList', [
      'resetDefaultState',
      'setContactList',
      'setShowSearchDetailContactModalState',
      'setShowSearchDetailContactModalState',
      'setShowContactTagModalState',
      'setShowDeleteContactModalState',
      'setShowChangeTableItemModalState',
      'setSalesPersonList',
      'setDataItemDefinitionList',
      'setTagDefinitionList',
    ]),
    /**
     * コンタクト定義情報取得の取得
     */
    getDefinitions() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setSalesPersonList(resData.data.salesPersonList)
            this.setDataItemDefinitionList(resData.data.dataItemDefinitionList)
            this.setTagDefinitionList(resData.data.tagDefinitionList)
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
     * すべて、検索結果選択ボタンの選択値に合わせリスト表示の切替
     *
     * @param {String} selectSearchResultType 検索タイプ
     */
    changeSelectSearchResult(selectSearchResultType) {
      this.showSearchType = selectSearchResultType === 'all' ? 0 : 1

      if (this.showSearchType === 0) {
        this.showAllContactList()
      } else {
        this.showSearchResultContactList()
      }
    },
    /**
     * すべて、検索結果選択ボタンの設定値を取得
     *
     * @param {Number} num すべて、検索結果選択ボタンの選択値
     * @return {string} タブ選択項目
     */
    getSelectSearchResultType(num) {
      if (num === 0) {
        return 'all'
      } else if (num === 1) {
        return 'filter'
      } else {
        return ''
      }
    },
    /**
     * すべてのコンタクト一覧を表示
     */
    showAllContactList() {
      this.resetPaging()
      this.getContactList()
    },
    /**
     * 検索結果のコンタクト一覧を表示
     */
    showSearchResultContactList() {
      this.showSearchType = 1
      this.resetPaging()
      this.getContactList()
    },
    /**
     * 選択中のコンタクト一覧を表示
     */
    showCheckContactList() {
      this.showSearchType = 2
      this.resetPaging()
      this.setContactList(this.checkContactList)
    },
    /**
     * コンタクト一覧の取得
     */
    getContactList() {
      const paramData = this.getContactListParam()

      this.$common.addCallApiNum()
      this.$api
        .getContactList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const canAddItems =
              resData.data.displayItemSetting.notDisplayItemList // 非表示データ
            const dispItems = resData.data.displayItemSetting.displayItemList // 表示データ

            this.searchResultNum.all = resData.data.allResult // すべて（●●）の●●の件数
            this.searchResultNum.filter = resData.data.searchResult // 検索結果（●●）の●●の件数
            this.contactListPaging.maxDataNum = resData.data.searchResult
            this.allDataList = JSON.parse(
              JSON.stringify(canAddItems.concat(dispItems))
            )
            this.canAddItems = this.joinContent(canAddItems).map((item) => {
              item.name = item.title
              item.id = item.dataItemDefinitionId
              item.required = this.requiredLabel.includes(item.title)
              return item
            })
            this.dispItems = this.joinContent(dispItems).map((item) => {
              item.name = item.title
              item.id = item.dataItemDefinitionId
              item.required = this.requiredLabel.includes(item.title)
              return item
            })
            this.contactTableDispItems = JSON.parse(JSON.stringify(dispItems))
            this.setContactList(resData.data.contactList) // データリスト
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
     * コンタクト一覧取得APIのリクエストパラメータの取得
     *
     * @return {object} リクエストパラメータ
     */
    getContactListParam() {
      const paramData = this.getSearchDetail()

      paramData.offset = this.contactListPaging.offset
      paramData.limit = this.contactListPaging.limit
      paramData.sort = this.contactSelectSortType.sort
      paramData.order = this.contactSelectSortType.order

      if (paramData.deliveryFlag === '') {
        delete paramData.deliveryFlag
      } else {
        paramData.deliveryFlag = Number(paramData.deliveryFlag)
      }

      if (Array.isArray(paramData.tagDefinitionIdList)) {
        paramData.tagDefinitionIdList = paramData.tagDefinitionIdList.join(',')
      }

      return paramData
    },
    /**
     * コンタクト詳細検索、自分が担当チェックステータスの取得
     *
     * @return {object} リクエストパラメータ
     */
    getSearchDetail() {
      const paramData = JSON.parse(JSON.stringify(this.searchDetailOptions))

      if (this.showSearchType === 0) {
        return {}
      }

      paramData.myContactsOnlyFlag = this.myContactsOnlyFlag

      // フリーワード検索
      if (this.keyword !== '') {
        paramData.keyword = this.keyword
      }

      // 追加項目
      if (paramData.dataItemDefinition) {
        const id = paramData.dataItemDefinition

        paramData.dataItemDefinition = `[[${id}]]${paramData.addInputItem}`
      }

      // タグリスト
      if (Array.isArray(paramData.tagDefinitionIdList)) {
        paramData.tagDefinitionIdList = paramData.tagDefinitionIdList.join(',')
      }
      delete paramData.addInputItem

      return paramData
    },
    /**
     * 表示しているテーブルで現在チェックしている項目を削除
     */
    deleteCheckContactList() {
      this.checkDeleteMode = true
      this.setShowDeleteContactModalState(true)
    },
    /**
     * 選択したコンタクトを削除する
     */
    deleteContact() {
      const paramData = this.getDeleteContactParam() // コンタクト削除APIのリクエストパラメータの取得

      this.$common.addCallApiNum()
      this.$api
        .deleteContactData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.hideDeleteContactModal()
            this.$common.showCompletePopAlert('ActionMsg_Gen03', 'コンタクト')
            this.getContactList() // コンタクト一覧の再取得
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
     * コンタクト削除APIのリクエストパラメータの取得
     *
     * @return {object[]} コンタクト削除APIのリクエストパラメータ
     */
    getDeleteContactParam() {
      const paramData = {
        contactList: [],
      }

      if (this.checkDeleteMode) {
        const checkShowContactList = this.getCheckShowContactList()

        for (let i = 0; i < checkShowContactList.length; i++) {
          paramData.contactList.push({
            contactId: checkShowContactList[i].contactId,
            recordVersion: checkShowContactList[i].recordVersion,
          })
        }
      } else {
        paramData.contactList.push({
          contactId: this.selectContactInfo.contactId,
          recordVersion: this.selectContactInfo.recordVersion,
        })
      }

      return paramData
    },
    /**
     * 表示件数の更新 選択した表示件数で再度APIを投げる
     *
     * @param {number} limit 最大表示件数
     */
    updateSettingShowNum(limit) {
      this.contactListPaging.limit = limit
      this.contactListPaging.offset = 1
      this.getContactList() // コンタクト一覧の取得
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.contactListPaging.offset += 1
      this.getContactList() // コンタクト一覧の取得
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.contactListPaging.offset -= 1
      this.getContactList() // コンタクト一覧の取得
    },
    /**
     * ページング情報のリセット
     */
    resetPaging() {
      this.contactListPaging = {
        limit: 20,
        offset: 1,
        maxDataNum: 0,
      }
    },
    /**
     * ソート情報のリセット
     */
    resetSortType() {
      const newSelectSortType = {
        sort: '',
        order: '',
      }

      this.setContactSelectSortType(newSelectSortType)
    },
    /**
     * 現在テーブルに表示しているデータでチェックしている項目の情報を取得
     *
     * @return {object[]} チェック対象のコンタクト情報(配列)
     */
    getCheckShowContactList() {
      const checkShowContactList = []

      for (let i = 0; i < this.contactList.length; i++) {
        const targetContact = this.checkContactList.find(
          (data) => data.contactId === this.contactList[i].contactId
        )

        if (targetContact) {
          checkShowContactList.push(targetContact)
        }
      }

      return checkShowContactList
    },
    /**
     * 現在テーブルに表示しているデータのID(配列)を取得
     *
     * @return {number[]} contactId配列
     */
    getCheckShowContactIds() {
      return this.getCheckShowContactList()
        .map((item) => {
          return item.contactId
        })
        .join(',')
    },
    /**
     * ダウンロードボタン押下処理
     */
    downloadContactList() {
      const paramData = {
        contactIdList: this.getCheckShowContactIds(),
      }

      this.$common.addCallApiNum()
      this.$api
        .downloadContactList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const nowDate = this.$common.getFormatCurrentDate('YYYYMMDD')

            this.$common.csvFileDownload(
              resData.data.csvData,
              `${this.masterData.tenantId}_contactlist_${nowDate}.csv`
            )
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
     * 表示用に項目を結合
     *
     * @param {Object[]} list 表示項目リスト
     * @return {Object[]} 表示項目リスト
     */
    joinContent(list) {
      // 氏名、シメイ、住所を一つに
      const titleList = this.renameDataList.map((data) => {
        return data.defaultDataItemDefinitionId
      })
      const joinItemList = this.renameDataList
        .map((data) => {
          return data.concatData
        })
        .reduce((newArr, elem) => {
          return newArr.concat(elem)
        }, [])

      return list.filter((item) => {
        if (titleList.includes(item.defaultDataItemDefinitionId)) {
          item.title = this.renameDataList.find(
            (data) =>
              data.defaultDataItemDefinitionId ===
              item.defaultDataItemDefinitionId
          ).renameTitle
          return item
        }
        if (!joinItemList.includes(item.defaultDataItemDefinitionId)) {
          return item
        }
      })
    },
    /**
     * 表示用に結合された項目を分解
     *
     * @param {Object[]} list 表示項目リスト
     * @return {Object[]} 表示項目リスト
     */
    removeJoinContent(list) {
      const renamedItem = this.renameDataList.map((data) => {
        return data.renameTitle
      })
      let appendData = []
      const newList = list.map((listItem) => {
        if (renamedItem.includes(listItem.defaultDataItemDefinitionId)) {
          const removeJoinContent = this.renameDataList.find(
            (renameDataItem) => {
              if (
                renameDataItem.renameTitle ===
                listItem.defaultDataItemDefinitionId
              ) {
                return renameDataItem
              }
            }
          )
          const removeJoinContentList = removeJoinContent.concatData

          removeJoinContentList.push(
            removeJoinContent.defaultDataItemDefinitionId
          )
          appendData = this.allDataList.filter((addDataItem) => {
            if (
              removeJoinContentList.includes(
                addDataItem.defaultDataItemDefinitionId
              )
            ) {
              return addDataItem
            }
          })
          return appendData
        }
        return listItem
      })

      return newList.flat()
    },
    /**
     * 表示項目変更設定の反映
     *
     * @param {Object} val canAddItems(表示可能項目),dispItems（表示項目）
     */
    updateChangeTableItem(val) {
      const paramData = this.getUpdateDispTableItemsParam(val)

      this.$common.addCallApiNum()
      this.$api
        .updateDisplayItemList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            // 表示項目変更完了
            this.hideChangeTableItemModal()
            this.getContactList()
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
     * 表示項目変更を保存リクエストパラメータの取得
     *
     * @param {Object} val canAddItems(表示可能項目),dispItems（表示項目）
     * @returns {object} 表示項目変更を保存リクエストパラメータ
     */
    getUpdateDispTableItemsParam(val) {
      const paramData = {}
      const dispItems = this.removeJoinContent(val.dispItems)

      paramData.displayItemList = dispItems.map((item, index) => {
        delete item.defaultDataItemDefinitionId
        delete item.title
        delete item.requiredFlag
        item.displayOrder = index
        return item
      })

      return paramData
    },
    /**
     * ターゲットリスト作成
     *
     * @param {string} targetListName ターゲットリスト名
     * @param {string} action 呼び出し元アクション名
     */
    createTargetList(targetListName, action) {
      const paramData = this.getCreateTargetListParam(targetListName)

      this.$common.addCallApiNum()
      this.$api
        .createTargetList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            // 表示項目変更完了
            if (action === 'close') {
              // モーダルを閉じる
              this.hideTargetListModal()
            } else if (action === 'createMail') {
              // メール作成APIを利用
              this.createMail(targetListName, resData.data.targetListId)
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
     * ターゲットリスト作成API リクエストパラメータの作成
     *
     * @param {string} targetListName ターゲットリスト名
     * @return {number} コンタクトID
     */
    getCreateTargetListParam(targetListName) {
      const patternData = this.showSearchType + 1
      const param = {
        name: targetListName,
        pattern: patternData,
      }

      if (patternData !== 1) {
        if (patternData === 2) {
          // 検索条件指定
          param.searchCondition = this.getSearchDetail()
        } else {
          // コンタクトID指定
          param.contactIdList = this.checkContactList.map((item) => {
            return item.contactId
          })
        }
      }

      return param
    },
    /**
     * メール作成API
     *
     * @param {string} targetListName ターゲットリスト名
     * @param {number} targetListIdData ターゲットリストID
     */
    createMail(targetListName, targetListIdData) {
      const paramData = {
        mailTitle:
          this.$common.getFormatCurrentDate('YYYYMMDD') + targetListName,
        targetListId: targetListIdData,
      }

      this.$common.addCallApiNum()
      this.$api
        .createMail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            // 表示項目変更完了
            this.$router.push(`/mail/edit/${resData.data.mailId}/`)
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
     * 表示項目変更モーダルの表示
     */
    showChangeTableItemModal() {
      this.setShowChangeTableItemModalState(true)
    },
    /**
     * 表示項目変更モーダルの非表示
     */
    hideChangeTableItemModal() {
      this.setShowChangeTableItemModalState(false)
    },
    /**
     * ターゲットリストモーダルの非表示
     */
    hideTargetListModal() {
      this.showTargetListModalFlg = false
    },
    /**
     * ターゲットリスト保存して閉じる
     *
     * @param {string} targetListName ターゲットリスト名
     */
    saveToClose(targetListName) {
      this.createTargetList(targetListName, 'close')
    },
    /**
     * ターゲットリスト保存してメール作成へ進む
     *
     * @param {string} targetListName ターゲットリスト名
     */
    saveToCreateMail(targetListName) {
      this.createTargetList(targetListName, 'createMail')
    },
    /**
     * 詳細検索モーダルの表示
     */
    showSearchDetailContactModal() {
      this.setShowSearchDetailContactModalState(true)
    },
    /**
     * 詳細検索モーダルの非表示
     */
    hideSearchDetailContactModal() {
      this.setShowSearchDetailContactModalState(false)
    },
    /**
     * コンタクトタグモーダルの非表示
     */
    hideContactTagModal() {
      this.setShowContactTagModalState(false)
    },
    /**
     * コンタクト削除モーダルの非表示
     */
    hideDeleteContactModal() {
      this.checkDeleteMode = false
      this.setShowDeleteContactModalState(false)
    },
    /**
     * 新規コンタクト登録画面に遷移
     */
    transitionCreateContactScreen() {
      this.$router.push('/contact/create/manual/')
    },
    /**
     * コンタクト詳細ドロアーの表示
     *
     * @param {Number} id 選択したコンタクトリストID
     */
    showContactDetailDrawer(id) {
      this.detailId = id
      this.isShowContactDetailDrawer = true
    },
    /**
     * 詳細ドロア非表示
     */
    hideContactDetailDrawer() {
      this.isShowContactDetailDrawer = false
    },
  },
  head() {
    return {
      title: 'コンタクト',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .contents {
    margin-top: 32px;
    .search-conditions {
      padding-bottom: 24px;
      .first-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-contents {
          display: flex;
          align-items: center;
          ::v-deep .custom-input-text {
            width: 537px;
          }
          .btn {
            margin-left: 16px;
          }
        }
      }
      .second-row {
        display: flex;
        align-items: center;
        margin-top: 24px;
        .show-search-type {
          display: flex;
          align-items: center;
          .btn {
            &:first-child {
              border-radius: 4px 0 0 4px;
            }
            &:last-child {
              border-radius: 0 4px 4px 0;
            }
            &:not(:first-child) {
              border-left: none;
            }
          }
        }
        .btn-selectNow {
          margin-left: 24px;
        }
        .myContactsOnlyFlag {
          margin-left: 24px;
        }
      }
    }
    .table-area {
      border-top: 1px solid #e5e5e5;
      padding-top: 24px;
      .table-options-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-contents {
          display: flex;
          align-items: center;
          .btn {
            &:not(:first-child) {
              margin-left: 16px;
            }
          }
        }
        .right-contents {
          display: flex;
          align-items: center;
          > * {
            &:not(:first-child) {
              margin-left: 16px;
            }
          }
        }
      }
    }
  }
  .no-contents {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 40px;
    padding-top: 40px;
    border-top: 1px solid #e5e5e5;
    .btn {
      margin-top: 32px;
    }
    .image {
      width: 440px;
      height: 330px;
      margin-top: 24px;
    }
  }
  .btn {
    &-utility {
      height: 40px;
    }
    &.active {
      background: #ebeced;
      color: #007aff;
      border: 1px solid #e0e0e0;
    }
  }
}
.btn-utility-long {
  padding: 0 17px;
}
button {
  font-family: 'Noto Sans JP', sans-serif;
}
// .btn-searchResult {
//   .number {
//   }
// }
</style>
