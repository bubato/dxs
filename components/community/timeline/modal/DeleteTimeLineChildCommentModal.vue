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
            <WarningSVG class="icon icon-warning" />
            <h4>コメントの削除</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              選択したコメントを削除しますか?<br />
              一度削除したコメントは元に戻せません。
            </p>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
              </button>
              <button
                class="btn btn-middle btn-basic"
                @click="deleteTimeLineChildComment()"
              >
                削除する
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
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'DeleteTimeLineChildCommentModal',
  components: {},
  mixins: [communityCommonMixin],
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('community/timeline', ['selectTimeLineComment']),
  },
  created() {},
  methods: {
    /**
     * 投稿コメントの削除
     */
    deleteTimeLineChildComment() {
      const paramData = {
        commentId: this.selectTimeLineComment.id,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteTimeLineChildComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setTargetCommentDeleteFlg()
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
     * コメントの削除フラグを設定
     */
    setTargetCommentDeleteFlg() {
      const targetPostId = this.selectTimeLineComment.postId
      const targetCommentId = this.selectTimeLineComment.commentId
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      const targetPostComment = newTimeLineList.find(
        (data) => data.id === targetPostId
      )
      let editComment = {}

      if (targetCommentId) {
        const targetComment = targetPostComment.replyCommentList.find(
          (data) => data.id === targetCommentId
        )
        editComment = targetComment.replysCommentList.find(
          (data) => data.id === this.selectTimeLineComment.id
        )
      } else {
        editComment = targetPostComment.replyCommentList.find(
          (data) => data.id === this.selectTimeLineComment.id
        )
      }

      editComment.deleteFlag = true

      this.setTimeLineList(newTimeLineList)
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
  width: 404px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      fill: #ffcc00;
    }
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
