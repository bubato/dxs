<template>
  <ul v-if="account.managementFlag === 1" class="account-list-menu-dialog">
    <!-- テナント管理者 -->
    <li class="edit" @click="editAccountContent()">アカウントを編集する</li>
    <!-- /テナント管理者 -->
  </ul>
  <ul
    v-else-if="account.status === '2' || account.status === '3'"
    class="account-list-menu-dialog"
  >
    <!-- 招待中/招待有効期限切れ -->
    <li class="edit" @click="resendInvitationMail()">招待メールを再送する</li>
    <li class="delete" @click="deleteAccount()">アカウントを削除する</li>
    <!-- /招待中/招待有効期限切れ -->
  </ul>
  <ul v-else class="account-list-menu-dialog">
    <!-- アカウント有効/無効 -->
    <li class="edit" @click="editAccountContent()">アカウントを編集する</li>
    <li class="delete" @click="deleteAccount()">アカウントを削除する</li>
    <!-- /アカウント有効/無効 -->
  </ul>
</template>

<script>
export default {
  name: 'AccountListMenuDialog',
  props: {
    account: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  data() {
    return {
      accountStatus: '0',
    }
  },
  computed: {},
  created() {},
  methods: {
    /**
     * アカウントを編集する
     */
    editAccountContent() {
      this.$router.push('/account/users/edit/' + this.account.tenantUserId)
      this.$emit('close')
    },
    /**
     * 招待メールを再送する
     */
    resendInvitationMail() {
      this.$emit('resendMail', this.account)
    },
    /**
     * アカウントを削除する
     */
    deleteAccount() {
      this.$emit('deleteAccount', this.account)
    },
  },
}
</script>

<style scoped lang="scss">
ul.account-list-menu-dialog {
  position: absolute;
  right: 10px;
  padding: 24px 16px;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  background: #ffffff;
  margin-top: 12px;
  margin-left: -98px;
  li {
    cursor: pointer;
    &:not(:last-child) {
      padding-bottom: 8px;
    }
    &.delete {
      color: #e60012;
    }
  }
}
</style>
