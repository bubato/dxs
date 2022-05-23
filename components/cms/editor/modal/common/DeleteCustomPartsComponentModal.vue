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
            <h4>カスタムパーツの削除</h4>
          </div>
          <div class="modal_contents">
            <p class="parts-name">
              {{ deletePartsInfo.partsName }}を削除しますか?
            </p>
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
                @click="deleteCustomParts()"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'DeleteCustomPartsComponentModal',
  components: {},
  props: {
    deletePartsInfo: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      partsName: '',
      formItems: [
        {
          id: 'partsName',
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
    ...mapState('cms/editorStore', ['selectComponentParts']),
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
    ...mapMutations('cms/editorStore', ['setGetCustomPartsListFlg']),
    /**
     * カスタムパーツの削除
     */
    deleteCustomParts() {
      const paramData = {
        partsId: this.deletePartsInfo.partsId,
        recordVersion: this.deletePartsInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteCustomParts(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setGetCustomPartsListFlg(true)
            this.$emit('close')
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
  width: 440px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 24px;
    .input-title,
    .parts-name {
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
