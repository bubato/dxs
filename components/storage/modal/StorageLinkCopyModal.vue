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
            <h4>リンクのコピー</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              コピーしたリンクをメールやメッセージに貼り付けて共有相手に送りましょう。
            </p>
            <p
              v-show="
                (selectStorageInfo.shareFlag === 0 &&
                  selectStorageInfo.objectType === 1) ||
                selectStorageInfo.objectType === 2
              "
              class="settingTitle"
            >
              リンクの有効期限
            </p>
            <ul
              v-show="
                (selectStorageInfo.shareFlag === 0 &&
                  selectStorageInfo.objectType === 1) ||
                selectStorageInfo.objectType === 2
              "
              class="wrapDateSetting"
            >
              <li>
                <CustomInputSelect v-model="selectVal" :options="daySelect" />
              </li>
              <li>
                <button class="btn" @click="updateStorageShareLink()">
                  <ReplaySVG class="icon-replay" /> 更新
                </button>
              </li>
            </ul>
            <div class="objectInput">
              <p>{{ linkText }}</p>
            </div>
            <div class="buttons1">
              <button
                class="btn btn-secondary btn-middle"
                @click="copyFormTagCode()"
              >
                コードをコピー
              </button>
            </div>
            <div class="buttons">
              <button
                class="btn btn-long btn-cancel"
                @click="closeModal($event, 'close')"
              >
                閉じる
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
  name: 'StorageLinkCopyModal',
  components: {},
  data() {
    return {
      selectVal: '3',
      daySelect: [],
      linkText: '',
      setRecordVersion: 0,
    }
  },
  computed: {
    ...mapState('storage/storageList', ['selectStorageInfo']),
  },
  created() {
    this.makeDay()
    this.setRecordVersion = this.selectStorageInfo.recordVersion
  },
  mounted() {
    this.sharedConfirm()
  },
  methods: {
    ...mapMutations('storage/storageList', ['onMoveGetList']),
    /**
     * クリック項目 共有フォルダ確認
     */
    sharedConfirm() {
      if (
        this.selectStorageInfo.shareFlag === 1 &&
        this.selectStorageInfo.objectType === 1
      ) {
        this.linkText =
          window.location.origin +
          '/storage/home/' +
          this.selectStorageInfo.objectId +
          '/?init=1'
      } else {
        this.updateStorageShareLink()
      }
    },
    /**
     * 日付挿入
     */
    makeDay() {
      for (let i = 1; i <= 7; i++) {
        this.daySelect.push({
          code: i,
          label: i + '日間',
        })
      }
    },
    /**
     * 共有リンク作成API
     */
    updateStorageShareLink() {
      const paramData = {
        id: this.selectStorageInfo.objectId,
        expirationDays: this.selectVal,
        recordVersion: this.setRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .updateStorageShareLink(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.linkText =
              window.location.origin +
              '/storage/sharedItem/' +
              resData.data.shareLinkId +
              '/'
            this.setRecordVersion++
            this.onMoveGetList()
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
    /**
     * フォームタグのコードをクリップボードにコピー
     */
    copyFormTagCode() {
      this.$common.copyClipBoard(this.linkText)
      this.$common.showCompletePopAlert('ActionMsg_Gen09', 'リンク')
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
    .context {
      text-align: center;
      margin-bottom: 24px;
    }
    .settingTitle {
      font-weight: 500;
      margin-bottom: 15px;
    }
    .wrapDateSetting {
      display: flex;
      li {
        &:first-child {
          width: 250px;
        }
        &:last-child {
          padding-top: 5px;
        }
        padding-right: 10px;
      }
      .btn {
        font-size: 13px;
        font-weight: bold;
        margin-top: 2px;
        padding: 3px 13px 4px 6px;
        border: 1px solid #e0e0e0;
        color: #1e1e1e;
      }
    }
    .objectInput {
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      background: #cdced0;
      color: #8e8e8e;
      margin-top: 15px;
      padding: 13px 16px;
      min-height: 47px;
      p {
        font-size: 15px;
      }
    }
    .buttons1 {
      margin-top: 12px;
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
