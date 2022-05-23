<template>
  <div class="set-map">
    <div class="input-date">
      <p class="flex">
        タグ埋め込み（GoogleMapの埋め込み用URLを入力してください）<TooltipHelp
          label="Googlemapの「共有」機能で表示される埋め込み用タグを入力してください。"
          direction="bottom"
        />
      </p>
      <CustomInputText
        v-model="component.inputTag"
        placeholder="埋め込み用のタグを入力してください"
        maxlength="2000"
        :validation="
          $common.getFormItemsDetail(formItems, 'inputTag').validation
        "
        @input="checkValidation()"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SetMap',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      formItems: [
        {
          id: 'inputTag',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'maxlength',
              maxlength: 2000,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 2000,
              }),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumberSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Format01'),
            },
          ],
        },
      ],
    }
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

      if (
        this.$common.checkExistValidation(
          this.formItems,
          'inputTag',
          this.component.inputTag
        )
      ) {
        result = true
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
.set-map {
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
