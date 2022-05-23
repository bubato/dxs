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
            @mouseover="$common.setAreaLabel($event, 'right', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal-title">
            <h4>
              <WarningSVG
                class="icon-warning"
              />新しいデータ項目を追加できません
            </h4>
          </div>
          <p>
            新しいデータ項目が上限に達しているため新しい新しいデータ項目の追加ができません。<br />不要なデータ項目を削除してから新しいデータ項目を作成しましょう。
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
  name: 'NotCreateMoreInformationModal',
  components: {},
  methods: {
    /**
     * モーダルを閉じる
     *
     * @param {Object} event イベントオブジェクト
     * @param {String} type イベントタイプ
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
.modal-image {
  margin: 0 auto;
}
.modal-container {
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 24px 30px 40px;
  max-height: calc(100vh - 80px);
  overflow-y: scroll;
  text-align: center;
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
    .icon-warning {
      margin-right: 12px;
      fill: #ffcc00;
      width: 24px;
      height: 24px;
    }
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
