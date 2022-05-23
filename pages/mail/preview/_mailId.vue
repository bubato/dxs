<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="mail_preview">
    <div class="header">
      <ul class="selectPcSp">
        <li
          :class="{ selected: selectDisplayType === 1 }"
          @click="selectDisplayType = 1"
        >
          <PcSVG class="icon icon-pc" />PC
        </li>
        <li
          :class="{ selected: selectDisplayType === 2 }"
          @click="selectDisplayType = 2"
        >
          <SmartPhoneSVG class="icon sp icon-smartPhone" />スマホ
        </li>
      </ul>
      <ul class="selectHtmlText">
        <li :class="{ selected: mailType === '1' }">
          <HtmlSVG class="icon icon-html" />HTML
        </li>
        <li :class="{ selected: mailType === '0' }">
          <TextSVG class="icon icon-text" />テキスト
        </li>
      </ul>
    </div>
    <div class="contents" :class="{ sp: selectDisplayType === 2 }">
      <div class="mailBody" v-html="mailBody" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      selectDisplayType: 1,
      mailType: '',
      mailBodySettingJson: '',
      mailBody: '',
    }
  },
  computed: {},
  created() {
    this.getMailDetail() // メール情報取得
  },
  mounted() {},
  methods: {
    /**
     * メール情報取得
     */
    getMailDetail() {
      const paramData = {
        mailId: this.$route.params.mailId,
      }

      this.$common.addCallApiNum()
      this.$api
        .getMailDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const mailContent = resData.data.mailInformation.mailContent

            this.mailType = mailContent.mailType
            this.mailBody = mailContent.mailBody
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
      title: 'プレビュー｜HIRAMEKI platform',
    }
  },
}
</script>

<style lang="scss" scoped>
.mail_preview {
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
        font-size: 12px;
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
          &.sp {
            margin-right: 2px;
          }
        }
      }
    }
    .selectPcSp {
      margin-right: 9px;
      li {
        width: 83px;
      }
    }
    .selectHtmlText {
      margin-left: 9px;
      li {
        width: 95px;
      }
    }
  }
  .contents {
    margin: 0 auto;
    margin-top: 32px;
    width: 1366px;
    &.sp {
      width: 480px;
    }
  }
}
</style>
