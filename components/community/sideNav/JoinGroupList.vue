<template>
  <div class="join-groups">
    <div class="create-group-btn is-pc">
      <button
        class="btn btn-long btn-basic is-pc"
        @click="transitionNewCreateGroupScreen()"
      >
        新規グループを作成
      </button>
    </div>
    <div class="create-group-btn is-sp">
      <button class="btn" @click="transitionNewCreateGroupScreen()">
        <AddBlackSVG class="icon icon-addBlack" />
      </button>
      新規作成
    </div>
    <div class="group-area">
      <div
        v-if="joinGroup.accountingFirmPostGroups.length > 0"
        class="accounting-firm"
      >
        <ul class="group-list">
          <li
            v-for="(data, index) in joinGroup.accountingFirmPostGroups"
            :key="index"
            :class="{
              'is-selected': Number($route.params.groupId) === data.postGroupId,
            }"
            @click="showSelectGroupProfile(data.postGroupId)"
          >
            <div class="group-link">
              <div class="image">
                <img
                  :src="$common.getGroupProfileImg(data.postGroupCoverImageUrl)"
                />
              </div>
              <p class="group-name">{{ data.postGroupName }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="joinGroup.adminPostGroups.length > 0" class="admin-post">
        <ul class="group-list">
          <li
            v-for="(data, index) in getShowAdminGroups()"
            :key="index"
            :class="{
              'is-selected': Number($route.params.groupId) === data.postGroupId,
            }"
            @click="showSelectGroupProfile(data.postGroupId)"
          >
            <div class="group-link">
              <div class="image">
                <img
                  :src="$common.getGroupProfileImg(data.postGroupCoverImageUrl)"
                />
                <FlagSVG class="icon-flag" />
              </div>
              <p class="group-name">{{ data.postGroupName }}</p>
            </div>
          </li>
        </ul>
        <div class="buttons">
          <button
            v-if="
              !adminPostGroupsMoreListFlg &&
              joinGroup.adminPostGroups.length > maxShowNum &&
              isPCSize
            "
            class="btn btn-more"
            @click="adminPostGroupsMoreListFlg = true"
          >
            もっと見る
            <ExpandMoreSVG class="icon icon-expandMore" />
          </button>
        </div>
      </div>
      <div
        v-if="joinGroup.participationPostGroups.length > 0"
        class="participation-post"
      >
        <ul class="group-list">
          <li
            v-for="(data, index) in getShowParticipationPostGroups()"
            :key="index"
            :class="{
              'is-selected': Number($route.params.groupId) === data.postGroupId,
            }"
            @click="showSelectGroupProfile(data.postGroupId)"
          >
            <div class="group-link">
              <div class="image">
                <img
                  :src="$common.getGroupProfileImg(data.postGroupCoverImageUrl)"
                />
              </div>
              <p class="group-name">{{ data.postGroupName }}</p>
            </div>
          </li>
        </ul>
        <div class="buttons">
          <button
            v-if="
              !participationPostGroupsMoreListFlg &&
              joinGroup.participationPostGroups.length > maxShowNum &&
              isPCSize
            "
            class="btn btn-more"
            @click="participationPostGroupsMoreListFlg = true"
          >
            もっと見る
            <ExpandMoreSVG class="icon icon-expandMore" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'JoinGroupList',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      adminPostGroupsMoreListFlg: false,
      participationPostGroupsMoreListFlg: false,
      maxShowNum: 3,
    }
  },
  computed: {
    ...mapState('community/common', ['isPCSize']),
    ...mapState('community/group', ['joinGroup']),
    /**
     * 画面に表示する管理投稿グループリストの取得
     *
     * @return {Object[]} 画面に表示する管理投稿グループリスト
     */
    getShowAdminGroups() {
      return () => {
        const showAdminPostGroups = this.joinGroup.adminPostGroups.filter(
          (data, index) => {
            if (this.adminPostGroupsMoreListFlg) {
              return true
            } else if (this.isPCSize === false) {
              return true
            } else {
              return index < this.maxShowNum
            }
          }
        )

        return showAdminPostGroups
      }
    },
    /**
     * 画面に表示する参加投稿グループリストの取得
     *
     * @return {Object[]} 画面に表示する参加投稿グループリスト
     */
    getShowParticipationPostGroups() {
      return () => {
        const showParticipationPostGroups = this.joinGroup.participationPostGroups.filter(
          (data, index) => {
            if (this.participationPostGroupsMoreListFlg) {
              return true
            } else if (this.isPCSize === false) {
              return true
            } else {
              return index < this.maxShowNum
            }
          }
        )

        return showParticipationPostGroups
      }
    },
  },
  created() {
    this.mixin_getJoinGroupList() // 投稿グループ一覧の取得
  },
  methods: {
    /**
     * 選択したグループページに遷移
     */
    showSelectGroupProfile(groupId) {
      this.$router.push(`/community/group/${groupId}/`)
    },
    /**
     * 新規グループ作成画面に遷移
     */
    transitionNewCreateGroupScreen() {
      this.$router.push(`/community/group/edit/`)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
@include mq(sp) {
  .join-groups,
  .accounting-firm,
  .group-list {
    display: flex;
    // margin-left: 17px;
  }
}
.image {
  @include mq(pc) {
    width: 48px;
    min-width: 48px;
    height: 48px;
  }
  @include mq(sp) {
    width: 64px;
    min-width: 64px;
    height: 64px;
    margin-bottom: 8px;
  }
  position: relative;
  img {
    width: 100%;
  }
  .icon-flag {
    position: absolute;
    top: 0;
    right: 0;
  }
}

@include mq(pc) {
  .group-area {
    > div {
      position: relative;
      &:not(:first-child) {
        margin-top: 20px;
      }
      &:first-child::before {
        content: '';
        display: block;
        width: 80%;
        height: 1px;
        background-color: #e5e5e5;
        position: absolute;
        top: 0;
        left: 24px;
      }
      &::after {
        content: '';
        display: block;
        width: 80%;
        height: 1px;
        background-color: #e5e5e5;
        position: absolute;
        bottom: -20px;
        left: 24px;
      }
    }
  }
}
@include mq(sp) {
  .group-area {
    display: flex;
    align-items: center;
  }
}

.join-groups {
  @include mq(pc) {
    margin: 24px 0;
    background: #f7f8f9;
    padding: 20px 0;
  }
  @include mq(sp) {
    overflow: scroll;
  }
  .create-group-btn {
    @include mq(pc) {
      padding: 0 24px 24px 24px;
    }
    @include mq(sp) {
      margin-left: 17px;
    }
    .btn {
      @include mq(pc) {
        width: 100%;
      }
      @include mq(sp) {
        width: 64px;
        height: 64px;
        margin-bottom: 8px;
        background: #f0f3f5 0% 0% no-repeat padding-box;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.group-list {
  @include mq(pc) {
    padding-top: 12px;
  }
  li {
    @include mq(pc) {
      height: 64px;
      cursor: pointer;
    }
    @include mq(sp) {
      margin-left: 17px;
      width: 67px;
    }
    .group-link {
      @include mq(pc) {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 24px;
      }
    }
    &.is-selected {
      @include mq(pc) {
        background: #ebeced;
      }
    }
  }
}

.group-name {
  @include mq(pc) {
    margin-left: 16px;
  }
  @include mq(sp) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.buttons {
  @include mq(pc) {
    margin-top: 12px;
    padding: 0 24px;
  }
  .btn-more {
    @include mq(pc) {
      width: 100%;
      height: 48px;
      position: relative;
      background: #ffffff;
      margin-bottom: 16px;
    }
    .icon {
      @include mq(pc) {
        position: absolute;
        position: absolute;
        right: 50px;
      }
    }
  }
}
</style>
