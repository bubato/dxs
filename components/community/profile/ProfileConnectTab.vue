<template>
  <div class="body-main-connection">
    <CustomInputText
      v-model="inputSearchText"
      placeholder="メンバーを検索"
      view-type="search"
      maxlength="50"
      @submit="setFilterText()"
    />
    <ul class="connectionSwitch">
      <li
        :class="{
          'is-act': connectionSwitch === 1,
        }"
        @click="connectionSwitchEvt(1)"
      >
        すべてのつながり
      </li>
      <li
        :class="{
          'is-act': connectionSwitch === 2,
        }"
        @click="connectionSwitchEvt(2)"
      >
        共通のつながり
      </li>
    </ul>
    <ConnectionList
      :connection-list="filterConnectionList()"
      :show-menu="false"
      :connection-switch="connectionSwitch"
      @update="$emit('update')"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProfileConnectTab',
  data() {
    return {
      inputSearchText: '',
      filterText: '',
      connectionSwitch: 1,
    }
  },
  computed: {
    // プロフィール画面用store
    ...mapState('community/profileStore', ['profilePageConnection']),
    /**
     * つながり一覧をフィルタリング
     */
    filterConnectionList() {
      return () => {
        const showConnectionList = this.profilePageConnection.filter((data) => {
          let result = false

          if (this.filterText.length > 0) {
            if (
              data.name.includes(this.filterText) ||
              data.company.includes(this.filterText)
            ) {
              result = true
            } else {
              result = false
            }
          } else {
            result = true
          }

          if (result) {
            if (this.connectionSwitch === 2 && data.connectionStatus !== 3) {
              result = false
            }
          }

          return result
        })

        return showConnectionList
      }
    },
  },
  mounted() {},
  created() {},
  methods: {
    /**
     * 「すべてのつながり」「共通のつながり」タブ切り替え
     */
    connectionSwitchEvt(cnt) {
      this.connectionSwitch = cnt
    },
    /**
     * フィルターテキストを設定
     */
    setFilterText() {
      this.filterText = JSON.parse(JSON.stringify(this.inputSearchText))
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.body-main-connection {
  width: 716px;
  margin: 0 auto;
}
// 繋がりタブ
.connectionSwitch {
  margin-top: 25px;
  margin-top: 25px;
  margin-bottom: 24px;
  color: #1e1e1e;
  font-weight: 500;
  border: #e0e0e0 1px solid;
  border-radius: 4px;
  display: inline-block;
  overflow: hidden;
  li {
    padding: 10px 15px;
    float: left;
    cursor: pointer;
    &:first-child {
      border-right: #e0e0e0 1px solid;
    }
    &.is-act {
      background: #ebeced;
    }
  }
}
// つながりリスト
.connectionList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &-cell {
    display: flex;
    position: relative;
    width: 49%;
    padding: 24px;
    border: #e5e5e5 1px solid;
    border-radius: 6px;
    margin-bottom: 2%;
    &.is-none {
      display: none !important;
    }
    &:hover {
      background: #f8f9fa;
    }

    &-img {
      padding-right: 16px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    &-text {
      flex: 1;
      p {
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .name {
        font-size: 17px;
        font-weight: 500;
        color: #1e1e1e;
      }
    }
    &-menu {
      position: absolute;
      background: #fff;
      right: 0;
      top: 0;
      transform: translate(20px, -24px);
      z-index: 10;
    }
  }
}
// アイコン設定
.icon {
  &-moreHoriz {
    width: 24px;
    height: 24px;
  }
}
// MQ
@include mq(sp) {
  //SPView
  .body-main-connection {
    width: 100%;
    padding: 0 16px;
  }
}
// MQ
</style>
