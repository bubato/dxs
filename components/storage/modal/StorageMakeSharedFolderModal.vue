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
            <h4>共有フォルダを作成</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              共有フォルダ名と共有メンバーを選択してください。
            </p>
            <p class="context2">共有フォルダ名</p>
            <CustomInputText
              v-model="folderName"
              placeholder=""
              maxlength="50"
              :validation="
                $common.getFormItemsDetail(folderItems, 'formTitle').validation
              "
            />
            <p class="context2">
              共有するメンバーを追加（自社メンバーとコミュニティでつながっているメンバーとフォルダを共有できます）
            </p>
            <SuggestTextarea
              :select-ids="selectIdList"
              placeholder="氏名かフリガナを入力してください。"
              :suggest-type="2"
              :max-ids="100"
              @update="setSelectIdList($event)"
            />
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
                @click="createStorageShareFolders()"
              >
                共有フォルダを作成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'StorageMakeSharedFolderModal',
  components: {},
  data() {
    return {
      folderName: '',
      folderItems: [
        {
          id: 'formTitle',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 50,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 50,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.storageFolderName,
              message: this.$common.getMasterMessage('ErrorMsg_Format05'),
            },
          ],
        },
      ],
      selectIdList: [],
    }
  },
  computed: {
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.folderItems,
            'formTitle',
            this.folderName
          )
        ) {
          result = true
        }

        return result
      }
    },
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
     * 共有フォルダ登録API
     */
    createStorageShareFolders() {
      const paramData = {
        name: this.folderName,
        shareUserIds: this.selectIdList,
      }

      this.$common.addCallApiNum()
      this.$api
        .createStorageShareFolders(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.onMoveGetList()
            this.$common.showCompletePopAlert('ActionMsg_Gen04', 'フォルダ')
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
  width: 688px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 8px;
    .context {
      text-align: center;
    }
    .context2 {
      margin: 24px 0 12px;
    }
    ::v-deep .selectArea {
      .first-row {
        font-weight: 500;
      }
    }
    ::v-deep .custom-input-textarea-block {
      height: 200px;
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
