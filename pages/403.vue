<template>
  <div class="error">
    <div class="context">
      <h4>403 forbidden</h4>
      <h2>お探しのページを表示できません</h2>
      <p class="annotation">
        アクセスされたページは閲覧が禁止されているか<br />
        一時的に利用できない可能性があります。<br />
        <br />
        お手数ですがbizskyDXトップページから目的のページをお探しください。
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
      title: 'お探しのページを表示できません｜bizskyDX',
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
    h2 {
      margin-top: 8px;
    }
    .annotation {
      margin-top: 16px;
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
