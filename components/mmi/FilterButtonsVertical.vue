<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <button
      class="btn btn-middle btn-utility filter-button"
      :class="{ empty: value === '' }"
      @click="$emit('click', $event)"
    >
      <template v-if="selectData.length === 0">
        {{ placeholder }}
      </template>
      <template v-else>
        <div class="select-condition">
          <div class="select-condition-label">{{ getConvertName() }}</div>
          <div v-if="number == 3" class="select-condition-label">{{ getConvertName() }}</div>
          <div v-if="number == 3" class="select-condition-label">{{ getConvertName() }}</div>
        </div>
      </template>
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mmiFilterUtilityMixin from '~/mixin/mmi/mmiFilterUtility.js'

export default {
  name: 'FilterButtons',
  mixins: [mmiFilterUtilityMixin],
  props: {
    title: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    selectData: {
      type: Array,
      default: () => [],
      required: false,
    },
    filterType: {
      type: Number,
      default: 0,
    },
    number: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      maxStrLength: 13,
    }
  },
  computed: {
    ...mapState('mmi/filterConditions', [
      'industryMasterList',
      'prefectureMasterList',
      'salesScaleMasterList',
      'companyTypeMasterList',
      'selectSaveCondition',
    ]),
    /**
     * コードに紐づく名称を取得
     *
     * @return {string} コードに紐づく名称
     */
    getConvertName() {
      return () => {
        let name = ''

        switch (this.filterType) {
          case 1: // 1:業種
            name = this.getSelectIndustryName()
            break
          case 2: // 2:所在地
            name = this.getPrefectureCodeToName()
            break
          case 3: // 3:売上規模
            name = this.getSalesScaleCodeToName()
            break
          case 4: // 4:企業分類
            name = this.getCompanyTypeCodeToName()
            break
        }

        if (name.length > this.maxStrLength) {
          name = name.substr(0, this.maxStrLength) + '...'
        }

        return name
      }
    },
  },
  watch: {},
  methods: {
    /**
     * 表示する業種ラベルの取得
     */
    getSelectIndustryName() {
      let industryName = ''
      const selectIndustryCode = this.selectSaveCondition.items.industryCodes
      const selectIndustryCategory = this.selectSaveCondition.items
        .industryCategory

      if (selectIndustryCategory.includes('すべての業種')) {
        industryName = 'すべての業種'
      } else {
        for (let i = 0; i < this.industryMasterList.length; i++) {
          if (industryName) {
            break
          }
          for (
            let j = 0;
            j < this.industryMasterList[i].industryChild.length;
            j++
          ) {
            if (industryName) {
              break
            }
            if (
              selectIndustryCategory.includes(
                this.industryMasterList[i].industryChild[j].industry
              )
            ) {
              industryName = this.industryMasterList[i].industryChild[j]
                .industry
              break
            } else {
              for (
                let k = 0;
                k < this.industryMasterList[i].industryChild[j].items.length;
                k++
              ) {
                if (
                  selectIndustryCode.includes(
                    this.industryMasterList[i].industryChild[j].items[k]
                      .compareCode
                  )
                ) {
                  industryName = this.industryCodeToName(
                    this.industryMasterList[i].industryChild[j].items[k]
                      .compareCode
                  )
                  break
                }
              }
            }
          }
        }
      }

      return industryName
    },
    /**
     * 表示する所在地ラベルの取得
     */
    getPrefectureCodeToName() {
      let prefectureName = ''
      const selectPrefectureCode = this.selectSaveCondition.items
        .prefectureCodes
      const selectPrefectureCategory = this.selectSaveCondition.items
        .prefectureCategory

      if (selectPrefectureCategory.includes('all')) {
        prefectureName = 'すべての都道府県'
      } else {
        for (let i = 0; i < this.prefectureMasterList.length; i++) {
          if (prefectureName) {
            break
          }
          if (
            selectPrefectureCategory.includes(
              this.prefectureMasterList[i].locationGroup
            )
          ) {
            prefectureName = this.prefectureMasterList[i].locationGroup
            break
          } else {
            for (
              let j = 0;
              j < this.prefectureMasterList[i].items.length;
              j++
            ) {
              if (
                selectPrefectureCode.includes(
                  this.prefectureMasterList[i].items[j].code
                )
              ) {
                prefectureName = this.prefectureCodeToName(
                  this.prefectureMasterList[i].items[j].code
                )
                break
              }
            }
          }
        }
      }

      return prefectureName
    },
    /**
     * 表示する売上規模ラベルの取得
     */
    getSalesScaleCodeToName() {
      let salesScaleName = ''
      const selectSalesScaleCode = this.selectSaveCondition.items.salesScaleCode
      for (let i = 0; i < this.salesScaleMasterList.length; i++) {
        for (let j = 0; j < this.salesScaleMasterList[i].items.length; j++) {
          if (
            this.salesScaleMasterList[i].items[j].code === selectSalesScaleCode
          ) {
            salesScaleName = this.salesScaleCodeToName(
              this.salesScaleMasterList[i].items[j].code
            )
            break
          }
        }
      }
      return salesScaleName
    },
    /**
     * 表示する企業分類ラベルの取得
     */
    getCompanyTypeCodeToName() {
      let companyTypeCodeName = ''
      const selectCompanyType = this.selectSaveCondition.items.companyType
      for (let i = 0; i < this.companyTypeMasterList.items.length; i++) {
        if (this.companyTypeMasterList.items[i].code === selectCompanyType) {
          companyTypeCodeName = this.companyTypeCodeToName(
            this.companyTypeMasterList.items[i].code
          )
          break
        }
      }
      return companyTypeCodeName
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: column;
  .title {
    margin: 8px 0px;
    color: #1e1e1e;
  }
}
button.filter-button {
  color: #010101;
  width: 100%;
  height: 48px;
  &.empty {
    color: #1e1e1e;
    font-size: 15px;
  }
}
.select-condition {
  display: block;
  align-items: flex-end;
  max-width: 100%;
  width: 100%;
  &-label {
    color: #1e1e1e;
    font-size: 13px;
    border-radius: 4px;
    padding: 6px 12px;
    background-color: #d1e7ff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .omit {
    margin-left: 8px;
  }
}
.select-condition-label {
  margin: 10px;
  width: 100%;
  margin-left: 0px;
}
.filter-button {
  height: max-content !important;
  padding-top: 12px;
  padding-bottom: 12px;
  border: none
}
</style>
