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
            <h4><AttentionSVG class="icon-attention" />メールの削除</h4>
            <p>選択したメールを削除しますか？</p>
            <p>一度削除したメールは元に戻せません。</p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-middle"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button class="btn btn-basic btn-middle" @click="deleteMail()">
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MailDeleteModal',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('mail/mailList', ['selectMailList']),
  },
  created() {},
  methods: {
    ...mapMutations('mail/mailList', ['hideMailDeleteModal']),
    /**
     * オブジェクト削除API
     */
    deleteMail() {
      const paramData = {
        mailId: this.selectMailList.mailId,
        recordVersion: '',
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteMail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('updateMailListData')
            this.$common.showCompletePopAlert('ActionMsg_Gen03', 'メール')
            this.hideMailDeleteModal()
          } else {
            this.$emit('close')
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
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
  width: 566px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
    h4 {
      margin-bottom: 9px;
    }
    p:nth-child(1) {
      margin-top: 24px;
    }
  }
  .buttons {
    margin-top: 32px;
  }
}

.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.buttons * {
  color: #ffffff;
}
.icon-attention {
  margin-right: 12px;
}
</style>
