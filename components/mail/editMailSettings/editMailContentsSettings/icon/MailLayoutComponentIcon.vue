<template>
  <div class="component-icon">
    <LayoutParts1
      v-if="partsId === 'layout-1'"
      @mouseover="
        $common.setAreaLabel(
          $event,
          'top',
          'シングルパーツを1列で表示するパーツです。'
        )
      "
      @mouseleave="$common.setAreaLabel($event, '', '')"
      @blur="$common.setAreaLabel($event, '', '')"
    />
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
  </div>
</template>

<script>
import LayoutParts1 from '~/assets/svg/editor/layoutparts_2x_1.svg'
import LayoutParts2 from '~/assets/svg/editor/layoutparts_2x_2.svg'
import LayoutParts3 from '~/assets/svg/editor/layoutparts_2x_3.svg'

export default {
  name: 'MailLayoutComponentIcon',
  components: {
    LayoutParts1,
    LayoutParts2,
    LayoutParts3,
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
