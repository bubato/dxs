<template>
  <div class="expire">
    <div class="context">
      <h2>無効なアカウントです</h2>
      <p class="annotation">
        現在このアカウントは有効ではありません。<br />
        bizskyDXをご利用中の方はアカウント管理者の方へご確認ください。
      </p>
    </div>
    <div class="image">
      <img :src="$common.getAssetsImgUrl('images/invitation/expire.png')" />
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
      title: '無効なアカウントです｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.expire {
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
  }
  .image {
    margin-top: -2px;
    margin-left: 15px;
    img {
      width: 473px;
    }
  }
}
</style>
