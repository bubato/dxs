<template>
  <div
    class="status-text"
    :class="[
      {
        'arrow-upward':
          (status === '1' && !arrowReverse) || (status === '2' && arrowReverse),
      },
      {
        'arrow-downward':
          (status === '2' && !arrowReverse) || (status === '1' && arrowReverse),
      },
      { 'arrow-stay': status === '3' },
      { 'direc-reverse': direcReverse },
    ]"
  >
    <component
      :is="stateArrow(status)"
      v-if="direcReverse"
      class="icon-arrow"
    />
    <span>
      {{ ratio }}
    </span>
    <component
      :is="stateArrow(status)"
      v-if="!direcReverse"
      class="icon-arrow"
    />
  </div>
</template>

<script>
export default {
  name: 'StatusText',
  props: {
    ratio: {
      type: String,
      default: '',
      required: true,
    },
    status: {
      type: String,
      default: '',
      required: true,
    },
    arrowReverse: {
      type: Boolean,
      default: false,
      required: false,
    },
    direcReverse: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    stateArrow() {
      return (ratioStatus) => {
        let arrow = null
        switch (ratioStatus) {
          case '1':
            arrow = 'ArrowUpwardSVG'
            break
          case '2':
            arrow = 'ArrowDownwardSVG'
            break
          case '3':
            arrow = 'ArrowForwardSVG'
            break

          default:
            break
        }
        return arrow
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.status-text {
  display: flex;
  align-items: center;
  &.arrow {
    &-upward {
      .icon-arrow {
        fill: #34c759;
        animation: 0.2s ease 0s 1 normal none running arrow_anime_upward;
      }
      span {
        color: #34c759;
      }
    }
    &-downward {
      .icon-arrow {
        fill: #ff453a;
        animation: 0.2s ease 0s 1 normal none running arrow_anime_downward;
      }
      span {
        color: #ff453a;
      }
    }
    &-stay {
      .icon-arrow {
        fill: #8a8a8e;
        animation: 0.2s ease 0s 1 normal none running arrow_anime_forward;
      }
      span {
        color: #8a8a8e;
      }
    }
  }
  span {
    font-size: 17px;
    font-weight: bold;
  }
  .icon-arrow {
    &:not(.direc-reverse) {
      margin-left: 4px;
    }
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
