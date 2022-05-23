<template>
  <div class="settings">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">基本設定</h2>
        <p>コンタクト情報に追加登録するデータを定義します。</p>
      </div>
      <div class="contents">
        <h3 class="contents-title flex">データ項目定義</h3>
        <p class="contents-text">
          登録するデータファイルの項目定義を行います。追加情報は最大50まで追加が可能です。<br />タイトルが空白の場合は、インポートされたデータファイル内にデータ項目が存在しても無視されます。
        </p>
        <SettingsDataListTable
          ref="settingDataListTable"
          @delete="showDeleteModal()"
          @maxCount="showNotCreateMoreInformationModal()"
        />
      </div>
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': checkCancelBtnDisabled,
          }"
          @click="deleteEditData()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled }"
          @click="saveDataItemDefinitions()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <CommonFooter />
    <SettingsDataListDeleteModal
      v-if="isShowDeleteModal"
      @close="closeDeleteModal()"
      @delete="deleteDataItemDefinitions()"
    />
    <NotCreateMoreInformationModal
      v-if="isShowNotCreateMoreInformationModal"
      @close="closeNotCreateMoreInformationModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      isShowDeleteModal: false,
      isShowNotCreateMoreInformationModal: false,
      dataError: false,
    }
  },
  computed: {
    ...mapState('contact/contactList', [
      'dataItemDefinitionList',
      'deleteSelectId',
      'settingCreateDataList',
    ]),
    checkCancelBtnDisabled() {
      // debugger
      // if (this.$refs.settingDataListTable) {
      if (this.settingCreateDataList.length > 0) {
        return false
      }
      // }
      return true
    },
    checkBtnDisabled() {
      let result = false

      if (this.settingCreateDataList.length === 0) {
        return true
      }

      this.settingCreateDataList.forEach((item) => {
        if (item.title === '') {
          result = true
        }
      })
      return result
    },
  },
  created() {},
  mounted() {
    this.getDataItemDefinitions()
  },
  methods: {
    ...mapMutations('contact/contactList', [
      'setDataItemDefinitionList',
      'setSettingCreateDataList',
    ]),
    /**
     * 編集データの破棄
     */
    deleteEditData() {
      this.setSettingCreateDataList([])
    },
    /**
     * データ項目定義の取得
     */
    getDataItemDefinitions() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getDataItemDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setDataItemDefinitionList(resData.data.dataItemDefinitionList)
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
     * データ項目定義変更（保存）
     */
    saveDataItemDefinitions() {
      const paramData = this.getPutDataItemDefinitionsParam()

      this.$common.addCallApiNum()
      this.$api
        .saveDataItemDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
            this.$refs.settingDataListTable.initData()
            this.getDataItemDefinitions()
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
     * データ項目定義変更（保存）APIのリクエストパラメータの取得
     *
     * @returns {Array} データ項目定義変更APIのリクエストパラメータ
     */
    getPutDataItemDefinitionsParam() {
      const paramData = {}
      let result = JSON.parse(JSON.stringify(this.dataItemDefinitionList))
      const newDataList = this.settingCreateDataList.filter((item) => {
        let result = false

        if (item.title !== '' && item.dataItemExplanation !== '') {
          result = true
        }

        return result
      })

      result = result.map((item) => {
        delete item.formTitleList
        return item
      })

      paramData.dataItemDefinitionList = result.concat(newDataList)
      return paramData
    },
    /**
     * データ項目リストからデータを削除
     */
    deleteDataItemDefinitionList() {
      const result = this.dataItemDefinitionList.filter((item) => {
        if (item.dataItemDefinitionId !== this.deleteSelectId) {
          return item
        }
      })

      this.setDataItemDefinitionList(result)
    },
    /**
     * データ項目定義の削除
     */
    deleteDataItemDefinitions() {
      const paramData = this.getDeleteDataItemDefinitionsParam()

      this.$common.addCallApiNum()
      this.$api
        .deleteDataItemDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_Gen03', '項目')
            this.closeDeleteModal()
            this.deleteDataItemDefinitionList()
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
     * データ項目定義削除APIのリクエストパラメータの取得
     *
     * @returns {Array} データ項目定義削除APIのリクエストパラメータ
     */
    getDeleteDataItemDefinitionsParam() {
      const result = {
        dataItemDefinitionId: this.deleteSelectId,
        recordVersion: this.dataItemDefinitionList.find(
          (data) => data.dataItemDefinitionId === this.deleteSelectId
        ).recordVersion,
      }

      return result
    },
    /**
     * 追加情報登録最大数警告モーダル表示
     *
     */
    showNotCreateMoreInformationModal() {
      this.isShowNotCreateMoreInformationModal = true
    },
    /**
     * 追加情報登録最大数警告モーダルを閉じる
     *
     */
    closeNotCreateMoreInformationModal() {
      this.isShowNotCreateMoreInformationModal = false
    },
    /**
     * 削除モーダルを閉じる
     *
     */
    closeDeleteModal() {
      this.isShowDeleteModal = false
    },
    /**
     * 削除確認モーダルの表示
     */
    showDeleteModal() {
      this.isShowDeleteModal = true
    },
  },
  head() {
    return {
      title: '基本設定｜コンタクト',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    padding-bottom: 32px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e5e5e5;
    &-title {
      margin-bottom: 8px;
    }
  }
  .contents {
    &-title {
      margin-bottom: 8px;
    }
    &-text {
      margin-bottom: 23px;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    button {
      &:not(:last-child) {
        fill: #3a435c;
        margin-right: 16px;
      }
    }
  }
}
</style>
