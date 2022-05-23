<template>
  <div class="view-separator">
    <hr :size="component.selectHeight" :color="component.color" />
  </div>
</template>

<script>
export default {
  name: 'MailComponentViewSeparator',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
