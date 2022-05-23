<template>
  <div class="c-main">
    <ul class="menu-list">
      <li class="txt-alert" @click="showDeleteMessageModal()">
        メッセージを削除する
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MessageMenuDialog',
  props: {
    dialogType: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    ...mapMutations('community/message', ['setShowDeleteMessageModalState']),
    /**
     * メッセージ削除確認確認モーダルの表示
     */
    showDeleteMessageModal() {
      this.setShowDeleteMessageModalState(true)
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.c-main {
  position: absolute;
  top: 22px;
  left: 0;
  white-space: nowrap;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 24px 16px;
  background: #ffffff;
  z-index: 10;
  .menu-list {
    li {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &.txt-alert {
        color: #e60012;
      }
    }
  }
}
</style>
