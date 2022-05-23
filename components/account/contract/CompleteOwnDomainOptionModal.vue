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
            <CheckCircleSVG class="icon-check icon-checkCircle" />
            <h4>独自ドメインオプションの<br />申し込みが完了しました</h4>
          </div>
          <div class="modal_contents">
            <div class="image">
              <img
                :src="$common.getAssetsImgUrl('images/common/img_success.png')"
              />
            </div>
            <p class="context">
              お申し込みいただきありがとうございます。<br />
              独自ドメインを利用できるようになるまで<br />時間を要する場合がございます。<br /><br />
              登録いただいたドメインが利用可能な状態かどうかは<br />
              下記の画面より確認ください。<br />
              <a class="link" @click="linkWebsiteDomain()"
                >Webサイト > ドメイン</a
              >
            </p>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
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
  name: 'CompleteOwnDomainOptionModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * webサイト>ドメインページへ画面遷移
     */
    linkWebsiteDomain() {
      this.$router.push('/site/settings/domain/')
    },
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
    .icon-check {
      width: 32px;
      height: 32px;
      fill: #34c759;
    }
    .h4 {
      padding-left: 12px;
    }
  }
  .modal_contents {
    .context {
      margin-top: 8px;
      padding: 0 40px;
      text-align: center;
    }
    ::v-deep .customLinkText {
      text-align: center;
      margin-top: 16px;
    }
    .image {
      text-align: center;
      margin-top: 24px;
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
