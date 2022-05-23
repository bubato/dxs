<template>
  <p v-if="status" class="statusLabel is-check">
    <CheckCircleSVG class="icon icon-checkCircle" />
    {{ text }}
  </p>
  <p v-else class="statusLabel is-error">
    <ErrorSVG class="icon icon-error" />
    {{ text }}
    <a v-if="linkUrl !== ''" class="link-text" @click="accountLinkPush">{{
      linkTxt
    }}</a>
  </p>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'StatusLabel',
  props: {
    text: {
      type: String,
      default: '',
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    linkUrl: {
      type: String,
      default: '',
      required: false,
    },
    linkTxt: {
      type: String,
      default: '',
      required: false,
    },
    linkName: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {},
  methods: {
    ...mapMutations('common', ['setDataLakeActivateFrom']),
    /**
     * アカウント データレイクオプションアクティベートリンク
     */
    accountLinkPush() {
      this.setDataLakeActivateFrom(
        JSON.stringify({
          url: this.$route.fullPath,
          name: this.linkName,
        })
      )
      this.$router.push(this.linkUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
.statusLabel {
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 12px;
  &.is-check {
    background-color: #f0fff4;
  }
  &.is-error {
    background-color: #fff2f4;
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    &.icon-checkCircle {
      fill: #34c759;
    }
    &.icon-error {
      fill: #e60012;
    }
  }
  .link-text {
    display: inline-block;
    padding-left: 16px;
  }
}
</style>
