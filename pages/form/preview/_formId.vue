<template>
  <div class="form-preview">
    <div class="header">
      <ul>
        <li
          :class="{ selected: selectDispType === 1 }"
          @click="selectDispType = 1"
        >
          <PcSVG class="icon icon-pc" />PC
        </li>
        <li
          :class="{ selected: selectDispType === 2 }"
          @click="selectDispType = 2"
        >
          <SmartPhoneSVG class="icon icon-smartPhone" />スマホ
        </li>
      </ul>
    </div>
    <div
      v-if="scriptSrc"
      class="contents"
      :class="{ sp: selectDispType === 2 }"
    >
      <div id="xhm-form"></div>
      <script
        type="application/javascript"
        :src="scriptSrc"
        defer
        charset="UTF-8"
      ></script>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectDispType: 1,
      scriptSrc: '',
    }
  },
  computed: {},
  created() {
    this.getEditFormSettings() // フォーム基本設定表示データ取得APIの呼び出し
  },
  mounted() {},
  methods: {
    /**
     * フォーム基本設定表示データ取得API
     */
    getEditFormSettings() {
      const paramData = {
        formId: this.$route.params.formId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getEditFormSettings(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const scriptTag =
              resData.data.editFormData.otherSettings.formTag.previewTag
            this.scriptSrc = scriptTag.match(/src="(\\.|[^"\\])*"/g)

            if (this.scriptSrc !== null) {
              this.scriptSrc = this.scriptSrc[0]
                .replace('src=', '')
                .replace(/"/g, '')
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
  },
  head() {
    return {
      title: 'プレビュー｜フォーム｜bizskyDX',
    }
  },
}
</script>

<style lang="scss" scoped>
.form-preview {
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    background: #cdced0;
    ul {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      overflow: hidden;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 83px;
        height: 30px;
        background: #ffffff;
        cursor: pointer;
        &.selected {
          background: #ebeced;
          color: #007aff;
          .icon {
            fill: #007aff;
          }
        }
        .icon {
          margin-right: 8px;
          height: 22px;
          width: auto;
          &.icon-smartPhone {
            margin-right: 2px;
          }
        }
      }
    }
  }
  .contents {
    width: 1366px;
    min-width: 1366px;
    margin: auto;
    padding-bottom: 20px;
    &.sp {
      width: 375px;
      min-width: 375px;
    }
  }
}
</style>
