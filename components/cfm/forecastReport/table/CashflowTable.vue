<template>
  <div class="cashflow-table">
    <div class="flex flex-baseline">
      <div v-if="checkSimulationType === 1" class="edit-mode-selection">
        <button
          :class="{ active: mode === 'view' }"
          @click="changeMode('view')"
        >
          表示
        </button>
        <button
          :class="[
            { active: mode === 'edit' },
            { 'is-disabled': checkAlertStatus === 9 },
          ]"
          @click="changeMode('edit')"
        >
          編集モード
        </button>
      </div>
      <button
        v-show="mode === 'edit'"
        class="btn btn-basic btn-long btn-manual-simulation-top"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="transitionSimulationResult()"
      >
        <IconCalculate />
        <span>編集内容をグラフで表示する</span>
      </button>
    </div>
    <div
      v-show="mode === 'edit' || checkSimulationType === 3"
      class="simulation-comment"
    >
      <p>コメント</p>
      <CustomInputTextarea
        v-model="simulationComment"
        :placeholder="simulationCommentPlaceholder"
        :is-disabled="checkSimulationType === 3"
        :validation="simulationCommentValidation"
      />
    </div>
    <div class="table-scroll">
      <table>
        <thead>
          <!-- 集計期間 -->
          <tr>
            <th></th>
            <th v-for="period in cashFlowReportTableHeader" :key="period">
              {{ period }}
            </th>
          </tr>
          <!-- /集計期間 -->
        </thead>
        <tbody>
          <!-- 売上高 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('売上高') }"
          >
            <td class="value-master-header">
              <div class="flex">
                <span>売上高</span>
                <ErrorSVG class="icon-error" />
                <div class="dialog-container">
                  <button
                    v-show="mode === 'edit'"
                    class="btn-change-all"
                    @click="setChangeAllDialogProps($event, 'sales', '売上高')"
                  >
                    まとめて変更
                  </button>
                  <ChangeAllDialog
                    v-if="mode === 'edit' && showEditDialogKey === 'sales'"
                    v-on-clickaway="closeDialog"
                    :item-title="changeAllDialogItemTitle"
                    @changeAllRecalculation="changeAllDateValue($event)"
                    @close="closeDialog()"
                  />
                </div>
              </div>
            </td>
            <td
              v-for="(data, index) in tableDataObj.sales"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="sales"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'sales').validation
                "
                @change="
                  onReCalculationRatio(data.date, 'sales', 'compareSales')
                "
              />
            </td>
          </tr>
          <!-- 売上高 -->
          <!-- 売上高-前年同月比 -->
          <tr class="value-master compare">
            <td class="value-master-header">前年同月比</td>
            <td
              v-for="(data, index) in tableDataObj.compareSales"
              :key="index"
              class="value-master-data ratio"
            >
              <template v-if="mode === 'view'">
                <span :class="getValueClass(data.value, false)">{{
                  getNumCommaSeparated(data.value, '%')
                }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="compareSales"
                  v-model="data.value"
                  type="text"
                  maxlength="5"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'compareSales')
                      .validation
                  "
                  @change="
                    onReCalculationValue(data.date, 'compareSales', 'sales')
                  "
                />
                <span>%</span>
              </template>
            </td>
          </tr>
          <!-- 売上高-前年同月比 -->
          <!-- 売上原価 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('売上原価') }"
          >
            <td class="value-master-header">
              <div class="flex">
                <span>売上原価</span>
                <ErrorSVG class="icon-error" />
                <div class="dialog-container">
                  <button
                    v-show="mode === 'edit'"
                    class="btn-change-all"
                    @click="setChangeAllDialogProps($event, 'cost', '売上原価')"
                  >
                    まとめて変更
                  </button>
                  <ChangeAllDialog
                    v-if="mode === 'edit' && showEditDialogKey === 'cost'"
                    v-on-clickaway="closeDialog"
                    :item-title="changeAllDialogItemTitle"
                    @changeAllRecalculation="changeAllDateValue($event)"
                    @close="closeDialog()"
                  />
                </div>
              </div>
            </td>
            <td
              v-for="(data, index) in tableDataObj.cost"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="cost"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'cost').validation
                "
                @change="onCostRateReCalculation(data.date)"
              />
            </td>
          </tr>
          <!-- 売上原価 -->
          <!-- 原価率 -->
          <tr class="value-master compare">
            <td class="value-master-header">原価率</td>
            <td
              v-for="(data, index) in tableDataObj.costRate"
              :key="index"
              class="value-master-data ratio"
            >
              <template v-if="mode === 'view'">
                <span>{{ getNumCommaSeparated(data.value, '%') }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="costRate"
                  v-model="data.value"
                  type="text"
                  maxlength="15"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'costRate').validation
                  "
                  @change="onCostValueReCalculation(data.date)"
                />
                <span>%</span>
              </template>
            </td>
          </tr>
          <!-- 原価率 -->
          <!-- 人件費 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('人件費') }"
          >
            <td class="value-master-header">
              <div class="flex">
                <span>人件費</span>
                <ErrorSVG class="icon-error" />
                <div class="dialog-container">
                  <button
                    v-show="mode === 'edit'"
                    class="btn-change-all"
                    @click="
                      setChangeAllDialogProps(
                        $event,
                        'personnelExpenses',
                        '人件費'
                      )
                    "
                  >
                    まとめて変更
                  </button>
                  <ChangeAllDialog
                    v-if="
                      mode === 'edit' &&
                      showEditDialogKey === 'personnelExpenses'
                    "
                    v-on-clickaway="closeDialog"
                    :item-title="changeAllDialogItemTitle"
                    @changeAllRecalculation="changeAllDateValue($event)"
                    @close="closeDialog()"
                  />
                </div>
              </div>
            </td>
            <td
              v-for="(data, index) in tableDataObj.personnelExpenses"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="personnelExpenses"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'personnelExpenses')
                    .validation
                "
                @change="
                  onReCalculationRatio(
                    data.date,
                    'personnelExpenses',
                    'comparePersonnelExpenses'
                  )
                "
              />
            </td>
          </tr>
          <!-- 人件費 -->
          <!-- 人件費-前年同月比 -->
          <tr class="value-master compare">
            <td class="value-master-header">前年同月比</td>
            <td
              v-for="(data, index) in tableDataObj.comparePersonnelExpenses"
              :key="index"
              class="value-master-data ratio"
            >
              <template v-if="mode === 'view'">
                <span :class="getValueClass(data.value, true)">{{
                  getNumCommaSeparated(data.value, '%')
                }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="comparePersonnelExpenses"
                  v-model="data.value"
                  type="text"
                  maxlength="5"
                  :validation="
                    $common.getFormItemsDetail(
                      formItems,
                      'comparePersonnelExpenses'
                    ).validation
                  "
                  @change="
                    onReCalculationValue(
                      data.date,
                      'comparePersonnelExpenses',
                      'personnelExpenses'
                    )
                  "
                />
                <span>%</span>
              </template>
            </td>
          </tr>
          <!-- 人件費-前年同月比 -->
          <!-- 地代・家賃 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('地代・家賃') }"
          >
            <td class="value-master-header">
              <div class="flex">
                <span>地代・家賃</span>
                <ErrorSVG class="icon-error" />
                <div class="dialog-container">
                  <button
                    v-show="mode === 'edit'"
                    class="btn-change-all"
                    @click="
                      setChangeAllDialogProps($event, 'rents', '地代・家賃')
                    "
                  >
                    まとめて変更
                  </button>
                  <ChangeAllDialog
                    v-if="mode === 'edit' && showEditDialogKey === 'rents'"
                    v-on-clickaway="closeDialog"
                    :item-title="changeAllDialogItemTitle"
                    @changeAllRecalculation="changeAllDateValue($event)"
                    @close="closeDialog()"
                  />
                </div>
              </div>
            </td>
            <td
              v-for="(data, index) in tableDataObj.rents"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="rents"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'rents').validation
                "
                @change="
                  onReCalculationRatio(data.date, 'rents', 'compareRents')
                "
              />
            </td>
          </tr>
          <!-- 地代・家賃 -->
          <!-- 地代・家賃-前年同月比 -->
          <tr class="value-master compare">
            <td class="value-master-header">前年同月比</td>
            <td
              v-for="(data, index) in tableDataObj.compareRents"
              :key="index"
              class="value-master-data ratio"
            >
              <template v-if="mode === 'view'">
                <span :class="getValueClass(data.value, true)">{{
                  getNumCommaSeparated(data.value, '%')
                }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="compareRents"
                  v-model="data.value"
                  type="text"
                  maxlength="5"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'compareRents')
                      .validation
                  "
                  @change="
                    onReCalculationValue(data.date, 'compareRents', 'rents')
                  "
                />
                <span>%</span>
              </template>
            </td>
          </tr>
          <!-- 地代・家賃 -前年同月比 -->
          <!-- 他販管費 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('他販管費') }"
          >
            <td class="value-master-header">
              <div class="flex">
                <span>他販管費</span>
                <ErrorSVG class="icon-error" />
                <div class="dialog-container">
                  <button
                    v-show="mode === 'edit'"
                    class="btn-change-all"
                    @click="
                      setChangeAllDialogProps($event, 'sgAndA', '他販管費')
                    "
                  >
                    まとめて変更
                  </button>
                  <ChangeAllDialog
                    v-if="mode === 'edit' && showEditDialogKey === 'sgAndA'"
                    v-on-clickaway="closeDialog"
                    :item-title="changeAllDialogItemTitle"
                    @changeAllRecalculation="changeAllDateValue($event)"
                    @close="closeDialog()"
                  />
                </div>
              </div>
            </td>
            <td
              v-for="(data, index) in tableDataObj.sgAndA"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="sgAndA"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'sgAndA').validation
                "
                @change="
                  onReCalculationRatio(data.date, 'sgAndA', 'compareSgAndA')
                "
              />
            </td>
          </tr>
          <!-- 他販管費  -->
          <!-- 他販管費-前年同月比 -->
          <tr class="value-master compare">
            <td class="value-master-header">前年同月比</td>
            <td
              v-for="(data, index) in tableDataObj.compareSgAndA"
              :key="index"
              class="value-master-data ratio"
            >
              <template v-if="mode === 'view'">
                <span :class="getValueClass(data.value, true)">{{
                  getNumCommaSeparated(data.value, '%')
                }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="compareSgAndA"
                  v-model="data.value"
                  type="text"
                  maxlength="5"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'compareSgAndA')
                      .validation
                  "
                  @change="
                    onReCalculationValue(data.date, 'compareSgAndA', 'sgAndA')
                  "
                />
                <span>%</span>
              </template>
            </td>
          </tr>
          <!-- 他販管費-前年同月比 -->
          <!-- 営業利益 -->
          <tr
            class="value-master operatingIncome"
            :class="{ 'status-danger': checkAlertTargetItem('営業利益') }"
          >
            <td class="value-master-header">
              営業利益 <ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.operatingIncome"
              :key="index"
              class="value-master-data"
            >
              <p ref="operatingIncome">
                {{ getNumCommaSeparated(data.value) }}
              </p>
            </td>
          </tr>
          <!-- 営業利益  -->
          <!-- 営業利益率 -->
          <tr class="value-master compare">
            <td class="value-master-header">営業利益率</td>
            <td
              v-for="(data, index) in tableDataObj.operatingIncomeRate"
              :key="index"
              class="value-master-data ratio"
            >
              <p ref="operatingIncomeRate">
                {{ getNumCommaSeparated(data.value, '%') }}
              </p>
            </td>
          </tr>
          <!-- 営業利益率 -->
          <!-- 減価償却費（原価） -->
          <tr
            class="value-master"
            :class="{
              'status-danger': checkAlertTargetItem('減価償却費（原価）'),
            }"
          >
            <td class="value-master-header">
              減価償却費（原価） <ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.depreciationCost"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="costRatio"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'depreciationCost')
                    .validation
                "
                @change="updateOperatingCashFlow(data.date, index)"
              />
            </td>
          </tr>
          <!-- 減価償却費（原価）  -->
          <!-- 減価償却費（販管費） -->
          <tr
            class="value-master"
            :class="{
              'status-danger': checkAlertTargetItem('減価償却費（販管費）'),
            }"
          >
            <td class="value-master-header">
              減価償却費（販管費） <ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.depreciationSgAndA"
              :key="index"
              class="value-master-data"
            >
              <template v-if="mode === 'view'">
                <span>{{ getNumCommaSeparated(data.value) }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="costRatio"
                  v-model="data.value"
                  type="text"
                  maxlength="15"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'depreciationSgAndA')
                      .validation
                  "
                  @change="updateOperatingCashFlow(data.date, index)"
                />
              </template>
            </td>
          </tr>
          <!-- 減価償却費（販管費） -->
          <!-- 売上債権 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('売上債権') }"
          >
            <td class="value-master-header">
              売上債権<ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.tradeReceivable"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="tradeReceivable"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'tradeReceivable')
                    .validation
                "
                @change="
                  updateRotationPeriod(
                    data.date,
                    'tradeReceivable',
                    'sales',
                    'tradeReceivableTurnoverPeriod'
                  )
                "
              />
            </td>
          </tr>
          <!-- 売上債権  -->
          <!-- 売上債権-回転期間（日） -->
          <tr class="value-master compare">
            <td class="value-master-header">回転期間（日）</td>
            <td
              v-for="(
                data, index
              ) in tableDataObj.tradeReceivableTurnoverPeriod"
              :key="index"
              class="value-master-data"
            >
              <template v-if="mode === 'view'">
                <span>{{ getNumCommaSeparated(data.value) }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="tradeReceivableTurnoverPeriod"
                  v-model="data.value"
                  type="text"
                  maxlength="15"
                  :validation="
                    $common.getFormItemsDetail(
                      formItems,
                      'tradeReceivableTurnoverPeriod'
                    ).validation
                  "
                  @change="
                    updateRotationPeriodValue(
                      data.date,
                      'tradeReceivableTurnoverPeriod',
                      'sales',
                      'tradeReceivable'
                    )
                  "
                />
              </template>
            </td>
          </tr>
          <!-- 売上債権-回転期間（日） -->
          <!-- 棚卸資産 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('棚卸資産') }"
          >
            <td class="value-master-header">
              棚卸資産 <ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.inventories"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="inventories"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'inventories')
                    .validation
                "
                @change="
                  updateRotationPeriod(
                    data.date,
                    'inventories',
                    'cost',
                    'inventoriesTurnoverPeriod'
                  )
                "
              />
            </td>
          </tr>
          <!-- 棚卸資産  -->
          <!-- 棚卸資産-回転期間（日） -->
          <tr class="value-master compare">
            <td class="value-master-header">回転期間（日）</td>
            <td
              v-for="(data, index) in tableDataObj.inventoriesTurnoverPeriod"
              :key="index"
              class="value-master-data"
            >
              <template v-if="mode === 'view'">
                <span>{{ getNumCommaSeparated(data.value) }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="inventoriesTurnoverPeriod"
                  v-model="data.value"
                  type="text"
                  maxlength="15"
                  :validation="
                    $common.getFormItemsDetail(
                      formItems,
                      'inventoriesTurnoverPeriod'
                    ).validation
                  "
                  @change="
                    updateRotationPeriodValue(
                      data.date,
                      'inventoriesTurnoverPeriod',
                      'cost',
                      'inventories'
                    )
                  "
                />
              </template>
            </td>
          </tr>
          <!-- 棚卸資産-回転期間（日） -->
          <!-- 仕入債務 -->
          <tr
            class="value-master"
            :class="{ 'status-danger': checkAlertTargetItem('仕入債務') }"
          >
            <td class="value-master-header">
              仕入債務 <ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.accountsPayable"
              :key="index"
              class="value-master-data"
            >
              <span v-if="mode === 'view'">{{
                getNumCommaSeparated(data.value)
              }}</span>
              <CustomInputText
                v-else
                ref="accountsPayable"
                v-model="data.value"
                type="text"
                maxlength="15"
                :validation="
                  $common.getFormItemsDetail(formItems, 'accountsPayable')
                    .validation
                "
                @change="
                  updateRotationPeriod(
                    data.date,
                    'accountsPayable',
                    'cost',
                    'accountsPayableTurnoverPeriod'
                  )
                "
              />
            </td>
          </tr>
          <!-- 仕入債務  -->
          <!-- 仕入債務-回転期間（日） -->
          <tr class="value-master compare">
            <td class="value-master-header">回転期間（日）</td>
            <td
              v-for="(
                data, index
              ) in tableDataObj.accountsPayableTurnoverPeriod"
              :key="index"
              class="value-master-data"
            >
              <template v-if="mode === 'view'">
                <span>{{ getNumCommaSeparated(data.value) }}</span>
              </template>
              <template v-else>
                <CustomInputText
                  ref="accountsPayableTurnoverPeriod"
                  v-model="data.value"
                  type="text"
                  maxlength="15"
                  :validation="
                    $common.getFormItemsDetail(
                      formItems,
                      'accountsPayableTurnoverPeriod'
                    ).validation
                  "
                  @change="
                    updateRotationPeriodValue(
                      data.date,
                      'accountsPayableTurnoverPeriod',
                      'cost',
                      'accountsPayable'
                    )
                  "
                />
              </template>
            </td>
          </tr>
          <!-- 仕入債務-回転期間（日） -->
          <!-- 営業CF -->
          <tr
            class="value-master operatingCashFlow"
            :class="{ 'status-danger': checkAlertTargetItem('営業CF') }"
          >
            <td class="value-master-header">
              営業CF <ErrorSVG class="icon-error" />
            </td>
            <td
              v-for="(data, index) in tableDataObj.operatingCashFlow"
              :key="index"
              class="value-master-data"
            >
              <p ref="operatingCashFlow">
                {{ getNumCommaSeparated(data.value) }}
              </p>
            </td>
          </tr>
          <!-- 営業CF -->
        </tbody>
      </table>
    </div>
    <div v-if="mode === 'edit'" class="simulation-footer">
      <button
        class="flex btn btn-basic btn-long btn-manual-simulation-bottom"
        :class="{ 'btn-disabled': checkBtnDisabled() }"
        @click="transitionSimulationResult()"
      >
        <IconCalculate />
        <span>編集内容をグラフで表示する</span>
      </button>
    </div>
    <CancelEditModal
      v-if="showCancelEditModalFlg"
      @reflect="restoreSettings()"
      @close="closeDiscardConfirmationModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'
import { mixin as clickaway } from 'vue-clickaway'
import cfmCommonMixin from '~/mixin/cfm/cfmCommon.js'
import IconCalculate from '~/assets/svg/cfm/cashFlowReport/calculate-24px.svg'
// import IconDanger from '~/assets/svg/cfm/cashFlowReport/status-danger.svg'

export default {
  name: 'CashflowTable',
  components: {
    IconCalculate,
    // IconDanger,
  },
  mixins: [cfmCommonMixin, clickaway],
  props: {},
  data() {
    return {
      tableDataObj: {},
      // 表示・編集のステータス
      mode: 'view',
      // 編集内容破棄確認モーダルのステート
      showCancelEditModalFlg: false,
      // まとめて変更する項目key
      showEditDialogKey: '',
      // まとめて変更する項目名
      changeAllDialogItemTitle: '',
      // まとめて変更する条件の値
      changeAllDialogItemValue: 0,
      // シミュレーションコメント
      simulationComment: '',
      // シミュレーション保存のプレースホルダ
      simulationCommentPlaceholder:
        '編集した内容が分かるコメントを入力ください',
      // シミュレーションを保存のバリデーションルール
      simulationCommentValidation: [
        {
          type: 'maxlength',
          maxlength: 2000,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 2000,
          }),
        },
      ],
      // 保存したシミュレーション結果
      saveCashFlowSimulationData: {},
      formItems: [
        {
          id: 'sales',
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
          id: 'compareSales',
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
          id: 'cost',
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
        {
          id: 'personnelExpenses',
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
          id: 'comparePersonnelExpenses',
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
          id: 'rents',
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
          id: 'compareRents',
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
          id: 'sgAndA',
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
          id: 'compareSgAndA',
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
          id: 'operatingIncomeRate',
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
          id: 'depreciationCost',
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
          id: 'depreciationSgAndA',
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
          id: 'tradeReceivable',
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
          id: 'tradeReceivableTurnoverPeriod',
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
          id: 'inventories',
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
          id: 'inventoriesTurnoverPeriod',
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
          id: 'accountsPayable',
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
          id: 'accountsPayableTurnoverPeriod',
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
          id: 'accountsPayableTurnoverPeriod',
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
    ...mapState('cfm/cashFlowReportStore', [
      'cashFlowReportList',
      'cashFlowReportTableHeader',
      'cashFlowReportTableDataObj',
      'cashflowSimulationData',
      'advisorVal',
      'saveSimulationInfo',
    ]),
    /**
     * 値の文字色を設定するクラスの取得
     *
     * @return {string} クラス名
     */
    getValueClass() {
      return (value, reverse) => {
        let className = ''

        if (reverse) {
          if (value >= 120) {
            className = 'text-alert'
          } else if (value <= 80) {
            className = 'text-fine'
          }
        } else if (value >= 120) {
          className = 'text-fine'
        } else if (value <= 80) {
          className = 'text-alert'
        }

        return className
      }
    },
    /**
     * 編集内容をグラフで表示するボタンの非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        let result = false

        if (
          this.simulationComment.length >
          this.simulationCommentValidation.maxlength
        ) {
          result = true
          return result
        }

        for (const key in this.tableDataObj) {
          for (let i = 0; i < this.tableDataObj[key].length; i++) {
            if (
              this.tableDataObj[key][i].value === 'ゼロ除算' ||
              this.tableDataObj[key][i].value === 'NaN'
            ) {
              continue
            }

            if (
              this.$common.checkExistValidation(
                this.formItems,
                key,
                String(this.tableDataObj[key][i].value)
              )
            ) {
              result = true
              break
            }
          }
        }

        return result
      }
    },
  },
  watch: {
    cashFlowReportTableDataObj(afterVal, beforeVal) {
      if (afterVal !== beforeVal) {
        this.setDefaultTableData() // テーブルのデフォルトデータを表示
      }
    },
  },
  created() {
    this.setDefaultTableData() // テーブルのデフォルトデータを表示
  },
  methods: {
    ...mapMutations('cfm/cashFlowReportStore', [
      'setSimulationTemporarilySaved',
      'setSimulationComments',
      'setAdviceReloadFlg',
      'setCashflowSimulationData',
      'setCashFlowAlertList',
    ]),
    /**
     * テーブルのデフォルトデータを表示
     */
    setDefaultTableData() {
      if (this.checkSimulationType === 1) {
        this.tableDataObj = JSON.parse(
          JSON.stringify(Object.assign({}, this.cashFlowReportTableDataObj))
        )
      } else if (this.checkSimulationType === 2) {
        this.simulationComment = this.cashflowSimulationData.comment
        this.tableDataObj = JSON.parse(
          JSON.stringify(this.cashflowSimulationData.tableData)
        )
        this.mode = 'edit'
      } else if (this.checkSimulationType === 3) {
        this.simulationComment = this.saveSimulationInfo.simulationResultJson.comment
        this.tableDataObj = JSON.parse(
          JSON.stringify(Object.assign({}, this.cashFlowReportTableDataObj))
        )
      }
    },
    /**
     * モードの切り替え
     *
     * @param {String} mode 'view' or 'edit'
     * @param {boolean} force true:編集破棄モーダルを出さない false:編集破棄モーダルを表示
     */
    changeMode(mode, force) {
      // 編集 → 表示切り替え時 & 何かしらの値が変更あった場合
      if (mode === 'view' && this.someValueChangeState && !force) {
        this.showCancelEditModalFlg = true
        return
      }

      this.mode = mode
    },
    /**
     * 変更した値の反映 or 初期値に戻す
     */
    restoreSettings() {
      this.setDefaultTableData() // テーブルのデフォルトデータを表示
      this.mode = 'view'
      this.someValueChangeState = false
    },
    /**
     * モーダルクローズ
     */
    closeDiscardConfirmationModal() {
      this.showCancelEditModalFlg = false
    },
    /**
     * まとめて変更ダイアログに渡すpropsをセットする
     *
     * @param {object} e イベントオブジェクト
     * @param {string} key 変更する項目key
     * @param {string} title 変更する項目名
     */
    setChangeAllDialogProps(e, key, title) {
      // まとめて変更する項目のインデックスをセットする
      this.showEditDialogKey = key
      // まとめて変更する項目名をセットする
      this.changeAllDialogItemTitle = title
    },
    /**
     * 値変更時の前年同月比の再計算
     * 売上高,人件費,地代・家賃,他販管費の値修正時に呼び出されるイベント
     *
     * @param {String} date 更新対象の年月
     * @param {String} key 入力した項目のkey
     * @param {String} compareKey 更新対象の前年同月比のkey
     */
    onReCalculationRatio(date, key, compareKey) {
      const targetIndex = this.tableDataObj[key].findIndex(
        (data) => data.date === date
      )
      const targetData = this.tableDataObj[key][targetIndex]

      if (isNaN(targetData.value)) {
        return
      }

      // 前年同月比を再計算して更新
      this.updateYearOnYearData(targetData.value, date, key, compareKey)

      // 売上高が変わる場合は、原価率を再計算
      if (key === 'sales') {
        this.onCostRateReCalculation(date) // 原価率の設定
        this.onAddAnimation('costRate', targetIndex) // 原価率
        this.reCalcRotation(
          'tradeReceivableTurnoverPeriod',
          'sales',
          'tradeReceivable'
        ) // 回転期間とその値の再計算処理
      }

      // 営業利益,営業利益率,営業CFを最新の値に更新
      this.updateOperatingCash(date, targetIndex)

      // アニメーション
      this.onAddAnimation(`${compareKey}`, targetIndex) // 前年同月比

      this.someValueChangeState = true // 値変更フラグの設定
    },
    /**
     * 率 → 値の再計算
     * 前年同月比の値修正時に呼び出されるイベント
     *
     * @param {String} date 更新対象の年月
     * @param {String} key 入力した項目のkey
     * @param {String} compareKey 更新対象の前年同月比のkey
     */
    onReCalculationValue(date, key, compareKey) {
      const targetIndex = this.tableDataObj[key].findIndex(
        (data) => data.date === date
      )
      const targetData = this.tableDataObj[compareKey][targetIndex]
      const inputValue = this.getInputTableData(key, date) // 入力値

      if (isNaN(inputValue)) {
        return
      }
      const yearOnYearData = this.getYearOnYearData(date)[compareKey] // 前年月の対象のデータ

      targetData.value = this.getNumFixed(
        yearOnYearData * (inputValue / 100),
        0
      )

      // 売上高が変わる場合は、原価率を再計算
      if (key === 'compareSales') {
        this.onCostRateReCalculation(date) // 原価率の設定
        this.onAddAnimation('costRate', targetIndex) // 原価率
        this.reCalcRotation(
          'tradeReceivableTurnoverPeriod',
          'sales',
          'tradeReceivable'
        ) // 回転期間とその値の再計算処理
      }

      // 営業利益,営業利益率,営業CFを最新の値に更新
      this.updateOperatingCash(date, targetIndex)

      // アニメーション
      this.onAddAnimation(`${compareKey}`, targetIndex) // 前年同月比

      this.someValueChangeState = true // 値変更フラグの設定
    },
    /**
     * 売上原価の再計算
     *
     * @param {String} date 更新対象の年月
     */
    onCostValueReCalculation(date) {
      const targetIndex = this.tableDataObj.cost.findIndex(
        (data) => data.date === date
      )
      const costRateValue = Number(
        this.tableDataObj.costRate.find((data) => data.date === date).value
      ) // 原価率
      const sales = this.getInputTableData('sales', date) // 売上高

      if (isNaN(costRateValue) || isNaN(sales)) {
        return
      }

      this.tableDataObj.cost.find(
        (data) => data.date === date
      ).value = this.getNumFixed(costRateValue * (sales / 100), 0) // 売上原価

      // 回転期間とその値の再計算処理
      this.reCalcRotation('inventoriesTurnoverPeriod', 'cost', 'inventories')
      this.reCalcRotation(
        'accountsPayableTurnoverPeriod',
        'cost',
        'accountsPayable'
      )

      // 営業利益,営業利益率,営業CFを最新の値に更新
      this.updateOperatingCash(date, targetIndex)

      // アニメーション
      this.onAddAnimation('cost', targetIndex) // 売上原価

      this.someValueChangeState = true // 値変更フラグの設定
    },
    /**
     * 原価率の再計算
     *
     * @param {String} date 更新対象の年月
     */
    onCostRateReCalculation(date) {
      const targetIndex = this.tableDataObj.costRate.findIndex(
        (data) => data.date === date
      )
      const costValue = Number(
        this.tableDataObj.cost.find((data) => data.date === date).value
      ) // 売上原価
      const sales = this.getInputTableData('sales', date) // 売上高

      if (isNaN(costValue) || isNaN(sales)) {
        return
      }

      this.tableDataObj.costRate.find(
        (data) => data.date === date
      ).value = this.getNumFixed((costValue / sales) * 100, 1) // 原価率

      // 回転期間とその値の再計算処理
      this.reCalcRotation('inventoriesTurnoverPeriod', 'cost', 'inventories')
      this.reCalcRotation(
        'accountsPayableTurnoverPeriod',
        'cost',
        'accountsPayable'
      )

      // 営業利益,営業利益率,営業CFを最新の値に更新
      this.updateOperatingCash(date, targetIndex)

      // アニメーション
      this.onAddAnimation('costRate', targetIndex) // 前年同月比

      this.someValueChangeState = true // 値変更フラグの設定
    },
    /**
     * 回転期間とその値の再計算処理
     *
     * @param {string} key 入力対象のkey
     * @param {string} targetKey 計算項目のkey
     * @param {string} updateKey 更新対象のkey
     */
    reCalcRotation(key, targetKey, updateKey) {
      for (let i = 0; i < this.cashFlowReportTableHeader.length; i++) {
        this.updateRotationPeriod(
          this.cashFlowReportTableHeader[i],
          updateKey,
          targetKey,
          key
        )
      }
    },
    /**
     * テーブルに設定している入力値の取得
     *
     * @param {string} key 項目key
     * @param {string} date 日付
     * @return {number} 入力値
     */
    getInputTableData(key, date) {
      return Number(
        this.tableDataObj[key].find((data) => data.date === date).value
      )
    },
    /**
     * 営業利益,営業利益率,営業CFを最新の値に更新
     *
     * @param {String} date 更新対象の年月
     * @param {number} targetIndex 更新対象のインデックス
     */
    updateOperatingCash(date, targetIndex) {
      // 営業利益を再計算して更新
      this.updateOperatingIncome(date, targetIndex)
      // 営業利益率を再計算して更新
      this.updateOperatingIncomeRate(date, targetIndex)
      // 月ごとの営業CFを再計算する
      this.updateOperatingCashFlow(date, targetIndex)

      // アニメーション
      this.onAddAnimation('operatingIncomeRate', targetIndex) // 営業利益率
    },
    /**
     * 前年同月比のデータを更新
     *
     * @param {String} inputVal 入力値
     * @param {String} date 更新対象の日付
     * @param {String} key 入力した項目のkey
     * @param {String} compareKey 更新対象の前年同月比のkey
     */
    updateYearOnYearData(inputVal, date, key, compareKey) {
      const yearOnYearVal = this.getYearOnYearData(date)[key] // 前年同月のデータ取得
      const ratio = this.getNumFixed((inputVal * 100) / yearOnYearVal, 0)
      const targetData = this.tableDataObj[compareKey].find(
        (data) => data.date === date
      )

      targetData.value = ratio
    },
    /**
     * 営業利益を再計算して更新
     * 計算式:売上高 + (売上原価 + 人件費 + 地代・家賃 + その他販管費)
     *
     * @param {String} date 更新対象の日付
     * @param {number} targetIndex 更新対象のインデックス
     */
    updateOperatingIncome(date, targetIndex) {
      const sales = Number(
        this.tableDataObj.sales.find((data) => data.date === date).value
      )
      // 売上高
      const cost = Number(
        this.tableDataObj.cost.find((data) => data.date === date).value
      )
      // 売上原価
      const personnelExpenses = Number(
        this.tableDataObj.personnelExpenses.find((data) => data.date === date)
          .value
      )
      // 人件費
      const rents = Number(
        this.tableDataObj.rents.find((data) => data.date === date).value
      )
      // 地代・家賃
      const sgAndA = Number(
        this.tableDataObj.sgAndA.find((data) => data.date === date).value
      )
      // その他販管費
      this.tableDataObj.operatingIncome.find(
        (data) => data.date === date
      ).value = this.getNumFixed(
        sales - (cost + personnelExpenses + rents + sgAndA),
        0
      ) // 営業利益

      // アニメーション
      this.onAddAnimation('operatingIncome', targetIndex) // 営業利益
    },
    /**
     * 営業利益率を再計算して表示
     * 計算式:営業利益/売上高
     *
     * @param {String} date 更新対象の日付
     * @param {number} targetIndex 更新対象のインデックス
     */
    updateOperatingIncomeRate(date, targetIndex) {
      const sales = Number(
        this.tableDataObj.sales.find((data) => data.date === date).value
      )
      // 売上高
      const operatingIncome = Number(
        this.tableDataObj.operatingIncome.find((data) => data.date === date)
          .value
      )
      // 営業利益

      this.tableDataObj.operatingIncomeRate.find(
        (data) => data.date === date
      ).value = this.getNumFixed((operatingIncome / sales) * 100, 0) // 営業利益率

      // アニメーション
      this.onAddAnimation('operatingIncome', targetIndex) // 営業利益率
    },
    /**
     * 営業CFを再計算して表示
     * 計算式:営業利益 + 減価償却費(原価) + 減価償却費(販管費) - (売上債権  - 前月の売上債権) - (棚卸資産 - 前月の棚卸資産) + (仕入債務 - 前月の仕入債務)
     *
     * @param {String} date 更新対象の日付
     * @param {number} targetIndex 更新対象のインデックス
     */
    updateOperatingCashFlow(date, targetIndex) {
      const operatingIncome = Number(
        this.tableDataObj.operatingIncome.find((data) => data.date === date)
          .value
      ) // 営業利益
      const depreciationCost = Number(
        this.tableDataObj.depreciationCost.find((data) => data.date === date)
          .value
      ) // 減価償却費（原価）
      const depreciationSgAndA = Number(
        this.tableDataObj.depreciationSgAndA.find((data) => data.date === date)
          .value
      ) // 減価償却費(販管費)
      const tradeReceivable = Number(
        this.tableDataObj.tradeReceivable.find((data) => data.date === date)
          .value
      ) // 売上債権
      const lastYearTradeReceivable = this.getTargetMonthBeforeData(
        date,
        1,
        'tradeReceivable'
      ) // 前月度の売上債権
      const inventories = Number(
        this.tableDataObj.inventories.find((data) => data.date === date).value
      ) // 棚卸資産
      const lastYearInventories = this.getTargetMonthBeforeData(
        date,
        1,
        'inventories'
      ) // 棚卸資産
      const accountsPayable = Number(
        this.tableDataObj.accountsPayable.find((data) => data.date === date)
          .value
      ) // 仕入債務
      const lastYearAccountsPayable = this.getTargetMonthBeforeData(
        date,
        1,
        'accountsPayable'
      ) // 前月度の仕入債務

      this.tableDataObj.operatingCashFlow.find(
        (data) => data.date === date
      ).value = this.getNumFixed(
        operatingIncome +
          depreciationCost +
          depreciationSgAndA -
          (tradeReceivable - lastYearTradeReceivable) -
          (inventories - lastYearInventories) +
          (accountsPayable - lastYearAccountsPayable),
        0
      )

      // アニメーション
      this.onAddAnimation('operatingCashFlow', targetIndex) // 営業CF
    },
    /**
     * 回転期間変更時の計算処理
     *
     * @param {string} date 更新対象の日付
     * @param {string} key 入力対象のkey
     * @param {string} targetKey 計算項目のkey
     * @param {string} updateKey 更新対象のkey
     */
    updateRotationPeriodValue(date, key, targetKey, updateKey) {
      const keyData = Number(
        this.tableDataObj[key].find((data) => data.date === date).value
      )
      const targetIndex = this.tableDataObj[key].findIndex(
        (data) => data.date === date
      )
      const targetKeyData = Number(
        this.tableDataObj[targetKey].find((data) => data.date === date).value
      )

      if (isNaN(targetKeyData)) {
        return
      }

      let rotationPeriodValue = null // 回転期間
      const oneMonthBeforeData = this.getTargetMonthBeforeData(
        date,
        1,
        targetKey
      )
      const twoMonthBeforeData = this.getTargetMonthBeforeData(
        date,
        2,
        targetKey
      )
      const threeMonthBeforeData = this.getTargetMonthBeforeData(
        date,
        3,
        targetKey
      )

      if (keyData < 30) {
        rotationPeriodValue = (targetKeyData * keyData) / 30
      } else if (keyData < 30 * 2) {
        rotationPeriodValue =
          targetKeyData + (oneMonthBeforeData * (keyData - 30)) / 30
      } else if (keyData < 30 * 3) {
        rotationPeriodValue =
          targetKeyData +
          oneMonthBeforeData +
          (twoMonthBeforeData * (keyData - 30 * 2)) / 30
      } else if (keyData < 30 * 4) {
        rotationPeriodValue =
          targetKeyData +
          oneMonthBeforeData +
          twoMonthBeforeData +
          (threeMonthBeforeData * (keyData - 30 * 3)) / 30
      } else {
        rotationPeriodValue =
          targetKeyData +
          oneMonthBeforeData +
          twoMonthBeforeData +
          threeMonthBeforeData
      }

      this.tableDataObj[updateKey].find(
        (data) => data.date === date
      ).value = this.getNumFixed(rotationPeriodValue, 0)

      this.updateOperatingCashFlow(date, targetIndex) // 営業CFの再計算

      this.onAddAnimation(`${updateKey}`, targetIndex)

      this.someValueChangeState = true // 値変更フラグの設定
    },
    /**
     * 回転期間の再計算処理(値変更時に実行)
     *
     * @param {string} date 更新対象の日付
     * @param {string} key 入力対象のkey
     * @param {string} targetKey 計算項目のkey
     * @param {string} updateKey 更新対象のkey
     */
    updateRotationPeriod(date, key, targetKey, updateKey) {
      const keyData = Number(
        this.tableDataObj[key].find((data) => data.date === date).value
      )
      const targetIndex = this.tableDataObj[key].findIndex(
        (data) => data.date === date
      )
      const targetKeyData = Number(
        this.tableDataObj[targetKey].find((data) => data.date === date).value
      )

      if (isNaN(targetKeyData)) {
        return
      }

      let rotationPeriod = null // 回転期間
      const oneMonthBeforeData = this.getTargetMonthBeforeData(
        date,
        1,
        targetKey
      )
      const twoMonthBeforeData = this.getTargetMonthBeforeData(
        date,
        2,
        targetKey
      )
      const threeMonthBeforeData = this.getTargetMonthBeforeData(
        date,
        3,
        targetKey
      )

      if (keyData / targetKeyData < 1) {
        rotationPeriod = (keyData / targetKeyData) * 30
      } else if (keyData / (targetKeyData + oneMonthBeforeData) < 1) {
        rotationPeriod =
          ((keyData - targetKeyData) / oneMonthBeforeData + 1) * 30
      } else if (
        keyData / (targetKeyData + oneMonthBeforeData + twoMonthBeforeData) <
        1
      ) {
        rotationPeriod =
          ((keyData - (targetKeyData + oneMonthBeforeData)) /
            twoMonthBeforeData +
            2) *
          30
      } else if (
        keyData /
          (targetKeyData +
            oneMonthBeforeData +
            twoMonthBeforeData +
            threeMonthBeforeData) <
        1
      ) {
        rotationPeriod =
          ((keyData -
            (targetKeyData + oneMonthBeforeData + twoMonthBeforeData)) /
            threeMonthBeforeData +
            3) *
          30
      } else {
        rotationPeriod = 120
      }

      this.tableDataObj[updateKey].find(
        (data) => data.date === date
      ).value = this.getNumFixed(rotationPeriod, 1)

      this.updateOperatingCashFlow(date, targetIndex) // 営業CFの再計算

      // 最終月以外は来月の営業CFの再計算を行う
      if (!this.checkTargetDateLast(date)) {
        this.updateOperatingCashFlow(
          this.getTargetDate(date, 1),
          targetIndex + 1
        ) // 営業CFの再計算
      }

      this.onAddAnimation(`${updateKey}`, targetIndex)

      this.someValueChangeState = true // 値変更フラグの設定
    },
    /**
     * 引数の月分前のデータを取得(予測値の場合は入力されている値を参照)
     *
     * @param {String} date 更新対象の日付
     * @param {number} monthNum Nか月前
     * @param {String} key 更新対象のkey
     * @return {number} 引数の月分前のデータ
     */
    getTargetMonthBeforeData(date, monthNum, key) {
      const monthBeforeDateObj = dayjs(date + '/' + '01').subtract(
        monthNum,
        'month'
      )
      const monthBeforeDay =
        monthBeforeDateObj.$y +
        '/' +
        ('00' + String(monthBeforeDateObj.$M + 1)).slice(-2)
      let keyData = null

      if (this.cashFlowReportTableHeader.includes(monthBeforeDay)) {
        keyData = this.tableDataObj[key].find(
          (data) => data.date === monthBeforeDay
        ).value
      } else {
        keyData = this.cashFlowReportList.find(
          (data) => data.year + '/' + data.month === monthBeforeDay
        )[key]
      }

      return Number(keyData)
    },
    /**
     * 全ての予測月のデータに対して、ダイアログに入力した値を反映
     *
     * @param {object} editData ダイアログで設定した編集データ
     */
    changeAllDateValue(editData) {
      const dialogKey = this.showEditDialogKey
      let targetKey = ''

      switch (dialogKey) {
        case 'sales':
          targetKey = 'compareSales'
          break
        case 'personnelExpenses':
          targetKey = 'comparePersonnelExpenses'
          break
        case 'rents':
          targetKey = 'compareRents'
          break
        case 'sgAndA':
          targetKey = 'compareSgAndA'
          break
        case 'cost':
          targetKey = 'costRate'
          break
        default:
          break
      }

      if (dialogKey === 'cost') {
        if (editData.type === '1') {
          for (let i = 0; i < this.tableDataObj[targetKey].length; i++) {
            this.tableDataObj[targetKey][i].value = editData.conditionValue
            this.onCostValueReCalculation(this.tableDataObj[targetKey][i].date)
          }
        } else if (editData.type === '2') {
          for (let i = 0; i < this.tableDataObj[dialogKey].length; i++) {
            this.tableDataObj[dialogKey][i].value = editData.conditionValue
            this.onCostRateReCalculation(this.tableDataObj[dialogKey][i].date)
          }
        }
      } else if (dialogKey !== 'cost') {
        if (editData.type === '1') {
          for (let i = 0; i < this.tableDataObj[targetKey].length; i++) {
            this.tableDataObj[targetKey][i].value = editData.conditionValue
            this.onReCalculationValue(
              this.tableDataObj[targetKey][i].date,
              targetKey,
              dialogKey
            )
          }
        } else if (editData.type === '2') {
          const aveLastYearData = this.getAveLastYearData(dialogKey) // 現在年から過去1年の項目値の平均値を取得

          for (let i = 0; i < this.tableDataObj[dialogKey].length; i++) {
            this.tableDataObj[dialogKey][i].value = this.getNumFixed(
              aveLastYearData * (editData.conditionValue / 100),
              1
            )
            this.onReCalculationRatio(
              this.tableDataObj[dialogKey][i].date,
              dialogKey,
              targetKey
            )
          }
        } else if (editData.type === '3') {
          for (let i = 0; i < this.tableDataObj[dialogKey].length; i++) {
            this.tableDataObj[dialogKey][i].value = editData.conditionValue
            this.onReCalculationRatio(
              this.tableDataObj[dialogKey][i].date,
              dialogKey,
              targetKey
            )
          }
        }
      }
    },
    /**
     * 現在年から過去1年の項目値の平均値を取得
     *
     * @param {string} key 項目key
     * @return {number} 平均値
     */
    getAveLastYearData(key) {
      const oneYearDataList = this.cashFlowReportList
        .filter((data) => data.forecastFlag === 0)
        .reverse()
        .filter((data, index) => index < 12)
      // 現在年から過去1年のデータ
      let calcNum = 0 // 割る数
      let sumNum = 0 // 合計値

      for (let i = 0; i < oneYearDataList.length; i++) {
        sumNum += oneYearDataList[i][key]
        calcNum++
      }

      const aveNum = this.getNumFixed(sumNum / calcNum, 1)

      return aveNum
    },
    /**
     * シミュレーション結果ページへ遷移する
     */
    transitionSimulationResult() {
      const cashflowSimulationData = {
        advisorVal: this.advisorVal,
        comment: this.simulationComment,
        tableData: this.getCalcCashDepositsTableData(),
      }

      // vuexにシミュレーションデータを格納
      this.setCashflowSimulationData(cashflowSimulationData)

      if (this.checkSimulationType === 2) {
        this.setAdviceReloadFlg(true)
      } else {
        this.setCashFlowAlertList([])
        // シミュレーション結果ページへ遷移する
        this.$router.push({
          path: '/cashFlowManagement/forecastReport/simulationResults/',
        })
      }
    },
    /**
     * 現預金残高を計算したテーブルデータを取得
     */
    getCalcCashDepositsTableData() {
      const newTableDataObj = JSON.parse(
        JSON.stringify(Object.assign({}, this.tableDataObj))
      )
      const cashDepositsList = this.cashFlowReportList.map(
        (data) => data.cashAndDeposits
      )

      let cashDeposits = cashDepositsList[this.cashFlowReportList.length - 7] // 現在月の現預金残高

      for (let i = 0; i < 6; i++) {
        cashDeposits += newTableDataObj.operatingCashFlow[i].value

        newTableDataObj.cashAndDeposits[i].value = cashDeposits
      }

      return newTableDataObj
    },
    /**
     * ダイアログを非表示
     */
    closeDialog() {
      // まとめて変更する項目のインデックスをセットする
      this.showEditDialogKey = ''
      // まとめて変更する項目名をセットする
      this.changeAllDialogItemTitle = ''
    },
    /**
     * アニメーション
     *
     * @param {String} refs 対象の要素
     * @param {Number} index 更新された値のインデックス
     */
    onAddAnimation(refs, index) {
      if (this.$refs[refs][index].$el) {
        this.$refs[refs][index].$el
          .querySelector('input')
          .classList.add('animate__animated', 'animate__rubberBand')
      } else {
        this.$refs[refs][index].classList.add(
          'animate__animated',
          'animate__rubberBand'
        )
      }

      setTimeout(() => {
        if (Object.keys(this.$refs[refs]).length > 0) {
          if (this.$refs[refs][index].$el) {
            this.$refs[refs][index].$el
              .querySelector('input')
              .classList.remove('animate__animated', 'animate__rubberBand')
          } else {
            this.$refs[refs][index].classList.remove(
              'animate__animated',
              'animate__rubberBand'
            )
          }
        }
      }, 1000)
    },
  },
}
</script>

<style scoped lang="scss">
.edit-mode-selection {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 170px;
  height: 40px;
  margin: 56px 0 24px 0;
  button {
    &:first-of-type {
      width: 60px;
    }
    width: 110px;
    height: 38px;
    font-weight: 500;
    cursor: pointer;
    &.active,
    &:hover {
      background: #ebeced;
    }
    &.is-disabled {
      opacity: 0.3;
      pointer-events: none;
    }
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
  }
}

.table-scroll {
  margin-top: 24px;
  table {
    width: auto;
    tr {
      background-color: #f4f4f4;
      &.compare {
        background-color: #ffffff;
        .value-master-header {
          padding-left: 32px;
        }
      }
      &.operatingIncome {
        background-color: #ebf0fd;
      }
      &.operatingCashFlow {
        background-color: #ffecc2;
      }
      &.status-danger {
        background-color: #ffd9dc;
      }
      &:not(.status-danger) {
        .icon-error {
          display: none;
        }
      }
      th {
        height: 40px;
      }
      td {
        &.value-display,
        &.edit-mode {
          height: 90px;
        }
        height: 62px;
        padding: 0 13px;
        vertical-align: middle;
        input[type='text'] {
          height: 48px;
          text-align: right;
        }
        &.ratio {
          .custom-input-text {
            width: calc(100% - 26px);
            margin-right: 8px;
            vertical-align: bottom;
            text-align: right;
            display: inline-block;
          }
        }
        &:first-of-type {
          overflow: visible;
        }
        &:not(:first-of-type) {
          text-align: right;
        }
        .icon-error {
          width: 16px;
          fill: #e60012;
          margin-left: 12px;
        }
      }
      th,
      td {
        &:nth-of-type(1) {
          width: auto;
          min-width: 300px;
          &.ratio {
            padding: 0 0 0 35px;
          }
        }
        &:not(:first-of-type) {
          min-width: 118px;
        }
      }
    }
  }
}

.simulation-comment {
  margin-top: 24px;
  p {
    margin: 0 0 12px 0;
  }
  ::v-deep .custom-input-textarea-block {
    height: 108px;
  }
}

.simulation-footer {
  margin-top: 40px;
}

.btn {
  &-manual-simulation {
    &-top {
      margin-left: auto;
      span {
        margin: 0 0 0 8px;
      }
    }
    &-bottom {
      margin: 24px auto 0;
      span {
        margin: 0 0 0 8px;
      }
    }
  }
  &-change-all {
    position: relative;
    margin-left: auto;
    height: 32px;
    width: 90px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }
}

.flex-baseline {
  align-items: baseline;
}

.icon {
  &-danger {
    width: 20px;
    height: 20px;
    margin: 20px;
  }
}

.dialog {
  &-container {
    position: relative;
    margin-left: auto;
  }
}

.text-fine {
  color: #34c759;
}
.text-alert {
  color: #ff453a;
}
</style>
