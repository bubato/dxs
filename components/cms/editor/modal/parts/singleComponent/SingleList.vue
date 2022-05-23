<template>
  <div class="single-list">
    <div class="select-symbol">
      <p>記号</p>
      <CustomInputRadio
        v-model="component.symbolType"
        :options="symbolList"
        name="symbolList"
      />
    </div>
    <ul class="input-list">
      <li v-for="(list, index) in component.list" :key="index">
        <div v-if="index > 0" class="heading">
          <p>{{ index + 1 }}番目のリスト</p>
          <DeleteSVG
            v-show="index > 0"
            class="icon icon-delete"
            @click="deleteBlock(index)"
            @mouseover="$common.setAreaLabel($event, 'top', '削除')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
        </div>
        <div class="input-text">
          <p class="flex">
            テキスト(HTML利用可能)<TooltipHelp
              label="使用できるHTMLタグは&#60;a&#62;&#60;span&#62;&#60;b&#62;<br>&#60;br&#62;です。"
            />
          </p>
          <CustomInputText
            v-model="list.text"
            maxlength="500"
            placeholder="リスト項目を入力してください"
            :validation="
              $common.getFormItemsDetail(formItems, 'text').validation
            "
            @input="checkValidation()"
          />
        </div>
        <div class="select-link">
          <p class="flex">
            リンク<TooltipHelp
              label="作成したページから選択できます。外部のページへリンクする場合は「URLを直接入力」を選択してください。"
            />
          </p>
          <CustomInputSelectLink
            :initial-link="list.link"
            @selectLink="selectLink($event, index)"
          />
        </div>
      </li>
    </ul>
    <AddBlockItem class="add-item" label="リストを追加" @addItem="addBlock()" />
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SingleList',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      isValidation: false,
      symbolList: [
        {
          value: '1',
          label: '番号なし',
        },
        {
          value: '2',
          label: '番号あり',
        },
      ],
      formItems: [
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
        {
          id: 'link',
          validation: [],
        },
      ],
      linkValidation: [
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
      anchorLinkValidation: [
        {
          type: 'maxlength',
          maxlength: 100,
          message: this.$common.getMasterMessage('ErrorMsg_Count01', {
            maxlength: 100,
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
  computed: {},
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    selectLink(selectLink, index) {
      this.component.list[index].link = selectLink.value
      this.component.list[index].linkType = selectLink.linkType
      this.checkValidation()
    },
    addBlock() {
      this.component.list.push({ text: '', link: '', linkType: 0 })
      this.checkValidation()
    },
    deleteBlock(index) {
      this.component.list.splice(index, 1)
      this.checkValidation()
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const componentList = JSON.parse(JSON.stringify(this.component.list))

      for (let i = 0; i < componentList.length; i++) {
        for (const key in componentList[i]) {
          if (key === 'link') {
            const targetIndex = this.formItems.findIndex(
              (data) => data.id === 'link'
            )

            if (this.component.list[i].linkType === 1) {
              this.formItems[targetIndex].validation = this.linkValidation
            } else if (this.component.list[i].linkType === 2) {
              this.formItems[targetIndex].validation = this.anchorLinkValidation
            } else if (
              this.component.list[i].linkType === 0 ||
              this.component.list[i].linkType === undefined
            ) {
              this.formItems[targetIndex].validation = []
            }
          }
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
.single-list {
  width: 600px;
  max-height: calc(100vh - 240px);
  overflow: auto;
  .select-symbol {
    margin-bottom: 20px;
    p {
      margin-bottom: 10px;
    }
    .custom-select {
      width: 70px;
    }
  }
  .input-list {
    margin-bottom: 20px;
    li {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      > div {
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        .flex,
        > p {
          margin-bottom: 10px;
        }
      }
    }
  }
  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .space-settings {
    margin-top: 32px;
  }
}
</style>
