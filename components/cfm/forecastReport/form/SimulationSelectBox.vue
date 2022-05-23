<template>
  <div class="simulation-select-box">
    <div
      v-on-clickaway="closeSimulationList"
      class="select"
      @click="getSimulationList()"
    >
      <StarOutlineSVG class="icon-menu icon-starOutline" />
      <span>保存したシミュレーション結果</span>
      <ExpandMoreSVG
        v-show="!openSimulationDialogFlg"
        class="icon-arrow icon-expandMore"
      />
      <ExpandLessSVG
        v-show="openSimulationDialogFlg"
        class="icon-arrow icon-expandLess"
      />
    </div>
    <div v-show="openSimulationDialogFlg" class="option">
      <ul v-if="$common.checkArrayValue(simulationList)">
        <li
          v-for="list in simulationList"
          :key="list.simulationResultId"
          class="label"
          @click="transitionSelectSimulationPage(list.simulationResultId)"
        >
          <p>{{ list.simulationResultSaveDate }}</p>
          <div class="flex">
            <span>{{ list.simulationResultName }}</span>
            <DeleteForeverSVG
              class="icon-delete icon-deleteForever"
              @click.stop="showDeleteSimulationModal(list)"
            />
          </div>
        </li>
      </ul>
      <p v-else class="text-no-simulation">
        保存したシミュレーションはありません
      </p>
    </div>
    <DeleteSimulationModal
      v-if="showDeleteSimulationModalState"
      :simulation-info="selectSimulationInfo"
      @close="closeDeleteSimulationModal()"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'SimulationSelectBox',
  mixins: [clickaway],
  props: {},
  data() {
    return {
      openSimulationDialogFlg: false,
      simulationList: [],
      showDeleteSimulationModalState: false,
      selectSimulationInfo: {},
    }
  },
  computed: {
    ...mapState('cfm/cashFlowReportStore', ['advisorVal']),
    ...mapState('cfm/common', ['corporateType', 'companyMasterDataList']),
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * シミュレーション保存結果一覧を取得する
     */
    getSimulationList() {
      const params = this.getSimulationListParam()

      this.$common.addCallApiNum()
      this.$api
        .getSimulationList(params)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.simulationList = resData.data.dataList
            this.openSimulationDialogFlg = true
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
     * シミュレーション保存結果一覧のリクエストパラメータの取得
     */
    getSimulationListParam() {
      const paramData = {}

      paramData.linkageId = this.companyMasterDataList[0].linkageId

      if (this.corporateType === '20') {
        paramData.advisorLinkageId = this.advisorVal
      }

      return paramData
    },
    /**
     * シミュレーション結果削除確認モーダルの表示
     */
    showDeleteSimulationModal(simulationInfo) {
      this.showDeleteSimulationModalState = true
      this.selectSimulationInfo = simulationInfo
    },
    /**
     * シミュレーション結果削除確認モーダルの非表示
     */
    closeDeleteSimulationModal() {
      this.showDeleteSimulationModalState = false
      this.selectSimulationInfo = {}
      this.closeSimulationList()
    },
    /**
     * 選択したシミュレーションページに遷移
     */
    transitionSelectSimulationPage(simulationId) {
      this.$router.push(
        `/cashFlowManagement/forecastReport/simulationResults/${simulationId}`
      )
    },
    /**
     * シミュレーション一覧ダイアログを閉じる
     */
    closeSimulationList() {
      if (!this.showDeleteSimulationModalState) {
        this.openSimulationDialogFlg = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  min-width: 250px;
  display: flex;
  align-items: center;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  color: #1e1e1e;
  font-size: 13px;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: default;
}

.option {
  position: absolute;
  right: 0;
  min-width: 395px;
  margin: 4px 25px 0 0;
  padding: 24px;
  box-shadow: 0px 1px 5px #d6d6d6;
  border-radius: 6px;
  cursor: pointer;
  background-color: #ffffff;
  z-index: 100;
  ul {
    width: 100%;
    li {
      padding: 0 0 15px 0;
      border-bottom: 1px solid #e5e5e5;
      &:not(:first-of-type) {
        padding: 15px 0;
      }
      &:not(:last-of-type) {
        margin: 0 0 5px 0;
      }
    }
    p {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #8a8a8e;
    }
    span {
      width: 100%;
      font-size: 15px;
    }
  }
}

.focus {
  box-shadow: 0px 0px 3px 1px #007aff;
  border: 1px solid #007aff;
}

.icon {
  &-arrow {
    position: absolute;
    top: 7px;
    right: 6px;
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
  &-menu {
    &.is-hover {
      fill: #ffffff;
    }
    width: 20px;
    height: 20px;
    margin: 0 5px 0 13px;
  }
  &-delete {
    margin-left: auto;
    cursor: pointer;
  }
}

.text {
  &-no-simulation {
    text-align: center;
  }
}
</style>
