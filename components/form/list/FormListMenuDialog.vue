<template>
  <ul class="form-list-menu-dialog">
    <li class="edit" @click="editFormContent()">内容を編集する</li>
    <li class="show-tag" @click="exeShowTag()">タグを表示する</li>
    <li class="copy" @click="copyForm()">コピーする</li>
    <li class="delete" @click="exeDelete()">削除する</li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FormListMenuDialog',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('form/formList', ['selectFormInfo']),
  },
  created() {
    this.selectStatus = this.status
  },
  methods: {
    ...mapMutations('form/formList', [
      'showFormTagModal',
      'showDeleteFormModal',
    ]),
    editFormContent() {
      this.$router.push('/form/edit/' + this.selectFormInfo.formId)
    },
    /**
     * タグを表示する項目押下処理
     * 埋め込み用のSCRIPTタグを表示するモーダルを表示
     */
    exeShowTag() {
      this.showFormTagModal()
      this.$emit('close')
    },
    /**
     * 選択したフォームの内容をコピー
     */
    copyForm() {
      const paramData = {
        copyFlg: 1,
        formId: this.selectFormInfo.formId,
      }

      this.$common.addCallApiNum()
      this.$api
        .insertFormData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
            this.$common.showCompletePopAlert('ActionMsg_Gen09', 'フォーム')
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
     * 削除する項目押下処理
     */
    exeDelete() {
      this.showDeleteFormModal()
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
ul.form-list-menu-dialog {
  position: absolute;
  width: 137px;
  padding: 24px 16px;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  background: #ffffff;
  margin-top: 12px;
  margin-left: -98px;
  z-index: 1;
  li {
    cursor: pointer;
    &.delete {
      color: #e60012;
    }
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
