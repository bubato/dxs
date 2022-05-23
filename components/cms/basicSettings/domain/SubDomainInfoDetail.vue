<template>
  <div class="domain-info-detail">
    <ul>
      <li>
        <span>ドメイン種別</span>
        <span>サブドメイン</span>
      </li>
      <li>
        <span>サイトURL</span>
        <span>{{ subDomainInfo.url }}</span>
      </li>
      <li>
        <span>ドメイン取得状況</span>
        <span class="status">
          <template v-if="subDomainInfo.status === 0">
            <RemoveCircleSVG class="icon-removeCircle icon" /><span
              >未取得</span
            >
          </template>
          <template v-if="subDomainInfo.status === 1">
            <CheckCircleSVG class="icon-checkCircle icon" /><span>取得済</span>
          </template>
        </span>
      </li>
      <li>
        <span>ドメイン取得日</span>
        <span>{{ subDomainInfo.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SubDomainInfoDetail',
  components: {},
  props: {
    subDomainInfo: {
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
  methods: {},
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
}
</style>
