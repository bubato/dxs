<template>
  <div class="usage-application-form">
    <div class="layout-description">
      <div class="form-nav">
        <FormNav
          :nav-list="navList"
          :select-index="selectIndex"
          class="form-nav-component"
        />
      </div>
      <div class="heading">
        <h1 class="heading-title">今なら無料でお使いいただけます</h1>
        <p class="heading-trial">
          <span>無料利用期間：2021年8月〜2022年6月</span>
        </p>
        <p class="heading-text">
          bizskyDXは中小企業の業務全般をサポートするあらゆる機能を備えていきます。<br />
          2022年8月以降、順次新しい機能を追加しますので無料で利用できる今のうちに<br />是非お試しください。
        </p>
        <img
          :src="
            $common.getAssetsImgUrl('images/request/input/productImage.png')
          "
          class="heading-img"
        />
      </div>
      <div class="stepSection">
        <img
          :src="$common.getAssetsImgUrl('images/request/input/step1.png')"
          width="56"
          height="56"
          class="stepSection-number"
        />
        <h3 class="stepSection-title">オリジナルWebサイトがかんたんに作れる</h3>
        <p class="stepSection-text">
          最初に必要情報を入力いただきテンプレートを選べばコンサル会社が設計したクオリティの高いオリジナルのWebサイトがすぐに公開できます。
          <br /><br />
          お問い合わせフォームや資料請求フォームなど新規商談獲得の窓口もbizskyDXから
          かんたんに作成できます。
        </p>
      </div>
      <div class="stepSection">
        <img
          :src="$common.getAssetsImgUrl('images/request/input/step2.png')"
          width="56"
          height="56"
          class="stepSection-number"
        />
        <h3 class="stepSection-title">
          経営者専用コミュニティで新しいビジネス機会を作れる
        </h3>
        <p class="stepSection-text">
          bizskyDXを利用している企業の経営者様限定のオンラインコミュニティへ参加いただけます。<br />お互いの企業情報を確認して興味のある企業の代表者様とメッセージのやり取りをしましょう。
        </p>
      </div>
      <div class="stepSection">
        <img
          :src="$common.getAssetsImgUrl('images/request/input/step3.png')"
          width="56"
          height="56"
          class="stepSection-number"
        />
        <h3 class="stepSection-title">
          業界別の経営指標と自社の業績を比較できる
        </h3>
        <p class="stepSection-text">
          数万社に及ぶミロク情報サービスの財務会計システム導入企業様の決算データを元に業界別に集計した経営指標をリアルタイムで参照し、自社の業績データと分かりやすく比較することができます。
        </p>
      </div>
      <CommonFooter class="fixed-footer is-pc" />
    </div>
    <div class="layout-form">
      <h3>利用申し込みフォーム</h3>
      <div v-if="uuid === ''" class="form-item">
        <RequiredFormLabel
          class="title"
          label="ACELINK NX-Proをご利用中の会計事務所様ですか？"
          :required="true"
        />
        <CustomInputRadio
          v-model="formData.firmKind"
          :options="firmKind.option"
          name="symbolList"
          @input="changeFirmKind()"
        />
      </div>

      <div class="form-item">
        <RequiredFormLabel class="title" label="企業名" :required="true" />
        <CustomInputText
          v-model="formData.companyName"
          placeholder="入力例：株式会社田中商事"
          maxlength="50"
          :validation="
            $common.getFormItemsDetail(formItems, 'companyName').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="企業名フリガナ"
          :required="true"
        />
        <CustomInputText
          v-model="formData.companyNameKana"
          placeholder="入力例：カブシキガイシャタナカショウジ"
          maxlength="255"
          :validation="
            $common.getFormItemsDetail(formItems, 'companyNameKana').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="法人番号" :required="false" />
        <CustomInputText
          v-model="formData.corporateNumber"
          placeholder="入力例：1234567891234"
          maxlength="13"
          :validation="
            $common.getFormItemsDetail(formItems, 'corporateNumber').validation
          "
        />
        <CustomLinkText
          text="法人番号が分からない方はこちら"
          link="https://www.houjin-bangou.nta.go.jp/"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="業種" :required="true" />
        <CustomInputSelect
          v-model="formData.industryCode"
          placeholder="選択してください"
          :options="industryCodeOptions"
          :validation="
            $common.getFormItemsDetail(formItems, 'industryCode').validation
          "
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="氏名" :required="true" />
        <div class="input-name">
          <CustomInputText
            v-model="formData.lastName"
            placeholder="入力例：佐藤"
            maxlength="30"
            :validation="
              $common.getFormItemsDetail(formItems, 'lastName').validation
            "
          />
          <CustomInputText
            v-model="formData.firstName"
            placeholder="入力例：太郎"
            maxlength="30"
            :validation="
              $common.getFormItemsDetail(formItems, 'firstName').validation
            "
          />
        </div>
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="氏名フリガナ"
          :required="true"
        />
        <div class="input-name">
          <CustomInputText
            v-model="formData.lastNameKana"
            placeholder="入力例：サトウ"
            maxlength="30"
            :validation="
              $common.getFormItemsDetail(formItems, 'lastNameKana').validation
            "
          />
          <CustomInputText
            v-model="formData.firstNameKana"
            placeholder="入力例：タロウ"
            maxlength="30"
            :validation="
              $common.getFormItemsDetail(formItems, 'firstNameKana').validation
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
        <div class="input-name">
          <CustomInputText
            v-model="formData.email"
            placeholder="入力例：account@tanaka.co.jp"
            maxlength="254"
            :validation="
              $common.getFormItemsDetail(formItems, 'email').validation
            "
            @blur="checkSameMailAddress()"
          />
        </div>
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="電話番号" :required="true" />
        <CustomInputText
          v-model="formData.tel"
          placeholder="入力例：0312345678（ハイフンは不要です）"
          maxlength="11"
          :validation="$common.getFormItemsDetail(formItems, 'tel').validation"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel
          class="title"
          label="パスワード（英語大文字小文字数字混在8桁以上、記号不可）"
          :required="true"
        />
        <CustomInputPassword
          v-model="formData.password"
          :maxlength="98"
          :validation="
            $common.getFormItemsDetail(formItems, 'password').validation
          "
          autocomplete="off"
        />
      </div>
      <div class="form-item tos">
        <RequiredFormLabel class="title" label="利用規約" :required="true" />

        <div v-for="id in teamsSetting.requireConsentIdList" :key="id">
          <TeamsTemplate :id="id" />
        </div>
      </div>

      <div class="buttons">
        <button
          class="btn btn-long btn-basic"
          :class="{
            'btn-disabled': checkBtnDisabled(),
          }"
          @click="showInputConfirmModal()"
        >
          申し込み内容を確認
        </button>
        <p>ボタンをクリックすると入力内容の確認画面が表示されます</p>
      </div>
      <div v-for="id in teamsSetting.requireConsentIdList" :key="id">
        <TeamsModal v-if="teamsSetting.modalOpenFlgId === id" :id="id" />
      </div>
      <ConfirmApplicationForUseModal
        v-if="showInitConfirmModalFlg"
        @close="hideInitConfirmModal($event)"
      />
      <ConfirmInputApplicationForUseModal
        v-if="showInputConfirmModalFlg"
        :form-data="formData"
        :nav-list="navList"
        :uuid="uuid"
        @close="hideInputConfirmModal()"
      />
    </div>
    <CommonFooter class="is-sp" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'
export default {
  layout: 'onlyHeaderLogoNonFooter',
  components: { CommonFooter },
  data() {
    return {
      bizskyTeamsId: 1,
      advisoryCompanyTeamsId: 3,
      dataLakeTeamsId: 4,
      uuid: '', // メールアドレス入力チェックの有無の可否
      inviteMailaddress: '',
      cooperationAgreement: {
        modalFlg: false, // bizskyDX利用規約
        agreeCheckDisabled: false,
        isAgree: false,
        versionID: '',
        title: 'NX-Pro利用者向け利用規約',
        tosUrl: '',
      },
      termsOfService: {
        modalFlg: false, // データレイク連携規約
        agreeCheckDisabled: false,
        isAgree: false,
        versionID: '',
        title: 'bizskyDX利用規約',
        tosUrl: '',
      },
      firmKind: {
        option: [
          {
            value: '1',
            label: 'はい',
          },
          {
            value: '0',
            label: 'いいえ',
          },
        ],
      },
      showInitConfirmModalFlg: false, // データレイク連携規約
      showInputConfirmModalFlg: false,
      navList: ['必要情報の入力', '入力内容の確認', '申し込み完了'],
      selectIndex: 0,
      formData: {
        firmKind: '',
        companyName: '',
        companyNameKana: '',
        corporateNumber: '',
        industryCode: '',
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        email: '',
        tel: '',
        password: '',
      },
      // テスト用ダミーデータ
      // formData: {
      //   // firmKind: '',
      //   firmKind: '',
      //   companyName: '企業名',
      //   companyNameKana: 'キギョウメイカナ',
      //   corporateNumber: '',
      //   industryCode: '2',
      //   lastName: '苗字',
      //   firstName: '名前',
      //   lastNameKana: 'ミョウジ',
      //   firstNameKana: 'ナマエ',
      //   email: 'test@test.com',
      //   tel: '00011112222',
      //   password: '',
      // },
      formItems: [
        {
          id: 'firmKind',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'companyName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'companyNameKana',
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
          id: 'corporateNumber',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'industryCode',
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
          id: 'email',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
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
        {
          id: 'tel',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'password',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.passwordNoSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Password01'),
            },
            {
              type: 'minlength',
              minlength: 8,
              message: this.$common.getMasterMessage('ErrorMsg_Count02', {
                minlength: 8,
              }),
            },
            {
              type: 'maxlength',
              maxlength: 98,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 98,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('request/input', ['industryCodeOptions', 'teamsSetting']),
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.formData) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.formData[key]
            )
          ) {
            result = true
            break
          }
        }

        if (!result && this.checkTeamsAgree()) {
          result = true
        }

        return result
      }
    },
  },
  watch: {},
  created() {
    if (this.$route.params.uuid) {
      this.uuid = this.$route.params.uuid
      this.formData.firmKind = '0'
    } else {
      this.showInitConfirmModal()
    }
    // 利用規約表示設定の初期化
    this.initTeamsSettingData()
  },
  mounted() {
    this.changeFirmKind() // 同意が必要な利用規約を変更
  },
  methods: {
    ...mapMutations('request/input', [
      'initTeamsSettingData',
      'setTeamsSetting',
    ]),
    /**
     * 利用規約の同意確認
     *
     * @return {bool} 全ての利用規約が同意されているか
     */
    checkTeamsAgree() {
      return (
        this.teamsSetting.agreeIdList.length !==
        this.teamsSetting.requireConsentIdList.length
      )
    },
    /**
     * 同意が必要な利用規約を設定
     *
     * @param {string} teamsIdList   同意が必要な利用規約リスト
     */
    setRequireConsentIdList(teamsIdList) {
      const teamsSettingData = JSON.parse(JSON.stringify(this.teamsSetting))
      teamsSettingData.requireConsentIdList = teamsIdList // 表示する利用規約IDを指定
      this.setTeamsSetting(teamsSettingData)
    },
    /**
     * 利用申し込み確認モーダルの表示
     */
    showInitConfirmModal() {
      this.showInitConfirmModalFlg = true
    },
    /**
     * 同意が必要な利用規約を変更
     */
    changeFirmKind() {
      this.setConsentRequiredTeams()
      this.setAgreeIdList()
    },
    /**
     * 同意済み利用規約を変更
     */
    setAgreeIdList() {
      if (
        this.formData.firmKind === '0' &&
        this.teamsSetting.agreeIdList.includes(this.dataLakeTeamsId)
      ) {
        const teamsSettingData = JSON.parse(JSON.stringify(this.teamsSetting))

        teamsSettingData.agreeIdList = teamsSettingData.agreeIdList.filter(
          (number) => number !== this.dataLakeTeamsId
        )

        this.setTeamsSetting(teamsSettingData)
      }
    },
    /**
     * 同意が必要な利用規約を変更
     */
    setConsentRequiredTeams() {
      const newArray = [this.bizskyTeamsId]

      if (this.uuid !== '') {
        newArray.push(this.advisoryCompanyTeamsId)
      }

      if (this.formData.firmKind === '1') {
        newArray.push(this.dataLakeTeamsId)
      }

      this.setRequireConsentIdList(newArray)
    },
    /**
     * お申込み前の確認モーダルの非表示
     *
     * @param {string} val お申込み前の確認モーダル選択値 (0:いいえ 1:はい)
     */
    hideInitConfirmModal(val) {
      this.showInitConfirmModalFlg = false
      this.formData.firmKind = val
      this.changeFirmKind()
    },
    /**
     * 利用申し込み確認モーダルの表示
     */
    showInputConfirmModal() {
      this.showInputConfirmModalFlg = true
    },
    /**
     * 利用申し込み確認モーダルの非表示
     */
    hideInputConfirmModal() {
      this.showInputConfirmModalFlg = false
    },
    /**
     * メールアドレスの重複チェック
     * uuidがクエリパラメータに存在する場合チェックをしない
     */
    checkSameMailAddress() {
      if (this.uuid !== '') {
        return
      }

      const paramData = {
        email: this.formData.email,
      }

      if (
        this.formData.email.length === 0 ||
        this.$common.checkExistValidation(
          this.formItems,
          'email',
          this.formData.email,
          true
        )
      ) {
        this.deleteCustomMailAddressValidation()
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
              this.deleteCustomMailAddressValidation()
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
        (data) => data.id === 'email'
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
        (data) => data.id === 'email'
      ).validation
      const findIndex = mailAddressValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        mailAddressValidation.splice(findIndex, 1)
      }
    },
  },
  head() {
    return {
      title: 'bizskyDX利用申し込み｜bizskyDXで中堅・中小企業に成長と活力を',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
@mixin attentionStyle($fSize: 15px) {
  background: transparent linear-gradient(90deg, #fd7400 0%, #ffb100 100%) 0% 0%
    no-repeat padding-box;
  border-radius: 20px;
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: $fSize;
}
@include mq(sp) {
  .footer {
    background: #f7f8f9;
    margin-bottom: 0;
  }
  /deep/ ul.nav-list li > span {
    padding-left: 3px;
  }
  /deep/ ul.nav-list li .index {
    flex: none;
  }
}
.usage-application-form {
  @include mq(pc) {
    display: flex;
    align-items: flex-start;
    min-width: 1024px;
  }
  width: 100%;
  overflow: auto;
  .layout-description {
    flex: 1;
    background: #f7f8f9;
    border-right: 1px solid #eaeaea;
    @include mq(pc) {
      min-width: 464px;
    }
    .form-nav {
      @include mq(pc) {
        max-width: 594px;
        margin: 48px auto 0 auto;
      }
      @include mq(sp) {
        width: 90%;
        margin: 0 auto;
        padding-top: 48px;
      }
    }
    .heading {
      text-align: center;
      @include mq(pc) {
        max-width: 694px;
      }
      width: 90%;
      margin: 0 auto 72px auto;
      &-title {
        margin-top: 48px;
      }
      &-trial {
        margin: 18px auto 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          @include attentionStyle(17px);
          @include mq(sp) {
            padding: 0 19px;
          }
        }
      }
      &-text {
        font-size: 17px;
        margin-top: 25px;
        margin-bottom: 32px;
        text-align: left;
        display: inline-block;
      }
      &-img {
        max-width: 583px;
        width: 84%;
      }
    }
    .stepSection {
      @include mq(sp) {
        display: none;
      }
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 1px 5px #00000029;
      border-radius: 6px;
      opacity: 1;
      margin: 0 auto 56px auto;
      padding: 48px 24px;
      position: relative;
      max-width: 694px;
      width: 90%;
      &-number {
        position: absolute;
        top: -24px;
        left: 21px;
      }
      &-title {
        margin-bottom: 8px;
      }
      &-press {
        @include attentionStyle();
        position: absolute;
        top: -10px;
        left: 100px;
      }
    }
  }
  .layout-form {
    @include mq(pc) {
      width: 560px;
      padding: 48px 40px;
    }
    @include mq(sp) {
      width: 90%;
      margin: 0 auto;
      padding: 48px 0px;
    }
    h3 {
      text-align: center;
      font-weight: 500;
      @include mq(sp) {
        margin-bottom: 32px;
      }
    }
    .form-item {
      &:not(:last-child) {
        margin-bottom: 32px;
      }
      .include-sub-text {
        .title {
          margin-bottom: 8px;
        }
        .sub-text {
          margin-bottom: 12px;
        }
      }
      .input-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        ::v-deep .custom-input-text {
          width: 100%;
          &:not(:last-child) {
            margin-right: 16px;
          }
        }
      }
      .title {
        margin-bottom: 12px;
      }
      ::v-deep .link-text {
        margin-top: 12px;
      }
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 40px;
    p {
      font-size: 12px;
      margin-top: 12px;
    }
  }
}
</style>
