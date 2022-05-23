<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="message-chat">
    <div class="header">
      <div
        class="header-block"
        @click="showJoinMemberListFlg = !showJoinMemberListFlg"
      >
        <div class="member">
          <ul class="member-image-list">
            <li
              v-for="member in getFilterChatMemberList()"
              :key="member.userId"
            >
              <div class="image">
                <img :src="$common.getProfileImg(member.image)" />
              </div>
            </li>
          </ul>
          <div class="member-name">
            <p
              v-for="(member, index) in getFilterChatMemberList()"
              :key="member.userId"
            >
              {{ member.name }}
              <span
                v-if="
                  index === maxShowUser - 1 &&
                  getNotDeleteMemberList().length > maxShowUser
                "
                class="sum"
              >
                ＋{{ getNotDeleteMemberList().length - maxShowUser }}
              </span>
            </p>
          </div>
        </div>
        <CancelSVG class="icon-cancel" @click="closeMessageBlock()" />
      </div>
      <div v-show="showJoinMemberListFlg" class="join-member">
        <h5>メッセージに参加中のメンバー</h5>
        <ul class="join-member-list">
          <li v-for="member in getNotDeleteMemberList()" :key="member.userId">
            <div class="image" @click="showSelectUserProfile(member.userId)">
              <img :src="$common.getProfileImg(member.image)" />
            </div>
            <div class="profile">
              <p class="name">{{ member.name }}</p>
              <p class="company">{{ member.company }}</p>
              <p class="position">{{ member.position }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="back-link">
        <KeyboardArrowRightSVG class="icon icon-keyboardArrowRight" />
        <a class="link-text" @click="backBeforeScreen()">メッセージを閉じる</a>
      </div>
    </div>
    <div class="contents">
      <ul class="message-list">
        <li v-for="(message, index1) in messageList" :key="index1">
          <p class="date">{{ message.date }}</p>
          <ul class="message-detail-list">
            <li v-for="(item, index2) in message.items" :key="index2">
              <div v-if="item.myMessageFlg" class="my-message">
                <template v-if="!item.deleteFlag">
                  <div class="message-block">
                    <div class="message-menu">
                      <button
                        class="btn-menu"
                        @click="showMessageMenuDialog(item)"
                        @mouseover="
                          $common.setAreaLabel($event, 'top', 'メニュー')
                        "
                        @mouseleave="$common.setAreaLabel($event, '', '')"
                        @blur="$common.setAreaLabel($event, '', '')"
                      >
                        <MoreHorizSVG class="icon-moreHoriz" />
                      </button>
                      <MessageMenuDialog
                        v-if="selectMessageId === item.id"
                        v-on-clickaway="resetSelectMessage"
                        class="menu-dialog"
                        @close="resetSelectMessage()"
                      />
                    </div>
                    <div class="already-read">
                      <p v-show="item.readUserId.length > 0" class="text">
                        既読{{ item.readUserId.length }}
                      </p>
                      <p class="time">{{ item.hour }}:{{ item.minutes }}</p>
                    </div>
                    <div class="message">
                      <div class="message-balloon" v-html="item.message"></div>
                    </div>
                  </div>
                  <ul
                    v-if="$common.checkArrayValue(item.imgArray)"
                    class="image-list"
                  >
                    <li v-for="(img, index) in item.imgArray" :key="index">
                      <img :src="img" />
                    </li>
                  </ul>
                  <ul
                    v-if="$common.checkArrayValue(item.movieArray)"
                    class="movie-list"
                  >
                    <li v-for="(movie, index) in item.movieArray" :key="index">
                      <video :src="movie" controls />
                    </li>
                  </ul>
                  <template v-if="$common.checkArrayValue(item.ogpInformation)">
                    <template v-for="ogpData in item.ogpInformation">
                      <OgpTemplate
                        :key="ogpData.url"
                        :ogp-data="ogpData"
                        :edit-comment="true"
                        :image-size="{
                          pcSize: '80',
                          spSize: '80',
                        }"
                        :is-description="{
                          pc: false,
                          sp: false,
                        }"
                        class="message-ogp"
                        @delete="
                          deleteMessageTimelineOwnOgp(
                            ogpData,
                            item,
                            message.date
                          )
                        "
                      />
                    </template>
                  </template>
                  <div v-if="item.fileName" class="download-file">
                    <DownloadSVG class="icon-download" />
                    <p
                      class="link"
                      @click="
                        getMessageFile(item.fileStorageObjectId, item.fileName)
                      "
                    >
                      {{ item.fileName }}
                    </p>
                  </div>
                </template>
                <template v-else>
                  <DeleteCommentMessage
                    message="このメッセージは<br />削除されました。"
                    :type="2"
                  />
                </template>
              </div>
              <div v-else class="other-message">
                <template v-if="!item.deleteFlag">
                  <div class="message-block">
                    <div class="image">
                      <img
                        v-if="!item.continueSameUser"
                        class="image"
                        :src="
                          $common.getProfileImg(
                            getMemberInfo(item.userId, 'image')
                          )
                        "
                        @click="showSelectUserProfile(item.userId)"
                      />
                    </div>
                    <div class="message">
                      <p v-if="!item.continueSameUser" class="name">
                        {{ getMemberInfo(item.userId, 'name') }}
                      </p>
                      <div class="message-balloon" v-html="item.message">
                        {{ item.message }}
                      </div>
                      <p class="time">{{ item.hour }}:{{ item.minutes }}</p>
                    </div>
                  </div>
                  <ul
                    v-if="$common.checkArrayValue(item.imgArray)"
                    class="image-list"
                  >
                    <li v-for="(img, index) in item.imgArray" :key="index">
                      <img :src="img" />
                    </li>
                  </ul>
                  <ul
                    v-if="$common.checkArrayValue(item.movieArray)"
                    class="movie-list"
                  >
                    <li v-for="(movie, index) in item.movieArray" :key="index">
                      <video :src="movie" controls />
                    </li>
                  </ul>
                  <template v-if="$common.checkArrayValue(item.ogpInformation)">
                    <template v-for="ogpData in item.ogpInformation">
                      <OgpTemplate
                        :key="ogpData.url"
                        :ogp-data="ogpData"
                        :edit-comment="false"
                        :image-size="{
                          pcSize: '80',
                          spSize: '80',
                        }"
                        :is-description="{
                          pc: false,
                          sp: false,
                        }"
                        class="message-ogp"
                        @delete="
                          deleteMessageTimelineOwnOgp(
                            ogpData,
                            item,
                            message.date
                          )
                        "
                      />
                    </template>
                  </template>
                  <div v-if="item.fileName" class="download-file">
                    <DownloadSVG class="icon-download" />
                    <p
                      class="link"
                      @click="
                        getMessageFile(item.fileStorageObjectId, item.fileName)
                      "
                    >
                      {{ item.fileName }}
                    </p>
                  </div>
                </template>
                <template v-else>
                  <DeleteCommentMessage
                    message="このメッセージは<br />削除されました。"
                    :type="2"
                  />
                </template>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="footerInner">
        <div v-if="inputFile.fileName" class="file-name">
          <CancelSVG
            class="icon-cancel"
            @mouseover="$common.setAreaLabel($event, 'right', '削除')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
            @click="deleteInputFile()"
          />
          <p>{{ inputFile.fileName }}</p>
        </div>
        <AttachFileSVG
          class="icon-clip icon-attachFile"
          @click="uploadFileData()"
        />
        <div class="input-comment">
          <CustomInputTextarea
            v-model="inputMessage"
            placeholder="コメントを投稿できます"
            class="input-comment-textarea"
            maxlength="2000"
            :height-variable="true"
            :validation="
              $common.getFormItemsDetail(formItems, 'comment').validation
            "
          />
          <!-- eslint-disable -->
          <button
            class="btn btn-utility"
            :class="{ 'btn-disabled': checkBtnDisabled() || isOgpGetStart }"
            @click="postMessage()"
          >
            送信
          </button>
        </div>
      </div>
      <OgpTemplateSetting
        v-show="false"
        :ogp-data-list="ogpDataList"
        :input-msg="inputMessage"
        :image-size="{
          pcSize: '80',
          spSize: '80',
        }"
        delete-func="returnDeleteEvt"
        @update="setOgpDataList($event)"
        @start="isOgpGetStart = true"
        @end="isOgpGetStart = false"
      />
    </div>
    <LocalOrStorageFileUploadModal
      v-if="showFileUploadModalState"
      ref="fileUploadModal"
      file-type="all"
      class="fileUploadModal"
      :max-file-size="10240"
      @newUploaded="selectNewFileData($event)"
      @existUploaded="selectExistFileData($event)"
      @delete="deleteSelectNewFileData()"
      @close="setShowFileUploadModalState(false)"
    />
    <SpFileUpload
      ref="spMessageFileUpload"
      file-type="all"
      @uploaded="selectNewFileData($event)"
    />
    <DeleteMessageModal
      v-if="showDeleteMessageModalState"
      @update="getCommunityMessageList(true)"
      @close="setShowDeleteMessageModalState(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'MessageChat',
  components: {},
  mixins: [clickaway, communityCommonMixin],
  data() {
    return {
      isOgpGetStart: false,
      chatMemberList: [],
      ogpDataList: [], // OGP必要データのオブジェクト配列
      defaultMessageList: [],
      messageList: [],
      maxShowUser: 2,
      inputMessage: '',
      inputFile: {
        file: null,
        fileName: '',
        fileStorageObjectId: null,
      },
      maxChatNum: 0,
      startMessageIndex: 0,
      getMessageNum: 50,
      selectMessageId: null,
      showJoinMemberListFlg: false,
      formItems: [
        {
          id: 'comment',
          validation: [
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
      ],
      presignedUrlData: {
        file: {},
        messageId: 0,
        fileName: '',
        filePath: '',
        recordVersion: 0,
      },
    }
  },
  computed: {
    ...mapState('community/message', [
      'selectGroupId',
      'showFileUploadModalState',
      'showDeleteMessageModalState',
      'selectMessage',
      'selectStorageObjectId',
    ]),
    ...mapState('community/common', ['myProfile']),
    ...mapState('common', ['callApiNum']),
    /**
     * メンバーの対象項目の情報の取得
     *
     * @param {number} userId ユーザーID
     * @param {string} key 対象項目のkey
     * @return メンバーの対象項目の情報の取得
     */
    getMemberInfo() {
      return (userId, key) => {
        let memberInfo = ''
        const targetUserInfo = this.chatMemberList.find(
          (data) => data.userId === userId
        )

        if (targetUserInfo) {
          memberInfo = targetUserInfo[key]

          if (key === 'name' && memberInfo === '') {
            memberInfo = '不明なメンバー'
          }
        }

        return memberInfo
      }
    },
    /**
     * 画面に表示するメンバー情報の取得
     *
     * @return {object[]} 画面に表示するメンバー情報
     */
    getFilterChatMemberList() {
      return () => {
        let count = 0
        const filterChatMemberList = this.chatMemberList.filter((data) => {
          let result = false

          if (data.deleteFlag === 0 && count < this.maxShowUser) {
            count++
            result = true
          }

          return result
        })

        return filterChatMemberList
      }
    },
    /**
     * 画面に表示するメンバー情報の取得
     *
     * @return {object[]} 画面に表示するメンバー情報
     */
    getNotDeleteMemberList() {
      return () => {
        const filterChatMemberList = this.chatMemberList.filter((data) => {
          let result = false

          if (data.deleteFlag === 0) {
            result = true
          }

          return result
        })

        return filterChatMemberList
      }
    },
    /**
     * ボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          !this.inputMessage ||
          this.$common.checkExistValidation(
            this.formItems,
            'comment',
            this.inputMessage
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.updateChatReadStatus() // 既読更新
    this.getCommunityMessageList(true) // メッセージ取得
  },
  mounted() {
    this.setScrollEvent() // スクロールイベントの設定
  },
  methods: {
    ...mapMutations('community/message', [
      'setShowMessageBlockFlg',
      'setShowMessageChatAreaFlg',
      'setShowFileUploadModalState',
      'setShowDeleteMessageModalState',
      'setSelectMessage',
    ]),
    /**
     * 取得したOGPをセット
     *
     * @param {Object} dataList OGPデータリスト
     */
    setOgpDataList(dataList) {
      this.ogpDataList = dataList
    },
    /**
     * メッセージタイムラインOGP削除
     *
     * @param {Object} ogpData OGPデータ
     * @param {Object} messageInfo メッセージ情報
     * @param {String} targetDate メッセージの日付
     */
    deleteMessageTimelineOwnOgp(ogpData, messageInfo, targetDate) {
      const paramData = {
        messageId: messageInfo.id,
        inputUrl: ogpData.inputUrl,
        recordVersion: messageInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteMessageTimelineOwnOgp(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            // 成功 メッセージ更新
            this.deleteOgpScreen(
              messageInfo.id,
              ogpData.inputUrl,
              resData.data.recordVersion,
              targetDate
            )
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
     * 画面に表示しているOGP情報を削除
     *
     * @param {Number} messageId メッセージID
     * @param {String} targetUrl OGPのURL
     * @param {Number} newRecordVersion 更新後のレコードバージョン
     * @param {String} targetDate メッセージの日付
     */
    deleteOgpScreen(messageId, targetUrl, newRecordVersion, targetDate) {
      const newMessageList = JSON.parse(JSON.stringify(this.messageList))
      const targetDateMessageList = newMessageList.find(
        (data) => data.date === targetDate
      )
      const targetMessage = targetDateMessageList.items.find(
        (data) => data.id === messageId
      )

      targetMessage.ogpInformation = targetMessage.ogpInformation.filter(
        (data) => data.inputUrl !== targetUrl
      )
      targetMessage.recordVersion = newRecordVersion

      this.messageList = newMessageList
    },
    /**
     * スクロールイベントの設定
     */
    setScrollEvent() {
      document.querySelector('.message-chat .contents').onscroll = () => {
        const targetEle = document.querySelector('.message-chat .contents')

        if (
          this.maxChatNum !== this.defaultMessageList.length &&
          this.callApiNum === 0 &&
          targetEle.scrollTop === 0
        ) {
          this.startMessageIndex += this.getMessageNum
          this.getCommunityMessageList(false)
        }
      }
    },
    /**
     * 既読更新
     */
    updateChatReadStatus() {
      const paramData = {
        messageGroupId: this.selectGroupId,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateChatReadStatus(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getRecentlyMessageList()
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
     * メッセージ取得
     *
     * @param {boolean} init true:初期表示 false:逐次読み込み
     */
    getCommunityMessageList(init) {
      const paramData = {
        messageGroupId: this.selectGroupId,
        start: this.startMessageIndex,
        count: this.getMessageNum,
      }

      this.$common.addCallApiNum()
      this.$api
        .getCommunityMessageList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.maxChatNum = resData.data.allCount
            this.setDateHourMinutesMessageList(resData.data.messageList)
            this.chatMemberList = resData.data.chatMemberList

            if (init) {
              this.defaultMessageList = resData.data.messageList
              this.messageList = this.getShowMessageList(
                this.defaultMessageList.slice().reverse()
              )
              this.$nextTick(() => {
                const targetEle = document.querySelector(
                  '.message-chat .message-list'
                )

                if (targetEle) {
                  targetEle.scrollIntoView(false)
                }
              })
            } else {
              const targetEle = document.querySelector(
                '.message-chat .contents'
              )
              const scrollTop =
                targetEle.scrollHeight -
                targetEle.clientHeight -
                targetEle.scrollTop

              this.$nextTick(() => {
                const targetEle = document.querySelector(
                  '.message-chat .contents'
                )
                targetEle.scrollTop =
                  targetEle.scrollHeight - targetEle.clientHeight - scrollTop
              })

              this.defaultMessageList = this.getConcatMessageList(
                resData.data.messageList
              )
              this.messageList = this.getShowMessageList(
                this.defaultMessageList.slice().reverse()
              )
            }
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
     * 日付データの設定
     */
    setDateHourMinutesMessageList(messageList) {
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].date.length === 16) {
          messageList[i].hour = messageList[i].date.split(' ')[1].split(':')[0]
          messageList[i].minutes = messageList[i].date
            .split(' ')[1]
            .split(':')[1]
          messageList[i].date = messageList[i].date.split(' ')[0]
        }
      }
    },
    /**
     * 逐次読み込みで追加した配列と結合したメッセージリストを設定
     *
     * @param {object[]} messageList 結合対象のメッセージリスト
     * @return {object[]} 結合したメッセージリスト
     */
    getConcatMessageList(messageList) {
      let newMessageList = JSON.parse(JSON.stringify(this.defaultMessageList))

      // 重複データの削除
      messageList = messageList.filter((data) => {
        let result = true

        for (let i = 0; i < this.defaultMessageList.length; i++) {
          if (this.defaultMessageList[i].id === data.id) {
            result = false
          }
        }

        return result
      })

      newMessageList = newMessageList.concat(messageList)

      return newMessageList
    },
    /**
     * 画面表示用のメッセージリストを取得
     *
     * @param {object[]} メッセージリスト
     * @return {object[]} 画面表示用のメッセージリスト
     */
    getShowMessageList(messageList) {
      const targetMessageList = JSON.parse(JSON.stringify(messageList))
      const showMessageList = []

      for (let i = 0; i < targetMessageList.length; i++) {
        const date = targetMessageList[i].date
        const findIndex = showMessageList.findIndex(
          (data) => data.date === date
        )

        targetMessageList[i].message = this.$common
          .replaceLinkTag(targetMessageList[i].message)
          .replace(/\n/g, '<br/>')

        const urls = this.$common
          .getUrlInStr(targetMessageList[i].message)
          .filter((x, i, self) => {
            return self.indexOf(x) === i
          })

        targetMessageList[i].imgArray = this.$common.getTargetMediaUrls(
          urls,
          'img'
        )
        targetMessageList[i].movieArray = this.$common.getTargetMediaUrls(
          urls,
          'movie'
        )

        if (targetMessageList[i].userId === this.myProfile.userId) {
          targetMessageList[i].myMessageFlg = true
        } else {
          targetMessageList[i].myMessageFlg = false
        }
        targetMessageList[i].continueSameUser = false

        if (findIndex >= 0) {
          const beforeUserId =
            showMessageList[findIndex].items[
              showMessageList[findIndex].items.length - 1
            ].userId

          if (beforeUserId === targetMessageList[i].userId) {
            targetMessageList[i].continueSameUser = true
          }

          showMessageList[findIndex].items.push(targetMessageList[i])
        } else {
          const addData = {}
          addData.date = targetMessageList[i].date
          addData.items = []
          addData.items.push(targetMessageList[i])
          showMessageList.push(addData)
        }
      }

      return showMessageList
    },
    /**
     * 添付ファイルの削除
     */
    deleteInputFile() {
      this.inputFile.fileData = null
      this.inputFile.fileName = ''
    },
    /**
     * メッセージブロックの非表示
     */
    closeMessageBlock() {
      this.setShowMessageChatAreaFlg(false)
      this.setShowMessageBlockFlg(false)
    },
    /**
     * メッセージを送信ボタン押下処理
     */
    postMessage() {
      if (this.inputFile.file !== null) {
        this.getStorageUploadUrl() // アップロードURL取得APIの呼び出し
      } else if (this.inputFile.fileStorageObjectId !== null) {
        this.copyStorageObject() // ファイルコピーAPIの呼び出し
      } else {
        this.postCommunityMessage() // メッセージを送信(メッセージ投稿API)
      }
    },
    /**
     * アップロードURL取得APIの呼び出し
     */
    getStorageUploadUrl() {
      const paramData = {
        parentId: this.selectStorageObjectId,
        name: this.inputFile.fileName,
        fileSize: this.inputFile.file.size,
        type: this.inputFile.file.type,
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageUploadUrl(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.presignedUrlData.uploadURL = resData.data.uploadURL
            this.presignedUrlData.filePath = resData.data.filePath
            this.putStorageFileForUploadUrl() // 取得したURLにてpresignedUrlにてファイルをアップロード
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
     * 取得したURLにてpresignedUrlにてファイルをアップロード
     */
    putStorageFileForUploadUrl() {
      const paramData = {
        url: this.presignedUrlData.uploadURL,
        fileType: this.inputFile.file.type,
        fileData: this.inputFile.file,
      }

      this.$common.addCallApiNum()
      this.$api
        .putStorageFileForUploadUrl(paramData)
        .then(() => {
          this.registStorageFiles()
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ファイル登録APIの呼び出し
     */
    registStorageFiles() {
      const paramData = {
        parentId: this.selectStorageObjectId,
        name: this.inputFile.fileName,
        filePath: this.presignedUrlData.filePath,
        fileSize: this.inputFile.file.size,
        renameFlag: 1,
      }

      this.$common.addCallApiNum()
      this.$api
        .registStorageFiles(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.inputFile.fileStorageObjectId = resData.data.storageObjectId
            this.postCommunityMessage()
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
     * ファイルコピーAPI
     */
    copyStorageObject() {
      const paramData = {
        id: this.inputFile.fileStorageObjectId,
        parentId: this.selectStorageObjectId,
      }

      this.$common.addCallApiNum()
      this.$api
        .copyStorageObject(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.inputFile.fileStorageObjectId = resData.data.storageObjectId
            this.postCommunityMessage() // メッセージを送信(メッセージ投稿API)
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
     * 入力内容のリセット
     */
    resetInputData() {
      this.startMessageIndex = 0
      this.inputMessage = ''
      this.inputFile.file = null
      this.inputFile.fileName = ''
      this.inputFile.fileStorageObjectId = null
      this.ogpDataList = []
      this.presignedUrlData = {
        file: {},
        messageId: 0,
        fileName: '',
        filePath: '',
        recordVersion: 0,
      }
    },
    /**
     * メッセージを送信(メッセージ投稿API)
     */
    postCommunityMessage() {
      const paramData = this.getPostMessageParam()

      this.$common.addCallApiNum()
      this.$api
        .postCommunityMessage(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            // ファイルデータがある場合S3へ保存
            this.getCommunityMessageList(true)
            this.resetInputData() // 入力内容のリセット
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
     * メッセージ投稿APIのリクエストパラメータの取得
     *
     * @return {object} メッセージ投稿APIのリクエストパラメータ
     */
    getPostMessageParam() {
      const requestParam = {
        messageGroupId: this.selectGroupId,
        message: this.inputMessage,
        ogpInformation: this.ogpDataList,
      }

      if (this.inputFile.fileName) {
        requestParam.fileStorageObjectId = this.inputFile.fileStorageObjectId
      }

      return requestParam
    },
    /**
     * FileUpLoadModalにて新規ファイルを選択
     *
     * @param {Object} returnFileData ファイルデータ
     */
    selectNewFileData(returnFileData) {
      this.inputFile.file = returnFileData.file
      this.inputFile.fileName = returnFileData.fileName
      this.inputFile.fileStorageObjectId = null
    },
    /**
     * FileUpLoadModalにて新規ファイルの選択を解除
     */
    deleteSelectNewFileData() {
      this.inputFile.file = null
      this.inputFile.fileName = ''
    },
    /**
     * FileUpLoadModalにて既存ファイルを選択
     *
     * @param {Object} returnFileData ファイルデータ
     */
    selectExistFileData(returnFileData) {
      this.deleteSelectNewFileData() // FileUpLoadModalにて新規ファイルの選択を解除
      this.inputFile.fileStorageObjectId = returnFileData.fileStorageObjectId
      this.inputFile.fileName = returnFileData.fileName
    },
    /**
     * メッセージに紐づいている添付ファイルをダウンロード
     *
     * @param {number} fileStorageObjectId 添付ファイルストレージオブジェクトID
     * @param {string} fileName ファイル名
     */
    getMessageFile(fileStorageObjectId, fileName) {
      const paramData = {
        id: fileStorageObjectId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageDownload(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const dataURI = resData.data.downloadURL

            this.$common.downloadFile(dataURI, fileName)
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
     * チャット画面を閉じ、ユーザー選択一覧に戻る
     */
    backBeforeScreen() {
      this.setShowMessageChatAreaFlg(false)
    },
    /**
     * チャット画面を閉じ、選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(userId) {
      this.closeMessageBlock()
      this.mixin_showSelectUserProfile(userId)
    },
    /**
     * メッセージダイアログの表示
     */
    showMessageMenuDialog(selectMessage) {
      this.setSelectMessage(selectMessage)
      this.selectMessageId = selectMessage.id
    },
    /**
     * メッセージダイアログの非表示
     */
    resetSelectMessage() {
      this.selectMessageId = null
    },
    /**
     * ファイルのアップロード処理
     * PC:ファイルアップロードモーダルの表示 SP:ファイル選択ダイアログの表示
     */
    uploadFileData() {
      if (this.$mq === 'lg') {
        this.setShowFileUploadModalState(true)
      } else {
        this.$refs.spMessageFileUpload.openFileDialog()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.message-chat {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    padding: 0 32px;
    &-block {
      display: flex;
      justify-content: space-between;
      padding: 32px 0 24px 0;
      cursor: pointer;
      .member {
        display: flex;
        align-items: center;
        &-image-list {
          display: flex;
          position: relative;
          li {
            &:first-child {
              z-index: 10;
            }
            &:not(:first-child) {
              margin-left: -32px;
            }
            .image {
              width: 48px;
              height: 48px;
              img {
                width: 100%;
              }
            }
          }
        }
        &-name {
          margin-left: 18px;
          width: 216px;
          .sum {
            margin-left: 24px;
          }
        }
      }
      .search-member {
        margin-top: 24px;
      }
    }
    .join-member {
      h5 {
        padding: 24px 0;
        text-align: center;
        border-top: 1px solid #e5e5e5;
      }
      &-list {
        li {
          display: flex;
          padding: 16px 0;
          border-top: 1px solid #e5e5e5;
          &:last-child {
            border-bottom: 1px solid #e5e5e5;
          }
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
              &:first-child {
                font-size: 13px;
                margin-top: 2px;
              }
            }
          }
        }
      }
    }
    .back-link {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      padding: 12px 0;
      .icon {
        fill: #007aff;
        transform: scale(-1, 1);
      }
    }
  }

  .contents {
    overflow: auto;
    flex: 1;
    .date {
      font-size: 12px;
      margin-bottom: 16px;
      text-align: center;
    }
    .message-list {
      width: 336px;
      margin: auto;
      padding: 24px 0;
      li {
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .message-detail-list {
          li {
            &:not(:last-child) {
              margin-bottom: 16px;
            }
            .download-file {
              display: flex;
              align-items: center;
              margin-top: 16px;
              .icon-download {
                min-width: 24px;
                min-height: 24px;
                fill: #8d8d8d;
              }
              .link {
                color: #8d8d8d;
                margin-left: 4px;
                cursor: pointer;
              }
            }
            .my-message {
              .message-block {
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                position: relative;
                .message-menu {
                  display: flex;
                  flex-direction: column;
                  align-self: center;
                  position: relative;
                  .btn-menu {
                    cursor: pointer;
                  }
                }
                .already-read {
                  font-size: 12px;
                  color: #8d8d8d;
                  margin-left: 8px;
                }
                .message {
                  margin-left: 12px;
                  &-balloon {
                    width: 238px;
                    padding: 12px;
                    background: #e0efff;
                  }
                }
              }
              .image-list,
              .movie-list {
                padding-left: 60px;
              }
              .message-ogp {
                margin: 20px 0px 20px 98px;
              }
              .download-file {
                margin-left: 98px;
              }
              ::v-deep .delete-comment-message {
                margin-left: 60px;
              }
            }
            .other-message {
              .message-block {
                display: flex;
                position: relative;
                .image {
                  width: 48px;
                  height: 48px;
                  cursor: pointer;
                  img {
                    width: 100%;
                  }
                }
                .message {
                  margin-left: 12px;
                  flex: 1;
                  .name {
                    margin-bottom: 4px;
                    color: #8d8d8d;
                  }
                  &-balloon {
                    width: 238px;
                    padding: 12px;
                    background: #f0f2f5;
                  }
                }
                .time {
                  color: #8d8d8d;
                  margin-left: 8px;
                  font-size: 12px;
                  position: absolute;
                  right: 0;
                  bottom: 0;
                }
              }

              .message-ogp {
                margin: 20px 38px 20px 60px;
              }
              .download-file {
                margin-left: 60px;
              }
              ::v-deep .delete-comment-message {
                margin: 0 40px 0 60px;
              }
            }
            .image-list {
              margin-top: 10px;
              li {
                &:not(:last-child) {
                  margin-bottom: 5px;
                }
                img {
                  max-width: 100%;
                }
              }
            }
            .movie-list {
              margin-top: 10px;
              li {
                &:not(:last-child) {
                  margin-bottom: 5px;
                }
                video {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }

  .footerInner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 24px 0;
    position: relative;
    bottom: 0;
    border-top: 1px solid #e5e5e5;
    .icon-clip {
      fill: #b0b3be;
      cursor: pointer;
      align-self: flex-end;
      margin-bottom: 12px;
    }
    .file-name {
      display: flex;
      align-items: center;
      position: absolute;
      height: 17px;
      top: 2px;
      left: 22px;
      padding-top: 4px;
      .icon-cancel {
        width: 16px;
        height: 16px;
      }
      p {
        font-size: 12px;
        margin-left: 12px;
      }
    }
    .input-comment {
      position: relative;
      width: 334px;
      margin-left: 8px;
      .btn {
        position: absolute;
        bottom: 8px;
        right: 12px;
      }
    }
  }
}

.icon-cancel {
  cursor: pointer;
}
// MQ
@include mq(sp) {
  //SPView
  .message-chat {
    height: 100vh;
    height: -webkit-fill-available;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-direction: column;
    position: fixed;
    top: 0;
    background: #fff;
    .header {
      padding: 0 16px;
      width: 100%;
      min-height: 101px;
      max-height: 565px;
      overflow: hidden;
      .header-block {
        padding-bottom: 20px;
        border-bottom: #e5e5e5 1px solid;
      }
      .back-link {
        display: none;
      }
    }
    .contents {
      width: calc(100vw - (16px * 2));
      margin: 0 auto;
      flex: 1;
      height: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .message-list {
        width: calc(100vw - (32px * 2));
        margin: 0 auto;
        .message {
          flex: 1 !important;
        }
        li .message-detail-list li {
          .my-message {
            .message-balloon {
              width: 100% !important;
            }
            .message-ogp {
              margin: 20px 0px 20px 72px !important;
            }
            .download-file {
              margin-left: 72px;
            }
          }
          .other-message {
            .message-balloon {
              width: 85% !important;
            }
            .message-block {
              .message {
                .name {
                  font-size: 12px;
                }
              }
            }
          }
          .download-file .link {
            font-size: 13px;
          }
        }
      }
    }
    .footer {
      position: fixed;
      top: calc(100vh - 96px);
      background: #fff;
      position: static;
      width: 100%;
      margin-top: auto;
      min-height: 96px;
      margin-bottom: 0;
      .input-comment-textarea {
        ::v-deep textarea {
          font-size: 16px;
        }
      }
    }
  }
  /deep/ .fileUploadModal {
    .modal-container {
      width: calc(100% - 16px);
      margin: 0 auto;
    }
  }
}
// MQ
</style>
