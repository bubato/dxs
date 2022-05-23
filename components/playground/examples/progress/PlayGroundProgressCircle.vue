<template>
  <div>
    <div class="circle-container">
      <div class="circle-bg"></div>
      <!-- right -->
      <div class="square square-right">
        <div class="square" :style="rightAngle">
          <transition appear>
            <div v-if="show" class="circle-inner square-left"></div>
          </transition>
        </div>
      </div>
      <div class="circle-text">
        {{ percentView }}
      </div>
      <!-- left -->
      <div class="square" style="left: 0">
        <div class="square" :style="[leftAngle]">
          <transition appear>
            <div v-if="show" class="circle-inner square-right"></div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
      required: false,
    },
    percent: {
      type: Number,
      default: 70,
      required: false,
    },
  },
  computed: {
    percentView() {
      return `${this.percent}%`
    },
    currentAngle() {
      return Math.floor((360 * this.percent) / 100)
    },
    rightAngle() {
      const angle = Math.min(this.currentAngle, 180)
      return {
        right: '100%',
        'transform-origin': '100% 50%',
        transform: `rotate(${angle}deg)`,
      }
    },
    leftAngle() {
      const angle = Math.min(Math.max(this.currentAngle - 180, 0), 180)
      return {
        left: '100%',
        'transform-origin': '0 50%',
        transform: `rotate(${angle}deg)`,
      }
    },
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.square {
  &-right {
    right: 0;
  }
  &-left {
    left: 0;
  }
  position: absolute;
  width: 100px;
  height: 200px;
  overflow: hidden;
}
.circle {
  &-container {
    position: relative;
    width: 200px;
    height: 200px;
  }
  &-inner {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 10px solid lightskyblue;
    &:before {
      border-radius: 10px;
    }
  }
  &-text {
    position: absolute;
    width: 200px;
    line-height: 200px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }
  &-bg {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 10px solid lightgray;
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translate3d(0, -30px, 0);
  transition: opacity 0.5s, transform 0.5s;
}
</style>
