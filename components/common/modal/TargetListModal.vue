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
            class="btn-close"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4>ターゲットリスト</h4>
            <p>
              ターゲットリスト名を入力して保存してください。<br />表示中のコンタクトのリストをメール配信用のターゲットリストとして登録します。
            </p>
          </div>
          <div class="modal_contents">
            <p class="font-weight-medium modal-secTitle">ターゲットリスト名</p>
            <!-- <CustomInputText
                    v-model="formData.thirdLevelDomain"
                    class="setDomain-inputText"
                    maxlength="255"
                    :validation="getFormData('thirdLevelDomain', 'validation')"
                    @blur="checkApplicationOwnDomainOption()"
                  /> -->
            <CustomInputText
              v-model="formData.targetListName"
              class="customInputText"
              :validation="
                $common.getFormItemsDetail(formItems, 'targetListName')
                  .validation
              "
              maxlength="100"
            />
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-middle"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button
              class="btn btn-basic btn-middle"
              :class="{ 'btn-disabled': checkBtnDisabled() }"
              @click="saveToClose()"
            >
              保存して閉じる
            </button>
            <button
              class="btn btn-basic btn-middle"
              :class="{ 'btn-disabled': checkBtnDisabled() }"
              @click="saveToCreateMail()"
            >
              保存してメール作成へ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TargetListModal',
  components: {},
  props: {},
  data() {
    return {
      formData: {
        targetListName: '',
      },
      formItems: [
        {
          id: 'targetListName',
          placeholder: '',
          option: [],
          validation: [
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
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
     * OKボタンの活性・非活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        const validationItems = {
          targetListName: this.formData.targetListName,
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
        return result
      }
    },
  },
  created() {},
  methods: {
    /**
     * 保存して閉じる
     */
    saveToClose() {
      //   this.$emit('delete')
      this.$emit('saveToClose', this.formData.targetListName)
    },
    /**
     * 保存してメール作成へ進む
     */
    saveToCreateMail() {
      //   this.$emit('delete')
      this.$emit('saveToCreateMail', this.formData.targetListName)
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
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
    h4 {
      margin-bottom: 9px;
    }
    p {
      margin-top: 24px;
      margin-bottom: 32px;
      &:first-content {
        margin-top: 0;
      }
    }
  }
}
.modal-secTitle {
  margin-bottom: 12px;
}
.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.buttons {
  margin-top: 32px;
}
.buttons * {
  color: #ffffff;
}
.icon-attention {
  margin-right: 12px;
}
</style>
