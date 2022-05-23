<template>
  <div>
    <div v-if="ogpDataList.length > 0" class="ogp-list">
      <template v-for="(ogpData, index) in ogpDataListSetting">
        <OgpTemplate
          :key="index"
          :ogp-data="ogpData"
          :image-size="imageSize"
          class="ogp"
          @delete="deleteData(ogpData.inputUrl)"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OgpTemplateSetting',
  components: {},
  props: {
    ogpDataList: {
      type: Array,
      required: true,
    },
    inputMsg: {
      type: String,
      default: '',
      required: false,
    },
    imageSize: {
      type: Object,
      default: () => ({
        pcSize: '140',
        spSize: '120',
      }),
      required: false,
    },
  },
  data() {
    return {
      ogpDataListSetting: [], // OGPリストデータ
      getOgpDataList: [], // OGP取得時のデータリスト（順不同）
      msgUrlList: [], // メッセージに含まれるURLのリスト
      alreadyObtainedOgpList: [], // 一度取得したOGPのリスト
      alreadyObtainedUrlList: [], // 入力した一つ前のURLリスト
    }
  },
  computed: {},
  watch: {
    /**
     * タイムラインメッセージの更新を確認
     */
    inputMsg() {
      this.changeMsg()
      if (this.inputMsg === '') {
        this.initOgpData()
      }
    },
  },
  created() {},
  mounted() {
    this.ogpDataListSetting = this.ogpDataList
    // 入力値がある場合（編集）
    if (this.inputMsg !== '') {
      this.alreadyObtainedUrlList = this.$common.getUrlInStr(this.inputMsg)
      this.alreadyObtainedOgpList = this.alreadyObtainedUrlList
    }
  },
  methods: {
    /**
     * OGPデータの初期化
     */
    initOgpData() {
      this.ogpDataListSetting = [] // OGPリストデータ
      this.getOgpDataList = [] // OGP取得時のデータリスト（順不同）
      this.msgUrlList = [] // メッセージに含まれるURLのリスト
      this.alreadyObtainedOgpList = [] // 一度取得したOGPのリスト
      this.alreadyObtainedUrlList = [] // 入力した一つ前のURLリスト

      this.$emit('update', this.ogpDataListSetting)
    },
    /**
     * OGPデータリストの更新
     */
    updateOgpDataList() {
      this.$emit('update', this.ogpDataListSetting)
    },
    /**
     * OGPタグを削除
     *
     * @param {string} url 削除するOGPのURL
     */
    deleteData(url) {
      this.ogpDataListSetting = this.ogpDataListSetting.filter(
        (item) => url !== item.inputUrl
      )
      this.updateOgpDataList()
    },
    /**
     * 投稿テキスト変更後1秒間入力がないことを確認
     */
    changeMsg() {
      this.$emit('start')
      clearInterval(this.checkOgpTimer)
      this.checkOgpTimer = setTimeout(() => {
        this.addInputMsgToUrlList()
      }, 1000)
    },
    /**
     * 投稿メッセージからURLのリストを作成
     * 既に取得したOGPURLが、MSGから削除されていた場合、取得済リストから削除
     *
     */
    addInputMsgToUrlList() {
      this.msgUrlList = this.$common.getUrlInStr(this.inputMsg) // タイムラインのMSGから、URLを取得
      this.msgUrlList = this.msgUrlList.filter((x, i, self) => {
        return self.indexOf(x) === i
      })

      this.setDeleteUrl()

      // 入力されたメッセージより取得したURLから既に取得済みのOGPURLを削除
      this.alreadyObtainedUrlList = this.$common.getDeleteStrArrayMerge(
        this.msgUrlList,
        this.alreadyObtainedOgpList
      )
      if (this.alreadyObtainedUrlList.length === 0) {
        this.$emit('end')
        return
      }
      // URLがある場合、OGPAPIをたたく
      if (this.alreadyObtainedUrlList.length > 0) {
        this.getOGPData(this.alreadyObtainedUrlList)
      }
    },
    /**
     * 入力されたURLが削除された場合、表示しているOGPデータを削除
     * 取得していたが、存在しなくなったURL ここはひとつ前の入力と比較
     */
    setDeleteUrl() {
      const deletedUrl = this.$common.getDeleteStrArrayMerge(
        this.alreadyObtainedUrlList, // 取得済みのOGPリスト
        this.msgUrlList // 入力したURL
      )
      if (deletedUrl.length > 0) {
        // 表示OGPリストから存在しなくなったURLのOGPデータを削除
        this.ogpDataListSetting = this.ogpDataListSetting.filter(function (
          item
        ) {
          if (!deletedUrl.includes(item.inputUrl)) {
            return item
          }
        })
        this.getOgpDataList = this.getOgpDataList.filter(function (item) {
          if (!deletedUrl.includes(item.inputUrl)) {
            return item
          }
        })
        // 一度取得したOGPデータのリストから、入力のなくなったURLを削除する
        this.alreadyObtainedOgpList = this.alreadyObtainedOgpList.filter(
          function (item) {
            if (!deletedUrl.includes(item)) {
              return item
            }
          }
        )
      }
    },
    /**
     * OGPデータの取得
     *
     */
    getOGPData() {
      this.urlCount = 0

      for (let index = 0; index < this.alreadyObtainedUrlList.length; index++) {
        const paramData = {
          url: this.alreadyObtainedUrlList[index],
        }

        // this.$common.addCallApiNum() // OGPはloadingなし
        this.$api
          .getOGPData(paramData)
          .then((resData) => {
            if (resData.data.result === 0) {
              // 取得したOGPデータを表示
              const ogpData = resData.data.ogp
              const ogpUrl = ogpData.url

              this.urlCount++

              if (ogpUrl) {
                ogpData.inputUrl = paramData.url
                this.getOgpDataList.push(ogpData)

                if (this.urlCount < this.alreadyObtainedUrlList.length) {
                  return false
                }

                this.ogpDataListSetting = this.getOrderOgpToMsgUrl()
                this.alreadyObtainedOgpList = this.updateAlreadyObtainedOgpList()

                this.$emit('end')
                this.updateOgpDataList()
              } else {
                this.$emit('end')
              }
            } else {
              this.$common.showCommonError(resData.data.errorInfo)
            }
          })
          .catch((error) => {
            this.$common.apiErrorFunc(error)
          })
      }
    },
    /**
     * 取得したOGPのリストを作成
     */
    updateAlreadyObtainedOgpList() {
      const listInputUrl = this.ogpDataListSetting.map(function (item) {
        return item.inputUrl
      })
      return this.alreadyObtainedOgpList.concat(listInputUrl)
    },
    /**
     * 取得したOGPデータを、入力したURLの順番になるよう並べ替え
     */
    getOrderOgpToMsgUrl() {
      const list = []
      for (
        let msgUrlListIndex = 0;
        this.msgUrlList.length > msgUrlListIndex;
        msgUrlListIndex++
      ) {
        const msgUrl = this.msgUrlList[msgUrlListIndex]
        for (const getOgpDataListIndex in this.getOgpDataList) {
          if (this.getOgpDataList[getOgpDataListIndex].inputUrl === msgUrl) {
            list.push(this.getOgpDataList[getOgpDataListIndex])
          }
        }
      }
      return list
    },
  },
}
</script>

<style lang="scss" scoped></style>
