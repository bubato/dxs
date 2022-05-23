<template>
  <div class="group-profile">
    <table>
      <tbody>
        <tr>
          <th>グループ名</th>
          <td>{{ groupInfo.postGroupName }}</td>
        </tr>
        <tr>
          <th>グループ説明</th>
          <td>{{ groupInfo.postGroupDescription }}</td>
        </tr>
        <tr>
          <th>公開範囲</th>
          <td>
            <PublicSVG
              v-if="groupInfo.postGroupRangeStatus === 1"
              class="icon-public"
            />
            <LockSVG
              v-if="groupInfo.postGroupRangeStatus === 2"
              class="icon-lock"
            />
            {{
              $common.getVersatileItemInformation(40)[
                String(groupInfo.postGroupRangeStatus)
              ]
            }}
          </td>
        </tr>
        <tr>
          <th>管理者</th>
          <td>
            <div class="profile-block">
              <div
                class="image"
                @click="showSelectUserProfile(groupInfo.adminProfileMemberId)"
              >
                <img :src="$common.getProfileImg(groupInfo.adminImageUrl)" />
              </div>
              <div class="profile">
                <p class="admin-name">
                  {{ groupInfo.adminName }}
                </p>
                <p class="admin-company">
                  {{ groupInfo.adminCompany }}
                </p>
                <p class="admin-position">
                  {{ groupInfo.adminPosition }}
                </p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'GroupMember',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      inputSearchName: '',
    }
  },
  computed: {
    ...mapState('community/group', ['groupInfo']),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     *
     * @param {string} userId 選択したユーザID
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.group-profile {
  table {
    @include mq(pc) {
      width: 100%;
    }
    @include spContentWidth();
    @include mq(sp) {
      border-radius: 6px;
    }
    th,
    td {
      border: 1px solid #e5e5e5;
      padding: 16px;
    }
    th {
      width: 124px;
      text-align: left;
    }
  }
  .profile-block {
    display: flex;
    .image {
      width: 48px;
      height: 48px;
      position: relative;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .profile {
      margin-left: 16px;
      p {
        :not(:first-child) {
          margin-top: 2px;
        }
        &.admin-company,
        &.admin-position {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
