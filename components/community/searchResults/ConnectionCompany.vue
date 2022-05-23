<template>
  <div class="connection-company">
    <h3>会社</h3>
    <div v-for="(list, i) in companyList" :key="i" class="item">
      <div class="left">
        <div class="image">
          <img :src="$common.getProfileImg(list.image)" alt="" />
        </div>
        <div>
          <p class="name">{{ list.name }}</p>
        </div>
      </div>
      <div class="right">
        <button
          class="btn btn-secondary btn-middle"
          @click="showCompanyPage(list.companyId)"
        >
          会社ページを見る
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectionCompany',
  components: {},
  props: {
    companyList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 会社ページを見る
     */
    showCompanyPage(companyId) {
      this.$router.push('/community/corporate/' + companyId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.connection-company {
  h3 {
    margin: 0 0 24px 0;
  }
  margin: 30px 0 0 0;
  .item {
    display: flex;
    align-items: center;
    padding: 24px 0;
    border-top: #e5e5e5 1px solid;
    &:last-of-type {
      border-bottom: #e5e5e5 1px solid;
    }
    .left {
      display: flex;
      flex: 1;
      align-items: center;
      > * {
        &:nth-of-type(2) {
          flex: 1;
          margin: 0 0 0 16px;
        }
      }
      .image {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
        }
      }
      .name {
        font-weight: 500;
        font-size: 17px;
      }
    }
    .right {
      display: flex;
      margin-left: auto;
      > * {
        margin: 0 0 0 8px;
      }
    }
  }
}
// MQ
@include mq(sp) {
  .connection-company h3 {
    padding: 0 16px;
    padding-bottom: 24px;
    margin: 0;
    border-bottom: #e5e5e5 1px solid;
  }
  .connection-company .item {
    padding: 16px 16px 0 16px;
    display: block;
    border-top: none;
    &:last-of-type {
      border: none;
    }
    .left {
      height: auto;
      margin-bottom: 16px;
    }
    .right {
      padding-bottom: 24px;
      border-bottom: #e5e5e5 1px solid;
    }
    .left .img {
      width: 56px;
      height: 56px;
    }
    .left .name {
      font-size: 15px;
    }
  }
}
// MQ
</style>
