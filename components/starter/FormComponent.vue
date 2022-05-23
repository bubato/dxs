<template>
  <div class="profile-form-component">
    <div
      v-for="(formDetail, index) in filterFormDetailList()"
      :key="index"
      class="form-detail"
      :class="formDetail.class"
    >
      <RequiredFormLabel
        class="form-detail-title"
        :label="formDetail.name"
        :required="formDetail.required"
        :class="formDetail.classRequiredFormLabel"
      />
      <div
        class="form-contents flex"
        :class="{ 'two-items': formDetail.form.length === 2 }"
      >
        <template v-for="form in formDetail.form">
          <template v-if="form.formType === 'inputText'">
            <CustomInputText
              :key="form.id"
              :ref="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input text"
              :placeholder="form.placeholder"
              :class="form.class"
              :maxlength="form.maxLength"
              :validation="form.validation"
            />
            <CustomLinkText
              v-if="form.linkText"
              :key="form.linkTextId"
              :text="form.linkText"
              :link="form.linkTextUrl"
            />
          </template>
          <template v-if="form.formType === 'inputNumber'">
            <CustomInputNumber
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input text"
              :placeholder="form.placeholder"
              :class="form.class"
              :maxlength="form.maxLength"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'inputTel'">
            <CustomInputTel
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input text"
              :placeholder="form.placeholder"
              :class="form.class"
              :maxlength="form.maxLength"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'postCode'">
            <div :key="form.id" class="postCodeInner">
              <CustomInputText
                v-model="editProfileData[form.id]"
                :placeholder="form.placeholder"
                :class="form.class"
                :maxlength="form.maxLength"
                :validation="dataError(form.validation)"
                class="custom-input text"
                @input="deleteCustomValidation()"
              />
              <button
                class="btn btn-secondary btn-middle"
                :class="{
                  'btn-disabled':
                    editProfileData[form.id] === '' ||
                    isError([form], form.id, editProfileData[form.id]),
                }"
                @click="searchZipCode(editProfileData[form.id])"
              >
                住所検索
              </button>
            </div>
          </template>
          <template v-if="form.formType === 'textarea'">
            <CustomInputTextarea
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input textarea"
              :placeholder="form.placeholder"
              :class="form.class"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'select'">
            <CustomInputSelect
              v-show="
                !(
                  form.id == 'listingClassificationSelect' &&
                  editProfileData['listingClassificationRadio'] === '0'
                )
              "
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input select"
              :class="form.class"
              :placeholder="form.placeholder"
              :options="form.options"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'radio'">
            <CustomInputRadio
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input radio"
              :name="form.id + '_' + formIndex"
              layout-type="vertical"
              :options="form.options"
              :placeholder="form.placeholder"
              :class="form.class"
              :validation="form.validation"
              @input="radioSelectValueSetting(form.id, $event)"
            />
          </template>
          <template v-if="form.formType === 'check'">
            <CustomInputCheckbox
              :key="form.id"
              v-model="editProfileData[form.id]"
              class="custom-input check"
              :name="form.id"
              :options="form.options"
              :placeholder="form.placeholder"
              :class="form.class"
              :validation="form.validation"
            />
          </template>
          <template v-if="form.formType === 'singleCheckbox'">
            <CustomInputSingleCheckbox
              :key="form.id"
              v-model="editProfileData[form.id]"
              :placeholder="form.placeholder"
              :name="form.id"
              :label="form.label"
              :options="form.options"
              :class="form.class"
              @input="singleCheckboxSelectValueSetting(form.id, $event)"
            />
          </template>
          <template v-if="form.formType === 'fileUpload'">
            <CustomInputProfileImage
              :key="form.id"
              :profile-image="editProfileData[form.id]"
              @update="updateProfileImage($event, editProfileData)"
            />
          </template>
          <template v-if="form.formType === 'logoFileUpload'">
            <div :key="form.id" class="logoFileUploadWrap">
              <p class="logoFileUpload-sub-text">
                ファイルサイズは500KB以下、拡張子は.{{
                  imageAllowExts.join('、')
                }}が利用できます。
              </p>
              <FileUpload
                ref="fileUpload"
                :file-data="editProfileData[form.id]"
                :max-size="500"
                class="file-upload"
                @uploaded="setBasicLogo($event)"
                @deleted="editProfileData[form.id] = ''"
              />
            </div>
          </template>
          <template v-if="form.formType === 'draggable'">
            <div :key="form.id" class="officer">
              <draggable
                :list="editProfileData[form.id]"
                tag="ul"
                class="drag-list"
                group="radio"
              >
                <li
                  v-for="(item, index2) in editProfileData[form.id]"
                  :key="index2"
                >
                  <div class="icon-block">
                    <DehazeSVG class="icon-dehaze" />
                  </div>
                  <input
                    v-model="item.position"
                    type="text"
                    class="position"
                    maxlength="30"
                  />
                  <input
                    v-model="item.name"
                    type="text"
                    class="name"
                    maxlength="60"
                  />
                  <div class="icon-block">
                    <CancelSVG
                      v-show="index2 > 0"
                      class="icon-cancel"
                      @mouseover="$common.setAreaLabel($event, 'right', '削除')"
                      @mouseleave="$common.setAreaLabel($event, '', '')"
                      @blur="$common.setAreaLabel($event, '', '')"
                      @click="deleteOfficer(index2)"
                    />
                  </div>
                </li>
              </draggable>
              <AddItem
                label="項目を追加"
                class="margin-t-16"
                @addItem="addOfficer()"
              />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'FormComponent',
  components: {
    draggable,
  },
  props: {
    formDetailList: {
      type: Array,
      default: () => [],
      required: true,
    },
    formIndex: {
      type: Number,
      default: () => null,
      required: true,
    },
    editProfileData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      dataErrorVal: [],
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
    }
  },
  computed: {
    filterFormDetailList() {
      return () => {
        const newFormDetailList = this.formDetailList.filter((formData) => {
          let showResult = true

          if (formData.name === '退職月') {
            if (this.editProfileData.employmentStatus === '1') {
              showResult = false
            }
          }

          if (formData.name === '有効期限年月') {
            if (this.editProfileData.checkExpiration) {
              showResult = false
            }
          }

          return showResult
        })

        return newFormDetailList
      }
    },
  },
  mounted() {},
  created() {},
  methods: {
    /**
     * radioボタン選択値に応じた入力項目の変更がある場合、入力値の初期化
     * @param String id key
     * @param String data radioボタン入力値
     */
    radioSelectValueSetting(id, data) {
      // 代表プロフィール > 就業状況
      if (id === 'employmentStatus' && data === '1') {
        this.editProfileData.hireDateEndYear = ''
        this.editProfileData.hireDateEndMonth = ''
      }
      // 企業プロフィール > 上場区分
      if (id === 'listingClassificationRadio' && data === '0') {
        this.editProfileData.listingClassificationSelect = ''
      }
    },
    /**
     * singleCheckbox選択値に応じた入力項目の変更がある場合、入力値の初期化
     * @param String id key
     * @param String data radioボタン入力値
     */
    singleCheckboxSelectValueSetting(id, data) {
      // 代表プロフィール > 有効期限
      if (id === 'checkExpiration' && !data) {
        this.editProfileData.expirationYear = ''
        this.editProfileData.expirationMonth = ''
      }
    },
    /**
     * バリデーションの有無の確認
     * @param [object] validationItems フォームIDとバリデーションのオブジェクト
     * @param String key ID
     * @param String inputVal フォーム入力項目
     */
    isError(validationItems, key, inputVal) {
      return this.$common.checkExistValidation(validationItems, key, inputVal)
    },
    dataError(data) {
      if (this.dataErrorVal.length === 0) {
        return data
      } else {
        return this.dataErrorVal
      }
    },
    deleteContentData(formList, index) {
      return formList.filter(function (number) {
        return formList.indexOf(number) !== index
      })
    },
    searchZipCode(val) {
      const zipcode = val.replace(/-/g, '')

      if (zipcode.length !== 7) {
        this.$emit('updateCustomValidation', {
          id: 'postCode',
          type: 'add',
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
            this.$emit('updateCustomValidation', {
              id: 'postCode',
              type: 'add',
              message: '該当する郵便番号がありません。',
            })
          } else {
            // 返却されたデータを挿入する
            this.editProfileData.addressState = (
              '00' + resData.data.results[0].prefcode
            ).slice(-2)
            this.editProfileData.addressCity =
              resData.data.results[0].address2 +
              resData.data.results[0].address3

            this.$refs.addressLine1[0].setInitFlg() // 番地1を強制バリデーションチェック
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    deleteCustomValidation() {
      this.$emit('updateCustomValidation', {
        id: 'postCode',
        type: 'delete',
      })
    },
    /**
     * 役員情報の追加
     */
    addOfficer() {
      this.editProfileData.officer.push({
        position: '',
        name: '',
      })
    },
    /**
     * 役員情報の削除
     */
    deleteOfficer(index) {
      this.editProfileData.officer.splice(index, 1)
    },
    updateProfileImage(val, obj) {
      obj.profileImage = val
    },
    /**
     * 会社ロゴ画像設定処理
     *
     * @param {object} data ファイル情報
     */
    setBasicLogo(data) {
      this.editProfileData.image = data.fileImgPath
      this.$emit('updateLogoData', data.file)
    },
  },
}
</script>

<style scoped lang="scss">
.form-detail {
  margin-bottom: 32px;
  &-title {
    margin-bottom: 12px;
  }
  .form-contents {
    &.multi {
      margin-bottom: 12px;
    }
    ::v-deep .custom-input-textarea-block {
      height: 128px;
    }
    .custom-input {
      &.text,
      &.select,
      &.textarea {
        width: 100%;
      }
      &.long {
        width: 100% !important;
      }
      &.medium {
        width: 367px !important;
      }
      &.semiShort {
        width: 334px !important;
      }
      &.short {
        width: 167px !important;
      }
      &.twoBlocks {
        display: flex;
        &.custom-input-text {
          width: 367px;
          margin-right: 16px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      &.founder {
        > div {
          display: flex;
          *:nth-child(1) {
            margin-right: 16px;
          }
        }
        .add-item-component {
          margin-top: 16px;
          background: #ffffff;
          border: dashed 1px #c6c6c6;
        }
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
  // form アイテムの追加
  .add-item {
    display: flex;
    align-items: center;
    height: 48px;
    background: #ffffff 0% 0% no-repeat padding-box;
    cursor: pointer;
    svg {
      width: 20px;
      height: 20px;
      fill: #3a435c;
    }
    span {
      display: block;
      margin: 0 0 0 10px;
    }
  }
}
// form レイアウト調整
.listingClassification {
  .form-contents {
    display: block;
  }
  .listingClassificationSelect {
    margin: 0 !important;
    margin-top: 8px !important;
  }
}
.address .form-contents {
  display: block !important;
  > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .postCodeInner {
    display: flex;
    .btn-middle {
      height: 48px;
    }
  }
  .postCode {
    width: 167px !important;
    margin-right: 16px;
  }
}
.drag-list {
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f8f9;
    height: 65px;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    ::v-deep input {
      background: #ffffff;
      &.is-disabled {
        background: #cdced0;
        pointer-events: none;
      }
    }
    .icon-block {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      min-width: 40px;
      padding: 0 10px;
      cursor: pointer;
    }
    .position {
      width: 160px;
    }
    .name {
      width: 335px;
      margin-left: 12px;
    }
  }
}
.linktext .form-contents {
  flex-wrap: wrap;

  .customLinkText {
    text-align: left;
    flex-basis: 100%;
    margin-top: 12px;
  }
}
.hidden.listingClassificationSelect {
  display: none;
}
/* ロゴ画像アップロード */
.logoFileUploadWrap {
  width: 100%;
  text-align: left;
}
.logoFileUpload-sub-text {
  margin-bottom: 12px;
}
</style>
