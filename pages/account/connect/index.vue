<template>
  <div class="account-connect">
    <div class="main-contents">
      <div class="header">
        <div class="header-txt">
          <h2 class="header-title">外部ツール連携</h2>
          <p class="header-sub">外部ツールとの連携設定を行います。</p>
        </div>
      </div>
      <div class="flex">
        <div v-if="masterData.firmKind !== '0'" class="contentBody">
          <div class="contentBody-header flex">
            <img
              class="header-logo"
              :src="$common.getAssetsImgUrl('images/account/connect/logo1.png')"
              width="56"
              height="56"
              alt=""
            />
            <div class="contentBody-header-title">
              <span class="contentBody-header-sub font-size-middle"
                >連携先：ミロク情報サービス</span
              >
              <h3>MJSデータレイク</h3>
            </div>
          </div>
          <div class="contentBody-body">
            <p>
              Finance機能（MMI、資金繰り予測）を有効化するためMJSシステムとデータ連携を行います。
            </p>
            <p>
              株式会社ミロク情報サービスが提供する<br />bizskyIDのアカウント情報（メールアドレス、パスワード）を入力してください。
            </p>
          </div>
          <CustomLinkText
            class="contentBody-subLink"
            text="bizskyIDをまだお持ちでない方はこちらからアカウントを取得してください。"
            link="https://auth.bizsky.jp/MyAuth/ServiceLogin?act=em&cprg=ca&xtnl=f&returnurl=https%253a%252f%252fmypage.kantan.mjs.co.jp%252fAuthenticateUser%252fBizskyLoginAuthentication"
          />
          <button
            v-if="!activateData"
            class="btn btn-basic btn-long"
            @click="onActivate()"
          >
            連携
          </button>
          <span v-else class="linked"
            ><CheckCircleSVG class="icon-checkCircle" />連携済</span
          >
        </div>
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: { CommonFooter },
  data() {
    return {
      activateData: false,
    }
  },
  computed: { ...mapState('common', ['masterData']) },
  created() {},
  mounted() {
    this.getActivate()
  },
  methods: {
    /**
     * アクティベート確認APIの呼び出し
     */
    getActivate() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getActivateData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.activateData = resData.data.mjsDlk
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
     * アクティベート画面に遷移
     */
    onActivate() {
      this.$router.push('/account/connect/mjs-datalake/')
    },
  },

  head() {
    return {
      title: '外部ツール連携｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    &-logo {
      margin-right: 16px;
    }
    &-sub {
      margin-top: 8px;
    }
  }
}
// 連携コンテンツボックス
.contentBody {
  margin: 40px 0 0 0;
  padding: 32px;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  &-header {
    margin-bottom: 24px;
    &-sub {
      margin-bottom: 4px;
    }
  }
  &-body {
    p {
      margin-bottom: 24px;
    }
  }
  &-subLink {
    margin-bottom: 32px;
  }
  .linked {
    width: 200px;
    height: 48px;
    background: #f0fff4 0% 0% no-repeat padding-box;
    border: 1px solid #34c759;
    border-radius: 4px;
    display: flex;
    font-size: 15px;
    align-items: center;
    justify-content: center;
    .icon-checkCircle {
      width: 21px;
      height: 21px;
      fill: #34c759;
      margin-right: 9px;
    }
  }
}
</style>
