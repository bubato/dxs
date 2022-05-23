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
          <template v-if="domainStatus === 0">
            <div class="modal_title">
              <WarningSVG class="icon-warning" />
              <h4>独自ドメインに切り替え</h4>
            </div>
            <div class="modal_contents">
              <p class="context">
                取得した独自ドメインでWebサイトへアクセスできるようになります。<br />
                <br />
                独自ドメインに切り替えるとサブドメインに戻すことはできませんのでご注意ください。<br />
                サブドメインにアクセスすると自動で独自ドメインに切り替わります。<br />
                <br />
                切り替えてから独自ドメインが利用できるようになるまで最大3日ほどかかる場合があります。予めご承知おきください。
              </p>
            </div>
            <div class="buttons">
              <button
                class="btn btn-long btn-cancel"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button class="btn btn-long btn-basic" @click="changeOwnDomain()">
                独自ドメインに切り替え
              </button>
            </div>
          </template>
          <template v-if="domainStatus === 1">
            <div class="modal_title">
              <h4>独自ドメインへの切り替え中です</h4>
            </div>
            <div class="modal_contents">
              <p class="context">
                独自ドメインへの切り替え中です。<br />
                完了するまで画面を閉じずにしばらくお待ちください。
              </p>
              <div class="loading">
                <LoadingImage />
              </div>
            </div>
          </template>
          <template v-if="domainStatus === 2">
            <div class="modal_title">
              <h4>独自ドメインへの切替が完了しました</h4>
            </div>
            <div class="modal_contents">
              <p class="context">
                Webサイトへの独自ドメインでアクセスできるようになりました。<br />
                切り替えてから独自ドメインが利用できるようになるまで<br />
                最大3日ほどかかる場合があります。<br />
                予めご承知ください。
              </p>
            </div>
            <div class="buttons">
              <button
                class="btn btn-long btn-basic"
                @click="completeSwitchOwnDomain()"
              >
                OK
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ChangeOwnDomainConfirmModal',
  components: {},
  props: {},
  data() {
    return {
      domainStatus: 0, // 0:未切替 1:切替中 2:切替済み
      setupStatusMolecule: '',
      setupStatusDenominator: '',
    }
  },
  computed: {},
  created() {},
  methods: {
    /**
     * 独自ドメインに切り替え処理
     */
    changeOwnDomain() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .changeOwnDomain(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.domainStatus = 1
            this.getOwnDomainSetupStatus() // 独自ドメインに切り替え切替状況確認
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
     * 独自ドメインに切り替え切替状況確認
     */
    getOwnDomainSetupStatus() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getOwnDomainSetupStatus(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const setupStatusData = resData.data.setupStatus.split('/')

            this.setupStatusMolecule = setupStatusData[0]
            this.setupStatusDenominator = setupStatusData[1]
            this.getSetupStatusTimer()
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
     * セットアップ取得タイマー
     */
    getSetupStatusTimer() {
      if (this.setupStatusDenominator === this.setupStatusMolecule) {
        this.domainStatus = 2
      } else {
        setTimeout(() => {
          this.getOwnDomainSetupStatus()
        }, 3000)
      }
    },
    /**
     * 独自ドメイン切替完了モーダル-OKボタン押下処理
     */
    completeSwitchOwnDomain() {
      this.$emit('update')
      this.$emit('close')
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event イベントオブジェクト
     * @param {String} type クローズタイプ
     */
    closeModal(event, type) {
      // 独自ドメイン切替中後はモーダルは閉じれない
      if (this.domainStatus !== 0) {
        return
      }

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

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-warning {
      width: 32px;
      height: 32px;
      fill: #ffcc00;
    }
    h4 {
      margin-left: 12px;
    }
  }
  .modal_contents {
    margin-top: 8px;
    .context {
      text-align: center;
    }
    .loading {
      width: 92px;
      height: 92px;
      margin: 0 auto;
      margin-top: 32px;
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
</style>
