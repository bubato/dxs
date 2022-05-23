<template>
  <ul class="contact-list-menu-dialog">
    <li class="edit" @click="editContactContent()">内容を編集する</li>
    <li class="delete" @click="exeDelete()">削除する</li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ContactListMenuDialog',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('contact/contactList', ['selectContactInfo']),
  },
  created() {},
  methods: {
    ...mapMutations('contact/contactList', ['setShowDeleteContactModalState']),
    /**
     * コンタクト編集画面に遷移
     */
    editContactContent() {
      this.$router.push('/contact/edit/' + this.selectContactInfo.contactId)
    },
    /**
     * 削除する項目押下処理
     */
    exeDelete() {
      this.setShowDeleteContactModalState(true)
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
ul.contact-list-menu-dialog {
  position: absolute;
  right: 24px;
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
