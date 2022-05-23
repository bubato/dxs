<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event)"
        @mouseup="closeModal($event)"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event)"
            @mouseover="$common.setAreaLabel($event, 'right', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal-title">
            <h4>
              <WarningSVG class="icon-warning" />新しいページを作成できません
            </h4>
          </div>
          <p>
            Webページの作成数が上限に達しているため新しいページの作成ができません。<br />不要なページを削除してから新しいページを作成しましょう。
          </p>
          <div class="footer btn">
            <button class="btn btn-basic btn-long" @click="closeModal($event)">
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
  name: 'CreateWebPageNotMorePageModal',
  components: {},
  methods: {
    /**
     * モーダルを閉じる
     */
    closeModal(event) {
      this.$emit('close')
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
