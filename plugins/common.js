import Vue from 'vue'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja'
import lscache from 'lscache'
import axios from 'axios'

dayjs.locale('ja')
dayjs.extend(isSameOrAfter)
dayjs.extend(relativeTime)

// グローバル変数
Vue.prototype.$globalVariable = {
  // 正規表現
  regularExp: {
    halfStrNumberSymbol: '^[a-zA-Z0-9!-/:-@¥[-`{ -~]*$', // 半角英数字記号
    halfStrNumber: '^[A-Za-z0-9]*$', // 半角英数字
    halfNumber: '^[0-9]*$', // 半角数字
    zenKana: '^[ァ-ヶー　]*$', // 全角カタカナ
    mail:
      '^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$', // メール 半角英数、-_.@
    mailAt: '^([a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+[.][A-Za-z]+(\n)?)*?$', // メール @
    idClass: '^[a-zA-Z0-9-_]*$', // id, class名
    domain: '^[a-zA-Z0-9-_.;/?:@&=+$,%#]*$', // URLドメイン (通常)
    anchor: '^#', // アンカー
    cmsDomain: '^[a-zA-Z0-9-]*$', // CMSドメイン許容文字
    cmsDomainFormat1: '^(?!-)(?!.*-$).*$', // CMSドメイン はじめと終わりがハイフンNG
    cmsDomainFormat2: '^(?!(.{2}-{2})).*$', // CMSドメイン 3文字目と4文字目で連続してハイフンNG
    protocol: '^(http(s)?://(.)*)?$', // プロトコル
    copyRight: '^[a-zA-Z0-9!-/:-@¥[-`{ -~©]*$', // コピーライト
    fiveLineBreaks: '^(.*|(\n).*){0,5}$', // 5件以内の改行
    password: `^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-Z0-9!-/:-@¥[-\`{ -~]*)?$`, // パスワード記号あり
    passwordNoSymbol: '^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-Z0-9]*)?$', // パスワード記号なし
    ipAddress: '^([0-9.*]+(\n)?)*$', // IPアドレス
    ipAddressFormat:
      '^(([0-9*]{1,3}).([0-9*]{1,3}).([0-9*]{1,3}).([0-9*]{1,3})(\n)?)*$', // IPフォーマット
    formMailTextFormat: '^((?!.*##([0-9a-z_-]+?)##).|(\n)?)*$',
    cfmSimulation: '^[0-9-.]*$', // CFMシミュレーション
    storageFolderName: '^(?!.*[¥/:*?“<>|]).*$', // ストレージフォルダ名 除外記号設定
  },
}

export default ({ app }, inject) => {
  const common = {
    /**
     * 数値をカンマ区切りにする
     * @param {number} num 整数値
     */
    commaSeparate(num) {
      if (typeof num !== 'number') return num
      return num.toLocaleString()
    },
    /**
     * 共通エラー表示処理
     *
     * @param {object} errorInfo サーバー側から取得したエラー情報
     */
    showCommonError(errorInfo) {
      let showErrorList = errorInfo.errorList || []
      const tn2005ErrorIndex = showErrorList.findIndex(
        (data) => data.errorCode === 'tn2005'
      )
      const tn1001ErrorIndex = showErrorList.findIndex(
        (data) => data.errorCode === 'tn1001'
      )

      // 基本設定が完了していないエラーが返ってきた場合は、通知ダイアログを表示
      if (tn2005ErrorIndex >= 0) {
        app.store.commit(
          'common/setShowIncompleteBasicSettingsModalState',
          true
        )
        app.store.commit(
          'common/setShowIncompleteBasicSettingsMessage',
          showErrorList[tn2005ErrorIndex].errorMessage
        )
        return
      } else if (tn1001ErrorIndex >= 0) {
        app.store.commit(
          'cms/basicSettingsStore/setShowPromptForPageUpdateModalState',
          true
        )
        app.store.commit(
          'cms/basicSettingsStore/setPromptForPageUpdateMessage',
          showErrorList[tn1001ErrorIndex].errorMessage
        )
        return
      }

      if (Array.isArray(errorInfo.itemErrorList)) {
        showErrorList = showErrorList.concat(errorInfo.itemErrorList)
      }

      app.store.commit('common/setCommonErrorList', showErrorList)
      app.store.commit('common/showCommonErrorModal')
    },
    /**
     * 完了ポップアップを表示
     *
     * @param {string} code メッセージコード
     * @param {string} str 変換する文字列
     */
    showCompletePopAlert(code, str) {
      const message = this.getMasterMessage(code, { str })
      app.store.commit('common/setCompletePopAlertLabel', message)
    },
    addCallApiNum() {
      app.store.commit('common/addCallApiNum')
    },
    subCallApiNum() {
      app.store.commit('common/subCallApiNum')
    },
    /**
     * オブジェクトのkey有無チェック
     * @param {object} obj オブジェクト
     * @param {string} key key
     * @returns {boolean} 判定結果
     */
    checkHasOwnProperty(obj, key) {
      return !!obj && Object.prototype.hasOwnProperty.call(obj, key)
    },
    /**
     * CSVファイルダウンロード処理
     *
     * @param {string} text テキスト内容
     * @param {string} defaultFileName ファイル名
     */
    csvFileDownload(text, defaultFileName) {
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]) // eslint-disable-line
      const blob = new Blob([bom, text], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = defaultFileName || 'data.csv'
      link.click()
      link.remove()
      window.URL.revokeObjectURL(link)
    },
    /**
     * Base64とMIMEコンテンツタイプからBlobオブジェクトを作成する。
     *
     * @param dataURI {string} データURI
     */
    downloadFile(dataURI, fileName) {
      app.$common.addCallApiNum()
      axios
        .get(dataURI, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data])
          const link = document.createElement('a')

          link.href = URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          URL.revokeObjectURL(link.href)
          app.$common.subCallApiNum()
        })
        .catch((error) => {
          app.$common.apiErrorFunc(error)
        })
    },
    /**
     * Base64とMIMEコンテンツタイプからBlobオブジェクトを作成する。
     * 日本語対応。
     *
     * @param base64
     * @param mimeType MIMEコンテンツタイプ
     * @returns Blob
     */
    convertToBlob(base64, mimeType) {
      // 日本語の文字化けに対処するためBOMを作成する。
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]) // eslint-disable-line
      const bin = atob(base64.replace(/^.*,/, ''))
      const buffer = new Uint8Array(bin.length)

      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      let blob = null
      // Blobを作成
      try {
        blob = new Blob([bom, buffer.buffer], {
          type: mimeType,
        })
      } catch (e) {
        return false
      }

      return blob
    },
    /**
     * 「年」のプルダウンオプションを生成する
     *
     * @param {number} first 開始日
     * @param {number} futureDay 未来何年先まで設定するか
     */
    createSelectYearOptions(first = 100, futureDay = 0) {
      const currentYear = new Date().getFullYear()
      const fromYear = currentYear - first
      const endYear = currentYear + futureDay
      const result = []

      for (let i = fromYear; i <= endYear; i++) {
        const obj = {}

        obj.code = String(i)
        obj.label = `${i}年`

        result.push(obj)
      }

      return result
    },
    /**
     * 「月」のプルダウンオプションを生成する
     */
    createSelectMonthOptions() {
      const result = []
      for (let i = 1; i <= 12; i++) {
        const obj = {}
        obj.code = ('00' + String(i)).slice(-2)
        obj.label = `${i}月`
        result.push(obj)
      }
      return result
    },
    /**
     * 現在日付と引数の日付を比較
     *
     * @param {string} date 日付
     * @returns {boolean} true:現在日付のほうが後(同日付もtrue) false:引数の日付のほうが後
     */
    checkCompareDate(date) {
      const from = dayjs(date)
      const to = dayjs()
      const result = to.isSameOrAfter(from)

      return result
    },
    /**
     * 日付の差分を取得
     */
    getFormatDiffDate(date) {
      return dayjs(date).fromNow()
    },
    /**
     * 指定したフォーマットで現在時刻を取得
     *
     * @param {string} format 表示フォーマット
     * @returns 現座時刻
     */
    getFormatCurrentDate(format) {
      let showDate = ''
      const now = new Date()
      const Year = now.getFullYear()
      const Month = ('0' + (now.getMonth() + 1)).slice(-2)
      const Day = ('0' + now.getDate()).slice(-2)
      const Hour = ('0' + now.getHours()).slice(-2)
      const Min = ('0' + now.getMinutes()).slice(-2)
      const Sec = ('0' + now.getSeconds()).slice(-2)

      switch (format) {
        case 'YYYY':
          showDate = Year
          break
        case 'YYYYMM':
          showDate = Year + Month
          break
        case 'YYYYMMDD':
          showDate = Year + Month + Day
          break
        case 'YYYY/MM/DD':
          showDate = Year + '/' + Month + '/' + Day
          break
        case 'YYYYMMDDhhmm':
          showDate = Year + Month + Day + Hour + Min
          break
        case 'YYYYMMDDhhmmss':
          showDate = Year + Month + Day + Hour + Min + Sec
          break
        default:
          break
      }

      return showDate
    },
    /**
     * 現在表示している画面のパスを取得(最後のスラッシュはあり)
     */
    trimScreenPath(path) {
      const trimPath = path.slice(-1) !== '/' ? path + '/' : path

      return trimPath
    },
    /**
     * 秒変換（hh:mm:ss）
     * @param {string} str hh:mm:ss形式の文字列
     */
    toSecond(str) {
      const times = str.split(':')
      return (
        Number(times[0]) * 60 * 60 + Number(times[1]) * 60 + Number(times[2])
      )
    },
    /**
     * 改行コードをHTMLの改行コードに変換
     * @param {string} str 変換対象の文字列
     * @return 変換後の文字列
     */
    replaceNewLineCode(str) {
      return str.replace(/\n/g, '<br/>')
    },
    /**
     * メッセージマスタからメッセージを取得
     *
     * @param {string} code メッセージコード
     * @param {object} variable リプレイス変数
     */
    getMasterMessage(code, variable) {
      const masterMessages = app.store.state.common.frontMasterMessageList
      const targetMessageObj = masterMessages.find((data) => {
        return data.messageCode === code
      })

      let message = targetMessageObj ? targetMessageObj.messageContent : ''
      const replaceStr1 = '{X}'
      const replaceStr2 = '{Y}'

      switch (code) {
        case 'ErrorMsg_Count01':
          message = message.replace(replaceStr1, variable.maxlength)
          break
        case 'ErrorMsg_Count02':
          message = message.replace(replaceStr1, variable.minlength)
          break
        case 'ErrorMsg_Upload01':
          message = message
            .replace(replaceStr1, variable.size)
            .replace(replaceStr2, variable.unit)
          break
        case 'ErrorMsg_Upload02':
          message = message.replace(replaceStr1, variable.allowExts)
          break
        default:
          if (message.includes(replaceStr1)) {
            message = message.replace(replaceStr1, variable.str)
          }
          break
      }

      return message
    },
    /**
     * 汎用マスタから表示データの取得
     *
     * @param {number} categoryNo カテゴリーNo
     * @param {string} type option or code
     * @return 汎用マスタから生成したセレクボックスの表示データ
     */
    getVersatileOptions(categoryNo, type) {
      const versatileItems = app.store.state.common.masterData.versatileItems
      const options = []

      for (let i = 0; i < versatileItems.length; i++) {
        if (versatileItems[i].categoryNo === categoryNo) {
          const itemInformation = JSON.parse(versatileItems[i].itemInformation)
          const itemInformationArray = Object.entries(itemInformation)
          itemInformationArray.sort((a, b) => {
            if (a[1].viewOrder > b[1].viewOrder) {
              return 1
            } else {
              return -1
            }
          })
          for (const key in itemInformationArray) {
            if (categoryNo === 3 && itemInformationArray[key].viewFlag === 0) {
              break
            }
            const option = {}

            if (type === 'value') {
              option.value = itemInformationArray[key][0]
            } else {
              option.code = itemInformationArray[key][0]
            }

            option.label = itemInformationArray[key][1].value
            options.push(option)
          }
          break
        }
      }

      return options
    },
    /**
     * 汎用マスターのobject値を取得
     *
     * @param {number}} categoryNo カテゴリーNo
     * @return 汎用マスタの対象カテゴリーのオブジェクトを取得
     */
    getVersatileItemInformation(categoryNo) {
      const versatileItems = app.store.state.common.masterData.versatileItems
      const itemInformation = JSON.parse(
        versatileItems.find((data) => data.categoryNo === categoryNo)
          .itemInformation
      )

      return itemInformation
    },
    /**
     * 汎用マスターのvalue値を取得
     *
     * @param {number} categoryNo カテゴリーNo
     * @param {string} code コード値
     * @param {string} item 取得する項目値
     * @return 汎用マスタのvalue値
     */
    getVersatileItem(categoryNo, code, item) {
      const versatileItems = app.store.state.common.masterData.versatileItems
      let value = ''

      for (let i = 0; i < versatileItems.length; i++) {
        if (versatileItems[i].categoryNo === categoryNo) {
          const itemInformation = JSON.parse(versatileItems[i].itemInformation)
          for (const key in itemInformation) {
            if (key === code) {
              value = itemInformation[key][item]
            }
          }
          break
        }
      }

      return value
    },
    /**
     * 値に紐づくラベルを取得
     * @param {String} value 値
     * @param {String} options マスターデータ
     * @return {String} ラベル
     */
    getOptionLabel(value, options) {
      let label = ''

      for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
          label = options[i].label
          break
        }
      }

      return label
    },
    /**
     * イメージパスタイプの取得
     *
     * @return {String} base64:base64 url:URL
     */
    getImagePathType(imagePath) {
      let imagePathType = null

      if (imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
        imagePathType = 'base64'
      } else {
        imagePathType = 'url'
      }

      return imagePathType
    },
    /**
     * タイムスタンプの取得
     *
     * @return {string} タイムスタンプ
     */
    getTimeStamp() {
      const timeStamp = new Date().getTime()

      return timeStamp
    },
    /**
     * クリップボードにコピー
     * @param {} str コピーさせたい文字列
     */
    copyClipBoard(str) {
      const input = document.createElement('input')
      input.setAttribute('id', 'copyinput')
      document.body.appendChild(input)
      input.value = str
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    },
    escapeHtml(str) {
      if (typeof str !== 'string') {
        return str
      }
      return str.replace(/[&'`"<>]/g, (match) => {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
        }[match]
      })
    },
    /**
     * スクロールバー表示有無の取得
     */
    checkShowScrollBar() {
      let result = false

      if (document.getElementsByClassName('main-container').length > 0) {
        const headerHeight = 80
        const contentHeight = document.getElementsByClassName(
          'main-container'
        )[0].scrollHeight
        const windowHeight = document.documentElement.clientHeight
        if (contentHeight > windowHeight - headerHeight) {
          result = true
        }
      }

      return result
    },
    /**
     * スクロールを先頭に移動
     *
     * @param {String} selector スクロール対象のセレクター
     */
    initScrollTop(selector) {
      const targetSelector = selector || '.main-container, .spBody'

      if (document.querySelector(targetSelector)) {
        document.querySelector(targetSelector).scrollTop = 0
      }
    },
    getQueryParam(name, url) {
      if (!url) url = window.location.href
      name = name.replace(/\[\[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
      const results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    },
    /**
     * APIエラー共通処理
     *
     * @param {object} error APIのエラーレスポンス
     */
    apiErrorFunc(error) {
      this.subCallApiNum()
      if (error.response) {
        this.redirectErrorPage(error.response.status)
      }
    },
    /**
     * エラーページにリダイレクト
     */
    redirectErrorPage(statusCode) {
      switch (statusCode) {
        case 400:
          app.router.push('/400/')
          break
        case 401:
          app.store.dispatch('auth/logout')
          app.router.push('/401/')
          break
        case 403:
          app.router.push('/403/')
          break
        case 404:
          app.router.push('/404/')
          break
        case 500:
          app.router.push('/500/')
          break
        case 503:
          app.router.push('/503/')
          break
        case 504:
          app.router.push('/504/')
          break
        default:
          break
      }
    },
    getAssetsImgUrl(pic) {
      const imageSrc = pic ? require('../assets/' + pic) : ''
      const resultImageSrc = imageSrc || pic

      return resultImageSrc
    },
    /**
     * プロフィールのイメージデータの取得
     * 引数の画像が存在しなければ未設定用の画像を返す
     *
     * @param {string} src イメージデータ
     * @return {string} イメージデータ
     */
    getProfileImg(src) {
      let imageSrc = ''
      const noImage = require('~/assets/images/placeholder_profile.png')

      imageSrc = src || noImage

      return imageSrc
    },
    /**
     * プロフィールのイメージデータの取得
     * 引数の画像が存在しなければ未設定用の画像を返す
     *
     * @param {string} src イメージデータ
     * @return {string} イメージデータ
     */
    getGroupProfileImg(src) {
      let imageSrc = ''
      const noImage = require('~/assets/images/community/group/placeholder_groupProfile.png')

      imageSrc = src || noImage

      return imageSrc
    },
    /**
     * 画面遷移処理(エディター画面用)
     * ルートパスの場合は同タブにて遷移 絶対パスの場合は別タブにて表示
     * @param {string} path 画面遷移先のルートパス or 外部リンクの絶対パス
     */
    transitionScreen(path) {
      if (!path) return
      const root = app.store.state.cms.editorStore.editorData.topPagePath

      if (path.slice(0, 1) === '/') {
        if (window.location.pathname.includes('/site/pages/edit/')) {
          window.open(root.slice(0, -1) + path, '_blank')
        } else {
          window.location.href = root.slice(0, -1) + path
        }
      } else {
        window.open(path, '_blank')
      }
    },
    /**
     * 文字列のバイト数の取得
     * @param {string} str 文字列
     * @return {number} バイト数
     */
    getStrBytes(str) {
      return encodeURIComponent(str).replace(/%../g, 'x').length
    },
    /**
     * バリデーションに引っかかったエラーメッセージ一覧を返す
     *
     * @param {object[]} validationList バリデーションリスト
     * @param {string} inputVal 入力値
     * @param {boolean} noCustom カスタムバリデーションをチェック対象に入れるかどうか
     * @returns エラーリスト
     */
    getValidationMsg(validationList, inputVal, noCustom) {
      const errorMessageList = []
      let checkValue = ''

      if (inputVal !== null && inputVal !== undefined) {
        if (typeof inputVal === 'number') {
          checkValue = String(inputVal)
        } else {
          checkValue = inputVal
        }
      }

      for (let i = 0; i < validationList.length; i++) {
        let validationMsg = ''

        switch (validationList[i].type) {
          case 'required':
            if (checkValue.length === 0 || checkValue === false) {
              validationMsg = validationList[i].message
            }
            break
          case 'minlength':
            if (
              checkValue.length > 0 &&
              checkValue.length < validationList[i].minlength
            ) {
              validationMsg = validationList[i].message
            }
            break
          case 'maxlength':
            if (checkValue.length > validationList[i].maxlength) {
              validationMsg = validationList[i].message
            }
            break
          case 'ngvalue':
            if (Array.isArray(checkValue)) {
              for (let j = 0; j < checkValue.length; j++) {
                if (validationList[i].ngvalue.includes(checkValue[j])) {
                  validationMsg = validationList[i].message
                  break
                }
              }
            } else if (validationList[i].ngvalue.includes(checkValue)) {
              validationMsg = validationList[i].message
            }
            break
          case 'regex':
            validationMsg = checkValidationRegex(checkValue, validationList[i])
            break
          case 'boolean':
            if (!validationList[i].bool) {
              validationMsg = validationList[i].message
            }
            break
          case 'custom':
            if (!noCustom) {
              validationMsg = validationList[i].message
            }
            break
          default:
            validationMsg = validationList[i].message
            break
        }

        if (validationMsg.length > 0) {
          if (!errorMessageList.includes(validationMsg)) {
            errorMessageList.push(validationMsg)
            break
          }
        }
      }

      return errorMessageList
    },
    checkExistValidation(validationItems, key, inputVal, noCustom = false) {
      let result = false

      for (let i = 0; i < validationItems.length; i++) {
        if (validationItems[i].id === key) {
          if (
            this.getValidationMsg(
              validationItems[i].validation,
              inputVal,
              noCustom
            ).length > 0
          ) {
            result = true
          } else {
            result = false
          }
          break
        }
      }

      return result
    },
    /**
     * 引数のIDのフォーム項目の情報を取得(バリデーションやmaxlengthなど)
     *
     * @param {object} formItems フォーム項目情報
     * @param {string} id 項目ID
     * @return 引数のIDのフォーム項目の情報
     */
    getFormItemsDetail(formItems, id) {
      return formItems.find((data) => {
        return data.id === id
      })
    },
    /**
     * サーバーなどから動的にバリデーションリストを追加
     */
    getNewValidationList(validationItems, errorInfo) {
      const newValidationItems = JSON.parse(JSON.stringify(validationItems))

      for (let i = 0; i < errorInfo.length; i++) {
        for (let j = 0; j < newValidationItems.length; j++) {
          if (newValidationItems[j].id === errorInfo[i].errItem) {
            newValidationItems[j].validation = newValidationItems[
              j
            ].validation.filter((data) => {
              return data.type !== 'custom'
            })

            newValidationItems[j].validation.push({
              type: 'custom',
              message: errorInfo[i].errMessage,
            })
            break
          }
        }
      }

      return newValidationItems
    },
    /**
     * 動的に追加したバリデーションの削除
     */
    deleteCustomTypeValidation(validationItems, type) {
      const newValidationItems = JSON.parse(JSON.stringify(validationItems))

      if (type) {
        for (let i = 0; i < newValidationItems.length; i++) {
          if (newValidationItems[i].id === type) {
            newValidationItems[i].validation = newValidationItems[
              i
            ].validation.filter((data) => {
              return data.type !== 'custom'
            })
            break
          }
        }
      } else {
        for (let i = 0; i < newValidationItems.length; i++) {
          newValidationItems[i].validation = newValidationItems[
            i
          ].validation.filter((data) => {
            return data.type !== 'custom'
          })
        }
      }

      return newValidationItems
    },
    /**
     * 文字列配列の結合(重複は削除)
     *
     * @param {string[]} arr1 配列1
     * @param {string[]} arr2 配列2
     */
    getUniqueStrArrayMerge(arr1, arr2) {
      const arr = arr1.concat(arr2)
      const uniqueArr = []

      for (const i of arr) {
        if (!uniqueArr.includes(i)) {
          uniqueArr.push(i)
        }
      }

      return uniqueArr
    },
    /**
     * 配列1から配列2の内容を削除
     *
     * @param {string[]} arr1 配列1
     * @param {string[]} arr2 配列2
     */
    getDeleteStrArrayMerge(arr1, arr2) {
      const uniqueArr = []

      for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
          uniqueArr.push(arr1[i])
        }
      }

      return uniqueArr
    },
    /**
     * 文字列のデータチェック
     * nullまたは空文字の場合はfalse,それ以外はtrueを返す
     *
     * @param {string} string 文字列
     * @return {boolean} チェック結果
     */
    checkStringValue(string) {
      let result = false

      if (string && string.length > 0) {
        result = true
      }

      return result
    },
    /**
     * 配列のデータチェック
     * nullまたは空の配列の場合はfalse,それ以外はtrueを返す
     *
     * @param {array} array 配列
     * @return {boolean} チェック結果
     */
    checkArrayValue(array) {
      let result = false

      if (array && array.length > 0) {
        result = true
      }

      return result
    },
    /**
     * 文字列型なのにnullで返ってきている値を空文字に変換
     *
     * @param {object} object 設定対象のオブジェクト
     * @param {string[]} exclusionKeys 除外対象のkey
     */
    setNullConvertStringValue(object, exclusionKeys) {
      for (const key in object) {
        if (!exclusionKeys.includes(key)) {
          object[key] = object[key] || ''
        }
      }
    },
    /**
     * URLの文字列をリンクに変換
     *
     * @param {string} str 変換前の文字列
     * @returns {string[]} 変換後の文字列
     */
    replaceLinkTag(str) {
      const replaceStr = str
      const regexpUrl = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g // ']))/;正規表現（/〜/）を解釈してくれないエディタ等で自動整形を崩さないため。
      const regexpMakeLink = function (all, url, h, href) {
        return (
          '<a class="link-text" href="h' +
          href +
          '" target="_blank">' +
          url +
          '</a>'
        )
      }
      const textWithLink = replaceStr.replace(regexpUrl, regexpMakeLink)

      return textWithLink
    },
    /**
     * 文字列に含まれているURLを配列で取得
     * @param {string} str 文字列
     * @returns {string[]} URL配列
     */
    getUrlInStr(str) {
      const matches = str.match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+/g)

      if (matches != null) {
        return matches
      } else {
        return []
      }
    },
    /***
     * 引数のURL配列から指定したmedia(img or movie)のurlをフィルタリングして取得
     *
     * @param {string[]} urls URL配列
     * @param {string} mediaType media
     * @return {string[]} フィルタリングしたURL配列
     */
    getTargetMediaUrls(urls, mediaType) {
      const imgExt = ['gif', 'png', 'jpg', 'jpeg', 'svg']
      const movieExt = ['mp4']
      const mediaUrls = []

      for (let i = 0; i < urls.length; i++) {
        const ext = this.getExt(urls[i])

        if (mediaType === 'img') {
          if (imgExt.includes(ext)) {
            mediaUrls.push(urls[i])
          }
        } else if (mediaType === 'movie') {
          if (movieExt.includes(ext)) {
            mediaUrls.push(urls[i])
          }
        }
      }

      return mediaUrls
    },
    /**
     * パスから拡張子を取得
     *
     * @param {string} path パス
     * @returns {string} 拡張子
     */
    getExt(path) {
      const pos = path.lastIndexOf('.')

      if (pos === -1) return ''

      return path.slice(pos + 1).toLowerCase()
    },
    /**
     * オブジェクト一致チェック
     *
     * @param {object} objA オブジェクトA
     * @param {object} objB オブジェクトB
     * @return {boolean} 入力内容に変更がない場合はtrue それ以外はfalseを返す
     */
    checkSameObject(objA, objB) {
      const aJSON = JSON.stringify(objA)
      const bJSON = JSON.stringify(objB)
      let result = false

      if (aJSON === bJSON) {
        result = true
      }

      return result
    },
    /**
     * 認証が必要ないページのチェック
     *
     * @param {string} path 現在パス
     * @returns {boolean} true:認証が必要ないページ false:認証が必要なページ
     */
    checkNotAuthScreens(path) {
      let result = false
      const notAuthScreens = app.store.state.common.notAuthScreens

      for (let i = 0; i < notAuthScreens.length; i++) {
        if (path.startsWith(notAuthScreens[i])) {
          result = true
          break
        }
      }

      return result
    },
    /**
     * サーバ側のログイン処理
     */
    exeLogin() {
      const paramData = {
        'remember-me': lscache.get('loginFlg') || '0',
      }

      app.$common.addCallApiNum()
      app.$api
        .exeLogin(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            this.getCsrfTokenData()
          } else {
            app.$common.showCommonError(resData.data.errorInfo)
          }
          app.$common.subCallApiNum()
        })
        .catch((error) => {
          app.$common.apiErrorFunc(error)
        })
    },
    /**
     * CSRFトークンデータの取得
     */
    getCsrfTokenData() {
      const paramData = {}

      app.$common.addCallApiNum()
      app.$api
        .getCsrfTokenData(paramData)
        .then((resData) => {
          localStorage.setItem('csrfToken', resData.data.csrfToken)
          this.getMasterData() // マスターデータの取得
          app.$common.subCallApiNum()
        })
        .catch((error) => {
          app.$common.apiErrorFunc(error)
        })
    },
    getMasterData() {
      const paramData = {}

      app.$common.addCallApiNum()
      app.$api
        .getMasterData(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            app.store.commit('common/setMasterData', resData.data)
            if (!app.$common.checkFunctionAuth(window.location.pathname)) {
              app.router.push('/launcher/')
            }
          } else {
            app.$common.showCommonError(resData.data.errorInfo)
          }
          app.$common.subCallApiNum()
        })
        .catch((error) => {
          app.$common.apiErrorFunc(error)
        })
    },
    /**
     * 機能の参照権限チェック
     *
     * @param {string} path 現在パス
     * @returns {boolean} true:参照権限あり false:参照権限なし
     */
    checkFunctionAuth(path) {
      const storeData = JSON.parse(sessionStorage.getItem('bizsky'))
      const storeMasterData = storeData ? storeData.common.masterData : {} // マスターデータがvuexに格納されていなければ、共通関数を呼び出して格納
      const functionAuthority = storeMasterData.functionAuthority
      let currentFunc = ''
      let functionId = ''
      let result = true

      if (app.$common.checkArrayValue(functionAuthority)) {
        if (path.split('/').length > 1) {
          currentFunc = path.split('/')[1]
        }

        switch (currentFunc) {
          case 'site':
            functionId = '01'
            break
          case 'form':
            functionId = '03'
            break
          case 'community':
            functionId = '05'
            break
          case 'account':
            functionId = '06'
            break
          case 'mmi':
            functionId = '09'
            break
          default:
            break
        }

        if (functionId) {
          const targetFunctionAuthority = functionAuthority.find(
            (data) => data.id === functionId
          )

          result = targetFunctionAuthority.authority
        }
      }

      return result
    },
    /**
     * AreaLabel
     */
    setAreaLabel(event, directionData, labelData) {
      let AreaLabelData = {}

      if (labelData !== '') {
        if (app.store.state.common.areaLabel.isMouseHover) {
          return false
        } else {
          AreaLabelData = {
            text: labelData,
            direction: directionData,
            rect: event.target.getBoundingClientRect(),
            isMouseHover: true,
          }
        }
      } else {
        AreaLabelData = {
          text: '',
          direction: '',
          rect: {},
          isMouseHover: false,
        }
      }

      if (JSON.stringify(app.store.state.common.areaLabel) !== AreaLabelData) {
        app.store.commit('common/setAreaLabel', AreaLabelData)
      }
    },
    /**
     * Cookie情報を配列で取得
     */
    getCookieArray() {
      const arr = []

      if (document.cookie !== '') {
        const tmp = document.cookie.split('; ')

        for (let i = 0; i < tmp.length; i++) {
          const data = tmp[i].split('=')
          arr[data[0]] = decodeURIComponent(data[1])
        }
      }

      return arr
    },
    /**
     * 引数のパスの情報からリンク属性(href, target)の取得
     *
     * @param {string} pagePath エディタ画面で設定したurl値
     * @return {object} backObj リンク属性(href,target)
     */
    getCmsEditorLinkAttr(pagePath) {
      const backObj = {}
      const currentPath = window.location.pathname

      if (pagePath.slice(0, 1) === '#') {
        // アンカーリンクの場合
        backObj.href = currentPath + pagePath
      } else if (pagePath.slice(0, 1) === '/') {
        // 内部リンクの場合
        const topPagePath = app.store.state.cms.editorStore.topPagePath

        backObj.href = topPagePath + pagePath.slice(1)
      } else if (pagePath.includes('http')) {
        // 外部リンクの場合
        backObj.href = pagePath
        backObj.target = '_blank'
      }

      return backObj
    },
    /**
     * アカウント通知用ポーリング処理（ログイン時に実行）
     *
     */
    chatUnreadMessagesPolling() {
      if (!app.store.state.common.isNotificationListPolling) {
        app.store.commit('common/setIsNotificationListPolling', true)

        const timerId = setInterval(() => {
          const paramData = {}

          app.$api.getNotificationList(paramData).then((resData) => {
            if (resData.data.result === 0) {
              app.store.commit(
                'common/setNotificationList',
                resData.data.notificationList
              )
            } else {
              this.showCommonError(resData.data.errorInfo)
            }
          })
        }, 600000)

        app.store.commit('common/setUnreadMessagesPollingTimerId', timerId)
      }
    },
    /**
     * アカウント通知用ポーリング処理の停止
     */
    clearUnreadMessagesPolling() {
      const timerId = app.store.state.common.unreadMessagesPollingTimerId

      app.store.commit('common/setIsNotificationListPolling', false)
      clearInterval(timerId)
    },
    /**
     * コミュニティSP表示確認
     *
     */
    isSpSize() {
      return window.matchMedia('(min-width: 897px)').matches
    },
    /**
     * 基本設定完了チェックAPIの呼び出し
     */
    getBasicSettingCompleteStatus() {
      const paramData = {}

      this.addCallApiNum()
      app.$api
        .getBasicSettingCompleteStatus(paramData)
        .then((resData) => {
          if (resData.data.result === 0) {
            const baseSettingStatus = resData.data.baseSettingStatus

            this.transitionBasicSetupScreen(baseSettingStatus)
            app.store.commit('common/setBasicSettingStatus', baseSettingStatus)
            app.store.commit(
              'common/setShowIncompleteBasicSettingsModalState',
              false
            )
          } else {
            this.showCommonError(resData.data.errorInfo)
          }

          this.subCallApiNum()
        })
        .catch((error) => {
          this.apiErrorFunc(error)
        })
    },
    /**
     * 基本セットアップ画面に遷移
     *
     * @param {number} baseSettingStatus 基本情報設定状況ステータス
     */
    transitionBasicSetupScreen(baseSettingStatus) {
      switch (baseSettingStatus) {
        case 0:
          app.router.push('/site/setup/domain/')
          break
        case 1:
          app.router.push('/site/setup/basic/')
          break
        case 2:
          app.router.push('/site/setup/design/')
          break
        default:
          break
      }
    },
  }

  inject('common', common)

  function checkValidationRegex(inputVal, validation) {
    const regex = new RegExp(validation.regex)
    let errMessage = ''

    if (inputVal.match(regex)) {
      errMessage = ''
    } else {
      errMessage = validation.message
    }

    return errMessage
  }
}
