<template>
  <div class="selectMessageUser">
    <div class="header">
      <div class="title">
        <h3>新規メッセージ</h3>
        <CancelSVG
          class="icon-cancel"
          @mouseover="$common.setAreaLabel($event, 'left', '閉じる')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
          @click="closeMessageBlock()"
        />
      </div>
      <CustomInputText
        v-model="searchText"
        class="search-member"
        view-type="search"
        placeholder="メンバーや会社を検索"
        @submit="searchMember($event)"
      />
      <div v-if="searchFlg" class="back-link">
        <KeyboardArrowRightSVG class="icon icon-keyboardArrowRight" />
        <a class="link-text" @click="searchFlg = false">検索結果を閉じる</a>
      </div>
    </div>
    <div class="contents">
      <!--ph1では対象外
      <div
        v-show="$common.checkArrayValue(customerList) && !searchFlg"
        class="customer-list"
      >
        <div class="heading" @click="showAdvisorListFlg = !showAdvisorListFlg">
          <p>顧問先</p>
          <ExpandMoreSVG
            v-show="!showAdvisorListFlg"
            class="icon-arrow icon-expandMore"
          />
          <ExpandLessSVG
            v-show="showAdvisorListFlg"
            class="icon-arrow icon-expandLess"
          />
        </div>
        <ul v-show="showAdvisorListFlg" class="profile-list">
          <li v-for="(customer, index) in customerList" :key="index">
            <input
              v-model="selectCustomerUser"
              type="radio"
              :value="customer.userId"
              name="customerUser"
              class="input-radio"
              @change="changeSelectUser('customer', customer.userId)"
            />
            <div class="image">
              <img :src="$common.getProfileImg(customer.image)" alt="" />
            </div>
            <div class="profile-detail">
              <div class="flex">
                <p class="name">{{ customer.name }}</p>
                <p class="date">{{ customer.date }}</p>
              </div>
              <p class="company">{{ customer.company }}</p>
              <p class="position">{{ customer.position }}</p>
            </div>
          </li>
        </ul>
      </div>
      -->
      <div
        v-show="$common.checkArrayValue(chatGroupList) && !searchFlg"
        class="member-list"
      >
        <div class="heading" @click="showMemberListFlg = !showMemberListFlg">
          <p>最近メッセージをしたメンバー</p>
          <ExpandMoreSVG
            v-show="!showMemberListFlg"
            class="icon-arrow icon-expandMore"
          />
          <ExpandLessSVG
            v-show="showMemberListFlg"
            class="icon-arrow icon-expandLess"
          />
        </div>
        <ul v-show="showMemberListFlg" class="profile-list">
          <li v-for="(chatGroup, index) in chatGroupList" :key="index">
            <input
              v-model="selectRecentMessageGroup"
              type="radio"
              :value="chatGroup.messageGroupId"
              name="recentChatUser"
              class="input-radio"
              @change="changeSelectGroup(chatGroup.messageGroupId)"
            />
            <div class="member-image">
              <div
                v-for="member in getFilterChatMemberList(
                  chatGroup.chatMemberList
                )"
                :key="member.userId"
                class="image"
              >
                <img :src="$common.getProfileImg(member.image)" alt="" />
              </div>
            </div>
            <div class="name">
              <p
                v-for="member in getFilterChatMemberList(
                  chatGroup.chatMemberList
                )"
                :key="member.userId"
              >
                {{ member.name }}
              </p>
              <p
                v-if="chatGroup.chatMemberList.length > maxShowUser"
                class="sum"
              >
                ＋{{ chatGroup.chatMemberList.length - maxShowUser }}
              </p>
            </div>
            <div class="date">
              {{
                $common.getFormatDiffDate(chatGroup.date, 'YYYY/MM/DD HH:mm')
              }}
            </div>
          </li>
        </ul>
      </div>
      <div v-show="searchFlg" class="search-list">
        <p v-if="searchResultList.length === 0">
          検索条件に一致するメンバーがいませんでした。<br />氏名を省略しないで検索するなど別の方法をお試しください。
        </p>
        <ul v-else class="search-member-list">
          <li v-for="(searchResult, index) in searchResultList" :key="index">
            <label class="checkbox">
              <input
                v-model="checkMemberList"
                type="checkbox"
                :value="searchResult.userId"
                name="selectSearchResultUser"
                class="input-checkbox"
                @change="updateSelectMemberList(searchResult)"
              />
              <span></span>
            </label>
            <div class="image">
              <img :src="$common.getProfileImg(searchResult.image)" alt="" />
            </div>
            <div class="profile-detail">
              <p class="name">{{ searchResult.name }}</p>
              <p class="company">{{ searchResult.company }}</p>
              <p class="position">{{ searchResult.position }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <ul v-if="searchFlg" class="select-member-list">
        <li v-for="(member, index) in selectMemberList" :key="index">
          <div class="member-image">
            <div class="image">
              <img
                :src="$common.getProfileImg(member.image)"
                :alt="member.name"
                :title="member.name"
              />
            </div>
            <CancelSVG
              class="icon-delete"
              @click="removeSelectMember(member.userId)"
              @mouseover="$common.setAreaLabel($event, 'top', '削除')"
              @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')"
            />
          </div>
        </li>
      </ul>
      <a class="link-text" @click="transitionMessageList()"
        >メッセージ一覧から探す</a
      >
      <button
        class="btn btn-basic btn-long"
        :class="{
          'btn-disabled': checkBtnDisabled(),
        }"
        @click="startMessageChat()"
      >
        メッセージを開始
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MessageUserSelect',
  components: {},
  data() {
    return {
      searchText: '',
      searchFlg: false,
      showAdvisorListFlg: true,
      showMemberListFlg: true,
      customerList: [],
      chatGroupList: [],
      searchResultList: [],
      selectMemberList: [],
      checkMemberList: [],
      maxShowUser: 2,
      selectCustomerUser: '',
      selectRecentMessageGroup: '',
    }
  },
  computed: {
    /**
     * ボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (!this.searchFlg) {
          if (!this.selectCustomerUser && !this.selectRecentMessageGroup) {
            result = true
          }
        } else if (this.selectMemberList.length === 0) {
          result = true
        }

        return result
      }
    },
    /**
     * 画面に表示するメンバー情報の取得
     *
     * @param {object[]} chatMemberList グループチャットに所属しているメンバーリスト
     * @return {object[]} 画面に表示するメンバー情報
     */
    getFilterChatMemberList() {
      return (chatMemberList) => {
        const filterChatMemberList = chatMemberList.filter(
          (data, index) => index < this.maxShowUser
        )

        return filterChatMemberList
      }
    },
    /**
     * メンバーの選択状態の取得
     */
    checkSelectMember() {
      return (userId) => {
        const targetIndex = this.selectMemberList.findIndex(
          (data) => data.userId === userId
        )

        return targetIndex >= 0
      }
    },
  },
  created() {
    // this.getCustomerList() // 顧客一覧の取得 ph1では対象外
    this.getRecentlyMessageList() // 最近チャットしたメンバーの取得
  },
  methods: {
    ...mapMutations('community/message', [
      'setShowMessageBlockFlg',
      'setShowMessageChatAreaFlg',
      'setSelectGroupId',
      'setSelectStorageObjectId',
    ]),
    /**
     * 顧客一覧の取得
     */
    getCustomerList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCustomerList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.customerList = resData.data.customerList
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
     * 最近チャットしたメンバーの取得
     */
    getRecentlyMessageList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getRecentlyMessageList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.chatGroupList = resData.data.chatGroupList
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
     * メンバーや会社を検索
     */
    searchMember() {
      const paramData = {
        searchText: this.searchText,
      }

      if (this.searchText.length === 0) {
        this.searchFlg = false
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .getCommunitySearchResultData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.searchFlg = true
            this.searchResultList = resData.data.memberResultList
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
     * グループ選択処理
     *
     * @param {number} userId  ユーザーID
     */
    changeSelectGroup(groupId) {
      this.selectCustomerUser = ''
      this.selectRecentMessageGroup = groupId
    },
    /**
     * メッセージ一覧画面に遷移
     */
    transitionMessageList() {
      this.$router.push('/community/message/')
      this.closeMessageBlock()
    },
    /**
     * メッセージブロックの非表示
     */
    closeMessageBlock() {
      this.searchFlg = false
      this.searchText = ''
      this.$common.setAreaLabel(null, '', '')
      this.setShowMessageBlockFlg(false)
    },
    /**
     * メッセージ開始処理
     */
    startMessageChat() {
      if (this.searchFlg) {
        this.startChatGroup() // メッセージグループ開始APIの呼び出し
      } else {
        this.setSelectGroupId(Number(this.selectRecentMessageGroup))
        this.setSelectStorageObjectId(
          this.chatGroupList.find(
            (data) => data.messageGroupId === this.selectRecentMessageGroup
          ).storageObjectId
        )
        this.setShowMessageChatAreaFlg(true)
      }
    },
    /**
     * メッセージグループ開始APIの呼び出し
     */
    startChatGroup() {
      const paramData = {
        memberIdList: this.selectMemberList.map((data) => data.userId),
      }

      this.$common.addCallApiNum()
      this.$api
        .startChatGroup(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setSelectGroupId(resData.data.messageGroupId)
            this.setSelectStorageObjectId(resData.data.storageObjectId)
            this.setShowMessageChatAreaFlg(true)
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
     * 選択メンバーの更新
     *
     * @param {Object} memberInfo 選択したユーザー情報
     */
    updateSelectMemberList(memberInfo) {
      const targetIndex = this.selectMemberList.findIndex(
        (data) => data.userId === memberInfo.userId
      )

      if (targetIndex >= 0) {
        this.checkMemberList.splice(targetIndex, 1)
        this.selectMemberList.splice(targetIndex, 1)
      } else {
        this.checkMemberList.push(memberInfo.userId)
        this.selectMemberList.push(memberInfo)
      }
    },
    /**
     * 対象のユーザーを選択リストから取り除く
     *
     * @param {number} 対象ユーザーのユーザーID
     */
    removeSelectMember(userId) {
      const targetIndex = this.selectMemberList.findIndex(
        (data) => data.userId === userId
      )

      this.selectMemberList.splice(targetIndex, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.selectMessageUser {
  height: 100%;
  .header {
    padding: 32px 24px 24px 24px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-cancel {
        cursor: pointer;
      }
    }
    .search-member {
      margin-top: 24px;
    }
    .back-link {
      display: flex;
      align-items: center;
      margin-top: 12px;
      .icon {
        fill: #007aff;
        transform: scale(-1, 1);
      }
    }
  }
  .contents {
    padding: 0 24px;
    max-height: calc(100vh - 426px);
    overflow: auto;
    position: relative;
    .input-radio {
      -webkit-appearance: none;
      appearance: none;
      background: #f7f8f9;
      border: 1px solid #d3d3d3;
      border-radius: 50%;
      display: block;
      height: 18px;
      width: 18px;
      &:checked {
        border: 5px solid #007aff;
      }
    }
    .customer-list,
    .member-list,
    .search-list {
      .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        margin-bottom: 24px;
        p {
          font-size: 17px;
          font-weight: 500;
        }
      }
      .profile-list {
        li {
          display: flex;
          align-items: center;
          padding: 16px 0;
          &:first-child {
            border-top: 1px solid #e5e5e5;
          }

          .input-radio {
            cursor: pointer;
          }
          .member-image {
            display: flex;
            width: 64px;
            margin-left: 24px;
            .image {
              width: 48px;
              height: 48px;
              &:first-child {
                z-index: 10;
              }
              &:not(:first-child) {
                margin-left: -32px;
              }
              img {
                width: 100%;
              }
            }
          }
          .name {
            margin-left: 16px;
          }
          .date {
            font-size: 13px;
            color: #8d8d8d;
            margin-left: auto;
            align-self: flex-start;
          }
          .profile-detail {
            flex: 1;
            .company,
            .position {
              font-size: 13px;
            }
          }
        }
      }
      .search-member-list {
        li {
          display: flex;
          align-items: center;
          padding: 16px 0;
          &:first-child {
            border-top: 1px solid #e5e5e5;
          }
          .checkbox {
            display: inline-block;
            width: 18px;
          }
          .checkbox-member {
            display: inline-block;
            cursor: pointer;
          }
          .image {
            display: flex;
            margin-left: 24px;
          }
          .profile-detail {
            flex: 1;
            margin-left: 16px;
            .company,
            .position {
              font-size: 13px;
            }
          }
          .date {
            font-size: 13px;
            color: #8d8d8d;
            margin-left: 12px;
          }
        }
      }
      .image {
        width: 48px;
        height: 48px;
        img {
          width: 100%;
        }
      }
    }
    .member-list {
      margin-top: 40px;
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-top: 1px solid #e5e5e5;
    padding: 32px;
    .select-member-list {
      display: flex;
      width: 100%;
      height: 48px;
      margin: 16px 0;
      overflow: auto;
      li {
        position: relative;
        &:not(:first-child) {
          margin-left: 4px;
        }
        .image {
          width: 48px;
          height: 48px;
          img {
            width: 100%;
          }
        }
        .icon-delete {
          position: absolute;
          top: 0;
          right: 0;
          fill: #3a435c;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
      }
    }
    .btn {
      margin-top: 16px;
    }
  }
}
// MQ
@include mq(sp) {
  //SPView

  .messageArea {
    box-shadow: none;
    margin-top: 64px;
  }
  .selectMessageUser {
    height: 100vh;
    .messageArea {
      height: 100vh;
      overflow: hidden;
    }
    .selectMessageUser {
      height: 100vh;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      flex-direction: column;
    }
    .header {
      width: 100%;
    }
    .contents {
      overflow: auto;
      width: calc(100vw - (24px * 2));
      flex: 1;
      margin: 0 auto;
      padding: 0;
    }
    .profile-list li {
      border-top: 1px solid #e5e5e5;
    }
    .footer {
      background: #ffffff;
      position: static;
      margin-bottom: 0;
      width: 100%;
      margin-top: auto;
      .btn {
        width: 200px;
      }
    }
  }
}
// MQ
</style>
contents
