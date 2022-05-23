<template>
  <div class="corporate">
    <Corporate />
    <CommonFooter class="footer" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'community',
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('community/corporate', ['corporateData']),
  },
  created() {},
  mounted() {},
  methods: {},
  head() {
    return {
      title: this.corporateData.basicSettings
        ? this.corporateData.basicSettings.name + '｜コミュニティ｜bizskyDX'
        : '｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.footerWrap {
  margin-bottom: 44px;
}
</style>
