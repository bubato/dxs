<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal-title">
            <h2>企業プロフィール入力</h2>
          </div>
          <!-- form入力 -->
          <div class="modal-contents">
            <div v-if="Object.keys(editCompanyData).length > 0">
              <div class="modal-body">
                <div
                  v-for="(settingForm, index1) in settingFormList"
                  :key="index1"
                  :class="settingForm.parentId"
                  class="section"
                >
                  <div class="heading flex">
                    <h3>
                      {{ settingForm.heading }}
                    </h3>
                    <ProgressBar
                      class="progress"
                      :progress="getVatidationPercent(settingForm)"
                    />
                    <p class="font-size-middle">
                      {{ getVatidationPercent(settingForm) }}%
                    </p>
                  </div>
                  <template
                    v-if="Array.isArray(editCompanyData[settingForm.parentId])"
                  >
                    <div
                      v-for="(profileData, index2) in editCompanyData[
                        settingForm.parentId
                      ]"
                      :key="index2"
                      class="input-forms"
                    >
                      <DeleteSVG
                        v-if="index2 > 0"
                        class="icon icon-delete"
                        @click="deleteItem(settingForm.parentId, index2)"
                        @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                        @mouseleave="$common.setAreaLabel($event, '', '')"
                        @blur="$common.setAreaLabel($event, '', '')"
                      />
                      <FormComponent
                        :form-detail-list="settingForm.detail"
                        :edit-profile-data="profileData"
                        :form-index="index2"
                        @updateCustomValidation="updateCustomValidation($event)"
                        @updateLogoData="updateLogoData($event)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="input-forms">
                      <FormComponent
                        :form-detail-list="settingForm.detail"
                        :edit-profile-data="
                          editCompanyData[settingForm.parentId]
                        "
                        :form-index="0"
                        @pushData="pushData"
                        @updateCustomValidation="updateCustomValidation($event)"
                        @updateLogoData="updateLogoData($event)"
                      />
                    </div>
                  </template>
                </div>
              </div>
              <div class="section footer">
                <p class="flex flex-center">
                  入力完了率<ProgressBar
                    class="progress"
                    :progress="profileSettingsProgress"
                  />{{ profileSettingsProgress }}%
                </p>
                <div class="buttons flex flex-center">
                  <button
                    class="btn btn-basic btn-long"
                    :class="{ 'btn-disabled': checkBtnDisabled() }"
                    @click="updateCompanyProfie()"
                  >
                    登録内容を保存
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- form入力 -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CompanyProfileModal',
  components: {},
  props: {
    initialSettings: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      defaultEditCompanyData: {},
      editCompanyData: {},
      newLogoData: null,
      settingFormList: [
        {
          heading: '基本設定',
          parentId: 'basicSettings',
          detail: [
            {
              name: '企業名',
              required: true,
              form: [
                {
                  id: 'name',
                  class: 'name',
                  placeholder: '入力例：株式会社田中商事',
                  formType: 'inputText',
                  maxLength: '50',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                  ],
                },
              ],
            },
            {
              name: '法人番号',
              required: false,
              class: 'linktext',
              form: [
                {
                  id: 'number',
                  class: 'number medium',
                  placeholder: '入力例：1234567891234',
                  formType: 'inputText',
                  maxLength: '13',
                  validation: [
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.halfNumber,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Format03'
                      ),
                    },
                  ],
                  linkTextId: 'numberLink',
                  linkText: '法人番号が分からない方はこちら',
                  linkTextUrl: 'https://www.houjin-bangou.nta.go.jp/',
                },
              ],
            },
            {
              name: '業種',
              required: true,
              form: [
                {
                  id: 'industry',
                  class: 'industry medium',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: this.$common.getVersatileOptions(1),
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required02'
                      ),
                    },
                  ],
                },
              ],
            },
            {
              name: '代表者名',
              required: true,
              form: [
                {
                  id: 'lastName',
                  placeholder: '入力例：佐藤',
                  formType: 'inputText',
                  maxLength: '30',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                  ],
                },
                {
                  id: 'firstName',
                  placeholder: '入力例：太郎',
                  formType: 'inputText',
                  maxLength: '30',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                  ],
                },
              ],
            },
            {
              name: '代表電話番号',
              required: true,
              form: [
                {
                  id: 'tel',
                  class: 'tel medium',
                  placeholder: '入力例：0312345678（ハイフンは不要です）',
                  formType: 'inputTel',
                  maxLength: '11',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.halfNumber,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Format03'
                      ),
                    },
                  ],
                },
              ],
            },
            {
              name: '本社所在地(都道府県、市区町村、番地は入力必須です)',
              required: true,
              class: 'address',
              form: [
                {
                  id: 'postCode',
                  class: 'postCode',
                  placeholder: '入力例：1234567（ハイフンは不要です）',
                  formType: 'postCode',
                  maxLength: '7',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.halfNumber,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Format03'
                      ),
                    },
                  ],
                },
                {
                  id: 'addressState',
                  class: 'addressState medium',
                  placeholder: '入力例：東京都',
                  formType: 'select',
                  options: this.$common.getVersatileOptions(17),
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                  ],
                },
                {
                  id: 'addressCity',
                  class: 'addressCity medium',
                  placeholder: '入力例：港区赤坂',
                  formType: 'inputText',
                  maxLength: '20',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                  ],
                },
                {
                  id: 'addressLine1',
                  class: 'addressLine1 medium',
                  placeholder: '入力例：7-1-1（半角で入力してください）',
                  formType: 'inputText',
                  maxLength: '255',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                  ],
                },
                {
                  id: 'addressLine2',
                  class: 'addressLine2 medium',
                  placeholder: '入力例：青山安田ビル',
                  formType: 'inputText',
                  maxLength: '255',
                  validation: [],
                },
              ],
            },
            {
              name: 'Webサイト',
              required: false,
              form: [
                {
                  id: 'website',
                  placeholder: '入力例：https://www.example.jp/',
                  formType: 'inputText',
                  maxLength: '2000',
                  validation: [
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.domain,
                      message: this.$common.getMasterMessage('ErrorMsg_Url02'),
                    },
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.protocol,
                      message: this.$common.getMasterMessage('ErrorMsg_Url03'),
                    },
                  ],
                },
              ],
            },
            {
              name: 'ロゴ',
              required: false,
              form: [
                {
                  id: 'image',
                  formType: 'logoFileUpload',
                  class: 'logo-file-upload',
                  validation: [],
                },
              ],
            },
          ],
        },
        // {
        //   heading: '請求先情報',
        //   parentId: 'billingAddress',
        //   detail: [
        //     {
        //       required: true,
        //       form: [
        //         {
        //           id: 'checkBillingAddress',
        //           class: 'checkBillingAddress',
        //           placeholder: '',
        //           formType: 'singleCheckbox',
        //           label: '上記と同じ担当者、住所宛てに請求する',
        //           validation: [
        //             {
        //               type: 'required',
        //               message: this.$common.getMasterMessage(
        //                 'ErrorMsg_Required01'
        //               ),
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          heading: '詳細情報',
          parentId: 'detail',
          detail: [
            {
              name: '創業',
              required: false,
              form: [
                {
                  id: 'foundedY',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'yearList',
                  validation: [],
                },
                {
                  id: 'foundedM',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'monthList',
                  validation: [],
                },
              ],
            },
            {
              name: '従業員数',
              required: false,
              form: [
                {
                  id: 'numberOfEmployees',
                  class: 'numberOfEmployees short',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: this.$common.getVersatileOptions(8),
                  validation: [],
                },
              ],
            },
            {
              name: '上場区分',
              required: false,
              class: 'listingClassification',
              form: [
                {
                  id: 'listingClassificationRadio',
                  formType: 'radio',
                  options: [
                    {
                      value: '0',
                      label: '非上場',
                    },
                    {
                      value: '1',
                      label: '上場',
                    },
                  ],
                  validation: [],
                },
                {
                  id: 'listingClassificationSelect',
                  class: 'listingClassificationSelect medium',
                  formType: 'select',
                  placeholder: '選択してください',
                  options: this.$common.getVersatileOptions(10),
                  validation: [],
                },
              ],
            },
            {
              name: '決算月',
              required: false,
              form: [
                {
                  id: 'closingMonth',
                  class: 'closingMonth short',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'monthList',
                  validation: [],
                },
              ],
            },
            {
              name: '資本金',
              required: false,
              form: [
                {
                  id: 'capital',
                  placeholder: '入力例：1000000',
                  formType: 'inputText',
                  maxLength: '20',
                  validation: [],
                },
              ],
            },
            {
              name: '売上',
              required: false,
              form: [
                {
                  id: 'sales',
                  placeholder: '入力例：1000000',
                  formType: 'inputText',
                  maxLength: '20',
                  validation: [],
                },
              ],
            },
            {
              name: '役員',
              required: false,
              form: [
                {
                  id: 'officer',
                  class: 'officerPosition short',
                  placeholder: '',
                  formType: 'draggable',
                  validation: [],
                },
              ],
            },
            {
              name: '事業内容',
              required: false,
              form: [
                {
                  id: 'businessContent',
                  class: 'businessContent',
                  placeholder: '事業内容を入力してください',
                  formType: 'textarea',
                  maxLength: '2000',
                  validation: [
                    {
                      type: 'maxlength',
                      maxlength: 2000,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Count01',
                        { maxlength: 2000 }
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * プロフィール設定
     */
    profileSettingsProgress() {
      // 全項目数
      let itemNum = 0
      for (const index in this.settingFormList) {
        for (const index2 in this.settingFormList[index].detail) {
          if (
            this.settingFormList[index].detail[index2].form[0].formType ===
              'radio' ||
            this.settingFormList[index].detail[index2].form[0].formType ===
              'singleCheckbox'
          ) {
            // formタイプがradioとsingleInputのときはカウントから除く
            // 選択した値に応じてカウントする項目が変化する場合あり
            if (
              this.settingFormList[index].detail[index2].name === '上場区分' &&
              this.editCompanyData.detail.listingClassificationRadio !== '0'
            ) {
              itemNum++
            }
          } else if (this.settingFormList[index].parentId === 'basicSettings') {
            // 姓名等、一つのformに二つ以上の項目がある場合
            itemNum += this.settingFormList[index].detail[index2].form.length
          } else {
            itemNum++
          }
        }
      }
      // エラー項目数
      let validationErrorNumResult = 0
      for (const index in this.settingFormList) {
        validationErrorNumResult += this.getValidationErrorNum(
          this.settingFormList[index].detail,
          this.settingFormList[index].parentId
        )
      }

      return Math.floor(((itemNum - validationErrorNumResult) / itemNum) * 100)
    },
    /**
     * 項目ごと入力率の計算
     */
    getVatidationPercent() {
      return (settingForm) => {
        let itemNum = 0
        let validationErrorNum = 0
        let showPercent = 0

        for (const index in settingForm.detail) {
          if (
            settingForm.detail[index].form[0].formType === 'radio' ||
            settingForm.detail[index].form[0].formType === 'singleCheckbox'
          ) {
            // formタイプがradioとsingleInputのときはカウントから除く
            // 選択した値に応じてカウントする項目が変化する場合あり
            if (
              settingForm.detail[index].name === '上場区分' &&
              this.editCompanyData.detail.listingClassificationRadio !== '0'
            ) {
              itemNum++
            }
          } else if (settingForm.parentId === 'basicSettings') {
            // 姓名等、一つのformに二つ以上の項目がある場合
            itemNum += settingForm.detail[index].form.length
          } else {
            itemNum++
          }
        }

        validationErrorNum = this.getValidationErrorNum(
          settingForm.detail,
          settingForm.parentId
        )

        showPercent = Math.floor(
          ((itemNum - validationErrorNum) / itemNum) * 100
        )

        return showPercent
      }
    },
    /**
     * ボタン非活性処理
     */
    checkBtnDisabled() {
      return () => {
        let result = false
        let modelData = {}

        modelData = Object.assign(
          JSON.parse(JSON.stringify(this.editCompanyData.basicSettings)),
          JSON.parse(JSON.stringify(this.editCompanyData.detail))
        )

        for (
          let parentIndex = 0;
          parentIndex < this.settingFormList.length;
          parentIndex++
        ) {
          const detailObj = this.settingFormList[parentIndex].detail
          for (
            let detailIndex = 0;
            detailIndex < detailObj.length;
            detailIndex++
          ) {
            const formObj = detailObj[detailIndex].form
            if (detailObj[detailIndex].required) {
              for (let formIndex = 0; formIndex < formObj.length; formIndex++) {
                if (
                  formObj[formIndex].validation.length !== 0 &&
                  formObj[formIndex].id !== 'checkBillingAddress'
                ) {
                  const objct = {
                    id: formObj[formIndex].id,
                    validation: formObj[formIndex].validation,
                  }

                  if (
                    this.$common.checkExistValidation(
                      [objct],
                      objct.id,
                      modelData[objct.id]
                    )
                  ) {
                    result = true
                    break
                  }
                }
              }
            }
          }
        }

        return result
      }
    },
  },
  created() {
    this.getCompanyData() // 企業情報の取得
  },
  mounted() {},
  methods: {
    /**
     * 企業情報の取得
     */
    getCompanyData() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCompanyData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const editCompanyData = this.setNullInitData(resData.data.profile)
            this.defaultEditCompanyData = JSON.parse(
              JSON.stringify(editCompanyData)
            )
            this.editCompanyData = editCompanyData
            this.initSelectOptions() // セレクトボックスの初期値設定
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
     * nullが返ってきたデータの初期値設定
     *
     * @param {object} editProfileData 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(editProfileData) {
      if (!this.$common.checkArrayValue(editProfileData.detail.officer)) {
        editProfileData.detail.officer.push({
          position: '',
          name: '',
        })
      }

      // nullで返ってきた文字列を空文字に変換
      this.$common.setNullConvertStringValue(editProfileData.basicSettings, [])
      this.$common.setNullConvertStringValue(editProfileData.billingAddress, [])
      this.$common.setNullConvertStringValue(editProfileData.detail, [
        'officer',
      ])

      editProfileData.detail.listingClassificationRadio =
        editProfileData.detail.listingClassificationRadio || '0'

      return editProfileData
    },
    /**
     * emit
     */
    pushData() {
      const _this = this
      _this.editCompanyData.detail.officer.push({
        position: '',
        name: '',
      })
      this.editCompanyData = _this.editCompanyData
    },
    /**
     * セレクトボックスの初期値設定
     */
    initSelectOptions() {
      for (const key in this.settingFormList) {
        if (this.settingFormList[key].detail) {
          this.settingFormList[key].detail = this.getSelectOptions(
            this.settingFormList[key].detail
          )
        }
      }
    },
    /**
     * セレクトボックスの初期値取得
     *
     * @param {array} detailList フォームリスト
     */
    getSelectOptions(detailList) {
      const newDetailList = detailList

      for (let i = 0; i < newDetailList.length; i++) {
        for (let j = 0; j < newDetailList[i].form.length; j++) {
          if (newDetailList[i].form[j].options) {
            if (newDetailList[i].form[j].options === 'yearList') {
              newDetailList[i].form[
                j
              ].options = this.$common.createSelectYearOptions(200)
            } else if (newDetailList[i].form[j].options === 'monthList') {
              newDetailList[i].form[
                j
              ].options = this.$common.createSelectMonthOptions()
            }
          }
        }
      }

      return newDetailList
    },
    /**
     * 必須入力入力率チェック
     * ※※※※入力チェックのみ実装。
     */
    checkRequired() {
      const result = []
      for (const baseContents in this.settingFormList) {
        const obj = this.settingFormList[baseContents].detail
        const parentID = this.settingFormList[baseContents].parentId
        for (const formDetail in obj) {
          const formDetailContent = obj[formDetail]
          if (formDetailContent.required) {
            const forms = formDetailContent.form
            for (const form in forms) {
              const formid = forms[form].id
              if (this.editCompanyData[parentID][formid] === '') {
                if (formid !== 'addressLine1') {
                  if (formid !== 'addressLine2') {
                    result.push(formid)
                  }
                }
              }
            }
          }
        }
      }
      return result
    },
    /**
     * 企業プロフィール情報更新
     */
    updateCompanyProfie() {
      const paramData = this.getCompanyProfileParamData()

      this.$common.addCallApiNum()
      this.$api
        .updateCorporateProfileData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (
              this.editCompanyData.basicSettings.image !==
                this.defaultEditCompanyData.basicSettings.image &&
              this.editCompanyData.basicSettings.image
            ) {
              this.uploadSettingBasicLogo()
            } else {
              this.$emit('update')
              this.$emit('close')
            }

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
     * プロフィール更新APIのリクエストパラメータの取得
     * プロフィール設定をコピーしたままなので、適宜修正
     */
    getCompanyProfileParamData() {
      const paramData = {
        profile: JSON.parse(JSON.stringify(this.editCompanyData)),
      }

      // 不要なリクエストパラメータの削除
      delete paramData.profile.coverImageCode
      delete paramData.profile.basicSettings.lastNameKana
      delete paramData.profile.basicSettings.firstNameKana
      delete paramData.profile.goodsAndServices

      if (paramData.profile.basicSettings.image) {
        paramData.profile.basicSettings.image = this.defaultEditCompanyData.basicSettings.image
      }

      for (let i = 0; i < paramData.profile.detail.length; i++) {
        if (
          paramData.profile.workHistory[i].listingClassificationRadio === '0'
        ) {
          delete paramData.profile.detail.listingClassificationSelect
        }
      }

      return paramData
    },
    /**
     * 会社ロゴ画像アップロード処理
     */
    uploadSettingBasicLogo() {
      const paramData = new FormData()

      paramData.append('imageFile', this.newLogoData)

      this.$common.addCallApiNum()
      this.$api
        .uploadSettingBasicLogo(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
            this.newLogoData = null
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
     * 入力項目のバリデーションチェック処理
     *
     * @param {array} detail フォームリスト
     * @param {string} parentId フォームID(親)
     */
    getValidationErrorNum(detail, parentId) {
      let validationErrorNum = 0

      for (const detailIndex in detail) {
        for (const formObjInedx in detail[detailIndex].form) {
          const formObj = detail[detailIndex].form[formObjInedx]
          const obj = {
            id: formObj.id,
            validation: formObj.validation,
          }
          if (
            (formObj.id === 'listingClassificationSelect' &&
              this.editCompanyData.detail.listingClassificationRadio === '0') ||
            formObj.formType === 'radio' ||
            formObj.formType === 'singleCheckbox'
          ) {
          } else if (
            this.$common.checkExistValidation(
              [obj],
              formObj.id,
              this.editCompanyData[parentId][formObj.id]
            ) ||
            this.editCompanyData[parentId][formObj.id] === ''
          ) {
            validationErrorNum++

            // 創業は年月で1項目としてカウント
            if (detail[detailIndex].name === '創業') {
              break
            }
          }
          // 役員は1件でも入力あれば、OK、0件の場合はエラー
          if (detail[detailIndex].name === '役員') {
            const result = this.editCompanyData[parentId][formObj.id]
              .map(function (obj) {
                return Object.keys(obj)
                  .map(function (item) {
                    return obj[item]
                  })
                  .join('')
              })
              .join('')

            if (result === '') {
              validationErrorNum++
            }
          }
        }
      }

      return validationErrorNum
    },
    /**
     * カスタムバリデーションの追加
     */
    updateCustomValidation(validationInfo) {
      const postCode = this.getPostCodeInfo()

      if (validationInfo.type === 'add') {
        postCode.validation.push({
          type: 'custom',
          message: validationInfo.message,
        })
      } else if (validationInfo.type === 'delete') {
        const findIndex = postCode.validation.findIndex(
          (data) => data.type === 'custom'
        )

        if (findIndex >= 0) {
          postCode.validation.splice(findIndex, 1)
        }
      }
    },
    /**
     * 入力フィールドの削除
     */
    deleteItem(parentId, index) {
      this.editCompanyData[parentId].splice(index, 1)
    },
    getPostCodeInfo() {
      const basicSettings = this.settingFormList.find(
        (data) => data.parentId === 'basicSettings'
      )
      const address = basicSettings.detail.find(
        (data) =>
          data.name === '本社所在地(都道府県、市区町村、番地は入力必須です)'
      )
      const postCode = address.form.find((data) => data.id === 'postCode')

      return postCode
    },
    /**
     * 新ロゴ画像の設定
     *
     * @param {object} logoData ロゴデータ
     */
    updateLogoData(logoData) {
      this.newLogoData = logoData
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  &:not(:first-of-type) {
    padding-top: 32px;
    border-top: 1px solid #eaeaea;
  }
  .heading {
    display: flex;
    align-items: center;
    .progress {
      margin-left: 20px;
      margin-right: 8px;
      width: 120px;
    }
  }
  .input-forms {
    margin-top: 40px;
    position: relative;
    .icon {
      position: absolute;
      right: 0;
      cursor: pointer;
    }
  }
  // Phase1対応
  &.billingAddress {
    display: none;
  }
}
.footer {
  padding-top: 32px;
  .progress {
    width: 120px;
    margin-right: 11px;
    margin-left: 16px;
  }
  .buttons {
    margin-top: 25px;
    .btn {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
// モーダル
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 24px 30px 40px;
  overflow-y: scroll;
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    width: 17px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 5px solid transparent;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }
  .modal-title {
    text-align: center;
    margin-bottom: 44px;
  }
}
.modal-body {
  overflow-y: scroll;
  height: calc(100vh - 350px);
}
// モーダル
</style>
