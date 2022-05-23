<template>
  <div class="single-table">
    <div class="input-table">
      <div class="select-column">
        <p>列数</p>
        <CustomInputSelect
          v-model="component.columnNum"
          :options="selectColumnNum"
          @input="changeTableColumnLine()"
        />
      </div>
      <div class="select-line">
        <p>行数</p>
        <CustomInputSelect
          v-model="component.lineNum"
          :options="selectRowNum"
          @input="changeTableColumnLine()"
        />
      </div>
    </div>
    <div class="input-heading">
      <p>見出し</p>
      <CustomInputRadio
        v-model="component.heading"
        :options="headingOptions"
        name="selectHeading"
      />
    </div>
    <div class="custom-table-area">
      <template v-if="component.heading === '1'">
        <table>
          <tbody>
            <tr v-for="(tr, index1) in component.tableData" :key="index1">
              <td v-for="(td, index2) in tr" :key="index2">
                <input
                  v-model="component.tableData[index1][index2]"
                  type="text"
                  maxlength="30"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="component.heading === '2'">
        <table>
          <thead>
            <tr>
              <th v-for="(th, index) in component.tableData[0]" :key="index">
                <input
                  v-model="component.tableData[0][index]"
                  type="text"
                  maxlength="30"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(tr, index1) in component.tableData">
              <tr v-if="index1 > 0" :key="index1">
                <td v-for="(td, index2) in tr" :key="index2">
                  <input
                    v-model="component.tableData[index1][index2]"
                    type="text"
                    maxlength="30"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
      <template v-if="component.heading === '3'">
        <table>
          <tbody>
            <tr v-for="(tr, index1) in component.tableData" :key="index1">
              <template v-for="(data, index2) in tr">
                <th v-if="index2 === 0" :key="index2">
                  <input
                    v-model="component.tableData[index1][index2]"
                    type="text"
                    maxlength="30"
                  />
                </th>
                <td v-else :key="index2">
                  <input
                    v-model="component.tableData[index1][index2]"
                    type="text"
                    maxlength="30"
                  />
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
    <div class="input-text">
      <p>キャプション</p>
      <CustomInputText
        v-model="component.text"
        placeholder="表組の説明を入力してください"
        maxlength="100"
        :validation="$common.getFormItemsDetail(formItems, 'text').validation"
        @input="checkValidation()"
      />
    </div>
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SingleTable',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      selectColumnNum: [],
      selectRowNum: [],
      headingOptions: [
        {
          value: '1',
          label: '見出し無し',
        },
        {
          value: '2',
          label: '上見出し',
        },
        {
          value: '3',
          label: '左見出し',
        },
      ],
      tableData: [],
      formItems: [
        {
          id: 'text',
          validation: [
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
  computed: {},
  created() {
    this.setSelectColumnNum()
    this.setSelectRowNum()
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    /**
     * 列数の設定
     */
    setSelectColumnNum() {
      const maxColumn = 10

      for (let i = 0; i < maxColumn; i++) {
        this.selectColumnNum.push({
          code: String(i + 1),
          label: String(i + 1),
        })
      }
    },
    /**
     * 行数の設定
     */
    setSelectRowNum() {
      const maxRow = 50

      for (let i = 0; i < maxRow; i++) {
        this.selectRowNum.push({
          code: String(i + 1),
          label: String(i + 1),
        })
      }
    },
    /**
     * 列変更処理
     */
    changeTableColumnLine() {
      const newTableData = []

      for (let i = 0; i < Number(this.component.lineNum); i++) {
        newTableData[i] = []
        for (let j = 0; j < Number(this.component.columnNum); j++) {
          if (this.component.tableData[i]) {
            newTableData[i][j] = this.component.tableData[i][j] || ''
          } else {
            newTableData[i][j] = ''
          }
        }
      }

      this.component.tableData = newTableData
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false

      if (
        this.$common.checkExistValidation(
          this.formItems,
          'text',
          this.component.text
        )
      ) {
        result = true
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
.single-table {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 10px;
    }
  }
  .input-table {
    display: flex;
    .select-column,
    .select-line {
      width: 100px;
    }
    .select-column {
      margin-right: 20px;
    }
  }
  .space-settings {
    margin-top: 32px;
  }
  .custom-table-area {
    height: 403px;
    max-height: 403px;
    border: 1px solid;
    overflow: auto;
  }
  .custom-table-area {
    table {
      width: 100%;
      th,
      td {
        border: 1px solid #e5e5e5;
        &:nth-of-child(10) {
          border-bottom: none;
        }
        height: 40px;
        input {
          border: none;
          height: 38px;
          border-radius: 0px;
          padding: 0 10px;
        }
      }
      th {
        input {
          background: #f7f8f9;
        }
      }
      td {
        input {
          background: #ffffff;
        }
      }
    }
  }
}
</style>
