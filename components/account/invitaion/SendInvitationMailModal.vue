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
            <h4>
              <AttentionSVG class="icon-attention" />招待メールを送信します
            </h4>
            <p>
              選択した顧問先へbizskyDXへの招待メールを送信します。<br />よろしいですか？
            </p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-middle"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button class="btn btn-basic btn-middle" @click="sendMail()">
              メールを送信
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SendInvitationMailModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * メールを送信する
     */
    sendMail() {
      this.$emit('send')
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event イベントオブジェクト
     * @param {String} type クローズタイプ
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
  width: 404px;
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

.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.buttons * {
  color: #ffffff;
}
.icon-attention {
  margin-right: 12px;
}
</style>
