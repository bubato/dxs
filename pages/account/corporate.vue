<template>
  <div class="corporate">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">企業情報</h2>
        <p class="header-sub">
          コミュニティ内の企業ページで表示する情報を登録します。
        </p>
      </div>
      <div v-if="Object.keys(corporateInfo).length > 0" class="contents">
        <div class="form-block">
          <h3>基本設定</h3>
          <div class="form-item">
            <RequiredFormLabel class="title" label="企業名" :required="true" />
            <CustomInputText
              v-model="corporateInfo.basicSettings.name"
              placeholder="入力例：株式会社田中商事"
              maxlength="50"
              :validation="
                $common.getFormItemsDetail(formItems, 'name').validation
              "
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="法人番号"
              :required="false"
            />
            <CustomInputText
              v-model="corporateInfo.basicSettings.number"
              placeholder="入力例：1234567891234"
              maxlength="13"
              class="middle"
              :validation="
                $common.getFormItemsDetail(formItems, 'number').validation
              "
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel class="title" label="業種" :required="true" />
            <CustomInputSelect
              ref="select"
              v-model="corporateInfo.basicSettings.industry"
              :options="industryOptions"
              placeholder="選択してください"
              class="middle"
              :validation="
                $common.getFormItemsDetail(formItems, 'industry').validation
              "
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="代表者名"
              :required="true"
            />
            <div class="flex">
              <CustomInputText
                v-model="corporateInfo.basicSettings.lastName"
                placeholder="入力例：佐藤"
                maxlength="30"
                class="short"
                :validation="
                  $common.getFormItemsDetail(formItems, 'lastName').validation
                "
              />
              <CustomInputText
                v-model="corporateInfo.basicSettings.firstName"
                placeholder="入力例：太郎"
                maxlength="30"
                class="short"
                :validation="
                  $common.getFormItemsDetail(formItems, 'firstName').validation
                "
              />
            </div>
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="代表者フリガナ"
              :required="true"
            />
            <div class="flex">
              <CustomInputText
                v-model="corporateInfo.basicSettings.lastNameKana"
                placeholder="入力例：サトウ"
                maxlength="30"
                class="short"
                :validation="
                  $common.getFormItemsDetail(formItems, 'lastNameKana')
                    .validation
                "
              />
              <CustomInputText
                v-model="corporateInfo.basicSettings.firstNameKana"
                placeholder="入力例：タロウ"
                maxlength="30"
                class="short"
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
              label="代表電話番号"
              :required="true"
            />
            <CustomInputText
              v-model="corporateInfo.basicSettings.tel"
              placeholder="入力例：0312345678（ハイフンは不要です）"
              maxlength="11"
              class="middle"
              :validation="
                $common.getFormItemsDetail(formItems, 'tel').validation
              "
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="本社所在地(都道府県、市区町村、番地は入力必須です)"
              :required="true"
            />
            <div class="input-location">
              <div class="flex">
                <CustomInputText
                  v-model="corporateInfo.basicSettings.postCode"
                  placeholder="入力例：1234567（ハイフンは不要です）"
                  maxlength="7"
                  class="short"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'postCode').validation
                  "
                  @input="deleteCustomValidation()"
                />
                <button
                  class="btn btn-secondary"
                  :class="{
                    'btn-disabled':
                      corporateInfo.basicSettings.postCode.length === 0 ||
                      $common.getValidationMsg(
                        $common.getFormItemsDetail(formItems, 'postCode')
                          .validation,
                        corporateInfo.basicSettings.postCode
                      ).length > 0,
                  }"
                  @click="searchZipCode()"
                >
                  住所検索
                </button>
              </div>
              <CustomInputSelect
                v-model="corporateInfo.basicSettings.addressState"
                class="middle"
                :options="$common.getVersatileOptions(17)"
                :validation="
                  $common.getFormItemsDetail(formItems, 'addressState')
                    .validation
                "
              />
              <CustomInputText
                v-model="corporateInfo.basicSettings.addressCity"
                placeholder="入力例：港区赤坂"
                maxlength="20"
                class="middle"
                :validation="
                  $common.getFormItemsDetail(formItems, 'addressCity')
                    .validation
                "
              />
              <CustomInputText
                ref="addressLine1"
                v-model="corporateInfo.basicSettings.addressLine1"
                maxlength="255"
                placeholder="入力例：7-1-1（半角で入力してください）"
                class="middle"
                :validation="
                  $common.getFormItemsDetail(formItems, 'addressLine1')
                    .validation
                "
              />
              <CustomInputText
                v-model="corporateInfo.basicSettings.addressLine2"
                placeholder="入力例：青山安田ビル"
                maxlength="255"
                class="middle"
                :validation="
                  $common.getFormItemsDetail(formItems, 'addressLine2')
                    .validation
                "
              />
            </div>
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="Webサイト"
              :required="false"
            />
            <CustomInputText
              v-model="corporateInfo.basicSettings.website"
              placeholder="入力例：https://www.example.jp/"
              maxlength="2000"
              :validation="
                $common.getFormItemsDetail(formItems, 'website').validation
              "
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel class="title" label="ロゴ" :required="true" />
            <p class="sub-text">
              ファイルサイズは500KB以下、拡張子は.{{
                imageAllowExts.join('、')
              }}が利用できます。
            </p>
            <FileUpload
              ref="fileUpload1"
              :file-data="corporateInfo.basicSettings.image"
              :validation="
                $common.getFormItemsDetail(formItems, 'image').validation
              "
              :max-size="500"
              @uploaded="setBasicLogo($event)"
              @deleted="fileDeleted('basicSettings')"
            />
          </div>
        </div>
        <div class="form-block">
          <h3>詳細情報</h3>
          <div class="form-item">
            <RequiredFormLabel class="title" label="創業" :required="false" />
            <div class="flex">
              <CustomInputSelect
                v-model="corporateInfo.detail.foundedY"
                placeholder="選択してください"
                :options="foundingYearOptions"
                class="short"
              />
              <CustomInputSelect
                v-model="corporateInfo.detail.foundedM"
                placeholder="選択してください"
                :options="foundingMonthOptions"
                class="short"
              />
            </div>
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="従業員数"
              :required="false"
            />
            <CustomInputSelect
              v-model="corporateInfo.detail.numberOfEmployees"
              placeholder="選択してください"
              :options="numberOfEmployeesOptions"
              class="short"
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="上場区分"
              :required="false"
            />
            <CustomInputRadio
              v-model="corporateInfo.detail.listingClassificationRadio"
              :options="listingClassificationRadioOptions"
              name="listingClassificationRadio"
              layout-type="vertical"
            />
            <CustomInputSelect
              v-show="corporateInfo.detail.listingClassificationRadio === '1'"
              v-model="corporateInfo.detail.listingClassificationSelect"
              placeholder="選択してください"
              :options="listingClassificationOptions"
              class="middle margin-t-16"
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel class="title" label="決算月" :required="false" />
            <CustomInputSelect
              v-model="corporateInfo.detail.closingMonth"
              placeholder="選択してください"
              :options="closingMonthOptions"
              class="short"
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel class="title" label="資本金" :required="false" />
            <CustomInputText
              v-model="corporateInfo.detail.capital"
              placeholder="入力例：1000000"
              maxlength="20"
              class="middle"
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel class="title" label="売上" :required="false" />
            <CustomInputText
              v-model="corporateInfo.detail.sales"
              placeholder="入力例：1000000"
              maxlength="20"
              class="middle"
            />
          </div>
          <div class="form-item">
            <RequiredFormLabel class="title" label="役員" :required="false" />
            <draggable
              :list="corporateInfo.detail.officer"
              tag="ul"
              class="officer-list"
              group="radio"
            >
              <li
                v-for="(data, index) in corporateInfo.detail.officer"
                :key="index"
              >
                <div class="icon-block">
                  <DehazeSVG class="icon-dehaze" />
                </div>
                <input
                  v-model="data.position"
                  type="text"
                  class="position"
                  placeholder="入力例：代表取締役"
                  maxlength="30"
                />
                <span>値:</span>
                <input
                  v-model="data.name"
                  type="text"
                  class="name"
                  placeholder="入力例：佐藤 太郎"
                  maxlength="60"
                />
                <div class="icon-block">
                  <CancelSVG
                    v-show="index > 0"
                    class="icon-cancel"
                    @mouseover="$common.setAreaLabel($event, 'right', '削除')"
                    @mouseleave="$common.setAreaLabel($event, '', '')"
                    @blur="$common.setAreaLabel($event, '', '')"
                    @click="deleteOfficer(index)"
                  />
                </div>
              </li>
            </draggable>
            <div class="add-item margin-t-16" @click="addOfficer()">
              <AddCircleSVG class="icon icon-addCircle" /><span
                >項目を追加</span
              >
            </div>
          </div>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="事業内容"
              :required="false"
            />
            <CustomInputTextarea
              v-model="corporateInfo.detail.businessContent"
              class="textarea"
              placeholder="事業内容を入力してください"
              :validation="
                $common.getFormItemsDetail(formItems, 'businessContent')
                  .validation
              "
            />
          </div>
        </div>
        <div class="form-block">
          <h3>商品・サービス</h3>
          <div class="goodsAndServicesList">
            <div
              v-for="(data, index) in corporateInfo.goodsAndServices"
              :key="index"
              class="goodsAndServices"
            >
              <div v-if="index > 0" class="flex flex-between">
                <h4>{{ index + 1 }}番目の商品・サービス</h4>
                <DeleteSVG
                  v-show="index > 0"
                  class="icon icon-delete"
                  @click="deleteGoodsAndServices(index)"
                  @mouseover="$common.setAreaLabel($event, 'top', '削除')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                />
              </div>
              <div class="form-item">
                <RequiredFormLabel
                  class="title"
                  label="商品・サービス名"
                  :required="false"
                />
                <CustomInputText
                  v-model="data.name"
                  maxlength="50"
                  placeholder="入力例：照明器具販売"
                />
              </div>
              <div class="form-item">
                <RequiredFormLabel
                  class="title"
                  label="画像"
                  :required="false"
                />
                <p class="sub-text">
                  ファイルサイズは1MB以下、拡張子は.{{
                    imageAllowExts.join('、')
                  }}が利用できます。
                </p>
                <FileUpload
                  ref="fileUpload2"
                  :file-data="data.image"
                  :max-size="1024"
                  @uploaded="serviceImageUploaded($event, index)"
                  @deleted="fileDeleted('service', index)"
                />
              </div>
              <div class="form-item">
                <RequiredFormLabel
                  class="title"
                  label="説明"
                  :required="false"
                />
                <CustomInputTextarea
                  v-model="data.context"
                  class="textarea"
                  placeholder="商品・サービスの説明を入力してください"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'context').validation
                  "
                />
              </div>
            </div>
          </div>
          <div class="add-item-block" @click="addGoodsAndServices()">
            <AddCircleSVG class="icon icon-addCircle" />商品・サービスを追加
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultCorporateInfo,
              corporateInfo
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateCorporateData()"
        >
          設定内容を保存
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
import draggable from 'vuedraggable'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { draggable, CommonFooter },
  data() {
    return {
      defaultCorporateInfo: {},
      corporateInfo: {},
      newLogoData: null,
      foundingYearOptions: [],
      foundingMonthOptions: [],
      numberOfEmployeesOptions: [],
      test: '0',
      listingClassificationRadioOptions: [
        {
          value: '0',
          label: '非上場',
        },
        {
          value: '1',
          label: '上場',
        },
      ],
      listingClassificationOptions: [],
      closingMonthOptions: [],
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      formItems: [
        {
          id: 'name',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'number',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'industry',
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
          id: 'postCode',
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
          id: 'addressState',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'addressCity',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'addressLine1',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'addressLine2',
          validation: [],
        },
        {
          id: 'website',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
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
        {
          id: 'image',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'businessContent',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'context',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    checkBtnDisabled() {
      return () => {
        let result = false

        if (Object.keys(this.corporateInfo).length === 0) {
          return
        }

        const validationItems = {
          name: this.corporateInfo.basicSettings.name,
          number: this.corporateInfo.basicSettings.number,
          industry: this.corporateInfo.basicSettings.industry,
          lastName: this.corporateInfo.basicSettings.lastName,
          firstName: this.corporateInfo.basicSettings.firstName,
          lastNameKana: this.corporateInfo.basicSettings.lastNameKana,
          firstNameKana: this.corporateInfo.basicSettings.firstNameKana,
          tel: this.corporateInfo.basicSettings.tel,
          postCode: this.corporateInfo.basicSettings.postCode,
          addressState: this.corporateInfo.basicSettings.addressState,
          addressCity: this.corporateInfo.basicSettings.addressCity,
          addressLine1: this.corporateInfo.basicSettings.addressLine1,
          addressLine2: this.corporateInfo.basicSettings.addressLine2, // 不要
          website: this.corporateInfo.basicSettings.website,
          image: this.corporateInfo.basicSettings.image, // 不要
          businessContent: this.corporateInfo.detail.businessContent,
          context: this.corporateInfo.goodsAndServices,
        }

        for (const key in validationItems) {
          if (key === 'context') {
            for (let i = 0; i < validationItems[key].length; i++) {
              const value = validationItems[key][i].context
              if (
                this.$common.checkExistValidation(this.formItems, key, value)
              ) {
                result = true
                break
              }
            }
          } else {
            const value = validationItems[key]
            if (this.$common.checkExistValidation(this.formItems, key, value)) {
              result = true
              break
            }
          }
        }

        return result
      }
    },
  },
  created() {
    this.setInitOptions()
    this.getCompanyData() // 会社情報の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * 要素のオプション設定
     */
    setInitOptions() {
      this.foundingYearOptions = this.$common.createSelectYearOptions(200)
      this.foundingMonthOptions = this.$common.createSelectMonthOptions()
      this.closingMonthOptions = this.$common.createSelectMonthOptions()

      this.industryOptions = this.$common.getVersatileOptions(1)
      this.numberOfEmployeesOptions = this.$common.getVersatileOptions(8)
      this.listingClassificationOptions = this.$common.getVersatileOptions(10)
    },
    /**
     * 会社情報の取得
     */
    getCompanyData() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCompanyData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const corporateInfo = this.setNullInitData(resData.data.profile)

            this.defaultCorporateInfo = JSON.parse(
              JSON.stringify(corporateInfo)
            )
            this.corporateInfo = corporateInfo
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
      if (!this.$common.checkArrayValue(editProfileData.goodsAndServices)) {
        editProfileData.goodsAndServices.push({
          name: '',
          image: '',
          context: '',
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
     * 役員の追加
     */
    addOfficer() {
      this.corporateInfo.detail.officer.push({
        position: '',
        name: '',
      })
    },
    /**
     * 役員の削除
     */
    deleteOfficer(index) {
      this.corporateInfo.detail.officer.splice(index, 1)
    },
    /**
     * 商品・サービス項目エリアの追加
     */
    addGoodsAndServices() {
      this.corporateInfo.goodsAndServices.push({
        name: '',
        image: '',
        context: '',
      })
    },
    /**
     * 商品・サービス項目エリアの削除
     *
     * @param {number} index 削除対象のインデックス
     */
    deleteGoodsAndServices(index) {
      this.corporateInfo.goodsAndServices.splice(index, 1)
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      this.corporateInfo = JSON.parse(JSON.stringify(this.defaultCorporateInfo))
      this.$refs.select.resetErrorList()
      this.$refs.fileUpload1.resetErrorList()
      for (let i = 0; i < this.$refs.fileUpload2.length; i++) {
        this.$refs.fileUpload2[i].resetErrorList()
      }

      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * 設定内容を保存ボタン押下処理
     */
    updateCorporateData() {
      const paramData = this.getUpdateCorporateDataParam()

      this.$common.addCallApiNum()
      this.$api
        .updateCorporateData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.corporateInfo.basicSettings.image = ''
            if (this.newLogoData) {
              this.uploadSettingBasicLogo() // 会社ロゴ画像アップロード処理
            } else {
              this.getCompanyData()
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
     * 企業情報更新のリクエストパラメータの取得
     */
    getUpdateCorporateDataParam() {
      const paramData = {
        profile: this.corporateInfo,
      }

      paramData.profile.basicSettings.image = this.defaultCorporateInfo.basicSettings.image
      delete paramData.profile.coverImageCode
      delete paramData.profile.billingAddress

      return paramData
    },
    /**
     * 会社ロゴ画像設定処理
     *
     * @param {object} data ファイル情報
     */
    setBasicLogo(data) {
      this.corporateInfo.basicSettings.image = data.fileImgPath
      this.newLogoData = data.file
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
            this.getCompanyData()
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
     * ファイルアップロード処理
     *
     * @param {object} value ファイル情報(value.fileImgPath→base64)
     */
    serviceImageUploaded(value, index) {
      this.corporateInfo.goodsAndServices[index].image = value.fileImgPath
    },
    /**
     * 添付ファイル削除処理
     */
    fileDeleted(type, index) {
      if (type === 'basicSettings') {
        this.corporateInfo.basicSettings.image = ''
      } else if (type === 'service') {
        this.corporateInfo.goodsAndServices[index].image = ''
      }
    },
    /**
     * 住所検索処理
     */
    searchZipCode() {
      const inputPostCode = this.corporateInfo.basicSettings.postCode
      const zipcode = inputPostCode.replace(/-/g, '')
      const postCodeValidation = this.formItems.find(
        (data) => data.id === 'postCode'
      ).validation

      if (zipcode.length !== 7) {
        postCodeValidation.push({
          type: 'custom',
          message: '7桁の郵便番号を入力してください',
        })
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .getAddress(zipcode)
        .then((resData) => {
          // 存在しない郵便番号でapiを叩くと200以外のステータスが返ってくる
          if (resData.data.status !== 200 || resData.data.results === null) {
            postCodeValidation.push({
              type: 'custom',
              message: '該当する郵便番号がありません。',
            })
          } else {
            // 返却されたデータを挿入する
            this.corporateInfo.basicSettings.addressState = (
              '00' + resData.data.results[0].prefcode
            ).slice(-2)
            this.corporateInfo.basicSettings.addressCity =
              resData.data.results[0].address2 +
              resData.data.results[0].address3

            this.$refs.addressLine1.setInitFlg() // 番地1を強制バリデーションチェック
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    deleteCustomValidation() {
      const postCodeValidation = this.formItems.find(
        (data) => data.id === 'postCode'
      ).validation
      const findIndex = postCodeValidation.findIndex(
        (data) => data.type === 'custom'
      )

      if (findIndex >= 0) {
        postCodeValidation.splice(findIndex, 1)
      }
    },
  },
  head() {
    return {
      title: '企業情報｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.corporate {
  .main-contents {
    .header {
      &-sub {
        margin-top: 8px;
      }
    }
    .contents {
      margin-top: 32px;
      .form-block {
        padding: 32px 0 40px 0;
        border-bottom: 1px solid #e5e5e5;
        p {
          margin-top: 8px;
        }
        &:not(:last-child) {
          border-top: 1px solid #e5e5e5;
        }
        .form-item {
          margin-top: 32px;
          .sub-text {
            margin-bottom: 12px;
          }
          .flex {
            > * {
              &:not(:last-child) {
                margin-right: 16px;
              }
            }
          }
          .input-location {
            > * {
              &:not(:last-child) {
                margin-bottom: 16px;
              }
            }
            .btn {
              width: 109px;
              height: 48px;
            }
          }
          .textarea {
            ::v-deep .custom-input-textarea-block {
              height: 128px;
            }
          }
          .officer-list {
            li {
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f7f8f9;
              width: 591px;
              height: 65px;
              &:not(:last-child) {
                margin-bottom: 10px;
              }
              ::v-deep input {
                background: #ffffff;
              }
              .position {
                width: 200px;
              }
              .name {
                width: 287px;
              }
              .icon-block {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                padding: 0 10px;
                cursor: pointer;
              }
              span {
                margin: 0 10px;
              }
            }
          }
          .title {
            margin-bottom: 10px;
          }
          .middle {
            width: 504px;
          }
          .short {
            width: 243px;
          }
          .margin-t {
            &-16 {
              margin-top: 16px;
            }
          }
          .add-item {
            cursor: pointer;
            .icon {
              fill: #3a435c;
              margin-right: 10px;
            }
          }
        }

        .goodsAndServicesList {
          .goodsAndServices {
            &:not(:first-child) {
              border: 1px dashed #c6c6c6;
              padding: 24px;
            }
            &:not(:last-child) {
              margin-bottom: 32px;
            }
          }
        }
      }
      .add-item-block {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        padding-left: 18px;
        margin-top: 32px;
        border: 1px dashed #c6c6c6;
        cursor: pointer;
        .icon {
          fill: #3a435c;
          margin-right: 10px;
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
          fill: #3a435c;
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
