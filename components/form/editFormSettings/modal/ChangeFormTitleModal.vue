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
            <h4>フォームタイトル変更</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              フォームタイトル名を入力して保存してください。
            </p>
            <div class="input-title">
              <CustomInputText
                v-model="formTitle"
                placeholder=""
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
                キャンセル
              </button>
              <button
                class="btn btn-middle btn-basic"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="saveFormTitle()"
              >
                保存
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
  name: 'ChangeFormTitleModal',
  components: {},
  props: {
    propFormTitle: {
      type: String,
      default: '',
      required: true,
    },
  },
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
  created() {
    this.formTitle = this.propFormTitle
  },
  methods: {
    /**
     * フォーム設定画面を表示
     */
    saveFormTitle() {
      this.$emit('reflect', this.formTitle)
      this.$emit('close')
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
