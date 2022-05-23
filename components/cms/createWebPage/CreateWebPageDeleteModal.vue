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
            <h4><AttentionSVG class="icon-attention" />ページの削除</h4>
            <p>
              選択したページを削除しますか？<br />
              一度削除したページは元に戻せん。<br />
              また、選択したページに子ぺージが存在する場合は子ページも一緒に削除されます。
            </p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-middle"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button class="btn btn-basic btn-middle" @click="deleteWebPage()">
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CreateWebPageDeleteModal',
  components: {},
  props: {
    selectPageId: {
      type: Number,
      require: true,
      default: null,
    },
    siteInfoRecordVersion: {
      type: Number,
      require: true,
      default: null,
    },
    pageRecordVersion: {
      type: Number,
      require: true,
      default: null,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    deleteWebPage() {
      const paramData = {
        siteInfo: {
          recordVersion: this.siteInfoRecordVersion,
        },
        id: this.selectPageId,
        recordVersion: this.pageRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteWebPage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen03', 'ページ')
            this.$emit('reflect')
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
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
    h4 {
      margin-bottom: 9px;
    }
    p {
      margin-top: 24px;
      margin-bottom: 32px;
      &:first-content {
        margin-top: 0;
      }
    }
  }
}

.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.buttons * {
  color: #ffffff;
}
.icon-attention {
  margin-right: 12px;
}
</style>
