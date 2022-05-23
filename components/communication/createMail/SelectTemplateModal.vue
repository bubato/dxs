<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <CancelSVG
            class="btn-close icon-cancel"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h3>使用するテンプレートを選択してください。</h3>
          </div>
          <div class="modal_contents">
            <div class="modal_contents-box">
              <div class="modal_contents-left">
                <p>ページID</p>
                <CustomInputText
                  v-model="inputTextPgId"
                  placeholder="成果が出るまで「続けられる」"
                />
                <p>タイトル</p>
                <CustomInputText
                  v-model="inputText"
                  placeholder="成果が出るまで「続けられる」"
                />
                <p>説明</p>
                <CustomInputTextarea
                  v-model="inputTextArea"
                  placeholder="成果が出るまで「続けられる」"
                />
                <p>メニュー</p>
                <CustomInputCheckbox
                  v-model="inputCheckboxMenu"
                  :options="menuData"
                  name="inputCheckbox"
                />
              </div>
              <div class="modal_contents-right">
                <p>ページ種別</p>
                <CustomInputSelect
                  v-model="selectVal"
                  :options="pageData"
                  placeholder="ページ種別を選択して下さい"
                />
                <div class="test-img">16：9</div>
              </div>
            </div>
            <div class="buttons">
              <button
                class="btn btn-cancel btn-middle"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button class="btn btn-basic btn-middle" @click="saveInputData()">
                選択したテンプレートを使用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SelectTemplateModal',
  data() {
    return {
      outTargetFlg: false,
      componentList: [],
      componentName: '',
      inputTextPgId: '',
      inputText: '',
      inputTextArea: '',
      inputCheckboxMenu: [''],
      selectVal: '',
      menuData: [
        {
          value: '1',
          label: 'ヘッダーに表示',
        },
        {
          value: '2',
          label: 'フッターに表示',
        },
      ],
      pageData: [
        {
          code: '1',
          label: 'トップページ​',
        },
        {
          code: '2',
          label: '私たちについて​',
        },
        {
          code: '3',
          label: 'サービス紹介​',
        },
        {
          code: '4',
          label: 'サービス詳細​',
        },
        {
          code: '5',
          label: '会社概要​',
        },
        {
          code: '6',
          label: '事例​',
        },
        {
          code: '7',
          label: '事例詳細​',
        },
        {
          code: '8',
          label: '採用​',
        },
        {
          code: '9',
          label: 'お知らせ​',
        },
        {
          code: '10',
          label: 'お知らせ詳細​',
        },
        {
          code: '11',
          label: 'よくある質問​',
        },
        {
          code: '12',
          label: 'プライバシーポリシー​',
        },
        {
          code: '13',
          label: 'キャンペーン（LP）​',
        },
        {
          code: '14',
          label: 'その他',
        },
      ],
      inputTextAreaPlaceholder: '成果が出るまで「続けられる',
    }
  },
  computed: {},
  created() {},
  methods: {
    setJsonData() {
      this.$common.addCallApiNum()
      this.$api
        .setCreateWebPage({})
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('reflect')
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
     * OKボタン押下処理
     */
    saveInputData() {
      this.setJsonData()
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
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
  },
}
</script>

<style scoped lang="scss">
.modal-mask {
  z-index: 1000000;
}
.modal-container {
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
  }
  .modal_contents {
    .input_form {
      > div {
        p {
          padding: 5px 0;
        }
      }
      .input_load_sentence {
        margin-top: 10px;
      }
      .set_show_buttons {
        margin-top: 10px;
        .show_button_list {
          max-height: 120px;
          overflow: auto;
          .select_show_button {
            position: relative;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
            .btn-delete_select {
              position: absolute;
              top: 0;
              bottom: 0;
              right: 20px;
              margin: auto;
              cursor: pointer;
            }
          }
        }
        .add_item_component {
          margin-top: 10px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
    }
  }
}

.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
      p {
        margin-top: 24px;
        margin-bottom: 12px;
        &:first-content {
          margin-top: 0;
        }
      }
    }
  }
  &-right {
    margin-left: 48px;
  }
  .test-img {
    margin-top: 24px;
    width: 352px;
    height: 198px;
    font-size: 34px;
    color: #fff;
    background: #d1d1d1;
    text-align: center;
    line-height: 198px;
  }
}
</style>
