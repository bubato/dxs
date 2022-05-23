<template>
  <div class="community-side-nav">
    <CustomInputText
      v-model="inputSearchText"
      placeholder="メンバーや会社を検索"
      view-type="search"
      maxlength="50"
      @submit="transitionSearchResult($event)"
    />
    <template v-if="screenType === 0">
      <div class="advertising_area">
        <img
          :src="$common.getAssetsImgUrl('images/community/bizoceanAd.png')"
          @click="addHxdLog()"
        />
      </div>
      <BrowsingHistory />
    </template>
    <JoinGroupList v-if="screenType !== 0" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'CommunitySideNav',
  components: {},
  data() {
    return {
      inputSearchText: '',
    }
  },
  computed: {
    screenType() {
      let screenType = null
      const groupId = this.$route.params.groupId
      const currentPath =
        this.$route.path.slice(-1) === '/'
          ? this.$route.path
          : this.$route.path + '/'

      if (currentPath.startsWith('/community/group/')) {
        if (groupId) {
          screenType = 2
        } else {
          screenType = 1
        }
      } else {
        screenType = 0
      }

      return screenType
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('community/searchResult', ['setConnectionSearchText']),
    /**
     * 検索結果画面に遷移
     */
    transitionSearchResult(inputWord) {
      this.setConnectionSearchText(inputWord)
      this.inputSearchText = ''
      this.$router.push('/community/searchResults/')
    },
    /**
     * HXDにログを飛ばし、広告のリンク先に画面遷移
     */
    addHxdLog() {
      const transUrl = 'https://www.bizocean.jp/'

      window.__action = 'mdx_ad_click'
      window.__custom_param = {
        mdx_ad_media: 'community',
        mdx_ad_content: 'bizocean',
      }

      window.__push_beacon(window.__getURL())
      window.open(transUrl, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.community-side-nav {
  width: 280px;
  padding-top: 25px;
  height: calc(100vh - 80px);
  padding-top: 25px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .advertising_area {
    width: 100%;
    height: 187px;
    margin-top: 24px;
    position: relative;
    img {
      width: 100%;
      cursor: pointer;
    }
  }
}
</style>
