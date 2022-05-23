<template>
  <div class="tooltip">
    <HelpSVG class="icon icon-help" @click="showDialog" />
    <div
      v-if="showDialogFlg"
      v-on-clickaway="hideDialog"
      class="tooltip-dialog"
      :class="direction"
      :style="{ width: width + 'px', left: left + 'px', top: top + 'px' }"
    >
      <!-- eslint-disable vue/no-v-html -->
      <p v-html="label"></p>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'TooltipHelp',
  components: {},
  mixins: [clickaway],
  props: {
    label: { type: String, required: true, default: '' },
    width: { type: String, required: false, default: '250' },
    direction: { type: String, required: false, default: 'right' },
    left: { type: String, required: false, default: '' },
    top: { type: String, required: false, default: '' },
  },
  data() {
    return {
      showDialogFlg: false,
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    showDialog() {
      this.showDialogFlg = true
    },
    hideDialog() {
      this.showDialogFlg = false
    },
  },
}
</script>

<style lang="scss" scoped>
.tooltip {
  padding-left: 7px;
  display: flex;
  align-items: center;
  position: relative;
  .icon {
    width: 20px;
    height: 20px;
    fill: #b0b3be;
    cursor: pointer;
  }
  &-dialog {
    position: absolute;
    background: #8d8d8d 0% 0% no-repeat padding-box;
    color: #ffffff;
    border-radius: 4px;
    opacity: 0.9;
    padding: 8px;
    font-size: 13px;
    z-index: 1;
    font-weight: 400;
    &.right {
      left: 30px;
    }
    &.bottom {
      bottom: -7px;
      transform: translate(-50%, 100%);
    }
  }
}
</style>
