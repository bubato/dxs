<template>
  <div>
    <p>parent_num: {{ parent_num }}</p>
    <button @click="onClick($event)">on</button>
    <EmitAndPropsChild @my-click="parent_num = $event" />
  </div>
</template>
<script>
import EmitAndPropsChild from '@/components/playground/examples/vue/modules/EmitAndPropsChild.vue'
export default {
  components: {},
  data() {
    return {
      parent_num: 100,
    }
  },
  mounted() {},
  methods: {
    onClick($event) {
      alert($event.target.textContent)
    },
  },
}
</script>

<style lang="scss" scoped></style>
