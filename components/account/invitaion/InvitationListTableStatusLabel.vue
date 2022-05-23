<template>
  <span
    class="status"
    :class="{
      isInvalid: status.status === 0 || status.status === 4,
      isValid: status.status === 3,
      isInviting: status.status === 1,
      isInvitationExpired: status.status === 2,
    }"
  >
    <!-- 未招待 -->
    <RemoveCircleSVG
      v-if="status.status === 0 || status.status === 4"
      class="icon-removeCircle icon"
    />
    <!-- / 未招待 -->
    <!-- 同意済・他事務所連携済 -->
    <CheckCircleSVG
      v-else-if="status.status === 3"
      class="icon-checkCircle icon"
    />
    <!-- / 同意済・他事務所連携済 -->
    <!-- 招待中 -->
    <AccessTimeFilledSVG
      v-else-if="status.status === 1"
      class="icon-accessTimeFilled icon"
    />
    <!-- / 招待中 -->
    <!-- 招待期限切れ -->
    <ErrorSVG v-else-if="status.status === 2" class="icon-error icon" />
    <!-- / 招待期限切れ -->
    {{ label[status.status] }}
  </span>
</template>

<script>
export default {
  name: 'InvitationListTableStatusLabel',
  props: {
    status: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      label: {
        0: '未招待',
        1: '招待中',
        2: '招待期限切れ',
        3: '同意済',
        4: '他事務所連携済',
      },
    }
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
