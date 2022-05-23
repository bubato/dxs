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
            <h4>通報理由の記入</h4>
            <p class="context">
              投稿またはコメントについて不適切と感じた理由をお知らせください。
            </p>
          </div>
          <div class="modal_contents">
            <div class="form-block">
              <div class="form-item">
                <p class="title">理由</p>
                <CustomInputSelect
                  v-model="selectReasonCode"
                  :options="$common.getVersatileOptions(37)"
                />
              </div>
              <div class="form-item">
                <p class="title">詳細</p>
                <CustomInputTextarea
                  v-model="inputReportDetail"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'inputReportDetail')
                      .validation
                  "
                />
              </div>
            </div>
          </div>
          <div class="buttons">
            <button
              class="btn btn-middle btn-cancel"
              @click="closeModal($event, 'close')"
            >
              閉じる
            </button>
            <button
              class="btn btn-middle btn-basic"
              :class="{ 'btn-disabled': checkBtnDisabled() }"
              @click="exeReportReason()"
            >
              通報する
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'InputReasonForReportingModal',
  components: {},
  mixins: [communityCommonMixin],
  props: {},
  data() {
    return {
      dialogType: '', // post or comment
      reasonOptions: [],
      selectReasonCode: '01',
      inputReportDetail: '',
      formItems: [
        {
          id: 'inputReportDetail',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('community/timeline', ['selectTimeLineComment']),
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'inputReportDetail',
            this.inputReportDetail
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    if (this.selectTimeLineComment.postId) {
      this.dialogType = 'comment'
    } else {
      this.dialogType = 'post'
    }
  },
  methods: {
    /**
     * 通報するボタン押下処理
     */
    exeReportReason() {
      if (this.dialogType === 'post') {
        this.postReportReasonForPost()
      } else {
        this.postReportReasonForComment()
      }
    },
    /**
     * タイムライン投稿通報API
     */
    postReportReasonForPost() {
      const paramData = {
        postId: this.selectTimeLineComment.id,
        reportReasonCode: this.selectReasonCode,
        reportDetail: this.inputReportDetail,
      }

      this.$common.addCallApiNum()
      this.$api
        .postReportReasonForPost(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('close')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * タイムライン投稿通報API
     */
    postReportReasonForComment() {
      const paramData = {
        commentId: this.selectTimeLineComment.id,
        reportReasonCode: this.selectReasonCode,
        reportDetail: this.inputReportDetail,
      }

      this.$common.addCallApiNum()
      this.$api
        .postReportReasonForComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('close')
          } else {
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
@import '~assets/styles/scss/sp/mediaQuery.scss';
.modal-container {
  @include mq(pc) {
    width: 500px;
  }
  @include mq(sp) {
    width: 90%;
  }
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
    .context {
      margin-top: 8px;
      font-size: 13px;
    }
  }
  .modal_contents {
    .form-block {
      margin-top: 24px;
      .form-item {
        &:not(:first-child) {
          margin-top: 12px;
        }
        .title {
          margin-bottom: 8px;
        }
        ::v-deep .custom-input-textarea-block {
          height: 128px;
        }
      }
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
