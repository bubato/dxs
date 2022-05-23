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
            <h4>
              <ErrorSVG class="icon icon-error" />{{ getErrorData('title') }}
            </h4>
          </div>
          <div class="modal_contents">
            <div class="flex flex-center">
              <img
                :src="$common.getAssetsImgUrl('images/invitation/expire.png')"
                width="360"
                height="270"
              />
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <p v-html="getErrorData('msg')"></p>
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
  </transition>
</template>

<script>
export default {
  name: 'SendInvitationMailErrorModal',
  components: {},
  props: {
    errorType: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      errorDataList: [
        {
          type: 1,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは<br>バックオフィスユーザーとして登録されているため招待できません。<br>アドレスを変更して再度招待メールを送信ください。',
        },
        {
          type: 2,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは<br>すでにbizskyDXアカウント申請中のため招待できません。<br>アドレスを変更するか顧問先に有効なアドレスを確認ください。',
        },
        {
          type: 3,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは<br>すでに別の顧問先招待に使われているため招待できません。<br>アドレスを変更して再度招待メールを送信ください。',
        },
        {
          type: 4,
          title: '',
          msg: '',
        },
        {
          type: 5,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは<br>​自分のテナントで登録されているメールアドレスのため招待できません。​<br>アドレスを変更して再度招待メールを送信ください。',
        },
        {
          type: 6,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは<br>​招待先が会計事務所として登録されてるため招待できません。',
        },
        {
          type: 7,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは<br>​アカウント登録されていますが、解約状態のため招待できません。​<br>アドレスを変更して再度招待メールを送信ください。',
        },
        {
          type: 8,
          title: '招待メールを配信できません',
          msg:
            'このメールアドレスは​<br>アカウント登録されていますが、削除されたか有効な状態でないため招待できません。​<br>アドレスを変更して再度招待メールを送信ください。​',
        },
        {
          type: 9,
          title: '招待メールを配信できません',
          msg:
            '選択したメールアドレスは<br>​すでに他の会計事務所と連携しているため招待できません。​<br>顧問先へ確認ください。',
        },
      ],
    }
  },
  computed: {},
  created() {},
  methods: {
    /**
     * エラータイトル、メッセージの取得
     *
     * @param {String} textType エラーテキスト
     * @return {String} エラータイトルorエラーメッセージ
     */
    getErrorData(textType) {
      return this.errorDataList.find((item) => item.type === this.errorType)[
        textType
      ]
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event イベントオブジェクト
     * @param {String} id イベントタイプ
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
    text-align: center;
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
