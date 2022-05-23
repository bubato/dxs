<template>
  <div class="error">
    <div class="context">
      <h4>404 page not found</h4>
      <h2>お探しのページが見つかりません</h2>
      <p class="annotation">
        アクセスされたページはアドレスが間違っているか削除されたため<br />
        見つけることができませんでした。<br />
        <br />
        お手数ですが再度目的のページをお探しください。
      </p>
      <p class="supplement">
        メールのリンクからこのページが表示された場合はアドレスが途中で切れている可能性があります。<br />
        メール本文のURLをコピーしてからブラウザのアドレスバーに貼り付けてアクセスください。
      </p>
      <div class="link">
        <CustomLinkText
          class="link-text"
          text="bizskyDXヘルプセンター"
          link="https://help.bizsky.io/"
        />
      </div>
    </div>
    <div class="image">
      <img :src="$common.getAssetsImgUrl('images/error/403.png')" />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
  head() {
    return {
      title: 'お探しのページが見つかりません｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  justify-content: center;
  margin-top: 140px;
  .context {
    width: 450px;
    h2 {
      margin-top: 8px;
    }
    .annotation {
      margin-top: 16px;
    }
    .supplement {
      font-size: 13px;
      margin-top: 24px;
      padding: 16px;
      background: #f7f8f9;
    }
    .link {
      margin-top: 40px;
      &-text {
        &:not(:first-child) {
          margin-top: 8px;
        }
      }
    }
  }
  .image {
    margin-left: 64px;
  }
}
</style>
