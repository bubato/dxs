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
            <WarningSVG class="icon icon-warning" />
            <h4>フォームの削除</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              選択したフォームを削除しますか?<br />
              一度削除したフォームは元に戻せません。
            </p>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
              </button>
              <button class="btn btn-middle btn-basic" @click="exeDelete()">
                削除する
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
  name: 'DeleteFormModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * 削除するボタン押下処理
     */
    exeDelete() {
      this.$emit('delete')
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
  width: 404px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      fill: #ffcc00;
    }
  }
  .modal_contents {
    margin-top: 24px;
    .input-tag {
      .btn {
        margin-top: 12px;
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
}
</style>
