<template>
  <div class="loading">
    <div class="loading-block">
      <LoadingImage class="loading-image" />
      読み込み中
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  data() {
    return {
      loading: false,
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(45, 45, 45, 0.32);
  z-index: 2000000;
  &-block {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    padding: 32px;
    left: 0;
    right: 0;
    margin: auto;
    width: 200px;
    height: 178px;
    background: #ffffff;
    border-radius: 8px;
  }
  &-image {
    width: 150px;
  }
}
</style>
