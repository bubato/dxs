<template>
  <div class="reply-comment-nav">
    <CommentSVG class="icon-comment" @click="showCommentArea()" />
    <span>{{ replyCommentNum }}</span>
  </div>
</template>

<script>
export default {
  name: 'ReplyCommentNav',
  components: {},
  props: {
    replyCommentNum: { type: Number, required: true, default: null },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * コメントエリアの表示
     */
    showCommentArea() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.reply-comment-nav {
  display: flex;
  align-items: center;
  margin-top: 18px;
  .icon-comment {
    cursor: pointer;
  }
  span {
    font-size: 13px;
    margin-left: 8px;
    color: #8d8d8d;
  }
}
</style>
