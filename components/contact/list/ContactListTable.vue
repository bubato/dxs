<template>
  <div class="contact-list-table">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="checkbox">
              <label for="checkAll">
                <input
                  id="checkAll"
                  :checked="allCheckState()"
                  type="checkbox"
                  class="input-checkbox"
                  @click="checkAllContact($event)"
                />
                <span></span>
              </label>
            </th>

            <template v-for="dispItem in propDispItems">
              <th
                v-if="checkJoinContent(dispItem.defaultDataItemDefinitionId)"
                :key="dispItem.dataItemDefinitionId"
                :class="titleToClassName[dispItem.defaultDataItemDefinitionId]"
              >
                <span v-if="dispItem.defaultDataItemDefinitionId === 7"
                  >氏名</span
                >
                <span v-if="dispItem.defaultDataItemDefinitionId === 9"
                  >シメイ</span
                >
                <span v-if="dispItem.defaultDataItemDefinitionId === 13"
                  >住所</span
                >
                <span
                  v-if="
                    dispItem.defaultDataItemDefinitionId !== 7 &&
                    dispItem.defaultDataItemDefinitionId !== 9 &&
                    dispItem.defaultDataItemDefinitionId !== 13
                  "
                  >{{ dispItem.title }}</span
                >
                <SortSpinner
                  :sort-id="dispItem.dataItemDefinitionId.toString()"
                  :current-type="contactSelectSortType"
                  @spinner-click="updateSortTable($event)"
                />
              </th>
            </template>
            <th class="settings"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, index) in contactList" :key="index">
            <td class="checkbox">
              <label>
                <input
                  :checked="checkSelectContactState(contact.contactId)"
                  type="checkbox"
                  name="checkContact"
                  class="input-checkbox"
                  @click="checkSelectContact($event, contact)"
                />
                <span></span>
              </label>
            </td>
            <template v-for="dispItem in propDispItems">
              <td
                v-if="checkJoinContent(dispItem.defaultDataItemDefinitionId)"
                :key="dispItem.id"
                :class="titleToClassName[dispItem.defaultDataItemDefinitionId]"
              >
                <template v-if="dispItem.defaultDataItemDefinitionId === 21">
                  <ul class="tag-list flex">
                    <li
                      v-for="(tag, tagIndex) in getTagData(
                        getContactData(
                          dispItem.defaultDataItemDefinitionId,
                          contact.contactInformation
                        )
                      )"
                      :key="tagIndex"
                    >
                      {{ tag }}
                    </li>
                    <li
                      v-if="
                        getContactData(
                          dispItem.defaultDataItemDefinitionId,
                          contact.contactInformation
                        ).length >= 2
                      "
                      class="moreBtn"
                      @click="selectTagDialogIndex = index"
                    >
                      +{{
                        getContactData(
                          dispItem.defaultDataItemDefinitionId,
                          contact.contactInformation
                        ).length - 2
                      }}
                    </li>
                  </ul>
                  <ContactListTagDialog
                    v-if="selectTagDialogIndex === index"
                    v-on-clickaway="resetTagDialogIndex"
                    :list="
                      getContactData(
                        dispItem.defaultDataItemDefinitionId,
                        contact.contactInformation
                      )
                    "
                  />
                </template>
                <template v-if="dispItem.defaultDataItemDefinitionId === 3">
                  <ul class="flex">
                    <li
                      v-for="(manager, managerIndex) in getContactData(
                        dispItem.defaultDataItemDefinitionId,
                        contact.contactInformation
                      )"
                      :key="managerIndex"
                    >
                      {{ manager }}
                    </li>
                  </ul>
                </template>
                <template v-if="dispItem.defaultDataItemDefinitionId === 7">
                  <div
                    class="link-text"
                    @click="showDetailDrawer(contact.contactId)"
                  >
                    {{ getContactData(7, contact.contactInformation) }}
                    {{ getContactData(8, contact.contactInformation) }}
                  </div>
                </template>
                <template v-if="dispItem.defaultDataItemDefinitionId === 9">
                  {{ dispItem.defaultDataItemDefinitionId }}
                  {{ getContactData(9, contact.contactInformation) }}
                  {{ getContactData(10, contact.contactInformation) }}
                </template>
                <template
                  v-else-if="dispItem.defaultDataItemDefinitionId === 13"
                >
                  <p>
                    {{ getContactData(13, contact.contactInformation)
                    }}{{ getContactData(14, contact.contactInformation) }}
                  </p>
                  <p>
                    {{ getContactData(15, contact.contactInformation)
                    }}{{ getContactData(16, contact.contactInformation) }}
                  </p>
                </template>
                <template
                  v-if="
                    dispItem.defaultDataItemDefinitionId !== 21 &&
                    dispItem.defaultDataItemDefinitionId !== 3 &&
                    dispItem.defaultDataItemDefinitionId !== 7 &&
                    dispItem.defaultDataItemDefinitionId !== 8 &&
                    dispItem.defaultDataItemDefinitionId !== 9 &&
                    dispItem.defaultDataItemDefinitionId !== 10 &&
                    dispItem.defaultDataItemDefinitionId !== 13 &&
                    dispItem.defaultDataItemDefinitionId !== 14 &&
                    dispItem.defaultDataItemDefinitionId !== 15 &&
                    dispItem.defaultDataItemDefinitionId !== 16
                  "
                >
                  {{
                    getContactData(
                      dispItem.defaultDataItemDefinitionId,
                      contact.contactInformation
                    )
                  }}
                </template>
              </td>
            </template>
            <td class="settings">
              <div class="relative">
                <SettingsSVG
                  class="icon icon-setting"
                  @click="setSelectContactStatus(index)"
                  @mouseover="$common.setAreaLabel($event, 'left', 'メニュー')"
                  @mouseleave="$common.setAreaLabel($event, '', '')"
                  @blur="$common.setAreaLabel($event, '', '')"
                />
                <ContactListMenuDialog
                  v-if="
                    selectMenuDialogIndex === index &&
                    Object.keys(selectContactInfo).length > 0
                  "
                  v-on-clickaway="resetSelectMenuDialogIndex"
                  @update="$emit('update')"
                  @close="resetSelectMenuDialogIndex()"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ContactListTable',
  mixins: [clickaway],
  props: {
    propDispItems: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      selectMenuDialogIndex: null,
      selectTagDialogIndex: null,
      titleToClassName: {
        1: 'nomal', // 登録日
        2: 'nomal', // 顧客ID
        3: 'manager', // 営業担当者
        4: 'companyName', // 企業名
        5: 'position-department', // 部署名
        6: 'position', // 役職名
        7: 'fullName', // 氏
        8: 'nomal', // 名
        9: 'nomal', // 氏（フリガナ）
        10: 'nomal', // 名（フリガナ）
        11: 'mailAddress', // メールアドレス
        12: 'nomal', // 住所 郵便番号
        13: 'nomal', // 住所 都道府県
        14: 'nomal', // 住所 市区町村
        15: 'address', // 住所 番地
        16: 'nomal', // 住所 建物名
        17: 'tel1', // 電話番号1
        18: 'tel2', // 電話番号2
        19: 'nomal', // メール配信フラグ
        20: 'nomal', // 配信エラー回数
        21: 'tag', // タグ
        22: 'memo', // メモ
      },
    }
  },
  computed: {
    ...mapState('contact/contactList', [
      'contactList',
      'checkContactList',
      'selectContactInfo',
      'contactSelectSortType',
    ]),
    /**
     * チェック状態の取得
     *
     * @return {boolean} true:チェック済み false:未チェック
     */
    checkSelectContactState() {
      return (contactId) => {
        const result = this.checkContactList.find(
          (data) => data.contactId === contactId
        )

        return result
      }
    },
    /**
     * 全チェック状態
     *
     * @return {boolean} true:チェック済み false:未チェック
     */
    allCheckState() {
      return () => {
        let result = true

        this.contactList.forEach((item) => {
          const findIndex = this.checkContactList.findIndex(
            (data) => data.contactId === item.contactId
          )

          if (findIndex < 0) {
            result = false
          }
        })

        return result
      }
    },
  },
  methods: {
    ...mapMutations('contact/contactList', [
      'setContactList',
      'setCheckContactList',
      'setSelectContactInfo',
      'setContactSelectSortType',
    ]),
    /**
     * 詳細情報ドロアの表示
     *
     * @param {Numbrt} 選択したコンタクトID
     */
    showDetailDrawer(contactId) {
      this.$emit('detail', contactId)
    },
    /**
     * コンタクトリストタグダイアログの表示
     */
    resetTagDialogIndex() {
      this.selectTagDialogIndex = null
    },
    /**
     * 最大数2件までのタグリストの取得
     *
     * @param {Array} tagDataList タグデータリスト
     * @returns {Array} 最大値2件までのタグデータリスト
     */
    getTagData(tagDataList) {
      return tagDataList.length >= 2 ? tagDataList.slice(0, 2) : tagDataList
    },
    /**
     * 項目を結合し表示する項目か確認
     *
     * @param {Number} id 表示項目のID
     * @returns {String|Array} contactItemData
     */
    checkJoinContent(id) {
      const joinItem = [8, 10, 14, 15, 16] // 名、メイ、市区町村、番地、建物名
      return !joinItem.includes(id)
    },
    /**
     * コンタクトリスト、コンタクトインフォメーションからcontactItemDataを取得
     *
     * @param {Number} id コンタクトID
     * @param {Array} contactInformationData コンタクト情報データ配列
     * @returns {String|Array} 該当のcontactItemData
     */
    getContactData(id, contactInformationData) {
      return contactInformationData.find(
        (data) => data.defaultDataItemDefinitionId === id
      ).contactItemData
    },
    /**
     * ソートアイコン押下処理
     *
     * @param {object} sortData 選択したソート情報
     */
    updateSortTable(sortData) {
      const newSelectSortType = {
        sort: sortData.sort,
        order: sortData.order,
      }

      this.setContactSelectSortType(newSelectSortType)
      this.$emit('update')
    },
    /**
     * 選択したコンタクト情報を保持
     *
     * @param {number} selectIndex 選択したコンタクトのインデックス
     */
    setSelectContactStatus(selectIndex) {
      this.selectMenuDialogIndex = selectIndex
      this.setSelectContactInfo(this.contactList[selectIndex])
    },
    /**
     * 選択中のメニューダイアログのインデックスをリセット
     */
    resetSelectMenuDialogIndex() {
      this.selectMenuDialogIndex = null
    },
    /**
     * 親のチェックボックス選択処理
     *
     * @param {object} e 選択イベントオブジェクト
     */
    checkAllContact(e) {
      const checked = e.target.checked
      let newCheckContactList = JSON.parse(
        JSON.stringify(this.checkContactList)
      )

      if (checked) {
        for (let i = 0; i < this.contactList.length; i++) {
          const findIndex = newCheckContactList.findIndex(
            (data) => data.contactId === this.contactList[i].contactId
          )

          if (findIndex < 0) {
            newCheckContactList.push(this.contactList[i])
          }
        }
      } else {
        for (let i = 0; i < this.contactList.length; i++) {
          const findIndex = newCheckContactList.findIndex(
            (data) => data.contactId === this.contactList[i].contactId
          )

          if (findIndex >= 0) {
            newCheckContactList = newCheckContactList.splice(findIndex + 1, 1)
          }
        }
      }

      this.setCheckContactList(newCheckContactList)
    },
    /**
     * チェックボックス選択処理
     *
     * @param {object} e 選択イベントオブジェクト
     * @param {object} contactInfo 選択コンタクト情報
     */
    checkSelectContact(e, contactInfo) {
      const checked = e.target.checked
      let newCheckContactList = JSON.parse(
        JSON.stringify(this.checkContactList)
      )

      if (checked) {
        newCheckContactList.push(contactInfo)
      } else {
        newCheckContactList = newCheckContactList.filter(
          (data) => data.contactId !== contactInfo.contactId
        )
      }

      this.setCheckContactList(newCheckContactList)
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-list-table {
  margin-top: 24px;
  .table-scroll {
    table {
      tbody {
        tr {
          height: 48px;
        }
      }
      tr {
        th,
        td {
          width: 200px;
          min-width: 200px;
          &.checkbox {
            width: 44px;
            min-width: 44px;
            padding: 0;
            label {
              display: flex;
              text-align: center;
              justify-content: center;
            }
          }
          // 企業名
          &.companyName {
            width: auto;
            min-width: 370px;
          }
          // 氏名
          &.fullName {
            width: 112px;
            min-width: 112px;
          }
          // 部署名
          &.position-department {
            width: 370px;
            min-width: 370px;
          }
          // 役職名
          &.position {
            width: 370px;
            min-width: 370px;
          }
          // 電話番号1
          &.tel1 {
            width: 124px;
            min-width: 124px;
          }
          // 電話番号2
          &.tel2 {
            width: 124px;
            min-width: 124px;
          }
          // 住所
          &.address {
            width: 380px;
            min-width: 380px;
          }
          // メールアドレス
          &.mailAddress {
            width: 180px;
            min-width: 180px;
          }
          // メモ
          &.memo {
            width: 200px;
            min-width: 200px;
          }
          // 営業担当者
          &.manager {
            width: 200px;
            min-width: 200px;
          }
          // タグ
          &.tag {
            width: 334px;
            min-width: 334px;
            li {
              font-size: 12px;
              color: #4f7df0;
              border: #4f7df0 1px solid;
              padding: 3px 12px;
            }
            li:not(:last-child) {
              margin-right: 12px;
            }
            .moreBtn {
              cursor: pointer;
              color: #1e1e1e;
              border: #e0e0e0 1px solid;
              border-radius: 3px;
              padding: 3px 12px;
            }
          }
          &.settings {
            width: 48px;
            min-width: 48px;
            padding: 0;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
