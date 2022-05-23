<template>
  <div v-if="ownDomainInfo || subDomainInfo" class="basic-settings">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2>ドメイン</h2>
        <p class="header-sub">利用中のドメイン情報を表示します。</p>
      </div>
      <div class="contents">
        <div class="own-domain-block">
          <div
            v-if="ownDomainInfo.status === 0 && masterData.managementFlag === 1"
            class="context"
          >
            <h4>
              独自のドメインを取得してWebサイトの信頼感を高めましょう。<br />契約プランから独自ドメインオプションをお申し込みください。
            </h4>
            <button
              class="btn btn-primary btn-long"
              @click="transitionAccountContractScreen()"
            >
              契約プラン
            </button>
          </div>
          <div v-if="ownDomainInfo.status !== 0" class="own-domain">
            <h3>独自ドメイン情報</h3>
            <div v-if="ownDomainInfo.status === 3" class="domain-active">
              <div class="heading">
                <CheckCircleSVG class="icon-checkCircle icon" />
                <h5>現在利用中</h5>
              </div>
              <div class="domain-contents">
                <OwnDomainInfoDetail :own-domain-info="ownDomainInfo" />
              </div>
            </div>
            <div v-else class="domain-inactive">
              <OwnDomainInfoDetail :own-domain-info="ownDomainInfo" />
            </div>
          </div>
        </div>
        <div v-if="subDomainInfo" class="sub-domain">
          <h3>サブドメイン情報</h3>
          <div
            v-if="subDomainInfo.status === 1 && ownDomainInfo.status !== 3"
            class="domain-active"
          >
            <div class="heading">
              <CheckCircleSVG class="icon-checkCircle icon" />
              <h5>現在利用中</h5>
            </div>
            <div class="domain-contents">
              <SubDomainInfoDetail :sub-domain-info="subDomainInfo" />
            </div>
          </div>
          <div v-else class="domain-inactive">
            <SubDomainInfoDetail :sub-domain-info="subDomainInfo" />
          </div>
        </div>
      </div>
    </div>
    <!-- /main-contents -->
    <CommonFooter />
    <ChangeOwnDomainConfirmModal
      v-if="showChangeOwnDomainConfirmModalState"
      @update="getCmsBasicSettingsDomain()"
      @close="setShowChangeOwnDomainConfirmModalState(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      ownDomainInfo: null, // 独自ドメイン情報
      subDomainInfo: null, // サブドメイン情報
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    ...mapState('cms/basicSettingsStore', [
      'showChangeOwnDomainConfirmModalState',
    ]),
  },
  created() {
    this.getCmsBasicSettingsDomain() // ドメイン情報の取得APIの呼び出し
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setShowIncompleteBasicSettingsModalState']),
    ...mapMutations('cms/basicSettingsStore', [
      'setShowChangeOwnDomainConfirmModalState',
    ]),
    /**
     * ドメイン情報の取得APIの呼び出し
     */
    getCmsBasicSettingsDomain() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getCmsBasicSettingsDomain(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (
              [0, 1, 2].includes(resData.data.basicSettings.baseSettingStatus)
            ) {
              this.setShowIncompleteBasicSettingsModalState(true)
            } else {
              const domainList = resData.data.domainInfo
              const ownDomainInfo = domainList.find((data) => data.type === '1')
              const subDomainInfo = domainList.find((data) => data.type === '0')

              if (ownDomainInfo) {
                this.ownDomainInfo = ownDomainInfo
              }

              if (subDomainInfo) {
                this.subDomainInfo = subDomainInfo
              }
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
     * 契約プランページに遷移
     */
    transitionAccountContractScreen() {
      this.$router.push('/account/contract/')
    },
  },

  head() {
    return {
      title: 'ドメイン｜基本設定｜Webサイト｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.basic-settings {
  .header {
    &-sub {
      margin-top: 8px;
    }
    padding-bottom: 40px;
  }
  .contents {
    padding: 32px 0 48px 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;

    .context {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      padding: 32px 0;
      background: #f7f8f9;
      .btn {
        margin-top: 24px;
      }
    }
    .own-domain-block {
      .context,
      .own-domain {
        margin-bottom: 48px;
      }
    }

    .heading {
      display: flex;
      align-items: center;
      .icon-checkCircle {
        width: 32px;
        height: 32px;
        fill: #34c759;
      }
      h5 {
        margin-left: 8px;
      }
    }
    .domain-active {
      background: #f0fff4;
      margin-top: 16px;
      padding: 24px;
      .heading {
        display: flex;
        align-items: center;
        h5 {
          margin-left: 8px;
        }
      }
      .domain-contents {
        margin-top: 24px;
        padding: 20px 24px;
        background: #ffffff;
      }
    }
    .domain-inactive {
      margin-top: 16px;
      padding: 24px;
      background: #f7f8f9;
    }
  }
}
</style>
