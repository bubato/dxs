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
            <h4>フォームの公開設定が完了しました</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              フォームの公開設定が正常に実行されました。<br />
              ぺージ内にフォームを表示するためのタグ取得や<br />
              デザインの変更をタグ・CSS・jS設定画面で確認ください。
            </p>
            <div class="image">
              <img
                :src="$common.getAssetsImgUrl('images/common/img_success.png')"
              />
            </div>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
              </button>
              <button class="btn btn-middle btn-basic" @click="exeOk()">
                タグ・CSS・JS設定を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CompleteFormPublishModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('common', ['completeFuncInfo']),
  },
  created() {},
  methods: {
    /**
     * タグ・CSS・JS設定を見るボタン押下処理
     */
    exeOk() {
      this.$emit('reflect')
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
  width: 680px;
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
      padding-right: 12px;
    }
  }
  .modal_contents {
    .context {
      margin-top: 8px;
      padding: 0 40px;
      text-align: center;
    }
    .image {
      text-align: center;
      margin-top: 20px;
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
