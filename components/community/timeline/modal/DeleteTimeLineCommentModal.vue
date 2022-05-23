<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <WarningSVG class="icon icon-warning" />
            <h4>投稿の削除</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              選択した投稿を削除しますか?<br />
              一度削除した投稿は元に戻せません。
            </p>
            <div class="buttons">
              <button
                class="btn btn-middle btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
              </button>
              <button
                class="btn btn-middle btn-basic"
                @click="deleteTimeLineComment()"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'DeleteTimeLineCommentModal',
  components: {},
  mixins: [communityCommonMixin],
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('community/timeline', [
      'selectTimeLineComment',
      'timeLineList',
    ]),
  },
  created() {},
  methods: {
    ...mapMutations('community/timeline', ['setTimeLineList']),
    /**
     * タイムライン投稿の削除
     */
    deleteTimeLineComment() {
      const paramData = {
        postId: this.selectTimeLineComment.id,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteTimeLineComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setTargetPostCommentDeleteFlg() // 投稿の削除フラグを設定
            this.$emit('close')
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
     * 投稿の削除フラグを設定
     */
    setTargetPostCommentDeleteFlg() {
      const targetPostId = this.selectTimeLineComment.id
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))

      for (let i = 0; i < newTimeLineList.length; i++) {
        if (newTimeLineList[i].id === targetPostId) {
          newTimeLineList[i].deleteFlag = true
          break
        }
      }

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 404px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      fill: #ffcc00;
    }
  }
  .modal_contents {
    margin-top: 24px;
    .input-tag {
      .btn {
        margin-top: 12px;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
