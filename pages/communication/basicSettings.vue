<template>
  <div class="basic-settings">
    <!-- main-contents -->
    <div class="main-contents">
      <div class="header">
        <h2 class="header-title">基本設定</h2>
      </div>
      <p class="header-title-sub">
        メールで利用する基本的な設定値や配信ルールを決めることができます。
      </p>
      <div class="section">
        <h3 class="title-bold flex">
          <span>アドレス設定</span><span><HelpSVG class="icon-help" /></span>
        </h3>
        <p>
          顧客に送信されるメールのアドレス情報を設定します。ここに設定することで、メール設定画面のFROMのフォームに反映されます。
        </p>
        <p class="title-bold caption">送信元表示名</p>
        <CustomInputText v-model="sourceDisplayName.value" />
        <p class="title-bold caption">送信元アドレス</p>
        <CustomInputText v-model="sourceAddress.value" />
      </div>
      <div class="section">
        <h3 class="title-bold">テスト配信用アドレス</h3>
        <p>
          テスト送信先アドレスを設定することで、テスト配信のメールアドレスフォームに反映されます。
          形式は「”お名前”&lt;メールアドレス&gt;」「メールアドレス」に対応しています。複数のアドレスを指定する場合は改行で設定します。
        </p>
        <p class="title-bold caption">テスト配信アドレス</p>
        <!-- <CustomChangeTextarea
          v-model="testDeliveryAddress.value"
          @change="getSplitByLine($event, 'testDeliveryAddress')"
        /> -->
      </div>
      <div class="section">
        <h3 class="title-bold">ブラックリスト</h3>
        <p>
          ブラックリストを設定すると、一致するメールアドレス宛には配信されなくなります。<br />
          複数のアドレスを指定する場合は改行で設定します。
        </p>
        <p class="title-bold caption">ブラックリストアドレス</p>
        <CustomChangeTextarea
          v-model="blackListAddress.value"
          :error-list="blackListAddress.validation.error"
          @change="getSplitByLine($event, 'blackListAddress')"
        />
      </div>
      <div class="section">
        <h3 class="title-bold">分析設定</h3>
        <p>
          bizskyDXのCMS機能を利用しない場合は、Webサイトに共通タグのJavaScriptタグをHTMLコードに設定してください。
        </p>
        <p class="title-bold caption">共通タグ</p>
        <CustomInputText ref="commonTag" v-model="commonTag.value" class="" />
      </div>
      <div class="section">
        <h3 class="title-bold">配信停止設定</h3>
        <p>
          説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。
        </p>

        <p class="title-bold caption">
          <span>Webサイトに配信停止ページを表示</span
          ><span><HelpSVG class="icon-help" /></span>
        </p>

        <CustomInputRadio
          v-model="displayWebsite.value"
          :options="displayWebsite.options"
          name="displayWebsite"
          layout-type="vertical"
        />

        <p class="title-bold caption">配信停止用タグ</p>
        <CustomInputTextarea
          ref="unsubscribeTag"
          v-model="unsubscribeTag.value"
          class="is-disabled"
        />
      </div>
      <hr />
      <div class="settings">
        <button class="btn btn-cancel btn-long">
          キャンセルして設定を元に戻す
        </button>
        <button
          :class="{ disabled: true }"
          class="btn btn-basic btn-long"
          :disabled="true"
        >
          設定内容を保存
        </button>
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<script>
import CommonFooter from '~/components/common/CommonFooter.vue'
import CustomChangeTextarea from '~/components/communication/baseSettings/CustomChangeTextarea.vue'

export default {
  layout: 'mainLayout',
  components: {
    CustomChangeTextarea,
    CommonFooter,
  },
  data() {
    return {
      sourceDisplayName: {
        value: '',
        placeholder: '',
        validation: [
          {
            type: 'regex',
            regex: '',
            message: '',
          },
        ],
      },
      sourceAddress: {
        value: '',
        placeholder: '',
        validation: [
          {
            type: 'regex',
            regex: '',
            message: '',
          },
        ],
      },
      testDeliveryAddress: {
        value: '',
        list: [],
        placeholder: '',
        validation: [
          {
            type: 'regex',
            regex:
              '|^"(((\\\\")|[^"])*)"[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\\.[A-Za-z0-9]{1,}$',
            message: 'メールアドレスの形式が正しくありません',
          },
        ],
      },
      blackListAddress: {
        value: '',
        list: [],
        placeholder: '',
        validation: {
          type: 'regex',
          regex: '',
          message: '',
          error: {
            state: true,
            data: [],
            message: '行目のメールアドレスが無効です。',
          },
        },
      },
      commonTag: {
        value: '',
        placeholder: '',
        validation: [
          {
            type: 'regex',
            regex: '',
            message: '',
          },
        ],
      },
      displayWebsite: {
        value: 'single',
        options: [
          {
            value: 'single',
            label: '1ページ',
          },
          {
            value: 'multiple',
            label: '複数ページ',
          },
        ],
        placeholder: '',
        validation: [],
      },
      unsubscribeTag: {
        value: '',
        placeholder: '',
        validation: [],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 共通タグをreadonlyに
    this.$refs.commonTag.$el.children[0].children[0].classList.add(
      'is-readonry'
    )
    this.$refs.commonTag.$el.children[0].children[0].readOnly = true

    // 配信停止用タグをreadonlyに
    this.$refs.unsubscribeTag.$el.children[0].classList.add('is-readonry')
    this.$refs.unsubscribeTag.$el.children[0].readOnly = true
  },
  methods: {
    getSplitByLine($event, target) {
      const regex = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/g
      const text = $event.replace(/\r\n|\r/g, '\n')
      const lines = text.split('\n')
      const outArray = []
      const errorArray = []

      for (let i = 0; i < lines.length; i++) {
        // 空行は無視
        if (lines[i] === '') continue
        if (!regex.test(lines[i])) {
          this[target].validation.error.state = false
          errorArray.push(`${[i + 1]}`)
          this[target].validation.error.data = errorArray
          continue
        }
        outArray.push(lines[i])
      }

      if ($event.length === 0) {
        this[target].validation.error.state = true
        this[target].value = ''
        this[target].list = []
      } else {
        this[target].value = $event
        this[target].list = outArray
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/**
 * ヘッダー
 */
.header {
  display: flex;
  align-items: center;
  &-title {
    &-icon {
      position: relative;
      top: 3px;
      margin: 0 0 0 9px;
      fill: #3a435c;
      transform: rotate(30deg);
    }
    &-sub {
      margin: 8px 0 0 0;
    }
  }
}

/**
 * セクション
 */
.section {
  margin: 40px 0 0 0;
  border-top: 1px solid #eaeaea;
  h3 {
    margin: 40px 0 8px 0;
  }
  .caption {
    margin: 32px 0 12px 0;
  }
  .title {
    &-bold {
      font-weight: 500;
    }
  }
}

/**
 * 区切り線
 */
hr {
  margin: 40px 0;
  border: none;
  border-top: 1px solid #eaeaea;
}

/**
 * リンク
 */
.link {
  &-icon {
    width: 18px;
    height: 18px;
    fill: #007aff;
  }
}

/**
 * 状態
 */

.custom-input-text /deep/,
.custom-input-textarea /deep/ {
  .is {
    &-readonry {
      font-size: 15px;
      color: #8e8e8e;
      background-color: #cdced0;
    }
  }
}

/**
 * アイコン
 */
.icon {
  &-help {
    width: 20px;
    height: 20px;
    fill: #b0b3be;
    margin: 0 0 0 10px;
    cursor: pointer;
  }
}

/**
 * ボタン
 */
.settings {
  display: flex;
  justify-content: center;
  margin: 46px 0 0 0;
  .btn {
    &-cancel {
      margin: 0 16px 0 0;
    }
    &-long {
      width: auto;
      min-width: 200px;
    }
    &.disabled {
      cursor: auto;
      opacity: 0.7;
    }
  }
}
</style>
