<template>
  <div
    class="main-container initialTour"
    :class="{ 'show-scroll': $common.checkShowScrollBar() }"
  >
    <div class="main-contents l-main">
      <div class="header">
        <h2>bizskyDXをはじめましょう</h2>
        <p>
          bizskyDXの機能を利用するために、まずは下記の手順に沿って必要情報を入力してください。<br />情報入力の途中で一時保存することもできるので無理のないペースで進めましょう。サービス開始後にも情報の登録・編集は可能です。
        </p>
      </div>
      <div class="body">
        <div>
          <div class="body-popmsg">
            <p>まずはここから</p>
          </div>
          <h3>企業プロフィール</h3>
          <p class="body-text">
            Webサイトやコミュニティで<br />表示される基本情報を登録します。
          </p>
          <div class="progress">
            <ProgressBar
              class="progress-bar"
              :progress="initialSettings.companyProfileInputRate"
            />
            <p>{{ initialSettings.companyProfileInputRate }}%</p>
          </div>
          <button
            class="btn btn-secondary btn-long"
            @click="showCompanyProfileModal()"
          >
            登録をはじめる
          </button>
        </div>
        <div>
          <h3>メンバープロフィール</h3>
          <p class="body-text">
            コミュニティで<br />表示されるメンバーのプロフィールを登録します。
          </p>
          <div class="progress">
            <ProgressBar
              class="progress-bar"
              :progress="initialSettings.representativeProfileInputRate"
            />
            <p>{{ initialSettings.representativeProfileInputRate }}%</p>
          </div>
          <button
            class="btn btn-secondary btn-long"
            @click="showProfileModal()"
          >
            登録をはじめる
          </button>
        </div>
      </div>
      <div class="footer">
        <button
          class="btn btn-primary btn-long"
          :class="{
            'btn-disabled': initialSettings.requiredColumnAllInputFlag === '0',
          }"
          @canplaythrough="profileModalFlg = true"
          @click="serviceStart()"
        >
          サービスを開始する
        </button>
        <p>
          <a class="link-text" @click="showSupportModal()">
            初期設定ツアーを中断するには？
          </a>
        </p>
      </div>
      <CompanyProfileModal
        v-if="companyProfileModalFlg"
        :initial-settings="initialSettings"
        @close="hideCompanyProfileModal()"
        @update="updateInitialSettings()"
      />
      <ProfileModal
        v-if="profileModalFlg"
        :initial-settings="initialSettings"
        @close="hideProfileModal()"
        @update="updateInitialSettings()"
      />
      <ProfileImageUploadModal
        v-if="profileImageUploadModalState"
        :init-image="profileImageStore"
        @reflect="changeProfileImage($event)"
        @close="hideProfileImageModal()"
      />
      <SaveModal v-show="supportModalFlg" @close="hideSupportModal()" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ProgressBar from '~/components/cms/basicSettings/progress/ProgressBar.vue'
import CompanyProfileModal from '~/components/starter/CompanyProfileModal.vue'
import ProfileModal from '~/components/starter/ProfileModal.vue'
import SaveModal from '~/components/starter/SaveModal.vue'

export default {
  layout: 'onlyHeaderLogo',
  components: {
    ProgressBar,
    CompanyProfileModal,
    ProfileModal,
    SaveModal,
  },
  data() {
    return {
      initialSettings: {
        companyProfileInputRate: 0,
        representativeProfileInputRate: 0,
        requiredColumnAllInputFlag: '0',
        companyRecordVersion: null,
        profileRecordVersion: null,
      },
      companyProfileModalFlg: false,
      profileModalFlg: false,
      supportModalFlg: false,
    }
  },
  computed: {
    ...mapState('common', [
      'profileImageUploadModalState',
      'profileImageStore',
    ]),
  },
  created() {
    this.getInitialSettings() // 初期ツアー設定情報の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', [
      'setProfileImage',
      'setProfileImageUploadModalState',
    ]),
    /**
     * 初期ツアー設定情報の取得
     * 企業情報やプロフィール情報の入力率やサービス利用開始可能判定値を取得
     */
    getInitialSettings() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getInitialSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.initialSettings = resData.data
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
     * 企業プロフィール設定モーダルの表示
     */
    showCompanyProfileModal() {
      this.companyProfileModalFlg = true
    },
    /**
     * 企業プロフィール設定モーダルの非表示
     */
    hideCompanyProfileModal() {
      this.companyProfileModalFlg = false
    },
    /**
     * プロフィール設定モーダルの表示
     */
    showProfileModal() {
      this.profileModalFlg = true
    },
    /**
     * プロフィール設定モーダルの非表示
     */
    hideProfileModal() {
      this.profileModalFlg = false
    },
    /**
     * 補足モーダルの表示
     */
    showSupportModal() {
      this.supportModalFlg = true
    },
    /**
     * 補足モーダルの非表示
     */
    hideSupportModal() {
      this.supportModalFlg = false
    },
    /**
     * 初期ツアー設定データの再取得
     */
    updateInitialSettings() {
      this.getInitialSettings()
    },
    /**
     * サービス開始
     */
    serviceStart() {
      const paramData = {
        companyRecordVersion: this.initialSettings.companyRecordVersion,
        profileRecordVersion: this.initialSettings.profileRecordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .serviceStart(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.getMasterData()
            this.$router.push('/launcher/')
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
     * プロフィール画像設定モーダルを閉じる
     */
    hideProfileImageModal() {
      this.setProfileImageUploadModalState(false)
    },
    /**
     * プロフィール画像の変更
     */
    changeProfileImage(val) {
      this.setProfileImage(val)
    },
  },
  head() {
    return {
      title: 'さぁ、はじめましょう｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-container {
  height: auto;
}
.initialTour {
  text-align: center;
}
.header {
  margin-bottom: 40px;
  h2 {
    margin-bottom: 8px;
  }
}
.body {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  &-text {
    margin-bottom: 43px;
  }
  > * {
    margin: 8px;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    width: 364px;
    padding-top: 40px;
    padding-bottom: 40px;
    position: relative;
    .body-popmsg {
      width: 100%;
      position: absolute;
      top: -16px;
      left: 0;
      display: flex;
      justify-content: center;
      p {
        background: #4f7df0;
        border-radius: 4px;
        padding: 6px 12px;
        color: #fff;
        font-size: 13px;
        &:after {
          content: '';
          position: absolute;
          top: 99%;
          left: 50%;
          margin-left: -8px;
          border: 8px solid transparent;
          border-top: 8px solid #4f7df0;
        }
      }
    }
    h3 {
      margin-bottom: 8px;
    }
    .progress {
      margin: 0 auto 23px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 12px;
      &-bar {
        width: 120px;
      }
      p {
        font-size: 12px;
        margin-left: 9px;
      }
    }
    .btn {
      margin: 0 auto;
    }
  }
}
.footer {
  > * {
    display: block;
    margin: 0 auto 16px auto;
  }
}
</style>
