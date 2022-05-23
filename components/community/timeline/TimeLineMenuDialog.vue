<template>
  <div class="c-main">
    <ul v-if="dialogType === 'parentComment'" class="menu-list post-menu">
      <template v-if="myProfile.userId === userId">
        <li @click="editPostTimeLine()">投稿を編集する</li>
        <li class="txt-alert" @click="showDeleteTimeLineCommentModal()">
          投稿を削除する
        </li>
      </template>
      <template v-else>
        <li @click="showInputReasonForReportingModal()">投稿を通報する</li>
      </template>
    </ul>
    <ul v-if="dialogType === 'childComment'" class="menu-list comment-menu">
      <template v-if="myProfile.userId === userId">
        <li @click="editTimeLineChildComment()">コメントを編集する</li>
        <li class="txt-alert" @click="showDeleteTimeLineChildCommentModal()">
          コメントを削除する
        </li>
      </template>
      <template v-else>
        <li @click="showInputReasonForReportingModal()">コメントを通報する</li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'TimeLineMenuDialog',
  props: {
    dialogType: {
      type: String,
      default: '',
      required: false,
    },
    userId: { type: Number, required: true, default: null },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
  },
  created() {},
  methods: {
    ...mapMutations('community/timeline', [
      'setShowEditTimeLineCommentModalState',
      'setShowDeleteTimeLineCommentModalState',
      'setShowDeleteTimeLineChildCommentModalState',
      'setPostEditMode',
      'setSpTimeLineMode',
      'setShowInputReasonForReportingModalState',
    ]),
    /**
     * 投稿内容を編集
     * PC表示の場合は、投稿内容編集モーダルを表示 SP表示の場合は、投稿編集画面に遷移
     */
    editPostTimeLine() {
      if (this.$mq === 'lg') {
        this.showEditTimeLineCommentModal()
      } else {
        this.setPostEditMode(true)
        this.setSpTimeLineMode(true)
        this.$emit('close')
      }
    },
    /**
     * タイムライン投稿編集モーダルの表示
     */
    showEditTimeLineCommentModal() {
      this.setShowEditTimeLineCommentModalState(true)
      this.$emit('close')
    },
    /**
     * タイムライン投稿削除モーダルの表示
     */
    showDeleteTimeLineCommentModal() {
      this.setShowDeleteTimeLineCommentModalState(true)
      this.$emit('close')
    },
    /**
     * 投稿コメントの修正
     */
    editTimeLineChildComment() {
      this.$emit('edit')
      this.$emit('close')
    },
    /**
     * 投稿コメントの削除モーダルの表示
     */
    showDeleteTimeLineChildCommentModal() {
      this.setShowDeleteTimeLineChildCommentModalState(true)
      this.$emit('close')
    },
    /**
     * 通報理由記入モーダルの表示
     */
    showInputReasonForReportingModal() {
      this.setShowInputReasonForReportingModalState(true)
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.c-main {
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 24px 16px;
  background: #ffffff;
  .menu-list {
    li {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &.txt-alert {
        color: #e60012;
      }
    }
  }
}
</style>
