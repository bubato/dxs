<template>
  <div class="single-movie">
    <p class="sub-text">
      YouTubeなどで発行される埋め込み用タグを入力してください。
    </p>
    <div class="input-movie">
      <p>動画</p>
      <CustomInputRadio
        v-model="component.selectType"
        :options="selectTypeOptions"
        name="selectTypeOptions"
      />
    </div>
    <CustomInputText
      v-model="component.inputTag"
      maxlength="2000"
      placeholder="埋め込み用の動画タグを入力してください"
      :validation="$common.getFormItemsDetail(formItems, 'inputTag').validation"
      @input="checkValidation()"
    />
    <SettingSpaceValue :component="component" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'SingleMovie',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      selectTypeOptions: [
        {
          value: '1',
          label: 'タグ埋め込み',
        },
      ],
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
  computed: {},
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
.single-movie {
  width: 600px;
  max-height: 760px;
  overflow: auto;
  .sub-text {
    margin: 10px 0 20px 0;
  }
  .input-movie {
    margin: 10px 0;
    p {
      margin-bottom: 10px;
    }
  }
  .space-settings {
    margin-top: 32px;
  }
}
</style>
