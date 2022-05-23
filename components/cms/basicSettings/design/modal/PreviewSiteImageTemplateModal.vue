<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />

          <div class="modal_title">
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
          <div class="modal_contents">
            <ul class="select-color-list">
              <li
                v-for="data in $common.getVersatileOptions(27)"
                :key="data.code"
                @click="changeColor(data.code)"
              >
                <label
                  :style="{ 'background-color': data.label }"
                  class="color"
                  :class="{ selected: selectColor === data.code }"
                >
                  <input
                    v-model="selectColor"
                    type="radio"
                    :value="data.code"
                  />
                  <CheckSVG
                    v-if="selectColor === data.code"
                    class="icon icon-check"
                  />
                </label>
              </li>
            </ul>
            <div class="image-template">
              <iframe
                class="preview"
                :class="{
                  'is-pc': selectDispType === 1,
                  'is-sp': selectDispType === 2,
                }"
                :src="
                  '/cms/editor/preview/toppage_' +
                  selectData.industryCode +
                  '.html'
                "
                frameborder="0"
              ></iframe>
              <!-- {{ selectColor }} -->
            </div>
          </div>
          <div class="buttons">
            <button
              class="btn btn-long btn-cancel"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button
              class="btn btn-long btn-basic"
              @click="selectTemplateDesign()"
            >
              このデザインを選択
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PreviewSiteImageTemplateModal',
  components: {},
  props: {
    initColor: {
      type: String,
      default: '',
      required: true,
    },
    selectPreviewImageTemplateId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      loadedIframe: false,
      selectDispType: 1,
      selectColor: '',
      templateType: {
        1: 'simple',
        3: 'stylish',
        4: 'friendly',
      },
      colorNameList: {
        1: 'black',
        2: 'darkGray',
        3: 'gray',
        4: 'lightBlue',
        5: 'blueGreen',
        6: 'darkBlue',
        7: 'darkGreen',
        8: 'green',
        9: 'lightGreen',
        10: 'yellowGreen',
        11: 'orange',
        12: 'red',
        13: 'darkPink',
        14: 'violet',
        15: 'purple',
        16: 'paleBlue',
        17: 'palePurple',
        18: 'pink',
        19: 'gold',
        20: 'brown',
      },
    }
  },
  computed: {
    selectData() {
      return {
        templateType: this.selectPreviewImageTemplateId.charAt(0),
        industryCode: this.selectPreviewImageTemplateId.substr(1, 2),
      }
    },
  },
  created() {
    this.selectColor = this.initColor
  },
  mounted() {
    setTimeout(this.checkIframeDom, 200)
  },
  methods: {
    /**
     * iframe読込確認
     */
    checkIframeDom() {
      if (
        document
          .querySelector('.preview')
          .contentWindow.document.querySelector('.view-area') === null
      ) {
        setTimeout(this.checkIframeDom, 200)
      } else {
        this.loadedIframe = true
        this.setTemplateType()
        this.setColor(this.selectColor)
      }
    },
    /**
     * 選択した色をセット
     *
     * @param {String} id 選択した色ID
     * @param {String} name 選択した色Class名
     */
    changeColor(id) {
      this.selectColor = id
      if (this.loadedIframe) {
        this.setColor(id)
      }
    },
    /**
     * テンプレートスタイルタイプの設定
     */
    setTemplateType() {
      this.setIncludeCss()
      this.setSettingPageClass(
        'template',
        this.templateType[Number(this.selectData.templateType)]
      )
    },
    /**
     * テンプレートカラーの設定
     *
     * @param {String} id カラーID
     */
    setColor(id) {
      this.setSettingPageClass('siteColor', this.colorNameList[Number(id)])
    },
    /**
     * iframe内headタグcssの読込設定
     */
    setIncludeCss() {
      const iframeDocument = document.querySelector('.preview').contentWindow
        .document
      const cssLinkTag = iframeDocument.createElement('link')

      cssLinkTag.setAttribute(
        'href',
        '/assets/cmsEditor/css/' +
          this.templateType[this.selectData.templateType] +
          'Template.css'
      )
      cssLinkTag.setAttribute('rel', 'stylesheet')
      iframeDocument.querySelector('head').appendChild(cssLinkTag)
    },
    /**
     * iframe内ページ設定用クラスの設定
     *
     * @param {String} className 設定クラス名（接頭辞）
     * @param {String} setClassName 設定するクラス名
     */
    setSettingPageClass(className, setClassName) {
      const iframeDocument = document.querySelector('.preview').contentWindow
        .document
      const removeColorClassName = Array.from(
        iframeDocument.querySelector('.view-area').classList
      ).find((item) => item.includes(className))

      iframeDocument
        .querySelector('.view-area')
        .classList.remove(removeColorClassName)
      iframeDocument
        .querySelector('.view-area')
        .classList.add(className + '-' + setClassName)
    },
    /**
     * デザイン選択処理
     */
    selectTemplateDesign() {
      this.$emit('select', this.selectColor)
      this.$emit('close')
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event イベントオブジェクト
     * @param {String} type クローズタイプ
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

<style scoped lang="scss">
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;
  &.is-comp {
    width: 544px;
  }

  .modal_title {
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
        border: 1px solid #e5e5e5;
        cursor: pointer;
        &:nth-of-type(1) {
          border-radius: 3px 0px 0px 3px;
        }
        &:nth-of-type(2) {
          border-radius: 0px 3px 3px 0px;
          border-left: none;
        }
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
          width: 22px;
          &.icon-smartPhone {
            margin-right: 2px;
          }
        }
      }
    }
  }
  .modal_contents {
    display: flex;
    margin-top: 32px;
    height: 392px;
    position: relative;
    .select-color-list {
      display: flex;
      flex-wrap: wrap;
      width: 72px;
      li {
        cursor: pointer;
        &:nth-of-type(2n) {
          margin-left: 8px;
        }
        &:nth-child(n + 3) {
          margin-top: 8px;
        }
        label {
          display: block;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          position: relative;
          &.selected {
            border: 1px solid #007aff;
            box-shadow: 0px 0px 4px #007affb8;
            border-radius: 8px;
          }
          .icon {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            fill: #ffffff;
          }
          input {
            display: none;
          }
        }
      }
    }
    .image-template {
      width: 644px;
      height: 100%;
      margin-left: 32px;
      background-color: #e7e7e8;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
.preview {
  &.is-pc {
    width: 1260px;
    transform: scale(0.51);
    transform-origin: top left;
    min-height: 769px;
  }
  &.is-sp {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    width: 468px;
    transform: scale(0.71);
    transform-origin: top center;
    min-height: 550px;
  }
}
</style>
