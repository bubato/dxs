<template>
  <div class="recPrfReg">
    <CancelSVG
      class="btn-close icon-cancel"
      @click="closeAera()"
      @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <h3 class="recPrfReg-title">
      プロフィールを<br class="is-sp" />充実させましょう
    </h3>
    <p class="recPrfReg-text">
      プロフィールを充実させると色々な人に興味を持ってもらえます。<br />職歴や学歴、資格情報などビジネスにつながりやすい情報を登録しましょう。
    </p>
    <div class="recPrfReg-footer">
      <button
        class="btn btn-primary btn-long"
        @click="showProfileSettingsPage()"
      >
        プロフィールを編集
      </button>
      <label for="checkBox">
        <input
          id="checkBox"
          type="checkbox"
          class="input-checkbox"
          @click="recPrfRegNotShowAgain($event.target.checked)"
        />
        <span>次回から表示しない</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendProfileRegister',
  components: {},
  props: {
    isSP: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * プロフィール編集コンポーネントに遷移
     */
    showProfileSettingsPage() {
      this.$common.initScrollTop()
      this.$router.push('/community/profile/edit/')
    },
    /**
     * 次回から表示しないフラグををローカルストレージへ保存
     *
     * @param {Boolean} checked 次回から表示しないチェックボックス値
     */
    recPrfRegNotShowAgain(checked) {
      if (checked) {
        localStorage.setItem(
          'communityTimelineRecommendProfileRegisterFlg',
          '0'
        )
      } else {
        localStorage.setItem(
          'communityTimelineRecommendProfileRegisterFlg',
          '1'
        )
      }
    },
    /**
     * 閉じるボタン押下で、エリア削除
     */
    closeAera() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.recPrfReg {
  position: relative;
  background-color: #f7f8f9;
  margin-bottom: 12px;
  margin-top: 12px;
  padding: 24px;
  border-radius: 6px;
  .btn-close {
    position: absolute;
    top: 18px;
    right: 18px;
  }
  &-title {
    margin-bottom: 8px;
  }
  &-text {
    margin-bottom: 32px;
  }
  &-footer {
    span {
      padding-left: 31px;
    }
  }
}

// MQ
@include mq(pc) {
  .recPrfReg {
    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
}
@include mq(sp) {
  .recPrfReg {
    &-text {
      margin-bottom: 24px;
    }
    &-footer {
      display: flex;
      flex-wrap: wrap;
      .btn {
        margin-bottom: 8px;
        order: 2;
      }
      label {
        margin-bottom: 35px;
      }
    }
  }
}
// MQ
</style>
