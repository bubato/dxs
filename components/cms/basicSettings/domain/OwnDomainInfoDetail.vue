<template>
  <div class="domain-info-detail">
    <ul>
      <li>
        <span>ドメイン種別</span>
        <span>独自ドメイン</span>
      </li>
      <li>
        <span>サイトURL</span>
        <span>{{ ownDomainInfo.url }}</span>
      </li>
      <li>
        <span>ドメイン取得状況</span>
        <span class="status">
          <template v-if="ownDomainInfo.status === 0">
            <RemoveCircleSVG class="icon-removeCircle icon" /><span
              >未取得</span
            >
          </template>
          <template v-if="ownDomainInfo.status === 1"> 取得中 </template>
          <template v-if="ownDomainInfo.status === 2">
            <CheckCircleSVG class="icon-checkCircle icon" /><span>取得済</span>
          </template>
          <template v-if="ownDomainInfo.status === 3">
            <CheckCircleSVG class="icon-checkCircle icon" /><span>取得済</span>
          </template>
        </span>
      </li>
      <li>
        <span>ドメイン取得日</span>
        <span>{{ ownDomainInfo.date }}</span>
      </li>
    </ul>
    <button
      v-if="ownDomainInfo.status === 2"
      class="btn btn-basic btn-long"
      @click="showChangeOwnDomainConfirmModal()"
    >
      独自ドメインに切り替え
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'OwnDomainInfoDetail',
  components: {},
  props: {
    ownDomainInfo: {
      type: Object,
      default: () => ({}),
      require: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('cms/basicSettingsStore', [
      'setShowChangeOwnDomainConfirmModalState',
    ]),
    /**
     * 独自ドメイン切り替え確認モーダルの表示
     */
    showChangeOwnDomainConfirmModal() {
      this.setShowChangeOwnDomainConfirmModalState(true)
    },
  },
}
</script>

<style lang="scss" scoped>
.domain-info-detail {
  ul {
    li {
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 20px;
      }
      span {
        &.status {
          display: flex;
          align-items: center;
        }
        &:nth-of-type(1) {
          width: 120px;
          font-weight: 500;
        }
        &:nth-of-type(2) {
          margin-left: 12px;
        }
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          &-checkCircle {
            fill: #34c759;
          }
          &-removeCircle {
            fill: #e2e3e5;
          }
        }
      }
    }
  }
  .btn {
    margin-top: 32px;
  }
}
</style>
