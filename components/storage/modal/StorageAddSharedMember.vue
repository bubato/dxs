<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4>共有メンバー</h4>
          </div>
          <div class="modal_contents">
            <p>共有メンバー：{{ sharingMemberData.length }}人</p>
            <ul class="wrapSharedMemberImg">
              <li v-for="i in sharingMemberData" :key="i.userId">
                <img
                  :src="$common.getProfileImg(i.profileImageURL)"
                  :title="i.lastName + i.firstName"
                />
              </li>
            </ul>
            <p class="context2">
              <SuggestTextarea
                placeholder="氏名かフリガナを入力してください。"
                :suggest-type="2"
                :max-ids="100"
                :exclude-ids="sharingMemberDataId"
                @update="setSelectIdList($event)"
              />
            </p>
            <div class="buttons">
              <button
                class="btn btn-long btn-cancel"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-long btn-basic"
                :class="{ 'btn-disabled': checkBtnDisabled() }"
                @click="updateStorageFolders()"
              >
                メンバーを追加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StorageAddSharedMember',
  props: {
    value: { type: String, required: false, default: '' },
  },
  data() {
    return {
      sharingMemberData: [],
      sharingMemberDataId: [],
      selectIdList: [],
    }
  },
  computed: {
    ...mapState('storage/storageList', ['selectStorageInfo']),
    checkBtnDisabled() {
      return () => {
        let result = false

        if (this.selectIdList.length === 0) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.getStorageShareFoldersMembers()
  },
  methods: {
    ...mapMutations('storage/storageList', ['onMoveGetList']),
    /**
     * 共有メンバー選択欄 データ連携 選択ID
     *
     * @param {Number[]} idList 選択メンバーID
     */
    setSelectIdList(idList) {
      this.selectIdList = idList
    },
    /**
     * 共有メンバーId一覧抽出
     */
    updateSharingMemberDataId() {
      for (const i in this.sharingMemberData) {
        this.sharingMemberDataId.push(this.sharingMemberData[i].userId)
      }
    },
    /**
     * 共有メンバー取得API
     */
    getStorageShareFoldersMembers() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageShareFoldersMembers(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.sharingMemberData = resData.data.sharedMembers
            this.updateSharingMemberDataId()
          } else {
            this.$emit('close')
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * フォルダ更新API
     */
    updateStorageFolders() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
        name: null,
        shareUserIds: this.selectIdList,
        recordVersion: this.selectStorageInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateStorageFolders(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen11')
            this.onMoveGetList()
            this.$emit('close')
          } else {
            this.$emit('close')
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
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
    text-align: center;
  }
  .modal_contents {
    margin-top: 8px;
    .context2 {
      margin: 24px 0 12px;
      ::v-deep .selectArea {
        .first-row {
          font-weight: bold;
        }
      }
    }
    ::v-deep .custom-input-textarea-block {
      height: 200px;
    }
    .wrapSharedMemberImg {
      display: flex;
      margin-top: 12px;
      li {
        margin-right: 4px;
      }
      img {
        width: 48px;
        height: 48px;
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
