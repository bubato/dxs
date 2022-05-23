<template>
  <div class="customLinkText">
    <a v-if="link" class="link-text" @click="showTargetPage()">
      {{ text }}<LaunchSVG class="icon icon-launch" />
    </a>
    <p v-else>{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'CustomLinkText',
  components: {},
  props: {
    text: { type: String, required: true, default: '' },
    link: { type: String, required: false, default: '' },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 別タブにて対象の画面を表示
     */
    showTargetPage() {
      window.open(this.link, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.link-text {
  display: block;
  .icon {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    fill: #4f7df0;
  }
}
</style>
