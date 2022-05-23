<template>
  <div class="tableWrap">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="mailTitle">
              メールタイトル
              <SortSpinner
                sort-id="mailTitle"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="mailType">
              メールタイプ
              <SortSpinner
                sort-id="mailType"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="mailStatus">
              ステータス<SortSpinner
                sort-id="mailStatus"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="sendDate">
              配信日時<SortSpinner
                sort-id="sendDate"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="sendResult">
              配信数<SortSpinner
                sort-id="sendResult"
                :current-type="selectSortType"
                @spinner-click="updateSortTable($event)"
              />
            </th>
            <th class="report">配信レポート</th>
            <th class="setting"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(data, index) in mailList">
            <tr
              :key="data.mailId"
              :class="getMailStatusValue(data.mailStatus, 'class')"
            >
              <td class="mailTitle">
                {{ data.mailTitle }}
                <PageviewSVG
                  @click="showMailPreview(data.mailId)"
                  @mouseover="
                    $common.setAreaLabel(
                      $event,
                      'top',
                      'メールのプレビュー画面を表示'
                    )
                  "
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                />
              </td>
              <td class="mailType">{{ mailType[data.mailType] }}</td>
              <td class="mailStatus">
                <RemoveCircleSVG
                  v-if="data.mailStatus === '0'"
                  class="icon-removeCircle"
                />
                <WatchLaterSVG
                  v-if="data.mailStatus === '1'"
                  class="icon-watchLater"
                />
                <CheckCircleSVG
                  v-if="data.mailStatus === '3'"
                  class="icon-checkCircle"
                />
                <ErrorSVG v-if="data.mailStatus === '4'" class="icon-error" />
                {{ getMailStatusValue(data.mailStatus, 'label')
                }}<nuxt-link
                  v-show="data.mailStatus === '4'"
                  :to="'mail/edit/' + data.mailId"
                  >再配信</nuxt-link
                >
              </td>
              <td class="sendDate">{{ data.sendDate }}</td>
              <td class="sendResult">{{ data.sendResult.toLocaleString() }}</td>
              <td class="report">
                <nuxt-link
                  v-show="
                    data.mailStatus !== '4' &&
                    data.sendResult !== 0 &&
                    data.mailType === '1'
                  "
                  :to="'mail/report/' + data.mailId"
                  >レポートを見る</nuxt-link
                >
              </td>
              <td class="setting">
                <SettingsSVG
                  class="icon-settings"
                  @mouseover="$common.setAreaLabel($event, 'top', 'メニュー')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @click="setSelectStatus(index)"
                />
                <ListMailDialog
                  v-if="
                    selectType.index === index &&
                    Object.keys(selectMailList).length > 0
                  "
                  v-on-clickaway="closeDialog"
                  @updateMailListData="updateMailListData()"
                  @closeDialog="closeDialog()"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <ListMailDeleteModal
      v-if="mailDeleteModalFlg"
      @updateMailListData="updateMailListData()"
      @close="hideMailDeleteModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'MailTable',
  mixins: [clickaway],
  props: {
    mailList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      selectType: {
        index: -1,
        type: 'settings',
      },
    }
  },
  computed: {
    ...mapState('mail/mailList', [
      'selectMailList',
      'selectSortType',
      'mailType',
      'mailStatus',
      'mailDeleteModalFlg',
    ]),
  },
  created() {},
  methods: {
    ...mapMutations('mail/mailList', [
      'setSelectMailList',
      'setSelectSortType',
      'hideMailDeleteModal',
    ]),
    /**
     * mailプレビューページを開く
     *
     * @param {number} mailId メールID
     */
    showMailPreview(mailId) {
      window.open('mail/preview/' + mailId, '_blank')
    },
    /**
     * mailStatus class分岐
     *
     * @param {string} mailStatus メールステータス
     * @param {string} kinds 取得データ種別
     * @return {string} 設定値
     */
    getMailStatusValue(mailStatus, kinds) {
      for (const i in this.mailStatus) {
        if (this.mailStatus[i].value === mailStatus) {
          return this.mailStatus[i][kinds]
        }
      }
    },
    /**
     * メール一覧取得
     */
    updateMailListData() {
      this.$emit('updateMailListData')
    },
    /**
     * ソート処理
     *
     * @param {Object} sortData sort:ソート対象項目 order:昇順降順
     */
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setSelectSortType(newSelectSortType)
      this.$emit('sortChange')
    },
    /**
     * ダイアログアイコン押下によるメニュー表示
     *
     * @param {Number} index ダイアログ表示順
     */
    setSelectStatus(index) {
      if (index === this.selectType.index) {
        this.closeDialog()
      } else {
        this.setSelectMailList(this.mailList[index])
        this.selectType = {
          index,
        }
      }
    },
    /**
     * ダイアログを閉じる
     */
    closeDialog() {
      this.selectType = {
        index: -1,
        type: '',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tableWrap {
  margin-top: 17px;
}
.report {
  a {
    color: #4f7df0;
    padding: 9px 12px;
    border: 1px solid #4f7df0;
    border-radius: 4px;
  }
}
.mailTitle {
  min-width: 295px;
}
.mailType {
  min-width: 130px;
}
.mailStatus {
  min-width: 200px;
}
.sendDate {
  min-width: 142px;
}
.sendResult {
  min-width: 84px;
}
.report {
  min-width: 138px;
}
.setting {
  min-width: 40px;
}
tr {
  &.editing {
    .mailStatus {
      color: #1e1e1e;
      .icon-removeCircle {
        fill: #b0b3be;
      }
    }
  }
  &.reserve {
    .mailStatus {
      color: #1e1e1e;
      .icon-watchLater {
        fill: #b0b3be;
      }
    }
  }
  &.delivered {
    .mailStatus {
      color: #34c759;
      .icon-checkCircle {
        fill: #34c759;
      }
    }
  }
  &.error {
    .mailStatus {
      color: #e60012;
      .icon-error {
        fill: #e60012;
      }
    }
  }
}
td {
  &.mailTitle {
    position: relative;
    padding-right: 60px;
    svg {
      position: absolute;
      right: 14px;
    }
  }
  &.mailStatus {
    a {
      color: #4f7df0;
      padding: 9px 12px;
      border: 1px solid #4f7df0;
      border-radius: 4px;
      margin-left: 12px;
    }
  }
  &.report,
  &.setting {
    padding: 0;
    text-align: center;
  }
}
</style>
