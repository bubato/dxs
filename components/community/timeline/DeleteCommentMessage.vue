<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="delete-comment-message"
    :class="[
      { 'type-post': type === 0 },
      { 'type-comment': type === 1 },
      { 'type-message': type === 2 },
    ]"
  >
    <DeleteForeverSVG class="icon-deleteForever" />
    <p v-html="message" />
  </div>
</template>

<script>
export default {
  name: 'DeleteCommentMessage',
  components: {},
  props: {
    type: { type: Number, required: false, default: 0 }, // 0:投稿 1:コメント 2:メッセージ
    message: { type: String, required: false, default: '' },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.delete-comment-message {
  display: flex;
  align-items: center;
  justify-content: center;
  @include mq(pc) {
    border-radius: 6px;
    border: 1px solid #e5e5e5;
  }
  &.type-post {
    height: 80px;
    padding: 24px;
    @include mq(sp) {
      border-bottom: 1px solid #e5e5e5;
    }
  }
  &.type-comment {
    height: 64px;
    @include mq(sp) {
      border-radius: 6px;
      border: 1px solid #e5e5e5;
    }
  }
  &.type-message {
    height: 80px;
    padding: 24px;
    @include mq(sp) {
      border-radius: 6px;
      border: 1px solid #e5e5e5;
    }
  }
  .icon-deleteForever {
    width: 32px;
    height: 32px;
    fill: #8d8d8d;
    cursor: default;
  }
  p {
    color: #8d8d8d;
    margin-left: 18px;
  }
}
</style>
