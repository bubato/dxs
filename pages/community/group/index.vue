<template>
  <div class="timeline">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header flex">
        <h2 class="header-title">最近のグループ投稿</h2>
        <button class="btn-update" @click="resetGetTimeLine()">
          <ReplaySVG class="icon-replay" /><span>更新</span>
        </button>
      </div>
      <JoinGroupList v-if="isPCSize === false" />
      <TimeLineList
        :all-view="true"
        :is-sp="spTimeLineMode"
        :time-line-type="1"
      />
    </div>
    <!-- /main-contents -->

    <!-- main-contents_SP -->
    <div v-if="spTimeLineMode" class="main-contents">
      <SpPostingArea @close="closeSpTimeLine()" />
    </div>
    <!-- /main-contents_SP -->
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  layout: 'community',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      listViewMode: null,
      isRecPrfReg: false,
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile', 'isPCSize']),
    ...mapState('community/timeline', ['spTimeLineMode']),
  },
  created() {
    this.resetGetTimeLine()
  },
  mounted() {},
  methods: {
    ...mapMutations('community/timeline', [
      'resetSearchParam',
      'setSpTimeLineMode',
      'setPostEditMode',
    ]),
    /**
     * タイムラインの取得(逐次読み込みのリセット)
     *
     * タイムラインを更新する。(検索条件は初期化)
     */
    resetGetTimeLine() {
      this.resetSearchParam()
      this.mixin_getPostGroupRecentTimeLine()
    },
  },
  head() {
    return {
      title: '最近のグループ投稿｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.timeline {
  .main-contents {
    width: 716px;
    margin: 0 auto;
    .header {
      padding-bottom: 20px;
      @include mq(pc) {
        border-bottom: 1px solid #e5e5e5;
      }
    }
  }
  .btn-update {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 16px;
    width: 70px;
    height: 32px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    & > *:nth-of-type(1) {
      margin: 0 4px 0 0;
    }
    & > *:nth-of-type(2) {
      margin: 0 0 0 4px;
    }
    svg {
      width: 17px;
      height: 17px;
      fill: #3a435c;
    }
  }
}
// MQ
@include mq(sp) {
  .timeline {
    .main-contents {
      width: 100%;
    }
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
}
// MQ
</style>
