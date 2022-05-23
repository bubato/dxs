<template>
  <div class="messageArea">
    <MessageUserSelect v-if="!showMessageChatAreaFlg" />
    <MessageChat v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MessageArea',
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('community/message', ['showMessageChatAreaFlg']),
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.messageArea {
  width: 400px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  z-index: 100;
}
// MQ
@include mq(sp) {
  //SPView
  .messageArea {
    width: 100%;
    box-shadow: none;
  }
}
// MQ
</style>
