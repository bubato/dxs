<template>
  <div class="set-list-display">
    <div class="select-category">
      <p>対象カテゴリ</p>
      <CustomInputSelect
        v-model="selectPageId"
        :options="getLevelTwoPageOptions()"
        placeholder="選択して下さい"
        :validation="
          $common.getFormItemsDetail(formItems, 'selectPageId').validation
        "
        @input="reflectSelectPageId($event)"
      />
    </div>
    <div class="input-title">
      <p>見出し</p>
      <CustomInputText
        v-model="component.title"
        placeholder="{パーツの見出し}を入力してください"
        maxlength="100"
        :validation="$common.getFormItemsDetail(formItems, 'title').validation"
        @input="checkValidation()"
      />
    </div>
    <div class="select-show-disp">
      <p>最大表示件数</p>
      <CustomInputSelect
        v-model="component.showDisp"
        :options="showDispList"
        :validation="
          $common.getFormItemsDetail(formItems, 'showDisp').validation
        "
        @input="checkValidation()"
      />
    </div>
    <!-- phase2以降表示形式画像に対応
      <div class="select-style">
      <p>表示形式</p>
      <CustomInputRadio
        v-model="component.style"
        name="selectStyle"
        :options="styleOptions"
        layout-type="vertical"
        placeholder="ラベル"
        :validation="$common.getFormItemsDetail(formItems, 'style').validation"
        @input="checkValidation()"
      />
    </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SetListDisplay',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      selectPageId: null,
      showDispList: [
        {
          code: '1',
          label: '5件',
        },
        {
          code: '2',
          label: '10件',
        },
        {
          code: '3',
          label: '20件',
        },
      ],
      styleOptions: [
        {
          value: '1',
          label: 'テキスト',
        },
        {
          value: '2',
          label: '画像付きテキスト',
        },
      ],
      formItems: [
        {
          id: 'selectPageId',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
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
          id: 'showDisp',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'style',
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
    ...mapState('cms/editorStore', ['editorData']),
    getLevelTwoPageOptions() {
      return () => {
        const options = []
        let option = {}

        if (
          this.$common.checkArrayValue(
            this.editorData.pageListData.underContents
          )
        ) {
          for (
            let i = 0;
            i < this.editorData.pageListData.underContents.length;
            i++
          ) {
            option = {
              code: this.editorData.pageListData.underContents[i].id,
              label: this.editorData.pageListData.underContents[i].name,
            }

            options.push(option)
          }
        }

        return options
      }
    },
  },
  created() {
    this.selectPageId = this.component.selectPageId
      ? String(this.component.selectPageId)
      : ''
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false

      for (const key in this.component) {
        if (
          this.$common.checkExistValidation(
            this.formItems,
            key,
            this.component[key]
          )
        ) {
          result = true
          break
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
    /**
     * 選択したページIDの反映
     *
     * @param {string} val 選択値
     */
    reflectSelectPageId(val) {
      this.component.selectPageId = Number(val)
      this.checkValidation()
    },
  },
}
</script>

<style lang="scss" scoped>
.set-list-display {
  width: 600px;
  max-height: 760px;
  overflow: auto;
  > div {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
