<template>
  <div class="form-tab">
    <div class="heading">
      <h3>フォームタグ</h3>
      <p class="sub-text">
        表示されているコードをコピーし、&lt;body&gt;&lt;/body&gt;内に埋め込んで使用してください。<br />
        タグを設置するサイトでCSPの設定をしている場合は事前に CSPの設定
        をしてください。
      </p>
    </div>
    <div class="form-item">
      <p>フォームタグ</p>
      <CustomInputText v-model="propFormTag.formTag" :is-disabled="true" />
      <button class="btn btn-secondary btn-middle" @click="copyFormTagCode()">
        コードをコピー
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtherSettingsFormTab',
  components: {},
  props: {
    propFormTag: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      selectTab: 1,
    }
  },
  computed: {},
  created() {},
  methods: {
    /**
     * フォームタグのコードをクリップボードにコピー
     */
    copyFormTagCode() {
      this.$common.copyClipBoard(this.propFormTag.formTag)
      this.$common.showCompletePopAlert('ActionMsg_Gen08')
    },
  },
}
</script>

<style lang="scss" scoped>
.form-tab {
  .heading {
    margin-top: 32px;
    .sub-text {
      margin-top: 8px;
      font-size: 13px;
    }
  }
  .form-item {
    margin-top: 32px;
    p {
      font-weight: 500;
    }
    ::v-deep .custom-input-text {
      width: 854px;
    }
    ::v-deep .custom-input-text,
    .btn {
      margin-top: 12px;
    }
  }
}
</style>
