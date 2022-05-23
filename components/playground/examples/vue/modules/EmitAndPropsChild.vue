<template>
  <div>
    <p>child_num: {{ child_num }}</p>
    <button @click="send">親コンポーネントに値を渡す</button>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: 'テキスト',
      required: false,
    },
    array: {
      type: Array,
      default: () => {
        return []
      },
      required: false,
    },
  },
  data() {
    return {
      child_num: 0,
    }
  },
  mounted() {},
  methods: {
    send() {
      this.$emit('my-click', this.child_num)
    },
  },
}
</script>

<style lang="scss" scoped></style>
