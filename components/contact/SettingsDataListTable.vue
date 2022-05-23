<template>
  <div class="settings-data-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="title">タイトル</th>
            <th class="type">種別</th>
            <th class="explanation">説明</th>
            <th class="btnCell"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in dataItemDefinitionList" :key="index">
            <td class="title">
              {{ data.dataItemDefinitionId }}
              {{ data.title }}
            </td>
            <td class="type" :data-index="index">
              {{ getTypeLabel(data.dataItemType) }}
            </td>
            <td class="explanation">
              {{ data.dataItemExplanation }}
            </td>
            <td class="btnCell">
              <button
                class="btn btn-short"
                @click="deleteListData(data.dataItemDefinitionId)"
                @mouseover="
                  $common.setAreaLabel($event, 'left', '追加項目を削除します')
                "
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              >
                削除
              </button>
            </td>
          </tr>
          <tr
            v-for="(newData, index) in settingCreateDataList"
            :key="`new-${index}`"
            class="customCell"
          >
            <td class="title">
              <CustomInputText
                v-model="newData.title"
                maxlength="50"
                placeholder="項目のタイトルを入力してください"
                :validation="
                  $common.getFormItemsDetail(formItems, 'dataItemTitle')
                    .validation
                "
              />
            </td>
            <td class="type" :data-index="index">
              <CustomInputSelect
                v-model="newData.dataItemType"
                :options="dataItemType"
                :validation="
                  $common.getFormItemsDetail(formItems, 'dataItemType')
                    .validation
                "
              />
            </td>
            <td class="explanation">
              <CustomInputText
                v-model="newData.dataItemExplanation"
                maxlength="200"
                placeholder="項目の説明を入力してください"
              />
            </td>
            <td class="btnCell"></td>
          </tr>
          <tr class="customCell link">
            <td colspan="4" @click="addData()">
              <AddCircleSVG class="icon-addCircle" />データ項目を追加
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'SettingsDataListTable',
  props: {},
  data() {
    return {
      maxContentsLength: 50, // 追加情報最大登録数
      formItems: [
        {
          id: 'dataItemTitle',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_CFM02'),
            },
          ],
        },
        {
          id: 'dataItemType',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_CFM02'),
            },
          ],
        },
      ],
      isShowDeleteModal: false,
      dataItemType: this.$common.getVersatileOptions(36),
    }
  },
  computed: {
    ...mapState('contact/contactList', [
      'dataItemDefinitionList',
      'settingCreateDataList',
    ]),
  },
  mounted() {
    this.initData()
  },
  methods: {
    ...mapMutations('contact/contactList', [
      'setDataItemDefinitionList',
      'setDeleteSelectId',
      'setNewAddDataItemDefinitionList',
      'setSettingCreateDataList',
    ]),
    /**
     * データの初期化
     */
    initData() {
      this.setSettingCreateDataList([])
    },
    /**
     * タイブNoからラベル名を取得
     *
     * @param {Number} type 種別タイプNo
     * @returns {String} ラベル名
     */
    getTypeLabel(type) {
      return this.dataItemType.find((data) => data.code === type.toString())
        .value
    },
    /**
     * データの新規追加
     */
    addData() {
      if (
        this.dataItemDefinitionList.length +
          this.settingCreateDataList.length >=
        this.maxContentsLength
      ) {
        this.$emit('maxCount')
      } else {
        const newListData = JSON.parse(
          JSON.stringify(this.settingCreateDataList)
        )
        newListData.push({
          title: '',
          dataItemExplanation: '',
          dataItemType: '1',
        })
        this.setSettingCreateDataList(newListData)
      }
    },
    /**
     * データの削除（削除対象IDの保存）
     */
    deleteListData(id) {
      this.setDeleteSelectId(id)
      this.$emit('delete')
    },
  },
}
</script>

<style lang="scss" scoped>
.settings-data-list-table {
  margin-top: 30px;
}
.table-scroll {
  margin-top: 17px;
  table {
    tbody {
      tr {
        height: 70px;
      }
    }
    tr {
      th,
      td {
        padding-right: 12px;
        &.title {
          width: 173px;
          min-width: 173px;
        }
        &.type {
          width: 140px;
          min-width: 140px;
        }
        &.explanation {
          width: auto;
          min-width: 460px;
        }
        &.btnCell {
          width: 74px;
          min-width: 74px;
          .btn {
            color: #1e1e1e;
            background: #ffffff;
            border: #e0e0e0 1px solid;
            overflow: visible;
            overflow: initial;
          }
        }
      }
    }
  }
}
.customCell {
  &.link {
    background: #fff;
    cursor: pointer;
    td {
      background: #fff;
    }
  }
  .title {
    input {
      width: 150px;
    }
  }
  .type {
    select {
      width: 116px;
    }
  }
  .explanation {
    input {
      width: 436px;
    }
  }

  .icon-addCircle {
    margin-right: 10px;
  }
}
</style>
