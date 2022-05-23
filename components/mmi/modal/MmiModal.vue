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
              <slot name="title"></slot>
            </h3>
            <p><slot name="desc"></slot></p>
          </div>
          <div class="modal_contents">
            <slot />
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
  name: 'MmiModal',
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
    ...mapMutations('form/editFormSettings', ['setSelectPartsInfo']),
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
