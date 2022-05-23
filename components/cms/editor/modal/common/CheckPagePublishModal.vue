<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div v-if="publishStatus === 0" class="modal-container">
          <div class="modal_title">
            <h4>
              <CheckCircleSVG class="icon icon-checkCircle" /><span
                >ページの公開処理を受け付けました</span
              >
            </h4>
          </div>
          <div class="modal_contents">
            <p class="message">
              ページの公開処理中です。<br />処理完了までもうしばらくお待ちください。
            </p>
            <div class="loading">
              <LoadingImage />
            </div>
          </div>
        </div>
        <div v-if="publishStatus === 1" class="modal-container">
          <div class="modal_title">
            <h4>
              <ErrorSVG class="icon-error" /><span
                >ページ公開処理中にエラーが発生しました</span
              >
            </h4>
          </div>
          <div class="modal_contents">
            <p class="message">
              システムが自動復旧を試みています。<br />また、サポート事務局が原因調査を開始しています。<br />画面を閉じずにもうしばらくお待ちください。
            </p>
            <div class="image">
              <img
                :src="
                  $common.getAssetsImgUrl('images/cms/editor/publishError.png')
                "
                alt="publishError"
              />
            </div>
            <p class="annotation">
              時間が経ってもエラー解消しない場合は<CustomLinkText
                text="大変お手数ですがお問い合わせフォームよりご連絡ください"
                link="https://www.bizsky.io/contact/"
              />
            </p>
          </div>
        </div>
        <div v-if="publishStatus === 2" class="modal-container">
          <div class="modal_title">
            <h4>
              <ErrorSVG class="icon-error" /><span
                >ページ公開処理が完了できませんでした</span
              >
            </h4>
          </div>
          <div class="modal_contents">
            <p class="message">
              ページの公開処理を正常に完了できませんでした。<br />
              ご迷惑をおかけしますが<br />
              しばらく時間を置いてから再度公開処理を実行ください。
            </p>
            <p class="annotation">
              <CustomLinkText
                text="お急ぎの場合はお問い合わせフォームよりお問い合わせください。"
                link="https://www.bizsky.io/contact/"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CheckPagePublishModal',
  components: {},
  props: {},
  data() {
    return {
      publishStatus: 0, // 0:実行中 1:publishエラー(再実行) 2:上限エラー
      apiCallNum: 0,
      maxApiCallNum: 100,
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['checkPublishType']),
  },
  created() {
    this.checkCallApi() // APIコール数が上限に達していない場合は、再度APIを呼び出す
  },
  mounted() {},
  methods: {
    ...mapMutations('cms/editorStore', [
      'setUpdateCmsDataFlg',
      'setCheckPublishType',
      'setShowCompletePagePublishModalState',
    ]),
    /**
     * APIコール数が上限に達していない場合は、再度APIを呼び出す
     */
    checkCallApi() {
      if (this.apiCallNum < this.maxApiCallNum) {
        setTimeout(() => {
          this.checkCmsEditorPagePublish() // パブリッシュステータス確認
        }, 3000)
      } else {
        this.publishStatus = 2
      }
    },
    /**
     * パブリッシュステータス確認
     */
    checkCmsEditorPagePublish() {
      const paramData = {
        id: Number(this.$route.params.pageId),
      }

      this.$common.addCallApiNum()
      this.$api
        .checkCmsEditorPagePublish(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.apiCallNum += 1
            switch (resData.data.publishStatus) {
              case 0: // 完了
                this.$emit('close')

                if (this.checkPublishType === 'public') {
                  this.setShowCompletePagePublishModalState(true)
                } else if (this.checkPublishType === 'private') {
                  this.$common.showCompletePopAlert('ActionMsg_Gen06', 'ページ')
                } else if (this.checkPublishType === 'init') {
                  this.$common.showCompletePopAlert('ActionMsg_Gen01')
                }

                this.setCheckPublishType('init')
                this.setUpdateCmsDataFlg(true) // ページデータ取得APIの呼び出し
                break
              case 1: // 実行中
                this.publishStatus = 0
                this.checkCallApi()
                break
              case 9: // エラー
                this.publishStatus = 1
                this.checkCallApi()
                break
              default:
                break
            }
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 554px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
    h4 {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin-left: 12px;
      }
    }
  }
  .modal_contents {
    margin-top: 8px;
    text-align: center;
    .image {
      width: 360px;
      height: 270px;
      margin: 32px auto 0 auto;
      img {
        width: 100%;
      }
    }
    .loading {
      width: 92px;
      height: 92px;
      margin: 0 auto;
      margin-top: 32px;
    }
    .annotation {
      margin-top: 32px;
    }
  }
}
.icon-checkCircle {
  width: 32px;
  height: 32px;
  fill: #34c759;
}
.icon-error {
  width: 32px;
  height: 32px;
  fill: #e60012;
}
</style>
