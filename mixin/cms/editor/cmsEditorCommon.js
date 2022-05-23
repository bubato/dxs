export default {
  computed: {
    /**
     * テキストカラーのクラスの取得
     *
     * @param {string} colorId カラーID
     */
    mixin_getTextColor() {
      return (colorId) => {
        let returnClassName = ''

        switch (colorId) {
          case '1':
            returnClassName = 'color-black'
            break
          case '2':
            returnClassName = 'color-darkgray'
            break
          case '3':
            returnClassName = 'color-gray'
            break
          case '4':
            returnClassName = 'color-white'
            break
          default:
            break
        }

        return returnClassName
      }
    },
    /**
     * テキスト位置を参照するクラスの取得
     *
     * @param {string} alignVal テキスト位置
     */
    mixin_getTextAlignClass() {
      return (alignVal) => {
        let returnClassName = ''

        if (alignVal === '1') {
          returnClassName = 'text-align-left'
        } else if (alignVal === '2') {
          returnClassName = 'text-align-center'
        } else if (alignVal === '3') {
          returnClassName = 'text-align-right'
        }

        return returnClassName
      }
    },
    /**
     * 空白のクラスを取得
     *
     * @param {object} spaceInfo スペースの設定値
     * @return {string} 空白のクラス
     */
    mixin_getSpaceClass() {
      return (spaceInfo) => {
        let spaceClass = ''

        if (spaceInfo) {
          if (spaceInfo.spaceKind === '1') {
            spaceClass = `space-${this.mixin_getSpaceNum(spaceInfo.space)}`
          } else if (spaceInfo.spaceKind === '2') {
            spaceClass = `space-top-${this.mixin_getSpaceNum(
              spaceInfo.topSpace
            )} space-right-${this.mixin_getSpaceNum(
              spaceInfo.rightSpace
            )} space-bottom-${this.mixin_getSpaceNum(
              spaceInfo.bottomSpace
            )} space-left-${this.mixin_getSpaceNum(spaceInfo.leftSpace)}`
          }
        }

        return spaceClass
      }
    },
    /**
     * 空白値の取得
     *
     * @param {string} spaceType スペースの区分値
     * @return {string} 空白の値
     */
    mixin_getSpaceNum() {
      return (spaceType) => {
        let spaceNum = 0

        switch (spaceType) {
          case '1':
            spaceNum = 0
            break
          case '2':
            spaceNum = 20
            break
          case '3':
            spaceNum = 40
            break
          case '4':
            spaceNum = 60
            break
          case '5':
            spaceNum = 80
            break
          case '6':
            spaceNum = 100
            break
          default:
            break
        }

        return String(spaceNum)
      }
    },
  },
  methods: {},
}
