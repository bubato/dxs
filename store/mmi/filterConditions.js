import industryMasterList from '~/static/mmi/getIndustryMasterList.json'
import industryMasterKeyValue from '~/static/mmi/getIndustryMasterKeyValue.json'
import prefectureMasterList from '~/static/mmi/getPrefectureMasterList.json'
import salesScaleMasterList from '~/static/mmi/getSalesScaleMasterList.json'
import industryCompareMasterKeyValue from '~/static/mmi/getIndustryCompareMasterKeyValue.json'
import companyTypeMasterList from '~/static/mmi/getCompanyTypeMasterList.json'

const getDefaultState = () => {
  return {
    industryMasterList,
    industryMasterKeyValue,
    prefectureMasterList,
    salesScaleMasterList,
    companyTypeMasterList,
    industryCompareMasterKeyValue,
    saveConditions: [],
    selectSaveCondition: {
      id: null,
      items: {
        industryCodes: [
          'A01010',
          'A01011',
          'A01012',
          'A01013',
          'A01014',
          'A02020',
          'A02021',
          'A02022',
          'A02023',
          'A02024',
          'A02029',
          'B03030',
          'B03031',
          'B03032',
          'B04040',
          'B04041',
          'B04042',
          'C05050',
          'C05051',
          'C05052',
          'C05053',
          'C05054',
          'C05055',
          'C05059',
          'D06060',
          'D06061',
          'D06062',
          'D06063',
          'D06064',
          'D06065',
          'D06066',
          'D07070',
          'D07071',
          'D07072',
          'D07073',
          'D07074',
          'D07075',
          'D07076',
          'D07077',
          'D07078',
          'D07079',
          'D08080',
          'D08081',
          'D08082',
          'D08083',
          'D08084',
          'D08089',
          'E09090',
          'E09091',
          'E09092',
          'E09093',
          'E09094',
          'E09095',
          'E09096',
          'E09097',
          'E09098',
          'E09099',
          'E10100',
          'E10101',
          'E10102',
          'E10103',
          'E10104',
          'E10105',
          'E10106',
          'E11110',
          'E11111',
          'E11112',
          'E11113',
          'E11114',
          'E11115',
          'E11116',
          'E11117',
          'E11118',
          'E11119',
          'E12120',
          'E12121',
          'E12122',
          'E12123',
          'E12129',
          'E13130',
          'E13131',
          'E13132',
          'E13133',
          'E13139',
          'E14140',
          'E14141',
          'E14142',
          'E14143',
          'E14144',
          'E14145',
          'E14149',
          'E15150',
          'E15151',
          'E15152',
          'E15153',
          'E15159',
          'E16160',
          'E16161',
          'E16162',
          'E16163',
          'E16164',
          'E16165',
          'E16166',
          'E16169',
          'E17170',
          'E17171',
          'E17172',
          'E17173',
          'E17174',
          'E17179',
          'E18180',
          'E18181',
          'E18182',
          'E18183',
          'E18184',
          'E18185',
          'E18189',
          'E19190',
          'E19191',
          'E19192',
          'E19193',
          'E19199',
          'E20200',
          'E20201',
          'E20202',
          'E20203',
          'E20204',
          'E20205',
          'E20206',
          'E20207',
          'E20208',
          'E20209',
          'E21210',
          'E21211',
          'E21212',
          'E21213',
          'E21214',
          'E21215',
          'E21216',
          'E21217',
          'E21218',
          'E21219',
          'E22220',
          'E22221',
          'E22222',
          'E22223',
          'E22224',
          'E22225',
          'E22229',
          'E23230',
          'E23231',
          'E23232',
          'E23233',
          'E23234',
          'E23235',
          'E23239',
          'E24240',
          'E24241',
          'E24242',
          'E24243',
          'E24244',
          'E24245',
          'E24246',
          'E24247',
          'E24248',
          'E24249',
          'E25250',
          'E25251',
          'E25252',
          'E25253',
          'E25259',
          'E26260',
          'E26261',
          'E26262',
          'E26263',
          'E26264',
          'E26265',
          'E26266',
          'E26267',
          'E26269',
          'E27270',
          'E27271',
          'E27272',
          'E27273',
          'E27274',
          'E27275',
          'E27276',
          'E28280',
          'E28281',
          'E28282',
          'E28283',
          'E28284',
          'E28285',
          'E28289',
          'E29290',
          'E29291',
          'E29292',
          'E29293',
          'E29294',
          'E29295',
          'E29296',
          'E29297',
          'E29299',
          'E30300',
          'E30301',
          'E30302',
          'E30303',
          'E31310',
          'E31311',
          'E31312',
          'E31313',
          'E31314',
          'E31315',
          'E31319',
          'E32320',
          'E32321',
          'E32322',
          'E32323',
          'E32324',
          'E32325',
          'E32326',
          'E32327',
          'E32328',
          'E32329',
          'F33330',
          'F33331',
          'F34340',
          'F34341',
          'F35350',
          'F35351',
          'F36360',
          'F36361',
          'F36362',
          'F36363',
          'G37370',
          'G37371',
          'G37372',
          'G37373',
          'G38380',
          'G38381',
          'G38382',
          'G38383',
          'G39390',
          'G39391',
          'G39392',
          'G40400',
          'G40401',
          'G41410',
          'G41411',
          'G41412',
          'G41413',
          'G41414',
          'G41415',
          'G41416',
          'H42420',
          'H42421',
          'H43430',
          'H43431',
          'H43432',
          'H43433',
          'H43439',
          'H44440',
          'H44441',
          'H44442',
          'H44443',
          'H44444',
          'H44449',
          'H45450',
          'H45451',
          'H45452',
          'H45453',
          'H45454',
          'H46460',
          'H46461',
          'H46462',
          'H47470',
          'H47471',
          'H47472',
          'H48480',
          'H48481',
          'H48482',
          'H48483',
          'H48484',
          'H48485',
          'H48489',
          'H49490',
          'H49491',
          'I50500',
          'I50501',
          'I51510',
          'I51511',
          'I51512',
          'I51513',
          'I52520',
          'I52521',
          'I52522',
          'I53530',
          'I53531',
          'I53532',
          'I53533',
          'I53534',
          'I53535',
          'I53536',
          'I54540',
          'I54541',
          'I54542',
          'I54543',
          'I54549',
          'I55550',
          'I55551',
          'I55552',
          'I55553',
          'I55559',
          'I56560',
          'I56561',
          'I56569',
          'I57570',
          'I57571',
          'I57572',
          'I57573',
          'I57574',
          'I57579',
          'I58580',
          'I58581',
          'I58582',
          'I58583',
          'I58584',
          'I58585',
          'I58586',
          'I58589',
          'I59590',
          'I59591',
          'I59592',
          'I59593',
          'I60600',
          'I60601',
          'I60602',
          'I60603',
          'I60604',
          'I60605',
          'I60606',
          'I60607',
          'I60608',
          'I60609',
          'I61610',
          'I61611',
          'I61612',
          'I61619',
          'J62620',
          'J62621',
          'J62622',
          'J63630',
          'J63631',
          'J63632',
          'J64640',
          'J64641',
          'J64642',
          'J64643',
          'J64649',
          'J65650',
          'J65651',
          'J65652',
          'J66660',
          'J66661',
          'J66662',
          'J66663',
          'J67670',
          'J67671',
          'J67672',
          'J67673',
          'J67674',
          'J67675',
          'K68680',
          'K68681',
          'K68682',
          'K69690',
          'K69691',
          'K69692',
          'K69693',
          'K69694',
          'K70700',
          'K70701',
          'K70702',
          'K70703',
          'K70704',
          'K70705',
          'K70709',
          'L71710',
          'L71711',
          'L71712',
          'L72720',
          'L72721',
          'L72722',
          'L72723',
          'L72724',
          'L72725',
          'L72726',
          'L72727',
          'L72728',
          'L72729',
          'L73730',
          'L73731',
          'L74740',
          'L74741',
          'L74742',
          'L74743',
          'L74744',
          'L74745',
          'L74746',
          'L74749',
          'M75750',
          'M75751',
          'M75752',
          'M75753',
          'M75759',
          'M76760',
          'M76761',
          'M76762',
          'M76763',
          'M76764',
          'M76765',
          'M76766',
          'M76767',
          'M76769',
          'M77770',
          'M77771',
          'M77772',
          'N78780',
          'N78781',
          'N78782',
          'N78783',
          'N78784',
          'N78785',
          'N78789',
          'N79790',
          'N79791',
          'N79792',
          'N79793',
          'N79794',
          'N79795',
          'N79796',
          'N79799',
          'N80800',
          'N80801',
          'N80802',
          'N80803',
          'N80804',
          'N80805',
          'N80806',
          'N80809',
          'O81810',
          'O81811',
          'O81812',
          'O81813',
          'O81814',
          'O81815',
          'O81816',
          'O81817',
          'O81818',
          'O81819',
          'O82820',
          'O82821',
          'O82822',
          'O82823',
          'O82824',
          'O82829',
          'P83830',
          'P83831',
          'P83832',
          'P83833',
          'P83834',
          'P83835',
          'P83836',
          'P84840',
          'P84841',
          'P84842',
          'P84849',
          'P85850',
          'P85851',
          'P85852',
          'P85853',
          'P85854',
          'P85855',
          'P85859',
          'Q86860',
          'Q86861',
          'Q86862',
          'Q87870',
          'Q87871',
          'Q87872',
          'R88880',
          'R88881',
          'R88882',
          'R88889',
          'R89890',
          'R90900',
          'R90901',
          'R90902',
          'R90903',
          'R90909',
          'R91910',
          'R91911',
          'R91912',
          'R92920',
          'R92921',
          'R92922',
          'R92923',
          'R92929',
          'R93931',
          'R93932',
          'R93933',
          'R93934',
          'R93939',
          'R94941',
          'R94942',
          'R94943',
          'R94949',
          'R95950',
          'R95951',
          'R95952',
          'R95959',
          'R96961',
          'R96969',
          'S97971',
          'S97972',
          'S97973',
          'S98981',
          'S98982',
          'T99999',
        ], // 業種コード
        industryCategory: [
          'すべての業種',
          '農業,林業',
          '農業',
          '林業',
          '漁業（水産養殖業を除く）,水産養殖業',
          '漁業（水産養殖業を除く）',
          '水産養殖業',
          '鉱業，採石業，砂利採取業',
          '鉱業，採石業，砂利採取業',
          '総合工事業,職別工事業(設備工事業を除く),設備工事業',
          '総合工事業',
          '職別工事業(設備工事業を除く)',
          '設備工事業',
          '食料品製造業,飲料・たばこ・飼料製造業,繊維工業,木材・木製品製造業（家具を除く）,家具・装備品製造業,パルプ・紙・紙加工品製造業,印刷・同関連業,化学工業,石油製品・石炭製品製造業,プラスチック製品製造業（別掲を除く）,ゴム製品製造業,なめし革・同製品・毛皮製造業,窯業・土石製品製造業,鉄鋼業,非鉄金属製造業,金属製品製造業,はん用機械器具製造業,生産用機械器具製造業,業務用機械器具製造業,電子部品・デバイス・電子回路製造業,電気機械器具製造業,情報通信機械器具製造業,輸送用機械器具製造業,その他の製造業',
          '食料品製造業',
          '飲料・たばこ・飼料製造業',
          '繊維工業',
          '木材・木製品製造業（家具を除く）',
          '家具・装備品製造業',
          'パルプ・紙・紙加工品製造業',
          '印刷・同関連業',
          '化学工業',
          '石油製品・石炭製品製造業',
          'プラスチック製品製造業（別掲を除く）',
          'ゴム製品製造業',
          'なめし革・同製品・毛皮製造業',
          '窯業・土石製品製造業',
          '鉄鋼業',
          '非鉄金属製造業',
          '金属製品製造業',
          'はん用機械器具製造業',
          '生産用機械器具製造業',
          '業務用機械器具製造業',
          '電子部品・デバイス・電子回路製造業',
          '電気機械器具製造業',
          '情報通信機械器具製造業',
          '輸送用機械器具製造業',
          'その他の製造業',
          '電気業,ガス業,熱供給業,水道業',
          '電気業',
          'ガス業',
          '熱供給業',
          '水道業',
          '通信業,放送業,情報サービス業,インターネット附随サービス業,映像・音声・文字情報制作業',
          '通信業',
          '放送業',
          '情報サービス業',
          'インターネット附随サービス業',
          '映像・音声・文字情報制作業',
          '鉄道業,道路旅客運送業,道路貨物運送業,水運業,航空運輸業,倉庫業,運輸に附帯するサービス業,郵便業（信書便事業を含む）',
          '鉄道業',
          '道路旅客運送業',
          '道路貨物運送業',
          '水運業',
          '航空運輸業',
          '倉庫業',
          '運輸に附帯するサービス業',
          '郵便業（信書便事業を含む）',
          '各種商品卸売業,繊維・衣服等卸売業,飲食料品卸売業,建築材料，鉱物・金属材料等卸売業,機械器具卸売業,その他の卸売業,各種商品小売業,織物・衣服・身の回り品小売業,飲食料品小売業,機械器具小売業,その他の小売業,無店舗小売業',
          '各種商品卸売業',
          '繊維・衣服等卸売業',
          '飲食料品卸売業',
          '建築材料，鉱物・金属材料等卸売業',
          '機械器具卸売業',
          'その他の卸売業',
          '各種商品小売業',
          '織物・衣服・身の回り品小売業',
          '飲食料品小売業',
          '機械器具小売業',
          'その他の小売業',
          '無店舗小売業',
          '銀行業,協同組織金融業,貸金業，クレジットカード業等非預金信用機関,金融商品取引業，商品先物取引業,補助的金融業等,保険業（保険媒介代理業，保険サービス業を含む）',
          '銀行業',
          '協同組織金融業',
          '貸金業，クレジットカード業等非預金信用機関',
          '金融商品取引業，商品先物取引業',
          '補助的金融業等',
          '保険業（保険媒介代理業，保険サービス業を含む）',
          '不動産取引業,不動産賃貸業・管理業,物品賃貸業',
          '不動産取引業',
          '不動産賃貸業・管理業',
          '物品賃貸業',
          '学術・開発研究機関,専門サービス業（他に分類されないもの）,広告業,技術サービス業（他に分類されないもの）',
          '学術・開発研究機関',
          '専門サービス業（他に分類されないもの）',
          '広告業',
          '技術サービス業（他に分類されないもの）',
          '宿泊業,飲食店,持ち帰り・配達飲食サービス業',
          '宿泊業',
          '飲食店',
          '持ち帰り・配達飲食サービス業',
          '洗濯・理容・美容・浴場業,その他の生活関連サービス業,娯楽業',
          '洗濯・理容・美容・浴場業',
          'その他の生活関連サービス業',
          '娯楽業',
          '学校教育,その他の教育，学習支援業',
          '学校教育',
          'その他の教育，学習支援業',
          '医療業,保健衛生,社会保険・社会福祉・介護事業',
          '医療業',
          '保健衛生',
          '社会保険・社会福祉・介護事業',
          '郵便局,協同組合（他に分類されないもの）',
          '郵便局',
          '協同組合（他に分類されないもの）',
          '廃棄物処理業,自動車整備業,機械等修理業（別掲を除く）,職業紹介・労働者派遣業,その他の事業サービス業,政治・経済・文化団体,宗教,その他のサービス業,外国公務',
          '廃棄物処理業',
          '自動車整備業',
          '機械等修理業（別掲を除く）',
          '職業紹介・労働者派遣業',
          'その他の事業サービス業',
          '政治・経済・文化団体',
          '宗教',
          'その他のサービス業',
          '外国公務',
          '国家公務,地方公務',
          '国家公務',
          '地方公務',
          '分類不能の産業',
          '分類不能の産業',
        ], // 業種カテゴリ
        industryCompareCodes: [], // 業種比較コード
        prefectureCodes: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '19',
          '12',
          '13',
          '11',
          '14',
          '15',
          '16',
          '17',
          '18',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25',
          '26',
          '27',
          '28',
          '29',
          '30',
          '31',
          '32',
          '33',
          '34',
          '35',
          '36',
          '37',
          '38',
          '39',
          '40',
          '41',
          '42',
          '43',
          '44',
          '45',
          '46',
          '47',
          '90',
          '91',
          '92',
        ], // 所在地コード
        prefectureCategory: [
          'all',
          '北海道',
          '東北',
          '北関東',
          '南関東',
          '北陸信越',
          '東海',
          '近畿',
          '中国',
          '四国',
          '九州',
          '三大都市',
        ], // 所在地カテゴリ
        salesScaleCode: '1', // 売上規模
        salesScaleLower: null, // 売上規模下限
        salesScaleUpper: null, // 売上規模上限
        companyType: '0', // 企業分類
      },
    }, // 選択した保存条件の詳細データ(チェックした項目を保持)
    showInsertSaveConditionsModalState: false,
  }
}

export const state = getDefaultState

export const getters = {}

export const mutations = {
  resetDefaultState(state) {
    Object.assign(state, getDefaultState())
  },
  setSaveConditions(state, val) {
    state.saveConditions = val
  },
  setSelectSaveCondition(state, val) {
    state.selectSaveCondition = val
  },
  resetSelectSaveCondition(state) {
    state.selectSaveCondition = getDefaultState().selectSaveCondition
  },
  setShowInsertSaveConditionsModalState(state, val) {
    state.showInsertSaveConditionsModalState = val
  },
}

export const actions = {}