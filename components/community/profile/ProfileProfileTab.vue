<template>
  <div class="body-main-profile">
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="
        isMyProfile === false &&
        getCommonConnectionList().length > 0 &&
        profilePageProfile.connectionStatus === 1
      "
      class="body-main-profile-recommended"
    >
      <h3>
        {{ profilePageProfile.basicSetting.lastName }}さんとつながりませんか？
      </h3>
      <p>
        共通のつながりがあります。是非繋がってビジネスの機会を増やしませんか？
      </p>
      <div class="body-main-profile-recommended-commonConnection">
        <div class="body-main-profile-recommended-commonConnection-data">
          <p>共通のつながり{{ getCommonConnectionList().length }}人</p>
          <div class="body-main-profile-recommended-commonConnection-imgList">
            <div
              v-for="(member, index) in filterCommonConnectionList()"
              :key="index"
              class="body-main-profile-recommended-commonConnection-imgList-image"
              @click="updateShowProfilePage(member.userId)"
            >
              <img :src="$common.getProfileImg(member.image)" alt="" />
              <MoreHorizSVG v-if="index === 4" class="icon-moreHoriz" />
            </div>
          </div>
        </div>
        <div>
          <button
            :class="{ 'is-connect': profilePageProfile.connectionStatus === 1 }"
            class="btn btn-primary btn-long"
            @click="requestConnection()"
          >
            つながり申請
          </button>
        </div>
      </div>
    </div>
    <div class="body-main-profile-cell body-main-profile-selfIntroduction">
      <div class="body-main-profile-head">
        <h3>自己紹介</h3>
        <div v-if="isMyProfile" class="body-main-profile-progressBar">
          <ProgressBar
            class="progress-bar"
            :progress="getValidationPercent(settingFormList[1])"
          />
        </div>
        <span v-if="isMyProfile" class="body-main-profile-progressValue"
          >{{ getValidationPercent(settingFormList[1]) }}%</span
        >
      </div>
      <p
        v-if="profilePageProfile.selfIntroduction.selfIntroduction"
        v-html="
          profilePageProfile.selfIntroduction.selfIntroduction.replace(
            /\n/g,
            '<br/>'
          )
        "
      />
      <p v-else>自己紹介文はまだ登録されていません</p>
    </div>

    <div class="body-main-profile-cell body-main-profile-selfIntroduction">
      <div class="body-main-profile-head">
        <h3>職歴</h3>
        <div v-if="isMyProfile" class="body-main-profile-progressBar">
          <ProgressBar
            class="progress-bar"
            :progress="getValidationPercent(settingFormList[2])"
          />
        </div>
        <span v-if="isMyProfile" class="body-main-profile-progressValue"
          >{{ getValidationPercent(settingFormList[2]) }}%</span
        >
      </div>
      <template v-if="$common.checkArrayValue(profilePageProfile.workHistory)">
        <div
          v-for="(value, index) in profilePageProfile.workHistory"
          :key="index"
          class="workHistory"
        >
          <div class="workHistory-hireDate">
            <p
              v-show="value.hireDateStartYear || value.hireDateStartMonth"
              class="workHistory-hireDate-from"
            >
              {{ value.hireDateStartYear }}/{{ value.hireDateStartMonth }}
            </p>
            <span>～</span>
            <p
              v-show="value.hireDateEndYear || value.hireDateEndMonth"
              class="workHistory-hireDate-to"
            >
              {{ value.hireDateEndYear }}/{{ value.hireDateEndMonth }}
            </p>
            <span
              v-if="
                value.hireDateEndYear === '' && value.hireDateEndMonth === ''
              "
              >現在</span
            >
          </div>
          <h3>
            <CustomLinkText :text="value.company" :link="value.url" />
          </h3>
          <p class="workHistory-position">{{ value.position }}</p>
        </div>
      </template>
      <template v-else>
        <p class="workHistory">職歴はまだ登録されていません</p>
      </template>
    </div>

    <div class="body-main-profile-cell">
      <div class="body-main-profile-head">
        <h3>学歴</h3>
        <div v-if="isMyProfile" class="body-main-profile-progressBar">
          <ProgressBar
            class="progress-bar"
            :progress="getValidationPercent(settingFormList[3])"
          />
        </div>
        <span v-if="isMyProfile" class="body-main-profile-progressValue"
          >{{ getValidationPercent(settingFormList[3]) }}%</span
        >
      </div>
      <template v-if="checkEducationalBackground()">
        <div
          v-for="(value, index) in profilePageProfile.educationalBackground"
          :key="value.schoolName"
          :class="{
            'is-more': index >= 2,
            'is-view': moreBtnFlg.educationalBackground,
          }"
          class="body-main-profile-cell-box"
        >
          <p class="body-main-profile-cell-title1">
            {{ value.schoolName }}&ensp; {{ value.faculty }}&ensp;
            {{ value.department }}&ensp; {{ value.major }}
          </p>
          <p class="body-main-profile-cell-text">{{ value.degree }}</p>
          <div
            v-show="value.graduationYear || value.graduationMonth"
            class="body-main-profile-cell-year"
          >
            <p>{{ value.graduationYear }}</p>
            <span>/</span>
            <p>{{ value.graduationMonth }}</p>
          </div>
        </div>
        <div
          v-if="isLengthOver(profilePageProfile.educationalBackground)"
          class="body-main-profile-moreBtnWrap"
        >
          <button
            class="body-main-profile-cell-btnMore"
            :class="{ 'is-open': moreBtnFlg.educationalBackground }"
            @click="
              moreBtnFlg.educationalBackground = !moreBtnFlg.educationalBackground
            "
          >
            {{ getMoreBtnLabel(moreBtnFlg.educationalBackground)
            }}<ExpandMoreSVG class="icon-expandMore" />
          </button>
        </div>
      </template>
      <template v-else>
        <p class="body-main-profile-cell-box">学歴はまだ登録されていません</p>
      </template>
    </div>
    <div class="body-main-profile-cell">
      <div class="body-main-profile-head">
        <h3>出版物</h3>
        <div v-if="isMyProfile" class="body-main-profile-progressBar">
          <ProgressBar
            class="progress-bar"
            :progress="getValidationPercent(settingFormList[5])"
          />
        </div>
        <span v-if="isMyProfile" class="body-main-profile-progressValue"
          >{{ getValidationPercent(settingFormList[5]) }}%</span
        >
      </div>
      <template v-if="checkPublication()">
        <div
          v-for="(value, index) in profilePageProfile.publication"
          :key="value.title"
          :class="{
            'is-more': index >= 2,
            'is-view': moreBtnFlg.publication,
          }"
          class="body-main-profile-cell-box"
        >
          <p class="body-main-profile-cell-title1">
            <CustomLinkText :text="value.title" :link="value.publisherUrl" />
          </p>
          <p class="body-main-profile-cell-text">{{ value.publisher }}</p>
        </div>
        <div
          v-if="isLengthOver(profilePageProfile.publication)"
          class="body-main-profile-moreBtnWrap"
        >
          <button
            class="body-main-profile-cell-btnMore"
            :class="{ 'is-open': moreBtnFlg.publication }"
            @click="moreBtnFlg.publication = !moreBtnFlg.publication"
          >
            {{ getMoreBtnLabel(moreBtnFlg.publication)
            }}<ExpandMoreSVG class="icon-expandMore" />
          </button>
        </div>
      </template>
      <template v-else>
        <p class="body-main-profile-cell-box">出版物はまだ登録されていません</p>
      </template>
    </div>
    <div class="body-main-profile-cell">
      <div class="body-main-profile-head">
        <h3>資格</h3>
        <div v-if="isMyProfile" class="body-main-profile-progressBar">
          <ProgressBar
            class="progress-bar"
            :progress="getValidationPercent(settingFormList[4])"
          />
        </div>
        <span v-if="isMyProfile" class="body-main-profile-progressValue"
          >{{ getValidationPercent(settingFormList[4]) }}%</span
        >
      </div>
      <template v-if="checkQualification()">
        <div
          v-for="(value, index) in profilePageProfile.qualification"
          :key="value.name"
          :class="{
            'is-more': index >= 2,
            'is-view': moreBtnFlg.qualification,
          }"
          class="body-main-profile-cell-box"
        >
          <p class="body-main-profile-cell-title1">
            {{ value.name }}
          </p>
          <div
            v-show="
              value.publicationYear ||
              value.publicationMonth ||
              value.expirationYear ||
              value.expirationMonth
            "
            class="body-main-profile-cell-year"
          >
            <p
              v-show="value.publicationYear || value.publicationMonth"
              class="body-main-profile-cell-year-from"
            >
              {{ value.publicationYear }}/{{ value.publicationMonth }}
            </p>
            <span>～</span>
            <p
              v-show="value.expirationYear || value.expirationMonth"
              class="body-main-profile-cell-year-to"
            >
              {{ value.expirationYear }}/{{ value.expirationMonth }}
            </p>
          </div>
        </div>
        <div
          v-if="isLengthOver(profilePageProfile.qualification)"
          class="body-main-profile-moreBtnWrap"
        >
          <button
            class="body-main-profile-cell-btnMore"
            :class="{ 'is-open': moreBtnFlg.qualification }"
            @click="moreBtnFlg.qualification = !moreBtnFlg.qualification"
          >
            {{ getMoreBtnLabel(moreBtnFlg.qualification)
            }}<ExpandMoreSVG class="icon-expandMore" />
          </button>
        </div>
      </template>
      <template v-else>
        <p class="body-main-profile-cell-box">資格はまだ登録されていません</p>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ProfileProfileTab',
  props: {
    isMyProfile: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      profileImage: '', // 仮データ。データの受け渡しについては仕様マター
      moreBtnFlg: {
        workHistory: false,
        educationalBackground: false,
        qualification: false,
        publication: false,
        connectList: [],
      },
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
                  formType: 'inputTel',
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
            {
              name: 'プロフィール写真',
              required: false,
              form: [
                {
                  id: 'profileImage',
                  formType: 'fileUpload',
                  class: 'file-upload',
                  validation: [],
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
              name: '',
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
                  maxLength: '50',
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
                  maxLength: '50',
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
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'yearList',
                  validation: [],
                },
                {
                  id: 'hireDateStartMonth',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'monthList',
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
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'yearList',
                  validation: [],
                },
                {
                  id: 'hireDateEndMonth',
                  placeholder: '選択してください',
                  formType: 'select',
                  options: 'monthList',
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
                  formType: 'inputText',
                  placeholder: '入力例：https://www.example.jp/',
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
                  placeholder: '入力例：学士、修士、博士',
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
                  placeholder: '選択してください',
                  formType: 'select',
                  class: 'select-year',
                  options: 'yearList',
                  validation: [],
                },
                {
                  id: 'graduationMonth',
                  placeholder: '選択してください',
                  formType: 'select',
                  class: 'select-month',
                  options: 'monthList',
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
                  placeholder: '選択してください',
                  formType: 'select',
                  class: 'select-year',
                  options: 'yearList',
                  validation: [],
                },
                {
                  id: 'publicationMonth',
                  placeholder: '選択してください',
                  formType: 'select',
                  class: 'select-month',
                  options: 'monthList',
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
                  placeholder: '選択してください',
                  formType: 'select',
                  class: 'select-year',
                  options: 'yearList',
                  validation: [],
                },
                {
                  id: 'expirationMonth',
                  placeholder: '選択してください',
                  formType: 'select',
                  class: 'select-month',
                  options: 'monthList',
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
              name: 'Twitterプロフィール',
              required: false,
              form: [
                {
                  id: 'twitter',
                  placeholder: '入力例：https://twitter.com/0000000/',
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
              name: 'Instagramプロフィール',
              required: false,
              form: [
                {
                  id: 'instagramId',
                  placeholder: '入力例：https://www.instagram.com/0000000/',
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
      ],
    }
  },
  computed: {
    ...mapState('community/common', ['profile']),
    ...mapState('community/profileStore', [
      'profilePageProfile',
      'profilePageConnection',
    ]),
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
    getCommonConnectionList() {
      return () => {
        const commonConnectionList = this.profilePageConnection.filter(
          (value) => {
            return value.connectionStatus !== 1
          }
        )

        return commonConnectionList
      }
    },
    filterCommonConnectionList() {
      return () => {
        let showNum = 0
        const maxShowNum = 5

        const commonConnectionList = this.profilePageConnection.filter(
          (value) => {
            let result = false

            if (value.connectionStatus !== 1 && showNum < maxShowNum) {
              result = true
              showNum++
            }

            return result
          }
        )

        return commonConnectionList
      }
    },
    /**
     * 学歴の入力情報のチェック
     * null,[],入力項目が全て未入力のいずれかの場合はfalse,それ以外はtrueを返す
     *
     * @return {boolean} 存在チェック
     */
    checkEducationalBackground() {
      return () => {
        let result = false
        const keys = [
          'schoolName',
          'degree',
          'underGraduate',
          'graduationYear',
          'graduationMonth',
        ]

        if (
          this.$common.checkArrayValue(
            this.profilePageProfile.educationalBackground
          )
        ) {
          for (let i = 0; i < keys.length; i++) {
            if (this.profilePageProfile.educationalBackground[0][keys[i]]) {
              result = true
            }
          }
        }

        return result
      }
    },
    /**
     * 出版物の入力情報のチェック
     * null,[],入力項目が全て未入力のいずれかの場合はfalse,それ以外はtrueを返す
     *
     * @return {boolean} 存在チェック
     */
    checkPublication() {
      return () => {
        let result = false
        const keys = ['title', 'publisher', 'publisherUrl']

        if (this.$common.checkArrayValue(this.profilePageProfile.publication)) {
          for (let i = 0; i < keys.length; i++) {
            if (this.profilePageProfile.publication[0][keys[i]]) {
              result = true
            }
          }
        }

        return result
      }
    },
    /**
     * 資格の入力情報のチェック
     * null,[],入力項目が全て未入力のいずれかの場合はfalse,それ以外はtrueを返す
     *
     * @return {boolean} 存在チェック
     */
    checkQualification() {
      return () => {
        let result = false
        const keys = [
          'name',
          'publicationYear',
          'publicationMonth',
          'expirationYear',
          'expirationMonth',
        ]

        if (
          this.$common.checkArrayValue(this.profilePageProfile.qualification)
        ) {
          for (let i = 0; i < keys.length; i++) {
            if (this.profilePageProfile.qualification[0][keys[i]]) {
              result = true
            }
          }
        }

        return result
      }
    },
  },
  mounted() {},
  created() {},
  methods: {
    ...mapMutations('community/profileStore', [
      'setProfilePageProfile',
      'setProfilePageConnection',
    ]),
    /**
     * もっと見るボタンラベル制御
     */
    getMoreBtnLabel(flg) {
      return flg ? '閉じる' : 'もっとみる'
    },
    /**
     * もっと見るボタン表示制御
     */
    isLengthOver(array) {
      if (Array.isArray(array)) {
        if (array.length >= 3) {
          return true
        }
      }
      return false
    },
    /**
     * つながり申請
     */
    requestConnection() {
      const paramData = {
        userId: Number(this.$route.params.userId),
      }

      this.$common.addCallApiNum()
      this.$api
        .requestConnection(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
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
     * 選択したユーザーのつながりプロフィール情報を表示
     */
    updateShowProfilePage(userId) {
      this.$router.push('/community/profile/' + userId)
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
          const formId = Array.isArray(this.profilePageProfile[parentId])
            ? this.profilePageProfile[parentId][0][formObj.id]
            : this.profilePageProfile[parentId][formObj.id]

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
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
/**
  * プロフィール
*/
.body-main-profile {
  width: 716px;
  margin: 0 auto;
  &-cell {
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-recommended-commonConnection {
    display: block;
  }
  &-recommended {
    background: #f7f8f9;
    border-radius: 6px;
    padding: 24px;
    margin-bottom: 40px;
    &-commonConnection {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
      &-data {
        font-size: 13px;
        color: #8d8d8d;
      }
      &-imgList {
        display: flex;
        align-items: center;
        margin-top: 8px;
        &-image {
          cursor: pointer;
          margin: 4px;
          &:nth-child(5) {
            position: relative;
            &:after {
              content: '';
              display: block;
              position: absolute;
              top: 0px;
              left: 0px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.3);
            }
          }
          .icon-moreHoriz {
            position: absolute;
            left: calc(50% - 15px);
            top: calc(50% - 15px);
            z-index: 1;
          }
          img {
            width: 40px;
          }
        }
      }
    }
  }
  &-cell {
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    margin-bottom: 16px;
    margin-bottom: 24px;
    &-box {
      padding: 24px;
      padding-top: 0;
      &.is-more {
        display: none;
        &.is-view {
          display: block;
        }
      }
    }
    &-title1 {
      font-size: 17px;
      font-weight: 500;
      margin-bottom: 4px;
      a {
        text-decoration: underline;
      }
    }
    &-text {
      margin-bottom: 4px;
    }
    &-year {
      display: flex;
      align-items: center;
      color: #8d8d8d;
      font-size: 13px;
      margin-bottom: 4px;
    }
    &-btnMore {
      background: #f8f9fa;
      width: 100%;
      padding: 13px 0;
      cursor: pointer;
      &.is-open .icon-expandMore {
        transform: rotate(180deg);
      }
    }
  }
  &-head {
    padding: 16px;
    border-bottom: #efefef 1px solid;
    margin-bottom: 24px 0px 24px 32px;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    & + * {
      padding-top: 0;
    }
  }
  &-moreBtnWrap {
    margin: 24px;
    margin-top: 0;
  }
  &-progressBar {
    margin-left: 24px;
    width: 80px;
  }
  &-progressValue {
    display: inline-block;
    padding-left: 9px;
  }
  &-selfIntroduction {
    border: none;
    border-radius: 0px;
    padding: 0;
    margin-bottom: 32px;
    .body-main-profile-cell {
      border: none;
      padding: 0;
      margin-bottom: 16px;
    }
    .body-main-profile-head {
      padding: 0;
      border: none;
      margin-bottom: 16px;
    }
  }
}
/**
  * 職歴
*/
.workHistory {
  position: relative;
  padding-bottom: 64px;
  &:last-child {
    padding-bottom: 0;
  }
  &:last-of-type {
    padding-bottom: 0;
    &:before {
      display: none;
    }
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    bottom: 8px;
    left: 10px;
    height: 48px;
    width: 2px;
    background: #e5e5e5;
  }
  &-hireDate {
    display: flex;
    align-items: center;
    color: #8d8d8d;
    margin-bottom: 4px;
  }
  h3 {
    margin-bottom: 4px;
    a {
      text-decoration: underline;
    }
  }
  &-position {
    color: #1e1e1e;
    margin-bottom: 4px;
  }
}
.icon {
  &-launch {
    fill: #1e1e1e;
    width: 16px;
    height: 16px;
    margin-left: 3px;
  }
  &-moreHoriz {
    width: 30px;
    height: 30px;
    fill: #b0b3be;
  }
}
// MQ
@include mq(sp) {
  //SPView
  .body-main-profile {
    width: 100%;
    padding: 0 16px;
  }
  .body-main-profile-recommended-commonConnection {
    display: block;
    &-imgList {
      margin-bottom: 40px;
    }
  }
}
// MQ
</style>
