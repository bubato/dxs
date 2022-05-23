<template>
  <div class="contact-web-answer-data-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="registered-date">登録日時</th>
            <!-- ph1対象外
            <th class="customer-id">顧客ID</th>
            -->
            <th
              v-for="answerHeader in answerDataInfo.answerHeaderList"
              :key="answerHeader.answerHeaderKey"
              class="parts-data"
            >
              {{ answerHeader.answerHeaderValue }}
            </th>
            <th
              v-for="status in answerDataInfo.statusList"
              :key="status.statusName"
              class="answer-status"
            >
              {{ status.statusName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(answerData, index) in answerDataInfo.answerDataList"
            :key="index"
            @click="showContactWebAnswerDataModal(answerData, $event.target)"
          >
            <td class="registered-date">
              {{ answerData.registeredDate }}
            </td>
            <!-- ph1対象外
            <td class="customer-id">
              {{ answerData.memberId }}
            </td>
            -->
            <td
              v-for="data in answerData.answerData"
              :key="data.answerDataKey"
              class="parts-data"
            >
              {{ data.answerDataDispValue }}
            </td>
            <td
              v-for="(data, index2) in answerData.status"
              :key="index2"
              class="answer-status"
            >
              <CustomInputSingleCheckbox
                :value="data.statusFlag"
                :name="data.statusName"
                class="check"
                @input="
                  updateCheckStatus(
                    $event,
                    index,
                    index2,
                    answerData.recordVersion
                  )
                "
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ContactWebAnswerDataModal
      v-if="showDetailModalFlg"
      :select-answer-data="selectAnswerData"
      @close="showDetailModalFlg = false"
    />
    <DeleteWebAnswerDataModal
      v-if="showDeleteWebAnswerDataModalFlg"
      @delete="deleteAnswerData()"
      @close="hideDeleteWebAnswerDataModal()"
    />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ContactWebAnswerDataTable',
  mixins: [clickaway],
  data() {
    return {
      showDetailModalFlg: false,
      selectAnswerData: {},
    }
  },
  computed: {
    ...mapState('form/contactWebAnswerData', [
      'answerDataInfo',
      'showDeleteWebAnswerDataModalFlg',
    ]),
  },
  created() {},
  methods: {
    ...mapMutations('form/contactWebAnswerData', [
      'hideDeleteWebAnswerDataModal',
    ]),
    showContactWebAnswerDataModal(answerData, targetEle) {
      if (!targetEle.closest('.answer-status')) {
        this.selectAnswerData = answerData
        this.showDetailModalFlg = true
      }
    },
    updateCheckStatus(val, index1, index2, recordVersion) {
      const answerDataInfo = JSON.parse(JSON.stringify(this.answerDataInfo))
      const paramData = {
        formId: this.$route.params.formId,
        answerId: answerDataInfo.answerDataList[index1].answerId,
        status: answerDataInfo.answerDataList[index1].status,
        recordVersion,
      }

      paramData.status[index2].statusFlag = val

      this.$common.addCallApiNum()
      this.$api
        .updateContactWebAnswerDataList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
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
     * 回答データを削除
     */
    deleteAnswerData() {
      const paramData = {
        id: this.$route.params.formId,
        answerId: this.selectAnswerData.answerId,
        recordVersion: this.selectAnswerData.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteAnswerData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$common.showCompletePopAlert('ActionMsg_Gen03', 'フォーム')
            this.showDetailModalFlg = false
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

<style lang="scss" scoped>
.contact-web-answer-data-table {
  margin-top: 30px;
  .table-scroll {
    margin-top: 17px;
    table {
      tr {
        cursor: pointer;
        th,
        td {
          &.registered-date {
            width: 150px;
            min-width: 150px;
          }
          &.customer-id {
            width: 80px;
            min-width: 80px;
          }
          &.parts-data {
            width: 250px;
            min-width: 250px;
          }
          &.answer-status {
            width: 80px;
            min-width: 80px;
            padding-left: 0;
            text-align: center;
          }
        }
        td {
          &.answer-status {
            .check {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>
