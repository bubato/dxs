<template>
  <div class="send-error">
    <div class="send-error-context">
      <div class="left-contents">
        <h5>配信エラーが発生しました</h5>
        <p>
          配信処理でエラーが発生したためメールを正常に送信できませんでした。<br />下記のボタンをクリックして再度配信を実行いたします。
        </p>
      </div>
      <div class="right-contents">
        <button
          class="btn btn-long btn-basic"
          @click="updateEditMailSettings('reSend')"
        >
          未配信の宛先に再配信する
        </button>
      </div>
    </div>
    <div class="buttons">
      <button
        class="btn btn-long btn-basic"
        @click="updateEditMailSettings('save')"
      >
        エラーを解除して編集中に戻す
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendErrorContext',
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    updateEditMailSettings(type) {},
  },
}
</script>

<style scoped lang="scss">
.send-error {
  width: 100%;
  margin-top: 24px;
  &-context {
    display: flex;
    align-items: flex-end;
    padding: 24px 32px;
    background-color: pink;
    p {
      margin-top: 12px;
    }
    .right-contents {
      margin-left: 32px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
  }
}
</style>
