<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container variable">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4>申し込み内容の確認</h4>
          </div>
          <div class="modal_contents">
            <FormNav
              :nav-list="navList"
              :select-index="1"
              class="form-nav-component"
            />
            <p class="annotation-text">
              まだ申し込みは完了していません。<br />
              入力いただいた内容を確認のうえ申し込むボタンをクリックしてください。
            </p>
            <table>
              <tr v-if="uuid === ''">
                <th>ACELINK NX-Proをご利用中の 会計事務所様ですか？</th>
                <td>{{ formData.firmKind === '1' ? 'はい' : 'いいえ' }}</td>
              </tr>
              <tr>
                <th>連携企業名</th>
                <td>{{ formData.companyName }}</td>
              </tr>
              <tr>
                <th>企業名フリガナ</th>
                <td>{{ formData.companyNameKana }}</td>
              </tr>
              <tr>
                <th>法人番号</th>
                <td>{{ formData.corporateNumber }}</td>
              </tr>
              <tr></tr>
              <tr>
                <th>業種</th>
                <td>
                  {{
                    industryCodeOptions.find(
                      (data) => data.code === formData.industryCode
                    ).label
                  }}
                </td>
              </tr>
              <tr>
                <th>氏名</th>
                <td>{{ formData.lastName }}{{ formData.firstName }}</td>
              </tr>
              <tr>
                <th>氏名フリガナ</th>
                <td>{{ formData.lastNameKana }}{{ formData.firstNameKana }}</td>
              </tr>
              <tr>
                <th>メールアドレス</th>
                <td>{{ formData.email }}</td>
              </tr>
              <tr>
                <th>電話番号</th>
                <td>{{ formData.tel }}</td>
              </tr>
              <tr>
                <th>パスワード</th>
                <td>
                  <p>***************</p>
                  <p>（セキュリティ保護のため非表示にしています）</p>
                </td>
              </tr>
              <tr>
                <th>利用規約</th>
                <td>
                  <div
                    v-for="id in teamsSetting.requireConsentIdList"
                    :key="id"
                  >
                    {{ getTeamsData(id, 'name') }}に同意する<br />
                  </div>
                </td>
              </tr>
            </table>
            <div class="buttons">
              <button
                class="btn btn-basic btn-long"
                @click="registUsageApplicationForm()"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ConfirmInputApplicationForUseModal',
  props: {
    navList: {
      type: Array,
      default: () => [],
      required: true,
    },
    formData: {
      type: Object,
      default: () => {},
      required: true,
    },
    uuid: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      partsData: {},
      agentCode: 'tribeck',
    }
  },
  computed: {
    ...mapState('request/input', [
      'industryCodeOptions',
      'teamsVersionIDList',
      'teamsSetting',
      'teamsData',
    ]),
  },
  created() {},
  methods: {
    /**
     * TeamsDataの取得
     *
     * @param {Number} id 利用規約ID
     * @param {String} keyName キー名
     * @return {String} 利用規約データ
     */
    getTeamsData(id, keyName) {
      const data = this.teamsData.find((item) => item.id === id)

      return data[keyName]
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
    /**
     * 利用申し込み内容登録APIの実行
     */
    registUsageApplicationForm() {
      const paramData = this.getRegistUsageApplicationFormParam()

      this.$common.addCallApiNum()
      this.$api
        .registUsageApplicationForm(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('close')
            this.$router.push('/request/complete/')
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
     * 利用申し込み内容登録APIのリクエストパラメータの取得
     */
    getRegistUsageApplicationFormParam() {
      const paramData = this.formData

      if (this.uuid !== '') {
        paramData.uuid = this.uuid
      }

      paramData.termsOfServiceVersionId = Object.values(
        this.teamsVersionIDList
      ).filter((data) => {
        if (data !== '') {
          return Number(data)
        }
      })

      paramData.agentCode = this.agentCode
      delete paramData.termsOfService

      return paramData
    },
  },
}
</script>

<style scoped lang="scss">
.modal-wrapper {
  display: flex;
  justify-content: center;
}
.modal-container {
  width: 684px;
  height: 688px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 20px;
    overflow: auto;
    height: 580px;
    .annotation-text {
      margin-top: 32px;
      text-align: center;
    }
    table {
      width: 100%;
      margin-top: 24px;
      tr {
        th,
        td {
          height: 74px;
          border: 1px solid #e5e5e5;
          padding-left: 16px;
          text-align: left;
        }
        th {
          width: 170px;
          background: #f4f4f4;
        }
      }
    }
    .buttons {
      margin-top: 32px;
      padding-bottom: 40px;
    }
  }
}
</style>
