<template>
  <div class="connection-member">
    <h3>メンバー</h3>
    <div v-for="(list, i) in memberList" :key="i" class="item">
      <div class="left">
        <div class="image">
          <img :src="$common.getProfileImg(list.image)" alt="" />
        </div>
        <div>
          <p class="name">{{ list.name }}</p>
          <div>
            <p class="company">{{ list.company }}</p>
            <p class="position">{{ list.position }}</p>
          </div>
        </div>
      </div>
      <div class="right">
        <button
          class="btn btn-secondary btn-middle"
          @click="showSelectUserProfile(list.userId)"
        >
          プロフィールを見る
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'ConnectionMember',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    memberList: {
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
     * 選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.connection-member {
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
      .company {
        display: inline;
        padding-right: 16px;
      }
      .position {
        display: inline;
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
  .connection-member h3 {
    padding: 0 16px;
    padding-bottom: 24px;
    margin: 0;
    border-bottom: #e5e5e5 1px solid;
  }
  .connection-member .item {
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
    .left .image {
      width: 56px;
      height: 56px;
      img {
        width: 100%;
      }
    }
    .left .name {
      font-size: 15px;
    }
  }
}
// MQ
</style>
