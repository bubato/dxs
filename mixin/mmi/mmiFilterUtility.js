import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('mmi/filterConditions', [
      // TODO:MMI 名称取得元を追加 ..... 都道府県、売上規模、義業分類
      'industryMasterKeyValue',
      'industryCompareMasterKeyValue',
      'prefectureMasterList',
      'salesScaleMasterList',
      'companyTypeMasterList',
    ]),
  },
  methods: {
    industryCodeToName(code) {
      return this.industryCompareMasterKeyValue[code]
    },
    prefectureCodeToName(code) {
      let name = ''
      this.prefectureMasterList.some((group) => {
        return group.items.some((item) => {
          if (item.code === code) {
            name = item.label
            return true
          }
        })
      })
      return name
    },
    salesScaleCodeToName(code) {
      let name = ''
      this.salesScaleMasterList.some((group) => {
        return group.items.some((item) => {
          if (item.code === code) {
            name = item.label
            return true
          }
        })
      })
      return name
    },
    companyTypeCodeToName(code) {
      let name = ''
      this.companyTypeMasterList.items.forEach((item) => {
        if (item.code === code) {
          name = item.label
        }
      })
      return name
    },
  },
}
