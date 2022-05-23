<template>
  <div class="good-comment-nav">
    <GoodDoneSVG
      v-if="goodCommentFlg"
      class="icon-good"
      @click="updateGoodNum()"
    />
    <GoodSVG v-else class="icon-good" @click="updateGoodNum()" />
    <span>{{ goodCommentNum }}</span>
  </div>
</template>

<script>
export default {
  name: 'GoodCommentNav',
  components: {},
  props: {
    postId: { type: Number, required: true, default: null },
    goodCommentNum: { type: Number, required: true, default: null },
    goodCommentFlg: { type: Number, required: true, default: 0 },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    /**
     * いいねの更新
     */
    updateGoodNum() {
      const paramData = {
        postId: this.postId,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateGoodNum(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const returnData = {
              postId: this.postId,
              newGoodNum: resData.data.goodNum,
              newGoodFlag: resData.data.goodFlag,
            }

            this.$emit('update', returnData)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.good-comment-nav {
  display: flex;
  align-items: center;
  margin-top: 18px;
  .icon-good {
    cursor: pointer;
  }
  span {
    font-size: 13px;
    margin-left: 8px;
    color: #8d8d8d;
  }
}
</style>
