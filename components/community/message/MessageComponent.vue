<template>
  <div class="message-component">
    <MessageBalloonIcon
      v-show="!showMessageBlockFlg"
      @click="showMessageBlock()"
    />
    <div v-if="showMessageBlockFlg" class="message-component-background" />
    <MessageArea v-if="showMessageBlockFlg" v-on-clickaway="hideMessageBlock" />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MessageComponent',
  components: {},
  mixins: [clickaway],
  data() {
    return {}
  },
  computed: {
    ...mapState('community/message', ['showMessageBlockFlg']),
  },
  created() {},
  methods: {
    ...mapMutations('community/message', [
      'setShowMessageBlockFlg',
      'setShowMessageChatAreaFlg',
    ]),
    /**
     * メッセージエリアを表示
     */
    showMessageBlock() {
      this.setShowMessageChatAreaFlg(false)
      this.setShowMessageBlockFlg(true)
    },
    /**
     * メッセージエリアを非表示
     */
    hideMessageBlock() {
      this.setShowMessageBlockFlg(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.message-component {
  &-background {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
