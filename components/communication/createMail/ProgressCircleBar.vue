<template>
  <div>
    <div :class="{ 'gt-50': progress > 50 }" class="progress-pie-chart">
      <div class="ppc-progress" :style="progressWrap">
        <div class="ppc-progress-fill" :style="progressCircleFill"></div>
      </div>
      <div class="ppc-percents" :style="percents">
        <div class="pcc-percents-wrapper">
          <span :style="progressCircleSpan">{{ progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircleBar',
  props: {
    progress: {
      type: Number,
      default: 0,
      required: true,
    },
    fontsize: {
      type: String,
      default: '29',
      required: false,
    },
  },
  data() {
    return {
      color: 'red',
      boxSize: 200,
      barColor: '#4f7df0',
      barBackgroundColor: '#dce5fc',
      backgroundColor: '#ffffff',
    }
  },
  computed: {
    deg() {
      return (360 * this.progress) / 100
    },
    progressWrap() {
      const rectData =
        this.progress > 50
          ? 'rect(0,' + this.boxSize / 2 + 'px,' + this.boxSize + 'px, 0)'
          : 'rect(0, ' +
            this.boxSize +
            'px, ' +
            this.boxSize +
            'px, ' +
            this.boxSize / 2 +
            'px'
      return {
        clip: rectData,
        content: '',
        position: 'absolute',
        'border-radius': '50%',
        left: 'calc(50% - ' + this.boxSize + 'px / 2)',
        top: 'calc(50% - ' + this.boxSize + 'px / 2)',
        width: this.boxSize + 'px',
        height: this.boxSize + 'px',
      }
    },
    progressCircleFill() {
      const rectData =
        this.progress > 50
          ? 'rect(0,' +
            this.boxSize +
            'px,' +
            this.boxSize +
            'px,' +
            this.boxSize / 2 +
            'px)'
          : 'rect(0, ' + this.boxSize / 2 + 'px, ' + this.boxSize + 'px, 0)'
      const backgroundData =
        this.progress > 50 ? this.barBackgroundColor : this.barColor
      return {
        clip: rectData,
        background: backgroundData,
        transform: 'rotate(' + this.deg + 'deg)',
        content: '',
        position: 'absolute',
        'border-radius': '50%',
        left: 'calc(50% - ' + this.boxSize + 'px / 2)',
        top: 'calc(50% - ' + this.boxSize + 'px / 2)',
        width: this.boxSize + 'px',
        height: this.boxSize + 'px',
      }
    },
    progressCircleSpan() {
      return {
        'font-size': this.fontsize + 'px',
      }
    },
    percents() {
      const barSize = String(this.boxSize) / 1.21 + 'px'
      return {
        content: '',
        position: 'absolute',
        'border-radius': '50%',
        left: 'calc(50% - ' + barSize + ' / 2)',
        top: 'calc(50% - ' + barSize + ' / 2)',
        width: barSize,
        height: barSize,
        background: this.backgroundColor,
        'text-align': 'center',
        display: 'table',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$barColor: #4f7df0;
$barBackgroundColor: #dce5fc;
$backgroundColor: #ffffff;

.progress-pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: $barBackgroundColor;
  position: relative;
  &.gt-50 {
    background-color: $barColor;
  }
}
.ppc-percents {
  span {
    display: block;
    font-size: 2.6em;
    font-weight: 500;
    color: $barColor;
  }
  .pcc-percents-wrapper {
    display: table-cell;
    vertical-align: middle;
    span {
      font-size: 29px;
    }
  }
}
</style>
