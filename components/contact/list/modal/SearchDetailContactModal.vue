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
            <h4>詳細検索</h4>
            <p class="context">
              コンタクトに登録されている属性情報やタグから検索できます。
            </p>
          </div>
          <div class="modal_contents">
            <div class="form-block">
              <h5>属性情報</h5>
              <div class="form-item">
                <label>
                  <p>企業名</p>
                  <CustomInputText
                    v-model="detailOptions.company"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'company')
                        .placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'company')
                        .validation
                    "
                  />
                </label>
                <label>
                  <p>メールアドレス</p>
                  <CustomInputText
                    v-model="detailOptions.mail"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'mail').placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'mail').validation
                    "
                  />
                </label>
              </div>
              <div class="form-item">
                <label>
                  <p>氏名</p>
                  <CustomInputText
                    v-model="detailOptions.name"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'name').placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'name').validation
                    "
                  />
                </label>
                <label>
                  <p>電話番号1</p>
                  <CustomInputText
                    v-model="detailOptions.tel1"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'tel1').placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'tel1').validation
                    "
                  />
                </label>
              </div>
              <div class="form-item">
                <label>
                  <p>フリガナ</p>
                  <CustomInputText
                    v-model="detailOptions.nameKana"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'nameKana')
                        .placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'nameKana')
                        .validation
                    "
                  />
                </label>
                <label>
                  <p>電話番号2</p>
                  <CustomInputText
                    v-model="detailOptions.tel2"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'tel2').placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'tel2').validation
                    "
                  />
                </label>
              </div>
              <div class="form-item">
                <label>
                  <p>役職名</p>
                  <CustomInputText
                    v-model="detailOptions.position"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'position')
                        .placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'position')
                        .validation
                    "
                  />
                </label>
                <label>
                  <p>メモ</p>
                  <CustomInputText
                    v-model="detailOptions.memo"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'memo').placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'memo').validation
                    "
                  />
                </label>
              </div>
              <div class="form-item">
                <label>
                  <p>部署名</p>
                  <CustomInputText
                    v-model="detailOptions.department"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'department')
                        .placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'department')
                        .validation
                    "
                  />
                </label>
                <label v-if="dataItemDefinitionList.length > 0">
                  <p>追加項目</p>
                  <div class="select-input-item">
                    <CustomInputSelect
                      v-model="detailOptions.dataItemDefinition"
                      class="select-item"
                      :options="dataItemDefinitionOptions"
                      :validation="
                        $common.getFormItemsDetail(
                          formItems,
                          'dataItemDefinition'
                        ).validation
                      "
                    />
                    <CustomInputText
                      v-if="
                        checkDataItemType(detailOptions.dataItemDefinition) ===
                          1 ||
                        checkDataItemType(detailOptions.dataItemDefinition) ===
                          2
                      "
                      v-model="detailOptions.addInputItem"
                      placeholder=""
                      maxlength="100"
                      class="additionalInformationList-input"
                    />
                    <CustomDatePicker
                      v-if="
                        checkDataItemType(detailOptions.dataItemDefinition) ===
                        3
                      "
                      v-model="detailOptions.addInputItem"
                      class="date-picker additionalInformationList-datepicker"
                    />
                  </div>
                </label>
              </div>
              <div class="form-item">
                <label>
                  <p>住所</p>
                  <CustomInputText
                    v-model="detailOptions.address"
                    maxlength="200"
                    :placeholder="
                      $common.getFormItemsDetail(formItems, 'address')
                        .placeholder
                    "
                    :validation="
                      $common.getFormItemsDetail(formItems, 'address')
                        .validation
                    "
                  />
                </label>
                <label>
                  <p>メール配信許諾</p>
                  <CustomInputSelect
                    v-model="detailOptions.deliveryFlag"
                    class="select-item"
                    :options="deliveryFlagOptions"
                  />
                </label>
              </div>
            </div>
            <div class="form-block">
              <h5>タグ(10件まで選択できます)</h5>
              <div class="form-item">
                <SuggestTextarea
                  :select-ids="detailOptions.tagDefinitionIdList"
                  placeholder=""
                  :max-ids="10"
                  :suggest-type="6"
                  class="suggestTextarea"
                  @update="updateTagDefinitionIdList($event)"
                />
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
              @click="searchDetailContact()"
            >
              上記の条件で検索
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SearchDetailContactModal',
  components: {},
  props: {},
  data() {
    return {
      detailOptions: {},
      dataItemDefinitionOptions: [],
      deliveryFlagOptions: [
        {
          code: 0,
          label: '許可しない',
        },
        {
          code: 1,
          label: '許可する',
        },
      ],
      formItems: [
        {
          id: 'company',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'mail',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'name',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'tel1',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'nameKana',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'tel2',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'position',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'memo',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'department',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'dataItemDefinition',
          validation: [],
        },
        {
          id: 'addInputItem',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'address',
          maxLength: '30',
          placeholder: '',
          validation: [],
        },
        {
          id: 'tagDefinitionIdList',
          validation: [],
        },
      ],
    }
  },
  computed: {
    ...mapState('contact/contactList', [
      'searchDetailOptions',
      'dataItemDefinitionList',
    ]),
  },
  created() {
    this.detailOptions = JSON.parse(JSON.stringify(this.searchDetailOptions))
    this.dataItemDefinitionOptions = this.createAtaItemDefinitionOptions() // 追加データ項目セレクトデータの作成
  },
  mounted() {},
  methods: {
    ...mapMutations('contact/contactList', ['setSearchDetailOptions']),
    /**
     * 追加項目にて選択した値のデータタイプを取得
     *
     * @returns {Object} 追加項目にて選択した値のデータタイプ
     */
    checkDataItemType(dataItemDefinitionId) {
      if (dataItemDefinitionId) {
        return this.dataItemDefinitionList.find((item) => {
          return item.dataItemDefinitionId.toString() === dataItemDefinitionId
        }).dataItemType
      }
    },
    /**
     * 追加データ項目セレクトデータの作成
     *
     * @returns {Object} 追加データ項目セレクトデータ
     */
    createAtaItemDefinitionOptions() {
      return this.dataItemDefinitionList.map((item) => {
        return {
          code: item.dataItemDefinitionId,
          label: item.title,
          dataItemType: item.dataItemType,
        }
      })
    },
    /**
     * 上記の条件で検索ボタン押下処理
     */
    searchDetailContact() {
      this.setSearchDetailOptions(this.detailOptions)
      this.$emit('update')
      this.$emit('close')
    },
    /**
     * タグ選択リストの更新
     *
     * @param {number[]} selectIds 選択したユーザーIDの配列
     */
    updateTagDefinitionIdList(selectIds) {
      this.detailOptions.tagDefinitionIdList = selectIds
    },
    /**
     * モーダルを閉じる
     *
     * @param {Object} event イベントオブジェクト
     * @param {String} type イベントタイプ
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
  width: 832px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
    .context {
      margin-top: 8px;
    }
  }
  .modal_contents {
    height: 430px;
    overflow: auto;
    margin-top: 32px;
    .form-block {
      &:not(:first-child) {
        margin-top: 32px;
      }
      .form-item {
        display: flex;
        margin-top: 24px;
        label {
          width: 364px;
          p {
            margin-bottom: 12px;
          }
          &:not(:first-child) {
            margin-left: 24px;
          }
          .select-input-item {
            display: flex;
            align-items: center;
            .select-item {
              width: 120px;
              margin-right: 20px;
            }
          }
        }
      }
      .suggestTextarea {
        width: 100%;
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
</style>
