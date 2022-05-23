<template>
  <div class="tag">
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">共通タグ</h2>
        <p class="header-sub">分析用の共通タグを表示します。</p>
      </div>
      <div class="contents">
        <div class="form-block">
          <h3>タグ</h3>
          <p>
            表示されているコードをコピーし、&lt; body&gt;&lt;
            /body&gt;内に埋め込んで使用してください。<br />タグを設置するサイトでCSPの設定をしている場合は事前に
            CSPの設定をしてください。
          </p>
          <div class="form-item tag">
            <CustomInputText v-model="accountTag.tag" :is-disabled="true" />
            <button
              class="btn btn-middle btn-secondary"
              @click="copyClipBoard()"
            >
              コードをコピー
            </button>
          </div>
        </div>
        <div class="form-block">
          <h3>アクセス除外IPアドレス</h3>
          <p>
            設定したIPアドレスからのログは集計対象から除外されます。尚、過去に遡って集計対象から除外することはできません。<br />複数のIPアドレスを設定する場合は改行してIPアドレスを入力してください。
          </p>
          <div class="form-item">
            <RequiredFormLabel
              class="title"
              label="IPアドレス"
              :required="false"
            />
            <CustomInputTextarea
              v-model="accountTag.exclusionIpAddress"
              class="textarea"
              placeholder="IPアドレスを入力してください"
              maxlength="500"
              :validation="
                $common.getFormItemsDetail(formItems, 'exclusionIpAddress')
                  .validation
              "
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button
          class="btn btn-cancel btn-long"
          :class="{
            'btn-disabled': $common.checkSameObject(
              defaultAccountTag,
              accountTag
            ),
          }"
          @click="showCancelEditModal()"
        >
          キャンセルして元に戻す
        </button>
        <button
          :class="{ 'btn-disabled': checkBtnDisabled() }"
          class="btn btn-basic btn-long"
          @click="updateAccountTag()"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <CommonFooter />
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="hideCancelEditModal()"
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
      defaultAccountTag: {},
      accountTag: {
        tag: '',
        exclusionIpAddress: '',
      },
      formItems: [
        {
          id: 'exclusionIpAddress',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.ipAddressFormat,
              message: this.$common.getMasterMessage('ErrorMsg_Ip02'),
            },
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['showCancelEditModalFlg']),

    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.$common.checkExistValidation(
            this.formItems,
            'exclusionIpAddress',
            this.accountTag.exclusionIpAddress
          )
        ) {
          result = true
        }

        return result
      }
    },
  },
  created() {
    this.getAccountTag() // タグ情報の取得
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['showCancelEditModal', 'hideCancelEditModal']),
    /**
     * タグ情報の取得
     */
    getAccountTag() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getAccountTag(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const accountTag = this.setNullInitData(resData.data.data)

            this.defaultAccountTag = JSON.parse(JSON.stringify(accountTag))
            this.accountTag = accountTag
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
     * nullが返ってきたデータの初期値設定
     *
     * @param {object} accountTag 対象のオブジェクト
     * @return {object} 修正後のオブジェクト
     */
    setNullInitData(accountTag) {
      this.$common.setNullConvertStringValue(accountTag, [])

      return accountTag
    },
    /**
     * キャンセルして設定を元に戻すボタン押下処理
     */
    restoreSettings() {
      this.accountTag = JSON.parse(JSON.stringify(this.defaultAccountTag))
      this.$common.showCompletePopAlert('ActionMsg_Gen02')
    },
    /**
     * 設定内容を保存ボタン押下処理
     */
    updateAccountTag() {
      const paramData = {
        data: {
          exclusionIpAddress: this.accountTag.exclusionIpAddress,
          recordVersion: this.accountTag.recordVersion,
        },
      }

      this.$common.addCallApiNum()
      this.$api
        .updateAccountTag(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getAccountTag()
            this.$common.showCompletePopAlert('ActionMsg_Gen01')
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
     * クリップボードにコピー
     */
    copyClipBoard() {
      this.$common.copyClipBoard(this.accountTag.tag)
      this.$common.showCompletePopAlert('ActionMsg_Gen08')
    },
  },
  head() {
    return {
      title: '共通タグ｜アカウント｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.tag {
  .main-contents {
    .header {
      &-sub {
        margin-top: 8px;
      }
    }
    .contents {
      margin-top: 32px;
      .form-block {
        padding: 32px 0 40px 0;
        border-bottom: 1px solid #e5e5e5;
        p {
          margin-top: 8px;
        }
        &:not(:last-child) {
          border-top: 1px solid #e5e5e5;
        }
        .form-item {
          margin-top: 32px;
          &.tag {
            margin-top: 24px;
            .btn {
              margin-top: 12px;
            }
          }
          .title {
            margin-bottom: 10px;
          }
          .textarea {
            ::v-deep .custom-input-textarea-block {
              height: 128px;
            }
          }
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
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
