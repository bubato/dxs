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
            <h3>{{ componentName }}</h3>
          </div>
          <div class="modal_contents">
            <div class="input_form">
              <MailEditLayoutOneColumn
                v-if="component.id === 'layout-1'"
                :key="component.id"
                :component="component"
              />
              <MailEditLayoutTwoColumn
                v-if="component.id === 'layout-2'"
                :key="component.id"
                :component="component"
              />
              <MailEditLayoutThreeColumn
                v-if="component.id === 'layout-3'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleHeading
                v-if="component.id.includes('heading')"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleText
                v-if="component.id === 'text'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleList
                v-if="component.id === 'list'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleAnnotation
                v-if="component.id === 'annotation'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleImage
                v-if="component.id === 'image'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleButton
                v-if="component.id === 'button'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleSeparator
                v-if="component.id === 'separator'"
                :key="component.id"
                :component="component"
              />
              <MailEditSingleSpace
                v-if="component.id === 'space'"
                :key="component.id"
                :component="component"
              />
            </div>
            <div class="buttons">
              <button
                class="btn btn-cancel btn-long"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-basic btn-long"
                :class="{ 'btn-disabled': reflectButtonDisabledFlg }"
                @click="saveInputData()"
              >
                OK
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
  name: 'EditMailComponentModal',
  data() {
    return {
      outTargetFlg: false,
      componentName: '',
      component: {},
    }
  },
  computed: {
    ...mapState('mail/editMailSettings', [
      'selectComponentInfo',
      'reflectButtonDisabledFlg',
    ]),
  },
  created() {
    this.componentName = this.selectComponentInfo.name
    this.component = JSON.parse(JSON.stringify(this.selectComponentInfo)) // 表示データの取得
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('mail/editMailSettings', ['setCancelAfterFunc']),
    /**
     * OKボタン押下処理
     */
    saveInputData() {
      this.$emit('update', this.component)
      this.$emit('close')
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      const sameDataFlg = this.$common.checkSameObject(
        this.component,
        this.selectComponentInfo
      )

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
          if (!sameDataFlg) {
            this.showCancelEditModal()
          } else {
            this.$emit('close')
          }
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        if (!sameDataFlg) {
          this.setCancelAfterFunc('editModalClose')
          this.showCancelEditModal()
        } else {
          this.$emit('close')
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-wrapper {
  display: flex;
  justify-content: center;
}
.modal-container {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 50px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 20px;
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
      margin-top: 32px;
    }
  }
}
</style>
