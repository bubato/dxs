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
              <ErrorSVG
                class="icon icon-error"
              />アカウントの有効期限が切れています
            </h4>
          </div>
          <div class="modal_contents">
            <p>
              トライアル期間の終了または解約済のアカウントです。<br />再度ご利用いただくには本契約にお申込みください。
            </p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-long btn-cancel"
              @click="transitionApplicationScreen()"
            >
              申し込みページへ移動
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AccountExpiredModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * 申し込みページへ移動
     */
    transitionApplicationScreen() {
      this.$emit('close')
      this.$router.push('/request/input/')
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
  width: 544px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .icon-error {
      width: 32px;
      height: 32px;
      fill: #e60012;
      margin-right: 12px;
    }
  }
  .modal_contents {
    margin-top: 10px;
    p {
      text-align: center;
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
