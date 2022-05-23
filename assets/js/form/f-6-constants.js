import { FORM_ROLE } from '@/assets/js/form/constants'

export const PARTS_KBN_BASE = 'B'
export const PARTS_KBN_SET = 'S'
export const PARTS_KBN_C = 'C'

export const BASE_PARTS_LABEL = 'ベースパーツ'
export const SET_PARTS_LABEL = 'セットパーツ'
export const CHILD_PARTS_LABEL = 'チャイルドパーツ'

export const CNF_SCRN_FLAG = {
  YES: '1',
  NO: '0',
}
export const CMP_SCRN_KBN = {
  DISPLAY: '0',
  REDIRECT: '1',
}
export const CMP_SCRN_BTN_SHOW_STATE = {
  SHOW: '0',
  HIDE: '1',
}
export const CMP_SCRN_DOWNLOAD_FILE = {
  YES: '1',
  NO: '0',
}

export const BTN_SAVE = 0
export const BTN_SAVE_AND_SETTING_EMAIL = 1
export const BTN_SAVE_AND_PREVIEW = 2

export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const MAX_FILE_UPLOAD = 5

export const PARTS_CD_PREFIX = {
  BASE_PART: 'PB',
  SET_PART: 'PS',
  CHILD_PART: 'PC',
}
/**
 * @type {{}}
 * @see /app/Models/MParts/PARTS_CD.php
 */
export const PARTS_CD = {
  STEP: 'PB0101',
  TEXT_FIELD: 'PB0201',
  TEXT_AREA: 'PB0301',
  RADIO_BUTTON: 'PB0401',
  CHECKBOX: 'PB0501',
  SELECT_BOX: 'PB0601',
  HEADING_H1: 'PB0701',
  HEADING_H2: 'PB0801',
  TEXT: 'PB1001',
  SEPARATOR_LINE: 'PB1101',
  FILE_ATTACHMENT: 'PB1201',
  NOTIFICATION_PERMISSION: 'PB1301',
  DISPLAY_RULES: 'PB1401',
  SPACER: 'PB2301',
  NEW_PAGE_BUTTONS: 'PB2401',
  PARAMETER: 'PB2501',
  PREFECTURE: 'PS1501',
  GENDER: 'PS1601',

  NAME: 'PS1701',
  NAME_LAST_NAME: 'PC1702',
  NAME_FIRST_NAME: 'PC1703',
  NAME_LAST_NAME_KANA: 'PC1704',
  NAME_FIRST_NAME_KANA: 'PC1705',
  NAME_FULL_NAME: 'PC1706',
  NAME_FULL_NAME_KANA: 'PC1707',

  MAIL_ADDRESS: 'PS1801',
  MAIL_ADDRESS_CONFIRM: 'PC1802',

  DATE_OF_BIRTH: 'PS1901',
  DATE_OF_BIRTH_YEAR: 'PC1902',
  DATE_OF_BIRTH_MONTH: 'PC1903',
  DATE_OF_BIRTH_DAY: 'PC1904',

  YEAR_AND_MONTH: 'PS2001',
  YEAR_AND_MONTH_YEAR: 'PC2002',
  YEAR_AND_MONTH_MONTH: 'PC2003',

  DATE: 'PS2101',
  DATE_DAY: 'PC2102',
  DATE_HOUR: 'PC2103',
  DATE_MINUTE: 'PC2104',

  ADDRESS: 'PS2201',
  ADDRESS_POSTAL_CODE: 'PC2202',
  ADDRESS_AUTO_FILL_BTN: 'PC2203',
  ADDRESS_PREFECTURE: 'PC2204',
  ADDRESS_CITY: 'PC2205',
  ADDRESS_STREET: 'PC2206',
  ADDRESS_BUILDING: 'PC2207',
}

export const REQUIRED_FLG = {
  TRUE: '1',
  FALSE: '0',
}

export const DEFAULT_OBJECT_PART = {
  title: '',
  required_flg: '0',
  disp_order: 0,
  delete_flg: '0',
  id_attr: '',
  parts_cd: '',
  m_part: null,
}

export const DWNLD_FILE_ERRORS = [
  {
    isValid: true,
    errorMessage: '',
  },
  {
    isValid: true,
    errorMessage: '',
  },
  {
    isValid: true,
    errorMessage: '',
  },
  {
    isValid: true,
    errorMessage: '',
  },
  {
    isValid: true,
    errorMessage: '',
  },
]

export const TEXT_FIELD_PHONE_NUMBER_TITLE = '電話番号'

export const FEATURE_BY_ROLES_F6 = {
  SAVE_BUTTON: 'save-button',
  SAVE_TO_SETTING_BUTTON: 'save-to-setting-button',
  SAVE_AND_PREVIEW_BUTTON: 'save-and-preview-button',
}
export const FEATURE_BY_ROLES_MATRIX_F6 = [
  {
    feature_by_role: FEATURE_BY_ROLES_F6.SAVE_BUTTON,
    form_role: FORM_ROLE.FORM_FORM_EDIT,
  },
  {
    feature_by_role: FEATURE_BY_ROLES_F6.SAVE_TO_SETTING_BUTTON,
    form_role: FORM_ROLE.FORM_FORM_EDIT,
  },
  {
    feature_by_role: FEATURE_BY_ROLES_F6.SAVE_AND_PREVIEW_BUTTON,
    form_role: FORM_ROLE.FORM_FORM_EDIT,
  },
]

export const PARTS_CD_CLASS = {
  PB0101: 'step',
  PB0201: 'text-field',
  PB0301: 'text-area',
  PB0401: 'radio',
  PB0501: 'checkbox',
  PB0601: 'select',
  PB0701: 'heading-main',
  PB0801: 'heading-sub',
  PB1001: 'text',
  PB1101: 'separator',
  PB1201: 'attaching-file',
  PB1301: 'permission',
  PB1401: 'terms',
  PS1501: 'prefectures',
  PS1601: 'sex',
  PS1701: 'name',
  PS1801: 'mailaddress',
  PS1901: 'birthday',
  PS2001: 'year-and-month',
  PS2101: 'calendar',
  PS2201: 'address',
  PB2301: 'spacer-20',
  PB2401: 'new-page-buttons',
  PB2501: 'parameter',
}
