<template>
  <div class="change-mail-status-dialog">
    <ul class="list">
      <li
        v-for="(i, index) in setListData"
        :key="index"
        :class="i.class"
        @click="modalSwitchName(i.class)"
      >
        {{ i.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MailDialog',
  data() {
    return {}
  },
  computed: {
    ...mapState('mail/mailList', ['selectMailList']),
    /**
     * 表示項目分岐
     *
     * @return {object} 表示項目
     */
    setListData() {
      let backListData = []

      // 種別 編集中/配信予約
      if (
        this.selectMailList.mailStatus === '0' ||
        this.selectMailList.mailStatus === '1'
      ) {
        backListData = [
          { text: '内容を編集する', class: 'editing' },
          { text: 'コピーする', class: 'copy' },
          { text: '削除する', class: 'delete' },
        ]
      } else if (
        this.selectMailList.mailStatus === '4' ||
        this.selectMailList.mailStatus === '5'
      ) {
        // 種別 配信エラー/配信不可
        backListData = [
          { text: '配信内容を確認する', class: 'confirm' },
          { text: 'コピーする', class: 'copy' },
          { text: '削除する', class: 'delete' },
        ]
      }

      return backListData
    },
  },
  created() {},
  methods: {
    ...mapMutations('mail/mailList', ['showMailDeleteModal']),
    /**
     * ダイアログ 項目押下によるモーダル表示処理
     *
     * @param {string} modalSwitchName 分岐判定用テキスト
     */
    modalSwitchName(modalSwitchName) {
      if (modalSwitchName === 'editing' || modalSwitchName === 'confirm') {
        this.$router.push('/mail/edit/' + this.selectMailList.mailId)
      } else if (modalSwitchName === 'copy') {
        this.postMailCopy()
      } else if (modalSwitchName === 'delete') {
        this.showMailDeleteModal(true)
      }
    },
    /**
     * メールコピー
     */
    postMailCopy() {
      const paramData = {
        mailId: this.selectMailList.mailId,
        recordVersion: this.selectMailList.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .postMailCopy(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('updateMailListData')
            this.$emit('closeDialog')
            this.$common.showCompletePopAlert('ActionMsg_Gen09', 'メール')
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
</script>

<style scoped lang="scss">
.change-mail-status-dialog {
  position: absolute;
  width: 160px;
  padding: 16px;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  background: #ffffff;
  margin-left: -118px;
  z-index: 1;
  text-align: left;
  .title {
    margin: 0 -16px 16px;
    padding: 0 16px 16px;
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
  }
  .list {
    font-size: 15px;
    color: #1e1e1e;
    li {
      cursor: pointer;
      &:not(:last-child) {
        padding-bottom: 8px;
      }
    }
    .delete {
      color: #e60012;
    }
  }
}
</style>
