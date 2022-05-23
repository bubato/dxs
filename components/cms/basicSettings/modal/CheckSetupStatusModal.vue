<template>
  <transition v-if="setupStatusDenominator !== ''" name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div
          v-if="completionSetupFlg"
          class="modal-container"
          :class="{ 'is-comp': completionSetupFlg }"
        >
          <CancelSVG
            class="btn-close"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />

          <div class="modal_title">
            <h4>
              <CheckCircleSVG class="icon icon-checkCircle" />
              基本設定のセットアップが完了しました！
            </h4>
          </div>
          <div class="modal_contents">
            <p class="message">
              Webサイトの基本設定が完了しました！<br />ページ作成へ移動してオリジナルのWebサイトを作りましょう。
            </p>
            <div class="image">
              <img
                :src="$common.getAssetsImgUrl('images/common/img_success.png')"
              />
            </div>
            <div class="buttons">
              <button class="btn btn-middle btn-basic" @click="linkSitePages()">
                ページ作成へ進む
              </button>
            </div>
          </div>
        </div>
        <div v-else class="modal-container">
          <div class="modal_title">
            <h4>基本設定のセットアップ中です</h4>
          </div>
          <div class="modal_contents">
            <p class="message">
              Webサイト基本情報の初期セットアップ中です。<br />完了するまで画面を閉じずにしばらくお待ちください。
            </p>
            <div class="loading">
              <LoadingImage />
            </div>
            <div class="msgBox">
              <p class="msgBox-title">
                {{ setupStatusMolecule }}/{{ setupStatusDenominator }}まで完了。
              </p>
              <p>完了までの目安時間:{{ setupCompletionTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CheckSetupStatusModal',
  components: {},
  props: {},
  data() {
    return {
      completionSetupFlg: false, // セットアップ完了フラグ
      setupStatusDenominator: '', // セットアップステータス分母
      setupStatusMolecule: '', // セットアップステータス分子
      setupCompletionTimeDataList: {
        1: '3分',
        2: '2分30秒',
        3: '2分',
        4: '1分30秒',
        5: '1分',
        6: '30秒',
        7: '0秒',
      }, // セットアップ残り時間
    }
  },
  computed: {
    /**
     * セットアップ残り時間の取得
     */
    setupCompletionTime() {
      return this.setupCompletionTimeDataList[this.setupStatusMolecule]
    },
  },
  created() {
    this.getSetupStatus() //  セットアップ取得タイマー
  },
  mounted() {},
  methods: {
    /**
     * セットアップ取得タイマー
     */
    getSetupStatusTimer() {
      if (this.setupStatusDenominator === this.setupStatusMolecule) {
        this.completionSetupFlg = true
      } else {
        setTimeout(() => {
          this.getSetupStatus()
        }, 3000)
      }
    },
    /**
     * 基本情報の保存進捗の取得
     */
    getSetupStatus() {
      const paramData = {}

      this.$api
        .getSetupStatus(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const setupStatusData = resData.data.setupStatus.split('/')
            this.setupStatusMolecule = setupStatusData[0]
            this.setupStatusDenominator = setupStatusData[1]
            this.getSetupStatusTimer()
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
            this.closeModal('', 'close')
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
          this.closeModal('', 'close')
        })
    },
    /**
     * webサイト>ページ作成へ遷移
     */
    linkSitePages() {
      this.$router.push('/site/pages/')
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (!this.completionSetupFlg) return
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
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;
  &.is-comp {
    width: 544px;
  }

  .modal_title {
    text-align: center;
    margin-bottom: 24px;
    h4 {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .modal_contents {
    margin-top: 8px;
    text-align: center;
    .message {
      margin-bottom: 32px;
    }
    .loading {
      width: 92px;
      height: 92px;
      margin: 0 auto;
      margin-bottom: 24px;
    }
    .image {
      text-align: center;
      margin-top: 20px;
    }
    .msgBox {
      background: #f7f8f9;
      border-radius: 6px;
      text-align: center;
      padding: 24px 0;
      &-title {
        font-size: 17px;
        font-weight: 500;
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
.icon-checkCircle {
  width: 32px;
  height: 32px;
  fill: #34c759;
}
</style>
