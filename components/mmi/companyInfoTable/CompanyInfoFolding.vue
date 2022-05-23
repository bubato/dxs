<template>
  <CollapseTransition @after-enter="onEnter" @after-leave="onEnd">
    <tbody v-if="!isFolded">
      <slot v-if="!isEmpty" />
    </tbody>
  </CollapseTransition>
</template>

<script>
import CollapseTransition from './CollapseTransition'

export default {
  name: 'CompanyInfoFolding',
  components: {
    CollapseTransition,
  },
  props: {
    isFolded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEmpty: false,
    }
  },
  methods: {
    onEnter() {
      this.isEmpty = true
      this.$nextTick(() => {
        this.$emit('folding-changed', false)
      })
    },
    onEnd() {
      this.isEmpty = true
      this.$nextTick(() => {
        this.$emit('folding-changed', true)
      })
    },
  },
}
</script>
