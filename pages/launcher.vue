<template>
  <div class="main">
    <!-- eslint-disable vue/no-v-html -->
    <div class="main-contents l-main">
      <!-- information -->
      <div v-if="$common.checkArrayValue(newsList)" class="info">
        <div v-for="(news, index) in newsList" :key="index" class="info-inner">
          <p class="info-day">{{ news.day }}</p>
          <div class="info-text">
            <h3>{{ news.title }}</h3>
            <p v-html="news.text.replace(/\n/g, '<br/>')" />
          </div>
        </div>
      </div>
      <!-- /information -->
      <!-- ナビゲーションエリア -->
      <div class="l-main-navi">
        <h2>サービスメニュー</h2>
        <ul class="c-listBtn">
          <template v-for="dataNavi in availableFunctionList">
            <template
              v-if="
                (dataNavi.functionId === '08' &&
                  masterData.firmKind === '0') === false &&
                (dataNavi.functionId === '09' &&
                  masterData.firmKind === '0') === false
              "
            >
              <li
                :key="dataNavi.functionId"
                class="c-listBtn-cell"
                @click="transformSelectScreen(dataNavi)"
              >
                <div
                  v-if="
                    ['01', '03'].includes(dataNavi.functionId) &&
                    dataNavi.functionErrorFlag === 1
                  "
                  class="validation-message"
                >
                  <p><ErrorSVG class="icon-error" />未登録の情報があります</p>
                </div>
                <div class="c-listBtn-iconBox">
                  <WebsiteIconSVG v-if="dataNavi.functionId === '01'" />
                  <FormIconSVG v-if="dataNavi.functionId === '03'" />
                  <CommunityIconSVG v-if="dataNavi.functionId === '05'" />
                  <AccountIconSVG v-if="dataNavi.functionId === '06'" />
                  <CashFlowIconSVG v-if="dataNavi.functionId === '08'" />
                  <MmiIconSVG v-if="dataNavi.functionId === '09'" />
                  <StorageIconSVG v-if="dataNavi.functionId === '10'" />
                  <ContactIconSVG v-if="dataNavi.functionId === '11'" />
                  <MailIconSVG v-if="dataNavi.functionId === '12'" />
                  <span class="c-listBtn-label">{{
                    $common.getVersatileItem(20, dataNavi.functionId, 'value')
                  }}</span>
                </div>
              </li>
            </template>
          </template>
        </ul>
      </div>
      <!-- /ナビゲーションエリア -->
      <BizskyJournal
        v-if="bizskyJournalData.length >= 1"
        :bizsky-journal-data="bizskyJournalData"
      />
    </div>
    <UnValidFunctionManagementModal
      v-if="showUnValidFunctionManagementModalFlg"
      @close="hideUnValidFunctionManagementModal()"
    />
    <UnValidFunctionModal
      v-if="showUnValidFunctionModalFlg"
      @close="hideUnValidFunctionModal()"
    />
    <IncompleteBasicSettingsModal
      v-if="showIncompleteBasicSettingsModalState"
      @close="$common.getBasicSettingCompleteStatus()"
    />
    <ErrorMmiModal v-if="showMmiErrorModalFlg" @close="hideMmiErrorModal()" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'servicelauncher',
  components: {},
  data() {
    return {
      bizskyJournalData: [],
      availableFunctionList: [],
      newsList: {},
      showUnValidFunctionManagementModalFlg: false,
      showUnValidFunctionModalFlg: false,
      showMmiErrorModalFlg: false,
      isShowFinance: false,
    }
  },
  computed: {
    ...mapState('common', [
      'masterData',
      'showIncompleteBasicSettingsModalState',
    ]),
  },
  created() {
    this.getBizskyJournal()
    this.getNews() // ニュース一覧の取得処理
    this.getServicelauncher() // サービスランチャ利用コンテンツ一覧の取得処理
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setShowIncompleteBasicSettingsModalState']),
    /**
     * bizskyジャーナル記事取得処理
     */
    getBizskyJournal() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getBizskyJournal(paramData)
        .then((resData) => {
          if (resData.status === 200) {
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
    /**
     * サービスランチャ利用コンテンツ一覧の取得処理
     */
    getServicelauncher() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getServicelauncher(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.availableFunctionList = resData.data.availableFunctionList

            if (
              resData.data.activate === false ||
              resData.data.firmKind === false
            ) {
              this.isShowFinance = true
            }
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
     * ニュース一覧の取得処理
     */
    getNews() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getServicelauncherNews(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.newsList = resData.data.dataList
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
     * 選択した機能のページに遷移
     *
     * @param {object} nav メニュー情報
     */
    transformSelectScreen(nav) {
      if (nav.functionValidFlag === 0) {
        if (this.masterData.managementFlag === 1) {
          this.showUnValidFunctionManagementModal() // 無効機能通知モーダルの表示
        } else {
          this.showUnValidFunctionModal() // 無効機能通知モーダルの表示
        }

        return
      }

      switch (nav.functionId) {
        case '01':
          if (nav.functionErrorFlag === 1) {
            this.setShowIncompleteBasicSettingsModalState(true)
          } else {
            this.$router.push('/site/dashboard/')
          }
          break
        case '03':
          if (nav.functionErrorFlag === 1) {
            this.setShowIncompleteBasicSettingsModalState(true)
          } else {
            this.$router.push('/form/dashboard/')
          }
          break
        case '05':
          this.$router.push('/community/timeline/')
          break
        case '06':
          this.$router.push('/account/dashboard/')
          break
        case '08':
          this.$router.push(nav.functionUrl)
          break
        case '09':
          if (nav.functionErrorFlag === 1) {
            this.showMmiErrorModal()
          } else {
            this.$router.push(nav.functionUrl)
          }
          break
        case '10':
          this.$router.push('/storage/home/')
          break
        case '11':
          this.$router.push('/contact/list/')
          break
        case '12':
          this.$router.push('/mail/list/')
          break
        default:
          this.$router.push(nav.functionUrl)
          break
      }
    },
    /**
     * 無効機能通知モーダル(管理者)の表示
     */
    showUnValidFunctionManagementModal() {
      this.showUnValidFunctionManagementModalFlg = true
    },
    /**
     * 無効機能通知モーダル(管理者)の非表示
     */
    hideUnValidFunctionManagementModal() {
      this.showUnValidFunctionManagementModalFlg = false
    },
    /**
     * 無効機能通知モーダルの表示
     */
    showUnValidFunctionModal() {
      this.showUnValidFunctionModalFlg = true
    },
    /**
     * 無効機能通知モーダルの非表示
     */
    hideUnValidFunctionModal() {
      this.showUnValidFunctionModalFlg = false
    },
    /**
     * MMIエラー通知モーダルの表示
     */
    showMmiErrorModal() {
      this.showMmiErrorModalFlg = true
    },
    /**
     * MMIエラー通知モーダルの非表示
     */
    hideMmiErrorModal() {
      this.showMmiErrorModalFlg = false
    },
  },
  head() {
    return {
      title: 'bizskyDXサービス一覧｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.info {
  max-width: 1036px;
  background: #f5f5f5 0% 0% no-repeat padding-box;
  border-radius: 5px;
  padding: 24px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  &-inner {
    width: 100%;
    display: table;
    &:not(:last-of-type) {
      padding-bottom: 24px;
    }
    & > * {
      display: table-cell;
    }
  }
  &-day {
    padding-right: 40px;
    width: calc(6em + 40px);
  }
  &-text {
    h3 {
      font-size: 17px;
      margin-bottom: 8px;
    }
  }
}
.l-main-navi {
  max-width: 1046px;
  margin: 40px auto 0;
  @include mq(sp) {
    padding: 0 16px;
  }
  h2 {
    margin-bottom: 24px;
  }
}
.c-listBtn {
  display: flex;
  flex-wrap: wrap;
  position: relative;

  &-cell {
    position: relative;
    width: calc((100% - 32px) / 3);
    height: 158px;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    margin-right: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    @include mq(sp) {
      width: calc((100% - 16px) / 2);
    }
    &:nth-child(3n) {
      @include mq(pc) {
        margin-right: 0;
      }
    }
    &:nth-child(2n) {
      @include mq(sp) {
        margin-right: 0;
      }
    }
    &:hover {
      background: #f8f9fa;
    }
  }
  &-iconBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    svg {
      margin-bottom: 16px;
    }
  }
}
.validation-message {
  width: 100%;
  position: absolute;
  top: -16px;
  left: 0;
  display: flex;
  justify-content: center;
  p {
    background: #e60012;
    border-radius: 4px;
    padding: 6px;
    color: #fff;
    font-size: 13px;
    &:after {
      content: '';
      position: absolute;
      top: 99%;
      left: 50%;
      margin-left: -8px;
      border: 8px solid transparent;
      border-top: 8px solid #e60012;
    }
  }
}
.icon-error {
  height: 20px;
  width: 20px;
  fill: #fff;
  margin-right: 4px;
}
</style>
