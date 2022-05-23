<template>
  <div class="chart">
    <div class="chart-daily-report">
      <div class="chart-daily-report-select">
        <CustomInputSelect
          v-model="contrastsSelected1"
          :options="selectOptions1"
          class="chart-daily-report-select-box"
          :validation="
            $common.getFormItemsDetail(formItems, 'contrastsSelected1')
              .validation
          "
          @input="changeGraphData($event, 0, contrastsSelected1)"
        />
        <span>対</span>
        <CustomInputSelect
          v-model="contrastsSelected2"
          :options="selectOptions2"
          class="chart-daily-report-select-box"
          :validation="
            $common.getFormItemsDetail(formItems, 'contrastsSelected2')
              .validation
          "
          @input="changeGraphData($event, 1, contrastsSelected2)"
        />
      </div>
      <HighchartsVue ref="Highcharts" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'DailyChart',
  components: {},
  mixins: [clickaway],
  props: {
    aggregationData: {
      type: Object,
      default: () => {},
      required: true,
    },
    defaultView: {
      type: Object,
      default: () => {},
      required: true,
    },
    optionList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      contrastsSelected1: '',
      contrastsSelected2: '',
      selectOptions1: [],
      selectOptions2: [],
      localStorageInfo: '',
      chartOptions: {
        credits: {
          enabled: false,
        },
        chart: {
          type: 'areaspline',
        },
        title: {
          text: '',
          align: 'left',
          margin: 0,
          style: {
            color: '#1e1e1e',
            fontFamily: 'Noto Sans JP, sans-serif',
            fontSize: '20px',
          },
        },
        /**
         * 凡例
         */
        legend: {
          // 表示・非表示
          enabled: true,
          // 表示位置
          verticalAlign: 'top',
          // テキスト表示位置
          align: 'left',
          // マージントップ
          itemMarginTop: 0,
          // マージンボトム
          itemMarginBottom: 20,
          // 正円から正方形にする
          symbolRadius: 0,
          // シンボルの間隔
          symbolPadding: 5,
          // 開始位置
          x: -10,
        },
        // 表示範囲の指定
        xAxis: {
          categories: [],
        },
        yAxis: [
          {
            title: {
              text: '',
            },
            labels: {
              allowDecimals: true,
              format: '{value}',
            },
          },
          {
            title: {
              text: '',
            },
            labels: {
              allowDecimals: true,
              format: '{value}',
            },
            opposite: true,
          },
        ],
        tooltip: {
          enabled: true,
          formatter() {
            let value = ''

            switch (this.point.series.name) {
              case '直帰率':
                value = this.point.y.toFixed(2) + '%'
                break
              case '新規ユーザー数':
                value = this.point.y + '人'
                break
              default:
                value = this.point.y
                break
            }

            return (
              '<span style="font-size: 10px">' +
              this.point.series.xAxis.categories[this.point.index] +
              '</span>' +
              '<br />' +
              '<span style="fill:' +
              this.point.series.color +
              '">●</span>' +
              this.point.series.name +
              ':' +
              '<b>' +
              value +
              '</b>'
            )
          },
        },
        plotOptions: {
          series: {
            fillOpacity: 0.1,
          },
          areaspline: {
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 3,
              },
            },
            marker: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: '',
            data: [],
            color: '#4F7DF0',
            yAxis: 0,
          },
          {
            name: '',
            data: [],
            color: '#58BAF5',
            yAxis: 1,
          },
        ],
      },
      formItems: [
        {
          id: 'contrastsSelected1',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'contrastsSelected2',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    /**
     * 表示するデータの範囲を取得
     */
    getPeriod() {
      return this.aggregationData.period
    },
    /**
     * セレクトボックスで選択した項目のデータを取得する
     */
    getGraphViewData() {
      return (name) => {
        let graphViewData = []

        if (name === 'CV数') {
          name = 'CVR'
        }

        for (let i = 0; i < this.aggregationData.data.length; i++) {
          if (this.aggregationData.data[i].name === name) {
            graphViewData = this.aggregationData.data[i].value
          }
        }

        return graphViewData
      }
    },
  },
  watch: {
    aggregationData() {
      this.showDailyChartGraph()
    },
  },
  created() {
    // グラフ表示のセレクトボックスの初期値設定
    this.localStorageInfo =
      this.$route.path === '/site/dashboard/' ? 'cmsDashBoard' : 'formDashBoard'

    const localStorageData = localStorage.getItem(this.localStorageInfo)
      ? JSON.parse(localStorage.getItem(this.localStorageInfo))
      : {}
    this.contrastsSelected1 =
      localStorageData.select1 || this.defaultView.value1
    this.contrastsSelected2 =
      localStorageData.select2 || this.defaultView.value2

    this.selectOptions1 = this.filterOptionList(1)
    this.selectOptions2 = this.filterOptionList(2)

    this.showDailyChartGraph()
  },
  methods: {
    showDailyChartGraph() {
      // デフォルトの期間を設定（7日間）
      this.chartOptions.xAxis.categories = this.getPeriod

      // デフォルトのセレクトボックスの値を設定
      this.chartOptions.series[0].name = this.getOptionName(
        this.contrastsSelected1
      )
      this.chartOptions.series[1].name = this.getOptionName(
        this.contrastsSelected2
      )

      // デフォルトで描画するデータ
      this.chartOptions.series[0].data = this.getGraphViewData(
        this.chartOptions.series[0].name
      )
      this.chartOptions.series[1].data = this.getGraphViewData(
        this.chartOptions.series[1].name
      )
    },
    getOptionName(value) {
      let optionName = ''

      for (let i = 0; i < this.optionList.length; i++) {
        if (this.optionList[i].code === value) {
          optionName = this.optionList[i].label
          break
        }
      }

      return optionName
    },
    /**
     * グラフ再描画処理
     */
    changeGraphData(val, index, value) {
      const name = this.getOptionName(value)

      this.chartOptions.series[index].name = name
      this.chartOptions.series[index].data = this.getGraphViewData(name)

      this.setLocalStorageSelectData(index, value) // ローカルストレージに選択した値を保持

      // 直帰率の場合は、y軸の単位を%にする
      for (let i = 0; i < this.chartOptions.yAxis.length; i++) {
        if (i === index) {
          if (name === '直帰率') {
            this.chartOptions.yAxis[i].labels.format = '{value}%'
          } else {
            this.chartOptions.yAxis[i].labels.format = '{value}'
          }
        }
      }

      if (index === 0) {
        this.selectOptions2 = this.filterOptionList(2)
      } else {
        this.selectOptions1 = this.filterOptionList(1)
      }
    },
    /**
     * セレクトボックスの中身生成処理 重複は省く
     */
    filterOptionList(index) {
      const deleteValue =
        index === 1 ? this.contrastsSelected2 : this.contrastsSelected1
      const filterOptionList = this.optionList.filter(
        (data) => data.code !== deleteValue
      )

      return filterOptionList
    },
    /**
     * ローカルストレージに選択した値を保持
     */
    setLocalStorageSelectData(index, value) {
      let localStorageData = JSON.parse(
        localStorage.getItem(this.localStorageInfo)
      )

      if (localStorageData === null) {
        localStorageData = {
          select1: '',
          select2: '',
        }
      }

      if (index === 0) {
        localStorageData.select1 = value
      } else if (index === 1) {
        localStorageData.select2 = value
      }

      localStorage.setItem(
        this.localStorageInfo,
        JSON.stringify(localStorageData)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  margin: 24px 0 0 0;
  &-daily-report {
    width: 100%;
    margin: 16px 0 0 0;
    padding: 32px 26px;
    background: #ffffff;
    border: 1px #e5e5e5 solid;
    border-radius: 6px;
    &-control {
      display: flex;
      align-items: center;
      margin: 0 0 14px 0;
    }
    &-select {
      display: flex;
      align-items: center;
      &-box {
        ::v-deep select {
          height: 32px;
          padding: 0px 36px 0px 12px;
        }
      }
      span {
        margin: 0 12px;
      }
    }
  }
}
.arrow {
  position: absolute;
  top: 8px;
  right: 4px;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

select:focus {
  box-shadow: none;
}
.onFocus {
  border-radius: 4px;
  box-shadow: 0px 0px 3px 1px #007aff;
}
</style>
