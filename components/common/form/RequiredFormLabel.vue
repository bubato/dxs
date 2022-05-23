<template>
  <div class="form-title">
    <p class="title">{{ label }}</p>
    <p
      v-if="required !== null"
      class="input-status"
      :class="[
        { require: required },
        { any: !required },
        { noMargin: label.length === 0 },
      ]"
    >
      {{ required ? '必須' : '任意' }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'RequiredFormLabel',
  components: {},
  props: {
    label: { type: String, required: true, default: '' },
    required: { type: Boolean, required: true, default: false },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-title {
  display: flex;
  align-items: center;
  .title {
    font-weight: 500;
  }
  .input-status {
    width: 40px;
    font-size: 12px;
    line-height: 24px;
    margin-left: 12px;
    text-align: center;
    &.require {
      color: #ffffff;
      background-color: #ff453a;
      border: 1px solid #ff453a;
    }
    &.any {
      border: 1px solid #ff453a;
      color: #ff453a;
      background-color: #ffffff;
    }
    &.noMargin {
      margin-left: 0;
    }
  }
}
</style>
