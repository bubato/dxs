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
          <div class="modal-title">
            <h4>業種を選択する</h4>
            <p>絞込条件にする業種を選択してください。</p>
          </div>
          <div class="modal-contents">
            <div class="all-industry">
              <label>
                <input
                  ref="allIndustryCheck"
                  v-model="selectParentCategory"
                  type="checkbox"
                  value="すべての業種"
                  class="input-checkbox"
                  @click="selectAllIndustry($event.target.checked)"
                />
                <h5>すべての業種</h5>
              </label>
            </div>
            <div class="main">
              <div class="left-pane">
                <ul class="large-industry-list">
                  <li
                    v-for="(item, index) in industryMasterList"
                    :key="index"
                    :class="{
                      'is-active': item.classCode === selectLargeIndustryCode,
                    }"
                    @click="setSelectLargeIndustry(item.classCode)"
                  >
                    <span
                      v-for="(name, i) in getDividedIndustryNameLists(
                        item.industry
                      )"
                      :key="i"
                      class="name-block name-block-root"
                    >
                      <template v-if="name.length > 1">
                        <span
                          v-for="(n, j) in name"
                          :key="j"
                          class="name-block"
                          >{{ n }}</span
                        >
                      </template>
                      <template v-else>{{ name[0] }}</template>
                    </span>
                  </li>
                </ul>
              </div>
              <div class="right-pane">
                <ul class="middle-industry-list">
                  <li
                    v-for="(item, index1) in getSelectLargeIndustry()"
                    :key="index1"
                  >
                    <label>
                      <input
                        v-model="selectParentCategory"
                        type="checkbox"
                        class="input-checkbox"
                        :value="item.industry"
                        @click="
                          selectMiddleIndustry(item, $event.target.checked)
                        "
                      />
                      <h5>
                        <span
                          v-for="(name, i) in getDividedIndustryNameLists(
                            item.industry
                          )"
                          :key="i"
                          class="name-block name-block-root"
                        >
                          <template v-if="name.length > 1">
                            <span
                              v-for="(n, j) in name"
                              :key="j"
                              class="name-block"
                              >{{ n }}</span
                            >
                          </template>
                          <template v-else>{{ name[0] }}</template>
                        </span>
                      </h5>
                    </label>
                    <ul
                      v-if="item.items.length > 0"
                      class="small-industry-list"
                    >
                      <li
                        v-for="(industry, index2) in item.items"
                        :key="index2"
                      >
                        <label>
                          <input
                            v-model="selectIndustryCode"
                            type="checkbox"
                            class="input-checkbox"
                            :value="industry.compareCode"
                            @click="
                              selectSmallIndustry(
                                item,
                                industry.compareCode,
                                $event.target.checked
                              )
                            "
                          />
                          <p>{{ industry.label }}</p>
                        </label>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-long"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button
              :class="{
                'btn-disabled': selectIndustryCode.length <= 0,
              }"
              class="btn btn-basic btn-long"
              @click="updateSelectIndustry()"
            >
              選択した業種で絞り込む
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
  name: 'CategoryFilterModal',
  components: {},
  data() {
    return {
      masterMiddleIndustryList: [],
      selectLargeIndustryCode: 1,
      selectParentCategory: [],
      selectIndustryCode: [],
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'industryMasterList',
      'selectSaveCondition',
    ]),
    /**
     * 選択した業種データ(中分類)の取得
     *
     * @return {object[]} 選択した業種データ(中分類)の取得
     */
    getSelectLargeIndustry() {
      return () => {
        const largeIndustryList = this.industryMasterList.find(
          (data) => data.classCode === this.selectLargeIndustryCode
        )
        const middleIndustryList = largeIndustryList
          ? largeIndustryList.industryChild
          : []

        return middleIndustryList
      }
    },
  },
  created() {
    this.setMasterMiddleIndustryList() // マスターデータから業種(中分類)のリスト設定
  },
  mounted() {
    this.setInitSelectIndustry() // 業種のチェックボックスの初期値設定
  },
  methods: {
    ...mapMutations('mmi/filterConditions', ['setSelectSaveCondition']),
    /**
     * マスターデータから業種(中分類)のリスト設定
     */
    setMasterMiddleIndustryList() {
      for (let i = 0; i < this.industryMasterList.length; i++) {
        for (
          let j = 0;
          j < this.industryMasterList[i].industryChild.length;
          j++
        ) {
          this.masterMiddleIndustryList.push(
            this.industryMasterList[i].industryChild[j].industry
          )
        }
      }
    },
    /**
     * 業種のチェックボックスの初期値設定
     */
    setInitSelectIndustry() {
      const initSaveConditionItems = JSON.parse(
        JSON.stringify(this.selectSaveCondition.items)
      )
      this.selectParentCategory = initSaveConditionItems.industryCategory
      this.selectIndustryCode = initSaveConditionItems.industryCodes
    },
    /**
     * 業種(大分類)を選択
     *
     * @param {number} classCode 業種(大分類)のkey
     */
    setSelectLargeIndustry(classCode) {
      this.selectLargeIndustryCode = classCode
    },
    /**
     * 全業種のチェックボックスを選択
     *
     * @param {boolean} checked チェックボックスの選択状態
     */
    selectAllIndustry(checked) {
      this.checkMiddleIndustry(checked) // 業種(中分類)のチェック制御

      // 業種(小分類)のチェック制御
      for (let i = 0; i < this.industryMasterList.length; i++) {
        const middleIndustryList = this.industryMasterList[i].industryChild
        const filterMiddleIndustryList = middleIndustryList.filter(
          (data) => data.industryType !== 'all'
        )

        for (let j = 0; j < filterMiddleIndustryList.length; j++) {
          this.checkSelectIndustryCodes(filterMiddleIndustryList[j], checked)
        }
      }
    },
    /**
     * 業種(中分類)のチェック制御
     *
     * @param {boolean} checked チェックボックスの選択状態
     */
    checkMiddleIndustry(checked) {
      if (checked) {
        this.selectParentCategory = ['すべての業種']
        for (let i = 0; i < this.masterMiddleIndustryList.length; i++) {
          this.selectParentCategory.push(this.masterMiddleIndustryList[i])
        }
      } else {
        this.selectParentCategory = []
      }
    },
    /**
     * 業種(中分類)のチェックボックスを選択
     *
     * @param {object} middleIndustry 業種データ(中分類)
     * @param {boolean} checked チェックボックスの選択状態
     */
    selectMiddleIndustry(middleIndustry, checked) {
      const type = middleIndustry.industryType

      if (!checked) {
        this.removeAllCheckCategory() // 「すべての業種」のチェックを外す
      }

      if (type === 'all') {
        const filterMiddleIndustryList = this.getSelectLargeIndustry().filter(
          (data) => data.industryType !== 'all'
        )

        for (let i = 0; i < filterMiddleIndustryList.length; i++) {
          if (checked) {
            if (
              !this.selectParentCategory.includes(
                filterMiddleIndustryList[i].industry
              )
            ) {
              this.selectParentCategory.push(
                filterMiddleIndustryList[i].industry
              )
            }
          } else {
            const targetIndex = this.selectParentCategory.indexOf(
              filterMiddleIndustryList[i].industry
            )
            if (targetIndex >= 0) {
              this.selectParentCategory.splice(targetIndex, 1)
            }
          }

          this.checkSelectIndustryCodes(filterMiddleIndustryList[i], checked)

          const selectCurrentParentCategory = JSON.parse(
            JSON.stringify(this.selectParentCategory)
          )
          selectCurrentParentCategory.push(middleIndustry.industry)
          this.addAllParentCheck(selectCurrentParentCategory)
        }
      } else {
        this.checkSelectIndustryCodes(middleIndustry, checked)

        if (checked) {
          const selectCurrentParentCategory = JSON.parse(
            JSON.stringify(this.selectParentCategory)
          )

          selectCurrentParentCategory.push(middleIndustry.industry)
          this.addAllParentCheck(selectCurrentParentCategory)
        } else {
          // 業種(中分類:all)のチェックを外す
          const middleAllIndustry = this.getSelectLargeIndustry().find(
            (data) => data.industryType === 'all'
          )
          const targetParentCategoryIndex = this.selectParentCategory.indexOf(
            middleAllIndustry.industry
          )
          if (targetParentCategoryIndex >= 0) {
            this.selectParentCategory.splice(targetParentCategoryIndex, 1)
          }
        }
      }
    },
    /**
     * 業種(中分類・小分類が全てチェック済みであれば、すべての業種をチェック
     *
     * @param {string[]} selectParentCategory 選択中の親業種
     */
    addAllCheck(selectParentCategory) {
      const diffSelectMiddleIndustryList = this.$common.getDeleteStrArrayMerge(
        this.masterMiddleIndustryList,
        selectParentCategory
      )

      if (diffSelectMiddleIndustryList.length === 0) {
        if (!selectParentCategory.includes('すべての業種')) {
          this.selectParentCategory.push('すべての業種')
        }
      }
    },
    /**
     * 業種(中分類)項目が全てチェック済みであれば、業種(中分類:type=all)をチェック
     *
     * @param {string[]} selectParentCategory 選択中の親業種
     */
    addAllParentCheck(selectParentCategory) {
      const selectLargeIndustry = this.getSelectLargeIndustry()
      const middleIndustryList = []
      let middleIndustryAllType = {}

      for (let i = 0; i < selectLargeIndustry.length; i++) {
        if (selectLargeIndustry[i].industryType === 'all') {
          middleIndustryAllType = selectLargeIndustry[i]
        } else {
          middleIndustryList.push(selectLargeIndustry[i].industry)
        }
      }

      const diffSelectMiddleIndustryList = this.$common.getDeleteStrArrayMerge(
        middleIndustryList,
        selectParentCategory
      )

      if (diffSelectMiddleIndustryList.length === 0) {
        if (!selectParentCategory.includes(middleIndustryAllType.industry)) {
          this.selectParentCategory.push(middleIndustryAllType.industry)
          selectParentCategory.push(middleIndustryAllType.industry)
        }
        this.addAllCheck(selectParentCategory)
      }
    },
    /**
     * 業種(中分類)に紐づく業種(小分類)のチェックボックス制御
     *
     * @param {object} middleIndustry 業種(中分類)
     * @param {boolean} checked チェックボックスの選択状態
     */
    checkSelectIndustryCodes(middleIndustry, checked) {
      const smallIndustryItems = this.getSmallIndustryItems(middleIndustry)

      if (checked) {
        this.selectIndustryCode = this.$common.getUniqueStrArrayMerge(
          this.selectIndustryCode,
          smallIndustryItems
        )
      } else {
        this.selectIndustryCode = this.$common.getDeleteStrArrayMerge(
          this.selectIndustryCode,
          smallIndustryItems
        )
      }
    },
    /**
     * 業種(中分類)に紐づく業種(小分類)リストの取得
     *
     * @param {object} middleIndustry 業種(中分類)
     * @return {string[]} 業種(中分類)に紐づく業種(小分類)リスト
     */
    getSmallIndustryItems(middleIndustry) {
      const smallIndustryItems = []

      for (let i = 0; i < middleIndustry.items.length; i++) {
        smallIndustryItems.push(middleIndustry.items[i].compareCode)
      }

      return smallIndustryItems
    },
    /**
     * 選択した業種コードを保存
     */
    updateSelectIndustry() {
      const newSelectSaveCondition = JSON.parse(
        JSON.stringify(this.selectSaveCondition)
      )

      newSelectSaveCondition.items.industryCodes = this.getSortSelectIndustryCode() // 業種(小分類)をコード値の昇順でソートした配列を取得
      newSelectSaveCondition.items.industryCategory = this.getSortSelectParentCategory() // 業種(大・中分類)を昇順でソートした配列を取得

      this.setSelectSaveCondition(newSelectSaveCondition)

      this.$emit('update', newSelectSaveCondition.items) // テーブルデータを選択した条件で再取得させるために使用する想定
      this.$emit('close')
    },
    /**
     * 業種(小分類)をコード値の昇順でソートした配列を取得
     *
     * @return {string[]} 業種(小分類)をコード値の昇順でソートした配列
     */
    getSortSelectIndustryCode() {
      const sortSelectIndustryCode = this.selectIndustryCode.sort((a, b) => {
        if (a > b) {
          return 1
        } else {
          return -1
        }
      })

      return sortSelectIndustryCode
    },
    /**
     * 業種(大・中分類)を昇順でソートした配列を取得
     *
     * @return {string[]} 業種(大・中分類)を昇順でソートした配列
     */
    getSortSelectParentCategory() {
      const sortSelectParentCategory = this.masterMiddleIndustryList.filter(
        (code) => {
          return this.selectParentCategory.includes(code)
        }
      )

      if (this.selectParentCategory.includes('すべての業種')) {
        sortSelectParentCategory.unshift('すべての業種')
      }

      return sortSelectParentCategory
    },
    /**
     * 業種(小分類)を選択処理
     *
     * @param {object} selectMiddleIndustry 業種(中分類)
     * @param {string} industryCode 業種コード
     * @param {boolean} checked 押下されたチェックボックスの選択状態
     */
    selectSmallIndustry(selectMiddleIndustry, industryCode, checked) {
      if (checked) {
        const smallIndustryItems = this.getSmallIndustryItems(
          selectMiddleIndustry
        )
        const selectCurrentIndustryCode = this.selectIndustryCode
        selectCurrentIndustryCode.push(industryCode)
        const diffSelectSmallIndustryList = this.$common.getDeleteStrArrayMerge(
          smallIndustryItems,
          selectCurrentIndustryCode
        )

        if (diffSelectSmallIndustryList.length === 0) {
          if (
            !this.selectParentCategory.includes(selectMiddleIndustry.industry)
          ) {
            this.selectParentCategory.push(selectMiddleIndustry.industry)
            this.addAllParentCheck(this.selectParentCategory)
          }
        }
      } else {
        this.removeParentCheck(selectMiddleIndustry)
      }
    },
    /**
     * 業種(小分類)を非選択時、業種(中分類)を非選択にする
     *
     * @param {object} selectMiddleIndustry 業種(中分類)
     */
    removeParentCheck(selectMiddleIndustry) {
      const middleIndustryList = this.getSelectLargeIndustry()
      const allIndustry = middleIndustryList.find(
        (data) => data.industryType === 'all'
      )

      this.removeAllCheckCategory() // 「すべての業種」のチェックを外す

      // 業種(中分類)の親のチェックを外す
      if (allIndustry) {
        const targetAllMiddleIndex = this.selectParentCategory.indexOf(
          allIndustry.industry
        )
        if (targetAllMiddleIndex >= 0) {
          this.selectParentCategory.splice(targetAllMiddleIndex, 1)
        }
      }

      // 業種(中分類)のチェックを外す
      const targetMiddleIndex = this.selectParentCategory.indexOf(
        selectMiddleIndustry.industry
      )
      if (targetMiddleIndex >= 0) {
        this.selectParentCategory.splice(targetMiddleIndex, 1)
      }
    },
    /**
     * 「すべての業種」のチェックを外す
     */
    removeAllCheckCategory() {
      const allIndex = this.selectParentCategory.indexOf('すべての業種')

      if (allIndex >= 0) {
        this.selectParentCategory.splice(allIndex, 1)
      }
    },
    /**
     * 業種名を表示単位に分ける
     */
    getDividedIndustryNameLists(industryText) {
      const regName = /(?=[^[，,(（]+[(（].*?[）)]\s*([,，]|$)).*?[）)].*?([,，]|$)|[^，,]+([，,]|$)/g
      const matches = industryText.match(regName) || [industryText]

      return matches.map((name) => {
        return name.match(/([^（(]+)|([（(][^（）()]*[）)])[,，]?/g) || [name]
      })
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event クリックイベントオブジェクト
     * @param {string} type クローズタイプ
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

<style lang="scss" scoped>
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;
  position: static !important;
  transform: translate(0);

  .modal-title {
    text-align: center;
    p {
      margin-top: 8px;
    }
  }
  .modal-contents {
    .all-industry {
      display: flex;
      align-items: center;
      height: 73px;
      margin-top: 24px;
      border-radius: 6px;
      background: #f7f8f9;
      padding-left: 24px;
      &-check {
        font-size: 17px;
        font-weight: 500;
      }
    }

    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 32px;
      .left-pane,
      .right-pane {
        height: 340px;
        overflow: auto;
      }
      .left-pane {
        width: 305px;
        border: 1px solid #e5e5e5;
      }
      .right-pane {
        width: 407px;
      }
    }
    .large-industry-list {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 24px 24px 16px 24px;
      li {
        text-align: center;
        align-items: center;
        justify-content: center;
        width: 255px;
        min-height: 38px;
        padding: 8px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        &.is-active {
          border: 1px solid #007aff;
          box-shadow: 0px 0px 4px #007affb8;
        }
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
    .middle-industry-list {
      > li {
        padding: 32px 0;
        border-bottom: 1px solid #e5e5e5;
        &:first-child {
          padding-top: 0px;
        }
      }
      .small-industry-list {
        display: flex;
        flex-wrap: wrap;
        padding-left: 20px;
        margin-top: 16px;
        > li {
          margin-right: 20px;
          &:not(:last-child) {
            margin-bottom: 12px;
          }
        }
      }
    }
    label {
      display: flex;
      align-items: center;
      h5 {
        padding-left: 31px;
      }
      p {
        padding-left: 28px;
      }
    }
  }
  .buttons {
    margin-top: 20px;
  }
  .name-block {
    display: inline-block;
    &-root {
      margin-right: 4px;
    }
  }
}
</style>
