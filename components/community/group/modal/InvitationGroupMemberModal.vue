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
            class="btn-close"
            @click="closeModal($event, 'close')"
            @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
            @mouseleave="$common.setAreaLabel($event, '', '')"
            @blur="$common.setAreaLabel($event, '', '')"
          />
          <div class="modal_title">
            <h4>メンバー招待</h4>
          </div>
          <div class="modal_contents">
            <p class="context">
              グループに参加するメンバーを招待<br />
              (自社メンバーとコミュニティでつながっているメンバーを招待できます)
            </p>
            <SuggestTextarea
              :select-ids="groupMembers"
              placeholder="氏名かフリガナを入力してください。"
              :suggest-type="1"
              :max-ids="100"
              :validation="
                $common.getFormItemsDetail(formItems, 'groupMembers').validation
              "
              @update="updateGroupMember($event)"
            />
          </div>
          <div class="buttons">
            <button
              class="btn btn-middle btn-cancel"
              @click="closeModal($event, 'close')"
            >
              閉じる
            </button>
            <button
              class="btn btn-middle btn-basic"
              :class="{ 'btn-disabled': groupMembers.length === 0 }"
              @click="postInvitationGroupMember()"
            >
              メンバー招待
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'InvitationGroupMemberModal',
  components: {},
  props: {},
  data() {
    return {
      groupMembers: [],
      formItems: [
        {
          id: 'groupMembers',
          validation: [],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['completeFuncInfo']),
  },
  created() {},
  methods: {
    /**
     * メンバーを招待
     */
    postInvitationGroupMember() {
      const paramData = {
        postGroupId: this.$route.params.groupId,
        postGroupMembers: this.groupMembers,
      }

      this.$common.addCallApiNum()
      this.$api
        .postInvitationGroupMember(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.$emit('update')
            this.$emit('close')
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
     * グループメンバーの更新
     *
     * @param {number[]} 選択したユーザーIDの配列
     */
    updateGroupMember(selectIds) {
      this.groupMembers = selectIds
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
@import '~assets/styles/scss/sp/mediaQuery.scss';
.modal-container {
  @include spContentWidth();
  width: 640px;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 40px;

  .modal_title {
    text-align: center;
  }

  .modal_contents {
    margin-top: 24px;
    .context {
      margin-bottom: 12px;
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
