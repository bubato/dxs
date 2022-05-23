<template>
  <div class="expire">
    <div class="context">
      <h2>有効期限が切れました</h2>
      <p class="annotation">
        お送りしたアカウント招待用URLの有効期限が切れています。<br />
        お手数ですがbizskyDXアカウント管理者の方へ<br />
        招待メールの再送をご依頼ください。
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
      title: '有効期限が切れました｜bizskyDX',
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
