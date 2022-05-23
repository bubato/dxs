<template>
  <div class="timeline">
    <!-- main-contents -->
    <div v-if="!spTimeLineMode" class="main-contents">
      <div v-if="listViewMode" class="header flex">
        <h2 class="header-title">タイムライン</h2>
        <button class="btn-update" @click="resetGetTimeLine()">
          <ReplaySVG class="icon-replay" /><span>更新</span>
        </button>
      </div>
      <ToBackScreenLink
        v-if="!listViewMode"
        label="タイムラインへ戻る"
        link="/community/timeline/"
      />
      <RecommendProfileRegister
        v-if="isRecPrfReg"
        @close="closeRecommendProfileRegister()"
      />
      <PostTimeLine v-if="listViewMode" @update="mixin_getTimeLineList()" />
      <TimeLineList :all-view="true" :is-sp="spTimeLineMode" />
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
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/timeline', ['spTimeLineMode']),
  },
  created() {
    this.setListViewMode() // URLパラメータにpostIdがあれば、個別のタイムライン投稿表示モードに設定

    if (this.listViewMode) {
      this.resetGetTimeLine()
    } else {
      this.mixin_getPostTimeLineComment()
    }
  },
  mounted() {
    this.checkRecommendProfileRegister() // プロフィール登録画面誘導レコメンドの表示確認
  },
  methods: {
    ...mapMutations('community/timeline', [
      'resetSearchParam',
      'setSpTimeLineMode',
      'setPostEditMode',
    ]),
    /**
     * URLパラメータにpostIdがあれば、個別のタイムライン投稿表示モードに設定
     */
    setListViewMode() {
      if (this.$route.params.postId) {
        this.listViewMode = false
      } else {
        this.listViewMode = true
      }
    },
    /**
     * タイムラインの取得(逐次読み込みのリセット)
     *
     * タイムラインを更新する。(検索条件は初期化)
     */
    resetGetTimeLine() {
      this.resetSearchParam()
      this.mixin_getTimeLineList()
    },
    /**
     * プロフィール登録画面誘導レコメンドの表示確認
     * 自己紹介文、職歴、学歴（内2つ以上の登録なし）、表示不可フラグにて確認
     */
    checkRecommendProfileRegister() {
      let retain = 0

      retain += this.myProfile.selfIntroduction.selfIntroduction !== '' ? 1 : 0

      if (this.$common.checkArrayValue(this.myProfile.workHistory)) {
        const workHistoryKey = [
          'company',
          'hireDateEndMonth',
          'hireDateEndYear',
          'hireDateStartMonth',
          'hireDateStartYear',
          'position',
          'url',
        ]

        for (let i = 0; i < workHistoryKey.length; i++) {
          if (this.myProfile.workHistory[0][workHistoryKey[i]] !== '') {
            retain += 1
            break
          }
        }
      }

      if (this.$common.checkArrayValue(this.myProfile.educationalBackground)) {
        const educationalBackgroundKey = [
          'degree',
          'graduationMonth',
          'graduationYear',
          'schoolName',
          'underGraduate',
          'postDisplay',
        ]

        for (let i = 0; i < educationalBackgroundKey.length; i++) {
          if (
            this.myProfile.educationalBackground[0][
              educationalBackgroundKey[i]
            ] !== ''
          ) {
            retain += 1
            break
          }
        }
      }

      const recPrfPopupCancelFlg = localStorage.getItem(
        'communityTimelineRecommendProfileRegisterFlg'
      )

      if (retain < 2 && recPrfPopupCancelFlg !== '0') {
        this.isRecPrfReg = true
      } else {
        this.isRecPrfReg = false
      }
    },
    /**
     * プロフィール登録画面誘導レコメンド非表示処理
     */
    closeRecommendProfileRegister() {
      this.isRecPrfReg = false
    },
    /**
     * タイムライン編集画面の非表示(SP版)
     */
    closeSpTimeLine() {
      this.setPostEditMode(false)
      this.setSpTimeLineMode(false)
    },
  },
  head() {
    return {
      title: 'HOME｜コミュニティ｜bizskyDX',
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
      border-bottom: 1px solid #e5e5e5;
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
