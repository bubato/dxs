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
            <h4>所在地を選択する</h4>
            <p>絞込条件にする所在地を選択してください。</p>
          </div>
          <div class="modal-contents">
            <div class="modal-contents-box">
              <ul class="prefecture-list">
                <li>
                  <label class="prefecture-list-groupName is-all">
                    <input
                      ref="allPrefectureCheck"
                      v-model="selectParentCategory"
                      type="checkbox"
                      class="input-checkbox"
                      value="all"
                      @click="selectAllPrefecture($event.target.checked)"
                    />
                    <h5>すべての都道府県</h5>
                  </label>
                </li>
                <li
                  v-for="(item, index1) in prefectureMasterList"
                  :key="index1"
                >
                  <label class="prefecture-list-groupName">
                    <input
                      v-model="selectParentCategory"
                      type="checkbox"
                      :value="item.locationGroup"
                      class="input-checkbox"
                      @change="
                        selectMiddlePrefecture(
                          item.items,
                          $event.target.checked
                        )
                      "
                    />
                    <h5>
                      {{ item.locationGroup }}
                    </h5>
                  </label>
                  <ul
                    v-if="
                      item.items.length > 0 && item.locationGroup !== '北海道'
                    "
                    class="prefecture-list-detail"
                  >
                    <li
                      v-for="(prefecture, index2) in item.items"
                      :key="index2"
                    >
                      <label>
                        <input
                          v-model="selectPrefectureCode"
                          type="checkbox"
                          class="input-checkbox"
                          :value="prefecture.code"
                          @click="
                            selectSmallPrefecture(
                              item,
                              prefecture.code,
                              $event.target.checked
                            )
                          "
                        />
                        <p>
                          {{ prefecture.label }}
                        </p>
                      </label>
                    </li>
                  </ul>
                </li>
              </ul>
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
                'btn-disabled': selectPrefectureCode.length <= 0,
              }"
              class="btn btn-basic btn-long"
              @click="updateSelectPrefecture()"
            >
              選択した所在地で絞り込む
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
  name: 'LocationFilterModal',
  components: {},
  data() {
    return {
      selectParentCategory: [],
      selectPrefectureCode: [],
      masterLocationGroupList: [],
      ALL_CHECK_KEY_LABEL: 'all', // すべての都道府県チェック時にselectParentCategoryに登録するラベル
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'prefectureMasterList',
      'selectSaveCondition',
    ]),
  },
  created() {
    this.setMasterMiddlePrefectureList() // マスターデータから 所在地グループ(東北・北関東など)のリスト設定
  },
  mounted() {
    this.setInitSelectPrefecture() // 所在地のチェックボックスの初期値設定
  },
  methods: {
    ...mapMutations('mmi/filterConditions', ['setSelectSaveCondition']),
    /**
     * マスターデータから 所在地グループ(東北・北関東など)のリスト設定
     */
    setMasterMiddlePrefectureList() {
      for (let i = 0; i < this.prefectureMasterList.length; i++) {
        this.masterLocationGroupList.push(
          this.prefectureMasterList[i].locationGroup
        )
      }
    },
    /**
     *  所在地グループ(東北・北関東など)・所在地が全てチェック済みであれば、すべての業種をチェック
     *
     * @param {string[]} selectParentCategory 選択中の親業種
     */
    addAllCheck() {
      const diffSelectMiddlePrefectureList = this.$common.getDeleteStrArrayMerge(
        this.masterLocationGroupList,
        this.selectParentCategory
      )
      if (diffSelectMiddlePrefectureList.length === 0) {
        if (!this.selectParentCategory.includes(this.ALL_CHECK_KEY_LABEL)) {
          this.selectParentCategory.push(this.ALL_CHECK_KEY_LABEL)
        }
      }
    },
    /**
     *  所在地グループ(東北・北関東など)に紐づく所在地リストの取得
     *
     * @param {object} middlePrefecture  所在地グループ(東北・北関東など)
     * @return {string[]}  所在地グループ(東北・北関東など)に紐づく所在地リスト
     */
    getSmallPrefectureItems(middlePrefecture) {
      const smallPrefectureItems = []

      for (let i = 0; i < middlePrefecture.items.length; i++) {
        smallPrefectureItems.push(middlePrefecture.items[i].code)
      }

      return smallPrefectureItems
    },

    /**
     * 所在地のチェックボックスの初期値設定
     */
    setInitSelectPrefecture() {
      const initSaveConditionItems = JSON.parse(
        JSON.stringify(this.selectSaveCondition.items)
      )
      this.selectParentCategory = initSaveConditionItems.prefectureCategory
      this.selectPrefectureCode = initSaveConditionItems.prefectureCodes
    },
    /**
     * すべての都道府県のチェックボックスを選択
     *
     * @param {boolean} checked チェックボックスの選択状態
     */
    selectAllPrefecture(checked) {
      this.checkMiddlePrefecture(checked) // 所在地グループ(東北・北関東など)のチェック制御
      for (let j = 0; j < this.prefectureMasterList.length; j++) {
        this.checkSelectPrefectureCodes(
          this.prefectureMasterList[j].items,
          checked
        )
      }
      if (!checked) {
        this.removeAllCheckCategory() // 「すべての所在地」のチェックを外す
      }
    },
    /**
     * 所在地グループ(東北・北関東など)のチェックボックスを選択
     *
     * @param {object} middlePrefecture 所在地グループ(東北・北関東など)
     * @param {boolean} checked チェックボックスの選択状態
     */
    selectMiddlePrefecture(middlePrefecture, checked) {
      if (!checked) {
        this.removeAllCheckCategory() // 「すべての都道府県」のチェックを外す
      }

      this.addAllCheck()

      this.checkSelectPrefectureCodes(middlePrefecture, checked)
    },
    /**
     * 所在地グループ(東北・北関東など)のチェック制御
     *
     * @param {boolean} checked チェックボックスの選択状態
     */
    checkMiddlePrefecture(checked) {
      if (checked) {
        this.selectParentCategory = new Array(this.ALL_CHECK_KEY_LABEL)
        for (let i = 0; i < this.prefectureMasterList.length; i++) {
          this.selectParentCategory.push(
            this.prefectureMasterList[i].locationGroup
          )
        }
      } else {
        this.selectParentCategory = []
      }
    },
    /**
     * 所在地グループ(東北・北関東など)のチェックボックス制御
     *
     * @param {string} prefectureItems 所在地グループ
     * @param {boolean} checked チェックボックスの選択状態
     */
    checkSelectPrefectureCodes(prefectureItems, checked) {
      const targetCodes = []

      for (let i = 0; i < prefectureItems.length; i++) {
        targetCodes.push(prefectureItems[i].code)
      }

      if (checked) {
        this.selectPrefectureCode = this.$common.getUniqueStrArrayMerge(
          this.selectPrefectureCode,
          targetCodes
        )
      } else {
        this.selectPrefectureCode = this.$common.getDeleteStrArrayMerge(
          this.selectPrefectureCode,
          targetCodes
        )
      }
    },
    /**
     * 選択した所在地コードを保存
     */
    updateSelectPrefecture() {
      const newSelectSaveCondition = JSON.parse(
        JSON.stringify(this.selectSaveCondition)
      )
      newSelectSaveCondition.items.prefectureCodes = this.selectPrefectureCode
      newSelectSaveCondition.items.prefectureCategory = this.selectParentCategory

      this.setSelectSaveCondition(newSelectSaveCondition)

      this.$emit('update', newSelectSaveCondition.items) // テーブルデータを選択した条件で再取得させるために使用する想定
      this.$emit('close')
    },
    /**
     * 所在地を選択処理
     *
     * @param {object} selectMiddlePrefecture  所在地グループ(東北・北関東など)
     * @param {string} PrefectureCode 業種コード
     * @param {boolean} checked 押下されたチェックボックスの選択状態
     */
    selectSmallPrefecture(selectMiddlePrefecture, prefectureCode, checked) {
      if (checked) {
        // 所在地チェック済みの配列を取得
        const smallPrefectureItems = this.getSmallPrefectureItems(
          selectMiddlePrefecture
        )

        // 所在地すべての項目を取得
        const selectCurrentPrefectureCode = this.selectPrefectureCode
        selectCurrentPrefectureCode.push(prefectureCode)

        // すべての項目 - checkedの個数
        const diffSelectSmallPrefectureList = this.$common.getDeleteStrArrayMerge(
          smallPrefectureItems,
          selectCurrentPrefectureCode
        )

        // checkedとすべての項目の個数が同じかどうか。同じ場合は 所在地グループ(東北・北関東など)をチェック
        if (diffSelectSmallPrefectureList.length === 0) {
          if (
            !this.selectParentCategory.includes(
              selectMiddlePrefecture.locationGroup
            )
          ) {
            this.selectParentCategory.push(selectMiddlePrefecture.locationGroup)
            this.addAllCheck()
          }
        }
      } else {
        this.removeParentCheck(selectMiddlePrefecture)
      }
    },
    /**
     * 「すべての所在地」のチェックを外す
     */
    removeAllCheckCategory() {
      const allIndex = this.selectParentCategory.indexOf(
        this.ALL_CHECK_KEY_LABEL
      )

      if (allIndex >= 0) {
        this.selectParentCategory.splice(allIndex, 1)
      }
    },
    /**
     * 所在地を非選択時、 所在地グループ(東北・北関東など)を非選択にする
     *
     * @param {object} selectMiddlePrefecture  所在地グループ(東北・北関東など)
     */
    removeParentCheck(selectMiddlePrefecture) {
      this.removeAllCheckCategory() // 「すべての業種」のチェックを外す

      //  所在地グループ(東北・北関東など)のチェックを外す
      const targetMiddleIndex = this.selectParentCategory.indexOf(
        selectMiddlePrefecture.locationGroup
      )
      if (targetMiddleIndex >= 0) {
        this.selectParentCategory.splice(targetMiddleIndex, 1)
      }
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
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;
  position: static !important;
  transform: translate(0);

  .modal-title {
    text-align: center;
    margin-bottom: 32px;
    p {
      margin-top: 8px;
    }
  }
  .buttons {
    margin-top: 20px;
  }
}
.modal-contents-box {
  max-height: calc(100vh - 306px);
  overflow: scroll;
}
.prefecture-list {
  label {
    display: flex;
    align-items: center;
  }
  h5 {
    padding-left: 36px;
    display: flex;
    align-items: center;
  }
  &-groupName {
    height: 57px;
    display: flex;
    align-items: center;
    &.is-all {
      border-bottom: #e5e5e5 1px solid;
      padding-bottom: 32px;
      margin-bottom: 16px;
    }
  }
  &-detail {
    display: flex;
    flex-wrap: wrap;
    margin-left: 18px;
  }
  li {
    margin-right: 24px;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  p {
    padding-left: 32px;
  }
}
</style>
