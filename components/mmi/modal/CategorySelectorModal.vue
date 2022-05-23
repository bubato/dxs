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
            <p>
              分析する業種を選択してください。最大で10件まで選択して比較できます。
            </p>
            <p v-if="selectIndustryCompareCodes.length > 10" class="error">
              11件以上の業種が選択されています。
            </p>
          </div>
          <div class="modal-contents">
            <div class="select-industry">
              <ul class="select-industry-list">
                <li
                  v-for="(code, index) in selectIndustryCompareCodes"
                  :key="index"
                >
                  <span>{{ getIndustryName(code) }}</span>
                  <CancelSVG
                    class="icon-cancel"
                    @click="unselectIndustryCompareCode(index)"
                  />
                </li>
              </ul>
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
                      v-for="(name, i) in getDividedIndustryNameList(
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
                        v-model="selectIndustryCompareCodes"
                        type="checkbox"
                        class="input-checkbox"
                        :value="item.compareCode"
                      />
                      <h5>
                        <span
                          v-for="(name, i) in getDividedIndustryNameList(
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
                            v-model="selectIndustryCompareCodes"
                            type="checkbox"
                            class="input-checkbox"
                            :value="industry.compareCode"
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
              class="btn btn-basic btn-long"
              :class="{
                'btn-disabled':
                  selectIndustryCompareCodes.length === 0 ||
                  selectIndustryCompareCodes.length > 10,
              }"
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
  name: 'CategorySelectorModal',
  components: {},
  data() {
    return {
      selectLargeIndustryCode: 1,
      selectIndustryCompareCodes: [],
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'industryMasterList',
      'industryCompareMasterKeyValue',
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
    /**
     * 業種名を取得
     *
     * @param {string} code 業種コード
     * @return {string} 業種名
     */
    getIndustryName() {
      return (code) => {
        return this.industryCompareMasterKeyValue[code]
      }
    },
  },
  created() {
    this.setInitSelectIndustry() // 業種のチェックボックスの初期値設定
  },
  methods: {
    ...mapMutations('mmi/filterConditions', ['setSelectSaveCondition']),
    /**
     * 業種のチェックボックスの初期値設定
     */
    setInitSelectIndustry() {
      const initSaveConditionItems = JSON.parse(
        JSON.stringify(this.selectSaveCondition.items)
      )

      this.selectIndustryCompareCodes =
        initSaveConditionItems.industryCompareCodes
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
      for (let i = 0; i < this.industryMasterList.length; i++) {
        const middleIndustryList = this.industryMasterList[i].industryChild
        const filterMiddleIndustryList = middleIndustryList.filter(
          (data) => data.industryType !== 'all'
        )

        for (let j = 0; j < filterMiddleIndustryList.length; j++) {
          this.checkSelectIndustryCodes(
            filterMiddleIndustryList[j].items,
            checked
          )
        }
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

      if (type === 'all') {
        const filterMiddleIndustryList = this.getSelectLargeIndustry().filter(
          (data) => data.industryType !== 'all'
        )

        for (let i = 0; i < filterMiddleIndustryList.length; i++) {
          this.checkSelectIndustryCodes(
            filterMiddleIndustryList[i].items,
            checked
          )
        }
      } else {
        this.checkSelectIndustryCodes(middleIndustry.items, checked)
      }
    },
    /**
     * 業種(小分類)のチェックボックス制御
     *
     * @param {string} industryItems 業種(小分類)
     * @param {boolean} checked チェックボックスの選択状態
     */
    checkSelectIndustryCodes(industryItems, checked) {
      const targetCodes = []

      for (let i = 0; i < industryItems.length; i++) {
        targetCodes.push(industryItems[i].code)
      }

      if (checked) {
        this.selectIndustryCompareCodes = this.$common.getUniqueStrArrayMerge(
          this.selectIndustryCompareCodes,
          targetCodes
        )
      } else {
        this.selectIndustryCompareCodes = this.$common.getDeleteStrArrayMerge(
          this.selectIndustryCompareCodes,
          targetCodes
        )
      }
    },
    /**
     * 選択した業種コードを保存
     */
    updateSelectIndustry() {
      const newSelectSaveCondition = JSON.parse(
        JSON.stringify(this.selectSaveCondition)
      )

      newSelectSaveCondition.items.industryCompareCodes = this.selectIndustryCompareCodes

      this.setSelectSaveCondition(newSelectSaveCondition)
      this.$emit('update', newSelectSaveCondition.items) // テーブルデータを選択した条件で再取得させるために使用する
      this.$emit('close')
    },
    /**
     * 選択したコードを選択対象から除外
     *
     * @param {number} index 選択対象のインデックス
     */
    unselectIndustryCompareCode(index) {
      this.selectIndustryCompareCodes.splice(index, 1)
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
    /**
     * 業種名を表示単位に分ける
     */
    getDividedIndustryNameList(industryText) {
      const regName = /(?=[^[，,(（]+[(（].*?[）)]\s*([,，]|$)).*?[）)].*?([,，]|$)|[^，,]+([，,]|$)/g
      const matches = industryText.match(regName) || [industryText]

      return matches.map((name) => {
        return name.match(/([^（(]+)|([（(][^（）()]*[）)])[,，]?/g) || [name]
      })
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
    .error {
      color: #e60012;
    }
  }
  .modal-contents {
    .select-industry {
      margin: 24px 0;
      &-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        max-height: 170px;
        overflow: auto;
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          border-radius: 4px;
          margin: 0 8px 8px 0;
          padding: 7px 10px 7px 12px;
          background-color: #d1e7ff;
          .icon-cancel {
            width: 16px;
            height: 16px;
            margin-left: 10px;
          }
        }
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
