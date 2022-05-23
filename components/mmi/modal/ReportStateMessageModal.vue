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
            <h4><ErrorSVG class="icon icon-error" />データが不足しています</h4>
          </div>
          <div class="modal_contents">
            <p v-if="lackInfo && lackInfo.message">
              {{ lackInfo.message }}
            </p>
            <p v-else>
              設定した条件に該当するデータが少ないため一部の分析結果を表示できませんでした。
            </p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-long btn-cancel"
              @click="onCloseButtonClicked()"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ReportStateMessageModal',
  components: {},
  props: {
    lackInfo: {
      type: Object,
      default: null,
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
