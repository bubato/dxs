<template>
  <div class="cell">
    <div class="cell-head">
      <span class="icon-dehazeWrap"
        ><DehazeSVG v-if="level !== 'first'" class="icon-dehaze"
      /></span>
      <CheckCircleSVG
        v-if="checkPagePublish()"
        class="cell-icon icon-checkCircle"
        @mouseover="$common.setAreaLabel($event, 'top', '公開中です。')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
      />
      <RemoveCircleSVG
        v-else-if="
          data.pageStatus === 0 ||
          data.pageStatus === 1 ||
          data.pageStatus === 9 ||
          checkPagePublish()
        "
        class="cell-icon is-disable icon-removeCircle"
        @mouseover="$common.setAreaLabel($event, 'top', '非公開です。')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
      />
    </div>
    <div class="cell-main">
      <span ref="title" class="cell-title linkClamp two">{{ data.name }}</span>
    </div>
    <div class="cell-footer">
      <a
        v-if="checkPagePublish()"
        :href="getPagePath(data.path)"
        target="_blank"
        class="cell-pageview"
      >
        <PageviewSVG class="icon icon-pageview" />
      </a>
      <span
        :class="{
          'is-processing': data.publishStatus === 1,
          'is-error': data.publishStatus === 9,
          'is-release': data.pageStatus === 1 || data.pageStatus === 2,
          'is-edit': data.pageStatus === 0,
          'is-temporarilySaved': data.pageStatus === 3,
          'is-publicReserve': data.pageStatus === 4,
        }"
        class="cell-status"
        @mouseover="
          $common.setAreaLabel(
            $event,
            'top',
            AreaLabelStatusLabel[pageStatusLabel(data)]
          )
        "
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
        >{{ pageStatusLabel(data) }}</span
      >
      <KeyboardArrowRightSVG v-if="arrowFlg" class="cell-arrow-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateWebPageCell',
  props: {
    data: {
      type: Object,
      required: true,
      default: null,
    },
    index: {
      type: Number,
      required: false,
      default: 0,
    },
    arrowFlg: {
      type: Boolean,
      required: false,
      default: false,
    },
    level: {
      type: String,
      required: false,
      default: '',
    },
    topPagePath: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      pageStatusData: {
        pubStt1: '処理中',
        pubStt9: '障害発生',
        stt0: '編集中',
        stt1: '公開予約',
        stt2: '公開中',
        stt3: '一時保存',
        stt4: '予約更新',
        stt9: '削除',
      },
      AreaLabelStatusLabel: {
        編集中: '編集中です。',
        公開予約: '公開予約中です。',
        公開中: '公開中です。',
        一時保存: '編集内容は公開されていません。',
        予約更新: '予約更新中です。',
        処理中: '公開処理中です。',
        障害発生: '公開処理でエラーが発生しました。',
      },
    }
  },
  computed: {
    getPagePath() {
      return (rootPath) => {
        let pagePath = ''

        if (rootPath.length > 0) {
          pagePath = this.topPagePath + rootPath.slice(1)
        }

        return pagePath
      }
    },
  },
  mounted() {},
  created() {},
  methods: {
    pageStatusLabel(data) {
      let result = ''

      switch (data.publishStatus) {
        case 1:
          result = this.pageStatusData.pubStt1
          break
        case 9:
          result = this.pageStatusData.pubStt9
          break
        default:
          switch (data.pageStatus) {
            case 0:
              result = this.pageStatusData.stt0
              break
            case 1:
              result = this.pageStatusData.stt1
              break
            case 2:
              result = this.pageStatusData.stt2
              break
            case 3:
              result = this.pageStatusData.stt3
              break
            case 4:
              result = this.pageStatusData.stt4
              break
            case 9:
              result = this.pageStatusData.stt9
              break
            default:
              break
          }
          break
      }

      return result
    },
    /**
     * ページが公開状態かどうかのチェック
     *
     * @return {boolean} true:公開中 false:非公開
     */
    checkPagePublish() {
      return (
        (this.data.pageStatus === 2 && this.data.publishStatus !== 9) ||
        (this.data.pageStatus === 3 && this.data.publishStatus !== 9) ||
        (this.data.pageStatus === 4 && this.data.publishStatus !== 9)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.is-first {
  .cell-head {
    width: 56px;
  }
  .icon-dehazeWrap {
    width: 24px;
  }
}
.cell {
  display: flex;
  align-items: center;
  &-head {
    display: flex;
    width: 68px;
    align-items: center;
  }
  &-main {
    flex: 1;
  }
  &-footer {
    width: 136px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    padding-right: 32px;
  }
}

.cell {
  &-arrow-icon {
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
  }
  &-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    fill: #34c759;
    &.is-disable {
      fill: #b0b3be;
    }
  }
  &-title {
    color: #1e1e1e;
  }
  &-status {
    font-size: 12px;
    width: 64px;
    padding: 3px;
    text-align: center;
    margin-left: 8px;
  }
  &-pageview {
    margin-left: 8px;
  }
}

// アイコン
.icon {
  &-dehazeWrap {
    width: 40px;
    padding: 14px;
  }
  &-dehazeWrap:active {
    cursor: grabbing;
  }
  &-dehaze {
    fill: #8d8d8d;
    width: 16px;
    height: 16px;
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
}

// ステータス
.is {
  &-release,
  &-publicReserve {
    background: #4f7df0;
    border: #4f7df0 1px solid;
    color: #fff;
  }
  &-edit {
    background: #dce5fc;
    border: #dce5fc 1px solid;
    color: #4f7df0;
  }
  &-temporarilySaved {
    background: #58baf5;
    border: #58baf5 1px solid;
    color: #fff;
  }
  &-processing {
    background: #fff;
    color: #4f7df0;
    border: #4f7df0 1px solid;
  }
  &-error {
    background: #e60012;
    border: #e60012 1px solid;
    color: #fff;
  }
}
</style>
