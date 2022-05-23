<template>
  <div class="view-optOut">
    <h2 class="view-heading2">配信停止</h2>
    <h4 class="view-heading4">
      メールの配信停止をご希望の方は下記のボタンをクリックしてください。
    </h4>
    <div class="buttons">
      <button type="button" class="btn btn-middle btn-basic">配信停止</button>
    </div>
    <div class="complete none">
      <h2 class="view-heading2">配信停止を受付ました。</h2>
      <p>
        メール配信停止を受け付けました。<br /><br />
        配信停止まで最大で1日程度掛かることがあります。<br /><br />
        配信停止処理が完了するまでにメールが届くことがあります。<br /><br />
        何卒ご了承ください。
      </p>
    </div>
    <div class="error none">
      <h2 class="view-heading2">不正なアクセスです。</h2>
      <p>配信停止は実行されませんでした。</p>
    </div>
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewOptOut',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      errorFlg: false,
      completeFlg: false,
    }
  },
  computed: {},
  mounted() {
    this.initFunc() // 初期表示処理
  },
  methods: {
    /**
     * 初期表示処理
     */
    initFunc() {
      // publish側は var で変数宣言
      const url = new URL(window.location.href)
      const pa = url.searchParams
      const er = document.querySelector('.view-optOut div.error')
      const co = document.querySelector('.view-optOut div.complete')
      const pe = document.querySelector('.view-optOut div.buttons')
      const bt = document.querySelector('.view-optOut div.buttons .btn')

      if (!pa.get('cltId')) {
        pe.classList.add('none')
        er.classList.remove('none')
      } else {
        bt.onclick = function () {
          co.classList.remove('none')
          pe.classList.add('none')
          this.mail_stop()
        }
      }
    },
    /**
     * 配信停止処理
     */
    mail_stop() {
      /*
      __action = 'mail_stop'
      __push_beacon(__getURL()) // ログ送信関数
      */
    },
  },
}
</script>

<style lang="scss" scoped></style>
