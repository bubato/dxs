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
          class="width-middle"
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
      <div class="form-item">
        <p class="title">表示設定</p>
        <CustomInputRadio
          v-model="partsData.parts_attr.disp_config"
          :options="DISPLAY_CONFIG_OPTIONS"
          name="dispSettings"
          layout-type="vertical"
          @input="checkValidation"
        />
        <CustomInputSingleCheckboxStr
          v-model="partsData.parts_attr.calendar_flg"
          class="margin-t-24"
          name="showCalendar"
          label="カレンダーを表示する"
        />
      </div>
    </div>
    <div class="form-block">
      <h5>日付属性</h5>
      <div class="form-item">
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.day.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'day_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="期間設定" :required="true" />
        <p class="sub-text">今日を起点に:</p>
        <div class="flex">
          <CustomInputText
            v-model="daySpan.fromValue"
            class="width-semi-middle"
            maxlength="2"
            :validation="
              $common.getFormItemsDetail(formItems, 'fromValue').validation
            "
            @input="updateInputDay()"
          /><span class="margin-l-16">日</span>
          <CustomInputSelect
            v-model="daySpan.fromDirection"
            :options="prevNextOptions"
            class="width-short margin-l-16"
            @input="updateDay()"
          /><span class="margin-l-16">～</span>
        </div>
        <div class="flex margin-t-12">
          <CustomInputText
            v-model="daySpan.toValue"
            class="width-semi-middle"
            maxlength="2"
            :validation="
              $common.getFormItemsDetail(formItems, 'toValue').validation
            "
            @input="updateInputDay($event, 'to')"
          /><span class="margin-l-16">日</span>
          <CustomInputSelect
            v-model="daySpan.toDirection"
            :options="prevNextOptions"
            class="width-short margin-l-16"
            @input="updateDay($event, 'to')"
          /><span class="margin-l-16">を表示</span>
        </div>
      </div>
      <div class="form-item">
        <RequiredFormLabel class="title" label="曜日設定" :required="true" />
        <p class="sub-text">選択可能な曜日:</p>
        <CustomInputCheckbox
          v-model="partsData.day.parts_attr.day_of_week_config"
          :options="DAY_OF_WEEK_CONFIG_OPTIONS"
          name="dayOfTheWeekOptions"
          :validation="
            $common.getFormItemsDetail(formItems, 'day_of_week_config')
              .validation
          "
          @input="checkValidation()"
        />
      </div>
      <div class="form-item">
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.day.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'day_class_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div
        v-show="['1', '2'].includes(partsData.parts_attr.disp_config)"
        class="form-item"
      >
        <RequiredFormLabel class="title" label="表示時間" :required="true" />
        <CustomInputCheckbox
          v-model="partsData.hour.parts_attr.disp_time"
          :options="DISPLAY_TIME_OPTIONS"
          name="dispTime"
          class="disp-time-checkbox"
          :validation="
            $common.getFormItemsDetail(formItems, 'disp_time').validation
          "
          @input="updateDispTime()"
        />
        <CustomInputSingleCheckbox
          v-model="selectAllTime"
          label="すべてチェック"
          name="selectAllTime"
          @input="checkSelectAllTime()"
        />
      </div>
      <div
        v-show="['1', '2'].includes(partsData.parts_attr.disp_config)"
        class="form-item"
      >
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.hour.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'hour_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div
        v-show="['1', '2'].includes(partsData.parts_attr.disp_config)"
        class="form-item"
      >
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.hour.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'hour_class_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div
        v-show="['2'].includes(partsData.parts_attr.disp_config)"
        class="form-item"
      >
        <RequiredFormLabel class="title" label="分の単位" :required="true" />
        <CustomInputRadio
          v-model="partsData.minute.parts_attr.minute_unit"
          :options="MINUTE_UNIT_OPTIONS"
          name="minuteUnit"
        />
      </div>
      <div
        v-show="['2'].includes(partsData.parts_attr.disp_config)"
        class="form-item"
      >
        <RequiredFormLabel class="title" label="Id属性" :required="true" />
        <CustomInputText
          v-model="partsData.minute.id_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'minute_id_attr').validation
          "
          @input="checkValidation()"
        />
      </div>
      <div
        v-show="['2'].includes(partsData.parts_attr.disp_config)"
        class="form-item"
      >
        <p class="title">class属性追加</p>
        <CustomInputText
          v-model="partsData.minute.class_attr"
          maxlength="20"
          :validation="
            $common.getFormItemsDetail(formItems, 'minute_class_attr')
              .validation
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
import { mapMutations } from 'vuex'
import {
  ANNOTATION_POSITION_OPTIONS,
  DISPLAY_CONFIG_OPTIONS,
  DAY_OF_WEEK_CONFIG_OPTIONS,
  DISPLAY_TIME_OPTIONS,
  MINUTE_UNIT_OPTIONS,
  DISPLAY_TIME_OPTIONS_DEFAULT,
} from '~/assets/js/form/f-6m-constants'

export default {
  name: 'FormEditPartsDate',
  props: {
    partsData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      ANNOTATION_POSITION_OPTIONS,
      DISPLAY_CONFIG_OPTIONS,
      DAY_OF_WEEK_CONFIG_OPTIONS,
      DISPLAY_TIME_OPTIONS,
      MINUTE_UNIT_OPTIONS,
      DISPLAY_TIME_OPTIONS_DEFAULT,
      daySpan: {
        fromValue: '0',
        fromDirection: '-1',
        toValue: '30',
        toDirection: '1',
      },
      selectAllTime: true,
      prevNextOptions: [
        {
          code: '-1',
          label: '前',
        },
        {
          code: '1',
          label: '後',
        },
      ],
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
          id: 'day_id_attr',
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
          id: 'fromValue',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'toValue',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'day_of_week_config',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'day_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'disp_time',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required02'),
            },
          ],
        },
        {
          id: 'hour_id_attr',
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
          id: 'hour_class_attr',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'minute_id_attr',
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
          id: 'minute_class_attr',
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
      disabledState: [
        {
          disp_time: true,
          hour_id_attr: true,
          hour_class_attr: true,
        },
        {
          minute_unit: true,
          minute_id_attr: true,
          minute_class_attr: true,
        },
        {},
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.daySpan.fromValue = String(
      Math.abs(this.partsData.day.parts_attr.day_from)
    )
    this.daySpan.fromDirection =
      this.partsData.day.parts_attr.day_from > 0 ? '1' : '-1'
    this.daySpan.toValue = String(
      Math.abs(this.partsData.day.parts_attr.day_to)
    )
    this.daySpan.toDirection =
      this.partsData.day.parts_attr.day_to < 0 ? '-1' : '1'
  },
  mounted() {
    this.checkValidation()
  },
  methods: {
    ...mapMutations('form/editFormSettings', ['setReflectButtonDisabledFlg']),
    getFormItemParams() {
      return this.formItems.map((p) => {
        const params = {}
        for (const key in p) {
          if (key === 'validation') {
            params[key] = this.getValidationParam(p.id, p[key])
          } else {
            params[key] = p[key]
          }
        }
        return params
      })
    },
    getValidationParam(id, validation) {
      const dispConfig = this.partsData.parts_attr.disp_config
      let isDisabled = false
      for (let i = this.disabledState.length - 1; i >= 0; i--) {
        if (this.disabledState[i][id]) {
          isDisabled = true
        }
        if (i <= dispConfig) {
          break
        }
      }

      return validation.filter((v) => {
        if (v.type === 'required') {
          if (isDisabled) {
            return false
          }
        }
        return true
      })
    },
    /**
     * バリデーションチェック、適用ボタン活性・非活性フラグの変更
     */
    checkValidation() {
      let result = false
      const validationItems = {
        title: this.partsData.title,
        day_id_attr: this.partsData.day.id_attr,
        fromValue: this.daySpan.fromValue,
        toValue: this.daySpan.toValue,
        day_of_week_config: this.partsData.day.parts_attr.day_of_week_config,
        day_class_attr: this.partsData.day.class_attr,
        disp_time: this.partsData.hour.parts_attr.disp_time,
        hour_id_attr: this.partsData.hour.id_attr,
        hour_class_attr: this.partsData.hour.class_attr,
        minute_id_attr: this.partsData.minute.id_attr,
        minute_class_attr: this.partsData.minute.class_attr,
        parts_id_attr: this.partsData.parts_id_attr,
        parts_class_attr: this.partsData.parts_class_attr,
      }

      const formItems = this.getFormItemParams()

      for (const key in validationItems) {
        if (
          this.$common.checkExistValidation(
            formItems,
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
    updateInputDay() {
      this.checkValidation()
      this.updateDay()
    },
    /**
     * 期間設定の日付の前後セレクトボックスの変更処理
     */
    updateDay() {
      this.partsData.day.parts_attr.day_from =
        Number(this.daySpan.fromValue) * Number(this.daySpan.fromDirection)
      this.partsData.day.parts_attr.day_to =
        Number(this.daySpan.toValue) * Number(this.daySpan.toDirection)
    },
    /**
     * 表示時間 時間のチェックボックス押下処理
     */
    updateDispTime() {
      if (
        this.partsData.hour.parts_attr.disp_time.length ===
        this.DISPLAY_TIME_OPTIONS_DEFAULT.length
      ) {
        this.selectAllTime = true
      } else {
        this.selectAllTime = false
      }

      this.checkValidation()
    },
    /**
     * 表示時間 すべてチェック押下処理
     */
    checkSelectAllTime() {
      if (this.selectAllTime) {
        this.partsData.hour.parts_attr.disp_time = this.DISPLAY_TIME_OPTIONS_DEFAULT
      } else {
        this.partsData.hour.parts_attr.disp_time = []
      }

      this.checkValidation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/form/edit/formEditPartsDetailModal.scss';
</style>
