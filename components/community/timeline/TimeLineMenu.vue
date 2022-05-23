<template>
  <div class="timeline-menu">
    <button
      class="btn-menu"
      @click="showEditTimeLineMenu()"
      @mouseover="$common.setAreaLabel($event, 'top', 'メニュー')"
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    >
      <MoreHorizSVG class="icon-moreHoriz" />
    </button>
    <TimeLineMenuDialog
      v-if="selectCommentId === commentInfo.id"
      v-on-clickaway="resetSelectComment"
      class="menu-dialog"
      :dialog-type="dialogType"
      :user-id="userId"
      @edit="editTimeLineChildComment()"
      @close="resetSelectComment()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'ReplyCommentNav',
  components: {},
  mixins: [clickaway],
  props: {
    userId: { type: Number, required: true, default: null },
    postId: { type: Number, required: false, default: null },
    commentId: { type: Number, required: false, default: null },
    commentInfo: { type: Object, required: true, default: () => {} },
    dialogType: { type: String, required: true, default: '' },
  },
  data() {
    return {
      selectCommentId: null,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
  },
  created() {},
  methods: {
    ...mapMutations('community/timeline', ['setSelectTimeLineComment']),
    /**
     * 選択したコメント情報を保持し、タイムライン編集ダイアログの表示
     */
    showEditTimeLineMenu() {
      const targetCommentInfo = JSON.parse(JSON.stringify(this.commentInfo))

      targetCommentInfo.postId = this.postId
      targetCommentInfo.commentId = this.commentId

      this.setSelectTimeLineComment(targetCommentInfo)
      this.selectCommentId = this.commentInfo.id
    },
    /**
     * タイムラインインデックスの初期化
     */
    resetSelectComment() {
      this.selectCommentId = null
    },
    /**
     * コメント編集モードに切り替え
     */
    editTimeLineChildComment() {
      this.$emit('edit', this.commentInfo.id)
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
