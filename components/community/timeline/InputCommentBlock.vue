<template>
  <div class="input-comment-block">
    <div class="images">
      <img
        :src="$common.getProfileImg(myProfile.basicSetting.profileImage)"
        @click="showSelectUserProfile(myProfile.userId)"
      />
    </div>
    <div class="input-comment">
      <CustomInputTextarea
        v-model="inputComment"
        placeholder="コメントを投稿できます"
        class="input-comment-textarea"
        maxlength="2000"
        :height-variable="true"
        :validation="
          $common.getFormItemsDetail(formItems, 'inputComment').validation
        "
      />
      <!-- eslint-disable -->
      <button
        class="btn btn-utility"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="postApi()"
      >
        送信
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'InputCommentBlock',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    placeholder: { type: String, required: false, default: '' },
    postId: { type: Number, required: false, default: null },
    commentId: { type: Number, required: false, default: null },
    propType: { type: Number, required: false, default: null },
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
    ...mapState('community/common', ['myProfile']),
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
  created() {},
  methods: {
    ...mapMutations('community/timeline', ['setTimeLineList']),
    /**
     * APIの呼び出し分岐
     */
    postApi() {
      if (this.propType === 1) {
        this.postReplyComment()
      } else if (this.propType === 2) {
        this.postReplyChildComment()
      }
    },
    /**
     * 投稿コメントAPIの呼び出し
     */
    postReplyComment() {
      const paramData = {}

      paramData.postId = this.postId
      paramData.comment = this.inputComment

      this.$common.addCallApiNum()
      this.$api
        .postReplyComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.inputComment = '' // 入力値のクリア
            const newTimeLineList = JSON.parse(
              JSON.stringify(this.timeLineList)
            )

            for (let i = 0; i < newTimeLineList.length; i++) {
              if (newTimeLineList[i].id === this.postId) {
                this.addTimeLineData(
                  newTimeLineList[i].replyCommentList,
                  paramData,
                  resData.data.commentId,
                  resData.data.recordVersion
                )
                break
              }
            }

            this.setTimeLineList(newTimeLineList)
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
     * 投稿内容を画面に反映
     *
     * @param {object[]} replyCommentList コメント返信リスト
     * @param {object} paramData リクエストパラメータ
     * @param {number} commentId コメントID
     * @param {number} recordVersion レコードバージョン
     */
    addTimeLineData(replyCommentList, paramData, commentId, recordVersion) {
      const addData = {
        parentId: paramData.id,
        id: commentId,
        userId: this.myProfile.userId,
        image: this.myProfile.basicSetting.profileImage,
        contributor:
          this.myProfile.basicSetting.lastName +
          ' ' +
          this.myProfile.basicSetting.firstName,
        diffDate: '1時間前',
        comment: paramData.comment,
        replysCommentList: [],
        recordVersion,
      }

      replyCommentList.push(addData)
    },
    /**
     * コメント返信APIの呼び出し
     */
    postReplyChildComment() {
      const paramData = {}

      paramData.postId = this.postId
      paramData.id = this.commentId
      paramData.comment = this.inputComment

      this.$common.addCallApiNum()
      this.$api
        .postReplyChildComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.inputComment = '' // 入力値のクリア
            const newTimeLineList = JSON.parse(
              JSON.stringify(this.timeLineList)
            )
            const parentPostComment = newTimeLineList.find(
              (data) => data.id === this.postId
            )

            if (parentPostComment.replyCommentList.length > 0) {
              for (
                let i = 0;
                i < parentPostComment.replyCommentList.length;
                i++
              ) {
                if (
                  parentPostComment.replyCommentList[i].id === this.commentId
                ) {
                  this.addTimeLineData(
                    parentPostComment.replyCommentList[i].replysCommentList,
                    paramData,
                    resData.data.commentId,
                    resData.data.recordVersion
                  )
                  break
                }
              }
            }

            this.setTimeLineList(newTimeLineList)
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
     * 選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
  },
}
</script>

<style lang="scss" scoped>
.input-comment-block {
  display: flex;
  align-items: center;
  .images {
    width: 48px;
    height: 48px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .input-comment {
    position: relative;
    width: 100%;
    margin-left: 8px;
    .btn {
      position: absolute;
      right: 8px;
      bottom: 8px;
      margin: auto;
    }
  }
}
</style>
