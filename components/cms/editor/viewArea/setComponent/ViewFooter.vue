<template>
  <div class="view-footer">
    <ul class="link-list">
      <li v-for="(link, index) in editorData.footerItems.links" :key="index">
        <a class="link" v-bind="$common.getCmsEditorLinkAttr(link.path)">{{
          link.name
        }}</a>
      </li>
    </ul>
    <p class="copyright">{{ editorData.footerItems.copyright }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ViewFooter',
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
