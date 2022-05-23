<template>
  <div class="component-icon">
    <SetPartsMain
      v-if="partsId === 'mainArea'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'ページ上部のメインエリアに表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsBreadcrumb
      v-if="partsId === 'breadcrumb'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'ページの現在位置を示すパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsOneLineNews
      v-if="partsId === 'oneLineNews'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          '訴求したいお知らせを1行で表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsMessage
      v-if="partsId === 'message'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'メッセージやコンセプトを訴求するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsTextWithTopImages
      v-if="partsId === 'textWithTopImages'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          '画像とテキストを組み合わせたパーツです。画像が上部に配置されます。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsTextWithLeftAndRightImages
      v-if="partsId === 'textWithLeftAndRightImages'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          '画像とテキストを組み合わせたパーツです。画像が左右に配置されます。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsListDisplay
      v-if="partsId === 'listDisplay'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          '第三階層ページを一覧で表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsCompanyOverview
      v-if="partsId === 'companyOverview'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          '企業概要を表組みで表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsMap
      v-if="partsId === 'map'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '地図を表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsConversion
      v-if="partsId === 'conversion'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'お問い合わせや資料請求の導線として表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsStep
      v-if="partsId === 'step'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'お問い合わせや資料請求の導線として表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SetPartsCustomerVoice
      v-if="partsId === 'customerVoice'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'お問い合わせや資料請求の導線として表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
  </div>
</template>

<script>
import SetPartsMain from '~/assets/svg/editor/setparts_main.svg'
import SetPartsBreadcrumb from '~/assets/svg/editor/setparts_breadcrumb.svg'
import SetPartsOneLineNews from '~/assets/svg/editor/setparts_oneLineNews.svg'
import SetPartsMessage from '~/assets/svg/editor/setparts_message.svg'
import SetPartsTextWithTopImages from '~/assets/svg/editor/setparts_textWithTopImages.svg'
import SetPartsTextWithLeftAndRightImages from '~/assets/svg/editor/setparts_textWithLeftAndRightImages.svg'
import SetPartsListDisplay from '~/assets/svg/editor/setparts_listDisplay.svg'
import SetPartsCompanyOverview from '~/assets/svg/editor/setparts_companyOverview.svg'
import SetPartsMap from '~/assets/svg/editor/setparts_map.svg'
import SetPartsConversion from '~/assets/svg/editor/setparts_conversion.svg'
import SetPartsStep from '~/assets/svg/editor/setparts_step.svg'
import SetPartsCustomerVoice from '~/assets/svg/editor/setparts_customerVoice.svg'

export default {
  name: 'SetComponentIcon',
  components: {
    SetPartsMain,
    SetPartsBreadcrumb,
    SetPartsOneLineNews,
    SetPartsMessage,
    SetPartsTextWithTopImages,
    SetPartsTextWithLeftAndRightImages,
    SetPartsListDisplay,
    SetPartsCompanyOverview,
    SetPartsMap,
    SetPartsConversion,
    SetPartsStep,
    SetPartsCustomerVoice,
  },
  props: {
    partsId: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
