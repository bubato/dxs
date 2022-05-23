<template>
  <div class="c-main">
    <ul class="menu-list">
      <li
        v-if="currentPagePath === 'connection' && postDisplay"
        @click="updatePostDisplay(false)"
      >
        投稿を非表示にする
      </li>
      <li
        v-if="currentPagePath === 'connection' && !postDisplay"
        @click="updatePostDisplay(true)"
      >
        投稿を表示する
      </li>
      <li class="cancel-connect" @click="showCancelConfirmConnectionModal()">
        つながりを解除する
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'ConnectionMenuDialog',
  mixins: [communityCommonMixin],
  props: {
    userId: { type: Number, required: true, default: null },
    postDisplay: { type: Boolean, required: true, default: false },
  },
  data() {
    return {}
  },
  computed: {
    currentPagePath() {
      return this.$route.path.split('/').slice(-2)[0]
    },
  },
  created() {},
  methods: {
    ...mapMutations('community/member', ['showCancelConfirmConnectionModal']),
    /**
     * 投稿表示設定更新API処理
     */
    updatePostDisplay(postDisplay) {
      const paramData = {
        userId: this.userId,
        postDisplay,
      }
      this.$api
        .updatePostDisplay(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getMyConnectionList()
            this.$emit('close')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
</script>

<style scoped lang="scss">
.c-main {
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 24px 16px;
  .menu-list {
    li {
      cursor: pointer;
      &:not(:last-of-type) {
        margin: 0 0 8px 0;
      }
      &.cancel-connect {
        color: #e60012;
      }
    }
  }
}
</style>
