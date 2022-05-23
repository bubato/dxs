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
          <div class="modal_title">
            <h3>新規ページ作成</h3>
            <p>後からエディター編集画面で変更できます。</p>
          </div>
          <div class="modal_contents">
            <div class="modal_contents-box">
              <div class="flex modal_contents-box-title">
                <RequiredFormLabel
                  class="requiredFormLabel"
                  :label="formData.pageAssortment.label"
                  :required="formData.pageAssortment.required"
                />
                <TooltipHelp
                  label="選択したページ種別に応じて、ページ作成時に配置されるパーツが変更されます。はじめからページを作成する場合は「その他」を選択してください。"
                  class="tooltip"
                />
              </div>
              <CustomInputSelect
                v-model="formData.pageAssortment.value"
                :options="formData.pageAssortment.options"
                :validation="formData.pageAssortment.validation"
                :placeholder="formData.pageAssortment.placeholder"
                @input="changePageKind($event)"
              />
              <div class="flex modal_contents-box-title">
                <RequiredFormLabel
                  class="requiredFormLabel"
                  :label="formData.pageId.label"
                  :required="formData.pageId.required"
                />
                <TooltipHelp
                  label="ページIDはページのURLパスとして利用されます。"
                  class="tooltip"
                />
              </div>
              <CustomInputText
                v-model="formData.pageId.value"
                :placeholder="formData.pageId.placeholder"
                :validation="formData.pageId.validation"
                :is-disabled="
                  formData.pageAssortment.value === '' ||
                  formData.pageAssortment.value === '1'
                "
                maxlength="50"
              />
              <div class="flex modal_contents-box-title">
                <RequiredFormLabel
                  class="requiredFormLabel"
                  :label="formData.title.label"
                  :required="formData.title.required"
                />
                <TooltipHelp
                  label="ページのタイトルを入力します。入力された値はページのタイトルとして表示されます。"
                  class="tooltip"
                />
              </div>
              <CustomInputText
                v-model="formData.title.value"
                :placeholder="formData.title.placeholder"
                :validation="formData.title.validation"
              />
              <div class="flex modal_contents-box-title">
                <RequiredFormLabel
                  class="requiredFormLabel"
                  :label="formData.description.label"
                  :required="formData.description.required"
                />
                <TooltipHelp
                  label="ページの説明文を入力します。入力された値はページの説明文として表示されます。"
                  class="tooltip"
                />
              </div>
              <CustomInputTextarea
                v-model="formData.description.value"
                :placeholder="formData.description.placeholder"
                :validation="formData.description.validation"
                class="descriptionText"
              />
              <div class="flex modal_contents-box-title">
                <RequiredFormLabel
                  v-if="level === 2"
                  class="requiredFormLabel"
                  :label="formData.menu.label"
                  :required="formData.menu.required"
                />
                <TooltipHelp
                  v-if="level === 2"
                  label="このページをWebサイトのメニューに表示するかを選択します。上部メニュー（ヘッダー）と下部メニュー（フッター）のそれぞれで表示の選択ができます。"
                  class="tooltip"
                />
              </div>
              <CustomInputSingleCheckbox
                v-if="level === 2"
                v-model="formData.menu.headerValue"
                name="inputShowHeader"
                class="show-header"
                label="ヘッダーに表示"
              />
              <CustomInputSingleCheckbox
                v-if="level === 2"
                v-model="formData.menu.footerValue"
                name="inputShowFooter"
                class="show-footer"
                label="フッターに表示"
              />
              <RequiredFormLabel
                v-show="formData.menu.headerValue || formData.menu.footerValue"
                class="requiredFormLabel"
                :label="formData.ShowingName.label"
                :required="formData.ShowingName.required"
              />
              <CustomInputText
                v-show="formData.menu.headerValue || formData.menu.footerValue"
                v-model="formData.ShowingName.value"
                :placeholder="formData.ShowingName.placeholder"
                :validation="formData.ShowingName.validation"
              />
            </div>
            <div class="buttons">
              <button
                class="btn btn-cancel btn-long"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-basic btn-long"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="createWebPage()"
              >
                保存してページを作成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CreateWebPageModal',
  props: {
    parentId: {
      type: Number,
      required: true,
      default: 0,
    },
    recordVersion: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  data() {
    return {
      outTargetFlg: false,
      formData: {
        pageAssortment: {
          label: 'ページ種別',
          value: '',
          placeholder: '選択してください',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
          options: this.$common
            .getVersatileOptions(3)
            .filter((data) => !['1', '90'].includes(data.code)),
          state: false,
          required: true,
        },
        pageId: {
          label: 'ページID',
          value: '',
          placeholder: '入力例：about-us',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
          state: false,
          required: true,
        },
        title: {
          label: 'タイトル',
          value: '',
          placeholder: '入力例：私たちについて',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 200,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 200,
              }),
            },
          ],
          state: false,
          required: true,
        },
        description: {
          label: '説明',
          value: '',
          placeholder:
            '入力例：株式会社田中商事の理念や事業内容について紹介するページです。創業以来〇〇県〇〇市を中心にお仕事をさせていただいています。',
          validation: [
            {
              type: 'maxlength',
              maxlength: 500,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 500,
              }),
            },
          ],
          state: false,
          required: false,
        },
        menu: {
          label: 'メニュー',
          headerValue: false,
          footerValue: false,
          state: false,
          required: false,
        },
        ShowingName: {
          label: '表示名',
          value: '',
          placeholder: '入力例：私たちについて',
          validation: [
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
          ],
          state: false,
          required: true,
        },
      },
    }
  },
  computed: {
    checkBtnDisabled() {
      return () => {
        for (const property in this.formData) {
          if (property === 'ShowingName') {
            if (
              !this.formData.menu.headerValue &&
              !this.formData.menu.footerValue
            ) {
              continue
            }
          }

          if (this.formData.pageAssortment.value === '1') {
            continue
          }

          if (
            this.formData[property].required &&
            this.formData[property].value === ''
          ) {
            return true
          }
        }

        return false
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * ページ追加APIの呼び出し
     */
    createWebPage() {
      const paramData = this.getCreateWebPageParam()

      this.$common.addCallApiNum()
      this.$api
        .createWebPage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('reflect')
            this.$common.showCompletePopAlert('ActionMsg_Gen04', 'ページ')
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
     * ページ追加APIのリクエストパラメータの取得
     *
     * @param {object} リクエストパラメータ
     */
    getCreateWebPageParam() {
      const requestParam = {
        siteInfo: {
          recordVersion: this.recordVersion,
        },
        pageInfo: {
          pageType: this.formData.pageAssortment.value,
          pageId: this.formData.pageId.value,
          pageTitle: this.formData.title.value,
          pageDescription: this.formData.description.value,
          showHeader: this.formData.menu.headerValue,
          showFooter: this.formData.menu.footerValue,
          showName: this.formData.ShowingName.value,
          parentPageId: this.parentId,
        },
      }

      if (!this.formData.menu.headerValue && !this.formData.menu.footerValue) {
        delete requestParam.pageInfo.showName
      }

      return requestParam
    },
    /**
     * ページ種別変更処理
     */
    changePageKind(val) {
      let pageId = ''

      switch (val) {
        case '1':
          pageId = ''
          break
        case '2':
          pageId = 'about-us'
          break
        case '3':
          pageId = 'service'
          break
        case '4':
          pageId = 'service-detail'
          break
        case '5':
          pageId = 'corporate'
          break
        case '6':
          pageId = 'usecase'
          break
        case '7':
          pageId = 'usecase-detail'
          break
        case '8':
          pageId = 'recruit'
          break
        case '9':
          pageId = 'news'
          break
        case '10':
          pageId = 'news-detail'
          break
        case '11':
          pageId = 'faq'
          break
        case '12':
          pageId = 'privacy-policy'
          break
        case '13':
          pageId = 'lp'
          break
        case '14':
          pageId = ''
          break
        default:
          break
      }

      this.formData.pageId.value = pageId
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

<style scoped lang="scss">
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
  .modal_title {
    text-align: center;
    margin-bottom: 24px;
  }
  .modal_contents {
    .modal_contents-box {
      height: calc(100vh - 306px);
      overflow: scroll;
      &-title {
        margin-top: 30px;
      }

      p {
        padding: 5px 0;
      }
      .input_load_sentence {
        margin-top: 10px;
      }
      .set_show_buttons {
        margin-top: 10px;
        .show_button_list {
          max-height: 120px;
          overflow: auto;
          .select_show_button {
            position: relative;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
            .btn-delete_select {
              position: absolute;
              top: 0;
              bottom: 0;
              right: 20px;
              margin: auto;
              cursor: pointer;
            }
          }
        }
        .add_item_component {
          margin-top: 10px;
        }
      }
      .descriptionText {
        height: 88px;
      }
    }
    .buttons {
      margin-top: 40px;
    }
    .show-header {
      margin-bottom: 14px;
    }
  }
}

.modal_contents {
  .requiredFormLabel {
    margin-bottom: 10px;
    margin-top: 31px;
    &:first-child {
      margin-top: 0;
    }
  }
}
.input-disabled {
  position: relative;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #cdced0;
    z-index: 1;
    border-radius: 4px;
  }
}
.inputCheckbox {
  margin-bottom: 11px;
  margin-left: 7px;
}
.tooltip {
  margin-bottom: 11px;
}
</style>
