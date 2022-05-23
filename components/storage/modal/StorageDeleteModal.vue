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
            <h4><AttentionSVG class="icon-attention" />{{ setText.title }}</h4>
            <p v-for="(i, index) in setText.read" :key="index">
              {{ i }}
            </p>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-middle"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button class="btn btn-basic btn-middle" @click="judgeDelete()">
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StorageDeleteModal',
  props: {
    storageList: {
      type: Array,
      default: () => [],
      required: true,
    },
    checkedConfirm: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      setText: {
        title: '',
        read: [],
      },
      setPhysicalDeleteFlag: 0,
      alertText: '',
      idsData: [],
      deleteListLogic: [],
      deleteListPhysics: [],
      checkedNumber: [],
      confirmShareFlag: false,
      setNumber: 0,
      popAlertFlag: true,
    }
  },
  computed: {
    ...mapState('storage/storageList', [
      'selectStorageInfo',
      'dialogDeleteClick',
      'objectTypeText',
    ]),
  },
  created() {
    this.setTextPageDelete()
  },
  methods: {
    ...mapMutations('storage/storageList', [
      'hideStorageDeleteModal',
      'onMoveGetList',
      'updateDialogDeleteClick',
    ]),
    /**
     * ダイアログ表示テキスト設定
     * title:ダイアログタイトルテキスト
     * read:ダイアログ本文テキスト
     */
    setTextPageDelete() {
      if (
        this.selectStorageInfo.shareFlag === 1 &&
        this.dialogDeleteClick === true
      ) {
        this.confirmShareFlag = true
      } else if (this.dialogDeleteClick === false) {
        this.setNumber = this.selectStorageInfo.objectType

        for (const i in this.checkedConfirm) {
          if (this.checkedConfirm[i] && this.storageList[i].shareFlag === 0) {
            this.deleteListLogic.push(this.storageList[i].objectId)
          } else if (
            (this.checkedConfirm[i] && this.storageList[i].shareFlag === 1) ||
            (this.checkedConfirm[i] && this.$route.path.includes('/delete'))
          ) {
            this.deleteListPhysics.push(this.storageList[i].objectId)
          }

          if (this.checkedConfirm[i]) {
            this.checkedNumber.push(i)
          }
        }

        if (
          this.checkedNumber.length === 1 &&
          this.storageList[this.checkedNumber].shareFlag === 1
        ) {
          this.confirmShareFlag = true
        } else {
          this.confirmShareFlag = false
        }
      }

      if (this.confirmShareFlag === true) {
        this.setText = {
          title: '共有フォルダ・ファイルの削除',
          read: [
            '選択したファイルまたはフォルダを削除しますか？',
            '共有フォルダの中にあるファイルは一度削除すると元に戻せません。',
          ],
        }
        this.setPhysicalDeleteFlag = 1
      } else {
        this.setText = {
          title: '削除済フォルダへ移動',
          read: ['選択したファイルまたはフォルダを削除済へ移動しますか？'],
        }
        this.setPhysicalDeleteFlag = 0
      }

      if (this.dialogDeleteClick === false) {
        this.setText = {
          title: '選択したフォルダ・ファイルの削除',
          read: [
            '選択したフォルダまたはファイルを削除しますか？',
            '共有フォルダの中にあるファイルは一度削除すると元に戻せません。',
            '共有フォルダ以外の中にあるファイルは削除済へ移動します。',
          ],
        }
      }

      if (this.$route.path.includes('/delete')) {
        this.setText = {
          title: 'ファイルまたはフォルダの削除',
          read: [
            '選択したファイルまたはフォルダを削除しますか？',
            ' 一度削除したファイル・フォルダは元に戻せません。',
          ],
        }
        this.setPhysicalDeleteFlag = 1
      }
    },
    /**
     * 複数選択時 通常共有が含まれているかを判定
     */
    judgeDelete() {
      if (this.dialogDeleteClick === true) {
        this.popAlertFlag = true
        this.idsData.push(this.selectStorageInfo.objectId)
        this.alertText = this.objectTypeText[this.selectStorageInfo.objectType]
        this.moveDelete()
      } else {
        if (this.checkedNumber.length === 1) {
          this.setNumber = this.storageList[this.checkedNumber].objectType
          this.alertText = this.objectTypeText[this.setNumber]
        } else {
          this.alertText = '選択したファイルまたはフォルダ'
        }

        if (
          this.deleteListLogic.length !== 0 &&
          this.deleteListPhysics.length !== 0
        ) {
          this.popAlertFlag = false
        }

        if (this.deleteListLogic.length !== 0) {
          this.idsData = this.deleteListLogic
          this.setPhysicalDeleteFlag = 0
          this.moveDelete()
        }

        if (this.deleteListPhysics.length !== 0) {
          this.idsData = this.deleteListPhysics
          this.setPhysicalDeleteFlag = 1
          this.moveDelete()
        }
      }
    },
    /**
     * オブジェクト削除API
     */
    moveDelete() {
      const paramData = {
        ids: this.idsData,
        physicalDeleteFlag: this.setPhysicalDeleteFlag,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteStorageObjects(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (this.popAlertFlag === false) {
              this.popAlertFlag = true
            } else {
              this.onMoveGetList()
              this.$common.showCompletePopAlert(
                'ActionMsg_Gen03',
                this.alertText
              )
              this.hideStorageDeleteModal()
              this.updateDialogDeleteClick(false)
            }
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
          this.updateDialogDeleteClick(false)
        }

        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
        this.updateDialogDeleteClick(false)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 566px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
    h4 {
      margin-bottom: 9px;
    }
    p:nth-child(1) {
      margin-top: 24px;
    }
  }
  .buttons {
    margin-top: 32px;
  }
}

.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.buttons * {
  color: #ffffff;
}
.icon-attention {
  margin-right: 12px;
}
</style>
