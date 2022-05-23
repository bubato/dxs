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
            <h4>企業分類を選択する</h4>
            <p>絞込条件にする企業分類を選択してください。</p>
          </div>
          <div class="modal-contents">
            <div class="modal-contents-box">
              <ul class="companyType-list">
                <li
                  v-for="(companyType, index2) in companyTypeMasterList.items"
                  :key="index2"
                >
                  <label>
                    <input
                      v-model="companyTypeCode"
                      type="radio"
                      class="input-radio"
                      :value="companyType.code"
                      name="companyType-list-detail"
                    />
                    <p class="input-radio-label">
                      {{ companyType.label }}
                    </p>
                  </label>
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
                'btn-disabled': !companyTypeCode,
              }"
              class="btn btn-basic btn-long"
              @click="updateSelectCompanyType()"
            >
              選択した企業分類で絞り込む
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
  name: 'CompanyTypeFilterModal',
  components: {},
  data() {
    return {
      selectParentCategory: [],
      companyTypeCode: null,
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'companyTypeMasterList',
      'selectSaveCondition',
    ]),
  },
  created() {
    this.setInitSelectCompanyType() // 売り上げ規模のチェックボックスの初期値設定
  },
  methods: {
    ...mapMutations('mmi/filterConditions', ['setSelectSaveCondition']),
    /**
     * 企業分類のチェックボックスの初期値設定
     */
    setInitSelectCompanyType() {
      const initSaveConditionItems = JSON.parse(
        JSON.stringify(this.selectSaveCondition.items)
      )
      this.companyTypeCode = initSaveConditionItems.companyType
    },
    /**
     * 選択した企業分類コードを保存
     */
    updateSelectCompanyType() {
      const newSelectSaveCondition = JSON.parse(
        JSON.stringify(this.selectSaveCondition)
      )
      newSelectSaveCondition.items.companyType = this.companyTypeCode
      this.setSelectSaveCondition(newSelectSaveCondition)
      this.$emit('update', newSelectSaveCondition.items) // テーブルデータを選択した条件で再取得させるために使用する
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
  width: 832px;
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
.companyType-list {
  label {
    display: flex;
    align-items: center;
  }
  &-detail {
    margin-left: 18px;
  }
  li {
    margin-right: 24px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  p {
    padding-left: 30px;
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
