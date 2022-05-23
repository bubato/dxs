<template>
  <div class="component-icon">
    <LayoutParts2
      v-if="partsId === 'layout-2'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'シングルパーツを2列で表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <LayoutParts3
      v-if="partsId === 'layout-3'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'シングルパーツを3列で表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
    <LayoutParts4
      v-if="partsId === 'layout-4'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'シングルパーツを4列で表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
  </div>
</template>

<script>
import LayoutParts2 from '~/assets/svg/editor/layoutparts_2.svg'
import LayoutParts3 from '~/assets/svg/editor/layoutparts_3.svg'
import LayoutParts4 from '~/assets/svg/editor/layoutparts_4.svg'

export default {
  name: 'LayoutComponentIcon',
  components: {
    LayoutParts2,
    LayoutParts3,
    LayoutParts4,
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
