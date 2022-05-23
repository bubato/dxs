<template>
  <div class="hover-elements">
    <span class="component-name">
      {{ component.name }}
    </span>
    <div class="menu_buttons">
      <button
        @mouseover="$common.setAreaLabel($event, 'top', '編集')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
        @click="editComponent()"
      >
        <CreateSVG />
      </button>
      <!--
      <button
        :class="{
          'btn-disabled': checkDisabledEditBtn(component.id),
        }"
        @click="saveCustomPartsComponent(component)"
        @mouseover="$common.setAreaLabel($event, 'top', '保存')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
      >
        <GradeSVG />
      </button>
      -->
      <button
        @click="showDeleteComponentModal()"
        @mouseover="$common.setAreaLabel($event, 'top', '削除')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
      >
        <DeleteForeverSVG />
      </button>
      <button
        :class="{
          'btn-disabled': upwardBtnDisabled,
        }"
        @mouseover="$common.setAreaLabel($event, 'top', '上に移動')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
        @click="moveComponent('upward')"
      >
        <ArrowUpwardSVG />
      </button>
      <button
        :class="{
          'btn-disabled': downwardBtnDisabled,
        }"
        @mouseover="$common.setAreaLabel($event, 'top', '下に移動')"
        @mouseleave="$common.setAreaLabel($event, '', '')"
        @blur="$common.setAreaLabel($event, '', '')"
        @click="moveComponent('downward')"
      >
        <ArrowDownwardSVG />
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MailComponentHoverElements',
  props: {
    component: { type: Object, required: true, default: () => {} },
    upwardBtnDisabled: { type: Boolean, required: true, default: false },
    downwardBtnDisabled: { type: Boolean, required: true, default: false },
    indexObj: { type: Object, required: true, default: () => {} },
  },
  computed: {},
  methods: {
    ...mapMutations('mail/editMailSettings', [
      'setSelectComponentInfo',
      'setShowDeleteMailComponentModalState',
      'setSelectComponentIndexObj',
      'setShowEditMailComponentModalState',
    ]),
    /**
     * コンポーネントの編集
     */
    editComponent() {
      this.setSelectComponentIndexObj(this.indexObj)
      this.setSelectComponentInfo(this.component)
      this.setShowEditMailComponentModalState(true)
    },
    /**
     * メールコンポーネント削除モーダルの表示
     */
    showDeleteComponentModal() {
      this.setSelectComponentIndexObj(this.indexObj)
      this.setSelectComponentInfo(this.component)
      this.setShowDeleteMailComponentModalState(true)
    },
    /**
     * コンポーネントの移動
     *
     * @param {string} moveType upward(上に移動) or downward(下に移動)
     */
    moveComponent(moveType) {
      if (moveType === 'upward') {
        this.$emit('up')
      } else if (moveType === 'downward') {
        this.$emit('down')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hover-elements {
  display: none;
}
</style>
