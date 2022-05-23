<template>
  <div class="form-edit-parts">
    <div class="edit-parts-list">
      <div class="accordion base-parts-list">
        <div class="btn" @click="showBasePartsFlg = !showBasePartsFlg">
          シングルパーツ
          <ExpandMoreSVG
            v-if="!showBasePartsFlg"
            class="icon icon-more icon-expandMore"
          />
          <ExpandLessSVG v-else class="icon icon-less icon-expandLess" />
        </div>
        <div v-if="showBasePartsFlg" class="accordion-block">
          <draggable
            tag="ul"
            :group="{ name: 'selectParts', pull: 'clone', put: false }"
            v-bind="dragOptions"
            ghost-class="ghost"
            :sort="false"
            @start="dragStart($event, 'baseParts')"
            @end="onDragEndPartsArea"
          >
            <li
              v-for="(parts, index) in baseParts"
              :id="parts.id"
              :key="index"
              :class="{ disabled: checkExistAttachingFileParts(parts.id) }"
              @mouseover="$common.setAreaLabel($event, 'top', parts.areaLabel)"
              @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')"
            >
              <component :is="parts.icon" class="icon" />
              <p>{{ parts.name }}</p>
            </li>
          </draggable>
        </div>
      </div>
      <div class="accordion set-parts-list">
        <div class="btn" @click="showSetPartsFlg = !showSetPartsFlg">
          セットパーツ
          <ExpandMoreSVG
            v-if="!showSetPartsFlg"
            class="icon icon-more icon-expandMore"
          />
          <ExpandLessSVG v-else class="icon icon-less icon-expandLess" />
        </div>
        <div v-if="showSetPartsFlg" class="accordion-block">
          <draggable
            tag="ul"
            :group="{ name: 'selectParts', pull: 'clone', put: false }"
            v-bind="dragOptions"
            ghost-class="ghost"
            :sort="false"
            @start="dragStart($event, 'setParts')"
            @end="onDragEndPartsArea"
          >
            <li
              v-for="(parts, index) in setParts"
              :id="parts.id"
              :key="index"
              @mouseover="$common.setAreaLabel($event, 'top', parts.areaLabel)"
              @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')"
            >
              <component :is="parts.icon" class="icon" />
              <p>{{ parts.name }}</p>
            </li>
          </draggable>
        </div>
      </div>
    </div>
    <draggable
      ref="selectPartsList"
      v-model="showSelectParts"
      tag="ul"
      class="edit-parts-select dropPoint"
      handle=".move-field"
      group="selectArea"
      @drop.native.prevent="dragEnd()"
      @dragover.native.prevent="onDragOver($event)"
      @dragleave.native.prevent="onDragLeave($event)"
    >
      <transition-group name="parts-list">
        <li
          v-for="(parts, index) in showSelectPartsInteranl"
          :key="parts.sequence"
          class="edit-parts-select-data"
          :class="{ clone: parts.clone }"
          @mousemove.prevent
        >
          <div class="move-field">
            <DehazeSVG class="icon icon-dehaze" />
          </div>
          <div class="parts-info" @click="editPartsDetail(index)">
            <template v-if="getSelectPartsItem('required', parts) !== null">
              <RequiredFormLabel
                :label="getSelectPartsItem('title', parts)"
                :required="getSelectPartsItem('required', parts)"
              />
            </template>
            <template v-else>
              <p class="title">
                {{ getOriginalPartsName(parts.partsKind, parts.id) }}
              </p>
            </template>
            <ul class="parts-info-detail">
              <li>{{ getSelectPartsItem('name', parts) }}</li>
              <li>{{ getSelectPartsItem('kind', parts) }}</li>
              <li>
                <p v-show="parts.id !== 'step'">
                  name={{ getSelectPartsItem('tagId', parts) }}
                </p>
              </li>
            </ul>
          </div>
          <div class="cancel-field" @click="showDeleteFormPartsModal(index)">
            <CancelSVG
              class="icon icon-cancel"
              @mouseover="$common.setAreaLabel($event, 'top', '削除')"
              @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')"
            />
          </div>
        </li>
      </transition-group>
    </draggable>
    <FormEditPartsDetailModal
      v-if="showFormEditPartsDetailModalState"
      @reflect="reflectValue($event)"
      @close="setShowFormEditPartsDetailModalState(false)"
    />
    <DeletePartsModal
      v-if="showDeleteFormPartsModalFlg"
      @delete="deleteFormParts()"
      @close="hideDeleteFormPartsModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import {
  DAY_OF_WEEK_CONFIG_DEFAULT,
  DISPLAY_TIME_OPTIONS_DEFAULT,
} from '~/assets/js/form/f-6m-constants'
import StepSVG from '~/assets/svg/form/step.svg'
import TextFieldSVG from '~/assets/svg/form/textField.svg'
import TextAreaSVG from '~/assets/svg/form/textArea.svg'
import RadioButtonSVG from '~/assets/svg/form/radioButton.svg'
import CheckboxSVG from '~/assets/svg/form/checkbox.svg'
import SelectboxSVG from '~/assets/svg/form/selectbox.svg'
import Heading1SVG from '~/assets/svg/form/heading1.svg'
import Heading2SVG from '~/assets/svg/form/heading2.svg'
import TextSVG from '~/assets/svg/form/text.svg'
import SeparatorSVG from '~/assets/svg/form/separator.svg'
import AttachingFileSVG from '~/assets/svg/form/attachingFile.svg'
import NewsPermissionSVG from '~/assets/svg/form/newsPermission.svg'
import TermsAndConditionsDisplaySVG from '~/assets/svg/form/termsAndConditionsDisplay.svg'
import SpacerSVG from '~/assets/svg/form/spacer.svg'
import NewPageSVG from '~/assets/svg/form/newPage.svg'
import ParameterSVG from '~/assets/svg/form/parameter.svg'
import PrefecturesSVG from '~/assets/svg/form/prefectures.svg'
import GenderSVG from '~/assets/svg/form/gender.svg'
import NameSVG from '~/assets/svg/form/name.svg'
import MailAddressSVG from '~/assets/svg/form/mailAddress.svg'
import BirthdaySVG from '~/assets/svg/form/birthday.svg'
import YearMonthSVG from '~/assets/svg/form/yearMonth.svg'
import DateSVG from '~/assets/svg/form/date.svg'
import AddressSVG from '~/assets/svg/form/address.svg'

export default {
  name: 'FormEditParts',
  components: {
    draggable,
    StepSVG,
    TextFieldSVG,
    TextAreaSVG,
    RadioButtonSVG,
    CheckboxSVG,
    SelectboxSVG,
    Heading1SVG,
    Heading2SVG,
    TextSVG,
    SeparatorSVG,
    AttachingFileSVG,
    NewsPermissionSVG,
    TermsAndConditionsDisplaySVG,
    SpacerSVG,
    NewPageSVG,
    ParameterSVG,
    PrefecturesSVG,
    GenderSVG,
    NameSVG,
    MailAddressSVG,
    BirthdaySVG,
    YearMonthSVG,
    DateSVG,
    AddressSVG,
  },
  props: {
    selectParts: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      showDeleteFormPartsModalFlg: false,
      showBasePartsFlg: true,
      showSetPartsFlg: true,
      showSelectPartsInteranl: [],
      listOffsetInfo: null,
      isDropOverEnter: false,
      sequence: 0,
      baseParts: [
        {
          icon: 'StepSVG',
          id: 'step',
          name: 'ステップ',
          areaLabel: 'フォーム画面のステップを表示するパーツです。',
          partsData: {
            parts_attr: {
              input_scrn: '入力',
              confirm_scrn: '確認',
              complete_scrn: '完了',
            },
          },
        },
        {
          icon: 'TextFieldSVG',
          id: 'textField',
          name: 'テキストフィールド',
          areaLabel: '1行のテキスト入力項目を表示するパーツです。',
          tagId: '',
          partsData: {
            title: 'テキストフィールド',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: 'parts_class',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              placeholder: '',
              width: 100,
              width_unit: '0',
              char_limit: null,
              char_const: '0',
            },
          },
        },
        {
          icon: 'TextAreaSVG',
          id: 'textArea',
          name: 'テキストエリア',
          areaLabel: '複数行のテキスト入力項目を表示するパーツです。',
          tagId: '',
          partsData: {
            title: 'テキストエリア',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              placeholder: '',
              width: 100,
              width_unit: '0',
              height: 1,
              char_limit: null,
              char_const: '0',
            },
          },
        },
        {
          icon: 'RadioButtonSVG',
          id: 'radioButton',
          name: 'ラジオボタン',
          areaLabel: '単一選択の項目を表示するパーツです。',
          tagId: '',
          partsData: {
            title: 'ラジオボタン',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              direction: '0',
            },
            options: [
              {
                opt_kbn: '0',
                opt_label: '選択肢1',
                opt_value: '1',
              },
              {
                opt_kbn: '0',
                opt_label: '選択肢2',
                opt_value: '2',
              },
              {
                opt_kbn: '0',
                opt_label: '選択肢3',
                opt_value: '3',
              },
            ],
          },
        },
        {
          icon: 'CheckboxSVG',
          id: 'checkbox',
          name: 'チェックボックス',
          areaLabel: '複数選択の項目を表示するパーツです。',
          tagId: '',
          partsData: {
            title: 'チェックボックス',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              direction: '0',
            },
            options: [
              {
                opt_kbn: '0',
                opt_label: '選択肢1',
                opt_value: '1',
              },
              {
                opt_kbn: '0',
                opt_label: '選択肢2',
                opt_value: '2',
              },
              {
                opt_kbn: '0',
                opt_label: '選択肢3',
                opt_value: '3',
              },
            ],
          },
        },
        {
          icon: 'SelectboxSVG',
          id: 'selectbox',
          name: 'セレクトボックス',
          areaLabel: '単一選択の項目をプルダウンで表示するパーツです。',
          tagId: '',
          partsData: {
            title: 'セレクトボックス',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              direction: '1',
            },
            options: [
              {
                opt_kbn: '0',
                opt_label: '選択肢1',
                opt_value: '1',
              },
              {
                opt_kbn: '0',
                opt_label: '選択肢2',
                opt_value: '2',
              },
              {
                opt_kbn: '0',
                opt_label: '選択肢3',
                opt_value: '3',
              },
            ],
          },
        },
        {
          icon: 'Heading1SVG',
          id: 'heading1',
          name: '見出し（h1）',
          areaLabel: '大見出しを表示するパーツです。',
          tagId: '',
          partsData: {
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              heading: '大見出し',
            },
          },
        },
        {
          icon: 'Heading2SVG',
          id: 'heading2',
          name: '見出し（h2）',
          areaLabel: '中見出しを表示するパーツです。',
          tagId: '',
          partsData: {
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              heading: '中見出し',
            },
          },
        },
        {
          icon: 'TextSVG',
          id: 'text',
          name: 'テキスト',
          areaLabel: 'テキストを表示するパーツです。',
          tagId: '',
          partsData: {
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              text: '説明文が入ります',
              arrangement: '0',
            },
          },
        },
        {
          icon: 'SeparatorSVG',
          id: 'separator',
          name: '区切り線',
          areaLabel: '区切り線を表示するパーツです。',
          tagId: '',
          partsData: {
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {},
          },
        },
        {
          icon: 'NewsPermissionSVG',
          id: 'newsPermission',
          name: 'お知らせ許諾',
          areaLabel: 'メルマガなどの配信許諾を得るためのパーツです。',
          tagId: '',
          partsData: {
            title: 'お知らせの配信の許諾',
            required_flg: true,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              direction: '0',
            },
            options: [
              {
                opt_kbn: '0',
                opt_label: '希望する',
                opt_value: '1',
              },
              {
                opt_kbn: '0',
                opt_label: '希望しない',
                opt_value: '0',
              },
            ],
          },
        },
        {
          icon: 'TermsAndConditionsDisplaySVG',
          id: 'termsAndConditionsDisplay',
          name: '規約表示',
          areaLabel: '規約への同意確認を得るためのパーツです。',
          tagId: '',
          partsData: {
            title: '個人情報保護方針',
            required_flg: true,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              label: '個人情報保護方針に同意する',
            },
          },
        },
        {
          icon: 'SpacerSVG',
          id: 'spacer',
          name: 'スペーサー',
          areaLabel: '空白を表示するパーツです。',
          tagId: '',
          partsData: {
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {},
          },
        },
        {
          icon: 'NewPageSVG',
          id: 'newPage',
          name: '改ページ',
          areaLabel: '画面を分割して表示するパーツです。',
          tagId: '',
          partsData: {
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              label_next: '次へ',
              label_prev: '戻る',
            },
          },
        },
      ],
      setParts: [
        {
          icon: 'PrefecturesSVG',
          id: 'prefectures',
          name: '都道府県',
          areaLabel: '都道府県を入力するパーツです。',
          tagId: '',
          partsData: {
            title: '都道府県',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              customize_options_flg: false,
            },
          },
        },
        {
          icon: 'GenderSVG',
          id: 'gender',
          name: '性別',
          areaLabel: '性別を入力するパーツです。',
          tagId: '',
          partsData: {
            title: '性別',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            options: [
              {
                opt_label: '男性',
                opt_value: '男性',
              },
              {
                opt_label: '女性',
                opt_value: '女性',
              },
              {
                opt_label: 'その他',
                opt_value: 'その他',
              },
            ],
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              customize_options_flg: false,
              direction: '0',
            },
          },
        },
        {
          icon: 'NameSVG',
          id: 'name',
          name: 'お名前',
          areaLabel: 'お名前を入力するパーツです。',
          tagId: '',
          partsData: {
            title: 'お名前',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              input_method: '0',
              input_kana_flg: '1',
            },
            name_last_name: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '氏',
                placeholder: '入力例：佐藤',
              },
            },
            name_first_name: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '名',
                placeholder: '入力例：太郎',
              },
            },
            name_last_name_kana: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '氏（ふりがな）',
                char_const: '0',
                placeholder: '入力例：さとう',
              },
            },
            name_first_name_kana: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '名（ふりがな）',
                char_const: '0',
                placeholder: '入力例：たろう',
              },
            },
            name_full_name: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '氏名',
                placeholder: '入力例：佐藤 太郎',
              },
            },
            name_full_name_kana: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '氏名（ふりがな）',
                char_const: '0',
                placeholder: '入力例：さとう たろう',
              },
            },
          },
        },
        {
          icon: 'MailAddressSVG',
          id: 'mailAddress',
          name: 'メールアドレス',
          areaLabel: 'メールアドレスを入力するパーツです。',
          tagId: '',
          partsData: {
            title: 'メールアドレス',
            required_flg: false,
            id_attr: '',
            class_attr: '',
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              mail_confirm_flg: false,
              placeholder: '入力例：account@tanaka.co.jp',
            },
            confirm_email: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                placeholder: '同じメールアドレスを入力してください',
              },
            },
          },
        },
        {
          icon: 'BirthdaySVG',
          id: 'birthday',
          name: '生年月日',
          areaLabel: '生年月日を入力するパーツです。',
          tagId: '',
          partsData: {
            title: '生年月日',
            required_flg: false,
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
            },
            year: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                year_from: '18',
                year_to: '80',
                year_default: '20',
              },
            },
            month: {
              id_attr: '',
              class_attr: '',
            },
            day: {
              id_attr: '',
              class_attr: '',
            },
          },
        },
        {
          icon: 'YearMonthSVG',
          id: 'yearMonth',
          name: '年月',
          areaLabel: '年月を入力するパーツです。',
          tagId: '',
          partsData: {
            title: '年月',
            required_flg: false,
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              select_month_flg: true,
            },
            year: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                year_from: '10',
                year_to: '0',
              },
            },
            month: {
              id_attr: '',
              class_attr: '',
            },
          },
        },
        {
          icon: 'DateSVG',
          id: 'date',
          name: '日付',
          areaLabel: '日付を入力するパーツです。',
          tagId: '',
          partsData: {
            title: '日付',
            required_flg: false,
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
              disp_config: '0',
              calendar_flg: '0',
            },
            day: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                day_from: 1,
                day_to: 3,
                day_of_week_config: DAY_OF_WEEK_CONFIG_DEFAULT,
              },
            },
            hour: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                disp_time: DISPLAY_TIME_OPTIONS_DEFAULT,
              },
            },
            minute: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                minute_unit: '1',
              },
            },
          },
        },
        {
          icon: 'AddressSVG',
          id: 'address',
          name: '住所',
          areaLabel: '住所を入力するパーツです。',
          tagId: '',
          partsData: {
            title: '住所',
            required_flg: false,
            parts_id_attr: '',
            parts_class_attr: '',
            parts_attr: {
              annotation_pos: '0',
              annotation: '',
            },
            postal_code_attr: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '郵便番号',
                placeholder: '入力例：1234567（ハイフンは不要です）',
              },
            },
            auto_fill_btn_attr: {
              class_attr: '',
              parts_attr: {
                label: '住所検索',
              },
            },
            prefecture_attr: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '都道府県',
              },
            },
            city_attr: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '市区町村',
                placeholder: '',
              },
            },
            street_address_attr: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '番地',
                placeholder: '',
              },
            },
            building_name_attr: {
              id_attr: '',
              class_attr: '',
              parts_attr: {
                label: '建物名',
                placeholder: '',
              },
            },
          },
        },
      ],
      selectPartsIndex: null,
      selectDragComponent: [],
      dragComponent: {},
      dragTarget: {},
      dragTargetInfo: {},
    }
  },
  computed: {
    ...mapState('form/editFormSettings', [
      'editFormData',
      'selectPartsInfo',
      'showFormEditPartsDetailModalState',
    ]),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
    /**
     * 既にファイル添付パーツが設定されている場合は、
     */
    checkExistAttachingFileParts() {
      return (partsId) => {
        let result = false

        if (partsId === 'attachingFile') {
          if (
            this.showSelectPartsInteranl.find(
              (data) => data.id === 'attachingFile'
            )
          ) {
            result = true
          }
        }

        return result
      }
    },
    getOriginalPartsName() {
      return (partsKind, partsId) => {
        const showPartsName = this.getPartsInfo(partsKind, partsId).name

        return showPartsName
      }
    },
    /**
     * IDに紐づくパーツ名の取得
     */
    getSelectPartsItem() {
      return (partsItem, partsInfo) => {
        let returnItem = null

        if (partsItem === 'kind') {
          if (partsInfo.partsKind === 'baseParts') {
            returnItem = 'ベースパーツ'
          } else if (partsInfo.partsKind === 'setParts') {
            returnItem = 'セットパーツ'
          }
        } else if (partsItem === 'title') {
          returnItem = partsInfo.partsData.title || partsInfo.name
        } else if (partsItem === 'name') {
          returnItem = partsInfo.name
        } else if (partsItem === 'tagId') {
          returnItem = partsInfo.partsData.parts_id_attr
        } else if (partsItem === 'required') {
          if (
            partsInfo.partsData.required_flg === true ||
            partsInfo.partsData.required_flg === false
          ) {
            returnItem = partsInfo.partsData.required_flg
          } else {
            returnItem = null
          }
        }

        return returnItem
      }
    },
    showSelectParts: {
      get() {
        return this.showSelectPartsInteranl
      },
      set(value) {
        const org = JSON.parse(JSON.stringify(value))
        this.showSelectPartsInteranl = org
        value.forEach((e) => {
          delete e.sequence
        })
        this.$emit('update', value)
      },
    },
  },
  watch: {
    selectParts(value) {
      this.showSelectPartsInteranl = JSON.parse(JSON.stringify(value)).map(
        (e) => {
          const sequence = this.showSelectPartsInteranl.length
            ? this.showSelectPartsInteranl.shift().sequence
            : this.generateSequence()
          e.sequence = sequence
          return e
        }
      )
    },
  },
  created() {},
  mounted() {
    this.showSelectPartsInteranl = JSON.parse(
      JSON.stringify(this.selectParts)
    ).map((e) => {
      e.sequence = this.generateSequence()
      return e
    })
  },
  methods: {
    ...mapMutations('form/editFormSettings', [
      'setSelectPartsInfo',
      'showFormEditPartsDetailModal',
      'hideFormEditPartsDetailModal',
      'setShowFormEditPartsDetailModalState',
    ]),
    getDropAreaOffsets() {
      // let prevBottom = 0
      let listOffsetY = 0
      let hasClone = false
      // let text = '#getDropAreaOffsets : FormEditParts'
      const offsetList = this.$refs.selectPartsList.$children[0].children.map(
        (e, index) => {
          const cell = e.elm
          const rect = cell.getBoundingClientRect()

          let yOffset = 0
          if (index > 0) {
            const style = getComputedStyle(cell)
            const marginSize =
              (parseFloat(style.marginTop) || 0) +
              (parseFloat(style.marginBottom) || 0)

            yOffset = marginSize
          } else {
            listOffsetY = rect.top
          }
          const isClone = cell.classList.contains('clone')
          if (isClone) {
            hasClone = true
          }
          return {
            yOffset,
            height: rect.height,
            isClone,
          }
        }
      )

      return {
        listOffsetY,
        hasClone,
        offsetList,
      }
    },
    dragPointToIndex(mouseEvent, offsetInfo) {
      let y = mouseEvent.clientY
      y -= offsetInfo.listOffsetY

      let index = -1
      const count = offsetInfo.offsetList.length - 1
      offsetInfo.offsetList.some((cell, i) => {
        if (y <= (cell.yOffset + cell.height) * 1.0) {
          index = i
          return true
        }
        if (i === count) {
          if (offsetInfo.hasClone) {
            index = i
          } else {
            index = i + 1
          }
          return true
        }
        y -= cell.yOffset + cell.height
      })
      return index
    },
    /**
     * ドラッグイベント
     *
     * @param {object} e イベントオブジェクト
     */
    dragStart(e, partsKind) {
      this.isDropOverEnter = false
      const partsId = e.item.getAttribute('id')
      const partsInfo = this.getPartsInfo(partsKind, partsId)

      this.dragComponent = {
        sequence: this.generateSequence(),
        partsKind,
        id: partsId,
        name: partsInfo.name,
        tagId: partsInfo.tagId,
        partsData: partsInfo.partsData,
      }
    },
    dragEnd() {
      if (!this.dragComponent.id) {
        return false
      }
      this.dragComponent = {}
      this.addComponent()
    },
    onDragEndPartsArea() {
      this.dragComponent = {}
      this.deleteCloneComponent()
    },
    /**
     * ドラッグオーバーイベント
     *
     * クローンコンポーネントを作成関数を呼び出す
     *
     * @param {e} object ドラッグオブジェクト
     */
    onDragOver(e) {
      if (!this.dragComponent.id) {
        return false
      }

      if (!this.isDropOverEnter) {
        this.isDropOverEnter = true
        this.dragComponent.clone = true

        const listOffsetInfo = this.getDropAreaOffsets()
        this.dragTargetInfo.index = this.dragPointToIndex(e, listOffsetInfo)

        let newSelectParts = JSON.parse(
          JSON.stringify(this.showSelectPartsInteranl)
        )
        newSelectParts = newSelectParts.filter((parts) => {
          return !parts.clone
        })
        newSelectParts.splice(this.dragTargetInfo.index, 0, this.dragComponent)
        this.showSelectPartsInteranl = newSelectParts

        this.$nextTick(() => {
          this.listOffsetInfo = this.getDropAreaOffsets()
        })
      } else {
        const targetIndex = this.dragPointToIndex(e, this.listOffsetInfo)
        if (targetIndex !== this.dragTargetInfo.index) {
          const offsetList = []
          const cloneInfo = this.listOffsetInfo.offsetList.find(
            (e) => !!e.clone
          )

          this.listOffsetInfo.offsetList.forEach((cell, i) => {
            if (i === targetIndex) {
              offsetList.push(cloneInfo)
            }
            if (!cell.clone) {
              offsetList.push(cell)
            }
          })
          // this.listOffsetInfo.offsetList = offsetList // @

          this.dragTargetInfo.index = targetIndex

          let newSelectParts = JSON.parse(
            JSON.stringify(this.showSelectPartsInteranl)
          )
          newSelectParts = newSelectParts.filter((parts) => {
            return !parts.clone
          })
          newSelectParts.splice(
            this.dragTargetInfo.index,
            0,
            this.dragComponent
          )
          this.showSelectPartsInteranl = newSelectParts
        }
      }
    },
    /**
     * コンポーネント追加関数
     */
    addComponent() {
      let newSelectParts = JSON.parse(
        JSON.stringify(this.showSelectPartsInteranl)
      )

      // cloneがなければ、return
      if (newSelectParts.findIndex((item) => item.clone) < 0) {
        return
      }

      newSelectParts = this.getAddIdSelectParts(newSelectParts)

      newSelectParts = newSelectParts.map((parts) => {
        delete parts.clone

        return parts
      })

      this.showSelectParts = newSelectParts
    },
    generateSequence() {
      return this.sequence++
    },
    /**
     * ID情報に現在時刻のエポックタイムを設定
     */
    getAddIdSelectParts(selectParts) {
      const newSelectParts = JSON.parse(JSON.stringify(selectParts))
      const targtIndex = newSelectParts.findIndex((item) => item.clone)
      const currentDate = new Date()
      const epochTime = Math.floor(currentDate.getTime() / 1000)

      if (targtIndex < 0) {
        return newSelectParts
      }

      if (
        this.$common.checkHasOwnProperty(
          newSelectParts[targtIndex].partsData,
          'id_attr'
        )
      ) {
        newSelectParts[targtIndex].partsData.id_attr =
          'xhm_' + String(epochTime)
      }
      if (
        this.$common.checkHasOwnProperty(
          newSelectParts[targtIndex].partsData,
          'parts_id_attr'
        )
      ) {
        newSelectParts[targtIndex].partsData.parts_id_attr =
          'xhm_' + String(epochTime) + '_parts'
      }

      switch (newSelectParts[targtIndex].id) {
        case 'name':
          newSelectParts[targtIndex].partsData.name_last_name.id_attr =
            'xhm_' + String(epochTime) + '_1'
          newSelectParts[targtIndex].partsData.name_first_name.id_attr =
            'xhm_' + String(epochTime) + '_2'
          newSelectParts[targtIndex].partsData.name_last_name_kana.id_attr =
            'xhm_' + String(epochTime) + '_3'
          newSelectParts[targtIndex].partsData.name_first_name_kana.id_attr =
            'xhm_' + String(epochTime) + '_4'
          newSelectParts[targtIndex].partsData.name_full_name.id_attr =
            'xhm_' + String(epochTime) + '_5'
          newSelectParts[targtIndex].partsData.name_full_name_kana.id_attr =
            'xhm_' + String(epochTime) + '_6'
          break
        case 'mailAddress':
          newSelectParts[targtIndex].partsData.confirm_email.id_attr =
            'xhm_' + String(epochTime) + '_1'
          break
        case 'birthday':
          newSelectParts[targtIndex].partsData.year.id_attr =
            'xhm_' + String(epochTime) + '_1'
          newSelectParts[targtIndex].partsData.month.id_attr =
            'xhm_' + String(epochTime) + '_2'
          newSelectParts[targtIndex].partsData.day.id_attr =
            'xhm_' + String(epochTime) + '_3'
          break
        case 'yearMonth':
          newSelectParts[targtIndex].partsData.year.id_attr =
            'xhm_' + String(epochTime) + '_1'
          newSelectParts[targtIndex].partsData.month.id_attr =
            'xhm_' + String(epochTime) + '_2'
          break
        case 'date':
          newSelectParts[targtIndex].partsData.day.id_attr =
            'xhm_' + String(epochTime) + '_1'
          newSelectParts[targtIndex].partsData.hour.id_attr =
            'xhm_' + String(epochTime) + '_2'
          newSelectParts[targtIndex].partsData.minute.id_attr =
            'xhm_' + String(epochTime) + '_3'
          break
        case 'address':
          newSelectParts[targtIndex].partsData.postal_code_attr.id_attr =
            'xhm_' + String(epochTime) + '_1'
          newSelectParts[targtIndex].partsData.prefecture_attr.id_attr =
            'xhm_' + String(epochTime) + '_2'
          newSelectParts[targtIndex].partsData.city_attr.id_attr =
            'xhm_' + String(epochTime) + '_3'
          newSelectParts[targtIndex].partsData.street_address_attr.id_attr =
            'xhm_' + String(epochTime) + '_4'
          newSelectParts[targtIndex].partsData.building_name_attr.id_attr =
            'xhm_' + String(epochTime) + '_5'
          break
        default:
          break
      }

      return newSelectParts
    },
    /**
     * クローンコンポーネント追加関数
     */
    addCloneComponent() {
      let newSelectParts = JSON.parse(
        JSON.stringify(this.showSelectPartsInteranl)
      )

      newSelectParts = newSelectParts.filter((parts) => {
        let result = true

        if (parts.clone) {
          result = false
        }

        return result
      })

      this.dragComponent.clone = true

      newSelectParts.splice(this.dragTargetInfo.index, 0, this.dragComponent)

      // this.$emit('update', newSelectParts)
      this.showSelectPartsInteranl = newSelectParts

      this.cellPositionMap = []
      this.$nextTick(() => {
        // let text = 'cells '
        this.$refs.selectPartsList.$children[0].children.some((e, index) => {
          const cell = e.elm
          // if (!cell.classList.contains('clone')) {
          const yLimit =
            cell.getBoundingClientRect().top +
            cell.getBoundingClientRect().height * 0.5
          this.cellPositionMap.push(yLimit)
        })
      })
    },
    deleteCloneComponent() {
      let newSelectParts = JSON.parse(
        JSON.stringify(this.showSelectPartsInteranl)
      )
      this.isDropOverEnter = false

      newSelectParts = newSelectParts.filter((parts) => {
        let result = true

        if (parts.clone) {
          result = false
        }

        return result
      })

      // this.$emit('update', newSelectParts)
      this.showSelectPartsInteranl = newSelectParts
    },
    isInsideDropArea(e) {
      const $el = this.$refs.selectPartsList.$el
      const rect = $el.getBoundingClientRect()

      if (e.offsetX < 0) {
        return false
      }
      if (e.offsetX >= rect.width) {
        return false
      }

      if (e.offsetY < 0) {
        return false
      }
      if (e.offsetY >= rect.height) {
        return false
      }

      return true
    },
    onDragLeave(e) {
      if (this.isInsideDropArea(e)) {
        return
      }

      this.isDropOverEnter = false

      const ua = navigator.userAgent
      if (ua.includes('Trident')) {
        // IE 11のときの挙動(ドロップ可能範囲を取得し、範囲内のときはreturn)
        const dropPoint = document.querySelector('.dropPoint')
        const clientRect = dropPoint.getBoundingClientRect()
        const drugPointY = e.pageY
        const drugPointX = e.pageX
        const minX = window.pageXOffset + clientRect.left
        const minY = window.pageYOffset + clientRect.top
        const maxX = minX + dropPoint.clientWidth
        const maxY = minY + dropPoint.clientHeight

        if (
          minY < drugPointY &&
          drugPointY < maxY &&
          minX < drugPointX &&
          drugPointX < maxX
        ) {
          return
        }
      } else if (
        !this.dragComponent.id ||
        (e.relatedTarget &&
          e.relatedTarget.closest('.edit-parts-select-data')) ||
        e.target.closest('.edit-parts-select-data')
      ) {
        return
      }
      this.dragTargetInfo = {}
      this.deleteCloneComponent()
    },
    /**
     * フォームパーツの削除
     */
    deleteFormParts() {
      const list = this.showSelectPartsInteranl
      list.splice(this.selectPartsIndex, 1)
      this.showSelectParts = list
    },
    /**
     * パーツ編集モーダルを表示
     */
    editPartsDetail(index) {
      const parts = JSON.parse(JSON.stringify(this.selectParts[index]))
      this.selectPartsIndex = index
      this.setSelectPartsInfo(parts)
      this.setShowFormEditPartsDetailModalState(true) // パーツ編集モーダルを表示
    },
    /**
     * モーダルで設定した値の反映
     */
    reflectValue(partsData) {
      const newSelectParts = JSON.parse(
        JSON.stringify(this.showSelectPartsInteranl)
      )

      newSelectParts[this.selectPartsIndex].partsData = partsData
      this.showSelectParts = newSelectParts
    },
    /**
     * 引数のパーツ種類、IDに紐づくパーツ情報の取得
     */
    getPartsInfo(partsKind, partsId) {
      const partsArray =
        partsKind === 'baseParts' ? this.baseParts : this.setParts
      let partsInfo = {}

      for (let i = 0; i < partsArray.length; i++) {
        if (partsArray[i].id === partsId) {
          partsInfo = partsArray[i]
          break
        }
      }

      return partsInfo
    },
    /**
     * パーツ削除確認モーダルの表示
     */
    showDeleteFormPartsModal(index) {
      this.selectPartsIndex = index
      this.showDeleteFormPartsModalFlg = true
    },
    /**
     * パーツ削除確認モーダルの表示
     */
    hideDeleteFormPartsModal() {
      this.showDeleteFormPartsModalFlg = false
    },
  },
}
</script>

<style lang="scss" scoped>
.form-edit-parts {
  display: flex;
  height: 560px;
  max-height: 560px;
  .edit-parts-list {
    width: 304px;
    border: 1px solid #e5e5e5;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .accordion {
      .btn {
        height: 48px;
        color: #8d8d8d;
        background: #e2e3e5;
        position: relative;
        .icon {
          position: absolute;
          right: 16px;
          width: 16px;
          height: 16px;
        }
      }
      &-block {
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 11px 16px;
          li {
            width: calc(50% - 5px);
            height: 80px;
            border: 1px solid #e5e5e5;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            cursor: pointer;
            &.disabled {
              opacity: 0.5;
              pointer-events: none;
            }
            p {
              font-size: 13px;
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
  .edit-parts-select {
    width: calc(100% - 320px);
    background: #ffffff;
    border: 1px dashed #c6c6c6;
    padding: 16px;
    margin-left: 16px;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    li.edit-parts-select-data {
      display: flex;
      align-items: center;
      background: #f7f8f9;
      border: 1px solid #c6c6c6;
      width: 100%;
      height: 96px;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      &.clone {
        opacity: 0.5;
      }
      .move-field,
      .cancel-field {
        width: 64px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .parts-info {
        width: calc(100% - 128px);
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .title {
          font-weight: 500;
        }
        &-detail {
          display: flex;
          align-items: center;
          margin-top: 8px;
          li {
            display: flex;
            align-items: center;
            width: calc(100% / 3);
            height: 32px;
            font-size: 13px;
            color: #ffffff;
            background: #6c707e;
            padding-left: 12px;
            &:not(:last-child) {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
}
.parts-list-move {
  transition: transform 0.3s;
}
</style>
