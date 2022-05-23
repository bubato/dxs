<template>
  <div class="single-component">
    <MailComponentViewHeading1
      v-if="component.id === 'heading1'"
      :component="component"
    />
    <MailComponentViewHeading2
      v-if="component.id === 'heading2'"
      :component="component"
    />
    <MailComponentViewHeading3
      v-if="component.id === 'heading3'"
      :component="component"
    />
    <MailComponentViewHeading4
      v-if="component.id === 'heading4'"
      :component="component"
    />
    <MailComponentViewText
      v-if="component.id === 'text'"
      :component="component"
    />
    <MailComponentViewList
      v-if="component.id === 'list'"
      :component="component"
    />
    <MailComponentViewAnnotation
      v-if="component.id === 'annotation'"
      :component="component"
    />
    <MailComponentViewImage
      v-if="component.id === 'image'"
      :component="component"
    />
    <MailComponentViewButton
      v-if="component.id === 'button'"
      :component="component"
    />
    <MailComponentViewSeparator
      v-if="component.id === 'separator'"
      :component="component"
    />
    <MailComponentViewSpace
      v-if="component.id === 'space'"
      :component="component"
    />
  </div>
</template>

<script>
export default {
  name: 'MailSingleComponent',
  components: {},
  props: {
    component: { type: Object, default: () => {}, required: true },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
