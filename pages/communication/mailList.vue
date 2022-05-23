<template>
  <div class="mail-list">
    <div v-show="!showReportComponentFlg" class="main-contents">
      <div class="header flex flex-between">
        <h1>メール一覧</h1>
        <div class="buttons">
          <button class="btn btn-basic btn-long">新規メールを作成</button>
        </div>
      </div>
      <div class="contents">
        <SearchOptions />
        <MailListTable />
      </div>
    </div>
    <div v-show="showReportComponentFlg" class="main-contents mail-report">
      <MailReport />
    </div>
    <CommonFooter />
    <ChangeTableItemModal
      v-if="showChangeTableItemModalFlg"
      :init-disp-table-items="showDispItems"
      :all-disp-table-items="allDispTableItems"
      @reflect="reflectChangeTableItem()"
      @close="hideChangeTableItemModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SearchOptions from '~/components/communication/mailList/SearchOptions.vue'
import MailListTable from '~/components/communication/mailList/MailListTable.vue'
import ChangeTableItemModal from '~/components/common/modal/ChangeTableItemModal.vue'
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: {
    SearchOptions,
    MailListTable,
    ChangeTableItemModal,
    CommonFooter,
  },
  data() {
    return {
      inputSearchText: '',
      selectSearchCheck: [],
      searchCheckOptions: [
        {
          value: '1',
          label: '配信済',
        },
        {
          value: '2',
          label: '配信予約',
        },
        {
          value: '3',
          label: '編集中',
        },
        {
          value: '4',
          label: '配信エラー',
        },
      ],
      allDispTableItems: [
        {
          key: 'id',
          name: 'メールID',
        },
        {
          key: 'title',
          name: 'メールタイトル',
        },
        {
          key: 'type',
          name: 'メールタイプ',
        },
        {
          key: 'status',
          name: 'ステータス',
        },
        {
          key: 'deliveryReservationDate',
          name: '配信予約日時',
        },
        {
          key: 'deliveryDate',
          name: '配信日時',
        },
        {
          key: 'deliveryErrorNum',
          name: '配信エラー数',
        },
        {
          key: 'deliveryNum',
          name: '配信数',
        },
        {
          key: 'facilityEffect',
          name: '施設効果',
        },
      ],
    }
  },
  computed: {
    ...mapState('communication/mailList', [
      'showReportComponentFlg',
      'mailListObj',
      'showDispItems',
      'showChangeTableItemModalFlg',
    ]),
  },
  created() {
    this.getMailList()
  },
  mounted() {
    document
      .getElementsByClassName('main-container')[0]
      .addEventListener('scroll', this.showScrollbar)
  },
  methods: {
    ...mapMutations('communication/mailList', [
      'setMailListObj',
      'hideChangeTableItemModal',
    ]),
    getMailList() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getMailList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setMailListObj(resData.data)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
