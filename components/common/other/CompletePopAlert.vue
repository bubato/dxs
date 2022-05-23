<template>
  <div class="completePopAlert">
    <div
      :class="{ isActiveShowCompleteAlert: showCompletePopAlertFlg }"
      class="c-main"
    >
      <CheckCircleSVG class="icon-check icon-checkCircle" />
      <p>{{ showMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CompletePopAlert',
  props: {},
  data() {
    return {
      showMessage: '',
      showCompletePopAlertFlg: false,
    }
  },
  computed: {
    ...mapState('common', ['completePopAlertLabel']),
  },
  watch: {
    completePopAlertLabel(val) {
      if (val.length > 0) {
        this.showCompletePopAlertFlg = true

        this.showMessage = val
        this.hideCompleteAlert()

        setTimeout(() => (this.showCompletePopAlertFlg = false), 3000)
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('common', ['setCompletePopAlertLabel']),
    hideCompleteAlert() {
      this.setCompletePopAlertLabel('')
    },
  },
}
</script>

<style scoped lang="scss">
.completePopAlert {
  .c-main {
    display: flex;
    height: 72px;
    position: fixed;
    bottom: 20px;
    right: 24px;
    background: #f0fff4;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    transition: transform 1s;
    transform: translate(600px, 0);
    transform-origin: 50% 50%;
    z-index: 2000;
    &.isActiveShowCompleteAlert {
      transform: translate(0, 0);
    }
  }
  .icon-check {
    width: 32px;
    height: 32px;
    fill: #34c759;
    padding-right: 12px;
  }
}
</style>
