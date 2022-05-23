<template>
  <span
    class="status"
    :class="{
      isInvalid: status.status === '0',
      isValid: status.status === '1',
      isInviting: status.status === '2',
      isInvitationExpired: status.status === '3',
    }"
  >
    <!-- 無効 -->
    <RemoveCircleSVG
      v-if="status.status === '0'"
      class="icon-removeCircle icon"
    />
    <!-- / 無効 -->
    <!-- 有効 -->
    <CheckCircleSVG
      v-else-if="status.status === '1'"
      class="icon-checkCircle icon"
    />
    <!-- / 有効 -->
    <!-- 招待中 -->
    <AccessTimeFilledSVG
      v-else-if="status.status === '2'"
      class="icon-accessTimeFilled icon"
    />
    <!-- / 招待中 -->
    <!-- 招待期限切れ -->
    <ErrorSVG v-else-if="status.status === '3'" class="icon-error icon" />
    <!-- / 招待期限切れ -->
    {{ $common.getVersatileItem(33, status.status, 'value') }}
  </span>
</template>

<script>
export default {
  name: 'AccountListTableStatusLabel',
  props: {
    status: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.icon {
  width: 20px;
  height: 20px;
}
// 無効
.isInvalid {
  .icon {
    fill: #b0b3be;
  }
}
// 有効
.isValid {
  color: #34c759;
  .icon {
    fill: #34c759;
  }
}
// 招待中
.isInviting {
  .icon {
    fill: #b0b3be;
  }
}
// 招待期限切れ
.isInvitationExpired {
  color: #e60012;
  .icon {
    fill: #e60012;
  }
}
</style>
