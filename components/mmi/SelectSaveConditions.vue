<template>
  <div class="selectSaveConditions">
    <div class="select">
      <div
        v-on-clickaway="hideSaveConditionsList"
        class="select-conditions"
        :class="{ focus: open }"
        @click="showSaveConditionsList"
      >
        <StarOutlineSVG class="icon-starOutline" />
        <span>保存した条件</span>
        <ExpandMoreSVG v-show="!open" class="icon-arrow icon-expandMore" />
        <ExpandLessSVG v-show="open" class="icon-arrow icon-expandLess" />
      </div>
      <div v-show="open" class="option">
        <ul v-if="saveConditions && saveConditions.length">
          <li
            v-for="(item, i) in saveConditions"
            :key="i"
            class="conditions"
            @click="selectOption(item, $event.target)"
          >
            <p class="first">{{ item.createdAt }}</p>
            <div class="second">
              <span>{{ item.saveConditionName }}</span>
              <DeleteForeverSVG
                class="icon-deleteForever icon-delete"
                @click="deleteSaveConditions(item)"
              />
            </div>
          </li>
        </ul>
        <!-- TODO:MMI 条件が保存されていない場合の表示デザイン -->
        <ul v-else>
          <li>保存されている条件はありません。</li>
        </ul>
      </div>
    </div>
    <button
      class="btn btn-short btn-save"
      @click="setShowInsertSaveConditionsModalState(true)"
    >
      <StarOutlineSVG class="icon-starOutline" />保存
    </button>
    <InsertSaveConditionsModal
      v-if="showInsertSaveConditionsModalState"
      :screen-id="screenId"
      :company-info="companyInfo"
      :client-info="clientInfo"
      @close="setShowInsertSaveConditionsModalState(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'SelectSaveConditions',
  mixins: [clickaway],
  props: {
    /**
     * 表示するメニュー
     */
    options: {
      type: Array,
      default: () => [],
      required: false,
    },
    /*
     * 画面ID
     */
    screenId: {
      type: String,
      required: true,
    },
    /*
     * 会社情報
     */
    companyInfo: {
      type: [Object, null],
      default: null,
    },
    /*
     * 顧問先情報
     */
    clientInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectVal: null,
      open: false,
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'saveConditions',
      'showInsertSaveConditionsModalState',
      'selectSaveCondition',
    ]),
    selectingOption() {
      return () => {
        let resultOption = {}

        for (let i = 0; i < this.saveConditions.length; i++) {
          if (this.saveConditions[i].saveConditionId === this.selectVal) {
            resultOption = this.saveConditions[i]
            break
          }
        }

        return resultOption
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('mmi/filterConditions', [
      'setSaveConditions',
      'setSelectSaveCondition',
      'setShowInsertSaveConditionsModalState',
    ]),
    /**
     * 保存条件の取得
     *
     * @param {boolean} afterOpen true:取得後にプルダウンの展開 : false:取得後にプルダウンの非展開
     */
    getSaveConditions(afterOpen) {
      const paramData = {
        screenId: this.screenId, // 画面ID
        linkageId: this.companyInfo.linkageId, // 連携ID
        advisorLinkageId: this.clientInfo.linkageId || '', // 顧問先連携ID
        companyType: this.companyInfo.corporateType, // 法人種別
      }

      this.$common.addCallApiNum()
      this.$api
        .getSaveConditions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.setSaveConditions(resData.data.dataList)

            if (afterOpen) {
              this.open = true
            }
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
     * 保存条件の削除
     *
     * @param {object} saveConditions 削除対象の条件
     */
    deleteSaveConditions(saveConditions) {
      const paramData = {
        saveConditionId: saveConditions.saveConditionId,
        recordVersion: saveConditions.recordVersion,
      }

      this.$common.addCallApiNum()
      this.$api
        .deleteSaveConditions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getSaveConditions() // 保存条件の取得
            this.$common.showCompletePopAlert(
              'ActionMsg_Gen03',
              saveConditions.saveConditionName
            )
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
     * 選択した保存条件を呼び出し元に返す
     *
     * @param {object} saveConditions 選択した保存条件
     * @param {object} target クリックターゲット
     */
    selectOption(saveConditions, target) {
      // deleteアイコン選択時はreturn
      if (target.nodeName === 'svg') {
        return
      }

      this.selectVal = saveConditions.saveConditionId

      this.setSelectSaveCondition({
        id: saveConditions.saveConditionId,
        items: saveConditions.saveConditions,
      })

      this.$emit('update')
    },
    /**
     * 保存条件一覧のプルダウンの表示
     */
    showSaveConditionsList() {
      this.getSaveConditions(true) // 保存条件の取得
    },
    /**
     * 保存条件一覧のプルダウンの非表示
     */
    hideSaveConditionsList() {
      this.open = false
    },
  },
}
</script>

<style lang="scss" scoped>
.selectSaveConditions {
  display: flex;
  align-items: center;
  .select {
    position: relative;
    .select-conditions {
      padding-left: 12px;
      display: flex;
      align-items: center;
      position: relative;
      min-width: 138px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      color: #1e1e1e;
      font-size: 13px;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      cursor: pointer;
      span {
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .option {
      position: absolute;
      right: 0;
      min-width: 395px;
      font-size: 13px;
      background: #f7f8f9;
      z-index: 9999;
      ul {
        width: 100%;
        position: absolute;
        right: 0;
        max-width: 380px;
        min-width: 140px;
        padding: 0px;
        box-shadow: 0px 1px 5px #d6d6d6;
        border-radius: 6px;
        background-color: #ffffff;
        z-index: 9999;
      }
      li {
        color: #1e1e1e;
        padding: 24px 24px 16px 24px;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;
        &:hover {
          background-color: #f8f9fa;
        }
        // &:not(:last-of-type) {
        //   margin: 0 0 5px 0;
        // }
        .first {
          color: #8a8a8e;
          margin-bottom: 8px;
        }
        .second {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .icon-delete {
            margin-left: 24px;
            fill: #3a435c;
            &:hover {
              fill: #90a0d0;
            }
          }
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .focus {
      box-shadow: 0px 0px 3px 1px #007aff;
      border: 1px solid #007aff;
    }
  }

  .icon {
    &-arrow {
      position: absolute;
      top: 7px;
      right: 0px;
      width: 16px;
      height: 16px;
      pointer-events: none;
    }
    &-starOutline {
      width: 16px;
      height: 24px;
      margin-right: 4px;
    }
  }
  .btn-save {
    width: 66px;
    font-size: 13px;
    padding: 0 4px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    margin-left: 8px;
    overflow: initial;
  }
}
</style>
