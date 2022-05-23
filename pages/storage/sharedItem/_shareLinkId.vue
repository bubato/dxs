<template>
  <div>
    <div class="sharedItem">
      <div class="context">
        <h2>共有されたファイル</h2>
        <div class="sharedItemWrap">
          <div class="sharedLinkArea">
            <p class="sharedLink" @click="getStorageDownloadShare()">
              <FileSVG /><a>{{ fileName }}</a>
            </p>
            <p class="read">ファイル名をクリックしてダウンロードできます。</p>
          </div>
          <div class="sharedDataArea">
            <h4>ファイルの情報</h4>
            <ul class="sharedData">
              <li>
                <h5>ファイルの所有者</h5>
                {{ ownerName }}
              </li>
              <li>
                <h5>ファイルの更新日</h5>
                {{ modifiedDate }}
              </li>
              <li>
                <h5>ファイルのサイズ</h5>
                {{ fileSize }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapBizskyJournal">
      <BizskyJournal
        v-if="bizskyJournalData.length >= 1"
        :bizsky-journal-data="bizskyJournalData"
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'onlyHeaderLogo',
  components: {},
  data() {
    return {
      shareLinkId: '',
      fileName: '',
      fileSize: '',
      ownerName: '',
      modifiedDate: '',
      bizskyJournalData: [],
    }
  },
  created() {
    this.getBizskyJournal()
    this.getShareLinkId()
  },
  methods: {
    /**
     * 共有リンクIDの設定
     */
    getShareLinkId() {
      const checkShareLinkId = this.$route.params.shareLinkId

      if (checkShareLinkId) {
        this.shareLinkId = checkShareLinkId
        this.getStorageShareLinks()
      }
    },
    /**
     * 共有ファイル情報の取得
     */
    getStorageShareLinks() {
      const paramData = {
        shareLinkId: this.shareLinkId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getStorageShareLinks(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.fileName = resData.data.fileName
            this.fileSize = this.setFileSizeText(resData.data.fileSize)
            this.ownerName = resData.data.lastName + resData.data.firstName
            this.modifiedDate = resData.data.modifiedDate
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ファイルサイズテキストの設定
     *
     * @param {Number} fileSize ファイルサイズ
     * @returns {String} backNumber ファイルサイズ+単位
     */
    setFileSizeText(fileSize) {
      let backNumber

      if (fileSize < 1048576) {
        backNumber = fileSize / 1024 + 'KB'
      } else {
        backNumber = fileSize / 1048576 + 'MB'
      }

      return backNumber
    },
    /**
     * 共有リンクダウンロードURL取得API
     */
    getStorageDownloadShare() {
      const paramData = { shareLinkId: this.shareLinkId }

      this.$common.addCallApiNum()
      this.$api
        .getStorageDownloadShare(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.downloadFile(resData.data.downloadURL, this.fileName)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * bizskyジャーナル記事取得処理
     */
    getBizskyJournal() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getBizskyJournal(paramData)
        .then((resData) => {
          if (resData.statusText === 'OK') {
            const bizskyJournalDataList = resData.data.items.slice(0, 9)

            this.bizskyJournalData = bizskyJournalDataList.map((data) => {
              if (data.url.slice(0, 1) === '/') {
                data.url = 'https://journal.bizocean.jp' + data.url
              }

              if (data.thumbnailUrl.slice(0, 1) === '/') {
                data.thumbnailUrl =
                  'https://journal.bizocean.jp' + data.thumbnailUrl
              }

              return data
            })
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  head() {
    return {
      title: '共有ファイル｜｜bizskyDXで中堅・中小企業に成長と活力を',
    }
  },
}
</script>

<style lang="scss" scoped>
.sharedItem {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .context {
    h2 {
      margin-top: 8px;
    }
    .sharedItemWrap {
      margin: 32px 0 16px;
      padding: 40px;
      top: 201px;
      left: 339px;
      width: 688px;
      height: 315px;
      background: #f7f8f9;
      border-radius: 6px;
      .sharedLinkArea {
        text-align: center;
        margin: -6px 0 32px;
        padding-bottom: 33px;
        border-bottom: 1px solid #e5e5e5;
        svg {
          margin: -10px 8px 0 0;
        }
        a {
          font-size: 17px;
          text-decoration: underline;
        }
        .read {
          margin-top: 7px;
          color: #8d8d8d;
        }
      }
    }
    .sharedDataArea {
      h4 {
        margin-bottom: 11px;
      }
      .sharedData {
        li {
          padding-bottom: 9px;
          h5 {
            font-size: 15px;
            display: inline-block;
            margin-right: 21px;
          }
          p {
            display: inline-block;
          }
        }
      }
    }
  }
  .image {
    margin-left: 64px;
  }
  .wrapBizskyJournal {
    position: relative;
    width: 100%;
  }
}
</style>
