<template>
  <div class="custom-input-select-link">
    <div
      v-on-clickaway="away"
      class="select"
      :class="{ focus: open }"
      @click="openMenu"
    >
      <span>{{ showSelectLinkName }} </span>
      <ExpandMoreSVG v-show="!open" class="icon-arrow icon-expandMore" />
      <ExpandLessSVG v-show="open" class="icon-arrow icon-expandLess" />
    </div>
    <div v-show="open" class="option">
      <ul>
        <li @click="hideInputEle()">{{ unSelectOptionName }}</li>
        <li @click="showInputUrlEle()">{{ inputUrlOptionName }}</li>
        <li @click="showInputAnchorLinkEle()">
          {{ inputAnchorLinkOptionName }}
        </li>
        <li
          v-for="(list, i) in options"
          :key="i"
          class="label"
          :class="[{ level2: list.level === 2 }, { level3: list.level === 3 }]"
          @click="selectOption(i)"
          @mouseenter="hoverOption(i)"
          @mouseleave="hoverOption(null)"
        >
          {{ list.name }}
        </li>
      </ul>
    </div>
    <CustomInputText
      v-if="inputMode === 1"
      v-model="inputLink"
      class="input-link"
      placeholder="入力例：https://www.example.jp/"
      maxlength="2000"
      :validation="inputUrlValidation"
      @input="updateInputLink($event)"
    />
    <CustomInputText
      v-else-if="inputMode === 2"
      v-model="inputAnchorLink"
      class="input-link"
      placeholder="入力例：#page-anchor"
      maxlength="2000"
      :validation="inputAnchorValidation"
      @input="updateInputLink($event)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'CustomInputSelectLink',
  components: {},
  mixins: [clickaway],
  props: {
    /**
     * 初期値
     */
    initialLink: {
      type: String,
      default: null,
      required: false,
    },
    validation: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      open: false,
      options: [],
      hoverIndex: null,
      selectingOption: {},
      showSelectLinkName: '',
      unSelectOptionName: '選択してください',
      inputUrlOptionName: 'URLを直接入力',
      inputAnchorLinkOptionName: 'ページ内リンク',
      inputMode: 0,
      inputLink: '',
      inputAnchorLink: '',
      inputUrlValidation: [
        {
          type: 'maxlength',
          maxlength: 2000,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 2000,
          }),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.domain,
          message: this.$common.getMasterMessage('ErrorMsg_Url02'),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.protocol,
          message: this.$common.getMasterMessage('ErrorMsg_Url03'),
        },
      ],
      inputAnchorValidation: [
        {
          type: 'maxlength',
          maxlength: 2000,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 2000,
          }),
        },
        {
          type: 'regex',
          regex: this.$globalVariable.regularExp.anchor,
          message: this.$common.getMasterMessage('ErrorMsg_Url07'),
        },
      ],
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['pageListData']),
  },
  created() {
    let findOption = false
    this.options = this.getOptions()

    if (this.initialLink !== '') {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].path === this.initialLink) {
          this.selectingOption = this.options[i]
          this.showSelectLinkName = this.selectingOption.name
          findOption = true
          break
        }
      }
    }
    if (!findOption) {
      if (this.initialLink) {
        if (this.initialLink.slice(0, 1) === '#') {
          this.inputMode = 2
          this.showSelectLinkName = this.inputAnchorLinkOptionName
          this.inputAnchorLink = this.initialLink
        } else {
          this.inputMode = 1
          this.showSelectLinkName = this.inputUrlOptionName
          this.inputLink = this.initialLink
        }
      } else {
        this.inputMode = 0
        this.showSelectLinkName = this.unSelectOptionName
      }
    }
  },
  methods: {
    openMenu() {
      this.open = !this.open
    },
    away() {
      this.open = false
    },
    hideInputEle() {
      this.inputMode = 0 // 内部リンク
      this.showSelectLinkName = this.unSelectOptionName
      this.$emit('selectLink', {
        value: '',
        linkType: this.inputMode,
        isValidation: false,
      })
    },
    showInputUrlEle() {
      this.inputAnchorLink = ''
      this.inputMode = 1 // URL入力
      this.showSelectLinkName = this.inputUrlOptionName
      this.$emit('selectLink', {
        value: '',
        linkType: this.inputMode,
        isValidation: true,
      })
    },
    showInputAnchorLinkEle() {
      this.inputLink = ''
      this.inputMode = 2 // アンカーリンク入力
      this.showSelectLinkName = this.inputAnchorLinkOptionName
      this.$emit('selectLink', {
        value: '',
        linkType: this.inputMode,
        isValidation: true,
      })
    },
    selectOption(index) {
      this.selectingOption = this.options[index]
      this.showSelectLinkName = this.selectingOption.name
      this.inputMode = 0
      this.$emit('selectLink', {
        value: this.selectingOption.path,
        linkType: this.inputMode,
        isValidation: false,
      })
    },
    hoverOption(index) {
      this.hoverIndex = index
    },
    updateInputLink() {
      let link = ''

      if (this.inputMode === 1) {
        link = this.inputLink
      } else if (this.inputMode === 2) {
        link = this.inputAnchorLink
      }

      this.$emit('selectLink', {
        value: link,
        linkType: this.inputMode,
        isValidation: true,
      })
    },
    /**
     * 選択肢を取得
     */
    getOptions() {
      const options = []

      options.push(this.getOptionData(this.pageListData, 1))

      if (this.$common.checkArrayValue(this.pageListData.underContents)) {
        for (let i = 0; i < this.pageListData.underContents.length; i++) {
          options.push(
            this.getOptionData(this.pageListData.underContents[i], 2)
          )
          if (
            this.$common.checkArrayValue(
              this.pageListData.underContents[i].underContents
            )
          ) {
            for (
              let j = 0;
              j < this.pageListData.underContents[i].underContents.length;
              j++
            ) {
              options.push(
                this.getOptionData(
                  this.pageListData.underContents[i].underContents[j],
                  3
                )
              )
            }
          }
        }
      }

      return options
    },
    getOptionData(pageInfo, level) {
      return {
        id: pageInfo.id,
        name: pageInfo.name,
        status: pageInfo.status,
        path: pageInfo.path,
        level,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-input-select-link {
  position: relative;
  .select {
    position: relative;
    width: 310px;
    display: flex;
    align-items: center;
    height: 48px;
    background: #f7f8f9;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    color: #1e1e1e;
    font-size: 13px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: default;
    span {
      padding-left: 10px;
    }
  }
  .option {
    position: absolute;
    min-width: 310px;
    font-size: 13px;
    box-shadow: 0px 0px 3px 1px #8d8d8d;
    border: 1px solid #767676;
    cursor: default;
    background: #f7f8f9;
    z-index: 9999;
    ul {
      width: 100%;
    }
    li {
      display: flex;
      align-items: center;
      width: 100%;
      height: 32px;
      padding-left: 10px;
      &:hover {
        color: #ffffff;
        background-color: #1e90ff;
      }
      &.level2 {
        padding-left: 30px;
      }
      &.level3 {
        padding-left: 50px;
      }
      &:not(:last-of-type) {
        margin: 0 0 5px 0;
      }
    }
  }
  .input-link {
    margin-top: 10px;
  }
}

.focus {
  box-shadow: 0px 0px 3px 1px #007aff;
  border: 1px solid #007aff;
}

.icon {
  &-arrow {
    position: absolute;
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
}
</style>
