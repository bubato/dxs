<template>
  <div class="footer">
    <div class="footer-nav">
      <div class="footer-nav-item">
        <a href="https://www.bizsky.io/terms/" target="_blank"
          >利用規約 <LaunchSVG class="footer-nav-icon icon-launch"
        /></a>
      </div>
      <div class="footer-nav-item">
        <a href="https://www.tribeck.jp/" target="_blank"
          >運営会社 <LaunchSVG class="footer-nav-icon icon-launch"
        /></a>
      </div>
      <div class="footer-nav-item">
        <a href="https://help.bizsky.io/" target="_blank"
          >ヘルプセンター <LaunchSVG class="footer-nav-icon icon-launch"
        /></a>
      </div>
    </div>
    <span class="footer-copyright"
      >Copyright© Tribeck Inc. All Rights Reserved.</span
    >
  </div>
</template>

<script>
export default {
  name: 'CommonFooter',
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  width: 100%;
  height: 143px;
  &-nav {
    width: calc(100% - 16px);
    max-width: 324px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-item {
      font-size: 13px;
      color: #8d8d8d;
    }
    &-icon {
      width: 16px;
      height: 16px;
      margin: 0 0 0 8px;
      fill: #8d8d8d;
    }
  }
  &-copyright {
    display: block;
    margin: 3px 0 0 0;
    text-align: center;
    font-size: 13px;
    color: #8d8d8d;
  }
}
</style>
