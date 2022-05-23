<template>
  <div class="view-header">
    <a v-bind="$common.getCmsEditorLinkAttr('/')"
      ><img :src="editorData.headerItems.logo" loading="lazy"
    /></a>
    <input id="spMenu" type="checkbox" class="spMenu" />
    <ul class="link-list">
      <li v-for="(link, index) in editorData.headerItems.links" :key="index">
        <a v-bind="$common.getCmsEditorLinkAttr(link.path)">{{ link.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ViewHeader',
  props: {
    component: { type: Object, required: true },
  },
  computed: {
    ...mapState('cms/editorStore', ['editorData']),
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
