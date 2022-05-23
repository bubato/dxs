<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @mousedown="closeModal($event, 'in')"
        @mouseup="closeModal($event, 'out')"
      >
        <div class="modal-container">
          <div class="searchWindow">
            <SearchSVG class="icon-search" />
            <input v-model="keyword" type="text" />
          </div>
          <ul class="l-list">
            <li
              v-for="data in filteredUsers"
              :key="data.id"
              ref="title"
              class="l-list-cell"
              @click="selectData = data.id"
            >
              <CheckSVG v-if="selectData === data.id" class="icon-check" />
              {{ data.name }}
            </li>
            <li v-if="filteredUsers.length === 0" class="l-list-cell">
              データなし
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CreateMailSendUserSelectModal',
  components: {},
  props: {
    selectDataOrigin: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      selectData: [],
      keyword: '',
      filteredUsersList: [],
    }
  },
  computed: {
    filteredUsers() {
      const dataListSearch = []

      for (const cnt in this.selectDataOrigin) {
        const user = this.selectDataOrigin[cnt]

        if (user.name.includes(this.keyword)) {
          dataListSearch.push(user)
        }
      }

      return dataListSearch
    },
  },
  created() {},
  methods: {
    setJsonData() {
      this.$common.addCallApiNum()
      this.$api
        .setCreateWebPageDelete({})
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('reflect')
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
     * OKボタン押下処理
     */
    saveInputData() {
      this.setJsonData()
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
.modal-mask {
  z-index: 1000000;
  background-color: rgba(0, 0, 0, 0);
}
.modal-container {
  width: 427px;
  max-height: 462px;
  background: #f7f8f9 0% 0% no-repeat padding-box;
  box-shadow: 0px 1px 5px #00000029;
  border-radius: 6px;
  padding: 12px;

  .modal_title {
    text-align: center;
    margin-bottom: 8px;
    h4 {
      margin-bottom: 9px;
    }
    p {
      margin-top: 24px;
      margin-bottom: 32px;
      &:first-content {
        margin-top: 0;
      }
    }
  }
}

.modal_contents {
  &-box {
    display: flex;
    & > div {
      width: 352px;
    }
  }
}
.buttons * {
  color: #ffffff;
}
.icon {
  &-attention {
    margin-right: 12px;
  }
  &-search {
    width: 24px;
    height: 24px;
  }
  &-check {
    width: 22px;
    height: 22px;
    fill: #047cff;
  }
}
.searchWindow {
  position: relative;
  height: 48px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  color: #1e1e1e;
  outline: none;
  .icon-search {
    position: absolute;
    top: calc(50% - 12px);
    left: 19px;
  }
  input {
    border: none;
    padding: 13px 16px;
    padding-left: 48px;
    height: 46px;
    background: #ffffff;
  }
}
.l-list {
  max-height: 347px;
  margin-top: 16px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  color: #1e1e1e;
  padding: 4px;
  text-align: left;
  &-cell {
    padding: 8px;
    padding-left: 38px;
    position: relative;
    .icon-check {
      position: absolute;
      left: 10px;
      top: calc(50% - 11px);
    }
  }
}
</style>
