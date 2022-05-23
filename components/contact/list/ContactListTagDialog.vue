<template>
  <div class="contact-list-tag-dialog">
    <ul v-for="(item, index) in list" :key="index">
      <li :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ContactListMenuDialog',
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true,
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

<style scoped lang="scss">
.contact-list-tag-dialog {
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
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
