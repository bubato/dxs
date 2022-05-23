<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal_title">
            <h4>
              <CheckCircleSVG class="icon icon-check" />有効化が完了しました
            </h4>
          </div>
          <div class="modal_contents">
            <p>
              bizskyIDによるMJSデータレイクとの<br />
              データ連携が完了しました。
            </p>
            <p>
              Finance機能(MMI、キャッシュフローマネジメント)が<br />有効になっていることを確認ください。
            </p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-long btn-basic"
              @click="onCloseButtonClicked"
            >
              サービス一覧
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ActivatedMessageModal',
  components: {},
  props: {
    corpType: {
      type: Number,
      default: 2,
    },
    fromPageName: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    onCloseButtonClicked() {
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
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .icon-check {
      width: 32px;
      height: 32px;
      fill: #34c759;
      margin-right: 12px;
    }
    .icon-error {
      width: 32px;
      height: 32px;
      fill: #e60012;
      margin-right: 12px;
    }
  }
  .modal_contents {
    margin-top: 24px;
    p {
      text-align: center;
      &:not(:first-child) {
        margin-top: 24px;
      }
    }
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
</style>
