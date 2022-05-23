<template>
  <div class="component-icon">
    <SinglePartsH1
      v-if="partsId === 'heading1'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'ページ見出しを表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsH2
      v-if="partsId === 'heading2'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'ページの中の大見出しを表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsH3
      v-if="partsId === 'heading3'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'ページの中の中見出しを表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsH4
      v-if="partsId === 'heading4'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'ページの中の小見出しを表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsText
      v-if="partsId === 'text'"
      @mouseover="
        $common.setAreaLabel($event, 'top', 'テキストを表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsAnnotation
      v-if="partsId === 'annotation'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '注釈を表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsImage
      v-if="partsId === 'image'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '画像を表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsList
      v-if="partsId === 'list'"
      @mouseover="
        $common.setAreaLabel($event, 'top', 'リストを表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsTable
      v-if="partsId === 'table'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '表組みを表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsSeparator
      v-if="partsId === 'separator'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '区切り線を表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsBtn
      v-if="partsId === 'button'"
      @mouseover="
        $common.setAreaLabel($event, 'top', 'ボタンを表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsSpace
      v-if="partsId === 'space'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '空白を表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsMovie
      v-if="partsId === 'movie'"
      @mouseover="
        $common.setAreaLabel($event, 'top', '動画を表示するパーツです。')
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <SinglePartsAccordion
      v-if="partsId === 'accordion'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'クリックで開閉するアコーディオンを表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
  </div>
</template>

<script>
import SinglePartsH1 from '~/assets/svg/editor/singleparts_h1.svg'
import SinglePartsH2 from '~/assets/svg/editor/singleparts_h2.svg'
import SinglePartsH3 from '~/assets/svg/editor/singleparts_h3.svg'
import SinglePartsH4 from '~/assets/svg/editor/singleparts_h4.svg'
import SinglePartsText from '~/assets/svg/editor/singleparts_text.svg'
import SinglePartsAnnotation from '~/assets/svg/editor/singleparts_annotation.svg'
import SinglePartsImage from '~/assets/svg/editor/singleparts_image.svg'
import SinglePartsList from '~/assets/svg/editor/singleparts_list.svg'
import SinglePartsTable from '~/assets/svg/editor/singleparts_table.svg'
import SinglePartsSeparator from '~/assets/svg/editor/singleparts_separator.svg'
import SinglePartsBtn from '~/assets/svg/editor/singleparts_btn.svg'
import SinglePartsSpace from '~/assets/svg/editor/singleparts_space.svg'
import SinglePartsMovie from '~/assets/svg/editor/singleparts_movie.svg'
import SinglePartsAccordion from '~/assets/svg/editor/singleparts_accordion.svg'

export default {
  name: 'LayoutComponentIcon',
  components: {
    SinglePartsH1,
    SinglePartsH2,
    SinglePartsH3,
    SinglePartsH4,
    SinglePartsText,
    SinglePartsAnnotation,
    SinglePartsImage,
    SinglePartsList,
    SinglePartsTable,
    SinglePartsSeparator,
    SinglePartsBtn,
    SinglePartsSpace,
    SinglePartsMovie,
    SinglePartsAccordion,
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
