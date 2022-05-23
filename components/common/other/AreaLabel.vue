<template>
  <div v-if="areaLabel.isMouseHover" class="areaLabel" :style="stylePosition">
    <p>{{ areaLabel.text }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AreaLabel',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('common', ['areaLabel']),
    stylePosition() {
      const rect = {}
      const margin = 7 // オブジェクトから表示されるエリアラベルへのマージン
      const areaLabelRect = this.areaLabel.rect
      switch (this.areaLabel.direction) {
        case 'right':
          rect.top =
            areaLabelRect.top + window.pageYOffset + areaLabelRect.height / 2
          rect.left = areaLabelRect.right + window.pageYOffset + margin
          rect.transform = 'translate(0,-50%)'
          break
        case 'left':
          rect.top =
            areaLabelRect.top + window.pageYOffset + areaLabelRect.height / 2
          rect.left = areaLabelRect.left + window.pageYOffset - margin
          rect.transform = 'translate(-100%,-50%)'
          break
        case 'top':
          rect.top = areaLabelRect.top + window.pageYOffset - margin
          rect.left =
            areaLabelRect.left + window.pageXOffset + areaLabelRect.width / 2
          rect.transform = 'translate(-50%,-100%)'
          break
        case 'bottom':
          rect.top = areaLabelRect.bottom + window.pageYOffset + margin
          rect.left =
            areaLabelRect.left + window.pageXOffset + areaLabelRect.width / 2
          rect.transform = 'translate(-50%,0)'
          break
      }
      return {
        top: rect.top + 'px',
        left: rect.left + 'px',
        transform: rect.transform,
      }
    },
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.areaLabel {
  position: absolute;
  z-index: 1000000;
  background: #8d8d8d 0% 0% no-repeat padding-box;
  color: #ffffff;
  border-radius: 4px;
  opacity: 0.9;
  padding: 8px;
  font-size: 13px;
}
</style>
