<template>
  <div class="connection-request">
    <div class="flex">
      <h3>つながり申請</h3>
      <p class="count">{{ requestList.length }}人</p>
    </div>
    <p v-if="requestList.length > 0" class="caption">
      新しいつながり申請が届いています。プロフィールを確認してつながりを広げましょう。
    </p>
    <p v-else class="caption">
      新しいつながり申請はありません。プロフィールを検索してつながりを広げましょう。
    </p>
    <div v-for="(list, i) in requestList" :key="i" class="item">
      <div class="left">
        <div class="image">
          <img
            :src="$common.getProfileImg(list.image)"
            alt=""
            @click="showSelectUserProfile(list.userId)"
          />
        </div>
        <div class="content">
          <div class="flex sp-nonFlexInlineBlock">
            <p class="name">{{ list.name }}</p>
            <p class="font-size-small date">
              {{
                $common.getFormatDiffDate(list.requestDate, 'YYYY/MM/DD HH:mm')
              }}
            </p>
          </div>
          <p class="company">{{ list.company }}</p>
          <p class="position">{{ list.position }}</p>
        </div>
      </div>
      <div class="right">
        <button
          class="btn btn-basic btn-short"
          @click="approvalConnection(list.userId)"
          @mouseover="
            $common.setAreaLabel($event, 'top', 'つながりリクエストを承認')
          "
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        >
          承認
        </button>
        <button
          class="btn btn-cancel btn-short"
          @click="deleteConnectionRequest(list.userId)"
          @mouseover="
            $common.setAreaLabel($event, 'top', 'つながりリクエストを削除')
          "
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        >
          削除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'ConnectionRequest',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    requestList: {
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
     * つながりを承認(申請)
     */
    approvalConnection(userId) {
      const paramData = {
        userId,
      }

      this.$common.addCallApiNum()
      this.$api
        .approvalConnection(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getMyConnectionList()
            this.$emit('reflect')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * つながりリクエストを削除
     */
    deleteConnectionRequest(userId) {
      const paramData = {
        userId,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteConnectionRequest(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getMyConnectionList()
            this.$emit('reflect')
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
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
// つながり申請
.connection-request {
  margin: 40px 0 0 0;
  padding: 24px;
  background: #f7f8f9 0% 0% no-repeat padding-box;
  border-radius: 6px;
  .caption {
    margin: 16px 0 24px;
  }
  .count {
    margin: 0 0 0 16px;
    font-size: 20px;
    color: #8d8d8d;
  }
  .item {
    display: flex;
    align-items: flex-start;
    padding: 24px 0;
    border-top: #e5e5e5 1px solid;
    .left {
      display: flex;
      align-items: center;
      flex: 1;
      > * {
        &:nth-of-type(2) {
          margin: 0 0 0 16px;
        }
      }
      .image {
        width: 80px;
        height: 80px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      .content {
        flex: 1;
      }
      .name {
        font-weight: 500;
        font-size: 17px;
        flex: 1;
      }
      .date {
        margin: 0 0 0 16px;
        color: #8d8d8d;
      }
      .company {
        margin: 4px 0 0 0;
      }
      .position {
        margin: 2px 0 0 0;
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
  .connection-application {
    margin: 0 16px;
  }
  .connection-application .item,
  .connection-request .item {
    padding: 0;
    display: block;
    border-top: none;
    border-top: #e5e5e5 1px solid;
    &:last-of-type {
      .right {
        padding-bottom: 8px;
      }
    }
    .left {
      padding-top: 20px;
      height: auto;
      margin-bottom: 16px;
      .name {
        margin-right: 16px;
      }
      .date {
        margin: 0;
      }
    }
    .right {
      padding-bottom: 24px;
      .btn {
        width: 50%;
      }
    }
    .left .img {
      width: 80px;
      height: 80px;
    }
    .left .name {
      font-size: 15px;
    }
  }
}
// MQ
</style>
