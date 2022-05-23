<template>
  <div class="main-contents">
    <div
      v-if="
        Object.keys(companyData).length > 0 && Object.keys(myProfile).length > 0
      "
      class="body"
    >
      <div class="body-header">
        <div
          class="body-header-image"
          :style="{ background: `url(${getCoverImage()})` }"
        ></div>
        <div class="body-header-profile">
          <div class="body-header-logoWrap">
            <img :src="companyLogo()" alt="" class="body-header-facePhoto" />
          </div>
        </div>
        <div class="body-header-data">
          <p class="companyName">{{ companyData.name }}</p>
        </div>
        <div
          v-if="
            $route.params.corporateId === myProfile.companyId &&
            masterData.managementFlag === 1
          "
          class="body-header-image-btnList"
        >
          <button
            class="btn btn-basic btn-middle"
            @click="transitionAccountCorporateSettings()"
          >
            アカウント設定で企業情報を編集
          </button>
          <button
            class="btn btn-basic btn-middle"
            @click="showCoverImageUploadModal()"
          >
            カバー写真を変更
          </button>
        </div>
      </div>

      <div
        v-if="$common.checkArrayValue(companyMemberList)"
        class="body-main-profile"
      >
        <div class="body-main-profile-recommended">
          <h5>コミュニティ参加メンバー</h5>
          <div class="body-main-profile-recommended-commonConnection">
            <div class="body-main-profile-recommended-commonConnection-imgList">
              <div
                v-for="member in getFilterMembers()"
                :key="member.id"
                class="body-main-profile-recommended-commonConnection-imgList-image"
                @click="showSelectUserProfile(member.userId)"
              >
                <img :src="$common.getProfileImg(member.image)" alt="" />
              </div>
              <MoreHorizSVG
                v-if="isConnectListCropDataMax"
                class="icon-moreHoriz"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="body-main-profile-cell body-main-profile-selfIntroduction">
        <div class="body-main-profile-head">
          <h3>基本情報</h3>
        </div>
        <div class="body-main-profile-selfIntroduction-tableWrap">
          <table>
            <tr>
              <th>会社名</th>
              <td>{{ companyData.basicSettings.name }}</td>
            </tr>
            <tr>
              <th>代表者名</th>
              <td>
                {{ companyData.basicSettings.lastName }}&emsp;{{
                  companyData.basicSettings.firstName
                }}
              </td>
            </tr>
            <tr>
              <th>代表電話番号</th>
              <td>{{ companyData.basicSettings.tel }}</td>
            </tr>
            <tr>
              <th>創業日</th>
              <td>
                <p v-show="companyData.detail.foundedY">
                  {{ companyData.detail.foundedY }}年
                </p>
                <p v-show="companyData.detail.foundedM">
                  {{ companyData.detail.foundedM }}月
                </p>
              </td>
            </tr>
            <tr>
              <th>従業員数</th>
              <td>
                {{
                  $common.getVersatileItem(
                    8,
                    companyData.detail.numberOfEmployees,
                    'value'
                  )
                }}
              </td>
            </tr>
            <tr>
              <th>上場区分</th>
              <td>
                {{ getListingClassificationName() }}
              </td>
            </tr>
            <tr>
              <th>売上</th>
              <td>
                <p v-show="companyData.detail.sales">
                  {{ companyData.detail.sales }}円
                </p>
              </td>
            </tr>
            <tr>
              <th>資本金</th>
              <td>
                <p v-show="companyData.detail.capital">
                  {{ companyData.detail.capital }}円
                </p>
              </td>
            </tr>
            <tr>
              <th>事業内容</th>
              <td>{{ companyData.detail.businessContent }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div
        v-if="checkGoodsAndServices()"
        class="body-main-profile-cell body-main-profile-selfIntroduction"
      >
        <div class="body-main-profile-head">
          <h3>商品・サービス</h3>
        </div>
        <div
          v-for="obj in companyData.goodsAndServices"
          :key="obj.name"
          class="body-main-profile-cell-minSec"
        >
          <h4>{{ obj.name }}</h4>
          <div class="body-main-profile-cell-minSec-content">
            <img
              v-show="obj.image"
              :src="obj.image"
              class="body-main-profile-cell-minSec-img"
              alt=""
            />
            <p class="body-main-profile-cell-minSec-txt">
              {{ obj.context }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <CoverImageUploadModal
      v-if="showCoverImageUploadModalState"
      :img-path="companyData.coverImageURL"
      :prop-record-version="companyData.recordVersion"
      :cover-type="1"
      @update="getCompanyData()"
      @close="hideCoverImageUploadModal()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import communityCommonMixin from '~/mixin/community/communityCommon.js'

export default {
  name: 'Corporate',
  components: {},
  mixins: [communityCommonMixin],
  data() {
    return {
      connectData: {},
      companyData: {},
      companyMemberList: [],
      maxShowUserNum: 5,
      showCoverImageUploadModalState: false,
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    ...mapState('community/common', ['myProfile']),
    companyLogo() {
      return () => {
        return (
          this.companyData.basicSettings.image ||
          require('@/assets/images/community/company/no-companyLogo.png')
        )
      }
    },
    getCoverImage() {
      return () => {
        let backgroundImage = ''

        if (this.companyData.coverImageURL) {
          backgroundImage = this.companyData.coverImageURL
        } else {
          backgroundImage = require(`@/assets/images/community/bgImage/bg${String(
            this.companyData.coverImageCode
          )}.png`)
        }

        return backgroundImage
      }
    },
    /**
     * 上場区分名を取得
     */
    getListingClassificationName() {
      return () => {
        let showName = ''

        if (this.companyData.detail.listingClassificationRadio === '0') {
          showName = '非上場'
        } else if (this.companyData.detail.listingClassificationRadio === '1') {
          showName = '上場'
        } else {
          showName = '非上場'
        }

        return showName
      }
    },
    getCompanyInfoName() {
      return (key) => {
        let companyInfoName = ''

        switch (key) {
          case 'companyName':
            companyInfoName = '会社名'
            break
          case 'representativeName':
            companyInfoName = '代表者名'
            break
          case 'foundingDate':
            companyInfoName = '創業日'
            break
          case 'representativeTel':
            companyInfoName = '代表電話番号'
            break
          case 'numberOfEmployees':
            companyInfoName = '従業員数'
            break
          case 'listingClassification':
            companyInfoName = '上場区分'
            break
          case 'earnings':
            companyInfoName = '売上'
            break
          case 'capital':
            companyInfoName = '資本金'
            break
          case 'businessContent':
            companyInfoName = '事業内容'
            break
        }

        return companyInfoName
      }
    },
    isConnectListCropDataMax() {
      return this.companyMemberList.length > this.maxShowUserNum
    },
    /**
     * 商品・サービスの入力情報のチェック
     * null,[],入力項目が全て未入力のいずれかの場合はfalse,それ以外はtrueを返す
     *
     * @return {boolean} 存在チェック
     */
    checkGoodsAndServices() {
      return () => {
        let result = false
        const keys = ['context', 'image', 'name']

        if (this.$common.checkArrayValue(this.companyData.goodsAndServices)) {
          for (let i = 0; i < keys.length; i++) {
            if (this.companyData.goodsAndServices[0][keys[i]]) {
              result = true
            }
          }
        }

        return result
      }
    },
    /**
     * 画面に表示するメンバ一覧を取得
     *
     * @return {object[]} 画面に表示するメンバー一覧
     */
    getFilterMembers() {
      return () => {
        const filterMembers = this.companyMemberList.filter(
          (data, index) => index < this.maxShowUserNum
        )

        return filterMembers
      }
    },
  },
  created() {},
  mounted() {
    this.getCompanyMemberList() // 企業所属メンバー一覧の取得
    this.getCompanyData() // 企業情報を取得
  },
  methods: {
    ...mapMutations('community/corporate', ['setCorporateData']),
    /**
     * 企業所属メンバー一覧の取得
     */
    getCompanyMemberList() {
      const companyId = this.$route.params.corporateId
      const paramData = {}

      if (companyId) {
        paramData.companyId = companyId
      }

      this.$api
        .getCompanyMemberList(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.companyMemberList = resData.data.memberList
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 企業情報を取得
     */
    getCompanyData() {
      const companyId = this.$route.params.corporateId
      const paramData = {}

      if (companyId) {
        paramData.companyId = companyId
      }

      this.$api
        .getCompanyData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.companyData = resData.data.profile
            this.setCorporateData(resData.data.profile)
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * 選択したユーザーのつながりプロフィール画面を表示
     */
    showSelectUserProfile(userId) {
      this.mixin_showSelectUserProfile(userId)
    },
    /**
     * アカウント-企業設定画面に遷移
     */
    transitionAccountCorporateSettings() {
      this.$router.push('/account/corporate/')
    },
    /**
     * カバー写真を変更ボタン押下処理
     */
    showCoverImageUploadModal() {
      this.showCoverImageUploadModalState = true
    },
    /**
     * 背景カバー写真モーダルの非表示
     */
    hideCoverImageUploadModal() {
      this.showCoverImageUploadModalState = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/scss/sp/mediaQuery.scss';
.body-header {
  position: relative;
  margin-bottom: 33px;
  &-image {
    position: relative;
    width: 100%;
    height: 239px;
    background-color: #fff;
    background-size: cover !important;
    background-repeat: no-repeat;
    background-position: 0 0;
    &-btnList {
      position: absolute;
      top: 183px;
      right: 16px;
      display: flex;
      justify-content: flex-end;
      .btn {
        &:not(:last-child) {
          margin-right: 12px;
        }
      }
    }
  }
  &-data {
    padding-left: 200px;
    position: relative;
    .companyName {
      padding-top: 16px;
      font-size: 22px;
      font-weight: 500;
    }
  }
  &-profile {
    position: absolute;
    top: 120px;
    left: 24px;
    p {
      text-align: center;
      font-size: 22px;
    }
  }
  &-logoWrap {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: #e7e7e7 3px solid;
    overflow: hidden;
    background: gray;
    img {
      width: 100%;
    }
  }
}

/**
  * プロフィール
*/
.body-main-profile {
  width: 716px;
  margin: 0 auto 56px auto;
  &-recommended {
    background: #f7f8f9;
    border-radius: 6px;
    padding: 24px;
    &-commonConnection {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
      &-imgList {
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        &-image {
          width: 40px;
          height: 40px;
          cursor: pointer;
          &:not(:first-child) {
            margin-left: 4px;
          }
          img {
            width: 100%;
          }
        }
      }
    }
  }
  &-cell {
    width: 716px;
    margin: 0 auto 24px auto;
  }
  &-selfIntroduction {
    &:not(:last-child) {
      margin-bottom: 56px;
    }
    &-tableWrap {
      border-radius: 6px;
      border: 1px solid #e5e5e5;
    }
    .body-main-profile-cell {
      border: none;
      padding: 0;
      margin-bottom: 16px;
    }
    .body-main-profile-head {
      padding: 0;
      border: none;
      margin-bottom: 16px;
    }
  }
}
/*
* 基本情報
*/
.body-main-profile-selfIntroduction {
  table {
    width: 100%;
    th {
      width: 125px;
      font-weight: 500;
    }
    th {
      text-align: left;
      vertical-align: top;
      padding: 16px;
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    td {
      text-align: left;
      vertical-align: top;
      padding: 16px;
      border-left: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    tr {
      &:last-child {
        th,
        td {
          border-bottom: none;
        }
      }
    }
  }
}
/*
* 商品・サービス
*/
.body-main-profile-cell-minSec {
  border-radius: 6px;
  width: 100%;
  overflow: hidden;
  border: #e5e5e5 1px solid;
  &:not(:last-child) {
    margin-bottom: 24px;
  }
  h4 {
    background: #e2e3e5;
    min-height: 56px;
    padding: 12px 24px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }
  &-content {
    display: flex;
    margin: 24px;
  }
  &-img {
    display: block;
    width: 240px;
    margin-right: 24px;
    border: #e5e5e5 1px solid;
  }
}
// MQ
@include mq(sp) {
  .company {
    margin: 0 16px;
  }
  .body {
    &-header {
      margin: 25px 16px 0 16px;
      &-profile {
        top: 155px;
        left: 0;
        width: 100%;
      }
      &-logoWrap {
        margin: 0 auto;
      }
      &-data {
        padding-left: 0;
        text-align: center;
        padding-top: 70px;
        margin-bottom: 24px;
      }
      &-image-btnList {
        position: static;
        display: flex;
        justify-content: center;
      }
    }
    &-main {
      &-profile {
        width: calc(100% - 32px);
        margin: 0 16px 56px 16px;
        &-recommended {
          margin-top: 24px;
        }
        &-cell {
          width: calc(100% - 32px);
          margin: 0 16px 16px 16px;
          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
          }
          &-minSec {
            &:last-child {
              margin-bottom: 0;
              padding-bottom: 0;
            }
            &-content {
              display: block;
            }
            &-img {
              margin-right: 0;
              width: 100%;
              margin-bottom: 24px;
              img {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
// MQ
</style>
