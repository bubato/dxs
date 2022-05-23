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
            <h4><AttentionSVG class="icon-attention" />追加項目の削除</h4>
            <p v-if="formData === ''">
              選択した追加項目を削除しますか。<br />
              一度削除した追加項目は元に戻せません。
            </p>
            <template v-if="formData !== ''">
              <p>
                選択した追加項目を削除しますか。<br />
                この項目は以下のフォームからコンタクトへのデータ連携が有効となっているため<br />
                フォームへ回答があっても正しくデータ連携されなくなります。
              </p>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="formData" v-html="formData"></p>
            </template>
          </div>
          <div class="buttons">
            <button
              class="btn btn-cancel btn-middle"
              @click="closeModal($event, 'close')"
            >
              キャンセル
            </button>
            <button class="btn btn-basic btn-middle" @click="deleteData()">
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SettingsDataListDeleteModal',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('contact/contactList', [
      'dataItemDefinitionList',
      'deleteSelectId',
    ]),
    /**
     * フォームデータがある場合、フォームデータ文字列を取得
     *
     * @returns {String} フォームデータ文字列
     */
    formData() {
      let result = ''
      const formList = this.dataItemDefinitionList.find(
        (data) => data.dataItemDefinitionId === this.deleteSelectId
      ).formTitleList

      if (Array.isArray(formList)) {
        result = formList.join('<br>')
      }

      return result
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * データを削除する
     */
    deleteData() {
      this.$emit('delete')
    },
    /**
     * モーダルを閉じる
     *
     * @param {object} event イベントオブジェクト
     * @param {String} type クローズタイプ
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
.modal-container {
  width: 550px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
    h4 {
      margin-bottom: 9px;
    }
    p {
      text-align: left;
      margin-top: 24px;
      margin-bottom: 32px;
      &:first-content {
        margin-top: 0;
      }
    }
  }
}
.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.formData {
  padding: 20px;
  background: #f7f8f9;
  border-radius: 6px;
}
.buttons * {
  color: #ffffff;
}
.icon-attention {
  margin-right: 12px;
}
</style>
