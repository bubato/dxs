<template>
  <div :class="{ isSp: isSp }" class="post-time-line">
    <PostProfile />
    <template v-if="$mq === 'lg' || isSp">
      <div class="timeline-field">
        <div class="timeline-input flex">
          <CustomInputText
            v-model="inputPostData.title"
            placeholder="投稿のタイトルを入力してください（任意）"
            maxlength="100"
            :validation="
              $common.getFormItemsDetail(formItems, 'title').validation
            "
          />
          <PseudoSelectBox
            v-if="!isGroup"
            ref="pseudoSelectBox"
            v-model="inputPostData.rangeStatus"
            :options="disclosureRangeOptions"
            class="timeline-publishing"
          />
        </div>
        <CustomInputTextarea
          v-model="inputPostData.comment"
          placeholder="どんなことを発信したいですか？"
          class="timeline-textarea"
          :height-variable="true"
          :init-show-row="2"
          :padding-type="1"
          :max-show-row="10"
          :validation="
            $common.getFormItemsDetail(formItems, 'comment').validation
          "
        />
        <div v-if="inputPostData.image" class="post-image">
          <img class="image" :src="inputPostData.image" />
          <div class="delete-image">
            <CancelSVG
              class="icon icon-cancel"
              @mouseover="$common.setAreaLabel($event, 'bottom', '削除')"
              @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')"
              @click="deletePostImage()"
            />
            <p>画像を削除</p>
          </div>
        </div>
        <OgpTemplateSetting
          :ogp-data-list="ogpDataList"
          :input-msg="inputPostData.comment"
          :image-size="{
            pcSize: '140',
            spSize: '120',
          }"
          delete-func="returnDeleteEvt"
          @update="setOgpDataList($event)"
          @start="isOgpGetStart = true"
          @end="isOgpGetStart = false"
        />
        <div class="timeline-output flex">
          <AttachFileSVG
            class="icon-clip icon-attachFile"
            @click="uploadPostImageFile()"
          />
          <button
            :class="{ 'btn-disabled': checkBtnDisabled() || isOgpGetStart }"
            class="btn btn-basic btn-short btn-post"
            @click="exePostFunc()"
          >
            投稿
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="spComment">
        <input
          type="text"
          placeholder="コメントを投稿"
          @click="showPostSpTimeLine()"
        />
      </div>
    </template>
    <!-- modal -->
    <FileUploadModal
      v-show="showFileUploadModalState && !isSp"
      file-type="image"
      :file-data="inputPostData.image"
      :is-sp-file-upload="isSpFileUpload"
      :is-sp="isSp"
      @uploaded="reflectImage($event)"
      @close="setShowFileUploadModalState(false)"
    />
    <!-- /modal -->
    <SpFileUpload
      ref="spFileUpload"
      file-type="image"
      @uploaded="reflectImage($event)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'PostTimeLine',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    isSp: {
      type: Boolean,
      default: false,
      required: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      isOgpGetStart: false,
      ogpDataList: [], // OGP必要データのオブジェクト配列
      defaultInputPostData: {
        title: '',
        comment: '',
        rangeStatus: '1',
        image: '',
      },
      inputPostData: {
        title: '',
        comment: '',
        rangeStatus: '1',
        image: '',
      },
      disclosureRangeOptions: [
        {
          icon: 'PublicSVG',
          code: '1',
          label: '全員に公開',
        },
        {
          icon: 'SupervisorAccountSVG',
          code: '2',
          label: 'つながりまで​',
        },
        {
          icon: 'LockSVG',
          code: '3',
          label: '自分だけ​',
        },
      ],
      formItems: [
        {
          id: 'title',
          validation: [],
        },
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
    }
  },
  computed: {
    ...mapState('community/common', ['myProfile']),
    ...mapState('community/timeline', [
      'showFileUploadModalState',
      'postEditMode',
      'selectTimeLineComment',
    ]),
    /**
     * SPファイルアップロード開始フラグ
     */
    isSpFileUpload() {
      return this.showFileUploadModalState && this.isSp
    },
    /**
     * ボタンの非活性処理
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.inputPostData) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.inputPostData[key]
            ) ||
            !this.inputPostData.comment
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
  },
  watch: {},
  created() {
    if (this.postEditMode) {
      this.setInitData()
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('community/timeline', [
      'resetSearchParam',
      'setShowFileUploadModalState',
      'setSpTimeLineMode',
      'setPostEditMode',
    ]),
    /**
     * 投稿編集内容を反映(投稿編集モード限定)
     */
    setInitData() {
      const editData = JSON.parse(JSON.stringify(this.selectTimeLineComment))

      this.inputPostData.title = editData.title
      this.inputPostData.comment = editData.comment
      this.inputPostData.rangeStatus = editData.rangeStatus
      this.inputPostData.image = editData.imgFilePath
    },
    setOgpDataList(dataList) {
      this.ogpDataList = dataList
    },
    /**
     * 投稿ボタン押下処理 登録 or 更新
     */
    exePostFunc() {
      if (!this.isGroup) {
        if (this.postEditMode) {
          this.updatePostComment() // 投稿内容の更新
        } else {
          this.postComment() // 投稿コメントの登録
        }
      } else {
        this.postGroupComment() // グループ投稿コメントの登録
      }
    },
    /**
     * 投稿コメントの登録
     */
    postComment() {
      const paramData = {
        title: this.inputPostData.title,
        comment: this.inputPostData.comment,
        image: this.inputPostData.image,
        rangeStatus: this.inputPostData.rangeStatus,
        ogpInformation: this.ogpDataList,
      }

      this.$common.addCallApiNum()
      this.$api
        .postComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.inputPostData = JSON.parse(
              JSON.stringify(this.defaultInputPostData)
            )
            this.ogpDataList = []
            this.resetSearchParam()
            this.mixin_getTimeLineList() // タイムラインの更新
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
          if (this.isSp) {
            this.emitEvent()
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 投稿内容の更新
     */
    updatePostComment() {
      const paramData = {
        postId: this.selectTimeLineComment.id,
        title: this.inputPostData.title,
        comment: this.inputPostData.comment,
        image: this.inputPostData.image,
        rangeStatus: this.inputPostData.rangeStatus,
        ogpInformation: this.ogpDataList,
        recordVersion: this.selectTimeLineComment.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updatePostComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setEditPostCommentScreen(resData.data.recordVersion) // 投稿編集内容を画面に反映
            this.isPostData = false
            this.$emit('close')
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
     * グループ投稿コメントの登録
     */
    postGroupComment() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
        title: this.inputPostData.title,
        comment: this.inputPostData.comment,
        image: this.inputPostData.image,
        ogpInformation: this.ogpDataList,
      }

      this.$common.addCallApiNum()
      this.$api
        .postGroupComment(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.inputPostData = JSON.parse(
              JSON.stringify(this.defaultInputPostData)
            )
            this.ogpDataList = []
            this.resetSearchParam()
            this.mixin_getPostGroupTimeLine() // グループタイムラインの更新
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
          if (this.isSp) {
            this.emitEvent()
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 投稿編集内容を画面に反映
     *
     * @param {number} newRecordVersion 新しいレコードバージョン
     */
    setEditPostCommentScreen(newRecordVersion) {
      const targetPostId = this.selectTimeLineComment.id
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))

      for (let i = 0; i < newTimeLineList.length; i++) {
        if (newTimeLineList[i].id === targetPostId) {
          newTimeLineList[i].title = this.inputPostData.title
          newTimeLineList[i].comment = this.inputPostData.comment
          newTimeLineList[i].rangeStatus = this.inputPostData.rangeStatus
          newTimeLineList[i].imgFilePath = this.inputPostData.image
          newTimeLineList[i].ogpInformation = this.ogpDataList
          newTimeLineList[i].recordVersion = newRecordVersion
          break
        }
      }

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * 選択画像の反映
     *
     * @param {string} imageData 選択画像のデータ
     */
    reflectImage(imageData) {
      this.inputPostData.image = imageData.fileImgPath

      if (imageData) {
        this.setShowFileUploadModalState(false)
      }
    },
    /**
     * 投稿設定画像の削除
     */
    deletePostImage() {
      this.inputPostData.image = ''
    },

    /**
     * 投稿エリアを閉じる
     */
    emitEvent() {
      this.$emit('close')
    },
    /**
     * 画像アップロードアイコン押下処理
     * PC:ファイルアップロードモーダルの表示 SP:ファイルアップロードダイアログの表示
     */
    uploadPostImageFile() {
      if (this.$mq === 'lg') {
        this.setShowFileUploadModalState(true)
      } else {
        this.$refs.spFileUpload.openFileDialog()
      }
    },
    /**
     * SP用の投稿画面の表示
     */
    showPostSpTimeLine() {
      this.setPostEditMode(false)
      this.setSpTimeLineMode(true)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.post-time-line {
  .profile-block {
    display: flex;
    align-items: center;
    margin-top: 24px;
    .profile {
      margin-left: 16px;
      flex: 1;
      .company,
      .position {
        font-size: 13px;
      }
      .position {
        margin-left: 12px;
      }
      .icon-public {
        margin-left: 8px;
        width: 16px;
        height: 16px;
        fill: #8d8d8d;
      }
    }
    .image {
      width: 48px;
      height: 48px;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
  }
  .spComment {
    padding: 0 16px;
    margin-top: 22px;
  }
}
.timeline {
  &-field {
    position: relative;
    width: 100%;
    margin: 24px 0 0 0;
    background: #f7f8f9;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    .timeline-textarea {
      ::v-deep .placeholder {
        top: 8px;
        left: 0;
      }
    }
  }
  &-input {
    margin: 12px 0 0 0;
    padding: 0 14px;
  }
  &-textarea {
    padding: 0 14px;
  }
  &-output {
    height: 48px;
    padding: 0 14px;
    border-top: 1px solid #e5e5e5;
  }
  &-publishing {
    margin-left: auto;
  }
}
.post-image {
  margin: 20px;
  text-align: center;
  position: relative;
  .image {
    max-width: 400px;
    @include mq(sp) {
      max-width: 100%;
    }
  }
  .delete-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    .icon {
      fill: #3a435c;
      cursor: pointer;
    }
    p {
      margin-left: 8px;
      height: 24px;
    }
  }
}
.icon {
  &-clip {
    fill: #b0b3be;
    transform: rotate(30deg);
    cursor: pointer;
  }
}

.btn {
  &-post {
    margin-left: auto;
  }
}

.custom-input-text /deep/ {
  flex: 1;
  .custom-input-text-block {
    input[type='text'] {
      height: 30px;
      padding: 0;
      border: none;
      font-size: 20px;
      background: transparent;
      &:focus {
        box-shadow: none;
        border: none;
      }
    }
  }
}
.custom-input-textarea /deep/ {
  textarea {
    height: 44px;
    padding: 0;
    border: none;
    font-size: 15px;
    background: transparent;
    overflow: auto;
    &:focus {
      box-shadow: none;
      border: none;
    }
  }
}
// MQ
@include mq(sp) {
  .isSp {
    .timeline-field {
      position: static;
    }
    .timeline-publishing {
      position: absolute;
      top: 78px;
      right: 16px;
    }
  }
  .image img {
    width: 48px !important;
    height: 48px !important;
  }
}
// MQ
</style>
