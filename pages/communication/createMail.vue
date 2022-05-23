<template>
  <div
    class="create-mail"
    :class="{ 'show-scroll': $common.checkShowScrollBar() }"
  >
    <div class="main-contents">
      <div class="l-header">
        <div class="header">
          <h2>新規メール作成</h2>
        </div>
        <div class="contents">
          配信するメールの宛先や本文、配信日時を設定します。
        </div>
      </div>

      <div class="l-contents">
        <div class="l-contents-main">
          <div class="l-contents-cell">
            <p>メールID</p>
            <p>100100</p>
          </div>
          <div class="l-contents-cell">
            <p>ステータス</p>
            <p><RemoveCircleSVG class="icon-remoceCircle" />編集中</p>
          </div>
          <div class="l-contents-cell">
            <p>配信ユーザー</p>
            <CustomInputRadio
              v-model="createMailData.sendUser.value"
              :options="createMailData.sendUser.options"
              name="inputRadio"
              class="sendUser"
            />
            <!-- セグメントチェック時 -->
            <div v-if="createMailData.sendUser.value === '2'" class="segment">
              <CustomInputSelect
                v-model="createMailData.segmentTag.value"
                :options="createMailData.segmentTag.options"
                :placeholder="createMailData.segmentTag.placeholder"
                class="segment-1"
              />
              <CustomInputSelect
                v-model="createMailData.segmentForm.value"
                :options="createMailData.segmentForm.options"
                :placeholder="createMailData.segmentForm.placeholder"
                class="segment-2"
              />
              <button class="btn-add">
                <AddCircleSVG class="icon-addCircle" />条件を追加
              </button>
            </div>
            <!-- セグメントチェック時 -->
            <button
              v-if="createMailData.sendUser.value === '3'"
              class="sendUserSelect"
              @click="showSelectTargetList = true"
            >
              ターゲットリスト<ExpandMoreSVG class="icon-expandMore" />
            </button>
          </div>
          <div class="l-contents-cell">
            <p>メールタイトル</p>
            <p class="mailTitle">
              メール管理画面で表示されるタイトルです。メール本文には表示されません。
            </p>
            <CustomInputText
              v-model="createMailData.mailSystemTitle.value"
              :placeholder="createMailData.mailSystemTitle.placeholder"
              :validation="createMailData.mailSystemTitle.validation"
              class="mailTitleNameInput"
            />
          </div>
          <div class="l-contents-cell">
            <p>メール件名</p>
            <CustomInputText
              v-model="createMailData.mailSendTitle.value"
              :placeholder="createMailData.mailSendTitle.placeholder"
              :validation="createMailData.mailSendTitle.validation"
            />
          </div>
          <div class="l-contents-cell">
            <p>メール本文</p>
            <p class="mailText">
              エディターは、右クリックで差し込みテキストを入れることができます。
            </p>
            <div class="mailTextHeaderLayout">
              <CustomInputRadio
                v-model="createMailData.mailTextRadio.value"
                :options="createMailData.mailTextRadio.options"
                name="inputRadio2"
                layout-type="vertical"
                class="mailTextRadio"
              />
              <button
                class="btn-mailTextTemplate"
                @click="showSelectTemplateModal = true"
              >
                テンプレートから選択
              </button>
            </div>
            <div class="dummy-wysiwyg">WYSIWYGエディター</div>
            <div class="btn-previewBox">
              <button class="btn btn-secondary btn-long">プレビュー</button>
            </div>
          </div>
          <div class="l-contents-cell">
            <p>配信方法</p>
            <CustomInputRadio
              v-model="createMailData.deliveryMethod.value"
              :options="createMailData.deliveryMethod.options"
              name="inputRadio3"
              layout-type="vertical"
            />
          </div>
          <div class="l-contents-cell">
            <p>配信予約日時</p>
            <div class="deliveryReservation">
              <custom-date-picker
                v-model="createMailData.selectDays.value"
                class="selectDay"
              />
              <CustomSelectHours v-model="createMailData.selectHours.value" />
              <CustomSelectMinutes
                v-model="createMailData.selectMinutes.value"
              />
            </div>
          </div>
        </div>
        <div class="l-contents-aside">
          <div class="l-contents-aside-box">
            <div class="l-contents-aside-cell">
              <div class="l-contents-aside-cell-inner">
                <h4>設定した条件に合致する 配信コンタクト数</h4>
                <div class="dummy-graf">
                  <ProgressCircleBar
                    :progress="circleData"
                    class="progressCircle"
                  />
                </div>
                <p class="l-contents-aside-cell-num">配信可能数：1,123/1,123</p>
                <button class="btn btn-secondary btn-middle btn-download">
                  配信リストをダウンロード
                </button>
              </div>
            </div>
            <div class="l-contents-aside-cell">
              <h4>テスト送信</h4>
              <p>
                テストメールを送信するアドレスを入力してください。<br />
                複数の宛先に送信する場合は改行してアドレスを入力してください。<br />
                一度の送信できるアドレスは5つまでです。
              </p>
              <div class="l-contents-aside-cell-mailList">
                <div class="l-contents-aside-cell-searchWindow">
                  <input
                    v-model="testmail.value"
                    type="text"
                    :style="{ paddingTop: topSize + 'px' }"
                    :disabled="testmail.sendList.length >= 5"
                    :class="{ none: testmail.sendList.length >= 5 }"
                    @keyup.enter="trigger"
                  />
                </div>
                <div
                  v-if="testmail.sendList.length >= 1"
                  class="l-contents-aside-cell-mailListBox"
                >
                  <div
                    v-for="key in testmail.sendList"
                    :key="key"
                    class="l-contents-aside-cell-mailListBtn"
                  >
                    <span>
                      {{ key
                      }}<CancelSVG
                        class="icon-cancel"
                        @click="deletetestmailSendList($event)"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <button class="btn btn-basic btn-long btn-sendTestMail">
                テストメールを送信
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="footerBtnList">
        <button class="btn btn-basic btn-long">保存して閉じる</button>
        <button class="btn btn-primary btn-long btn-disabled">
          配信設定を完了
        </button>
      </div>
    </div>
    <CommonFooter />
    <CreateMailSendUserSelectModal
      v-if="showSelectTargetList"
      :select-data-origin="createMailData.targetList.options"
      @reflect="reflectComponentData()"
      @close="hideModal()"
    />
    <SelectTemplateModal
      v-if="showSelectTemplateModal"
      @reflect="reflectComponentData()"
      @close="hideModal()"
    />
  </div>
</template>

<script>
import CommonFooter from '~/components/common/CommonFooter.vue'

export default {
  layout: 'mainLayout',
  components: {
    CommonFooter,
  },
  data() {
    return {
      showSelectTargetList: false,
      showSelectTemplateModal: false,
      circleData: 99,
      testmail: {
        value: '',
        sendList: [],
      },
      createMailData: {
        sendUser: {
          value: '',
          options: [
            {
              value: '1',
              label: 'すべて',
            },
            {
              value: '2',
              label: 'セグメント',
            },
            {
              value: '3',
              label: 'ターゲットリスト',
            },
          ],
          validation: [],
          state: false,
        },
        segmentTag: {
          value: '',
          placeholder: 'タグ',
          options: [
            {
              code: '1',
              label: 'タグ1',
            },
            {
              code: '2',
              label: 'タグ2​',
            },
            {
              code: '3',
              label: 'タグ3',
            },
          ],
          validation: [],
          state: false,
        },
        segmentForm: {
          value: '',
          placeholder: 'フォーム1回答',
          options: [
            {
              code: '1',
              label: 'フォーム回答1',
            },
            {
              code: '2',
              label: 'フォーム回答2​',
            },
            {
              code: '3',
              label: 'フォーム回答3',
            },
          ],
          validation: [],
          state: false,
        },
        targetList: {
          options: [
            {
              id: '1',
              name: 'ターゲットリスト名1',
            },
            {
              id: '2',
              name: 'ターゲットリスト名2',
            },
            {
              id: '3',
              name: 'ターゲットリスト名3',
            },
            {
              id: '4',
              name: 'ターゲットリスト名4',
            },
          ],
        },
        mailSystemTitle: {
          value: '',
          placeholder: '',
          options: [
            {
              value: '1',
              label: 'すべて',
            },
            {
              value: '2',
              label: 'セグメント',
            },
            {
              value: '3',
              label: 'ターゲットリスト',
            },
          ],
          validation: [],
          state: false,
        },
        mailSendTitle: {
          value: '',
          placeholder: '',
          options: [
            {
              value: '1',
              label: 'すべて',
            },
            {
              value: '2',
              label: 'セグメント',
            },
            {
              value: '3',
              label: 'ターゲットリスト',
            },
          ],
          validation: [],
          state: false,
        },
        mailTextRadio: {
          value: '',
          placeholder: '',
          options: [
            {
              value: '1',
              label: 'テキスト',
            },
            {
              value: '2',
              label: 'HTMLメール',
            },
          ],
          validation: [],
          state: false,
        },
        deliveryMethod: {
          value: '',
          placeholder: '',
          options: [
            {
              value: '1',
              label: '即時配信',
            },
            {
              value: '2',
              label: '予約配信',
            },
          ],
          validation: [],
          state: false,
        },
        selectDays: {
          value: '',
        },
        selectHours: {
          value: '',
        },
        selectMinutes: {
          value: '',
        },
      },
    }
  },
  computed: {
    topSize() {
      return this.testmail.sendList.length === 0
        ? 13
        : this.testmail.sendList.length * (33 + 8) + 8 * 2
    },
  },
  created() {},
  methods: {
    // getJsonData() {
    //   this.$api
    //     .getCreateWebPage({})
    //     .then((resData) => {
    //       this.createMailData = resData.data
    //     })
    //     .catch((error) => {
    //       this.$common.apiErrorFunc(error)
    //     })
    // },
    trigger(event) {
      if (this.testmail.value === '') return
      if (event.keyCode !== 13) return
      this.testmail.sendList.push(this.testmail.value)
      this.testmail.value = ''
    },
    hideModal() {
      this.showSelectTargetList = false
    },
    deletetestmailSendList(evt) {
      const txt = evt.target
        .closest('.l-contents-aside-cell-mailListBtn')
        .textContent.trim()
      const list = this.testmail.sendList.filter(function (value) {
        if (value !== txt) return value
      })
      this.testmail.sendList = list
    },
  },
}
</script>
<style lang="scss" scoped>
.main-container {
  .main-contents {
    min-height: calc(100% - 60px);
  }
}
.l-header {
  border-bottom: 1px solid #eaeaea;
  h2 {
    margin-bottom: 8px;
  }
}
.contents {
  margin-bottom: 33px;
}
.l-contents {
  padding-top: 32px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  &-main {
    flex-grow: 3;
    padding-right: 17%;
  }
  &-aside {
    width: 320px;
  }
  &-cell {
    margin-bottom: 48px;
    > p:first-child {
      padding-bottom: 12px;
      font-weight: 500;
    }
    //配信ユーザ
    .sendUser {
      margin-bottom: 16px;
    }
    .sendUser > div {
      display: flex;
      flex-direction: unset !important;
      align-items: baseline;
      label {
        margin-right: 24px;
      }
      input {
        margin-right: 12px;
      }
    }
    .segment {
      &-1,
      &-2 {
        width: 228px;
        display: inline-block;
        padding-right: 16px;
        margin-bottom: 14px;
      }
      .btn-add {
        display: block;
        line-height: 20px;
        .icon-addCircle {
          margin-right: 10px;
        }
      }
    }
    .sendUserSelect {
      width: 427px;
      height: 48px;
      background: #f7f8f9;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      color: #1e1e1e;
      padding: 13px 16px;
      outline: none;
      display: flex;
      justify-content: space-between;
    }
    .mailTitle {
      margin-bottom: 12px;
    }
    .mailTitleNameInput,
    .mailTitleInput {
      width: 100%;
    }
    .mailText {
      margin-top: 8px;
      margin-bottom: 14px;
    }
    .mailTextRadio {
      margin-bottom: 16px;
    }
    .btn-mailTextTemplate {
      padding: 6px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-bottom: 16px;
      height: 32px;
    }
    .mailTextHeaderLayout {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: flex-end;
    }
    .btn-previewBox {
      display: flex;
      width: 100%;
      justify-content: center;
      margin-top: 24px;
    }
    .selectDay {
      width: 167px;
    }
    .deliveryReservation {
      display: flex;
      > * {
        margin-right: 16px;
      }
    }
  }
}
.l-contents-aside {
  &-box {
    background: #ffffff;
    box-shadow: 0px 1px 5px #00000029;
    border-radius: 6px;
    padding-top: 8px;
    padding-bottom: 40px;
  }
  &-cell {
    margin: 0 16px;
    width: 288px;
    &:first-child {
      border-bottom: #e5e5e5 1px solid;
    }
    &:last-child {
      h4 {
        text-align: center;
      }
    }
    &-inner {
      width: 220px;
      margin: 0 auto;
    }
    h4 {
      margin-top: 24px;
      margin-bottom: 24px;
    }
    p {
      margin-bottom: 16px;
    }
    &-num {
      margin-top: 16px;
      text-align: center;
    }
    .btn-download {
      margin: 0 auto;
      margin-bottom: 24px;
    }
    &-searchWindow {
      background: #f7f8f9;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      input {
        border: none;
        &.none {
          padding-bottom: 0px;
        }
      }
    }
    &-mailList {
      position: relative;
      background: #f7f8f9;
      border-radius: 4px;
    }
    &-mailListBox {
      position: absolute;
      top: 0;
      left: 0;
      padding: 13px 16px;
    }
    &-mailListBtn {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        display: inline-block;
        background: #d1e7ff;
        border-radius: 4px;
        padding: 6px 12px;
      }
      .icon-cancel {
        margin-left: 10px;
      }
    }
    .btn-sendTestMail {
      margin: 0 auto;
      margin-top: 32px;
    }
  }
}
.footerBtnList {
  padding-top: 40px;
  display: flex;
  justify-content: center;
  > *:first-child {
    margin-right: 16px;
  }
}
// アイコン
.icon {
  &-pin {
    display: inline-block;
    transform: rotate(30deg);
    margin-left: 16px;
    fill: #1e1e1e;
  }
  &-AddCircle {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    fill: #1e1e1e;
  }
  &-remoceCircle {
    fill: #b0b3be;
    width: 20px;
    height: 20px;
    padding-right: 4px;
  }
  &-expandMore {
    width: 24px;
    height: 24px;
  }
  &-addCircle {
    width: 24px;
    height: 24px;
  }
  &-cancel {
    width: 16px;
    height: 16px;
  }
}

.dummy-wysiwyg {
  width: 100%;
  height: 280px;
  background: #333333;
  color: #ffffff;
  text-align: center;
  line-height: 280px;
}
.progressCircle {
  width: 200px;
  height: 200px;
}
</style>
