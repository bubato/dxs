<template>
  <div class="error">
    <div class="context">
      <h4>400 bad request</h4>
      <h2>不正なリクエストです</h2>
      <p class="annotation">
        不正なリクエストが送られたためエラーが発生しました。
      </p>
    </div>
    <div class="image">
      <img :src="$common.getAssetsImgUrl('images/error/400.png')" />
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
      title: '不正なリクエストです｜bizskyDX',
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
