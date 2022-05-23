<template>
  <div>
    <div
      v-for="(sideNav, index) in sideNavData['community'].sideNaviItems"
      :key="index"
    >
      <ul class="toolBar">
        <li v-for="nav in sideNav.link" :key="nav.name" class="btn">
          <nuxt-link v-if="nav.path" :to="nav.path" class="btn-inner">
            <AccessTimeFilledSVG
              v-if="isPCSize === false && nav.name === 'タイムライン'"
              class="icon icon-accessTimeFilled"
            />
            <SupervisorAccountSVG
              v-if="isPCSize === false && nav.name === 'グループ'"
              class="icon icon-supervisorAccount"
            />
            <PersonBlackSVG
              v-if="isPCSize === false && nav.name === 'プロフィール'"
              class="icon icon-personBlack"
            />
            <HubBlackSVG
              v-if="isPCSize === false && nav.name === 'つながり'"
              class="icon icon-hubBlack"
            />
            <SpeechBalloonBlackSVG
              v-if="isPCSize === false && nav.name === 'メッセージ'"
              class="icon icon-speechBalloonBlack"
            />
            {{ nav.name }}
            <span
              v-if="
                nav.name === 'つながり' &&
                $common.checkArrayValue(myConnectionRequestList)
              "
              ><span class="connection-request">{{
                myConnectionRequestList.length
              }}</span></span
            ></nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CommunityToolBar',
  components: {},
  data() {
    return {
      windowWidth: null,
    }
  },
  computed: {
    ...mapState('common', ['sideNavData']),
    ...mapState('community/common', ['myConnectionRequestList', 'isPCSize']),
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.toolBar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  align-items: center;
  background: #ffffff;
  border-top: #e5e5e5 1px solid;
  z-index: 10;
  @include mq(sp) {
    width: 100vw;
  }
  li {
    width: calc(100% / 3);
    @include mq(sp) {
      width: 100%;
      position: relative;
      border-radius: 0;
    }
    height: 100%;
    border-right: #e5e5e5 1px solid;
    &:last-child {
      border: none;
    }
    .btn-inner {
      display: block;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      @include mq(sp) {
        flex-direction: column;
      }
    }
  }
  .connection-request {
    background: #4f7df0;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    @include mq(pc) {
      width: 24px;
      height: 24px;
      font-size: 12px;
    }
    @include mq(sp) {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      font-size: 10px;
    }
  }
}
</style>
