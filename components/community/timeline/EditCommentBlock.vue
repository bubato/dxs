<template>
  <div class="edit-comment">
    <CustomInputTextarea
      v-model="inputComment"
      placeholder="コメントを投稿できます"
      class="input-comment-textarea"
      maxlength="2000"
      :validation="
        $common.getFormItemsDetail(formItems, 'inputComment').validation
      "
    />
    <div class="buttons">
      <button
        class="btn btn-cancel btn-short"
        @click="hideEditTimeLineCommentModal()"
      >
        キャンセル
      </button>
      <button
        class="btn btn-basic btn-short"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="updateTimeLineChildComment()"
      >
        保存
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'CommentBlock',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    selectComment: {
      type: Object,
      default: () => {},
      required: true,
    },
    postId: {
      type: Number,
      default: null,
      required: true,
    },
    commentId: {
      type: Number,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      inputComment: '',
      formItems: [
        {
          id: 'inputComment',
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
    ...mapState('community/timeline', ['timeLineList']),
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'inputComment',
            this.inputComment
          ) ||
          !this.inputComment
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.inputComment = this.selectComment.comment
  },
  methods: {
    /**
     * 投稿コメントの更新
     */
    updateTimeLineChildComment() {
      const paramData = {
        commentId: this.selectComment.id,
        comment: this.inputComment,
        recordVersion: this.selectComment.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateTimeLineChildComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setEditTargetCommentScreen(resData.data.recordVersion)
            this.$emit('cancel')
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
     *
     * @param {number} newRecordVersion 新しいレコードバージョン
     */
    setEditTargetCommentScreen(newRecordVersion) {
      const targetPostId = this.postId
      const targetCommentId = this.commentId
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
          (data) => data.id === this.selectComment.id
        )
      } else {
        editComment = targetPostComment.replyCommentList.find(
          (data) => data.id === this.selectComment.id
        )
      }

      editComment.comment = this.inputComment
      editComment.recordVersion = newRecordVersion

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * コメント編集モードの解除
     */
    hideEditTimeLineCommentModal() {
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-comment {
  .input-comment-textarea {
    height: 134px;
  }
  .buttons {
    display: flex;
    align-items: center;
    margin-top: 12px;
    .btn {
      &:not(:first-child) {
        margin-left: 8px;
      }
    }
  }
}
</style>
