<template>
  <div class="single-text">
    <div class="select-height">
      <p>高さ</p>
      <CustomInputSelect
        v-model="component.selectHeight"
        :options="heightKinds"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleSpace',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      heightKinds: [
        {
          code: '1',
          label: '20',
        },
        {
          code: '2',
          label: '40',
        },
        {
          code: '3',
          label: '60',
        },
        {
          code: '4',
          label: '80',
        },
        {
          code: '5',
          label: '100',
        },
      ],
    }
  },
  computed: {},
  methods: {
    changeAlign(val) {
      this.component.align = val.selectVal
    },
    selectLink(selectLink) {
      this.component.link = selectLink
    },
  },
}
</script>

<style lang="scss" scoped>
.single-text {
  width: 600px;
  max-height: 760px;
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .flex,
    > p {
      margin-bottom: 10px;
    }
  }
}
</style>
