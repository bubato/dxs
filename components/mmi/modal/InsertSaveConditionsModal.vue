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
            <h3>条件を保存する</h3>
          </div>
          <div class="modal_contents">
            <div class="modal_contents-box">
              <p class="title-sub">保存条件名</p>
              <CustomInputText
                v-model="conditionsName"
                :validation="validationConditionsName"
                placeholder=""
              />
              <div class="flex flex-center btn-decision">
                <button
                  class="btn btn-cancel btn-long"
                  @click="closeModal($event, 'close')"
                >
                  キャンセル
                </button>
                <button
                  :class="{
                    'btn-disabled': !conditionsName || isInputError(),
                  }"
                  class="btn btn-basic btn-long"
                  @click="insertSaveConditions()"
                >
                  条件を保存
                </button>
              </div>
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
  name: 'InsertSaveConditionsModal',
  components: {},
  props: {
    /*
     * 画面ID
     */
    screenId: {
      type: String,
      required: true,
    },
    /*
     * 会社情報
     */
    companyInfo: {
      type: Object,
      required: true,
    },
    /*
     * 顧問先情報
     */
    clientInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      conditionsName: '',
      validationConditionsName: [
        {
          type: 'maxlength',
          maxlength: 100,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 100,
          }),
        },
      ],
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', ['selectSaveCondition']),
  },
  watch: {},
  created() {},
  methods: {
    /**
     * 保存条件の登録
     */
    insertSaveConditions() {
      const paramData = {
        screenId: this.screenId, // 画面ID
        linkageId: this.companyInfo.linkageId, // 連携ID
        advisorLinkageId: this.clientInfo.linkageId || '', // 顧問先連携ID
        companyType: this.companyInfo.corporateType, // 法人種別
        saveConditionName: this.conditionsName,
        saveConditions: this.selectSaveCondition.items,
      }

      this.$common.addCallApiNum()
      this.$api
        .insertSaveConditions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('close')
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
          } else {
            this.$emit('close')
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
    isInputError() {
      return this.$common.checkExistValidation(
        [{ id: 'conditionsName', validation: this.validationConditionsName }],
        'conditionsName',
        this.conditionsName
      )
    },
  },
}
</script>

<style scoped lang="scss">
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
  }
  .modal_contents {
    .input_form {
      > div {
        p {
          padding: 5px 0;
        }
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
    }
    .buttons {
      margin-top: 20px;
    }
  }
}

.title {
  &-sub {
    margin: 24px 0 12px 0;
    font-weight: 500;
  }
}

.btn-decision {
  margin: 24px 0 0 0;
  * {
    &:first-of-type {
      margin: 0 16px 0 0;
    }
  }
}
</style>
