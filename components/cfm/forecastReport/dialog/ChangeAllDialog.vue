<template>
  <div class="dialog">
    <h3 class="title">{{ itemTitle }}</h3>
    <p class="text-caption">設定した値で予測結果をまとめて変更します。</p>
    <div v-if="itemTitle === '売上原価'" class="flex flex-center">
      <CustomInputRadio
        v-model="costOptionResult"
        :options="costOptions"
        name="predictionResultRadio2"
        layout-type="vertical"
      />
      <div class="input-list">
        <div v-for="(cost, index) in costOptions" :key="index">
          <div class="flex">
            <CustomInputText
              v-model="costOptionValue[index]"
              :maxlength="costOptions[index].maxlength"
              :is-disabled="costOptionResult !== cost.value"
              :placeholder="costOptions[index].placeholder"
              :validation="
                $common.getFormItemsDetail(formItems, costOptions[index].key)
                  .validation
              "
            />
            <div class="text-unit">
              <p v-if="index === 0">%</p>
              <p v-else>円</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-center">
      <CustomInputRadio
        v-model="predictionResult"
        :options="predictionResultOptions"
        name="predictionResultRadio"
        layout-type="vertical"
      />
      <div class="input-list">
        <div
          v-for="(prediction, index) in predictionResultOptions"
          :key="index"
        >
          <div class="flex">
            <CustomInputText
              v-model="predictionResultValue[index]"
              :maxlength="predictionResultOptions[index].maxlength"
              :is-disabled="predictionResult !== prediction.value"
              :placeholder="predictionResultOptions[index].placeholder"
              :validation="
                $common.getFormItemsDetail(
                  formItems,
                  predictionResultOptions[index].key
                ).validation
              "
            />
            <div class="text-unit">
              <p v-if="index === 2">円</p>
              <p v-else>%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-center btn-decision">
      <button class="btn btn-cancel btn-long" @click="closeDialog()">
        キャンセル
      </button>
      <button
        class="btn btn-basic btn-long"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="onChangeAllRecalculation()"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {
  name: 'ChangeAllDialog',
  mixins: [clickaway],
  props: {
    // まとめて変更する項目名
    itemTitle: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      predictionResultValue: [],
      predictionResult: '1',
      predictionResultOptions: [
        {
          value: '1',
          key: 'yearOnYear',
          label: '前年同月比',
          maxlength: 5,
          placeholder: '',
        },
        {
          value: '2',
          key: 'yearOnYearAverage',
          label: '前年平均比',
          maxlength: 5,
          placeholder: '',
        },
        {
          value: '3',
          key: 'monthly',
          label: '毎月',
          maxlength: 15,
          placeholder: '',
        },
      ],
      costOptionValue: [],
      costOptionResult: '1',
      costOptions: [
        {
          value: '1',
          key: 'costRate',
          label: '原価率',
          maxlength: 5,
          placeholder: '',
        },
        {
          value: '2',
          key: 'monthly',
          label: '毎月',
          maxlength: 15,
          placeholder: '',
        },
      ],
      formItems: [
        {
          id: 'yearOnYear',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_CFM02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cfmSimulation,
              message: this.$common.getMasterMessage('ErrorMsg_CFM01'),
            },
          ],
        },
        {
          id: 'yearOnYearAverage',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_CFM02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cfmSimulation,
              message: this.$common.getMasterMessage('ErrorMsg_CFM01'),
            },
          ],
        },
        {
          id: 'monthly',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_CFM02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cfmSimulation,
              message: this.$common.getMasterMessage('ErrorMsg_CFM01'),
            },
          ],
        },
        {
          id: 'costRate',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_CFM02'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cfmSimulation,
              message: this.$common.getMasterMessage('ErrorMsg_CFM01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * OKボタンの活性・非活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false
        let value = null
        let validationItems = []
        let key = ''

        if (this.itemTitle === '売上原価') {
          if (this.costOptionResult === '1') {
            value = this.costOptionValue[0]
            key = 'costRate'
          } else if (this.costOptionResult === '2') {
            value = this.costOptionValue[1]
            key = 'monthly'
          }
        } else if (this.itemTitle !== '売上原価') {
          if (this.predictionResult === '1') {
            value = this.predictionResultValue[0]
            key = 'yearOnYear'
          } else if (this.predictionResult === '2') {
            value = this.predictionResultValue[1]
            key = 'yearOnYearAverage'
          } else if (this.predictionResult === '3') {
            value = this.predictionResultValue[2]
            key = 'monthly'
          }
        }

        validationItems = this.$common.getFormItemsDetail(this.formItems, key)
          .validation

        result =
          this.$common.getValidationMsg(validationItems, value).length > 0

        return result
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * ダイアログを非表示
     */
    closeDialog() {
      this.$emit('close')
    },
    /**
     * まとめて再計算
     */
    onChangeAllRecalculation() {
      let conditionValue = null

      // 原価計算以外
      if (this.itemTitle !== '売上原価') {
        switch (this.predictionResult) {
          // 前年同月比
          case '1':
            conditionValue = this.predictionResultValue[0]
            break
          // 前年平均比
          case '2':
            conditionValue = this.predictionResultValue[1]
            break
          // 毎月
          case '3':
            conditionValue = this.predictionResultValue[2]
            break
          default:
            break
        }
      }
      // 原価計算
      else {
        switch (this.costOptionResult) {
          // 原価率
          case '1':
            conditionValue = this.costOptionValue[0]
            break
          // 毎月
          case '2':
            conditionValue = this.costOptionValue[1]
            break
          default:
            break
        }
      }

      this.$emit('changeAllRecalculation', {
        itemName: this.itemTitle !== '売上原価' ? 'other' : 'cost',
        conditionValue,
        type:
          this.itemTitle !== '売上原価'
            ? this.predictionResult
            : this.costOptionResult,
      })

      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.dialog {
  position: absolute;
  top: 32px;
  left: 0;
  background: #ffffff;
  box-shadow: 0px 1px 5px hsla(0, 0%, 0%, 0.161);
  border-radius: 6px;
  padding: 24px 16px;
  color: #1e1e1e;
  z-index: 9999;
}

.title {
  text-align: center;
  margin-bottom: 8px;
}

.btn-decision {
  margin: 24px 0 0 0;
  * {
    &:first-of-type {
      margin: 0 16px 0 0;
    }
  }
}

.text {
  &-caption {
    margin: 0 0 20px 0;
    text-align: center;
  }
  &-unit {
    margin: 0 0 20px 10px;
  }
}

.custom-input-radio /deep/ {
  .radio_list label {
    height: 48px;
    margin: 0 20px 20px 0 !important;
  }
}

.custom-input-text /deep/ {
  input[type='text'] {
    &.is-disabled {
      background-color: #cdced0;
    }
    margin: 0 0 20px 0;
  }
}
</style>
