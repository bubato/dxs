<template>
  <!-- main-contents -->
  <div v-if="Object.keys(editProfileData).length > 0" class="main-contents">
    <ToBackScreenLink
      label="プロフィールへ戻る"
      @click="toBackProfileScreen()"
    />
    <div class="header flex">
      <h2 class="header-title">プロフィール設定</h2>
      <ProgressBar class="progress-bar" :progress="profileSettingsProgress" />
      <p class="font-size-middle">{{ profileSettingsProgress }}%</p>
    </div>

    <div
      v-for="(settingForm, index1) in settingFormList"
      :key="index1"
      class="section"
    >
      <div class="heading flex">
        <h3>
          {{ settingForm.heading }}
        </h3>
        <ProgressBar
          class="progress-bar"
          :progress="getValidationPercent(settingForm)"
        />
        <p class="font-size-middle">{{ getValidationPercent(settingForm) }}%</p>
      </div>
      <div class="form-contents">
        <template v-if="Array.isArray(editProfileData[settingForm.parentId])">
          <div
            v-for="(profileData, index2) in editProfileData[
              settingForm.parentId
            ]"
            :key="index2"
            class="input-forms"
          >
            <div class="input-forms-header">
              <h4>{{ index2 + 1 }}番目の{{ settingForm.heading }}</h4>
              <DeleteSVG
                v-if="index2 > 0"
                class="icon icon-delete"
                @click="deleteItem(settingForm.parentId, index2)"
                @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              />
            </div>

            <ProfileFormComponent
              :form-detail-list="settingForm.detail"
              :edit-profile-data="profileData"
              :form-index="index2"
            />
          </div>
        </template>
        <template v-else>
          <div class="input-forms">
            <ProfileFormComponent
              :form-detail-list="settingForm.detail"
              :edit-profile-data="editProfileData[settingForm.parentId]"
              :form-index="0"
            />
          </div>
        </template>
      </div>
      <div
        v-if="checkShowAddItem(settingForm)"
        class="add-item"
        @click="addItem(settingForm)"
      >
        <AddCircleSVG class="icon-addCircle" /><span
          >{{ settingForm.heading }}を追加する</span
        >
      </div>
    </div>
    <div class="section buttons flex flex-center">
      <button
        class="btn btn-cancel btn-long"
        :class="{
          'btn-disabled': $common.checkSameObject(
            defaultEditProfileData,
            editProfileData
          ),
        }"
        @click="showCancelEditModal()"
      >
        キャンセルして元に戻す
      </button>
      <button
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        class="btn btn-basic btn-long"
        @click="updateProfile()"
      >
        設定内容を保存
      </button>
    </div>
    <CommonFooter class="footer" />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="exeCancelEditModal()"
    />
  </div>
  <!-- /main-contents -->
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ProfileSettings',
  components: {},
  props: {},
  data() {
    return {
      defaultEditProfileData: {},
      editProfileData: {},
      profileSettings: {},
      cancelAfterFunc: '',
      settingFormList: [
        {
          heading: '基本設定',
          parentId: 'basicSetting',
          detail: [
            {
              name: '氏名',
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
              name: 'フリガナ',
              required: true,
              form: [
                {
                  id: 'lastNameKana',
                  placeholder: '入力例：サトウ',
                  formType: 'inputText',
                  maxLength: '30',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.zenKana,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Format04'
                      ),
                    },
                  ],
                },
                {
                  id: 'firstNameKana',
                  placeholder: '入力例：タロウ',
                  formType: 'inputText',
                  maxLength: '30',
                  validation: [
                    {
                      type: 'required',
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Required01'
                      ),
                    },
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.zenKana,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Format04'
                      ),
                    },
                  ],
                },
              ],
            },
            {
              name: '電話番号',
              required: false,
              form: [
                {
                  id: 'tel',
                  placeholder: '入力例：0312345678（ハイフンは不要です）',
                  formType: 'inputText',
                  maxLength: '11',
                  validation: [
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
          ],
        },
        {
          heading: '自己紹介',
          parentId: 'selfIntroduction',
          detail: [
            {
              name: '自己紹介文',
              required: false,
              form: [
                {
                  id: 'selfIntroduction',
                  placeholder: '自己紹介文を入力してください',
                  formType: 'textarea',
                  validation: [
                    {
                      type: 'maxlength',
                      maxlength: 2000,
                      message: this.$common.getMasterMessage(
                        'ErrorMsg_Count01',
                        {
                          maxlength: 2000,
                        }
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          heading: '職歴',
          parentId: 'workHistory',
          detail: [
            {
              name: '役職',
              required: false,
              form: [
                {
                  id: 'position',
                  placeholder: '入力例：代表取締役',
                  formType: 'inputText',
                  maxLength: '100',
                  validation: [],
                },
              ],
            },
            {
              name: '企業名',
              required: false,
              form: [
                {
                  id: 'company',
                  placeholder: '入力例：株式会社田中商事',
                  formType: 'inputText',
                  maxLength: '200',
                  validation: [],
                },
              ],
            },
            {
              name: '就業状況',
              required: false,
              form: [
                {
                  id: 'employmentStatus',
                  formType: 'radio',
                  options: [
                    {
                      value: '1',
                      label: '就業中',
                    },
                    {
                      value: '0',
                      label: '退職',
                    },
                  ],
                  validation: [],
                },
              ],
            },
            {
              name: '入社月',
              required: false,
              form: [
                {
                  id: 'hireDateStartYear',
                  formType: 'select',
                  options: 'yearList',
                  placeholder: '選択してください',
                  validation: [],
                },
                {
                  id: 'hireDateStartMonth',
                  formType: 'select',
                  options: 'monthList',
                  placeholder: '選択してください',
                  validation: [],
                },
              ],
            },
            {
              name: '退職月',
              required: false,
              form: [
                {
                  id: 'hireDateEndYear',
                  formType: 'select',
                  options: 'yearList',
                  placeholder: '選択してください',
                  validation: [],
                },
                {
                  id: 'hireDateEndMonth',
                  formType: 'select',
                  options: 'monthList',
                  placeholder: '選択してください',
                  validation: [],
                },
              ],
            },
            {
              name: '企業サイトURL',
              required: false,
              form: [
                {
                  id: 'url',
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
          ],
        },
        {
          heading: '学歴',
          parentId: 'educationalBackground',
          detail: [
            {
              name: '学校名',
              required: false,
              form: [
                {
                  id: 'schoolName',
                  formType: 'inputText',
                  placeholder: '入力例：鈴木大学',
                  maxLength: '50',
                  validation: [],
                },
              ],
            },
            {
              name: '学位',
              required: false,
              form: [
                {
                  id: 'degree',
                  formType: 'inputText',
                  placeholder: '学入力例：学士、修士、博士位',
                  maxLength: '50',
                  validation: [],
                },
              ],
            },
            {
              name: '学部・学科・専攻',
              required: false,
              form: [
                {
                  id: 'underGraduate',
                  formType: 'inputText',
                  placeholder: '入力例：経済学部経済学科グローバル経済コース',
                  maxLength: '50',
                  validation: [],
                },
              ],
            },
            {
              name: '卒業年月',
              required: false,
              form: [
                {
                  id: 'graduationYear',
                  formType: 'select',
                  class: 'select-year',
                  options: 'yearList',
                  placeholder: '選択してください',
                  validation: [],
                },
                {
                  id: 'graduationMonth',
                  formType: 'select',
                  class: 'select-month',
                  options: 'monthList',
                  placeholder: '選択してください',
                  validation: [],
                },
              ],
            },
          ],
        },
        {
          heading: '資格',
          parentId: 'qualification',
          detail: [
            {
              name: '資格名',
              required: false,
              form: [
                {
                  id: 'name',
                  formType: 'inputText',
                  placeholder: '入力例：普通自動車第一種運転免許',
                  maxLength: '50',
                  validation: [],
                },
              ],
            },
            {
              name: '発行年月',
              required: false,
              form: [
                {
                  id: 'publicationYear',
                  formType: 'select',
                  class: 'select-year',
                  options: 'yearList',
                  placeholder: '選択してください',
                  validation: [],
                },
                {
                  id: 'publicationMonth',
                  formType: 'select',
                  class: 'select-month',
                  options: 'monthList',
                  placeholder: '選択してください',
                  validation: [],
                },
              ],
            },
            {
              name: '有効期限',
              required: false,
              form: [
                {
                  id: 'checkExpiration',
                  formType: 'singleCheckbox',
                  label: '有効期限なし',
                  validation: [],
                },
              ],
            },
            {
              name: '有効期限年月',
              required: false,
              form: [
                {
                  id: 'expirationYear',
                  formType: 'select',
                  class: 'select-year',
                  options: 'yearList',
                  placeholder: '選択してください',
                  validation: [],
                },
                {
                  id: 'expirationMonth',
                  formType: 'select',
                  class: 'select-month',
                  options: 'monthList',
                  placeholder: '選択してください',
                  validation: [],
                },
              ],
            },
          ],
        },
        {
          heading: '出版物',
          parentId: 'publication',
          detail: [
            {
              name: 'タイトル',
              required: false,
              form: [
                {
                  id: 'title',
                  formType: 'inputText',
                  placeholder: '入力例：〇〇を実践するための10のルール',
                  maxLength: '50',
                  validation: [],
                },
              ],
            },
            {
              name: '出版元',
              required: false,
              form: [
                {
                  id: 'publisher',
                  formType: 'inputText',
                  placeholder: '入力例：加藤出版',
                  maxLength: '50',
                  validation: [],
                },
              ],
            },
            {
              name: '出版物URL',
              required: false,
              form: [
                {
                  id: 'publisherUrl',
                  formType: 'inputText',
                  placeholder: '入力例：https://www.example.jp/',
                  maxLength: '2000',
                  validation: [
                    {
                      type: 'regex',
                      regex: this.$globalVariable.regularExp.protocol,
                      message: this.$common.getMasterMessage('ErrorMsg_Url03'),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          heading: 'ソーシャル',
          parentId: 'social',
          detail: [
            {
              name: 'Facebookページ',
              required: false,
              form: [
                {
                  id: 'facebook',
                  placeholder: '入力例：https://www.facebook.com/0000000/',
                  formType: 'inputText',
                  maxLength: '100',
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
              name: 'Twitterプロフィール',
              required: false,
              form: [
                {
                  id: 'twitter',
                  placeholder: '入力例：https://twitter.com/0000000/',
                  formType: 'inputText',
                  maxLength: '100',
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
              name: 'Instagramプロフィール',
              required: false,
              form: [
                {
                  id: 'instagramId',
                  placeholder: '入力例：https://www.instagram.com/0000000/',
                  formType: 'inputText',
                  maxLength: '50',
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
          ],
        },
      ],
    }
  },
  computed: {
    // プロフィール画面用store
    ...mapState('common', ['showCancelEditModalFlg']),
    ...mapState('community/profileStore', ['profilePageProfile']),
    /**
     * プロフィール設定
     */
    profileSettingsProgress() {
      // 全項目数
      let itemNum = 0
      for (const index in this.settingFormList) {
        if (
          this.settingFormList[index].parentId === 'workHistory' ||
          this.settingFormList[index].parentId === 'educationalBackground' ||
          this.settingFormList[index].parentId === 'qualification' ||
          this.settingFormList[index].parentId === 'publication'
        ) {
          itemNum++
        } else {
          for (const index2 in this.settingFormList[index].detail) {
            if (this.settingFormList[index].parentId === 'basicSettings') {
              itemNum += this.settingFormList[index].detail[index2].form.length
            } else {
              itemNum++
            }
          }
        }
      }
      // エラー項目数
      let validationErrorNumResult = 0
      for (const index in this.settingFormList) {
        let validationErrorNum = this.getValidationErrorNum(
          this.settingFormList[index].detail,
          this.settingFormList[index].parentId
        )
        // 職歴、学歴、資格、出版物は1件でもあれば、エラー数0
        if (
          this.settingFormList[index].parentId === 'workHistory' ||
          this.settingFormList[index].parentId === 'educationalBackground' ||
          this.settingFormList[index].parentId === 'qualification' ||
          this.settingFormList[index].parentId === 'publication'
        ) {
          const showPercent = this.getValidationPercent(
            this.settingFormList[index]
          )
          validationErrorNum = showPercent === 0 ? 1 : 0
        }
        validationErrorNumResult += validationErrorNum
      }

      return Math.floor(((itemNum - validationErrorNumResult) / itemNum) * 100)
    },
    /**
     * 項目ごと入力率の計算
     */
    getValidationPercent() {
      return (settingForm) => {
        let itemNum = settingForm.detail.length
        let validationErrorNum = 0
        let showPercent = 0

        // 就業状況にて、退職を選択していなければ、退職月は数に含めない
        // 学歴、職歴、資格、出版物の場合はラジオボタンやチェックボックスを除く( employmentStatus,checkExpiration)
        if (
          settingForm.parentId === 'workHistory' ||
          settingForm.parentId === 'educationalBackground' ||
          settingForm.parentId === 'qualification' ||
          settingForm.parentId === 'publication'
        ) {
          for (const index in settingForm.detail) {
            for (const index2 in settingForm.detail[index].form) {
              if (
                settingForm.detail[index].form[index2].formType === 'radio' ||
                settingForm.detail[index].form[index2].formType ===
                  'singleCheckbox'
              ) {
                itemNum = itemNum - 1
              }
            }
          }
        }

        // 姓名がある場合はそれぞれ別項目としてカウントする（分母）
        if (settingForm.parentId === 'basicSettings') {
          for (const index in settingForm.detail) {
            itemNum += settingForm.detail[index].form.length - 1
          }
        }

        // エラー項目数（分子）
        if (itemNum > 0) {
          validationErrorNum = this.getValidationErrorNum(
            settingForm.detail,
            settingForm.parentId
          )
        }

        showPercent = Math.round(
          ((itemNum - validationErrorNum) / itemNum) * 100
        )
        if (settingForm.parentId === 'workHistory') {
        }

        // 職歴、学歴、資格、出版物は1件でもあれば、100%にする
        if (
          settingForm.parentId === 'workHistory' ||
          settingForm.parentId === 'educationalBackground' ||
          settingForm.parentId === 'qualification' ||
          settingForm.parentId === 'publication'
        ) {
          showPercent = showPercent > 0 ? 100 : 0
        }

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
          JSON.parse(JSON.stringify(this.editProfileData.basicSetting)),
          JSON.parse(JSON.stringify(this.editProfileData.selfIntroduction))
        )
        Object.assign(
          modelData,
          JSON.parse(JSON.stringify(this.editProfileData.social))
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
                if (formObj[formIndex].validation.length !== 0) {
                  const object = {
                    id: formObj[formIndex].id,
                    validation: formObj[formIndex].validation,
                  }
                  if (
                    this.$common.checkExistValidation(
                      [object],
                      object.id,
                      modelData[object.id]
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
    this.getProfile()
    this.initSelectOptions() // セレクトボックスの初期値設定
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * プロフィールjsonの取得
     */
    getProfile() {
      const userId = Number(this.$route.params.userId)
      const paramData = {}

      if (userId) {
        paramData.userId = userId
      }

      this.$common.addCallApiNum()
      this.$api
        .getProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const editProfileData = this.setNullInitData(resData.data.profile)

            this.editProfileData = this.setNullInitDetailData(editProfileData)
            this.defaultEditProfileData = JSON.parse(
              JSON.stringify(this.editProfileData)
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
     * nullが返ってきたデータの初期値設定
     *
     * @param {object} editProfileData 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(editProfileData) {
      if (!this.$common.checkArrayValue(editProfileData.workHistory)) {
        editProfileData.workHistory.push({
          position: '',
          company: '',
          employmentStatus: '',
          hireDateStartYear: '',
          hireDateStartMonth: '',
          hireDateEndYear: '',
          hireDateEndMonth: '',
          url: '',
        })
      }
      if (
        !this.$common.checkArrayValue(editProfileData.educationalBackground)
      ) {
        editProfileData.educationalBackground.push({
          schoolName: '',
          degree: '',
          underGraduate: '',
          graduationYear: '',
          graduationMonth: '',
        })
      }
      if (!this.$common.checkArrayValue(editProfileData.qualification)) {
        editProfileData.qualification.push({
          name: '',
          publicationYear: '',
          publicationMonth: '',
          checkExpiration: false,
          expirationYear: '',
          expirationMonth: '',
        })
      }
      if (!this.$common.checkArrayValue(editProfileData.publication)) {
        editProfileData.publication.push({
          title: '',
          publisher: '',
          publisherUrl: '',
          url: '',
        })
      }

      return editProfileData
    },
    /**
     * nullが返ってきたデータの初期値設定(各値)
     *
     * @param {object} editProfileData 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitDetailData(editProfileData) {
      // nullで返ってきた文字列を空文字に変換
      this.$common.setNullConvertStringValue(editProfileData.basicSetting, [])
      this.$common.setNullConvertStringValue(
        editProfileData.selfIntroduction,
        []
      )
      this.$common.setNullConvertStringValue(editProfileData.social, [])

      // 配列で帰ってくるworkHistory, educationalBackground,qualification,publicationの処理
      for (const index in editProfileData.workHistory) {
        this.$common.setNullConvertStringValue(
          editProfileData.workHistory[index],
          []
        )
      }
      for (const index in editProfileData.educationalBackground) {
        this.$common.setNullConvertStringValue(
          editProfileData.educationalBackground[index],
          []
        )
      }
      for (const index in editProfileData.qualification) {
        this.$common.setNullConvertStringValue(
          editProfileData.qualification[index],
          []
        )
      }
      for (const index in editProfileData.publication) {
        this.$common.setNullConvertStringValue(
          editProfileData.publication[index],
          []
        )
      }
      return editProfileData
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
              newDetailList[i].form[j].options =
                newDetailList[i].form[j].id === 'expirationYear'
                  ? this.$common.createSelectYearOptions(50, 50)
                  : this.$common.createSelectYearOptions(100)
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
     * プロフィール情報更新
     */
    updateProfile() {
      const paramData = this.getUpdateProfileParamData()

      this.$common.addCallApiNum()
      this.$api
        .updateProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getProfile()
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
     */
    getUpdateProfileParamData() {
      const paramData = JSON.parse(JSON.stringify(this.editProfileData))

      delete paramData.userId
      delete paramData.connectionStatus
      delete paramData.companyId
      delete paramData.postDisplay

      for (let i = 0; i < paramData.workHistory.length; i++) {
        if (paramData.workHistory[i].employmentStatus === '1') {
          delete paramData.workHistory[i].hireDateEndYear
          delete paramData.workHistory[i].hireDateEndMonth
        }
      }
      for (let i = 0; i < paramData.qualification.length; i++) {
        if (paramData.qualification[i].checkExpiration) {
          delete paramData.qualification[i].expirationYear
          delete paramData.qualification[i].expirationMonth
        }
      }

      return paramData
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
        for (const formObjIndex in detail[detailIndex].form) {
          const formObj = detail[detailIndex].form[formObjIndex]
          const obj = {
            id: formObj.id,
            validation: formObj.validation,
          }

          // 学歴、職歴、資格、出版物の場合は初回確認
          const formId = Array.isArray(this.editProfileData[parentId])
            ? this.editProfileData[parentId][0][formObj.id]
            : this.editProfileData[parentId][formObj.id]

          if (
            formId === '' ||
            formId === undefined ||
            this.$common.checkExistValidation([obj], formObj.id, formId)
          ) {
            // 学歴、職歴、資格、出版物の場合はラジオボタンやチェックボックスを除く( employmentStatus,checkExpiration)
            if (
              formObj.id !== 'employmentStatus' ||
              formObj.id !== 'checkExpiration'
            ) {
              validationErrorNum++
              if (
                parentId === 'workHistory' ||
                parentId === 'educationalBackground' ||
                parentId === 'qualification' ||
                parentId === 'publication'
              ) {
                break
              }
            }
          }
        }
      }
      return validationErrorNum
    },
    /**
     * 追加ボタン表示判定処理
     */
    checkShowAddItem(settingForm) {
      let result = false

      if (Array.isArray(this.editProfileData[settingForm.parentId])) {
        if (this.editProfileData[settingForm.parentId].length < 10) {
          result = true
        }
      }

      return result
    },
    /**
     * 入力フィールドの追加
     */
    addItem(settingForm) {
      const parentId = settingForm.parentId
      const detail = settingForm.detail
      const addData = {}

      for (let i = 0; i < detail.length; i++) {
        for (let j = 0; j < detail[i].form.length; j++) {
          if (detail[i].form[j].formType === 'radio') {
            addData[detail[i].form[j].id] = '1'
          } else {
            addData[detail[i].form[j].id] = ''
          }
        }
      }

      this.editProfileData[parentId].push(addData)
    },
    /**
     * 入力フィールドの削除
     */
    deleteItem(parentId, index) {
      this.editProfileData[parentId].splice(index, 1)
    },
    /**
     * 編集破棄処理
     */
    restoreSettings() {
      if (this.cancelAfterFunc === 'back') {
        this.$router.push('/community/profile/')
      } else {
        this.editProfileData = JSON.parse(
          JSON.stringify(this.defaultEditProfileData)
        )
      }
    },
    /**
     * 編集破棄モーダル キャンセルボタン押下処理
     */
    exeCancelEditModal() {
      this.cancelAfterFunc = ''
      this.hideCancelEditModal()
    },
    /**
     * プロフィール画面に戻る
     */
    toBackProfileScreen() {
      const changeDataFlg = this.$common.checkSameObject(
        this.defaultEditProfileData,
        this.editProfileData
      )

      if (changeDataFlg) {
        this.$router.push('/community/profile/')
      } else {
        this.cancelAfterFunc = 'back'
        this.showCancelEditModal()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.profile-settings {
  .progress {
    &-bar {
      max-width: 120px;
      margin: 0 8px 0 24px;
    }
  }

  .header {
    padding: 17px 0 30px 0;
  }

  .section {
    padding: 32px 0 40px 0;
    border-top: 1px solid #eaeaea;
    .form-contents {
      .input-forms {
        margin-top: 40px;
        position: relative;
        &:not(:first-child) {
          border: 1px dashed #c6c6c6;
          padding: 24px;
        }
        &-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .icon {
          position: absolute;
          right: 24px;
          cursor: pointer;
        }
        .form-block {
          margin-top: 32px;
          .form-detail {
            &:not(:last-child) {
              margin-bottom: 32px;
            }
            .form-title {
              margin-bottom: 12px;
            }
            .form-contents {
              .custom-input {
                &.text,
                &.select,
                &.textarea {
                  width: 100%;
                }
              }
              &.two-items {
                .custom-input {
                  &.text {
                    width: 50%;
                    &:not(:last-child) {
                      margin-right: 8px;
                    }
                  }
                  &.select {
                    &:nth-of-type(1) {
                      width: 167px;
                      margin: 0 8px 0 0;
                    }
                    &:nth-of-type(2) {
                      width: 106px;
                      margin: 0 0 0 8px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .add-item {
    display: flex;
    align-items: center;
    height: 48px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px dashed #c6c6c6;
    cursor: pointer;
    margin: 32px 0 0 0;
    svg {
      width: 20px;
      height: 20px;
      fill: #3a435c;
      margin: 0 0 0 18px;
    }
    span {
      display: block;
      margin: 0 0 0 10px;
    }
  }

  .buttons {
    .btn {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
// MQ
@include mq(sp) {
  .to-back {
    padding-top: 25px;
    margin: 0 16px;
  }
  .header {
    margin: 0 16px;
    padding-top: 10px;
    h2 {
      font-size: 22px;
    }
  }
  .profile-settings {
    .section {
      margin: 0 16px;
    }

    .progress-bar {
      max-width: 80px;
    }
  }
  .section.buttons {
    flex-direction: column;
    justify-content: center;
    padding-bottom: 0;
    > * {
      width: 213px;
    }
  }
  .profile-settings .buttons .btn:not(:last-child) {
    margin: 0 0px 16px 0;
  }
}
// MQ
</style>
