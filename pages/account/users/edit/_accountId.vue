<template>
  <div class="account-edit">
    <div class="main-contents">
      <ToBackScreenLink label="アカウント一覧へ戻る" @click="toBack()" />
      <div class="header">
        <h2 v-if="isEditPage" class="header-title"></h2>
        <h2 v-else class="header-title">新規アカウント作成</h2>
      </div>
      <div class="contents">
        <div class="form-block">
          <h2 v-if="isEditPage" class="header-title">
            {{ defaultAccountDetail.fullName }}のアカウント情報
          </h2>
          <div v-if="isEditPage" class="form-item">
            <p class="title">アカウントID</p>
            <p class="id">{{ tenantUserId }}</p>
          </div>
          <div v-if="isEditPage" class="form-item">
            <RequiredFormLabel
              class="title"
              label="ステータス"
              :required="true"
            />
            <CustomInputRadio
              v-model="accountDetail.status"
              name="status"
              layout-type="vertical"
              :options="statusOptions"
              :is-disabled="accountDetail.managementFlag === 1"
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="利用可能機能"
              :required="true"
            />
            <CustomInputCheckbox
              v-model="selectAvailableFunction"
              name="availableFunctionList"
              :options="availableFunctionOptions"
              :validation="
                $common.getFormItemsDetail(formItems, 'availableFunctionList')
                  .validation
              "
              layout-type="vertical"
              @input="reflectAvailableFunction($event)"
            />
          </div>
          <div v-if="masterData.firmKind !== '0'" class="form-item">
            <p class="title">
              データレイクオプション（この機能はオプション契約が必要です）
            </p>
            <ActivateStatusLabel
              v-if="mmiActivateData.msg"
              class="statusLabel"
              :text="mmiActivateData.msg"
              :link-url="mmiActivateData.linkUrl"
              :link-txt="mmiActivateData.linkTxt"
              :link-name="getDataLakeOptionReturnTitle()"
              :status="mmiActivateData.stt"
            />
            <div
              v-for="item in getActivateList()"
              :key="item.functionId"
              class="function-option"
            >
              <CustomInputSingleCheckbox
                v-model="item.selectFlag"
                name="dataLakeOptionList"
                :label="getAvailableFunctionName(item.functionId)"
                :is-disabled="isDataLakeOptionDisabled(item.functionId)"
                layout-type="vertical"
                class="availableFunctionList"
              />
              <CustomLinkText
                v-if="
                  (item.functionId === '09' && !accountDetail.mmiOption) ||
                  (item.functionId === '08' && !accountDetail.cfmOption)
                "
                text="このオプションを契約する"
                :link="'https://www.bizsky.io/contact/'"
              />
            </div>
          </div>
          <template
            v-if="accountDetail.corporateType === '20' && isUseDataLakeOption"
          >
            <template v-if="masterData.firmKind !== '0'">
              <div class="form-item is-reading">
                <p class="title">顧問先の閲覧制限</p>
                <CustomInputSingleCheckbox
                  v-model="accountDetail.reading"
                  name="reading"
                  label="顧問先の閲覧を制限する"
                  :is-disabled="accountDetail.managementFlag === 1"
                  @input="setReadingSetting(accountDetail.reading)"
                />
              </div>
              <div
                v-show="accountDetail.reading === true"
                class="readingSetting"
              >
                <p class="readingSetting-txt">
                  選択した顧問先企業はMMIまたはキャッシュフローマネジメント機能を閲覧できます。
                </p>
                <div class="input-text readingSetting-input">
                  <CustomInputText
                    v-model="searchText"
                    placeholder="会社コードや企業名を入力して検索"
                    view-type="search"
                    maxlength="50"
                    @submit="setNewSearchList($event)"
                  />
                </div>
                <ReadingListTable
                  ref="readingListTable"
                  class="readingSetting-table"
                  :reading-list="accountDetail.readingAdvisorList"
                  @update="setInputSearchList($event)"
                />
              </div>
            </template>
          </template>
          <div class="form-item is-title">
            <RequiredFormLabel class="title" label="氏名" :required="true" />
            <div class="name">
              <CustomInputText
                v-model="accountDetail.lastName"
                class="last-name"
                maxlength="30"
                placeholder="入力例：佐藤"
                :validation="
                  $common.getFormItemsDetail(formItems, 'lastName').validation
                "
              />
              <CustomInputText
                v-model="accountDetail.firstName"
                class="first-name"
                maxlength="30"
                placeholder="入力例：太郎"
                :validation="
                  $common.getFormItemsDetail(formItems, 'firstName').validation
                "
              />
            </div>
          </div>
          <div class="form-item is-title">
            <RequiredFormLabel
              class="title"
              label="フリガナ"
              :required="true"
            />
            <div class="name">
              <CustomInputText
                v-model="accountDetail.lastNameKana"
                class="last-name"
                maxlength="30"
                placeholder="入力例：サトウ"
                :validation="
                  $common.getFormItemsDetail(formItems, 'lastNameKana')
                    .validation
                "
              />
              <CustomInputText
                v-model="accountDetail.firstNameKana"
                class="first-name"
                maxlength="30"
                placeholder="入力例：タロウ"
                :validation="
                  $common.getFormItemsDetail(formItems, 'firstNameKana')
                    .validation
                "
              />
            </div>
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="メールアドレス"
              :required="true"
            />
            <CustomInputText
              v-model="accountDetail.mailAddress"
              maxlength="254"
              placeholder="入力例：account@tanaka.co.jp"
              :validation="
                $common.getFormItemsDetail(formItems, 'mailAddress').validation
              "
              @blur="checkSameMailAddress()"
            />
          </div>
        </div>
      </div>
      <div v-if="isEditPage" class="buttons">
        <button
          class="btn btn-long btn-cancel"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultAccountDetail,
              accountDetail
            ),
          }"
          @click="exeCancel()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateAccountDetail()"
        >
          アカウント情報を保存
        </button>
      </div>
      <div v-else class="buttons">
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="createNewAccountDetail()"
        >
          アカウントを作成
        </button>
      </div>
    </div>
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      selectAvailableFunction: [],
      availableFunctionOptions: [],
      defaultAccountDetail: {},
      searchText: '',
      afterFunc: '',
      mmiActivateData: {},
      mmiActivate: {
        complete: {
          stt: true,
          msg: 'アクティベートは完了しています。',
          linkUrl: '',
          linkTxt: '',
        },
        incomplete: {
          stt: false,
          msg: 'bizskyIDのアクティベートが必要です。',
          linkUrl: '/account/connect/mjs-datalake/',
          linkTxt: 'アクティベートする',
        },
      },
      accountDetail: {
        status: '0',
        availableFunctionList: [],
        dataLakeOption: [],
        reading: false,
        lastName: '',
        firstName: '',
        mailAddress: '',
      },
      statusOptions: [
        {
          value: '1',
          label: '有効',
        },
        {
          value: '0',
          label: '無効',
        },
      ],
      formItems: [
        {
          id: 'availableFunctionList',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'lastName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'firstName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'lastNameKana',
          maxLength: '30',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.zenKana,
              message: this.$common.getMasterMessage('ErrorMsg_Format04'),
            },
          ],
        },
        {
          id: 'firstNameKana',
          maxLength: '30',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.zenKana,
              message: this.$common.getMasterMessage('ErrorMsg_Format04'),
            },
          ],
        },
        {
          id: 'mailAddress',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumberSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Format01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mail,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg', 'masterData']),
    /**
     * 編集画面確認フラグ
     *
     * @return {boolean} true:アカウント編集画面 false:新規アカウント作成画面
     */
    isEditPage() {
      return this.tenantUserId !== undefined
    },
    /**
     * データレイクオプションにチェックがある場合、顧問先の閲覧制限を表示
     *
     * @return {boolean} true:顧問先の閲覧制限を表示 false:顧問先の閲覧制限を非表示
     */
    isUseDataLakeOption() {
      for (const index in this.accountDetail.availableFunctionList) {
        const item = this.accountDetail.availableFunctionList[index]

        if (item.functionId === '08' || item.functionId === '09') {
          if (item.selectFlag) {
            return true
          }
        }
      }

      return false
    },
    /**
     * アカウント情報を保存ボタンdisabledチェック
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.accountDetail) {
          if (key === 'availableFunctionList') {
            if (this.selectAvailableFunction.length === 0) {
              result = true
              break
            }
          } else if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.accountDetail[key]
            )
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
  },
  watch: {},
  created() {
    this.tenantUserId = this.$route.params.accountId

    if (this.isEditPage) {
      this.getAccountDetail() // アカウント情報取得(編集)
    } else {
      this.getNewAccountDetail() // アカウント情報取得(新規)
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * データレイクオプションアクティベート完了時ボタンのラベルを取得
     */
    getDataLakeOptionReturnTitle() {
      return this.isEditPage ? 'アカウント編集' : '新規アカウント作成'
    },
    /**
     * データレイクオプション項目非活性確認
     *
     * @param {string} functionId 機能ID
     * @return {boolean} true:非活性 false:活性
     */
    isDataLakeOptionDisabled(functionId) {
      if (this.accountDetail.managementFlag === 1) {
        // 管理者の場合は選択不可
        return true
      }

      if (!this.accountDetail.activateStatus) {
        // 未アクティベートの場合は選択不可
        return true
      }

      if (functionId === '08') {
        return !this.accountDetail.cfmOption
      } else {
        return !this.accountDetail.mmiOption
      }
    },
    /**
     * 利用可能機能リストの取得
     *
     * @param {Object} data アカウント情報詳細
     * @return {Object[]} 利用可能機能リスト
     */
    getAvailableFunctionOptions(data) {
      const functionList = data.availableFunctionList.filter(
        (availableFunction) => {
          if (
            availableFunction.functionId !== '08' &&
            availableFunction.functionId !== '09'
          ) {
            return availableFunction
          }
        }
      )

      return functionList.map((availableFunction) => {
        let isDisabled = false
        const functionName = this.$common.getVersatileItem(
          20,
          availableFunction.functionId,
          'value'
        )

        if (
          data.managementFlag === 1 ||
          (data.managementFlag !== 1 &&
            availableFunction.functionId === '06') ||
          availableFunction.functionId === '10'
        ) {
          // 管理者 管理者以外 アカウント設定は非活性
          isDisabled = true
        }

        return {
          value: availableFunction.functionId,
          label: functionName,
          checked: availableFunction.selectFlag,
          disabled: isDisabled,
        }
      })
    },
    /**
     * データレイクオプションリストの取得
     *
     * @return {Object[]} データレイクオプションリスト
     */
    getActivateList() {
      return this.accountDetail.availableFunctionList.filter(function (
        activateList
      ) {
        if (
          activateList.functionId === '08' ||
          activateList.functionId === '09'
        ) {
          return activateList
        }
      })
    },
    /**
     * 顧問先一覧インプット値の変更をセット
     *
     * @param {string[]} newList 顧問先一覧リスト
     */
    setInputSearchList(newList) {
      this.accountDetail.readingAdvisorList = newList
    },
    /**
     * 利用可能機能機能名の取得
     *
     * @param {string} functionId 機能ID
     * @return {string} 利用可能機能機能名
     */
    getAvailableFunctionName(functionId) {
      if (functionId === '09') {
        return (
          this.$common.getVersatileItem(20, functionId, 'value') +
          '（経営指標）'
        )
      } else {
        return this.$common.getVersatileItem(20, functionId, 'value')
      }
    },
    /**
     * アカウント情報取得(新規)
     */
    getNewAccountDetail() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getNewAccountDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initAccountDetail(resData.data.detailData)
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
     * アカウント情報取得(編集)
     */
    getAccountDetail() {
      const paramData = {
        tenantUserId: this.tenantUserId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getAccountDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initAccountDetail(resData.data.detailData)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
            this.$router.push('/account/users/')
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * アカウントデータ初期処理
     *
     * @param {Object} data アカウント情報詳細
     */
    initAccountDetail(data) {
      this.accountDetail = data

      if (!this.isEditPage) {
        this.accountDetail.managementFlag = 0 // 新規の場合は管理者以外
      }

      // テーブルの表示フラグの設定
      if (this.$common.checkArrayValue(this.accountDetail.readingAdvisorList)) {
        for (let i = 0; i < this.accountDetail.readingAdvisorList.length; i++) {
          this.accountDetail.readingAdvisorList[i].showFlg = true
        }
      } else {
        this.accountDetail.readingAdvisorList = []
      }

      if (
        // MMIがアクティベートされていない場合 かつ mmiとcfmがどちらもオプション契約無の場合
        this.accountDetail.mmiOption ||
        this.accountDetail.cfmOption
      ) {
        if (this.accountDetail.activateStatus) {
          // MMIがアクティベートされている場合
          this.mmiActivateData = this.mmiActivate.complete
        } else {
          // MMIがアクティベートされていない場合
          this.mmiActivateData = this.mmiActivate.incomplete
        }
      }

      this.defaultAccountDetail = JSON.parse(JSON.stringify(data))
      this.availableFunctionOptions = this.getAvailableFunctionOptions(data)
      this.setSelectAvailableFunctionList()
    },
    /**
     * 利用可能機能チェック配列の作成
     */
    setSelectAvailableFunctionList() {
      this.selectAvailableFunction = []

      this.defaultAccountDetail.availableFunctionList.forEach((item) => {
        if (
          item.selectFlag &&
          item.functionId !== '08' &&
          item.functionId !== '09'
        ) {
          this.selectAvailableFunction.push(item.functionId)
        }
      })
    },
    /**
     * アカウントを作成ボタンの処理
     * 新規作成時は一覧へ戻る
     */
    createNewAccountDetail() {
      const paramData = this.getAccountDetailParam()

      this.$common.addCallApiNum()
      this.$api
        .createNewAccountDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/account/users/')
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * アカウント情報を保存ボタンの処理
     */
    updateAccountDetail() {
      const paramData = this.getAccountDetailParam()

      this.$common.addCallApiNum()
      this.$api
        .updateAccountDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.selectAvailableFunction = []
            this.getAccountDetail()
            this.$common.getMasterData()
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * アカウント情報更新APIのリクエストパラメータの取得
     *
     * @return {Object} アカウント情報更新APIのリクエストパラメータ
     */
    getAccountDetailParam() {
      const paramData = {}

      paramData.tenantUserId = this.tenantUserId
      paramData.detailData = JSON.parse(JSON.stringify(this.accountDetail))

      delete paramData.detailData.managementFlag
      delete paramData.detailData.fullName
      delete paramData.detailData.activateStatus
      delete paramData.detailData.corporateType
      delete paramData.detailData.mmiOption
      delete paramData.detailData.cfmOption

      for (let i = 0; i < paramData.detailData.readingAdvisorList.length; i++) {
        delete paramData.detailData.readingAdvisorList[i].showFlg
      }

      return paramData
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    exeCancel() {
      this.afterFunc = ''
      this.showCancelEditModal()
    },
    /**
     * アカウント一覧に戻る
     */
    toBack() {
      const sameInputDataFlg = this.$common.checkSameObject(
        this.defaultAccountDetail,
        this.accountDetail
      )

      if (sameInputDataFlg) {
        this.$router.push('/account/users/')
      } else {
        this.afterFunc = 'back'
        this.showCancelEditModal()
      }
    },
    /**
     * メールアドレスの重複チェック
     */
    checkSameMailAddress() {
      const paramData = {
        email: this.accountDetail.mailAddress,
      }

      if (
        this.accountDetail.mailAddress.length === 0 ||
        this.defaultAccountDetail.mailAddress ===
          this.accountDetail.mailAddress ||
        this.$common.checkExistValidation(
          this.formItems,
          'mailAddress',
          this.accountDetail.mailAddress,
          true
        )
      ) {
        this.deleteCustomMailAddressValidation() // メールアドレス重複チェックのバリデーションエラーの削除
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .checkSameMailAddress(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (resData.data.isDuplicated === 1) {
              this.addCustomMailAddressValidation()
            } else {
              this.deleteCustomMailAddressValidation() // メールアドレス重複チェックのバリデーションエラーの削除
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
     * メールアドレス重複チェックのバリデーションエラーの追加
     */
    addCustomMailAddressValidation() {
      const mailAddressValidation = this.formItems.find(
        (data) => data.id === 'mailAddress'
      ).validation

      if (
        mailAddressValidation.findIndex((data) => data.type === 'custom') < 0
      ) {
        mailAddressValidation.push({
          type: 'custom',
          message: this.$common.getMasterMessage('ErrorMsg_Mail04'),
        })
      }
    },
    /**
     * メールアドレス重複チェックのバリデーションエラーの削除
     */
    deleteCustomMailAddressValidation() {
      const mailAddressValidation = this.formItems.find(
        (data) => data.id === 'mailAddress'
      ).validation
      const findIndex = mailAddressValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        mailAddressValidation.splice(findIndex, 1)
      }
    },
    /**
     * 編集破棄処理
     */
    restoreSettings() {
      if (this.afterFunc === 'back') {
        this.$router.push('/account/users/')
      } else {
        this.accountDetail = JSON.parse(
          JSON.stringify(this.defaultAccountDetail)
        )
        this.setSelectAvailableFunctionList()
        this.deleteCustomMailAddressValidation() // メールアドレス重複チェックのバリデーションエラーの削除
      }

      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * 検索絞り込みリストの設定
     *
     * @param {string} searchWord 絞り込みワード
     */
    setNewSearchList(searchWord) {
      const searchKeyList = ['companyCode', 'companyName'] // 部分一致検索に利用するaccountListのkey指定
      const newSearchReadingList = JSON.parse(
        JSON.stringify(this.accountDetail.readingAdvisorList)
      )

      // 絞り込み検索時は、部分一致したデータのみsearchVisibleをtrueへ
      for (let i = 0; i < newSearchReadingList.length; i++) {
        newSearchReadingList[i].showFlg = false
        for (let j = 0; j < searchKeyList.length; j++) {
          if (
            newSearchReadingList[i][searchKeyList[j]]
              .toString()
              .includes(searchWord)
          ) {
            newSearchReadingList[i].showFlg = true
          }
        }
      }

      this.accountDetail.readingAdvisorList = newSearchReadingList
    },
    /**
     * 顧問先の閲覧制限チェック時
     *
     * @param {boolean} checked チェックボックスの値
     */
    setReadingSetting(checked) {
      if (!checked) {
        this.accountDetail.readingAdvisorList = JSON.parse(
          JSON.stringify(this.defaultAccountDetail.readingAdvisorList)
        )
      }
    },
    /**
     * 利用可能機能のチェック反映
     *
     * @param {string[]} selectVals 選択値
     */
    reflectAvailableFunction(selectVals) {
      for (
        let i = 0;
        i < this.accountDetail.availableFunctionList.length;
        i++
      ) {
        if (
          this.accountDetail.availableFunctionList[i].functionId === '08' ||
          this.accountDetail.availableFunctionList[i].functionId === '09'
        ) {
          continue
        }

        if (
          selectVals.includes(
            this.accountDetail.availableFunctionList[i].functionId
          )
        ) {
          this.accountDetail.availableFunctionList[i].selectFlag = true
        } else {
          this.accountDetail.availableFunctionList[i].selectFlag = false
        }
      }
    },
  },
  head() {
    return {
      title: this.isEditPage
        ? this.accountDetail.lastName +
          this.accountDetail.firstName +
          'さんのアカウント編集｜アカウント｜bizskyDX'
        : '新規アカウント作成｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.account-edit {
  .main-contents {
    .header {
      margin-top: 16px;
    }
    .contents {
      .form-block {
        margin-top: 32px;
        padding: 32px 0 48px 0;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        .form-item {
          .title {
            margin-bottom: 10px;
            font-weight: 500;
          }
          &:not(:last-child):not(.is-reading) {
            margin-bottom: 48px;
          }
          &.is-reading {
            margin-bottom: 27px;
          }
          &.is-title {
            margin-top: 51px;
          }
          .name {
            display: flex;
            align-items: center;
            .last-name,
            .first-name {
              width: 100%;
            }
            .first-name {
              margin-left: 16px;
            }
          }
          .function-option {
            display: flex;
            align-items: center;
            margin-top: 12px;
            ::v-deep .customLinkText {
              margin-left: 12px;
            }
          }
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
.readingSetting {
  border-top: #e5e5e5 1px solid;
  padding-top: 32px;
  &-txt {
    margin-bottom: 16px;
  }
  &-input {
    margin-bottom: 24px;
  }
}
</style>
