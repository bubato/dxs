<template>
  <div class="space-settings">
    <p>空白</p>
    <CustomInputRadio
      v-model="component.spaceInfo.spaceKind"
      :options="spaceKindOptions"
      name="spaceKind"
      class="spaceKind"
      @input="changeSpaceKind()"
    />
    <div class="space-settings-detail">
      <div
        v-if="component.spaceInfo.spaceKind === '1'"
        class="space-settings-detail-all"
      >
        <div class="detail-num">
          <CustomInputSelect
            v-model="component.spaceInfo.space"
            :options="spaceNumOptions"
          />
        </div>
      </div>
      <div
        v-if="component.spaceInfo.spaceKind === '2'"
        class="space-settings-detail-individual"
      >
        <div class="detail-num">
          <span>上</span>
          <CustomInputSelect
            v-model="component.spaceInfo.topSpace"
            :options="spaceNumOptions"
          />
        </div>
        <div class="detail-num">
          <span>下</span>
          <CustomInputSelect
            v-model="component.spaceInfo.bottomSpace"
            :options="spaceNumOptions"
          />
        </div>
        <div class="detail-num">
          <span>左</span>
          <CustomInputSelect
            v-model="component.spaceInfo.leftSpace"
            :options="spaceNumOptions"
          />
        </div>
        <div class="detail-num">
          <span>右</span>
          <CustomInputSelect
            v-model="component.spaceInfo.rightSpace"
            :options="spaceNumOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingSpaceValue',
  props: {
    component: { type: Object, required: true },
  },
  data() {
    return {
      spaceNumOptions: [
        {
          code: '1',
          label: '0',
        },
        {
          code: '2',
          label: '20',
        },
        {
          code: '3',
          label: '40',
        },
        {
          code: '4',
          label: '60',
        },
        {
          code: '5',
          label: '80',
        },
        {
          code: '6',
          label: '100',
        },
      ],
      spaceKindOptions: [
        {
          value: '1',
          label: 'すべて',
        },
        {
          value: '2',
          label: '個別設定',
        },
      ],
    }
  },
  computed: {},
  methods: {
    /**
     * 空白タイプの変更時、空白値を全て0に設定
     */
    changeSpaceKind() {
      if (this.component.spaceInfo.spaceKind === '1') {
        this.component.spaceInfo.space = '1'
        this.component.spaceInfo.topSpace = '1'
        this.component.spaceInfo.rightSpace = '1'
        this.component.spaceInfo.bottomSpace = '1'
        this.component.spaceInfo.leftSpace = '1'
      } else {
        this.component.spaceInfo.topSpace = this.component.spaceInfo.space
        this.component.spaceInfo.rightSpace = this.component.spaceInfo.space
        this.component.spaceInfo.bottomSpace = this.component.spaceInfo.space
        this.component.spaceInfo.leftSpace = this.component.spaceInfo.space
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.space-settings {
  .spaceKind {
    margin-top: 12px;
  }
  &-detail {
    margin-top: 16.5px;
    &-all {
      display: flex;
      align-items: center;
    }
    &-individual {
      display: flex;
      align-items: center;
    }
    .detail-num {
      span {
        font-size: 13px;
      }
      .custom-input-select {
        margin-top: 12px;
      }
      &:not(:first-child) {
        margin-left: 16px;
      }
    }
  }
}
</style>
