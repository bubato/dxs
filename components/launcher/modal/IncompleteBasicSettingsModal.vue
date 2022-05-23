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
            <h3>Webサイトの基本設定が完了していません。</h3>
          </div>
          <div class="modal_contents">
            <p class="context">
              基本設定で登録が完了していない項目があります。<br />
              基本設定を完了してからページの作成または公開管理設定を行ってください。
            </p>
            <div class="buttons">
              <button
                class="btn btn-long btn-basic"
                @click="transitionCmsBasicSettings()"
              >
                基本設定画面へ移動する
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
  name: 'IncompleteBasicSettingsModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('common', ['showIncompleteBasicSettingsMessage']),
  },
  created() {},
  methods: {
    /**
     * CMS-基本設定画面に遷移
     */
    transitionCmsBasicSettings() {
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
    text-align: center;
  }
  .modal_contents {
    .context {
      margin-top: 8px;
      padding: 0 40px;
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
