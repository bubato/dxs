<template>
  <div
    class="create-new-mail"
    :class="{ 'show-scroll': $common.checkShowScrollBar() }"
  >
    <div class="main-contents">
      <div class="header">
        <h1>新規作成</h1>
      </div>
      <div class="contents">
        <div class="flex flex-between">
          <p>あいうえお</p>
          <p>かきくけこ</p>
        </div>
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: {
    CommonFooter,
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
