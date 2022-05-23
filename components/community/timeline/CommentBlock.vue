<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="comment-block">
    <p
      class="comment"
      v-html="
        getShowComment(commentComponent.comment, commentComponent.moreComment)
      "
    ></p>
    <p
      v-if="
        commentComponent.comment &&
        commentComponent.comment.split('\n').length > maxCommentRow
      "
      class="more-comment"
      @click="toggleMoreComment()"
    >
      <span v-if="!commentComponent.moreComment">もっと表示する</span>
      <span v-else>閉じる</span>
    </p>
    <ul v-if="$common.checkArrayValue(imgArray)" class="image-list">
      <li v-for="(img, index) in imgArray" :key="index">
        <img :src="img" />
      </li>
    </ul>
    <ul v-if="$common.checkArrayValue(movieArray)" class="movie-list">
      <li v-for="(movie, index) in movieArray" :key="index">
        <video :src="movie" controls />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CommentBlock',
  components: {},
  props: {
    commentComponent: { type: Object, required: true, default: () => {} },
    commentIds: { type: Object, required: true, default: () => {} },
  },
  data() {
    return {
      maxCommentRow: 5,
      imgArray: [],
      movieArray: [],
    }
  },
  computed: {
    ...mapState('community/timeline', ['timeLineList']),
    /**
     * 最大行数でコメントを表示
     *
     * @param {string} comment コメント
     */
    getShowComment() {
      return (comment, moreComment) => {
        let showComment = comment || ''

        showComment = this.$common.replaceLinkTag(showComment)

        if (!moreComment) {
          const commentRowArray = showComment.split('\n')
          const showCommentRowArray = commentRowArray.filter(
            (row, index) => index < this.maxCommentRow
          )
          showComment = showCommentRowArray.join('<br />')
        } else {
          showComment = showComment.replace(/\n/g, '<br/>')
        }

        return showComment
      }
    },
  },
  watch: {
    commentComponent() {
      this.setImageMovieArray() // コメントから画像と動画のリンクを設定
    },
  },
  created() {
    this.setImageMovieArray() // コメントから画像と動画のリンクを設定
  },
  methods: {
    ...mapMutations('community/timeline', ['setTimeLineList']),
    /**
     * コメントから画像と動画のリンクを設定
     */
    setImageMovieArray() {
      const urls = this.$common.getUrlInStr(this.commentComponent.comment)

      this.imgArray = this.$common.getTargetMediaUrls(urls, 'img')
      this.movieArray = this.$common.getTargetMediaUrls(urls, 'movie')
    },
    /**
     * コメントのもっと見るボタン押下処理
     */
    toggleMoreComment() {
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      let targetComment = {}
      const targetPostIndex = newTimeLineList.findIndex(
        (data) => data.id === this.commentIds.postId
      )
      const targetCommentIndex = this.commentIds.commentId
        ? newTimeLineList[targetPostIndex].replyCommentList.findIndex(
            (data) => data.id === this.commentIds.commentId
          )
        : -1
      const targetChildCommentIndex = this.commentIds.childCommentId
        ? newTimeLineList[targetPostIndex].replyCommentList[
            targetCommentIndex
          ].replysCommentList.findIndex(
            (data) => data.id === this.commentIds.childCommentId
          )
        : -1

      if (targetPostIndex >= 0) {
        targetComment = newTimeLineList[targetPostIndex]
      }
      if (targetCommentIndex >= 0) {
        targetComment =
          newTimeLineList[targetPostIndex].replyCommentList[targetCommentIndex]
      }
      if (targetChildCommentIndex >= 0) {
        targetComment =
          newTimeLineList[targetPostIndex].replyCommentList[targetCommentIndex]
            .replysCommentList[targetChildCommentIndex]
      }

      targetComment.moreComment = !targetComment.moreComment

      this.setTimeLineList(newTimeLineList)
    },
  },
}
</script>

<style lang="scss" scoped>
.comment-block {
  .comment {
    margin-top: 4px;
  }
  .more-comment {
    font-size: 13px;
    color: #007aff;
    margin-top: 8px;
    margin-bottom: 4px;
    cursor: pointer;
  }
  .image-list {
    margin-top: 10px;
    li {
      &:not(:last-child) {
        margin-bottom: 5px;
      }
      img {
        max-width: 100%;
      }
    }
  }
  .movie-list {
    margin-top: 10px;
    li {
      &:not(:last-child) {
        margin-bottom: 5px;
      }
      video {
        width: 100%;
      }
    }
  }
}
</style>
