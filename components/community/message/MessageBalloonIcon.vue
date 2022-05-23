<template>
  <div class="message-balloon" @click="$emit('click')">
    <SpeechBalloonSVG class="icon-speechBalloon" />
  </div>
</template>

<script>
export default {
  name: 'MessageBalloonIcon',
  components: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.message-balloon {
  width: 64px;
  height: 64px;
  background: #4f7df0;
  opacity: 1;
  border-radius: 99px;
  position: fixed;
  right: 16px;
  bottom: 72px;
  z-index: 1000;
  cursor: pointer;
  .icon-speechBalloon {
    fill: blue;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
