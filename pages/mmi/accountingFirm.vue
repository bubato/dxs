<template>
  <div v-if="isInitialized">
    <div class="header flex flex-between">
      <h1>会計事務所一覧</h1>
    </div>

    <div class="row">
      <p>選択した会計事務所からのデータで自社分析のPL/BSを表示します。</p>
    </div>

    <AdvisorsTable
      v-model="companyMasterInfo.dataList"
      @selected="onSelected"
    />

    <div class="row flex flex-center save-button-container">
      <button class="btn btn-basic btn-long" @click="onConfirm">
        設定内容を保存
      </button>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import AdvisorsTable from '~/components/mmi/AdvisorsTable.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'
import mmiCompanyInfoUtilityMixin from '~/mixin/mmi/companyInfoUtility.js'

export default {
  layout: 'mmiLayout',
  components: {
    AdvisorsTable,
    CommonFooter,
  },
  mixins: [mmiCompanyInfoUtilityMixin],
  data() {
    return {
      isInitialized: false,
      totalDataCount: 0,
      inputSearchText: '',
      selectedAdvisor: null,
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', ['selectSaveCondition']),
    ...mapState('mmi/companyReport', [
      'companyMasterInfo',
      'accountingFirmFlg',
    ]),
  },
  created() {
    this.output('会計事務所一覧画面表示 開始')
    this.initFunc()
  },
  mounted() {},
  methods: {
    ...mapMutations('mmi/companyReport', ['setCompanyMasterInfo']),
    initFunc() {
      if (
        !this.accountingFirmFlg &&
        this.companyMasterInfo.dataList.length > 1
      ) {
        this.isInitialized = true
      } else {
        this.$router.push('/launcher/')
      }
    },
    onConfirm() {
      if (!this.selectedAdvisor) {
        return
      }

      const requestParams = {
        linkageId: this.selectedAdvisor.linkageId,
        tenantRecordVersion: this.companyMasterInfo.tenantRecordVersion,
      }
      this.$common.addCallApiNum()
      this.output('API テナント情報更新 開始')
      this.$api
        .putUpdateTenantInfo(requestParams)
        .then((res) => {
          this.output('API テナント情報更新 終了')
          const companyMasterRequestParams = {}
          this.output('API 会社マスタ取得 開始')
          this.$api
            .getCompanyMasterInfo(companyMasterRequestParams)
            .then((res) => {
              this.output('API 会社マスタ取得 終了')
              this.setCompanyMasterInfo(res.data)
              this.$common.subCallApiNum()
              this.$common.showCompletePopAlert('ActionMsg_Gen01')
            })
            .catch((error) => {
              this.output('API 会社マスタ取得 エラー')
              this.$common.apiErrorFunc(error)
            })
        })
        .catch((error) => {
          this.output('API テナント情報更新 エラー')
          this.$common.subCallApiNum()
          this.$common.apiErrorFunc(error)
        })
    },
    onSelected(selectedAdvisor) {
      this.selectedAdvisor = selectedAdvisor
    },
  },
  head() {
    return {
      title: '会計事務所一覧｜MMI｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.icon {
  margin: 4px;
}

.pane {
  padding: 16px;
  position: relative;
}

div.header-select {
  width: 360px;
  position: relative;
}

.save-button-container {
  margin: 60px 0px;
}
</style>
