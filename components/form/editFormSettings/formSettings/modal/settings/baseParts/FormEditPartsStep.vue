<template>
  <div class="edit-area">
    <div class="form-block">
      <div class="form-item">
        <p class="title">入力画面</p>
        <CustomInputText
          v-model="partsData.parts_attr.input_scrn"
          placeholder="入力例：入力"
          maxlength="10"
          :validation="
            $common.getFormItemsDetail(formItems, 'input_scrn').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title main-text">確認画面</p>
        <p class="sub-text">
          確認画面の設定で「なし」を選択した場合は確認画面ステップの表示はしません。
        </p>
        <CustomInputText
          v-model="partsData.parts_attr.confirm_scrn"
          placeholder="入力例：確認"
          maxlength="10"
          :validation="
            $common.getFormItemsDetail(formItems, 'confirm_scrn').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">完了画面</p>
        <CustomInputText
          v-model="partsData.parts_attr.complete_scrn"
          placeholder="入力例：完了"
          maxlength="10"
          :validation="
            $common.getFormItemsDetail(formItems, 'complete_scrn').validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'FormEditPartsStep',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      formItems: [
        {
          id: 'input_scrn',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'confirm_scrn',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'complete_scrn',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
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

      for (const key in this.partsData.parts_attr) {
        if (
          this.$common.checkExistValidation(
            this.formItems,
            key,
            this.partsData.parts_attr[key]
          )
        ) {
          result = true
          break
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/form/edit/formEditPartsDetailModal.scss';
</style>
