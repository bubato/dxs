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
          <div class="modal-title">
            <h4>初期設定ツアーは中断しても大丈夫です</h4>
          </div>
          <p>
            初期設定ツアーを完了せずに画面を閉じても安心してください。<br />入力内容は保存されているので、次回ログイン時に初期設定ツアーを再開できます。
          </p>
          <div class="footer btn">
            <button
              class="btn btn-basic btn-long"
              @click="closeModal($event, 'close')"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SaveModal',
  components: {},
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
    },
  },
}
</script>

<style lang="scss" scoped>
// モーダル
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 24px 30px 40px;
  max-height: calc(100vh - 80px);
  overflow-y: scroll;
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    width: 17px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 5px solid transparent;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }
  .modal-title {
    text-align: center;
    margin-bottom: 8px;
  }
  .footer {
    margin-top: 32px;
    & > .btn {
      &:first-child {
        margin-right: 8px;
      }
    }
  }
}
// モーダル
</style>
