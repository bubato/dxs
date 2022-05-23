<template>
  <div class="more-form-detail" @click="$emit('change')">
    <template v-if="!moreDetail">
      <p>
        詳細を設定する
        <ExpandMoreSVG class="icon icon-expandMore" />
      </p>
      <p v-if="type === 'form'">
        ボタンのラベル、ファイル添付、完了画面のメッセージなど
      </p>
      <p v-if="type === 'publish'">
        受付期間外のメッセージ、定員数、セキュリティ設定など
      </p>
    </template>
    <template v-else>
      <p>詳細設定を閉じる<ExpandLessSVG class="icon icon-expandLess" /></p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MoreFormDetail',
  components: {},
  props: {
    type: {
      type: String,
      default: '',
      required: false,
    },
    moreDetail: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.more-form-detail {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #f7f8f9;
  border-radius: 4px;
  margin: 48px 0;
  padding: 16px 0;
  cursor: pointer;
  .icon {
    margin-left: 14px;
    fill: #3a435c;
  }
}
</style>
