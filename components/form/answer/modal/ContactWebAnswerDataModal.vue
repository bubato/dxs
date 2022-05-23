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
            <h3>回答データ</h3>
          </div>
          <div class="modal_contents">
            <table class="answer-data-table">
              <tr>
                <th>登録日時</th>
                <td>{{ selectAnswerData.registeredDate }}</td>
              </tr>
              <tr>
                <th>お客様のテナントID</th>
                <td>{{ selectAnswerData.memberId }}</td>
              </tr>
              <tr
                v-for="(data, index) in selectAnswerData.answerData"
                :key="index"
              >
                <td>
                  {{ answerDataInfo.answerHeaderList[index].answerHeaderValue }}
                </td>
                <td>
                  {{ data.answerDataDispValue }}
                </td>
              </tr>
            </table>
          </div>
          <div class="buttons">
            <button
              class="btn btn-long btn-secondary"
              @click="showDeleteWebAnswerDataModal()"
            >
              削除
            </button>
            <button
              class="btn btn-long btn-cancel"
              @click="closeModal($event, 'close')"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ContactWebAnswerDataModal',
  components: {},
  props: {
    selectAnswerData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('form/contactWebAnswerData', ['answerDataInfo']),
  },
  created() {},
  methods: {
    ...mapMutations('form/contactWebAnswerData', [
      'showDeleteWebAnswerDataModal',
    ]),
    /**
     * パーツデータのダウンロード ph1では不使用
     */
    downloadAnswerReportFile(selectParts) {
      const paramData = {
        formId: this.$route.params.formId,
        answerId: this.selectAnswerData.answerId,
        formPartsId: selectParts.answerDataKey,
      }

      this.$common.addCallApiNum()
      this.$api
        .downloadAnswerReportFile(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.maxDataNum = resData.data.searchResult
            this.setFilterStatusOptions(resData.data.statusList)
            this.setAnswerDataInfo(resData.data)
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
  },
}
</script>

<style scoped lang="scss">
.modal-container {
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    max-height: 600px;
    overflow: auto;
    margin-top: 24px;
    table.answer-data-table {
      width: 100%;
      th,
      td {
        height: 54px;
        padding-left: 16px;
        border: 1px solid #e5e5e5;
        text-align: left;
      }
      th {
        width: 212px;
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
</style>
