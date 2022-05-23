<template>
  <div class="import-contact">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">新規コンタクト登録</h2>
        <p class="header-sub">新しい担当者情報を登録します。</p>
      </div>
      <div class="contents">
        <div class="form-block">
          <div class="form-item">
            <h4 class="flex">
              登録方法<TooltipHelp
                label="複数件を一括登録する場合はcsvインポートがおすすめです"
                class="tooltip"
              />
            </h4>
            <CustomInputRadio
              v-model="registMethod"
              class="form-item"
              name="registMethod"
              layout-type="vertical"
              :options="registMethodOptions"
              :validation="
                $common.getFormItemsDetail(formItems, 'registMethod').validation
              "
              @input="linkOtherPage()"
            />
          </div>
        </div>
        <div class="csv-import-form">
          <h5>1.コンタクトデータをインポートしてください。</h5>
          <div v-if="contactFileData === ''" class="file-upload-form">
            <FileUpload
              ref="fileUpload"
              :file-data="contactFileData"
              file-type="csv"
              :validation="
                $common.getFormItemsDetail(formItems, 'contactFileData')
                  .validation
              "
              read-type="text"
              :max-size="2024"
              @uploaded="setContactFileData($event)"
              @deleted="deleteContactFileData()"
            />
            <a class="download-link" @click="downloadSampleCsv()">
              <DownloadSVG class="icon-download" /><span
                >登録用のCSVフォーマットはこちら</span
              >
            </a>
          </div>
          <div v-else class="edit-csv-form">
            <div class="read-csv-num flex">
              <CheckCircleSVG class="icon-checkCircle" />
              <p>
                {{ contactFileDataList.length - 1 }}
                件のデータが読み込まれました。
              </p>
            </div>
            <div class="edit-csv-form-table">
              <h5>
                2.インポートしたデータのうちbizskyDXへ登録するコンタクトデータと紐づけ先をを選択してください。<br />メールアドレスがないコンタクトは登録されません。
              </h5>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th class="itemName">インポートデータ項目</th>
                      <th class="linkDestination">
                        コンタクトデータとの紐づけ先
                      </th>
                      <th class="ignoreSpace">空白データを無視</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(contact, index) in mappingList" :key="index">
                      <td class="itemName">
                        {{ contact.csvHeader }}
                      </td>
                      <td class="linkDestination">
                        <div class="flex">
                          <CustomInputSelect
                            v-model="contact.selectFstData"
                            placeholder="選択してください"
                            :options="selectData"
                            class="select"
                          />
                          <CustomInputSelect
                            v-show="contact.selectFstData === '1'"
                            v-model="contact.dataItemDefinitionId"
                            placeholder="選択してください"
                            :options="basicSelect"
                            class="select"
                          />
                          <CustomInputSelect
                            v-show="contact.selectFstData === '2'"
                            v-model="contact.dataItemDefinitionId"
                            placeholder="選択してください"
                            :options="selectData"
                            class="select"
                          />
                        </div>
                      </td>
                      <td class="ignoreSpace">
                        <div class="flex flex-center">
                          <template v-if="contact.selectFstData !== '3'">
                            <CustomInputSingleCheckbox
                              v-model="contact.ignoredBlankFlag"
                              name="ignoredBlankFlag"
                            />
                          </template>
                          <template v-else>選択不可</template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="btn btn-cancel btn-long" @click="linkToList()">
          キャンセル
        </button>
        <button
          class="btn btn-basic btn-long"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateContactDetailCsv()"
        >
          新規コンタクトを登録
        </button>
      </div>
    </div>
    <ImportResultModal
      v-if="showImportResultModal"
      :error-data="errorData"
      :type="showImportResultModalType"
      @close="closeImportResultModal()"
      @link="linkToList()"
    />
    <CommonFooter />
  </div>
</template>

<script>
export default {
  layout: 'mainLayout',
  components: {},
  data() {
    return {
      showImportResultModal: false,
      showImportResultModalType: '',
      mappingList: [],
      errorData: '',
      selectData: [
        {
          code: '1',
          label: '基本情報',
        },
        {
          code: '2',
          label: '追加情報',
        },
        {
          code: '3',
          label: '登録しない',
        },
      ],
      basicSelect: [
        {
          code: '1',
          label: '営業担当者​',
        },
        {
          code: '2',
          label: '企業名',
        },
        {
          code: '3',
          label: '部署名​',
        },
        {
          code: '4',
          label: '役職名​',
        },
        {
          code: '5',
          label: '氏',
        },
        {
          code: '6',
          label: '名',
        },
        {
          code: '7',
          label: '氏（フリガナ）​',
        },
        {
          code: '8',
          label: '名（フリガナ）​',
        },
        {
          code: '9',
          label: 'メールアドレス',
        },
        {
          code: '10',
          label: '電話番号1​',
        },
        {
          code: '11',
          label: '電話番号2​',
        },
        {
          code: '12',
          label: '郵便番号​',
        },
        {
          code: '13',
          label: '都道府県（コードではなく文字列）​',
        },
        {
          code: '14',
          label: '市区町村​',
        },
        {
          code: '15',
          label: '住所​',
        },
        {
          code: '16',
          label: 'ビル名など​',
        },
        {
          code: '17',
          label: 'タグ​',
        },
      ],
      contactDetail: {},
      registMethod: '2',
      contactFileData: '',
      contactFile: undefined,
      importContactList: [],
      registMethodOptions: [
        {
          value: '1',
          label: '手動入力',
        },
        {
          value: '2',
          label: 'CSVインポート',
        },
      ],
      formItems: [
        {
          id: 'registMethod',
          validation: [],
        },
        {
          id: 'contactFileData',
          validation: [],
        },
      ],
    }
  },
  computed: {
    checkBtnDisabled() {
      return () => {
        let result = false
        if (this.contactFileData.length === 0) {
          result = true
        }

        return result
      }
    },
    contactFileDataList() {
      const result = []
      const tmp = this.contactFileData.split('\n')

      for (let i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',')
      }

      return result
    },
  },
  watch: {
    contactFileDataList() {
      this.mappingList = this.contactFileDataList[0].map((item) => {
        const data = {
          dataItemDefinitionId: 0,
          selectFstData: '',
          selectSecData: '',
          csvHeader: item.replace(/"/g, ''),
          ignoredBlankFlag: true,
        }
        return data
      })
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 登録用のCSVダウンロード
     */
    downloadSampleCsv() {
      const csvData =
        '"企業名【必須】","部署名","役職名","氏【必須】","名【必須】","氏（フリガナ）","名（フリガナ）","メールアドレス【必須】","電話番号1","電話番号2","郵便番号","都道府県（コードではなく文字列）","市区町村","住所","ビル名など","タグ","追加情報（設定による追加）","メール配信許諾"'
      this.$common.csvFileDownload(csvData, `HIRAMEKI7_contact_import.csv`)
    },
    /**
     * コンタクト一覧へ遷移
     */
    linkToList() {
      this.$router.push('/contact/list/')
    },
    /**
     * 登録方法が手動入力が選択された場合、手動入力ページへ遷移
     */
    linkOtherPage() {
      if (this.registMethod === '1') {
        this.$router.push('/contact/create/manual/')
      }
    },
    /**
     * コンタクトCSVインポート
     */
    updateContactDetailCsv() {
      const paramData = this.getUpdateContactDetailCsvParamData()

      this.$common.addCallApiNum()
      this.$api
        .updateContactDetailCsv(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            if (
              !resData.data.validationErrorList &&
              !resData.data.errorCsvData
            ) {
              // CSVインポート成功
              this.showImportResultModal = true
              this.showImportResultModalType = 'success'
            } else if (resData.data.validationErrorList) {
              // CSVファイル内のバリデーションエラー
              this.showImportResultModal = true
              this.showImportResultModalType = 'errorCsv'
              this.errorData = resData.data.validationErrorList.join('<br />')
            } else {
              // コンタクト数上限超過インポート不可データ
              this.showImportResultModal = true
              this.showImportResultModalType = 'limitCsv'
              this.errorData = resData.data.errorCsvData
            }
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
            this.$router.push('/contact/list/')
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * コンタクト詳細情報更新 リスエストパラメータの作成
     *
     * @returns {Object} コンタクト詳細情報更新リクエストパラメータ
     */
    getUpdateContactDetailCsvParamData() {
      const paramData = new FormData()
      const result = JSON.stringify(this.mappingList)

      delete result.selectFstData
      delete result.selectSecData

      paramData.append('csvFile', this.contactFile)
      paramData.append('mappingList', result)

      return paramData
    },
    /**
     * コンタクトファイルデータの設定
     *
     * @param {Object} dataObj ファイルデータ
     */
    setContactFileData(dataObj) {
      this.contactFileData = dataObj.fileData
      this.contactFile = dataObj.file
    },
    /**
     * コンタクトファイルデータの削除
     */
    deleteContactFileData() {
      this.contactFileData = ''
    },
    /**
     * CSVインポートエラーモーダルを閉じる
     */
    closeImportResultModal() {
      this.showImportResultModal = false
    },
  },
  head() {
    return {
      title: '新規コンタクト情報登録｜コンタクト',
    }
  },
}
</script>

<style lang="scss" scoped>
.main-contents {
  .header {
    padding-bottom: 32px;
    border-bottom: 1px solid #e5e5e5;
    &-sub {
      margin-top: 8px;
    }
  }
  .contents {
    .form-block {
      padding: 32px 0;
      .form-item {
        margin-top: 32px;
        .input-form {
          margin-top: 12px;
        }
      }
    }
    ::v-deep .contact-detail-form {
      border-top: 1px solid #e5e5e5;
    }
    .download-link {
      display: flex;
      align-items: center;
      margin-top: 12px;
      .icon-download {
        width: 18px;
        height: 18px;
        fill: #007aff;
      }
      span {
        margin-left: 10px;
        color: #007aff;
      }
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
h5 {
  margin-bottom: 24px;
}
.read-csv-num {
  margin-bottom: 48px;
  padding: 20px;
  background: #f0fff4;
}
.edit-csv-form-table {
  table {
    width: auto;
  }
}
.csv-import-form {
  padding: 12px 0 48px 0;
  border-bottom: 1px solid #e5e5e5;
  ::v-deep .file-upload {
    margin-top: 12px;
  }
  .itemName {
    width: 153px;
    min-width: 153px;
  }
  .linkDestination {
    width: 568px;
    min-width: 568px;
    .select {
      width: 240px;
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
  .ignoreSpace {
    width: 217px;
    min-width: 217px;
  }
}
.icon-checkCircle {
  width: 20px;
  height: 20px;
  fill: #34c759;
  margin-right: 10px;
}
</style>
