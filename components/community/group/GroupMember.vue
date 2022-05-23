<template>
  <div class="group-member">
    <div class="header">
      <div class="left-contents">
        <h5>グループ参加メンバー</h5>
        <span>{{ groupMembers.length }}人</span>
      </div>
      <div class="right-contents">
        <button
          class="btn btn-middle btn-primary"
          @click="setInvitationGroupMemberModalState(true)"
        >
          メンバーを招待
        </button>
      </div>
    </div>
    <div class="contents">
      <CustomInputText
        v-model="inputSearchName"
        view-type="search"
        maxlength="50"
        placeholder="メンバーを検索"
        @submit="setFilterText()"
      />
      <GroupMemberList :filter-text="filterText" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'GroupMember',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      inputSearchName: '',
      filterText: '',
    }
  },
  computed: {
    ...mapState('community/group', ['groupMembers']),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('community/group', ['setInvitationGroupMemberModalState']),
    /**
     * フィルターテキストを設定
     */
    setFilterText() {
      this.filterText = JSON.parse(JSON.stringify(this.inputSearchName))
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.group-member {
  margin-top: 48px;
  @include spContentWidth();
  .header {
    display: flex;
    @include mq(pc) {
      align-items: center;
      justify-content: space-between;
    }
    @include mq(sp) {
      flex-direction: column;
    }
    .left-contents {
      display: flex;
      align-items: center;
      @include mq(sp) {
        margin-bottom: 24px;
      }
      span {
        color: #8d8d8d;
        font-size: 17px;
        margin-left: 16px;
      }
    }
  }
  .contents {
    margin-top: 24px;
    .group-member-list {
      margin-top: 24px;
    }
  }
}
</style>
