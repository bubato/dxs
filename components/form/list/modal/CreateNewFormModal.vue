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
            <h4>新規フォーム作成</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              フォームタイトルを入力してフォーム設定へ進んでください。<br />
              ここで入力したタイトルは管理画面にだけ表示され、フォームを利用するユーザーを見ることはありません。
            </p>
            <div class="input-title">
              <CustomInputText
                v-model="formTitle"
                placeholder="入力例：お問い合わせ受付フォーム"
                maxlength="100"
                :validation="
                  $common.getFormItemsDetail(formItems, 'formTitle').validation
                "
              />
            </div>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
              </button>
              <button
                class="btn btn-middle btn-basic"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="insertFormData()"
              >
                フォーム設定へ進む
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
  name: 'CreateNewFormModal',
  components: {},
  props: {},
  data() {
    return {
      formTitle: '',
      formItems: [
        {
          id: 'formTitle',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * ボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'formTitle',
            this.formTitle
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {},
  methods: {
    /**
     * フォーム設定画面を表示
     */
    insertFormData() {
      const paramData = {
        copyFlg: 0, // コピーしない
        title: this.formTitle,
      }

      this.$common.addCallApiNum()
      this.$api
        .insertFormData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('close')
            this.$router.push('/form/edit/' + resData.data.formId)
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
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 24px;
    .input-title {
      margin-top: 12px;
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
</style>
