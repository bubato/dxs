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
            <h3>編集した内容を破棄しますか？</h3>
            <!-- <p class="text-caption">編集した内容を破棄しますか？</p> -->
          </div>
          <div class="modal_contents">
            <div class="modal_contents-box">
              <div class="flex flex-center btn-decision">
                <button
                  class="btn btn-cancel btn-long"
                  @click="chooseDiscardChanges('discard')"
                >
                  初期値に戻す
                </button>
                <button
                  class="btn btn-basic btn-long"
                  @click="chooseDiscardChanges('change')"
                >
                  変更した値を適用する
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
export default {
  name: 'DiscardConfirmationModal',
  components: {},
  props: {
    itemIndex: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      chooseDiscard: null,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
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
      if (this.chooseDiscard === 'discard') {
        this.$emit('discardChanges', 'discard')
      } else {
        this.$emit('discardChanges', 'change')
      }
    },
    /**
     * 変更内容の破棄/適用の選択
     */
    chooseDiscardChanges(type) {
      this.chooseDiscard = type
      if (type === 'discard') {
        this.$emit('discardChanges', 'discard')
      } else if (type === 'change') {
        this.$emit('discardChanges', 'change')
      }
      this.closeModal(null, 'close')
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
.btn-decision {
  margin: 24px 0 0 0;
  * {
    &:first-of-type {
      margin: 0 16px 0 0;
    }
  }
}

.text {
  &-caption {
    margin: 0 0 20px 0;
  }
  &-unit {
    margin: 0 0 20px 10px;
  }
}

.custom-input-radio /deep/ {
  .radio_list label {
    height: 48px;
    margin: 0 20px 20px 0 !important;
  }
}

.custom-input-text /deep/ {
  input[type='text'] {
    margin: 0 0 20px 0;
  }
}
</style>
