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
            <h3>表示項目を変更する</h3>
          </div>
          <div class="modal_contents">
            <p class="context">
              一覧に表示する項目の追加・削除や並び替えができます。<br />
              追加したいデータを左のブロックからドラッグアンドドロップしてください。<br />
              表示を消す場合は×をクリックしてください。
            </p>
            <div class="lists">
              <div class="list" data-type="canAddData">
                <p>追加可能なデータ</p>
                <div class="list-block">
                  <draggable
                    v-model="canAddItems"
                    tag="ul"
                    group="dispData"
                    v-bind="dragOptions"
                  >
                    <transition-group type="transition">
                      <li
                        v-for="item in canAddItems"
                        :key="item.id"
                        class="item"
                      >
                        <DehazeSVG class="icon-dehaze" />
                        <span class="name">{{ item.name }}</span>
                      </li>
                    </transition-group>
                  </draggable>
                </div>
              </div>
              <div class="list" data-type="dispData">
                <p>表示中のデータ</p>
                <div class="list-block">
                  <draggable
                    v-model="dispItems"
                    tag="ul"
                    group="dispData"
                    v-bind="dragOptions"
                    :move="onMove"
                  >
                    <transition-group type="transition">
                      <li
                        v-for="item in dispItems"
                        :key="item.id"
                        :data-required="item.required"
                        class="item"
                      >
                        <DehazeSVG class="icon-dehaze" />
                        <span class="name">{{ item.name }}</span>
                        <template v-if="item.required">
                          <span class="require">必須</span>
                        </template>
                        <template v-else>
                          <CancelSVG
                            class="icon-cancel"
                            @click="moveCanAddData(item.id)"
                          />
                        </template>
                      </li>
                    </transition-group>
                  </draggable>
                </div>
              </div>
            </div>
            <div class="buttons">
              <button
                class="btn btn-long btn-cancel"
                @click="closeModal($event, 'close')"
              >
                キャンセル
              </button>
              <button
                class="btn btn-long btn-basic"
                @click="saveDispTableItems()"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ChangeTableItemModal',
  components: {
    draggable,
  },
  props: {
    propCanAddItems: {
      type: Array,
      default: () => [],
      required: true,
    },
    propDispItems: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      canAddItems: [],
      dispItems: [],
    }
  },
  computed: {
    ...mapState('cms/editorStore', ['editComponentModalData']),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  created() {
    this.setInitDispTableItems()
  },
  methods: {
    ...mapMutations('communication/mailList', ['setDispTableItem']),
    /**
     * 初期表示データの設定
     */
    setInitDispTableItems() {
      this.canAddItems = JSON.parse(JSON.stringify(this.propCanAddItems))
      this.dispItems = JSON.parse(JSON.stringify(this.propDispItems))
    },
    /**
     * 表示項目を親画面に反映
     */
    saveDispTableItems() {
      this.$emit('update', {
        canAddItems: this.canAddItems,
        dispItems: this.dispItems,
      })
      this.$emit('close')
    },
    /**
     * 表示項目から、表示可能項目へ項目を移動
     * @param {Number} 項目ID
     */
    moveCanAddData(id) {
      this.canAddItems.push(this.dispItems.find((item) => item.id === id))
      this.dispItems = this.dispItems.filter((item) => {
        if (item.id !== id) {
          return item
        }
      })
    },
    /**
     * ドロップ処理
     *
     * @param {object} e イベントオブジェクト
     */
    onMove(e) {
      let result = true
      const targetRequired = e.dragged.getAttribute('data-required')
      const dropAreaType = e.to.closest('.list').getAttribute('data-type')

      if (targetRequired) {
        if (dropAreaType === 'canAddData') {
          result = false
        }
      }

      return result
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
.modal-container {
  width: 684px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }
  .modal_contents {
    .context {
      margin-top: 8px;
      padding: 0 40px;
    }
    .lists {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      .list {
        width: 290px;
        height: 390px;
        border: 1px solid #e5e5e5;
        p {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          color: #8d8d8d;
          background: #e2e3e5;
          border-radius: 6px 6px 0 0;
        }
        .list-block {
          height: 342px;
          overflow: auto;
          ul {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px;
            height: 100%;
            > span {
              width: 100%;
              height: 100%;
            }
            li {
              display: flex;
              align-items: center;
              width: 258px;
              height: 48px;
              background: #f7f8f9;
              border: 1px solid #e5e5e5;
              border-radius: 4px;
              padding: 0 12px;
              &:not(:first-child) {
                margin-top: 8px;
              }
              .icon-dehaze {
                width: 16px;
                height: 16px;
              }
              .name {
                width: calc(100% - 56px);
                text-align: center;
              }
              .require {
                width: 40px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                font-size: 12px;
                color: #ffffff;
                background-color: #ff453a;
                border: 1px solid #ff453a;
              }
            }
          }
        }
      }
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      button {
        &:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
