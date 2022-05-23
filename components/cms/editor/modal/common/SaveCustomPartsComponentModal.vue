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
            <h4>カスタムパーツとして保存</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              カスタムパーツ名を入力して、保存してください。
            </p>
            <p class="parts-name">
              元のパーツ：{{ selectComponentParts.name }}
            </p>
            <div class="input-title">
              <CustomInputText
                v-model="partsName"
                placeholder="カスタムパーツ名を入力してください"
                maxlength="100"
                :validation="
                  $common.getFormItemsDetail(formItems, 'partsName').validation
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
                @click="saveCustomPartsComponent()"
              >
                登録
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SaveCustomPartsComponentModal',
  components: {},
  props: {},
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
            'partsName',
            this.partsName
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
     * カスタムパーツの登録
     */
    saveCustomPartsComponent() {
      const paramData = {
        customPartsInfo: {
          partsName: this.partsName,
          partsJson: this.selectComponentParts,
        },
      }

      this.$common.addCallApiNum()
      this.$api
        .saveCustomPartsComponent(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('reflect')
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
  width: 832px;
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
