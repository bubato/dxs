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
              <SetMainArea
                v-if="component.id === 'mainArea'"
                :key="component.id"
                :component="component"
              />
              <SetOneLineNews
                v-if="component.id === 'oneLineNews'"
                :key="component.id"
                :component="component"
              />
              <SetMessage
                v-if="component.id === 'message'"
                :key="component.id"
                :component="component"
              />
              <SetTextWithTopImages
                v-if="component.id === 'textWithTopImages'"
                :key="component.id"
                :component="component"
              />
              <SetTextWithLeftAndRightImages
                v-if="component.id === 'textWithLeftAndRightImages'"
                :key="component.id"
                :component="component"
              />
              <SetListDisplay
                v-if="component.id === 'listDisplay'"
                :key="component.id"
                :component="component"
              />
              <SetCompanyOverview
                v-if="component.id === 'companyOverview'"
                :key="component.id"
                :component="component"
              />
              <SetMap
                v-if="component.id === 'map'"
                :key="component.id"
                :component="component"
              />
              <SetConversion
                v-if="component.id === 'conversion'"
                :key="component.id"
                :component="component"
              />
              <SetStep
                v-if="component.id === 'step'"
                :key="component.id"
                :component="component"
              />
              <SetCustomerVoice
                v-if="component.id === 'customerVoice'"
                :key="component.id"
                :component="component"
              />
              <LayoutTwoColumn
                v-if="component.id === 'layout-2'"
                :key="component.id"
                :component="component"
              />
              <LayoutThreeColumn
                v-if="component.id === 'layout-3'"
                :key="component.id"
                :component="component"
              />
              <LayoutFourColumn
                v-if="component.id === 'layout-4'"
                :key="component.id"
                :component="component"
              />
              <SingleHeading
                v-if="component.id.includes('heading')"
                :key="component.id"
                :component="component"
              />
              <SingleText
                v-if="component.id === 'text'"
                :key="component.id"
                :component="component"
              />
              <SingleAnnotation
                v-if="component.id === 'annotation'"
                :key="component.id"
                :component="component"
              />
              <SingleList
                v-if="component.id === 'list'"
                :key="component.id"
                :component="component"
              />
              <SingleImage
                v-if="component.id === 'image'"
                :key="component.id"
                :component="component"
              />
              <SingleTable
                v-if="component.id === 'table'"
                :key="component.id"
                :component="component"
              />
              <SingleButton
                v-if="component.id === 'button'"
                :key="component.id"
                :component="component"
              />
              <SingleSpace
                v-if="component.id === 'space'"
                :key="component.id"
                :component="component"
              />
              <SingleMovie
                v-if="component.id === 'movie'"
                :key="component.id"
                :component="component"
              />
              <SingleAccordion
                v-if="component.id === 'accordion'"
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
  name: 'EditSetComponentModal',
  data() {
    return {
      outTargetFlg: false,
      componentName: '',
      component: [],
      buttonsOption: [
        {
          code: '1',
          label: 'お問い合わせ1',
          link: 'hogehoge1',
        },
        {
          code: '2',
          label: 'お問い合わせ2',
          link: 'hogehoge2',
        },
        {
          code: '3',
          label: 'お問い合わせ3',
          link: 'hogehoge3',
        },
      ],
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['editComponentModalData']),
    ...mapState('form/editFormSettings', ['reflectButtonDisabledFlg']),
  },
  created() {
    this.componentName = this.editComponentModalData.selectComponentInfo.componentName
    this.component = JSON.parse(
      JSON.stringify(this.editComponentModalData.targetComponent)
    ) // 表示データの取得
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('cms/editorStore', ['setEditComponentModalData']),
    /**
     * OKボタン押下処理
     */
    saveInputData() {
      const newEditComponentModalData = JSON.parse(
        JSON.stringify(this.editComponentModalData)
      )
      newEditComponentModalData.targetComponent = this.component

      this.setEditComponentModalData(newEditComponentModalData)
      this.$emit('reflect')
    },
    addShowButton(showButtons) {
      showButtons.push({ code: '', label: '', link: '' })
    },
    /**
     * ボタンのラベルとリンクを設定
     */
    setButtonLabelLink(buttonObj) {
      for (let i = 0; i < this.buttonsOption.length; i++) {
        if (this.buttonsOption[i].code === buttonObj.code) {
          buttonObj.label = this.buttonsOption[i].label
          buttonObj.link = this.buttonsOption[i].link
          break
        }
      }
    },
    /**
     * ボタンの削除
     */
    deleteSelect(buttonIndex) {
      this.component.buttons.splice(buttonIndex, 1)
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      const sameDataFlg = this.$common.checkSameObject(
        this.component,
        this.editComponentModalData.targetComponent
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
      margin-top: 20px;
    }
  }
}
</style>
