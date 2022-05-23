<template>
  <transition name="fade">
    <div v-if="isSelectContactId" class="contactDetailDrawer">
      <div class="header flex">
        <img :src="imgSrc" alt="" class="header-img" />
        <div class="header-nameBox font-weight-medium">
          <p class="header-nameSub">とらいたろう</p>
          <p class="header-name">渡来太郎</p>
        </div>
        <div class="header-btn flex">
          <button class="btn btn-short btn-edit" @click="editContactContent()">
            編集
          </button>
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeDrawer($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'left', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
        </div>
      </div>

      <div class="body">
        <section>
          <h4>営業担当者情報</h4>
          <dl class="flex list">
            <dt>登録日</dt>
            <dd>{{ contactDetail.registrationDate }}</dd>
            <dt>担当者</dt>
            <dd>
              <span v-if="salesPersonNameList.length >= 1">{{
                salesPersonNameList[0]
              }}</span>
              <span v-if="salesPersonNameList.length >= 2"
                >+{{ salesPersonNameList.length - 1 }}</span
              >
            </dd>
          </dl>
        </section>
        <section>
          <h4>基本情報</h4>
          <dl class="flex list">
            <dt>企業名</dt>
            <dd>{{ contactDetail.company }}</dd>
            <dt>役職名</dt>
            <dd>{{ contactDetail.position }}</dd>
            <dt>所属部門</dt>
            <dd>{{ contactDetail.department }}</dd>
            <dt>住所</dt>
            <dd>
              {{ contactDetail.postcode }}<br />
              {{ contactDetail.addressState }}{{ contactDetail.addressCity
              }}{{ contactDetail.addressLine1 }}<br />{{
                contactDetail.addressLine2
              }}
            </dd>
            <dt>メールアドレス</dt>
            <dd>{{ contactDetail.mail }}</dd>
            <dt>電話番号1</dt>
            <dd>{{ contactDetail.tel1 }}</dd>
            <dt>電話番号2</dt>
            <dd>{{ contactDetail.tel2 }}</dd>
            <dt>タグ</dt>
            <dd class="tagList">
              <span
                v-for="(tag, tagIndex) in limitCountNewTagList"
                :key="tagIndex"
                >{{ tag }}</span
              ><span v-if="newTagListCount !== 0">+{{ newTagListCount }}</span>
            </dd>
            <dt>メモ</dt>
            <dd>{{ contactDetail.memo }}</dd>
          </dl>
        </section>
        <section>
          <h4>追加情報</h4>
          <dl
            v-for="(item, index) in additionalInformationList"
            :key="index"
            class="flex list"
          >
            <dt>
              {{ item.title }}
            </dt>
            <dd>{{ item.data }}</dd>
          </dl>
        </section>
        <section>
          <h4>メール配信エラー</h4>
          <dl class="flex list">
            <dt>配信エラー回数</dt>
            <dd>{{ contactDetail.bounceMailCount }}</dd>
          </dl>
        </section>
      </div>

      <p>{{ detailId }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ContactDetailDrawer',
  components: {},
  props: {
    detailId: {
      type: Number,
      default: () => [],
      required: true,
    },
    isSelectContactId: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      imgSrc: '',
      isOpen: false,
      contactDetail: {},
      salesPersonList: [],
      dataItemDefinitionList: [],
      salesPersonNameList: [],
      additionalInformationList: [],
    }
  },
  computed: {
    limitCountNewTagList() {
      if (this.contactDetail.newTagList) {
        if (this.contactDetail.newTagList.length <= 2) {
          return this.contactDetail.newTagList
        } else {
          return this.contactDetail.newTagList.slice(0, 2)
        }
      } else {
        return []
      }
    },
    newTagListCount() {
      if (this.contactDetail.newTagList) {
        if (this.contactDetail.newTagList.length <= 2) {
          return 0
        } else {
          return this.contactDetail.newTagList.length - 2
        }
      } else {
        return 0
      }
    },
  },
  watch: {
    isSelectContactId(afterVal) {
      if (afterVal) {
        this.getContactDetail(this.detailId)
      }
    },
  },
  created() {},
  mounted() {
    this.getDefinitions() // コンタクト定義情報取得の取得
  },
  methods: {
    /**
     * コンタクト定義情報取得の取得
     */
    getDefinitions() {
      const paramData = {}

      this.$common.addCallApiNum()
      this.$api
        .getDefinitions(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.salesPersonList = resData.data.salesPersonList
            this.dataItemDefinitionList = resData.data.dataItemDefinitionList
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * コンタクト詳細情報取得
     */
    getContactDetail(id) {
      const paramData = {
        contactId: id,
      }
      const salesPersonList = this.salesPersonList
      const dataItemDefinitionList = this.dataItemDefinitionList

      this.$common.addCallApiNum()
      this.$api
        .getContactDetail(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.contactDetail = resData.data.contactInformation
            this.salesPersonNameList = resData.data.contactInformation.salesPersonIdList.map(
              (item) => {
                return salesPersonList.find(
                  (data) => data.salesPersonId === item
                ).name
              }
            )

            this.additionalInformationList = resData.data.contactInformation.additionalInformationList.map(
              (item) => {
                const dataObj = dataItemDefinitionList.find(
                  (data) =>
                    data.dataItemDefinitionId === item.dataItemDefinitionId
                )
                return {
                  title: dataObj.title,
                  data: item.data,
                }
              }
            )
            if (
              resData.data.contactInformation.profileImage === null ||
              resData.data.contactInformation.profileImage === undefined
            ) {
              this.imgSrc = '/_nuxt/assets/images/placeholder_profile.png'
            } else {
              this.imgSrc = resData.data.contactInformation.profileImage
            }
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
            this.$router.push('/contact/list/')
          }

          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ドロアを閉じる
     *
     * @param {Object} event イベントオブジェクト
     * @param {String} type イベントタイプ
     */
    closeDrawer(event, type) {
      if (type === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.outTargetFlg = true
        }
      } else if (type === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.$emit('close')
        }

        this.outTargetFlg = false
      } else if (type === 'close') {
        this.$emit('close')
      }
    },
    /**
     * コンタクト編集画面に遷移
     */
    editContactContent() {
      this.$router.push('/contact/edit/' + this.detailId)
    },
  },
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.5s;
}
.fade-enter,
.fade-leave-to {
  transform: translate(400px, 0);
}
.fade-enter-to,
.fade-leave {
  transform: translate(0, 0);
}
.contactDetailDrawer {
  box-shadow: 0px 3px 6px #00000029;
  background: #fff;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  z-index: 1;
}
.header {
  background: #f7f8f9;
  border: #e0e0e0 1px solid;
  padding: 24px;
  justify-content: flex-start;
  align-items: center;
  height: 104px;
  &-img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 16px;
  }
  &-nameSub {
    font-size: 15px;
  }
  &-name {
    font-size: 22px;
  }
  &-btn {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}
.btn-edit {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px 12px;
  margin-right: 18px;
}
.body {
  padding: 20px;
  height: calc(100vh - 104px);
  overflow-y: auto;
  section {
    padding-bottom: 20px;
    &:not(:last-child) {
      margin-bottom: 20px;
      border-bottom: #e5e5e5 1px solid;
    }
  }
  h4 {
    margin-bottom: 12px;
  }
  dt,
  dd {
    margin-bottom: 13px;
  }
}
.list {
  flex-wrap: wrap;
  align-items: flex-start;

  dt {
    width: 130px;
  }
  dd {
    width: calc(100% - 130px);
  }
}
// タグ
.tagList {
  span:not(:last-child) {
    font-size: 12px;
    color: #4f7df0;
    border: #4f7df0 1px solid;
    padding: 3px 12px;
    margin-right: 12px;
  }
}
</style>
