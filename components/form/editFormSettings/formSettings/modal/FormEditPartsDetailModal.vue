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
            <h3>
              入力項目設定：<span>{{ selectPartsInfo.name }}</span>
            </h3>
          </div>
          <div class="modal_contents">
            <div class="main">
              <div class="edit-parts">
                <FormEditPartsStep
                  v-if="selectPartsInfo.id === 'step'"
                  :parts-data="partsData"
                />
                <FormEditPartsTextField
                  v-if="selectPartsInfo.id === 'textField'"
                  :parts-data="partsData"
                />
                <FormEditPartsTextArea
                  v-if="selectPartsInfo.id === 'textArea'"
                  :parts-data="partsData"
                />
                <FormEditPartsRadio
                  v-if="selectPartsInfo.id === 'radioButton'"
                  :parts-data="partsData"
                />
                <FormEditPartsCheckbox
                  v-if="selectPartsInfo.id === 'checkbox'"
                  :parts-data="partsData"
                />
                <FormEditPartsSelectbox
                  v-if="selectPartsInfo.id === 'selectbox'"
                  :parts-data="partsData"
                />
                <FormEditPartsHeading1
                  v-if="selectPartsInfo.id === 'heading1'"
                  :parts-data="partsData"
                />
                <FormEditPartsHeading2
                  v-if="selectPartsInfo.id === 'heading2'"
                  :parts-data="partsData"
                />
                <FormEditPartsText
                  v-if="selectPartsInfo.id === 'text'"
                  :parts-data="partsData"
                />
                <FormEditPartsSeparator
                  v-if="selectPartsInfo.id === 'separator'"
                  :parts-data="partsData"
                />
                <FormEditPartsAttachingFile
                  v-if="selectPartsInfo.id === 'attachingFile'"
                  :parts-data="partsData"
                />
                <FormEditPartsNewsPermission
                  v-if="selectPartsInfo.id === 'newsPermission'"
                  :parts-data="partsData"
                />
                <FormEditPartsTermsAndConditionsDisplay
                  v-if="selectPartsInfo.id === 'termsAndConditionsDisplay'"
                  :parts-data="partsData"
                />
                <FormEditPartsSpacer
                  v-if="selectPartsInfo.id === 'spacer'"
                  :parts-data="partsData"
                />
                <FormEditPartsNewPage
                  v-if="selectPartsInfo.id === 'newPage'"
                  :parts-data="partsData"
                />
                <FormEditPartsParameter
                  v-if="selectPartsInfo.id === 'parameter'"
                  :parts-data="partsData"
                />
                <FormEditPartsPrefectures
                  v-if="selectPartsInfo.id === 'prefectures'"
                  :parts-data="partsData"
                />
                <FormEditPartsGender
                  v-if="selectPartsInfo.id === 'gender'"
                  :parts-data="partsData"
                />
                <FormEditPartsName
                  v-if="selectPartsInfo.id === 'name'"
                  :parts-data="partsData"
                />
                <FormEditPartsMailAddress
                  v-if="selectPartsInfo.id === 'mailAddress'"
                  :parts-data="partsData"
                />
                <FormEditPartsBirthday
                  v-if="selectPartsInfo.id === 'birthday'"
                  :parts-data="partsData"
                />
                <FormEditPartsYearMonth
                  v-if="selectPartsInfo.id === 'yearMonth'"
                  :parts-data="partsData"
                />
                <FormEditPartsDate
                  v-if="selectPartsInfo.id === 'date'"
                  :parts-data="partsData"
                />
                <FormEditPartsAddress
                  v-if="selectPartsInfo.id === 'address'"
                  :parts-data="partsData"
                />
              </div>
              <div class="preview-parts">
                <p class="heading">簡易プレビュー</p>
                <div class="preview-contents">
                  <FormPreviewPartsStep
                    v-if="selectPartsInfo.id === 'step'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsTextField
                    v-if="selectPartsInfo.id === 'textField'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsTextArea
                    v-if="selectPartsInfo.id === 'textArea'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsRadio
                    v-if="selectPartsInfo.id === 'radioButton'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsCheckbox
                    v-if="selectPartsInfo.id === 'checkbox'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsSelectbox
                    v-if="selectPartsInfo.id === 'selectbox'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsHeading1
                    v-if="selectPartsInfo.id === 'heading1'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsHeading2
                    v-if="selectPartsInfo.id === 'heading2'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsText
                    v-if="selectPartsInfo.id === 'text'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsSeparator
                    v-if="selectPartsInfo.id === 'separator'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsAttachingFile
                    v-if="selectPartsInfo.id === 'attachingFile'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsNewsPermission
                    v-if="selectPartsInfo.id === 'newsPermission'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsTermsAndConditionsDisplay
                    v-if="selectPartsInfo.id === 'termsAndConditionsDisplay'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsSpacer
                    v-if="selectPartsInfo.id === 'spacer'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsNewPage
                    v-if="selectPartsInfo.id === 'newPage'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsParameter
                    v-if="selectPartsInfo.id === 'parameter'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsPrefectures
                    v-if="selectPartsInfo.id === 'prefectures'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsGender
                    v-if="selectPartsInfo.id === 'gender'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsName
                    v-if="selectPartsInfo.id === 'name'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsMailAddress
                    v-if="selectPartsInfo.id === 'mailAddress'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsBirthday
                    v-if="selectPartsInfo.id === 'birthday'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsYearMonth
                    v-if="selectPartsInfo.id === 'yearMonth'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsDate
                    v-if="selectPartsInfo.id === 'date'"
                    :parts-data="partsData"
                  />
                  <FormPreviewPartsAddress
                    v-if="selectPartsInfo.id === 'address'"
                    :parts-data="partsData"
                  />
                </div>
              </div>
            </div>
            <div class="buttons">
              <button
                class="btn btn-cancel btn-middle"
                :class="{
                  'btn-disabled': $common.checkSameObject(
                    partsData,
                    selectPartsInfo.partsData
                  ),
                }"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-basic btn-middle"
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
  name: 'FormEditPartsDetailModal',
  data() {
    return {
      partsData: {},
    }
  },
  computed: {
    ...mapState('form/editFormSettings', [
      'selectPartsInfo',
      'reflectButtonDisabledFlg',
    ]),
  },
  created() {
    if (this.selectPartsInfo.partsData) {
      this.partsData = JSON.parse(
        JSON.stringify(this.selectPartsInfo.partsData)
      )
    }
  },
  methods: {
    ...mapMutations('common', ['showCancelEditModal']),
    ...mapMutations('form/editFormSettings', [
      'setSelectPartsInfo',
      'setCancelAfterFunc',
    ]),
    /**
     * 適用ボタン押下処理
     */
    saveInputData() {
      this.$emit('reflect', this.partsData)
      this.$emit('close')
    },
    /**
     * 適用ボタン押下処理
     */
    updatePartsData(value) {
      this.partsData = value
    },
    /**
     * モーダルを閉じる
     */
    closeModal(event, type) {
      const sameDataFlg = this.$common.checkSameObject(
        this.partsData,
        this.selectPartsInfo.partsData
      )

      this.setCancelAfterFunc('')

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
            this.setCancelAfterFunc('editPartsCancel')
            this.showCancelEditModal()
          } else {
            this.$emit('close')
          }
        }
        this.outTargetFlg = false
      } else if (type === 'close') {
        if (!sameDataFlg) {
          this.setCancelAfterFunc('editPartsCancel')
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
  align-items: center;
}
.modal-container {
  width: 944px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;
  position: static !important;
  transform: translate(0);

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    margin-top: 20px;
    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .edit-parts,
      .preview-parts {
        width: 422px;
        height: 468px;
        border: 1px solid #e5e5e5;
        overflow: auto;
      }
      .preview-parts {
        .heading {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 48px;
          background: #e2e3e5;
          color: #8d8d8d;
        }
        .preview-contents {
          padding: 24px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
    }
  }
}
</style>
