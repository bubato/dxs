<template>
  <div class="edit-area">
    <div class="form-block">
      <div class="form-item">
        <RequiredFormLabel class="title" label="タイトル" :required="true" />
        <CustomInputText
          v-model="partsData.title"
          maxlength="20"
          placeholder="タイトルを入力してください"
          :validation="
            $common.getFormItemsDetail(formItems, 'title').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">注釈</p>
        <CustomInputSelect
          v-model="partsData.parts_attr.annotation_pos"
          :options="ANNOTATION_POSITION_OPTIONS"
          name="annotationList"
        />
      </div>
      <div v-if="partsData.parts_attr.annotation_pos != '0'" class="form-item">
        <CustomInputText
          v-model="partsData.parts_attr.annotation"
          maxlength="100"
          placeholder="注釈を入力してください"
        />
      </div>
      <div class="form-item">
        <p class="title">必須</p>
        <CustomInputSingleCheckbox
          v-model="partsData.required_flg"
          name="required"
          label="必須項目にする"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>セレクトボックス属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">選択肢</p>
        <p class="sub-text">
          値を入力しない場合は、表示文字列が自動的に値に代入されます。
        </p>
        <draggable
          :list="partsData.options"
          tag="ul"
          class="drag-list"
          group="radio"
          handle=".icon-block"
        >
          <li v-for="(radio, index) in partsData.options" :key="index">
            <template v-if="radio.opt_kbn === GROUP_ITEM_TYPE.OPTION">
              <div class="icon-block">
                <DehazeSVG class="icon-dehaze" />
              </div>
              <input
                v-model="radio.opt_label"
                type="text"
                placeholder="ラベルを入力してください"
                maxlength="100"
              />
              <span>値:</span>
              <input
                v-model="radio.opt_value"
                type="text"
                placeholder="値を入力"
                maxlength="10"
              />
              <div class="icon-block">
                <CancelSVG
                  v-show="index > 0"
                  class="icon-cancel"
                  @mouseover="$common.setAreaLabel($event, 'right', '削除')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                  @click="deleteRadio(index)"
                />
              </div>
            </template>
            <template v-else>
              <div class="icon-block">
                <DehazeSVG class="icon-dehaze" />
              </div>
              <input
                v-model="radio.opt_label"
                type="text"
                placeholder="ラベルを入力してください"
                maxlength="100"
              />
              <div class="icon-block">
                <CancelSVG
                  v-show="index > 0"
                  class="icon-cancel"
                  @mouseover="$common.setAreaLabel($event, 'right', '削除')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                  @click="deleteRadio(index)"
                />
              </div>
            </template>
          </li>
        </draggable>
        <div class="add-item">
          <div class="add-item-link" @click="addSelectRadio('0')">
            <AddCircleSVG class="icon icon-addCircle" /><span
              >選択項目を追加する</span
            >
          </div>
          <div class="add-item-link" @click="addSelectRadio('1')">
            <AddCircleSVG class="icon icon-addCircle" /><span
              >ラベルを追加する</span
            >
          </div>
        </div>
        <div class="buttons">
          <button
            class="btn btn-middle btn-secondary"
            @click="fillOptionValueFromLabel()"
          >
            値をラベルに合わせる
          </button>
          <button
            class="btn btn-middle btn-secondary"
            @click="fillOptionValueBySerial()"
          >
            値に連番をセット
          </button>
        </div>
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'class_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>パーツ属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.parts_id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'parts_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.parts_class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'parts_class_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapMutations } from 'vuex'
import {
  ANNOTATION_POSITION,
  ANNOTATION_POSITION_OPTIONS,
  GROUP_ITEM_TYPE,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormEditPartsSelectbox',
  components: {
    draggable,
  },
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      ANNOTATION_POSITION,
      ANNOTATION_POSITION_OPTIONS,
      GROUP_ITEM_TYPE,
      formItems: [
        {
          id: 'title',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
        {
          id: 'id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'parts_id_attr',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'parts_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
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
      const validationItems = {
        title: this.partsData.title,
        id_attr: this.partsData.id_attr,
        class_attr: this.partsData.class_attr,
        parts_id_attr: this.partsData.parts_id_attr,
        parts_class_attr: this.partsData.parts_class_attr,
      }

      for (const key in validationItems) {
        if (
          this.$common.checkExistValidation(
            this.formItems,
            key,
            validationItems[key]
          )
        ) {
          result = true
          break
        }
      }

      this.setReflectButtonDisabledFlg(result)
    },
    /**
     * 選択肢の追加
     */
    addSelectRadio(kbn) {
      let pushItem = {}

      if (kbn === this.GROUP_ITEM_TYPE.OPTION) {
        pushItem = {
          opt_kbn: kbn,
          opt_label: '',
          opt_value: '',
        }
      } else {
        pushItem = {
          opt_kbn: kbn,
          opt_label: '',
          opt_value: '',
        }
      }

      this.partsData.options.push(pushItem)
    },
    /**
     * ラジオの削除
     */
    deleteRadio(index) {
      this.partsData.options.splice(index, 1)
    },
    /**
     * 値をラベルに合わせるボタン押下処理
     */
    fillOptionValueFromLabel() {
      for (let i = 0; i < this.partsData.options.length; i++) {
        this.partsData.options[i].opt_value = this.partsData.options[
          i
        ].opt_label
      }
    },
    /**
     * 値に連番をセットボタン押下処理
     */
    fillOptionValueBySerial() {
      for (let i = 0; i < this.partsData.options.length; i++) {
        this.partsData.options[i].opt_value = i + 1
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/form/edit/formEditPartsDetailModal.scss';
</style>
