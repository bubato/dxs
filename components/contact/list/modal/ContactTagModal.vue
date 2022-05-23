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
            <p>
              表示されているコードをコピーし、&lt; body&gt;&lt;
              /body&gt;内に埋め込んで使用してください。<br />
              タグを設置するサイトでCSPの設定をしている場合は事前にCSPの設定をしてください。
            </p>
          </div>
          <div class="modal_contents">
            <div class="input-tag">
              <CustomInputText
                v-model="contactTagContext"
                :is-disabled="true"
              />
              <button
                class="btn btn-secondary btn-middle"
                @click="copyClipBoard()"
              >
                コードをコピー
              </button>
            </div>
            <div class="buttons">
              <button
                class="btn btn-long btn-cancel"
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
import { mapState } from 'vuex'

export default {
  name: 'ContactTagModal',
  components: {},
  props: {},
  data() {
    return {
      contactTagContext: '',
    }
  },
  computed: {
    ...mapState('contact/contactList', ['selectContactInfo']),
  },
  created() {
    this.setContactTagContext()
  },
  methods: {
    /**
     * タグの表示内容の設定
     */
    setContactTagContext() {
      this.contactTagContext = this.selectContactInfo.scriptTag
    },
    /**
     * クリップボードにコピー
     */
    copyClipBoard() {
      this.$common.copyClipBoard(this.contactTagContext)
      this.$common.showCompletePopAlert('ActionMsg_Gen08')
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
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
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
