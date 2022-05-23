<template>
  <div class="setting-show-num">
    <button
      :class="{ active: settingShowNum === 20 }"
      @click="changeSettingShowNum(20)"
    >
      20件
    </button>
    <button
      :class="{ active: settingShowNum === 50 }"
      @click="changeSettingShowNum(50)"
    >
      50件
    </button>
    <button
      :class="{ active: settingShowNum === 100 }"
      @click="changeSettingShowNum(100)"
    >
      100件
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SettingShowNum',
  props: {
    settingShowNum: { type: Number, required: true, default: () => 0 },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('communication/mailList', ['mailListObj', 'showDispItems']),
    /**
     * コンポーネントに紐づくクラスの取得
     *
     * @param {string} key 表示項目Key
     */
    checkShowDispItems() {
      return (key) => {
        let result = false

        for (let i = 0; i < this.showDispItems.length; i++) {
          if (this.showDispItems[i].key === key) {
            result = true
            break
          }
        }

        return result
      }
    },
  },
  methods: {
    changeSettingShowNum(settingShowNum) {
      this.$emit('update', settingShowNum)
    },
  },
}
</script>

<style lang="scss" scoped>
.setting-show-num {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 180px;
  height: 32px;
  button {
    width: 60px;
    height: 32px;
    cursor: pointer;
    &.active,
    &:hover {
      background: #ebeced;
    }
    &.active {
      color: #007aff;
    }
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
  }
}
</style>
