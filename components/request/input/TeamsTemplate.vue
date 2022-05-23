<template>
  <div class="terms-wrap tos">
    <p class="tos-link" @click="setTeamsModalFlg()">
      <span class="tos-link-label">{{ getTeamsData('name') }}</span
      ><OpenInNewSVG class="icon-blankLink icon-openInNew" />
    </p>
    <p class="tos-text font-size-middle">
      {{ getTeamsData('text') }}
    </p>
    <CustomInputSingleCheckbox
      v-model="isAgree"
      name="termsAgree"
      :label="getTeamsData('checkboxLabel')"
      :validation="agreementValidation"
      :is-disabled="teamsSetting.agreementDisabledIdList.includes(id) === false"
      @input="checkAgreement()"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'TeamsTemplate',
  props: {
    id: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      agreementValidation: [
        {
          type: 'required',
          message: '利用規約をお読みいただき同意にチェックください。',
        },
      ],
      isAgree: false,
    }
  },
  computed: {
    ...mapState('request/input', ['teamsData', 'teamsSetting']),
  },
  created() {},
  methods: {
    ...mapMutations('request/input', ['setTeamsSetting']),
    /**
     * 利用規約モーダルのセット
     */
    setTeamsModalFlg() {
      const teamsSettingData = JSON.parse(JSON.stringify(this.teamsSetting))
      teamsSettingData.modalOpenFlgId = this.id

      this.setTeamsSetting(teamsSettingData)
    },
    /**
     * TeamsDataの取得
     *
     * @param {String} keyName キー名
     * @return {String} 利用規約データ
     */
    getTeamsData(keyName) {
      const data = this.teamsData.find((item) => item.id === this.id)

      return data[keyName]
    },
    /**
     * 利用規約同意の有無
     */
    checkAgreement() {
      const teamsSettingData = JSON.parse(JSON.stringify(this.teamsSetting))

      if (this.isAgree) {
        // 規約に同意
        if (!teamsSettingData.agreeIdList.includes(this.id)) {
          teamsSettingData.agreeIdList.push(this.id)
        }
      } else {
        // 規約に非同意
        teamsSettingData.agreeIdList = teamsSettingData.agreeIdList.filter(
          (number) => number !== this.id
        )
      }

      this.setTeamsSetting(teamsSettingData)
    },
  },
}
</script>

<style scoped lang="scss">
.terms-wrap {
  margin-bottom: 24px;
}
.tos {
  &-link {
    cursor: pointer;
    margin-bottom: 8px;
    &-label {
      color: #007aff;
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }
  &-text {
    margin-bottom: 12px;
  }
}
.icon {
  &-blankLink {
    display: inline-block;
    fill: #007aff;
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
}
</style>
