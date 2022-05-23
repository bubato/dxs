<template>
  <div class="mail-settings">
    <div class="left-contents">
      <div class="form-block">
        <div class="form-item">
          <RequiredFormLabel class="title" label="配信条件" :required="true" />
          <CustomInputRadio
            v-model="mailSettings.conditionKind"
            name="conditionKind"
            :options="conditionKindOptions"
            @input="changeConditionKind($event)"
          />
        </div>
        <div v-if="mailSettings.conditionKind === '0'" class="form-item">
          <p class="context">一度に10件まで条件を登録できます。</p>
          <div class="form-contents">
            <ul class="conditionContents">
              <li
                v-for="(
                  data, index
                ) in mailSettings.contactInformationConditionContents"
                :key="index"
              >
                <CustomInputSelect
                  v-model="data.contentId"
                  class="contentName"
                  :options="getContactInformationOptions()"
                  @change="getMailContactCount()"
                />
                <template v-if="data.contentId">
                  <CustomInputSelect
                    v-if="data.contentId === '111'"
                    v-model="data.contentValue"
                    class="contentValue"
                    :options="getAccountListOptions()"
                  />
                  <CustomInputText
                    v-else
                    v-model="data.contentValue"
                    class="contentValue"
                    maxlength="200"
                    @blur="getMailContactCount()"
                  />
                  <CustomInputSelect
                    v-model="data.contentSearchType"
                    class="contentSearchType"
                    :options="getContentSearchTypeOptions(data.contentId)"
                    @change="getMailContactCount()"
                  />
                </template>
                <CancelSVG
                  v-if="index !== 0"
                  class="icon-delete"
                  @click="deleteCondition(index)"
                />
              </li>
            </ul>
            <div
              v-show="
                mailSettings.contactInformationConditionContents.length < 10
              "
              class="add-condition"
              @click="addInputCondition()"
            >
              <AddCircleSVG class="icon icon-addCircle" /><span>追加</span>
            </div>
          </div>
        </div>
        <div v-else-if="mailSettings.conditionKind === '1'" class="form-item">
          <p class="context">選択可能なタグ一覧（10件まで選択できます）</p>
          <SuggestTextarea
            ref="tagSuggest"
            class="suggestTextarea tags"
            :select-ids="getContentIds(mailSettings.conditionKind)"
            placeholder="タグを入力してください。"
            :suggest-type="4"
            :max-ids="10"
            @update="updateContentIds($event, '1')"
          />
        </div>
        <div v-else-if="mailSettings.conditionKind === '2'" class="form-item">
          <p class="context">選択可能なタグ一覧（10件まで選択できます）</p>
          <SuggestTextarea
            ref="targetSuggest"
            class="suggestTextarea targetList"
            :select-ids="getContentIds(mailSettings.conditionKind)"
            placeholder="タグを入力してください。"
            :suggest-type="5"
            :max-ids="10"
            @update="updateContentIds($event, '2')"
          />
        </div>
      </div>
      <SendErrorContext v-if="mailStatus === '4'" />
      <div v-else class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': !checkChangeInputData(),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          class="btn btn-long btn-cancel"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateEditMailSettings('save')"
        >
          宛先設定を保存
        </button>
        <button
          class="btn btn-long btn-basic"
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          @click="updateEditMailSettings('next')"
        >
          宛先設定を保存してメール設定へ進む
        </button>
      </div>
    </div>
    <div class="right-contents">
      <div class="contact-num-info">
        <h4>設定した条件に合致する<br />配信コンタクト数</h4>
        <ProgressCircleBar
          v-if="sendCount.ableCount && sendCount.totalCount"
          :progress="(sendCount.ableCount / sendCount.totalCount) * 100"
          class="progressCircle"
        />
        <h5>
          配信可能数：{{ sendCount.ableCount }}/{{ sendCount.totalCount }}
        </h5>
        <p v-show="!sendCount.sendCountCheckFlag" class="error">
          配信数が上限を超えています。
        </p>
        <div class="buttons">
          <button
            class="btn btn-secondary btn-long"
            @click="downloadContactList()"
          >
            配信リストをダウンロード
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditMailContentsSettingsComponent',
  components: {},
  props: {
    propMailSettings: {
      type: Object,
      default: () => {},
      required: true,
    },
    accountList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      mailSettings: {},
      conditionKindOptions: [
        {
          value: '0',
          label: 'コンタクト情報',
        },
        {
          value: '1',
          label: 'タグ',
        },
        {
          value: '2',
          label: 'ターゲットリスト',
        },
      ],
      sendCount: {
        totalCount: 0,
        ableCount: 0,
        sendCountCheckFlag: true,
      },
      contentSearchTypeOptions: [
        {
          code: '0',
          label: '等しい',
        },
        {
          code: '1',
          label: '等しくない',
        },
        {
          code: '2',
          label: '含む',
        },
        {
          code: '3',
          label: '含まない',
        },
        {
          code: '4',
          label: '先頭が一致する',
        },
        {
          code: '5',
          label: '先頭が一致しない',
        },
        {
          code: '6',
          label: 'データが存在する',
        },
        {
          code: '7',
          label: 'データが存在しない',
        },
      ],
      formItems: [],
    }
  },
  computed: {
    ...mapState('mail/editMailSettings', [
      'contactsDistributionMaster',
      'mailStatus',
    ]),
    /**
     * ボタンの非活性処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        for (const key in this.mailSettings) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              this.mailSettings[key]
            )
          ) {
            result = true
            break
          }
        }

        return result
      }
    },
    /**
     * コンタクト情報のオプションリストの取得
     *
     * @return {Object[]} コンタクト情報のオプションリスト
     */
    getContactInformationOptions() {
      return () => {
        let contactInformation = []

        if (Object.keys(this.contactsDistributionMaster).length > 0) {
          contactInformation = this.contactsDistributionMaster.contactInformation.map(
            (data) => {
              const option = {}

              option.code = data.dataId
              option.label = data.dataName

              return option
            }
          )
        }

        // 営業担当者の追加
        contactInformation.unshift({
          code: '111',
          label: '営業担当者',
        })

        return contactInformation
      }
    },
    /**
     * アカウント一覧の取得
     *
     * @return {Object[]} アカウント一覧
     */
    getAccountListOptions() {
      return () => {
        const accountListOptions = this.accountList.map((data) => {
          const option = {}

          option.code = data.tenantUserId
          option.label = data.name

          return option
        })

        return accountListOptions
      }
    },
    /**
     * 設定内容IDリストの取得
     *
     * @param {string} conditionKind 配信条件種別
     * @return {Object[]} 設定内容IDリストの取得
     */
    getContentIds() {
      return (conditionKind) => {
        let contentIds = []

        if (conditionKind === '1') {
          contentIds = this.mailSettings.tagInformationConditionContents.map(
            (data) => {
              return data.contentId
            }
          )
        } else if (conditionKind === '2') {
          contentIds = this.mailSettings.targetInformationConditionContents.map(
            (data) => {
              return data.contentId
            }
          )
        }

        return contentIds
      }
    },
    /**
     * 条件タイプのオプションの取得
     *
     * @param {string} contentId コンテンツID
     * @return {Object[]} 条件タイプのオプション
     */
    getContentSearchTypeOptions() {
      return (contentId) => {
        let contentSearchTypeOptions = this.contentSearchTypeOptions

        if (contentId === '111') {
          contentSearchTypeOptions = contentSearchTypeOptions.filter((data) => {
            return ['2', '3'].includes(data.code)
          })
        }

        return contentSearchTypeOptions
      }
    },
  },
  watch: {
    propMailSettings() {
      this.initFunc() // 初期値設定処理
    },
  },
  created() {
    this.initFunc() // 初期値設定処理
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    /**
     * 初期値設定処理
     */
    initFunc() {
      this.mailSettings = this.getMailSettings() // 画面の入力情報の取得
      this.changeConditionKind(this.mailSettings.conditionKind) // 配信条件種別変更処理
      this.getMailContactCount() // コンタクト数の取得
    },
    /**
     * 画面の入力情報の取得
     *
     * @return {Object} 画面の入力情報
     */
    getMailSettings() {
      const mailSettings = JSON.parse(JSON.stringify(this.propMailSettings))

      mailSettings.contactInformationConditionContents = [
        {
          contentId: '',
          contentName: '',
          contentValue: '',
          contentSearchType: '',
        },
      ]
      mailSettings.tagInformationConditionContents = []
      mailSettings.targetInformationConditionContents = []

      if (mailSettings.conditionKind === '0') {
        mailSettings.contactInformationConditionContents =
          mailSettings.conditionContents
      } else if (mailSettings.conditionKind === '1') {
        mailSettings.tagInformationConditionContents =
          mailSettings.conditionContents
      } else if (mailSettings.conditionKind === '2') {
        mailSettings.targetInformationConditionContents =
          mailSettings.conditionContents
      }

      return mailSettings
    },
    /**
     * 保存してリクエストデータを親に送る
     *
     * @param {string} afterFunc 保存後の処理
     */
    updateEditMailSettings(afterFunc) {
      const data = {
        requestParam: {
          sendCondition: this.getRequestMailSettings(),
        },
        afterFunc,
      }

      this.$emit('update', data)
    },
    /**
     * 画面に表示されている項目のみリクエストパラメータとして返却
     *
     * @return {Object} リクエストパラメータ
     */
    getRequestMailSettings() {
      const requestMailSettings = JSON.parse(JSON.stringify(this.mailSettings))

      delete requestMailSettings.contactInformationConditionContents
      delete requestMailSettings.tagInformationConditionContents
      delete requestMailSettings.targetInformationConditionContents

      return requestMailSettings
    },
    /**
     * オブジェクト一致チェック(親画面から呼び出される関数)
     *
     * @return {boolean} 入力内容に変更があった場合は、true それ以外はfalseを返す
     */
    checkChangeInputData() {
      let result = false
      const mailSettings = JSON.parse(JSON.stringify(this.mailSettings))

      delete mailSettings.contactInformationConditionContents
      delete mailSettings.tagInformationConditionContents
      delete mailSettings.targetInformationConditionContents

      if (!this.$common.checkSameObject(this.propMailSettings, mailSettings)) {
        result = true
      }

      return result
    },
    /**
     * 配信条件設定内容の入力ブロックの追加
     */
    addInputCondition() {
      this.mailSettings.contactInformationConditionContents.push({
        contentId: '',
        contentName: '',
        contentValue: '',
        contentSearchType: '',
      })
    },
    /**
     * 選択した配信条件設定内容の入力ブロックの削除
     *
     * @param {number} index 削除対象のインデックス
     */
    deleteCondition(index) {
      this.mailSettings.contactInformationConditionContents.splice(index, 1)
    },
    /**
     * 設定内容IDの更新
     *
     * @param {number[]} ids 選択IDリスト
     * @param {string} conditionKind 配信条件種別
     */
    updateContentIds(ids, conditionKind) {
      if (conditionKind === '1') {
        this.mailSettings.tagInformationConditionContents = ids.map((id) => {
          return {
            contentId: id,
          }
        })

        if (
          !this.$common.checkSameObject(
            this.mailSettings.conditionContents,
            this.mailSettings.tagInformationConditionContents
          )
        ) {
          this.mailSettings.conditionContents = this.mailSettings.tagInformationConditionContents
          this.getMailContactCount() // コンタクト数の取得
        }
      } else if (conditionKind === '2') {
        this.mailSettings.targetInformationConditionContents = ids.map((id) => {
          return {
            contentId: id,
          }
        })

        if (
          !this.$common.checkSameObject(
            this.mailSettings.conditionContents,
            this.mailSettings.targetInformationConditionContents
          )
        ) {
          this.mailSettings.conditionContents = this.mailSettings.targetInformationConditionContents
          this.getMailContactCount() // コンタクト数の取得
        }
      }
    },
    /**
     * コンタクト数の取得
     */
    getMailContactCount() {
      const paramData = {
        sendCondition: this.getRequestMailSettings(),
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailContactCount(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.sendCount.totalCount = resData.data.sendCount.totalCount
            this.sendCount.ableCount = resData.data.sendCount.ableCount
            this.sendCount.sendCountCheckFlag = resData.data.sendCountCheckFlag
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
     * 配信条件種別変更処理
     *
     * @param {string} conditionKind 配信条件種別
     */
    changeConditionKind(conditionKind) {
      if (conditionKind === '0') {
        this.getMailContactCount() // コンタクト数の取得
      } else if (conditionKind === '1') {
        this.$nextTick(() => {
          this.$refs.tagSuggest.initSelectId()
        })
      } else if (conditionKind === '2') {
        this.$nextTick(() => {
          this.$refs.targetSuggest.initSelectId()
        })
      }
    },
    /**
     * 配信リストのダウンロード
     */
    downloadContactList() {
      const paramData = this.getMailContactsCsvParam() // 配信リストCSV取得のリクエストパラメータの取得

      this.$common.addCallApiNum()
      this.$api
        .getMailContactsCsv(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const nowDate = this.$common.getFormatCurrentDate('YYYYMMDDhhmmss')

            this.$common.csvFileDownload(
              resData.data.csvData,
              `contact_general_${nowDate}.csv`
            )
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
     * 配信リストCSV取得のリクエストパラメータの取得
     */
    getMailContactsCsvParam() {
      const paramData = {}

      paramData.sendCondition = {}
      paramData.sendCondition.conditionKind = this.mailSettings.conditionKind

      switch (this.mailSettings.conditionKind) {
        case '0':
          paramData.sendCondition.conditionContents = this.mailSettings.contactInformationConditionContents
          break
        case '1':
          paramData.sendCondition.conditionContents = this.mailSettings.tagInformationConditionContents
          break
        case '2':
          paramData.sendCondition.conditionContents = this.mailSettings.targetInformationConditionContents
          break
        default:
          break
      }

      return paramData
    },
    /**
     * 親画面から呼び出される関数 入力内容を元に戻す
     */
    restoreSettings() {
      this.initFunc() // 初期値設定処理
    },
  },
}
</script>

<style lang="scss" scoped>
.mail-settings {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .left-contents {
    .form-block {
      .title {
        margin-bottom: 32px;
        .form-title {
          font-size: 22px;
          font-weight: 500;
        }
        .sub-text {
          font-size: 13px;
          margin-top: 8px;
        }
      }
      .contents {
        margin-bottom: 32px;
      }
      .form-item {
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .title {
          margin-bottom: 10px;
        }
        .context {
          font-size: 13px;
        }
        .conditionContents {
          margin-top: 12px;
          li {
            display: flex;
            align-items: center;
            &:not(:first-child) {
              margin-top: 12px;
            }
            .contentName {
              width: 216px;
            }
            .contentValue {
              width: 156px;
              margin-left: 16px;
            }
            .contentSearchType {
              width: 216px;
              margin-left: 16px;
            }
            .icon-delete {
              margin-left: 18px;
            }
          }
        }
        .suggestTextarea {
          width: 677px;
          margin-top: 12px;
          &.tags {
            ::v-deep .CodeMirror {
              height: 280px;
            }
          }
          &.targetList {
            ::v-deep .CodeMirror {
              height: 120px;
            }
          }
        }
        .add-condition {
          margin-top: 12px;
          cursor: pointer;
          .icon {
            width: 20px;
            height: 20px;
          }
          span {
            margin-left: 10px;
          }
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 48px;
      padding-top: 40px;
      border-top: 1px solid #e5e5e5;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
  .right-contents {
    margin-left: 40px;
    .contact-num-info {
      padding: 32px 50px;
      box-shadow: 0px 1px 5px #00000029;
      border-radius: 6px;
      .progressCircle {
        margin: 24px auto 0 auto;
        width: 200px;
        height: 200px;
      }
      h5 {
        margin-top: 16px;
        text-align: center;
      }
      .error {
        margin-top: 8px;
        color: #e60012;
        text-align: center;
      }
      .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 16px;
      }
    }
  }
}
</style>
