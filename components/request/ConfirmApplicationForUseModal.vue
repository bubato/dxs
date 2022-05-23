<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container variable">
          <div class="modal_title">
            <h4>お申込み前の確認</h4>
          </div>
          <div class="modal_contents">
            <p class="annotation-text">
              bizskyDXではは株式会社ミロク情報サービスが提供するACELINK
              NX-Proと連携して顧問先企業様の経営分析機能をご利用いただけます。<br /><br />

              ACELINK
              NX-Proをご利用中の会計事務所様は「はい」を選択ください。<br />
              それ以外の方は「いいえ」を選択ください。
            </p>
            <div class="buttons">
              <button class="btn btn-basic btn-long" @click="closeModal('0')">
                <span>いいえ</span>
                <span class="font-size-middle"
                  >ACELINK NX-PROを利用していない</span
                >
              </button>
              <button class="btn btn-basic btn-long" @click="closeModal('1')">
                <span>はい</span>
                <span class="font-size-middle"
                  >ACELINK NX-PROを利用している</span
                >
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
  name: 'ConfirmApplicationForUseModal',
  data() {
    return {
      partsData: {},
    }
  },
  computed: {},
  created() {},
  methods: {
    /**
     * モーダルを閉じる
     *
     * @param {String} type ボタン選択値 (0:いいえ 1:はい)
     */
    closeModal(type) {
      this.$emit('close', type)
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/scss/sp/mediaQuery.scss';

.modal-wrapper {
  display: flex;
  justify-content: center;
}
@media all and (-ms-high-contrast: none) {
  *::-ms-backdrop,
  .modal-mask .modal-container {
    transform: translate(-50%, -50%);
  } /* IE11 */
}
.modal-container {
  @include mq(pc) {
    width: 684px;
  }
  @include mq(sp) {
    width: 90%;
  }
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 20px;
    .annotation-text {
      text-align: center;
    }
    .link-text {
      display: block;
      margin-top: 16px;
      text-align: center;
    }
    .buttons {
      margin-top: 32px;
      .btn {
        padding-top: 7px;
        padding-bottom: 7px;
        display: flex;
        align-content: center;
        flex-direction: column;
        height: auto;
      }
    }
  }
}
</style>
