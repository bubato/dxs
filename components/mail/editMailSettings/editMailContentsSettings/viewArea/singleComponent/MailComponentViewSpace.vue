<template>
  <div
    class="view-space"
    :class="getSpaceHeightClass(component.selectHeight)"
  ></div>
</template>

<script>
export default {
  name: 'MailComponentViewSpace',
  props: {
    component: { type: Object, required: true },
  },
  computed: {
    /**
     * 空白の高さを定めているClass名の取得
     *
     * @param {string} selectVal セレクトボックスで選択した高さ
     */
    getSpaceHeightClass() {
      return (selectVal) => {
        let returnClassName = ''

        switch (selectVal) {
          case '1':
            returnClassName = 'space-height-20'
            break
          case '2':
            returnClassName = 'space-height-40'
            break
          case '3':
            returnClassName = 'space-height-60'
            break
          case '4':
            returnClassName = 'space-height-80'
            break
          case '5':
            returnClassName = 'space-height-100'
            break
          default:
            returnClassName = 'space-height-20'
            break
        }

        return returnClassName
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
