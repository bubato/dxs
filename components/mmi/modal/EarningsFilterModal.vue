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
            <h4>売上規模を選択する</h4>
            <p>絞込条件にする売上規模を選択してください。</p>
          </div>
          <div class="modal-contents">
            <div class="modal-contents-box">
              <ul class="salesScale-list">
                <li
                  v-for="(item, index1) in salesScaleMasterList"
                  :key="index1"
                >
                  <label class="salesScale-list-groupName">
                    <input
                      v-model="selectParentCategory"
                      type="radio"
                      :value="item.salesScaleGroup"
                      :checked="true"
                      class="input-radio"
                      name="salesScale-list-groupName"
                      @click="
                        checkSelectSalesScaleCodes(item, $event.target.checked)
                      "
                    />
                    <h5 class="input-radio-label">
                      {{ item.salesScaleGroup }}
                    </h5>
                  </label>
                  <ul
                    v-if="
                      item.items.length > 0 &&
                      item.salesScaleGroup !== salesScaleGroupTitle.all &&
                      item.salesScaleGroup !== salesScaleGroupTitle.free
                    "
                    class="salesScale-list-detail"
                  >
                    <li
                      v-for="(salesScale, index2) in item.items"
                      :key="index2"
                    >
                      <label>
                        <input
                          v-model="selectSalesScaleCode"
                          type="radio"
                          class="input-radio"
                          :value="salesScale.code"
                          name="salesScale-list-detail"
                          @click="selectParentCategory = item.salesScaleGroup"
                        />
                        <p class="input-radio-label">
                          {{ salesScale.label }}
                        </p>
                      </label>
                    </li>
                  </ul>
                  <div
                    v-if="item.salesScaleGroup === salesScaleGroupTitle.free"
                    class="salesScale-list-inputTxtWrap"
                  >
                    <CustomInputText
                      v-model="salesScaleLower"
                      placeholder=""
                      maxlength="15"
                      class="salesScale-list-inputTxt"
                      :value="salesScaleLower"
                      :validation="getValidation('salesScaleLower')"
                      :is-disabled="
                        selectParentCategory !== salesScaleGroupTitle.free
                      "
                    />
                    ～
                    <CustomInputText
                      v-model="salesScaleUpper"
                      placeholder=""
                      maxlength="15"
                      class="salesScale-list-inputTxt"
                      :value="salesScaleUpper"
                      :validation="getValidation('salesScaleUpper')"
                      :is-disabled="
                        selectParentCategory !== salesScaleGroupTitle.free
                      "
                    />
                  </div>
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
              class="btn btn-basic btn-long"
              :class="{ 'btn-disabled': checkBtnDisabled() }"
              @click="updateSelectSalesScale()"
            >
              選択した売上規模で絞り込む
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
  name: 'EarningsFilterModal',
  components: {},
  data() {
    return {
      selectParentCategory: '',
      salesScaleLower: '0',
      salesScaleUpper: '0',
      selectSalesScaleCode: null,
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'salesScaleMasterList',
      'selectSaveCondition',
    ]),
    /**
     * 売り上げ規模選択値グループ名
     *
     * @return {String}
     */
    salesScaleGroupTitle() {
      return {
        all: this.salesScaleMasterList[0].salesScaleGroup,
        free: this.salesScaleMasterList[1].salesScaleGroup,
        select: this.salesScaleMasterList[2].salesScaleGroup,
      }
    },
    /**
     * 自由に入力バリデーション
     *
     * @return [{String,{String,String}}]
     */
    formItems() {
      const validationData = [
        {
          type: 'required',
          message: this.$common.getMasterMessage('ErrorMsg_Required01'),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.halfNumber,
          message: this.$common.getMasterMessage('ErrorMsg_Format03'),
        },
        {
          type: 'maxlength',
          maxlength: 15,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 15,
          }),
        },
        {
          type: 'boolean',
          bool: Number(this.salesScaleLower) <= Number(this.salesScaleUpper),
          message: this.$common.getMasterMessage('ErrorMsg_Amount01'),
        },
      ]
      return [
        {
          id: 'salesScaleLower',
          validation: validationData,
        },
        {
          id: 'salesScaleUpper',
          validation: validationData,
        },
      ]
    },
    /**
     * 選択した売上規模で絞り込むボタン非活性チェック処理
     *
     * @return {boolean} true:非活性 false:活性
     */
    checkBtnDisabled() {
      return () => {
        if (
          this.selectParentCategory === this.salesScaleGroupTitle.all ||
          (this.selectParentCategory === this.salesScaleGroupTitle.select &&
            this.selectSalesScaleCode !== '')
        ) {
          return false
        } else if (
          this.selectParentCategory === this.salesScaleGroupTitle.free
        ) {
          let result = false

          const validationItems = {
            salesScaleLower: this.salesScaleLower,
            salesScaleUpper: this.salesScaleUpper,
          }

          for (const key in validationItems) {
            if (
              this.$common.checkExistValidation(
                this.formItems,
                key,
                validationItems[key]
              )
            ) {
              result = true
              break
            }
          }

          return result
        } else {
          return true
        }
      }
    },
  },
  created() {
    this.setInitSelectSalesScale() // 売り上げ規模のチェックボックスの初期値設定
  },
  methods: {
    ...mapMutations('mmi/filterConditions', ['setSelectSaveCondition']),
    /**
     * バリデーションの取得
     *
     * @param string key キー値
     */
    getValidation(key) {
      return this.formItems.find((data) => data.id === key).validation
    },
    /**
     * 売り上げ規模のチェックボックスの初期値設定
     */
    setInitSelectSalesScale() {
      const initSaveConditionItems = JSON.parse(
        JSON.stringify(this.selectSaveCondition.items)
      )
      this.selectSalesScaleCode = initSaveConditionItems.salesScaleCode
      this.salesScaleLower =
        initSaveConditionItems.salesScaleLower === null
          ? ''
          : String(initSaveConditionItems.salesScaleLower)
      this.salesScaleUpper =
        initSaveConditionItems.salesScaleUpper === null
          ? ''
          : String(initSaveConditionItems.salesScaleUpper)

      for (const index in this.salesScaleMasterList) {
        const salesScaleMasterData = this.salesScaleMasterList[index]
        if (
          salesScaleMasterData.items.some(
            (data) => data.code === this.selectSalesScaleCode
          )
        ) {
          this.selectParentCategory = salesScaleMasterData.salesScaleGroup
        }
      }
    },
    /**
     * 詳細項目（500万円未満など）のチェックボックス制御
     *
     * @param {string,string} item 売り上げ規模選択グループ
     * @param {boolean} checked チェックボックスの選択状態
     */
    checkSelectSalesScaleCodes(item, checked) {
      if (
        (item.salesScaleGroup === this.salesScaleGroupTitle.all && checked) ||
        (item.salesScaleGroup === this.salesScaleGroupTitle.free && checked)
      ) {
        this.selectSalesScaleCode = item.items.map((obj) => obj.code).join('')
      } else {
        this.selectSalesScaleCode = ''
      }
    },
    /**
     * 選択した売り上げ規模コードを保存
     */
    updateSelectSalesScale() {
      const newSelectSaveCondition = JSON.parse(
        JSON.stringify(this.selectSaveCondition)
      )
      newSelectSaveCondition.items.salesScaleCode = this.selectSalesScaleCode
      newSelectSaveCondition.items.salesScaleLower = Number(
        this.salesScaleLower
      )
      newSelectSaveCondition.items.salesScaleUpper = Number(
        this.salesScaleUpper
      )

      this.setSelectSaveCondition(newSelectSaveCondition)

      this.$emit('update', newSelectSaveCondition.items) // テーブルデータを選択した条件で再取得させる
      this.$emit('close')
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
.salesScale-list {
  label {
    display: flex;
    align-items: center;
  }
  h5 {
    padding-left: 36px;
    display: flex;
    align-items: center;
  }
  &-inputTxtWrap {
    .salesScale-list-inputTxt:not(:first-child):not(:last-child) {
      margin: 0 16px;
    }
    .salesScale-list-inputTxt:first-child {
      margin-right: 16px;
    }
    .salesScale-list-inputTxt:last-child {
      margin-left: 16px;
    }
  }
  &-inputTxt {
    width: 266px;
    display: inline-block;
  }
  &-groupName {
    height: 57px;
    display: flex;
    align-items: center;
  }
  &-detail {
    margin-left: 18px;
  }
  li {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  p {
    padding-left: 32px;
  }
}

// ラジオボタン
.input-radio {
  display: none;
  & + .input-radio-label {
    cursor: pointer;
    display: inline-block;
    position: relative;
  }

  & + .input-radio-label::before {
    -webkit-transform: translateY(-50%);
    background: #f7f8f9;
    border: 1px solid #d3d3d3;
    border-radius: 50%;
    content: '';
    display: block;
    height: 18px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
  }

  &:checked + .input-radio-label::before {
    -webkit-transform: translateY(-50%);
    background: #fff;
    border: 5px solid #007aff;
    border-radius: 50%;
    content: '';
    display: block;
    height: 18px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
  }
}
</style>
