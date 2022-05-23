<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div
          v-if="editTimeLineType === 'comment'"
          class="modal-container edit-comment"
        >
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_contents">
            <PostProfileBlock :parent-comment="selectTimeLineComment" />
            <div class="timeline-field">
              <div class="timeline-field-input flex">
                <CustomInputText
                  v-model="inputPostData.title"
                  placeholder="投稿のタイトルを入力してください（任意）"
                  class="timeline-field-input-title"
                  maxlength="100"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'title').validation
                  "
                />
                <PseudoSelectBox
                  v-if="
                    timeLineType === 0 && !selectTimeLineComment.postGroupName
                  "
                  ref="pseudoSelectBox"
                  v-model="inputPostData.rangeStatus"
                  :options="disclosureRangeOptions"
                  class="timeline-field-input-publishing"
                />
              </div>
              <CustomInputTextarea
                v-model="inputPostData.comment"
                placeholder="どんなことを発信したいですか？"
                class="timeline-field-textarea"
                :height-variable="true"
                :init-show-row="2"
                :padding-type="1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'comment').validation
                "
              />
              <div v-if="inputPostData.imgFilePath" class="post-image">
                <img class="image" :src="inputPostData.imgFilePath" />
                <div class="delete-image" @click="deletePostImage()">
                  <CancelSVG
                    class="icon icon-cancel"
                    @mouseover="$common.setAreaLabel($event, 'bottom', '削除')"
                    @mouseleave="$common.setAreaLabel($event, '', '')"
                    @blur="$common.setAreaLabel($event, '', '')"
                  />
                  <p>画像を削除</p>
                </div>
              </div>
              <OgpTemplateSetting
                ref="ogpTemplateSetting"
                :class="{ none: isPostData }"
                :ogp-data-list="inputPostData.ogpInformation"
                :input-msg="inputPostData.comment"
                :image-size="{
                  pcSize: '140',
                  spSize: '120',
                }"
                class="ogpTemplateSetting"
                @update="setOgpDataList($event)"
                @start="isOgpGetStart = true"
                @end="isOgpGetStart = false"
              />
            </div>

            <div class="footer">
              <AttachFileSVG
                class="icon-attachFile"
                @click="changeEditTimeLineType('image')"
              />
            </div>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-long"
              @click="hideEditTimeLineCommentModal()"
            >
              キャンセル
            </button>
            <button
              class="btn btn-basic btn-long"
              :class="{ 'btn-disabled': checkBtnDisabled() || isOgpGetStart }"
              @click="updatePostComment()"
            >
              OK
            </button>
          </div>
        </div>
        <div
          v-if="editTimeLineType === 'image'"
          class="modal-container edit-image"
        >
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <ToBackScreenLink
            label="投稿の編集に戻る"
            @click="changeEditTimeLineType('comment')"
          />
          <div class="modal_title">
            <h3>画像アップロード</h3>
          </div>
          <div class="modal_contents">
            <p class="context">
              アップロード可能なファイルサイズは1MBまで。拡張子は.{{
                imageAllowExts.join('、')
              }}が利用できます。
            </p>
            <FileUpload
              :file-data="inputPostData.imgFilePath"
              :max-size="maxSize"
              @uploaded="uploadedImageFile($event)"
              @deleted="deletePostImage()"
            />
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-long"
              @click="changeEditTimeLineType('comment')"
            >
              キャンセル
            </button>
            <button
              class="btn btn-basic btn-long"
              :class="{ 'btn-disabled': checkBtnDisabled() || isOgpGetStart }"
              @click="updatePostComment()"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'EditTimeLineCommentModal',
  components: {},
  mixins: [communityCommonMixin],
  props: {
    timeLineType: {
      type: Number,
      default: 0, // 0:通常 1:グループ(最近投稿したグループ画面) 2:グループタイムライン
      required: false,
    },
  },
  data() {
    return {
      isGroup: false,
      isOgpGetStart: false,
      isPostData: false,
      inputPostData: {
        title: '',
        comment: '',
        rangeStatus: '',
        imgFilePath: '',
        ogpInformation: [],
      },
      maxSize: 1024,
      editTimeLineType: 'comment', // comment or image
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
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
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
    ...mapState('community/timeline', [
      'selectTimeLineComment',
      'timeLineList',
    ]),
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
            )
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
    this.setInitPostData() // タイムライン投稿_初期値設定
  },
  methods: {
    ...mapMutations('community/timeline', ['setTimeLineList']),
    ...mapMutations('community/member', ['showCancelConfirmConnectionModal']),
    /**
     * タイムライン投稿_初期値設定
     */
    setInitPostData() {
      this.inputPostData.title = this.selectTimeLineComment.title
      this.inputPostData.comment = this.selectTimeLineComment.comment
      this.inputPostData.rangeStatus = this.selectTimeLineComment.rangeStatus
      this.inputPostData.imgFilePath = this.selectTimeLineComment.imgFilePath
      this.inputPostData.ogpInformation = this.selectTimeLineComment.ogpInformation

      if (
        this.timeLineType === 0 &&
        !this.selectTimeLineComment.postGroupName
      ) {
        this.isGroup = false
      } else {
        this.isGroup = true
      }
    },
    /**
     * 選択画像の削除
     */
    deletePostImage() {
      this.inputPostData.imgFilePath = ''
    },
    /**
     * 投稿内容の更新
     */
    updatePostComment() {
      const paramData = {
        postId: this.selectTimeLineComment.id,
        title: this.inputPostData.title,
        comment: this.inputPostData.comment,
        rangeStatus: this.isGroup ? '4' : this.inputPostData.rangeStatus,
        image: this.inputPostData.imgFilePath,
        ogpInformation: this.inputPostData.ogpInformation,
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
     * 投稿編集内容を画面に反映
     */
    setEditPostCommentScreen(newRecordVersion) {
      const targetPostId = this.selectTimeLineComment.id
      const newTimeLineList = JSON.parse(JSON.stringify(this.timeLineList))

      for (let i = 0; i < newTimeLineList.length; i++) {
        if (newTimeLineList[i].id === targetPostId) {
          newTimeLineList[i].title = this.inputPostData.title
          newTimeLineList[i].comment = this.inputPostData.comment
          newTimeLineList[i].rangeStatus = this.inputPostData.rangeStatus
          newTimeLineList[i].imgFilePath = this.inputPostData.imgFilePath
          newTimeLineList[i].ogpInformation = this.inputPostData.ogpInformation
          newTimeLineList[i].recordVersion = newRecordVersion
          break
        }
      }

      this.setTimeLineList(newTimeLineList)
    },
    /**
     * タイムライン編集モーダルを閉じる
     */
    hideEditTimeLineCommentModal() {
      this.$emit('close')
    },
    /**
     * 画像アップロード処理
     *
     * @param {object} data ファイルデータ
     */
    uploadedImageFile(data) {
      this.inputPostData.imgFilePath = data.fileImgPath
    },
    /**
     * タイムライン編集モードにも戻る
     *
     * @param {string} type モードタイプ(comment or image)
     */
    changeEditTimeLineType(type) {
      this.editTimeLineType = type
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
    /**
     * 削除操作後、OGPデータリストの更新
     *
     * @param {Object} ogpDataList OGPデータリスト
     */
    setOgpDataList(ogpDataList) {
      this.inputPostData.ogpInformation = ogpDataList
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;
  .modal_title {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      fill: #ffcc00;
    }
  }
  .modal_contents {
    .timeline {
      &-field {
        position: relative;
        width: 100%;
        height: 496px;
        margin-top: 24px;
        background: #f7f8f9;
        border: 1px solid #e5e5e5;
        border-radius: 4px 4px 0 0;
        overflow: auto;
        &-input {
          margin: 12px 0 0 0;
          padding: 0 14px;
          &-title {
            width: 100%;
            padding-right: 10px;
            ::v-deep input {
              font-size: 20px;
              font-weight: 500;
              border: none;
            }
          }
          &-publishing {
            margin-left: auto;
          }
        }
        &-textarea {
          height: auto;
          margin-top: 8px;
          padding: 0 14px;
          ::v-deep textarea {
            min-height: initial !important;
            max-height: initial !important;
            border: none;
          }
          ::v-deep .placeholder {
            top: 8px;
            left: 0;
          }
        }
        .post-image {
          padding: 24px;
          position: relative;
          img {
            max-width: 100%;
          }
          .delete-image {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 12px;
            cursor: pointer;
            p {
              margin-left: 8px;
            }
          }
        }
      }
    }
    .ogpTemplateSetting {
      &.none {
        display: none;
      }
    }
    .footer {
      display: flex;
      align-items: center;
      height: 42px;
      padding-left: 12px;
      border: 1px solid #e5e5e5;
      border-top: none;
      border-radius: 0 0 4px 4px;
      .icon-attachFile {
        cursor: pointer;
      }
    }
  }
  &.edit-image {
    .modal_contents {
      margin-top: 8px;
      .context {
        margin-bottom: 24px;
        text-align: center;
      }
    }
  }
  .buttons {
    margin-top: 32px;
  }
}
</style>
