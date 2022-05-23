<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h3>シミュレーション結果を保存する</h3>
          </div>
          <div class="modal_contents">
            <div class="modal_contents-box">
              <p class="title-sub">シミュレーション結果名</p>
              <CustomInputText
                v-model="simulationName"
                :validation="validationSimulationName"
                placeholder=""
              />
              <div class="flex flex-center btn-decision">
                <button
                  class="btn btn-cancel btn-long"
                  @click="closeModal($event, 'close')"
                >
                  キャンセル
                </button>
                <button
                  class="btn btn-basic btn-long"
                  :class="{
                    'btn-disabled': simulationName.length === 0,
                  }"
                  @click="saveSimulation()"
                >
                  結果を保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import cfmCommonMixin from '~/mixin/cfm/cfmCommon.js'

export default {
  name: 'SaveSimulationResultsModal',
  components: {},
  mixins: [cfmCommonMixin],
  props: {},
  data() {
    return {
      simulationName: '',
      validationSimulationName: [
        {
          type: 'maxlength',
          maxlength: 20,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 20,
          }),
        },
      ],
    }
  },
  computed: {
    ...mapState('cfm/common', ['corporateType', 'companyMasterDataList']),
    ...mapState('cfm/cashFlowReportStore', [
      'cashFlowAlertList',
      'cashFlowReportList',
      'simulationSaveComment',
      'cashflowSimulationData',
      'advisorVal',
    ]),
  },
  watch: {},
  created() {},
  methods: {
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
     * シミュレーション結果を保存
     */
    saveSimulation() {
      const params = this.getSaveSimulationParam() // シミュレーション結果保存APIのリクエストパラメータの取得

      this.$common.addCallApiNum()
      this.$api
        .saveSimulation(params)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$common.showCompletePopAlert('ActionMsg_CFM01')
            this.$emit('close')
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
     * シミュレーション結果保存APIのリクエストパラメータの取得
     */
    getSaveSimulationParam() {
      const paramData = {}

      paramData.linkageId = this.companyMasterDataList[0].linkageId

      if (this.corporateType === '20') {
        paramData.advisorLinkageId = this.advisorVal
      }

      paramData.simulationResultName = this.simulationName
      paramData.simulationResultJson = {}
      paramData.simulationResultJson.alerts = this.cashFlowAlertList
      paramData.simulationResultJson.datalist = this.getSimulationDataList()
      paramData.simulationResultJson.comment = this.cashflowSimulationData.comment

      return paramData
    },
    /**
     * シミュレーションデータの取得
     */
    getSimulationDataList() {
      const simulationDataList = JSON.parse(
        JSON.stringify(this.cashFlowReportList)
      )
      const keys = [
        'sales',
        'cost',
        'personnelExpenses',
        'rents',
        'sgAndA',
        'operatingIncome',
        'depreciationCost',
        'depreciationSgAndA',
        'tradeReceivable',
        'inventories',
        'accountsPayable',
        'operatingCashFlow',
        'tradeReceivableTurnoverPeriod',
        'accountsPayableTurnoverPeriod',
        'inventoriesTurnoverPeriod',
        'cashAndDeposits',
      ]

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < keys.length; j++) {
          simulationDataList[this.cashFlowReportList.length - (6 - i)][
            keys[j]
          ] = this.cashflowSimulationData.tableData[keys[j]][i].value
        }
      }

      return simulationDataList
    },
  },
}
</script>

<style scoped lang="scss">
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  width: 688px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
  }
  .modal_contents {
    .input_form {
      > div {
        p {
          padding: 5px 0;
        }
      }
      .input_load_sentence {
        margin-top: 10px;
      }
      .set_show_buttons {
        margin-top: 10px;
        .show_button_list {
          max-height: 120px;
          overflow: auto;
          .select_show_button {
            position: relative;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
            .btn-delete_select {
              position: absolute;
              top: 0;
              bottom: 0;
              right: 20px;
              margin: auto;
              cursor: pointer;
            }
          }
        }
        .add_item_component {
          margin-top: 10px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
    }
  }
}

.title {
  &-sub {
    margin: 24px 0 12px 0;
    font-weight: 500;
  }
}

.btn-decision {
  margin: 24px 0 0 0;
  * {
    &:first-of-type {
      margin: 0 16px 0 0;
    }
  }
}
</style>
