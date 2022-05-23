<template>
  <div class="connectionList">
    <template v-if="$common.checkArrayValue(connectionList)">
      <div
        v-for="(member, index) in connectionList"
        :id="'number-' + (index + 1)"
        :key="index"
        class="connectionList-cell"
        @click="showSelectUserProfile($event, member.userId)"
      >
        <div class="connectionList-cell-img">
          <img :src="$common.getProfileImg(member.image)" alt="" />
        </div>
        <div class="connectionList-cell-text">
          <p class="name">{{ member.name }}</p>
          <p class="company">{{ member.company }}</p>
          <p class="position">{{ member.position }}</p>
          <p class="commonConnect">
            共通のつながり{{ member.commonConnectionNum }}人
          </p>
          <button
            v-if="showMenu"
            class="btn-menu"
            @click="showConnectionMenu(index + 1, member.userId)"
            @mouseover="$common.setAreaLabel($event, 'top', 'メニュー')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          >
            <MoreHorizSVG class="icon-moreHoriz" />
          </button>
        </div>
        <ConnectionMenuDialog
          v-if="isMenuActive('number-' + (index + 1))"
          v-on-clickaway="away"
          :user-id="member.userId"
          :post-display="member.postDisplay"
          class="connectionList-cell-menu"
          @close="reLoadData()"
        />
      </div>
    </template>
    <template v-else>
      <p v-if="connectionSwitch === 1">つながっているメンバーはいません</p>
      <p v-else>共通のつながりはいません</p>
    </template>
    <CancelConfirmConnectionModal
      v-if="showCancelConfirmConnectionModalFlg"
      @reflect="deleteConnectionRequest()"
      @close="hideCancelConfirmConnectionModal()"
    />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'
import ConnectionMenuDialog from '~/components/community/connection/ConnectionMenuDialog.vue'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'ConnectionList',
  components: { ConnectionMenuDialog },
  mixins: [clickaway, communityCommonMixin],
  props: {
    connectionList: {
      type: Array,
      default: () => [],
      required: true,
    },
    connectionSwitch: {
      type: Number,
      default: null,
      required: false,
    },
    showMenu: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      targetID: '',
      inputSearchText: '',
    }
  },
  computed: {
    ...mapState('community/member', [
      'showCancelConfirmConnectionModalFlg',
      'selectUserId',
    ]),
  },
  mounted() {},
  created() {},
  methods: {
    ...mapMutations('community/member', [
      'hideCancelConfirmConnectionModal',
      'setSelectUserId',
    ]),
    ...mapMutations('community/profileStore', ['setShowPageTab']),
    /**
     * メニューダイアログ表示処理
     */
    isMenuActive(id) {
      if (this.targetID !== '') {
        if (id === this.targetID) {
          return true
        }
        return false
      } else {
        return false
      }
    },
    /**
     * メニューダイアログ、フォーカスアウトイベント
     */
    away() {
      if (this.targetID !== '') {
        this.targetID = ''
      }
    },
    /**
     * メニューモーダルつながりを解除後emit
     */
    reLoadData() {
      this.targetID = ''
    },
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(evt, userId) {
      if (
        evt.target.classList.contains('btn-menu') ||
        evt.target.closest('.btn-menu') ||
        evt.target.classList.contains('connectionList-cell-menu') ||
        evt.target.closest('.connectionList-cell-menu')
      ) {
        return
      }

      this.mixin_showSelectUserProfile(userId)
    },
    /**
     * つながり解除API処理
     */
    deleteConnectionRequest() {
      const paramData = {
        userId: this.selectUserId,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteConnectionRequest(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getMyConnectionList()
            this.reLoadData()
            this.hideCancelConfirmConnectionModal()
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
     * つながりメニューを表示
     */
    showConnectionMenu(no, userId) {
      this.targetID = `number-${no}`
      this.setSelectUserId(userId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
// つながりリスト
.connectionList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &-cell {
    display: flex;
    position: relative;
    width: 49%;
    padding: 24px;
    border: #e5e5e5 1px solid;
    border-radius: 6px;
    margin-bottom: 2%;
    cursor: pointer;
    &.is-none {
      display: none !important;
    }
    &:hover {
      background: #f8f9fa;
    }

    &-img {
      padding-right: 16px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    &-text {
      flex: 1;
      p {
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .name {
        font-size: 17px;
        font-weight: 500;
        color: #1e1e1e;
      }
      .commonConnect {
        font-size: 13px;
        color: #8d8d8d;
      }
      .btn-menu {
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 0px;
        width: 44px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &-menu {
      position: absolute;
      background: #fff;
      right: 0;
      top: 0;
      transform: translate(20px, -24px);
      z-index: 10;
    }
  }
}
// アイコン設定
.icon {
  &-moreHoriz {
    width: 24px;
    height: 24px;
  }
}

// MQ
@include mq(sp) {
  .connectionList {
    display: block;
    &-cell {
      width: 100%;
      margin-bottom: 16px;
    }
  }
}
// MQ
</style>
