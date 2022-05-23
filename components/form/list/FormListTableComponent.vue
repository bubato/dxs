<template>
  <div class="form-list-table-component">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="title">
              <span>フォームタイトル</span>
              <SortSpinner
                sort-id="title"
                :current-type="formSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="status">
              <span>ステータス</span>
              <SortSpinner
                sort-id="status"
                :current-type="formSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="release-date">
              <span>公開日時</span>
              <SortSpinner
                sort-id="release_at"
                :current-type="formSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="answer-num">
              <span>回答数</span>
              <SortSpinner
                sort-id="answer_number"
                :current-type="formSelectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="facility-effect">レポート</th>
            <th class="settings"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(form, index) in formList" :key="index">
            <td class="title">
              <div class="flex flex-between">
                <p>{{ form.title }}</p>
                <PageviewSVG
                  class="icon icon-pageview"
                  @click="showFormPreview(form.formId)"
                  @mouseover="
                    $common.setAreaLabel(
                      $event,
                      'top',
                      'フォームのプレビュー画面を表示します。'
                    )
                  "
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                />
              </div>
            </td>
            <td class="status" :data-index="index">
              <div v-if="form.status === '1'" class="flex flex-between">
                <p class="flex status-edit">
                  <RemoveCircleSVG class="icon icon-checkCircle" /><span
                    >編集中</span
                  >
                </p>
              </div>
              <div v-if="form.status === '2'" class="flex flex-between">
                <p class="flex status-publication-reserve">
                  <WatchLaterSVG class="icon icon-checkCircle" /><span
                    >受付開始前</span
                  >
                </p>
                <button
                  class="btn btn-secondary btn-short"
                  @click="setSelectFormStatus(index, 'status')"
                >
                  変更
                </button>
              </div>
              <div v-if="form.status === '3'" class="flex flex-between">
                <p class="flex status-publication-now">
                  <CheckCircleSVG class="icon icon-watchLater" /><span
                    >受付中</span
                  >
                </p>
                <button
                  class="btn btn-secondary btn-short"
                  @click="setSelectFormStatus(index, 'status')"
                >
                  変更
                </button>
              </div>
              <div v-if="form.status === '4'" class="flex flex-between">
                <p class="flex status-publication-end">
                  <CheckCircleSVG class="icon icon-removeCircle" /><span
                    >受付終了</span
                  >
                </p>
                <button
                  class="btn btn-secondary btn-short"
                  @click="setSelectFormStatus(index, 'status')"
                >
                  変更
                </button>
              </div>
              <ChangeFormStatusDialog
                v-if="
                  selectFormType.index === index &&
                  selectFormType.type === 'status' &&
                  Object.keys(selectFormInfo).length > 0
                "
                v-on-clickaway="resetSelectForm"
                @update="$emit('update')"
                @close="resetSelectForm()"
              />
            </td>
            <td class="release-date">
              {{ form.releaseDate }}
            </td>
            <td class="answer-num">
              {{ $common.commaSeparate(form.answerNumber) }}
            </td>
            <td class="facility-effect">
              <div class="flex flex-center">
                <button
                  v-if="form.answerViewFlag"
                  class="btn btn-secondary btn-middle-short"
                  @click="showContactWebAnswerComponent(form.formId)"
                >
                  レポートを見る
                </button>
              </div>
            </td>
            <td class="settings">
              <SettingsSVG
                class="icon icon-setting"
                @click="setSelectFormStatus(index, 'settings')"
                @mouseover="$common.setAreaLabel($event, 'left', 'メニュー')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              />
              <FormListMenuDialog
                v-if="
                  selectFormType.index === index &&
                  selectFormType.type === 'settings' &&
                  Object.keys(selectFormInfo).length > 0
                "
                v-on-clickaway="resetSelectForm"
                @update="$emit('update')"
                @close="resetSelectForm()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <FormTagModal v-if="showFormTagModalFlg" @close="hideFormTagModal()" />
    <DeleteFormModal
      v-if="showDeleteFormModalFlg"
      @delete="deleteForm()"
      @close="hideDeleteFormModal()"
    />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FormListTableComponent',
  mixins: [clickaway],
  data() {
    return {
      selectFormType: {
        index: -1,
        type: '',
      },
      selectMenuDialogIndex: null,
    }
  },
  computed: {
    ...mapState('form/formList', [
      'formList',
      'selectFormInfo',
      'showFormTagModalFlg',
      'showDeleteFormModalFlg',
      'formSelectSortType',
    ]),
  },
  methods: {
    ...mapMutations('form/formList', [
      'setFormListScreen',
      'setSelectFormInfo',
      'setFormList',
      'hideFormTagModal',
      'hideDeleteFormModal',
      'setFormSelectSortType',
    ]),
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setFormSelectSortType(newSelectSortType)
      this.$emit('update')
    },
    setSelectFormStatus(index, type) {
      if (index === this.selectFormIndex) {
        this.resetSelectForm()
      } else {
        this.setSelectFormInfo(this.formList[index])
        this.selectFormType = {
          index,
          type,
        }
      }
    },
    resetSelectForm() {
      this.selectFormType = {
        index: -1,
        type: '',
      }
    },
    showContactWebAnswerComponent(formId) {
      this.$router.push('/form/answer/' + formId)
    },
    /**
     * フォームプレビューページに遷移
     */
    showFormPreview(formId) {
      window.open('/form/preview/' + formId, '_blank')
    },
    /**
     * 選択したフォームを削除する
     */
    deleteForm() {
      const paramData = {
        formId: this.selectFormInfo.formId,
        recordVersion: this.selectFormInfo.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteFormData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$common.showCompletePopAlert('ActionMsg_Gen03', 'フォーム')
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
.form-list-table-component {
  margin-top: 30px;
  .table-scroll {
    margin-top: 17px;
    table {
      tbody {
        tr {
          height: 48px;
        }
      }
      tr {
        th,
        td {
          &.title {
            width: auto;
          }
          &.status {
            width: 180px;
            min-width: 180px;
          }
          &.release-date {
            width: 143px;
            min-width: 143px;
          }
          &.answer-num {
            width: 83px;
            min-width: 83px;
          }
          &.facility-effect {
            width: 138px;
            min-width: 138px;
          }
          &.settings {
            width: 40px;
            min-width: 40px;
            padding: 0;
            text-align: center;
          }
        }
        td {
          &.title {
            p {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .icon {
              margin-right: 12px;
              fill: #3a435c;
              cursor: pointer;
            }
          }
          &.status {
            p {
              display: flex;
              align-items: center;
              &.status-publication-now {
                .icon {
                  fill: #34c759;
                }
                color: #34c759;
              }
              &.status-publication-end,
              &.status-publication-reserve,
              &.status-edit {
                .icon {
                  fill: #b0b3be;
                }
              }
              .icon {
                width: 20px;
                height: 20px;
                margin-right: 4px;
              }
            }
            button {
              margin-right: 12px;
            }
          }
          &.answer-num {
            text-align: right;
            padding-right: 12px;
          }
          &.facility-effect {
            text-align: center;
            padding: 0;
            button {
              .icon {
                width: 16px;
                height: 16px;
                margin-left: 4px;
                fill: #4f7df0;
              }
            }
          }
          &.settings {
            .icon {
              cursor: pointer;
            }
          }
        }
      }

      &.show-scrollBar {
        td {
          &:nth-of-type(7) {
            width: 63px;
            min-width: 63px;
          }
        }
      }
    }
  }
}
</style>
