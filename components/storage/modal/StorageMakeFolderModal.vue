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
            <h4>フォルダを作成</h4>
          </div>
          <div class="modal_contents">
            <p class="context">フォルダ名を入力してください。</p>
            <p class="context2">フォルダ名</p>
            <CustomInputText
              v-model="folderName"
              placeholder=""
              maxlength="50"
              :validation="
                $common.getFormItemsDetail(formItems, 'formTitle').validation
              "
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
                @click="createStorageFolders()"
              >
                フォルダを作成
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
  name: 'StorageMakeFolderModal',
  data() {
    return {
      folderName: '',
      formItems: [
        {
          id: 'formTitle',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.storageFolderName,
              message: this.$common.getMasterMessage('ErrorMsg_Format05'),
            },
            {
              type: 'maxlength',
              maxlength: 50,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 50,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('storage/storageList', ['pathStorageObjectId']),
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
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
  created() {
    this.formTitle = this.propFormTitle
  },
  methods: {
    ...mapMutations('storage/storageList', ['onMoveGetList']),
    /**
     * フォルダ作成
     */
    createStorageFolders() {
      const paramData = {
        name: this.folderName,
        parentId: this.pathStorageObjectId,
      }

      this.$common.addCallApiNum()
      this.$api
        .createStorageFolders(paramData)
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
          this.$emit('close')
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
