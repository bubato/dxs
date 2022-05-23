<template>
  <div class="view-breadcrumb">
    <ul>
      <li v-for="(breadcrumb, index) in editorData.breadcrumb" :key="index">
        <a
          v-if="index !== editorData.breadcrumb.length - 1"
          class="link"
          v-bind="$common.getCmsEditorLinkAttr(breadcrumb.path)"
          >{{ breadcrumb.name }}</a
        >
        <p v-else>{{ breadcrumb.name }}</p>
        <span v-if="index !== editorData.breadcrumb.length - 1">></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ViewBreadcrumb',
  props: {
    component: { type: Object, required: true },
  },
  computed: {
    ...mapState('cms/editorStore', ['editorData']),
  },
  methods: {},
}
</script>

<style lang="scss"></style>
