import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/timeline', [
      'timeLineList',
      'maxTimeLineNum',
      'searchParam',
    ]),
  },
  methods: {
    ...mapMutations('community/common', [
      'setMyProfile',
      'setMyConnectionList',
    ]),
    ...mapMutations('community/timeline', [
      'setTimeLineList',
      'setMaxTimeLineNum',
    ]),
    ...mapMutations('community/message', ['setRecentGroupList']),
    ...mapMutations('community/group', ['setJoinGroup']),
    /**
     * タイムラインリストの取得
     */
    mixin_getTimeLineList() {
      const paramData = {
        start: this.searchParam.start,
        count: this.searchParam.count,
      }

      this.$common.addCallApiNum()
      this.$api
        .getTimeLineList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            let timeLineList = resData.data.postList || []

            if (timeLineList.length > 0) {
              timeLineList = this.getDeleteSameIdTimeLineList(timeLineList)
              timeLineList = this.getAddCommentMoreTimeLineList(
                timeLineList,
                false
              )
            }

            this.setConcatTimeLineList(timeLineList)
            this.setMaxTimeLineNum(resData.data.allCount)
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
     * 対象のタイムライン投稿の内容を取得
     */
    mixin_getPostTimeLineComment() {
      const paramData = {
        postId: this.$route.params.postId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getPostTimeLineComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            let timeLineList = []

            timeLineList.push(resData.data.post)
            timeLineList = this.getAddCommentMoreTimeLineList(
              timeLineList,
              true
            )

            this.setTimeLineList(timeLineList)
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
     * タイムラインリストの取得(自分の投稿のみ)
     */
    mixin_getTargetUserTimeLineList(userId) {
      const paramData = {
        userId,
        start: this.searchParam.start,
        count: this.searchParam.count,
      }

      this.$common.addCallApiNum()
      this.$api
        .getTargetUserTimeLineList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            let timeLineList = resData.data.postList || []

            if (timeLineList.length > 0) {
              timeLineList = this.getDeleteSameIdTimeLineList(timeLineList)
              timeLineList = this.getAddCommentMoreTimeLineList(
                timeLineList,
                false
              )
            }

            this.setConcatTimeLineList(timeLineList)
            this.setMaxTimeLineNum(resData.data.allCount)
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
     * 最近のグループタイムライン投稿の内容を取得
     */
    mixin_getPostGroupRecentTimeLine() {
      const paramData = {
        start: this.searchParam.start,
        count: this.searchParam.count,
      }

      this.$common.addCallApiNum()
      this.$api
        .getPostGroupRecentTimeLine(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            let timeLineList = resData.data.postList || []

            if (timeLineList.length > 0) {
              timeLineList = this.getDeleteSameIdTimeLineList(timeLineList)
              timeLineList = this.getAddCommentMoreTimeLineList(
                timeLineList,
                false
              )
            }

            this.setConcatTimeLineList(timeLineList)
            this.setMaxTimeLineNum(resData.data.allCount)
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
     * 投稿グループタイムラインの取得
     */
    mixin_getPostGroupTimeLine() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
        start: this.searchParam.start,
        count: this.searchParam.count,
      }

      this.$common.addCallApiNum()
      this.$api
        .getPostGroupTimeLine(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            let timeLineList = resData.data.postList || []

            if (timeLineList.length > 0) {
              timeLineList = this.getDeleteSameIdTimeLineList(timeLineList)
              timeLineList = this.getAddCommentMoreTimeLineList(
                timeLineList,
                false
              )
            }

            this.setConcatTimeLineList(timeLineList)
            this.setMaxTimeLineNum(resData.data.allCount)
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
     * 重複したIDのデータを削除
     */
    getDeleteSameIdTimeLineList(timeLineList) {
      timeLineList = timeLineList.filter((data) => {
        let result = true

        for (let i = 0; i < this.timeLineList.length; i++) {
          if (this.timeLineList[i].id === data.id) {
            result = false
          }
        }

        return result
      })

      return timeLineList
    },
    /**
     * 逐次読み込みで追加した配列と結合したタイムラインリストを設定
     */
    setConcatTimeLineList(timeLineList) {
      let newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))
      newTimeLineList = newTimeLineList.concat(timeLineList)

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * コメント展開フラグの設定
     *
     * @param {object[]} timeLineList タイムラインリスト
     * @param {boolean} initOpenComment コメント展開フラグの初期値
     * @returns {object[]} タイムラインリスト
     */
    getAddCommentMoreTimeLineList(timeLineList, initOpenComment) {
      for (let i = 0; i < timeLineList.length; i++) {
        timeLineList[i].moreComment = false
        timeLineList[i].showMoreCommentFlg = initOpenComment
        timeLineList[i].replyCommentNum = timeLineList[i].replyCommentNum || 0
        if (timeLineList[i].replyCommentList) {
          for (let j = 0; j < timeLineList[i].replyCommentList.length; j++) {
            timeLineList[i].replyCommentList[j].moreComment = false
            timeLineList[i].replyCommentList[
              j
            ].showMoreChildCommentFlg = initOpenComment
            if (timeLineList[i].replyCommentList[j].replysCommentList) {
              for (
                let k = 0;
                k <
                timeLineList[i].replyCommentList[j].replysCommentList.length;
                k++
              ) {
                timeLineList[i].replyCommentList[j].replysCommentList[
                  k
                ].moreComment = false
              }
            }
          }
        }
      }

      return timeLineList
    },
    mixin_getMyProfile() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMyProfile(resData.data.profile)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    mixin_getMyConnectionList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getConnectionList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMyConnectionList(resData.data.connectionList)
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
     * プロフィールページに遷移 自分のプロフィールの場合にはURLにuserIdを付与させない
     * @param {number} userId ユーザーID
     */
    mixin_showSelectUserProfile(userId) {
      let url = '/community/profile/'

      if (this.myProfile.userId !== userId) {
        url += String(userId) + '/'
      }

      this.$router.push(url)
    },
    /**
     * 最近チャットしたメンバーの取得
     */
    mixin_getRecentlyMessageList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getRecentlyMessageList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const recentGroupList = resData.data.chatGroupList

            this.setRecentGroupList(recentGroupList)
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
     * 自分がグループの管理者かどうかのチェック
     *
     * @param {number} 管理者ID
     * @return {boolean} true:管理者 false:管理者以外
     */
    mixin_checkGroupAdminUser(adminUserId) {
      return this.myProfile.userId === adminUserId
    },
    /**
     * 投稿グループ一覧の取得
     */
    mixin_getJoinGroupList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getJoinGroupList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setJoinGroup({
              accountingFirmPostGroups: resData.data.accountingFirmPostGroups,
              adminPostGroups: resData.data.adminPostGroups,
              participationPostGroups: resData.data.participationPostGroups,
            })
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
