<template>
  <div class="flex">
    <component
      :is="getComparedArrowState(ratio)"
      :class="{
        'arrow-upward icon-arrowUpward': status === 1,
        'arrow-downward icon-arrowDownward': status === -1,
        'arrow-forward icon-arrowForward': status === 0,
      }"
    />
    <span
      :class="{
        'text-up': status === 1,
        'text-down': status === -1,
        'text-stay': status === 0,
      }"
    >
      {{ Math.abs(ratio) }}%
    </span>
  </div>
</template>

<script>
export default {
  name: 'ComparedArrowState',
  props: {
    ratio: {
      type: [Number, String],
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      status: 0,
    }
  },
  computed: {
    /**
     * 前年同月比較した際の矢印の状態
     * @param {String} ratio 比率
     */
    getComparedArrowState() {
      return (ratio) => {
        const ratioNum = Number(ratio)
        let arrow = null
        // stay
        if (ratioNum === 100) {
          arrow = 'ArrowForwardSVG'
          this.status = 0
        }
        // up
        else if (ratioNum >= 100) {
          arrow = 'ArrowUpwardSVG'
          this.status = 1
        }
        // down
        else if (ratioNum < 100) {
          arrow = 'ArrowDownwardSVG'
          this.status = -1
        }
        return arrow
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.flex {
  justify-content: flex-end;
}
.text {
  &-up {
    color: #34c759;
  }
  &-down {
    color: #ff453a;
  }
  &-stay {
    color: #8a8a8e;
  }
  font-size: 17px;
  font-weight: 500;
}
.arrow {
  &-upward {
    fill: #34c759;
    margin: 0 0 0 8px;
    width: 14px;
    height: 14px;
    animation: 0.2s ease 0s 1 normal none running arrow_anime_upward;
  }
  &-downward {
    fill: #ff453a;
    margin: 0 0 0 8px;
    width: 14px;
    height: 14px;
    animation: 0.2s ease 0s 1 normal none running arrow_anime_downward;
  }
  &-forward {
    fill: #8a8a8e;
    margin: 0 0 0 8px;
    width: 14px;
    height: 14px;
    animation: 0.2s ease 0s 1 normal none running arrow_anime_forward;
  }
}
@keyframes arrow_anime_upward {
  0% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes arrow_anime_forward {
  0% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0px);
  }
}
@keyframes arrow_anime_downward {
  0% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
