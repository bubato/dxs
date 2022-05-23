<template>
  <div class="single-accordion">
    <div
      v-for="(accordion, index) in component.accordionList"
      :key="index"
      class="input-accordion"
    >
      <div class="input-align">
        <p class="title">表示位置</p>
        <SelectTextAlign
          :value="accordion.align"
          type="title"
          @changeAlign="changeAlign($event, index)"
        />
      </div>
      <div v-if="index > 0" class="heading">
        <p>{{ index + 1 }}番目のアコーディオン</p>
        <DeleteSVG
          v-show="index > 0"
          class="icon icon-delete"
          @click="deleteBlock(index)"
          @mouseover="$common.setAreaLabel($event, 'top', '削除')"
          @mouseleave="$common.setAreaLabel($event, '', '')"
          @blur="$common.setAreaLabel($event, '', '')"
        />
      </div>
      <div class="input-title">
        <p class="title">タイトル</p>
        <CustomInputText
          v-model="accordion.title"
          maxlength="100"
          placeholder="{よくある質問のタイトルなど}を入力してください"
          :validation="
            $common.getFormItemsDetail(formItems, 'title').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="input-text">
        <p class="title">テキスト</p>
        <CustomInputTextarea
          v-model="accordion.text"
          maxlength="500"
          placeholder="{よくある質問の回答など}を入力してください"
          :validation="$common.getFormItemsDetail(formItems, 'text').validation"
          @input="checkValidation()"
        />
      </div>
      <div class="input-init-open flex">
        <CustomInputCheckbox
          v-model="checkVals[index]"
          :options="checkboxOptions"
          class="init-open"
          :name="`initOpen${index}`"
          @input="updateCheck($event, index)"
        />
        <TooltipHelp
          class="toolTip"
          label="チェックを入れたアコーディオンが開いた状態で表示されます。"
        />
      </div>
    </div>
    <AddBlockItem
      class="add-item"
      label="アコーディオンを追加"
      @addItem="addBlock()"
    />
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SingleAccordion',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      checkboxOptions: [
        {
          value: '1',
          label: '開いて表示する',
        },
      ],
      checkVals: [],
      formItems: [
        {
          id: 'title',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 100,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 100,
              }),
            },
          ],
        },
        {
          id: 'text',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 500,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 500,
              }),
            },
          ],
        },
      ],
    }
  },
  computed: {},
  created() {
    for (let i = 0; i < this.component.accordionList.length; i++) {
      this.checkVals.push([])
      if (this.component.accordionList[i].initOpen) {
        this.checkVals[i].push('1')
      }
    }
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    changeAlign(val, index) {
      this.component.accordionList[index].align = val.selectVal
    },
    addBlock() {
      this.component.accordionList.push({
        align: '1',
        title: '',
        text: '',
        initOpen: false,
      })
      this.checkValidation()
    },
    deleteBlock(index) {
      this.component.accordionList.splice(index, 1)
      this.checkValidation()
    },
    updateCheck(val, index) {
      if (val.length > 0) {
        this.component.accordionList[index].initOpen = true
      } else {
        this.component.accordionList[index].initOpen = false
      }
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const componentList = JSON.parse(
        JSON.stringify(this.component.accordionList)
      )

      for (let i = 0; i < componentList.length; i++) {
        for (const key in componentList[i]) {
          if (
            this.$common.checkExistValidation(
              this.formItems,
              key,
              componentList[i][key]
            )
          ) {
            result = true
            break
          }
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
.single-accordion {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  .input-accordion {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    > div {
      &:not(.heading):not(:last-child) {
        margin-bottom: 20px;
      }
      .title {
        margin-bottom: 10px;
      }
      .init-open {
        margin-top: 10px;
      }
    }
    .title {
      margin-bottom: 10px;
    }
    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
  .add-item {
    margin-top: 20px;
  }
  .space-settings {
    margin-top: 32px;
  }
}
.toolTip {
  margin-top: 14px;
  margin-left: -27px;
}
</style>
