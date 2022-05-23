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
            <h3>独自ドメインオプションの申し込み</h3>
            <p>独自のドメインを取得してWebサイトの信頼感を高めましょう。</p>
          </div>
          <div class="modal_contents">
            <div class="modal_contents-box">
              <!-- メインコンテンツ -->
              <div class="cautionBox">
                <p>
                  2022年4月から6月まではβ版提供のため独自ドメインオプションは無償でご利用いただけます。<br />
                  2022年7月以降も本契約いただければ独自ドメインを継続利用いただけます。
                </p>
              </div>

              <div class="setDomain">
                <p class="setDomain-text">
                  URLの文字列は20字まで入力でき、大文字は自動で小文字に変換されます。<br />すでに登録されているドメインは利用できません。一度登録したドメインは変更できません。
                </p>
                <div class="flex setDomain-url">
                  <p>https://</p>
                  <CustomInputText
                    v-model="formData.thirdLevelDomain"
                    class="setDomain-inputText"
                    maxlength="255"
                    :validation="getFormData('thirdLevelDomain', 'validation')"
                    @blur="checkApplicationOwnDomainOption()"
                  />
                  <CustomInputSelect
                    v-model="formData.topLevelDomain"
                    class="setDomain-select"
                    :options="getFormData('topLevelDomain', 'option')"
                    :validation="getFormData('topLevelDomain', 'validation')"
                    @change="checkApplicationOwnDomainOption()"
                  />
                </div>
              </div>

              <div class="flex center optionBox">
                <div class="optionBox-price flex flex-center">
                  <p class="optionBox-price-title">オプション料金</p>
                  <p>
                    月額<span class="optionBox-price-value">0</span>円<span
                      class="optionBox-price-tax"
                      >(税別)</span
                    >
                  </p>
                </div>
                <ul class="optionBox-list">
                  <li>
                    オプションを申し込みいただいた当月からオプション料金の請求が発生します。
                  </li>
                  <li>
                    オプションを解約した場合は解約した月の翌月からオプション料金の請求が停止します。
                  </li>
                  <li>
                    オプションを解約してもWebサイトへはサブドメインでアクセス可能です。
                  </li>
                </ul>
              </div>
              <div class="agree">
                <CustomInputSingleCheckbox
                  v-model="formData.agree"
                  name="agree"
                  label="同意する（クリック後申し込み可能になります）"
                />
              </div>
              <!-- / メインコンテンツ -->
            </div>
            <div class="buttons">
              <button
                class="btn btn-basic btn-long"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="confirmedSubdomain()"
              >
                独自ドメインオプションを申し込む
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
  name: 'OwnDomainOptionModal',
  props: {},
  data() {
    return {
      responseOption: {
        result: false,
        val: null,
      },
      formData: {
        topLevelDomain: '',
        thirdLevelDomain: '',
      },
      formItems: [
        {
          id: 'topLevelDomain',
          placeholder: '',
          option: [],
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'thirdLevelDomain',
          placeholder: '',
          validation: [
            {
              type: 'maxlength',
              maxlength: 255,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 255,
              }),
            },
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cmsDomain,
              message:
                '利用できない記号が含まれています。半角英語（小文字のみ）、半角数字または半角記号の「-」が利用可能です。',
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cmsDomainFormat1,
              message: this.$common.getMasterMessage('ErrorMsg_Url05'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cmsDomainFormat2,
              message: this.$common.getMasterMessage('ErrorMsg_Url06'),
            },
          ],
        },
        {
          id: 'agree',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * 独自ドメインオプションを申し込むボタンの活性・非活性
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (this.responseOption.result === false) {
          result = true
        } else {
          const validationItems = {
            thirdLevelDomain: this.formData.thirdLevelDomain,
            agree: this.formData.agree,
          }

          for (const key in validationItems) {
            if (
              this.$common.checkExistValidation(
                this.formItems,
                key,
                validationItems[key]
              )
            ) {
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
    this.setTopLevelDomain() // TLDをマスターデータより取得、設定
  },
  mounted() {},
  methods: {
    /**
     * TLDをマスターデータより取得、設定
     */
    setTopLevelDomain() {
      const masterData = this.$common.getVersatileItemInformation(46)
      const optionList = []

      for (const key in masterData) {
        optionList.push({
          code: masterData[key].viewOrder.toString(),
          label: masterData[key].tld,
        })

        // 初期表示値をセット
        if (masterData[key].defaultSetting) {
          this.formData.topLevelDomain = masterData[key].viewOrder.toString()
        }
      }

      optionList.sort((a, b) => {
        return a.code - b.code
      })

      this.formItems.find(
        (data) => data.id === 'topLevelDomain'
      ).option = optionList
    },
    /**
     * フォームデータの取得
     *
     * @param {String} id formItems ID名
     * @param {String} value formItems 取得項目key名
     * @returns {Object[]} formItems value
     */
    getFormData(id, value) {
      return this.formItems.find((data) => data.id === id)[value]
    },
    /**
     * トップレベルドメインデータの取得
     *
     * @param {String} id formItems ID名
     * @param {String} value formItems 取得項目key名
     * @returns {String} formData.topLevelDomainテキストデータ
     */
    getTopLevelDomain(id, value) {
      return this.getFormData(id, value).find(
        (data) => data.code === this.formData.topLevelDomain
      ).label
    },
    /**
     * 独自ドメイン登録可否チェック
     */
    checkApplicationOwnDomainOption() {
      this.formData.thirdLevelDomain = this.formData.thirdLevelDomain.toLowerCase()
      if (
        this.$common.checkExistValidation(
          this.formItems,
          'thirdLevelDomain',
          this.formData.thirdLevelDomain,
          true
        )
      ) {
        return
      }

      const paramData = {
        originalDomainFqdn:
          this.formData.thirdLevelDomain +
          this.getTopLevelDomain('topLevelDomain', 'option'),
      }

      this.$common.addCallApiNum()
      this.$api
        .checkApplicationOwnDomainOption(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.responseOption.val = resData.data.option
            this.responseOption.result = true
          } else {
            this.responseOption.val = null
            this.responseOption.result = false
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * サブドメイン確定API
     */
    confirmedSubdomain() {
      const paramData = {
        originalDomainFqdn:
          this.formData.thirdLevelDomain +
          this.getTopLevelDomain('topLevelDomain', 'option'),
        option: this.responseOption.val,
      }

      this.$common.addCallApiNum()
      this.$api
        .confirmedSubdomain(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('complete')
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
     * モーダルを閉じる
     *
     * @param {Object} event イベントオブジェクト
     * @param {String} type イベントタイプ
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
  padding: 30px 24px 40px 40px;
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
      max-height: calc(100vh - 306px);
      overflow: scroll;
      &-title {
        margin-top: 30px;
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
.cautionBox {
  border: 1px solid var(--unnamed-color-ffcc00);
  background: #fffae5 0% 0% no-repeat padding-box;
  border: 1px solid #ffcc00;
  border-radius: 4px;
  padding: 16px 24px;
  margin-bottom: 32px;
}
.setDomain {
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-bottom: 32px;
  &-text {
    margin-bottom: 16px;
  }
  &-url *:not(last-child) {
    margin-right: 16px;
  }
  &-inputText {
    width: 380px;
  }
  &-select {
    width: 140px;
  }
}
.optionBox {
  background: #f5f5f5 0% 0% no-repeat padding-box;
  border-radius: 5px;
  padding: 24px 0px;
  flex-flow: column;
  margin-bottom: 30px;
  &-price {
    margin-bottom: 13px;
    font-size: 17px;
    font-weight: 500;
    align-items: baseline;
    &-title {
      margin-right: 24px;
    }
    &-value {
      font-size: 28px;
      margin-left: 8px;
      margin-right: 4px;
    }
    &-tax {
      font-weight: normal;
      font-size: 15px;
      margin-left: 4px;
    }
  }
  &-list {
    li:before {
      content: '・';
    }
  }
}
</style>
