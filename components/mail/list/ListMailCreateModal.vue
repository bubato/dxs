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
            <h4>新規メール作成</h4>
            <p>メールタイトルを入力して新規メール作成へ進んでください。</p>
            <p>
              ここで入力したタイトルは管理画面にだけ表示され、メールを受信するユーザーが見ることはありません。
            </p>
          </div>
          <div class="inputWrap">
            <CustomInputText
              v-model="mailTitle"
              placeholder="メールタイトル名を入力してください"
              maxlength="100"
              :validation="
                $common.getFormItemsDetail(mailItems, 'mailTitle').validation
              "
            />
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-long"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button
              class="btn btn-basic btn-long"
              :class="{ 'btn-disabled': updateBtnDisabled }"
              @click="postMailCreate()"
            >
              メール作成へ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MailCreateModal',
  props: {},
  data() {
    return {
      mailTitle: '',
      mailItems: [
        {
          id: 'mailTitle',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * ボタン「メール作成へ進む」disabled切り替え
     *
     * @return {boolean} disabled用判定
     */
    updateBtnDisabled() {
      let result = true

      if (this.mailTitle !== '') {
        result = false
      }

      return result
    },
  },
  created() {},
  methods: {
    ...mapMutations('mail/mailList', ['hideMailCreateModal']),
    /**
     * 新規メール作成API
     */
    postMailCreate() {
      const paramData = {
        mailTitle: this.mailTitle,
      }

      this.$common.addCallApiNum()
      this.$api
        .postMailCreate(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$router.push('/mail/edit/' + resData.data.mailId + '/')
            this.hideMailCreateModal()
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
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    margin-bottom: 8px;
    h4 {
      text-align: center;
      margin: 10px 0 0;
    }
    p {
      line-height: 1;
      padding-left: 7px;
      &:nth-child(2) {
        margin-top: 10px;
      }
      &:nth-child(3) {
        margin-top: 6px;
      }
    }
  }
  .buttons {
    margin-top: 33px;
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
.inputWrap {
  margin-top: 28px;
  margin-left: -11px;
  width: 752px;
}
.buttons {
  padding-bottom: 8px;
  &* {
    color: #ffffff;
  }
  .button:nth-child(1) {
    margin-right: 16px;
  }
}
</style>
