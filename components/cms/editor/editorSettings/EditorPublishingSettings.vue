<template>
  <div class="editor-publishing-settings">
    <div v-if="[2, 3, 4].includes(editorData.pageStatus)" class="set-private">
      <p class="title">このページは公開中です。</p>
      <div class="buttons">
        <button
          class="btn btn-middle btn-basic"
          @click="updatePublishStatus('4')"
        >
          ページを非公開にする
        </button>
      </div>
    </div>
    <div class="set-publish-method">
      <p class="title">公開方法</p>
      <CustomInputRadio
        v-model="selectPublishingMethod"
        :options="selectPublishingMethodOptions"
        name="selectPublishingMethod"
        class="select-publishing-method"
        layout-type="vertical"
      />
    </div>
    <div v-if="selectPublishingMethod === '1'" class="set-publish-date">
      <p class="title">公開開始日時</p>
      <CustomDatePicker
        v-model="selectDays"
        class="date-picker"
        :is-disabled="[1, 4].includes(editorData.pageStatus)"
        :validation="
          $common.getFormItemsDetail(formItems, 'selectDays').validation
        "
      />
      <div class="select-hours-minutes">
        <CustomSelectHours
          v-model="selectHours"
          :is-disabled="[1, 4].includes(editorData.pageStatus)"
        />
        <CustomSelectMinutes
          v-model="selectMinutes"
          :option-num="getOptionNum()"
          :is-disabled="[1, 4].includes(editorData.pageStatus)"
        />
      </div>
    </div>
    <div class="buttons">
      <button
        v-if="
          selectPublishingMethod === '1' &&
          [0, 2, 3].includes(editorData.pageStatus)
        "
        class="btn btn-basic btn-middle"
        @click="updatePublishStatus(editorData.pageStatus === 0 ? '1' : '8')"
      >
        予約
      </button>
      <button
        v-if="
          selectPublishingMethod === '1' &&
          [1, 4].includes(editorData.pageStatus)
        "
        class="btn btn-basic btn-middle"
        @click="updatePublishStatus('3')"
      >
        予約を取り消す
      </button>
      <button
        v-if="selectPublishingMethod === '2'"
        class="btn btn-primary btn-middle"
        @click="updatePublishStatus('2')"
      >
        今すぐ公開
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditorPublishingSettings',
  components: {},
  data() {
    return {
      optionNum: 10,
      selectPublishingMethod: '1',
      selectPublishingMethodOptions: [
        {
          value: '1',
          label: '予約公開',
        },
        {
          value: '2',
          label: '即時公開',
        },
      ],
      formItems: [
        {
          id: 'selectDays',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('cms/editorStore', [
      'editorData',
      'viewComponentList',
      'maxRequestDataSize',
    ]),
    getOptionNum() {
      return () => {
        return [1, 4].includes(this.editorData.pageStatus) ? 1 : 10
      }
    },
    selectDays: {
      get() {
        return this.editorData.publishingSettings.date
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.publishingSettings.date = val
        this.setEditorData(newEditorData)
      },
    },
    selectHours: {
      get() {
        return this.editorData.publishingSettings.hour
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.publishingSettings.hour = val
        this.setEditorData(newEditorData)
      },
    },
    selectMinutes: {
      get() {
        return this.editorData.publishingSettings.minutes
      },
      set(val) {
        const newEditorData = JSON.parse(JSON.stringify(this.editorData))

        newEditorData.publishingSettings.minutes = val
        this.setEditorData(newEditorData)
      },
    },
  },
  created() {},
  methods: {
    ...mapMutations('cms/editorStore', [
      'setEditorData',
      'setUpdateCmsDataFlg',
      'setShowCompletePagePublishModalState',
      'setShowErrorRequestDataSizeModalState',
      'setCheckPublishType',
      'setShowCheckPagePublishModalState',
    ]),
    /**
     * 公開予約処理
     */
    updatePublishStatus(publishMethod) {
      const paramData = this.getReservationPublishParamData(publishMethod) // ページデータ更新APIのリクエストパラメータの取得
      const paramDataBytes = this.$common.getStrBytes(JSON.stringify(paramData))

      if (paramDataBytes > this.maxRequestDataSize) {
        this.setShowErrorRequestDataSizeModalState(true)
        return
      }

      this.$common.addCallApiNum()
      this.$api
        .updateCmsEditorPageData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            switch (paramData.publishingSettings.publishingMethod) {
              case '1':
              case '8':
                this.setShowCompletePagePublishModalState(true)
                this.setUpdateCmsDataFlg(true)
                break
              case '2':
                this.setCheckPublishType('public')
                this.setShowCheckPagePublishModalState(true)
                break
              case '3':
                this.$common.showCompletePopAlert('ActionMsg_Gen07')
                this.setUpdateCmsDataFlg(true)
                break
              case '4':
                this.setCheckPublishType('private')
                this.setShowCheckPagePublishModalState(true)
                break
              default:
                break
            }
          } else {
            this.$common.showCommonError(resData.data.errorInfo)
          }
          this.$common.subCallApiNum()
        })
        .catch((error) => {
          this.$common.apiErrorFunc(error)
        })
    },
    /**
     * ページデータ更新APIのリクエストパラメータの取得
     */
    getReservationPublishParamData(publishMethod) {
      const paramData = {
        id: Number(this.$route.params.pageId),
        pageProperty: this.editorData.pageProperty,
        componentList: this.setClassName(this.viewComponentList),
        publishingSettings: {},
        recordVersion: this.editorData.recordVersion,
      }

      paramData.publishingSettings.publishingMethod = publishMethod

      if (['1', '8'].includes(publishMethod)) {
        paramData.publishingSettings.date = this.editorData.publishingSettings.date
        paramData.publishingSettings.hour = this.editorData.publishingSettings.hour
        paramData.publishingSettings.minutes = this.editorData.publishingSettings.minutes
      }

      return paramData
    },
    /**
     * 表示用classの追加
     */
    setClassName(componentList) {
      const newComponentList = JSON.parse(JSON.stringify(componentList))

      for (let index = 0; index < newComponentList.length; index++) {
        let className = ''
        if (
          newComponentList[index].className !== undefined ||
          newComponentList[index].className === ''
        ) {
          const classArray = newComponentList[index].className.split(' ')
          const resultClassArray = classArray.filter(function (className) {
            if (
              className.includes('next-') ||
              className.includes('prev-') ||
              className.includes('secondPrev-')
            ) {
              return ''
            } else {
              return className
            }
          })
          className = resultClassArray.join(' ')
        }
        if (newComponentList[index - 1]) {
          className += 'next-' + newComponentList[index - 1].id + '-component '
        }
        if (newComponentList[index + 1]) {
          className += 'prev-' + newComponentList[index + 1].id + '-component '
        }
        if (newComponentList[index]) {
          if (
            newComponentList[index].id === 'conversion' &&
            newComponentList[index - 2]
          ) {
            className +=
              'secondPrev-' + newComponentList[index - 2].id + '-component '
          }
        }
        newComponentList[index].className = className
      }
      return newComponentList
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-publishing-settings {
  .title {
    font-weight: 500;
  }
  .set-private {
    margin-bottom: 24px;
    .buttons {
      margin-top: 20px;
    }
  }
  .set-publish-date {
    margin-top: 24px;
  }
  .select-publishing-method,
  .date-picker {
    margin-top: 12px;
  }

  .date-picker {
    width: 200px;
  }
  .select-hours-minutes {
    display: flex;
    margin-top: 16px;
    > div {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>
