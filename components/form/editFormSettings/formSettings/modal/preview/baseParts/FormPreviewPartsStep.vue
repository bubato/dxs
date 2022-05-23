<template>
  <div class="form-step">
    <ul>
      <li class="current">{{ partsData.parts_attr.input_scrn }}</li>
      <li>{{ partsData.parts_attr.confirm_scrn }}</li>
      <li>{{ partsData.parts_attr.complete_scrn }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FormPreviewPartsStep',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.form-step {
  ul {
    display: flex;
    align-items: center;
    position: relative;
    list-style: none;
    margin: 0 0 1em;
    padding: 0;
    text-align: center;
    width: 100%;
    overflow: hidden;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 33.333%;
      height: 40px;
      padding: 0 24px 0 8px;
      color: #8d8d8d;
      background-color: #ebeced;
      box-sizing: border-box;
      &::before,
      &::after {
        position: absolute;
        left: -15px;
        display: block;
        content: '';
        background-color: #ebeced;
        border-left: 8px solid #fff;
        width: 20px;
        height: 20px;
      }
      &::after {
        top: 0;
        transform: skew(30deg);
      }
      &::before {
        bottom: 0;
        transform: skew(-30deg);
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:first-child:before,
      &:first-child:after {
        content: none;
      }
      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &.current {
        color: #fff;
        background-color: #4f7df0;
        &::before,
        &::after {
          background-color: #4f7df0;
        }
      }
    }
  }
}
</style>
