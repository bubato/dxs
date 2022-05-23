<template>
  <div class="time-line-list">
    <ul>
      <li
        v-for="(parentComment, index1) in getShowTimeLineList()"
        :key="index1"
        class="time-line"
      >
        <template v-if="parentComment.policyViolationFlag === 1">
          <DeleteCommentMessage
            message="この投稿はポリシーに違反する内容が含まれていたため表示できません。"
          />
        </template>
        <template v-else-if="!parentComment.deleteFlag">
          <div class="post-block">
            <PostProfileBlock
              v-if="timeLineType === 0 && !parentComment.postGroupName"
              :parent-comment="parentComment"
            />
            <PostGroupProfileBlock
              v-else
              :parent-comment="parentComment"
              :time-line-type="timeLineType"
            />
            <TimeLineMenu
              :user-id="parentComment.userId"
              :comment-info="parentComment"
              dialog-type="parentComment"
            />
            <div class="post-content">
              <p v-if="parentComment.title" class="title">
                {{ parentComment.title }}
              </p>
              <CommentBlock
                :comment-component="{
                  comment: parentComment.comment,
                  moreComment: parentComment.moreComment,
                }"
                :comment-ids="{
                  postId: parentComment.id,
                }"
                class="comment"
              />
              <img
                v-if="parentComment.imgFilePath"
                :src="$common.getProfileImg(parentComment.imgFilePath)"
                class="image"
              />
            </div>
            <template
              v-if="$common.checkArrayValue(parentComment.ogpInformation)"
            >
              <template v-for="ogpData in parentComment.ogpInformation">
                <OgpTemplate
                  :key="ogpData.inputUrl"
                  :ogp-data="ogpData"
                  :edit-comment="parentComment.userId === myProfile.userId"
                  :image-size="{
                    pcSize: '140',
                    spSize: '120',
                  }"
                  :is-description="{
                    pc: true,
                    sp: false,
                  }"
                  class="ogp"
                  @delete="deleteTimelineOwnOgp(ogpData, parentComment)"
                />
              </template>
            </template>
            <div class="nav-icon">
              <GoodCommentNav
                :post-id="parentComment.id"
                :good-comment-num="parentComment.goodNum"
                :good-comment-flg="parentComment.goodFlag"
                @update="updateShowGoodNum($event)"
              />
              <ReplyCommentNav
                :reply-comment-num="
                  getReplyCommentNum(parentComment.replyCommentList)
                "
                @click="toggleMoreComment(parentComment.id)"
              />
            </div>
          </div>
          <InputCommentBlock
            :post-id="parentComment.id"
            :prop-type="1"
            class="input-comment-area"
            placeholder="コメントを入力"
          />
        </template>
        <template v-else>
          <DeleteCommentMessage message="この投稿は削除されました。" />
        </template>
        <ul
          v-if="
            !parentComment.deleteFlag &&
            $common.checkArrayValue(parentComment.replyCommentList)
          "
          v-show="parentComment.showMoreCommentFlg"
        >
          <li
            v-for="(
              replyParentComment, index2
            ) in parentComment.replyCommentList"
            :key="index2"
            class="replay-comment-block"
          >
            <template v-if="replyParentComment.policyViolationFlag === 1">
              <DeleteCommentMessage
                message="このコメントはポリシーに違反する内容が含まれていたため表示できません。"
              />
            </template>
            <template v-else-if="!replyParentComment.deleteFlag">
              <div class="replay-comment flex">
                <TimeLineMenu
                  :user-id="replyParentComment.userId"
                  :post-id="parentComment.id"
                  dialog-type="childComment"
                  :comment-info="replyParentComment"
                  @edit="editTimeLineChildComment($event)"
                />
                <div
                  class="profile-image"
                  @click="showSelectUserProfile(replyParentComment.userId)"
                >
                  <img :src="$common.getProfileImg(replyParentComment.image)" />
                </div>
                <div class="replay-comment-content">
                  <EditCommentBlock
                    v-if="editCommentId === replyParentComment.id"
                    :post-id="parentComment.id"
                    :select-comment="replyParentComment"
                    @cancel="cancelEditComment()"
                  />
                  <div v-else class="comment-reference">
                    <p class="contributor">
                      {{ replyParentComment.contributor }}
                    </p>
                    <CommentBlock
                      :comment-component="{
                        comment: replyParentComment.comment,
                        moreComment: replyParentComment.moreComment,
                      }"
                      :comment-ids="{
                        postId: parentComment.id,
                        commentId: replyParentComment.id,
                      }"
                    />
                  </div>
                </div>
              </div>
              <p class="diff-date">{{ replyParentComment.diffDate }}</p>
              <p
                v-if="
                  $common.checkArrayValue(replyParentComment.replysCommentList)
                "
                class="more-comment"
                @click="
                  toggleMoreChildComment(
                    parentComment.id,
                    replyParentComment.id
                  )
                "
              >
                <span v-if="!replyParentComment.showMoreChildCommentFlg"
                  >もっと返信を表示</span
                >
                <span v-else>コメントを閉じる</span>
              </p>
            </template>
            <template v-else>
              <DeleteCommentMessage message="このコメントは削除されました。" />
            </template>
            <ul
              v-if="
                $common.checkArrayValue(replyParentComment.replysCommentList) &&
                replyParentComment.showMoreChildCommentFlg &&
                !replyParentComment.deleteFlag
              "
            >
              <li
                v-for="(
                  replyChildComment, index3
                ) in replyParentComment.replysCommentList"
                :key="index3"
                class="reply-child-comment-block"
              >
                <template v-if="replyChildComment.policyViolationFlag === 1">
                  <DeleteCommentMessage
                    message="このコメントはポリシーに違反する内容が含まれていたため表示できません。"
                  />
                </template>
                <template v-else-if="!replyChildComment.deleteFlag">
                  <div class="replay-comment flex">
                    <TimeLineMenu
                      :user-id="replyChildComment.userId"
                      :post-id="parentComment.id"
                      :comment-id="replyParentComment.id"
                      :comment-info="replyChildComment"
                      dialog-type="childComment"
                      @edit="editTimeLineChildComment($event)"
                    />
                    <div
                      class="profile-image"
                      @click="showSelectUserProfile(replyChildComment.userId)"
                    >
                      <img
                        :src="$common.getProfileImg(replyChildComment.image)"
                      />
                    </div>
                    <div class="replay-comment-content">
                      <EditCommentBlock
                        v-if="editCommentId === replyChildComment.id"
                        :post-id="parentComment.id"
                        :comment-id="replyParentComment.id"
                        :select-comment="replyChildComment"
                        @cancel="cancelEditComment()"
                      />
                      <div v-else class="comment-reference">
                        <p class="contributor">
                          {{ replyChildComment.contributor }}
                        </p>
                        <CommentBlock
                          :comment-component="{
                            comment: replyChildComment.comment,
                            moreComment: replyChildComment.moreComment,
                          }"
                          :comment-ids="{
                            postId: parentComment.id,
                            commentId: replyParentComment.id,
                            childCommentId: replyChildComment.id,
                          }"
                        />
                      </div>
                    </div>
                  </div>
                  <p class="diff-date">{{ replyChildComment.diffDate }}</p>
                </template>
                <template v-else>
                  <DeleteCommentMessage
                    message="このコメントは削除されました。"
                  />
                </template>
              </li>
            </ul>
            <InputCommentBlock
              v-if="!replyParentComment.deleteFlag"
              :post-id="parentComment.id"
              :comment-id="replyParentComment.id"
              :prop-type="2"
              class="input-comment-area"
              placeholder="コメントを入力"
            />
          </li>
        </ul>
      </li>
    </ul>
    <EditTimeLineCommentModal
      v-if="showEditTimeLineCommentModalState"
      :time-line-type="timeLineType"
      @close="setShowEditTimeLineCommentModalState(false)"
    />
    <InputReasonForReportingModal
      v-if="showInputReasonForReportingModalState"
      @close="setShowInputReasonForReportingModalState(false)"
    />
    <DeleteTimeLineCommentModal
      v-if="showDeleteTimeLineCommentModalState"
      @close="setShowDeleteTimeLineCommentModalState(false)"
    />
    <DeleteTimeLineChildCommentModal
      v-if="showDeleteTimeLineChildCommentModalState"
      @close="setShowDeleteTimeLineChildCommentModalState(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'
import InputCommentBlock from '~/components/community/timeline/InputCommentBlock.vue'

export default {
  name: 'TimeLineList',
  components: {
    InputCommentBlock,
  },
  mixins: [communityCommonMixin],
  props: {
    allView: {
      type: Boolean,
      default: false,
      required: false,
    },
    isSp: {
      type: Boolean,
      default: false,
      required: false,
    },
    timeLineType: {
      type: Number,
      default: 0, // 0:通常 1:グループ(最近投稿したグループ画面) 2:グループタイムライン
      required: false,
    },
  },
  data() {
    return {
      maxCommentRow: 5,
      selectCommentId: null,
      editCommentId: null,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/timeline', [
      'timeLineList',
      'showEditTimeLineCommentModalState',
      'showInputReasonForReportingModalState',
      'showDeleteTimeLineCommentModalState',
      'showDeleteTimeLineChildCommentModalState',
      'selectTimeLineComment',
    ]),
    getShowTimeLineList() {
      return () => {
        const showTimeLineList = this.timeLineList.filter((data) => {
          let result = true

          if (this.allView && data.deleteFlag && !this.$route.params.postId) {
            result = false
          }

          return result
        })

        return showTimeLineList
      }
    },
    /**
     * 投稿に紐づくコメント数の取得(削除コメントはカウントしない)
     */
    getReplyCommentNum() {
      return (replyCommentList) => {
        let replyCommentNum = 0

        for (let i = 0; i < replyCommentList.length; i++) {
          if (replyCommentList[i].deleteFlag) {
            continue
          } else {
            replyCommentNum++
          }

          if (replyCommentList[i].replysCommentList) {
            replyCommentNum += replyCommentList[i].replysCommentList.filter(
              (data) => !data.deleteFlag
            ).length
          }
        }

        return replyCommentNum
      }
    },
  },
  created() {
    this.resetSelectTimeLineInfo()
  },
  mounted() {},
  methods: {
    ...mapMutations('community/timeline', [
      'resetSelectTimeLineInfo',
      'setTimeLineList',
      'setSelectTimeLineComment',
      'setShowEditTimeLineCommentModalState',
      'setShowInputReasonForReportingModalState',
      'setShowDeleteTimeLineCommentModalState',
      'setShowDeleteTimeLineChildCommentModalState',
    ]),
    /**
     * 投稿コメントの展開
     *
     * @param {number} postId 投稿ID
     */
    toggleMoreComment(postId) {
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      const targetIndex = newTimeLineList.findIndex(
        (data) => data.id === postId
      )

      if (targetIndex >= 0) {
        newTimeLineList[targetIndex].showMoreCommentFlg = !newTimeLineList[
          targetIndex
        ].showMoreCommentFlg
      }

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * 投稿コメントのコメントの展開
     *
     * @param {number} postId 投稿ID
     * @param {number} commentId コメントID
     */
    toggleMoreChildComment(postId, commentId) {
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      const targetPostIndex = newTimeLineList.findIndex(
        (data) => data.id === postId
      )
      const targetCommentIndex = newTimeLineList[
        targetPostIndex
      ].replyCommentList.findIndex((data) => data.id === commentId)

      newTimeLineList[targetPostIndex].replyCommentList[
        targetCommentIndex
      ].showMoreChildCommentFlg = !newTimeLineList[targetPostIndex]
        .replyCommentList[targetCommentIndex].showMoreChildCommentFlg

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * タイムラインの場合はOGP削除APIにてコメント削除
     *
     * @param {Object} ogpData OGPデータ
     * @param {Number} id 投稿ID
     */
    deleteTimelineOwnOgp(ogpData, postLineItem) {
      const paramData = {
        postId: postLineItem.id,
        inputUrl: ogpData.inputUrl,
        recordVersion: postLineItem.recordVersion,
      }
      this.$common.addCallApiNum()
      this.$api
        .deleteTimelineOwnOgp(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            // 成功 タイムライン更新
            this.deleteOgpScreen(
              postLineItem.id,
              ogpData.inputUrl,
              resData.data.recordVersion
            )
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
     * 画面に表示しているOGP情報を削除
     *
     * @param {number} postId 投稿ID
     * @param {string} targetUrl OGPのURL
     */
    deleteOgpScreen(postId, targetUrl, newRecordVersion) {
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      const targetPostComment = newTimeLineList.find(
        (data) => data.id === postId
      )
      targetPostComment.ogpInformation = targetPostComment.ogpInformation.filter(
        (data) => data.inputUrl !== targetUrl
      )
      targetPostComment.recordVersion = newRecordVersion

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     * @param {Number} userId userId
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
    /**
     * コメントリストを表示
     * @param {Number} id コメントid
     */
    showReplyComment(id) {
      if (this.showChildCommentIds.includes(id)) {
        const index = this.showChildCommentIds.indexOf(id)
        this.showChildCommentIds.splice(index, 1)
      } else {
        this.showChildCommentIds.push(id)
      }
    },
    /**
     * コメント編集モードに切り替え
     *
     * @param {number} commentId コメントID
     */
    editTimeLineChildComment(commentId) {
      this.editCommentId = commentId
    },
    /**
     * コメント参照モードに切り替え
     */
    cancelEditComment() {
      this.editCommentId = null
    },
    /**
     * 画面上のいいね数の更新
     */
    updateShowGoodNum(goodNumData) {
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      const targetPostComment = newTimeLineList.find(
        (data) => data.id === goodNumData.postId
      )
      targetPostComment.goodNum = goodNumData.newGoodNum
      targetPostComment.goodFlag = goodNumData.newGoodFlag

      this.setTimeLineList(newTimeLineList)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.time-line-list {
  width: 716px;
  margin: 0 auto;
  margin-top: 30px;
  .time-line {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
    .post-block {
      padding: 20px 24px;
      position: relative;
      .post-content {
        margin-top: 18px;
        .title {
          font-size: 20px;
          font-weight: 500;
        }
        .comment {
          margin-top: 4px;
        }
        .profile-image {
          margin-top: 16px;
        }
        .image {
          max-width: 100%;
          margin-top: 4px;
        }
      }
    }

    .nav-icon {
      display: flex;
      align-items: center;
      > * {
        &:not(:first-child) {
          margin-left: 24px;
        }
      }
    }

    > .input-comment-area {
      padding: 16px 24px;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    .replay-comment-block {
      padding: 12px 24px 24px 24px;
      &:not(:last-child) {
        border-bottom: 1px solid #e5e5e5;
      }

      .replay-comment {
        position: relative;
        .replay-comment-content {
          flex: 1;
          margin-left: 16px;
          padding: 12px;
          background: #f0f2f5;
          border-radius: 4px;
          .contributor {
            font-weight: 500;
          }
        }
      }

      .more-comment {
        font-size: 13px;
        color: #007aff;
        margin: 8px 0 0 64px;
        cursor: pointer;
      }

      .reply-child-comment-block {
        margin: 16px 0 0 64px;
      }
      ::v-deep .delete-comment-message {
        margin-left: 64px;
      }

      .diff-date {
        font-size: 13px;
        color: #8d8d8d;
        margin: 4px 0 0 64px;
      }

      .input-comment-area {
        margin-top: 16px;
        margin-left: 64px;
      }
    }

    .timeline-menu {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 10;
      .btn-menu {
        cursor: pointer;
      }
    }
    .profile-image {
      width: 48px;
      height: 48px;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
  }
}

// MQ
@include mq(sp) {
  .time-line-list {
    width: 100%;
  }
  .time-line-list .time-line {
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
  }
  .time-line-list .time-line > .input-comment-area {
    border-top: none;
  }
  .post-content .image {
    width: 100%;
    height: auto;
  }
  .time-line-list .time-line .replay-comment-block .input-comment-area {
    margin-left: 0;
  }
}
// MQ
</style>
