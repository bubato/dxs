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
          <template v-if="type === 'errorCsv'">
            <div class="modal_title">
              <h4>
                <ErrorSVG
                  class="icon-error"
                />エラーが発生したため<br />正常にインポートできませんでした
              </h4>
            </div>
            <div class="modal_contents">
              <p class="context flex flex-center">
                お手数ですが以下の内容を確認し修正してから再度ファイルをアップロードしてください。
              </p>
              <!-- eslint-disable vue/no-v-html -->
              <p class="flex flex-center" v-html="errorData"></p>
              <div class="flex flex-center">
                <img
                  :src="$common.getAssetsImgUrl('images/invitation/expire.png')"
                  width="360"
                  height="270"
                />
              </div>
              <div class="buttons">
                <button
                  class="btn btn-long btn-cancel"
                  @click="closeModal($event, 'close')"
                >
                  閉じる
                </button>
              </div>
            </div>
          </template>
          <template v-if="type === 'limitCsv'">
            <div class="modal_title">
              <h4>
                <ErrorSVG
                  class="icon-error"
                />一部のコンタクトを<br />インポートできませんでした
              </h4>
            </div>
            <div class="modal_contents">
              <div class="flex flex-center">
                <img
                  :src="$common.getAssetsImgUrl('images/invitation/expire.png')"
                  width="360"
                  height="270"
                />
              </div>
              <p class="context flex flex-center">
                ご契約中のプランで登録可能なコンタクト数の上限を超えたたため一部のコンタクトデータをインポートできませんでした。<br /><br />
                インポートできなかったデータは下記のCSVより<br />
                ダウンロードいただけます。
              </p>
              <a
                class="download-link flex flex-center"
                @click="downloadSampleCsv()"
              >
                <DownloadSVG class="icon-download" /><span
                  >登録用のCSVフォーマットはこちら</span
                >
              </a>
              <div class="buttons">
                <button
                  class="btn btn-long btn-cancel"
                  @click="closeModal($event, 'close')"
                >
                  閉じる
                </button>
              </div>
            </div>
          </template>
          <template v-if="type === 'success'">
            <div class="modal_title">
              <h4>
                <CheckCircleSVG
                  class="icon-check icon-checkCircle"
                />インポートが正常に完了しました
              </h4>
            </div>
            <div class="modal_contents">
              <div class="flex flex-center">
                <img
                  :src="
                    $common.getAssetsImgUrl('images/common/img_success.png')
                  "
                />
              </div>
              <p class="context flex flex-center">
                すべてのデータを正常にインポートしました。<br />
                インポートしたデータはコンタクト一覧で<br />
                ご確認いただけます。
              </p>
              <div class="buttons">
                <button
                  class="btn btn-long btn-basic"
                  @click="closeModal($event, 'link')"
                >
                  コンタクト一覧
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ImportResultModal',
  components: {},
  props: {
    errorData: {
      type: String,
      default: '',
      required: true,
    },
    type: { type: String, default: '', required: true },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * 登録用のCSVダウンロード
     */
    downloadSampleCsv() {
      this.$common.csvFileDownload(
        this.errorData,
        `HIRAMEKI7_contact_import.csv`
      )
    },
    /**
     * モーダルを閉じる
     *
     * @param {Object} event イベントオブジェクト
     * @param {String} type イベントタイプ
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
      } else if (type === 'link') {
        this.$emit('link')
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 544px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-error {
      width: 32px;
      height: 32px;
      fill: #e60012;
      margin-right: 12px;
    }
    .icon-check {
      width: 32px;
      height: 32px;
      fill: #34c759;
      margin-right: 12px;
    }
  }
  .modal_contents {
    margin-top: 10px;
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
.download-link {
  display: flex;
  align-items: center;
  margin-top: 12px;
  .icon-download {
    width: 18px;
    height: 18px;
    fill: #007aff;
  }
  span {
    margin-left: 10px;
    color: #007aff;
  }
}
</style>
