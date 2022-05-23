<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container variable">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4>{{ getTeamsData('name') }}</h4>
          </div>
          <div class="modal_contents">
            <iframe
              id="iframeContent"
              class="modal_contents-box"
              :src="getTeamsData('url')"
              frameborder="0"
            ></iframe>
            <div class="buttons">
              <button
                class="btn btn-cancel btn-long"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-basic btn-long"
                :class="{ 'btn-disabled': readTerms }"
                @click="confirmationTeams()"
              >
                規約を確認しました
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'TeamsModal',
  props: {
    id: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      readTerms: true,
    }
  },
  computed: {
    ...mapState('request/input', [
      'teamsData',
      'teamsSetting',
      'teamsVersionIDList',
    ]),
  },
  created() {},
  mounted() {
    document
      .getElementById('iframeContent')
      .contentWindow.addEventListener('scroll', this.scrollEvt) // iframe利用規約内スクロールを下まで表示したか確認するイベントを定義
  },
  methods: {
    ...mapMutations('request/input', [
      'setTeamsSetting',
      'setTeamsVersionIDList',
      'initTeamsModalFlg',
    ]),
    /**
     * iframe利用規約内スクロールを下まで表示したか確認
     */
    scrollEvt() {
      const elem = document.getElementById('iframeContent')
      const scrollHeight = Math.max(
        elem.contentWindow.document.body.scrollHeight,
        elem.contentWindow.document.documentElement.scrollHeight,
        elem.contentWindow.document.body.offsetHeight,
        elem.contentWindow.document.documentElement.offsetHeight,
        elem.contentWindow.document.body.clientHeight,
        elem.contentWindow.document.documentElement.clientHeight
      )
      const pageMostBottom = scrollHeight - elem.contentWindow.innerHeight - 5

      const scrollTop =
        elem.contentWindow.pageYOffset ||
        elem.contentWindow.document.documentElement.scrollTop

      if (scrollTop >= pageMostBottom) {
        this.readTerms = false
        elem.contentWindow.removeEventListener('scroll', this.scrollEvt)
      }
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event イベントオブジェクト
     * @param {String} id イベントタイプ
     */
    closeModal(event, id) {
      if (id === 'in') {
        if (event && event.target.classList.contains('modal-wrapper')) {
          this.initTeamsModalFlg()
        }
      } else if (id === 'out') {
        if (
          event &&
          event.target.classList.contains('modal-wrapper') &&
          this.outTargetFlg
        ) {
          this.initTeamsModalFlg()
        }

        this.outTargetFlg = false
      } else if (id === 'close') {
        this.initTeamsModalFlg()
      }
    },
    /**
     * 利用規約を確認
     */
    confirmationTeams() {
      const elem = document.getElementById('iframeContent')
      const versionID = elem.contentWindow.document.getElementById('versionID')
        .value

      this.setVersionID(versionID)
      this.setAgreementDisabled()
      this.initTeamsModalFlg()
    },
    /**
     * TeamsDataの取得
     *
     * @param {String} keyName キー名
     * @return {String} 利用規約データ
     */
    getTeamsData(keyName) {
      return this.teamsData.find((item) => item.id === this.id)[keyName]
    },
    /**
     * 閲覧した利用規約のバージョンIDを保存
     *
     * @param {String} versionID バージョンID
     */
    setVersionID(versionID) {
      const teamsVersionIDListData = JSON.parse(
        JSON.stringify(this.teamsVersionIDList)
      )
      teamsVersionIDListData[this.id] = versionID

      this.setTeamsVersionIDList(teamsVersionIDListData)
    },
    /**
     * 閲覧済み利用規約を保存
     */
    setAgreementDisabled() {
      const teamsSettingData = JSON.parse(JSON.stringify(this.teamsSetting))

      teamsSettingData.agreementDisabledIdList.push(this.id)
      this.setTeamsSetting(teamsSettingData)
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/scss/sp/mediaQuery.scss';

.modal-wrapper {
  display: flex;
  justify-content: center;
}
@media all and (-ms-high-contrast: none) {
  *::-ms-backdrop,
  .modal-mask .modal-container {
    transform: translate(-50%, -50%);
  } /* IE11 */
}

.modal-container {
  @include mq(pc) {
    width: 822px;
  }
  @include mq(sp) {
    width: 90%;
  }
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
    margin-bottom: 24px;
  }
  .modal_contents {
    &-box {
      height: calc(100vh - 306px);
      width: 752px;
      overflow: scroll;
      border: #e5e5e5 1px solid;
      border-radius: 6px;
      padding: 16px;
    }
    .link-text {
      display: block;
      margin-top: 16px;
      text-align: center;
    }
    .buttons {
      margin-top: 32px;
    }
  }
}
</style>
