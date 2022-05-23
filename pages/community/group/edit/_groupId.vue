<template>
  <div class="group-edit">
    <div class="main-contents">
      <ToBackScreenLink
        v-if="isEditPage"
        label="グループへ戻る"
        class="backPage"
        @click="toBackGroupProfileScreen()"
      />
      <h2 class="header">
        <template v-if="isEditPage"
          >{{ defaultEditGroup.postGroupName }}のプロフィール</template
        >
        <template v-else>新規グループ作成</template>
      </h2>
      <div class="contents">
        <div class="form-block group-info">
          <h3 class="form-title">グループ情報</h3>
          <div class="form-item group-name">
            <RequiredFormLabel
              class="title"
              label="グループ名"
              :required="true"
            />
            <CustomInputText
              v-model="editGroup.postGroupName"
              placeholder="入力例：●●の勉強会"
              :validation="
                $common.getFormItemsDetail(formItems, 'postGroupName')
                  .validation
              "
              :maxlength="100"
            />
          </div>
          <div class="form-item group-description">
            <RequiredFormLabel
              class="title"
              label="グループ説明"
              :required="true"
            />
            <CustomInputTextarea
              v-model="editGroup.postGroupDescription"
              placeholder="グループの内容が分かる説明を入力してください。"
              :validation="
                $common.getFormItemsDetail(formItems, 'postGroupDescription')
                  .validation
              "
            />
          </div>
          <div class="form-item group-coverImageUrl">
            <RequiredFormLabel
              class="title"
              label="カバー画像"
              :required="false"
            />
            <p class="sub-text">
              アップロード可能なファイルサイズは1MBまで。拡張子は.{{
                imageAllowExts.join('、')
              }}が利用できます。<br />横幅2,000px程度の画像をお勧めします。
            </p>
            <FileUpload
              ref="fileUpload1"
              :file-data="editGroup.postGroupCoverImageUrl"
              :validation="
                $common.getFormItemsDetail(formItems, 'postGroupCoverImageUrl')
                  .validation
              "
              :max-size="1024"
              @uploaded="setGroupCoverImage($event)"
              @deleted="deleteGroupCoverImage()"
            />
          </div>
          <div class="form-item group-rangeStatus">
            <RequiredFormLabel
              class="title"
              label="公開範囲"
              :required="true"
            />
            <PseudoSelectBox
              ref="pseudoSelectBox"
              v-model="editGroup.postGroupRangeStatus"
              class="status-select"
              :options="postGroupRangeStatusOptions"
              :validation="
                $common.getFormItemsDetail(formItems, 'postGroupRangeStatus')
                  .validation
              "
            />
          </div>
        </div>
        <div class="form-block">
          <h3 class="form-title">参加メンバー(最大100名まで)</h3>
          <div class="profile">
            <p class="profile-position">グループ管理者</p>
            <div class="profile-block">
              <div class="image">
                <img :src="$common.getProfileImg(editGroup.adminImageUrl)" />
              </div>
              <div class="admin-profile">
                <p class="admin-name">
                  <span class="last-name">{{
                    myProfile.basicSetting.lastName
                  }}</span>
                  <span class="first-name">{{
                    myProfile.basicSetting.firstName
                  }}</span>
                </p>
                <p class="admin-company">
                  {{ myProfile.workHistory[0].company }}
                </p>
                <p class="admin-position">
                  {{ myProfile.workHistory[0].position }}
                </p>
              </div>
            </div>
          </div>
          <div class="form-item group-members">
            <RequiredFormLabel
              class="title"
              label="メンバーを招待"
              :required="false"
            />
            <SuggestTextarea
              ref="suggestTextarea"
              :select-ids="postGroupMembers"
              :max-ids="100"
              placeholder="氏名かフリガナを入力してください。"
              :suggest-type="1"
              :validation="
                $common.getFormItemsDetail(formItems, 'postGroupMembers')
                  .validation
              "
              @update="updateGroupMember($event)"
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          v-if="!isEditPage"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          class="btn btn-basic btn-long"
          @click="createGroupProfile()"
        >
          グループを作成
        </button>
        <button
          v-if="isEditPage"
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled':
              $common.checkSameObject(defaultEditGroup, editGroup) &&
              postGroupMembers.length === 0,
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          v-if="isEditPage"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          class="btn btn-basic btn-long"
          @click="updateGroupProfile()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'community',
  components: { CommonFooter },
  mixins: [communityCommonMixin],
  data() {
    return {
      isEditPage: false,
      defaultEditGroup: {
        postGroupName: '',
        postGroupDescription: '',
        postGroupCoverImageUrl: '',
        postGroupRangeStatus: '1',
      },
      editGroup: {
        postGroupName: '',
        postGroupDescription: '',
        postGroupCoverImageUrl: '',
        postGroupRangeStatus: '1',
      },
      postGroupMembers: [],
      cancelAfterFunc: '',
      postGroupRangeStatusOptions: [],
      imageAllowExts: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
      formItems: [
        {
          id: 'postGroupName',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'postGroupDescription',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
          ],
        },
        {
          id: 'postGroupCoverImageUrl',
          validation: [],
        },
        {
          id: 'postGroupRangeStatus',
          validation: [],
        },
        {
          id: 'postGroupMembers',
          validation: [],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),
    ...mapState('community/common', ['myProfile']),
    /**
     * グループを作成/設定内容を保存ボタンの非活性チェック
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.editGroup) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.editGroup[key]
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
    if (this.$route.params.groupId) {
      this.isEditPage = true
      this.getPostGroupInfo() // 投稿グループ情報の取得
    } else {
      this.isEditPage = false
    }

    this.setPostGroupRangeStatusOptions()
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    ...mapMutations('community/group', ['setGroupInfo']),
    /**
     * 投稿グループ情報の取得
     */
    getPostGroupInfo() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getPostGroupInfo(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.defaultEditGroup = resData.data
            this.defaultEditGroup.postGroupRangeStatus = String(
              this.defaultEditGroup.postGroupRangeStatus
            )
            this.editGroup = JSON.parse(JSON.stringify(resData.data))
            this.editGroup.postGroupRangeStatus = String(
              this.editGroup.postGroupRangeStatus
            )

            this.setGroupInfo(resData.data)
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
     * 投稿グループの作成
     */
    createGroupProfile() {
      const paramData = {
        postGroupName: this.editGroup.postGroupName,
        postGroupDescription: this.editGroup.postGroupDescription,
        postGroupCoverImage: this.editGroup.postGroupCoverImageUrl,
        postGroupRangeStatus: Number(this.editGroup.postGroupRangeStatus),
        postGroupAdmin: this.myProfile.userId,
        postGroupMembers: this.postGroupMembers,
      }

      this.$common.addCallApiNum()
      this.$api
        .createGroupProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getJoinGroupList() // 投稿グループ一覧の取得
            this.$common.showCompletePopAlert('ActionMsg_Gen04', 'グループ')
            this.$router.push(`/community/group/${resData.data.postGroupId}/`)
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
     * 投稿グループの編集
     */
    updateGroupProfile() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
        postGroupName: this.editGroup.postGroupName,
        postGroupDescription: this.editGroup.postGroupDescription,
        postGroupCoverImage: this.editGroup.postGroupCoverImageUrl,
        postGroupRangeStatus: Number(this.editGroup.postGroupRangeStatus),
        postGroupAdmin: this.myProfile.userId,
        postGroupMembers: this.postGroupMembers,
        recordVersion: this.defaultEditGroup.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateGroupProfile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.mixin_getJoinGroupList() // 投稿グループ一覧の取得
            this.getPostGroupInfo() // 投稿グループ情報の取得
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * 公開範囲のセレクトボックスの値設定
     */
    setPostGroupRangeStatusOptions() {
      const groupRangeStatus = this.$common.getVersatileItemInformation(40)
      const groupRangeStatusOptions = []

      for (const key in groupRangeStatus) {
        const option = {}

        option.code = key
        option.label = groupRangeStatus[key]

        if (key === '1') {
          option.icon = 'PublicSVG'
        } else if (key === '2') {
          option.icon = 'LockSVG'
        }

        groupRangeStatusOptions.push(option)
      }

      this.postGroupRangeStatusOptions = groupRangeStatusOptions
    },
    /**
     * 編集破棄処理
     */
    restoreSettings() {
      if (this.cancelAfterFunc === 'back') {
        this.$router.push(`/community/group/${this.$route.params.groupId}/`)
      } else {
        this.editGroup = JSON.parse(JSON.stringify(this.defaultEditGroup))
        this.postGroupMembers = []
        this.$refs.suggestTextarea.resetInputTextarea()
      }

      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * 編集破棄モーダル キャンセルボタン押下処理
     */
    exeCancelEditModal() {
      this.cancelAfterFunc = ''
      this.hideCancelEditModal()
    },
    /**
     * グループプロフィール画面に戻る
     */
    toBackGroupProfileScreen() {
      const changeDataFlg = this.$common.checkSameObject(
        this.defaultEditGroup,
        this.editGroup
      )

      if (changeDataFlg) {
        this.$router.push(`/community/group/${this.$route.params.groupId}/`)
      } else {
        this.cancelAfterFunc = 'back'
        this.showCancelEditModal()
      }
    },
    /**
     * グループメンバーの更新
     *
     * @param {number[]} 選択したユーザーIDの配列
     */
    updateGroupMember(selectIds) {
      this.postGroupMembers = selectIds
    },
    /**
     * グループカバー画像の設定
     *
     * @param {object} data ファイル情報
     */
    setGroupCoverImage(data) {
      this.editGroup.postGroupCoverImageUrl = data.fileImgPath
    },
    /**
     * グループカバー画像の削除
     */
    deleteGroupCoverImage() {
      this.editGroup.postGroupCoverImageUrl = ''
    },
  },
  head() {
    return {
      title: this.isEditPage
        ? this.defaultEditGroup.postGroupName +
          'のプロフィール編集｜コミュニティ｜bizskyDX'
        : '新規グループ作成｜コミュニティ｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.group-edit {
  @include spContentWidth();
  .main-contents {
    .backPage {
      @include mq(sp) {
        margin-top: 24px;
        margin-bottom: 8px;
      }
    }
    .header {
      @include mq(pc) {
        margin-top: 16px;
      }
      @include mq(sp) {
        font-size: 22px;
      }
    }
    .contents {
      .form-block {
        margin-top: 32px;
        padding: 32px 0 48px 0;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        &:last-child {
          padding-top: 0;
          border-top: none;
        }
        .form-title {
          margin-bottom: 32px;
        }
        .profile {
          margin-top: 32px;
          &-position {
            @include mq(sp) {
              font-weight: 500;
            }
          }
          .profile-block {
            display: flex;
            margin-top: 12px;
            .image {
              @include mq(pc) {
                width: 48px;
                height: 48px;
              }
              @include mq(sp) {
                width: 80px;
                height: 80px;
              }
              img {
                width: 100%;
              }
            }
            .admin {
              &-profile {
                margin-left: 16px;
                p {
                  :not(:first-child) {
                    margin-top: 2px;
                  }
                  &.admin-company,
                  &.admin-position {
                    @include mq(pc) {
                      font-size: 13px;
                    }
                  }
                }
              }
              &-name {
                @include mq(sp) {
                  font-weight: 500;
                  font-size: 17px;
                }
              }
            }
          }
        }

        .form-item {
          &:not(:first-child),
          .group-members {
            @include mq(pc) {
              margin-top: 48px;
            }
            @include mq(sp) {
              margin-top: 32px;
            }
          }
          .title {
            margin-bottom: 10px;
            font-weight: 500;
          }
          .sub-text {
            font-size: 13px;
            margin-bottom: 12px;
          }
          &.group-name {
            .custom-input-text {
              @include mq(pc) {
                width: 600px;
              }
            }
          }
          &.group-rangeStatus {
            .status-select {
              @include mq(pc) {
                width: 423px;
              }
            }
            ::v-deep .select {
              height: 48px;
            }
          }
          ::v-deep .custom-input-textarea-block {
            height: 128px;
          }
        }
        // .group-members {
        //   margin-top: 48px;
        // }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      @include mq(sp) {
        flex-direction: column;
      }
      button {
        @include mq(sp) {
          &.btn-long {
            width: 213px;
          }
        }
        &:not(:last-child) {
          @include mq(pc) {
            margin-right: 16px;
          }
          @include mq(sp) {
            margin-bottom: 16px;
          }
        }
      }
    }
  }
}
</style>
