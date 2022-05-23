<template>
  <div>
    <p class="backPage" @click="emitEvent">
      <KeyboardArrowLeft class="icon-keyboardArrowLeft" />タイムラインに戻る
    </p>
    <PostTimeLine
      :is-sp="true"
      @update="mixin_getTimeLineList()"
      @close="emitEvent()"
    />
  </div>
</template>

<script>
import PostTimeLine from '~/components/community/timeline/PostTimeLine.vue'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'SpPostingArea',
  components: { PostTimeLine },
  mixins: [communityCommonMixin],
  methods: {
    emitEvent() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
// MQ
@include mq(sp) {
  .timeline {
    .main-contents .header {
      padding-bottom: 0;
      padding: 0 16px;
    }
    .time-line {
      border-radius: 0;
    }
  }
  .header-title {
    font-size: 22px;
    margin: 32px 16px;
  }
  .post-time-line {
    padding: 0 16px;
    .time-line .post-block {
      padding: 20px 16px;
    }
  }
  .backPage {
    margin: 17px 15px 0;
    color: #007aff;
    display: inline-block;
  }
  .icon-keyboardArrowLeft {
    fill: #007aff;
    width: 24px;
    height: 24px;
  }
}
// MQ
</style>
