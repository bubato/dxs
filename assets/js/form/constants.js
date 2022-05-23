export const DEFAULT_PATTERN = 'A'

export const RECORDS_PER_PAGE_OPTIONS = [
  { value: 10, text: '10' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
  { value: 100, text: '100' },
  { value: 200, text: '200' },
]

export const KIND_CD = {
  EMAIL_MAGAZINE: '0',
  QUESTIONNAIRE: '1',
  CONTACT_US: '2',
  DOWNLOAD: '3',
}

export const KIND_CD_OPTIONS = [
  { value: KIND_CD.EMAIL_MAGAZINE, text: 'メルマガ' },
  { value: KIND_CD.QUESTIONNAIRE, text: 'アンケート' },
  { value: KIND_CD.CONTACT_US, text: 'お問い合わせ' },
  { value: KIND_CD.DOWNLOAD, text: 'ファイル添付' },
]

export const VALIDATE_HEADER_TIME_OUT = 10000

export const FORM_SETTING_STEP = 1
export const EMAIL_SETTING_STEP = 2
export const PUBLIC_SETTING_STEP = 3

export const FORM_ROLE = {
  FORM: 'form',
  FORM_FORM: 'form_form',
  FORM_FORM_LIST: 'form_form_list',
  FORM_FORM_EDIT: 'form_form_edit',
}

export const LANG_CD = {
  JA: 'ja',
  EN: 'en',
}

export const LANG_CD_OPTIONS = [
  { value: LANG_CD.JA, text: '日本語' },
  { value: LANG_CD.EN, text: '英語' },
]

export const DATE_PICKER_DAY_OF_WEEK = [
  '日',
  '月',
  '火',
  '水',
  '木',
  '金',
  '土',
]

export const DATE_PICKER_MONTH_OF_YEAR = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

export const ANSWERS_LIST_STATUS = {
  CONFIRM: '確認',
  REQUEST_DELIVERY: '配送準備依頼',
  REQUEST_FINISHED: '配送完了',
  UNKNOWN_ADDRESS: '宛名不明',
}

export const NAVIGATION_LINK_ACTIVE = {
  FORM_SETTING: 'FORM_SETTING',
  CSS_SETTING: 'CSS_SETTING',
  JAVASCRIPT_SETTING: 'JAVASCRIPT_SETTING',
}

export const FORMAT_DATE = 'YYYY/MM/DD'

export const STATE_LABEL = {
  SUCCESS: 'success',
  ERROR: 'error',
}

export const FORM_CODE_EL_ID = 'xhm-form'

/** 検索種別 (xdata \SearchType) */
export const FORM_SEARCH_TYPE = {
  /** テキスト */
  TEXT: '1',
  /** 数値 */
  NUMBER: '2',
  /** 日付 */
  DATE: '3',
  /** @deprecated (単一の) チェックボックス */
  CHECKBOX: '4',
  /** @deprecated (単一の) ラジオボタン */
  RADIO: '5',
  /** チェックリスト */
  CHECKLIST: '6',
  /** 暗号化テキスト */
  CRYPTED_TEXT: '7',
  /** 暗号化チェックリスト */
  CRYPTED_CHECKLIST: '8',
}
