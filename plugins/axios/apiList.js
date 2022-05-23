import axios from 'axios'
import axiosJsonpAdapter from 'axios-jsonp'
import { Auth } from 'aws-amplify'

export default function ({ app }, inject) {
  /**
   * 環境情報の取得
   *
   * @return {boolean} true:development環境 false:development環境以外
   */
  const getCheckDev = () => {
    let result = false

    if (process.env.environment === 'development') {
      result = true
    }

    return result
  }
  /**
   * リクエストヘッダの取得
   *
   * @param {boolean} noAuth cognito認証が必要ない場合はtrue,それ以外はfalse
   * @param {boolean} noAuth csrfTokenが必要ない場合はtrue,それ以外はfalse
   * @return {object} リクエストヘッダ
   */
  const getHeader = async (noAuth, noCsrf) => {
    const header = {}

    if (!getCheckDev() && !noAuth) {
      try {
        header.Authorization = `${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      } catch (err) {
        app.router.push('/401/')
      }
    }

    if (!noCsrf) {
      header['X-CSRF-TOKEN'] = localStorage.getItem('csrfToken')
    }

    return header
  }
  /**
   * リクエストメソッドの取得(dev環境の場合はGETを強制的に返す)
   *
   * @param {string} リクエストメソッド
   * @return {string} リクエストメソッド
   */
  const getMethod = (method) => {
    return getCheckDev() ? 'GET' : method || 'GET'
  }

  /**
   * domainの取得
   *
   * @return {string} APIのURLのdomain情報
   */
  const axiosBaseUrl = () => {
    return getCheckDev()
      ? process.env.axiosBaseUrl
      : process.env.axiosBaseApiUrl
  }

  /**
   * リクエストパラメータの値のトリム化
   *
   * @param {object} obj リクエストパラメータ
   * @return {object} トリム後のリクエストパラメータ
   */
  const getRequestParaTrim = (obj) => {
    const trimRequestData = JSON.parse(JSON.stringify(obj))

    deepTrim(trimRequestData)

    return trimRequestData
  }

  /**
   * オブジェクトのトリム処理
   *
   * @param {object} obj オブジェクト
   */
  const deepTrim = (obj) => {
    for (const prop in obj) {
      const value = obj[prop]
      const type = typeof value

      if (value != null && (type === 'string' || type === 'object')) {
        if (type === 'object') {
          deepTrim(obj[prop])
        } else {
          obj[prop] = obj[prop].trim()
        }
      }
    }
  }

  const api = {
    /**
     * ログインAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async exeLogin(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.exeLoginUrl,
        headers: await getHeader(false, true),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ログアウトAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async exeLogout(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.exeLogoutUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CSRFトークンの取得API
     *
     * @param {object} requestData
     * @returns {object} 処理結果
     */
    async getCsrfTokenData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCsrfTokenDataUrl,
        headers: await getHeader(false, true),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ログイン後処理API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMasterData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMasterDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * パスワードリセット要求API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async resetPasswordRequest(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.resetPasswordRequestUrl,
        headers: await getHeader(true, true),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * パスワードリセットAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async resetPassword(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.resetPasswordUrl
          : axiosBaseUrl() +
            process.env.resetPasswordUrl.replace('{uuid}', requestData.uuid),
        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.uuid
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * パスワード更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updatePassword(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.updatePasswordUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMSのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getCmsSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.cmsSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウントのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getAccountSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.accountSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getCommunitySideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.communitySideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクトのサイドメニューの取得

     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getContactSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.contactSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メールのサイドメニューの取得

     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getMailSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.mailSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニケーションのサイドメニューの取得
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getCommunicationSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.communicationSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォームのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getFormSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.formSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * MMIのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMmiSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.mmiSideNavUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFMのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCfmSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.cfmSideNavUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージのサイドメニューの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getStorageSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.storageSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * サービスランチャーのサイドメニューの取得(ph1では不使用)
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    getServicelauncherSideNav(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.servicelauncherSideNavUrl,
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 初期設定ツアー取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getInitialSettings(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getInitialSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 代表プロフィール取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getInitialProfile(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getInitialProfileUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 代表プロフィール更新
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateInitialProfile(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateInitialProfileUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * サービス開始API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async serviceStart(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.serviceStartUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * サービスメニュー一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getServicelauncher(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.servicelauncherListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * サービスランチャーお知らせ一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getServicelauncherNews(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.servicelauncherNewsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 通知一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getNotificationList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getNotificationListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 既読通知API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async readNotification(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.readNotificationUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_KPIデータ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCmsDashBoardKpiData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCmsDashBoardKpiDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページサマリー取得API(閲覧上位ページ一覧)
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCirculationPageList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCirculationPageListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_基本設定データ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCmsBasicSettings(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCmsBasicSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_基本情報の保存進捗の取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getSetupStatus(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getSetupStatusUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * CMS_ドメインチェックAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async checkDomain(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.checkDomainUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_基本設定データ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCmsBasicSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCmsBasicSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_基本設定完了チェックAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getBasicSettingCompleteStatus(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getBasicSettingCompleteStatusUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_サブドメイン確定API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async decideCmsDomainSettings(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.decideCmsDomainSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_基本設定サイト情報更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCmsBasicSettingsSites(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCmsBasicSettingsSitesUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_基本設定デザイン更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCmsBasicSettingsDesign(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCmsBasicSettingsDesignUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ドメイン情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCmsBasicSettingsDomain(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCmsBasicSettingsDomainUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_独自ドメイン切替API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async changeOwnDomain(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.changeOwnDomainUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_独自ドメイン切替状況確認API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getOwnDomainSetupStatus(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getOwnDomainSetupStatusUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_エディター画面のサイドメニューに表示するパーツデータ取得(local)
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCmsEditorComponentParts(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCmsEditorComponentPartsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページデータ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCmsEditorData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getCmsEditorDataUrl
          : axiosBaseUrl() +
            process.env.getCmsEditorDataUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページデータ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCmsEditorPageData(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateCmsEditorPageDataUrl
          : axiosBaseUrl() +
            process.env.updateCmsEditorPageDataUrl.replace(
              '{id}',
              requestData.id
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_カスタムパーツ登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async saveCustomPartsComponent(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.saveCustomPartsComponentUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_カスタムパーツ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCustomPartsList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCustomPartsListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_カスタムパーツ削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteCustomParts(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteCustomPartsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_アップロード画像一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCmsEditorUploadImageList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCmsEditorUploadImageListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_画像重複チェックAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async checkSameCmsEditorImageUpload(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.checkSameCmsEditorImageUploadUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_Publishステータス確認API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async checkCmsEditorPagePublish(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.checkCmsEditorPagePublishUrl
          : axiosBaseUrl() +
            process.env.checkCmsEditorPagePublishUrl.replace(
              '{id}',
              requestData.id
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_画像アップロードAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async uploadCmsEditorImage(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.uploadCmsEditorImageUrl,
        headers: await getHeader(),
      }

      options[getMethod('POST') === 'GET' ? 'params' : 'data'] = requestData // バイナリデータなのでトリムはしない
      options.headers['Content-Type'] = 'multipart/form-data'

      return axios(options)
    },
    /**
     * CMS_アップロード画像削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteCmsEditorImage(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteCmsEditorImageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_会社ロゴ登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async uploadSettingBasicLogo(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.uploadSettingBasicLogoUrl,
        headers: await getHeader(),
      }

      options[getMethod('POST') === 'GET' ? 'params' : 'data'] = requestData // バイナリデータなのでトリムはしない
      options.headers['Content-Type'] = 'multipart/form-data'

      return axios(options)
    },
    /**
     * CMS_公開管理データ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getPublicManagementData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getPublicManagementDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_公開管理データ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updatePublicManagementData(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updatePublicManagementDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページ構成取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCreateWebPage(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCreateWebPageListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページ構成更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateWebPageList(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateWebPageListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページ追加API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createWebPage(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createWebPageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CMS_ページ削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteWebPage(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteWebPageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    async getMailList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.mailListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    async getCreateMail(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.createMailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_KPIデータ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getFormDashBoardKpiData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getFormDashBoardKpiDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_KPIフォームデータリスト取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getDashBoardFormList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getDashBoardFormListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_KPIフォームデータリストCSV取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async downloadFormListData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.downloadFormListDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォームデータリスト取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getFormList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getFormListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォームデータ追加API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async insertFormData(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.insertFormDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォームデータ削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteFormData(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteFormDataUrl
          : axiosBaseUrl() +
            process.env.deleteFormDataUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォームステータス更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateFormStatus(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateFormStatusUrl
          : axiosBaseUrl() +
            process.env.updateFormStatusUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_回答レポートデータ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getContactWebAnswerDataList(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getContactWebAnswerDataListUrl
          : axiosBaseUrl() +
            process.env.getContactWebAnswerDataListUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_回答レポートデータ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateContactWebAnswerDataList(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateContactWebAnswerDataListUrl
          : axiosBaseUrl() +
            process.env.updateContactWebAnswerDataListUrl
              .replace('{formId}', requestData.formId)
              .replace('{answerId}', requestData.answerId),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
        delete requestData.answerId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_回答レポートデータ削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteAnswerData(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteAnswerDataUrl
          : axiosBaseUrl() +
            process.env.deleteAnswerDataUrl
              .replace('{formId}', requestData.id)
              .replace('{answerId}', requestData.answerId),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
        delete requestData.answerId
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_回答レポートリストCSV取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async downloadFormAnswerData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.downloadFormAnswerDataUrl
          : axiosBaseUrl() +
            process.env.downloadFormAnswerDataUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_回答レポートファイル取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async downloadAnswerReportFile(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.downloadAnswerReportFileUrl
          : axiosBaseUrl() +
            process.env.downloadAnswerReportFileUrl
              .replace('{formId}', requestData.formId)
              .replace('{answerId}', requestData.answerId)
              .replace('{formPartsId}', requestData.formPartsId),
        headers: await getHeader(),
      }
      if (!getCheckDev()) {
        delete requestData.formId
        delete requestData.answerId
        delete requestData.formPartsId
      }

      options.headers['Content-Type'] = 'application/force-download'
      options.headers.Accept = 'application/force-download'

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォーム機能基本設定取得取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getFormBasicSettings(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getFormBasicSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォーム機能基本設定取得更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateFormBasicSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateFormBasicSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォームデータ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getEditFormSettings(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getEditFormSettingsUrl
          : axiosBaseUrl() +
            process.env.getEditFormSettingsUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォームデータ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateEditFormSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateEditFormSettingsUrl
          : axiosBaseUrl() +
            process.env.updateEditFormSettingsUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * フォーム_フォーム公開API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updatePublishSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updatePublishSettingsUrl
          : axiosBaseUrl() +
            process.env.updatePublishSettingsUrl.replace(
              '{formId}',
              requestData.formId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.formId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getTimeLineList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getTimeLineListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン投稿内容取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getPostTimeLineComment(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getPostTimeLineCommentUrl
          : axiosBaseUrl() +
            process.env.getPostTimeLineCommentUrl.replace(
              '{postId}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * コミュニティ_タイムラインOGP削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteTimelineOwnOgp(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteTimelineOwnOgpUrl
          : axiosBaseUrl() +
            process.env.deleteTimelineOwnOgpUrl.replace(
              '{postId}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン投稿編集API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updatePostComment(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updatePostCommentUrl
          : axiosBaseUrl() +
            process.env.updatePostCommentUrl.replace(
              '{postId}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      if (!getCheckDev()) {
        delete requestData.postId
      }

      return axios(options)
    },
    /**
     * コミュニティ_投稿コメント編集API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateTimeLineChildComment(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateTimeLineChildCommentUrl
          : axiosBaseUrl() +
            process.env.updateTimeLineChildCommentUrl.replace(
              '{commentId}',
              requestData.commentId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      if (!getCheckDev()) {
        delete requestData.commentId
      }

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン投稿削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteTimeLineComment(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteTimeLineCommentUrl
          : axiosBaseUrl() +
            process.env.deleteTimeLineCommentUrl.replace(
              '{postId}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postId
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿コメント削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteTimeLineChildComment(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteTimeLineChildCommentUrl
          : axiosBaseUrl() +
            process.env.deleteTimeLineChildCommentUrl.replace(
              '{commentId}',
              requestData.commentId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.commentId
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン投稿いいねAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateGoodNum(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateGoodNumUrl
          : axiosBaseUrl() +
            process.env.updateGoodNumUrl.replace(
              '{postId}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン投稿通報API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postReportReasonForPost(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postReportReasonForPostUrl
          : axiosBaseUrl() +
            process.env.postReportReasonForPostUrl.replace(
              '{postId}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿コメント通報API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postReportReasonForComment(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postReportReasonForCommentUrl
          : axiosBaseUrl() +
            process.env.postReportReasonForCommentUrl.replace(
              '{commentId}',
              requestData.commentId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.commentId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿一覧取得API(特定のユーザーのタイムライン一覧)
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getTargetUserTimeLineList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getTargetUserTimeLineListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_最近のグループ投稿一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getPostGroupRecentTimeLine(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getPostGroupRecentTimeLineUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループタイムライン取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getPostGroupTimeLine(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getPostGroupTimeLineUrl
          : axiosBaseUrl() +
            process.env.getPostGroupTimeLineUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループメンバー一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getGroupMembers(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getGroupMembersUrl
          : axiosBaseUrl() +
            process.env.getGroupMembersUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_グループ投稿API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postGroupComment(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postGroupCommentUrl
          : axiosBaseUrl() +
            process.env.postGroupCommentUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_プロフィール取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getProfile(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getProfileUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_プロフィール更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateProfile(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateProfileUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_プロフィールカバー画像更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateProfileCoverImage(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateProfileCoverImageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_企業カバー画像更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCorporateProfileCoverImage(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCorporateProfileCoverImageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_グループカバー画像更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateGroupProfileCoverImage(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateGroupProfileCoverImageUrl
          : axiosBaseUrl() +
            process.env.updateGroupProfileCoverImageUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_お知らせ一覧取得API(ph1対象外)
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCommunityNewsList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCommunityNewsListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_閲覧足跡一覧表示API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getBrowsingHistory(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getBrowsingHistoryUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_閲覧足跡登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async addBrowsingHistory(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.addBrowsingHistoryUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループ情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getPostGroupInfo(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getPostGroupInfoUrl
          : axiosBaseUrl() +
            process.env.getPostGroupInfoUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループ一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getJoinGroupList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getJoinGroupListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループ作成取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createGroupProfile(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createGroupProfileUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateGroupProfile(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateGroupProfileUrl
          : axiosBaseUrl() +
            process.env.updateGroupProfileUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループ招待メンバー検索API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCommunityGroupInvitationMember(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCommunityGroupInvitationMemberUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿グループメンバー登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postInvitationGroupMember(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postInvitationGroupMemberUrl
          : axiosBaseUrl() +
            process.env.postInvitationGroupMemberUrl.replace(
              '{postGroupId}',
              requestData.postGroupId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postGroupId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムライン投稿API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postComment(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.postCommentUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_タイムラインOGP取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getOGPData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getOGPDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_コメント返信API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postReplyComment(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postReplyCommentUrl
          : axiosBaseUrl() +
            process.env.postReplyCommentUrl.replace('{id}', requestData.postId),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_コメント返信API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postReplyChildComment(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postReplyChildCommentUrl
          : axiosBaseUrl() +
            process.env.postReplyChildCommentUrl.replace(
              '{id}',
              requestData.postId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.postId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_つながり承認待ち一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getRequestConnectionList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getRequestConnectionListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_つながり一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getConnectionList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.connectionListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_つながり申請API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async requestConnection(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.requestConnectionUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_つながり申請キャンセルAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async cancelConnection(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.cancelConnectionUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_つながり承認API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async approvalConnection(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.approvalConnectionUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_つながり解除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteConnectionRequest(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteConnectionRequestUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_投稿表示設定更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updatePostDisplay(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updatePostDisplayUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_会社・CxO検索API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCommunitySearchResultData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCommunitySearchResultDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_所属CxOの一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCompanyMemberList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCompanyMemberListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_最新チャットメンバー取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getRecentlyMessageList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getRecentlyMessageListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_既読更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateChatReadStatus(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateChatReadStatusUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_メッセージ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCommunityMessageList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCommunityMessageListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_メッセージ投稿API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postCommunityMessage(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.postCommunityMessageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_メッセージ投稿API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteMessage(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteMessageUrl
          : axiosBaseUrl() +
            process.env.deleteMessageUrl.replace(
              '{messageId}',
              requestData.messageId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.messageId
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_メッセージファイル取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMessageFile(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getMessageFileUrl
          : axiosBaseUrl() +
            process.env.getMessageFileUrl.replace(
              '{messageId}',
              requestData.messageId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.messageId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_メッセージOGP削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteMessageTimelineOwnOgp(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteMessageTimelineOwnOgpUrl
          : axiosBaseUrl() +
            process.env.deleteMessageTimelineOwnOgpUrl.replace(
              '{messageId}',
              requestData.messageId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コミュニティ_メッセージグループ開始API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async startChatGroup(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.startChatGroupUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * presigned-urlを利用したS3へのファイルアップロード
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    putFileForPresignedUrl(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? process.env.putFileForPresignedUrlUrl
          : requestData.url,
        headers: {
          'Content-Type': requestData.fileType,
        },
        data: requestData.fileData,
      }

      return axios(options)
    },
    async getCustomerList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCustomerListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_顧問先招待一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getInvitationList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getInvitationListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_顧問先招待メールチェック・送信API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async sendInvitationMail(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.sendInvitationMailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * presigned-urlを利用しS3へアップロードしたファイルの名前、パスをDBに登録する。
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async savePresignedUrlForDatabase(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.savePresignedUrlForDatabaseUrl
          : axiosBaseUrl() +
            process.env.savePresignedUrlForDatabaseUrl.replace(
              '{messageId}',
              requestData.messageId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.messageId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM 顧問先一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAdvisorsList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getAdvisorsListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM アドバイス情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAdviceInfo(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.getAdviceInfoUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM 資金繰り予測レポート取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCashFlowReport(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.getCashFlowReportUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM シミレーション保存結果一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getSimulationList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getSimulationListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM シミュレーション保存結果取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getSimulationResults(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getSimulationResultsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM シミュレーション結果保存API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async saveSimulation(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.saveSimulationUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * CFM シミュレーション保存結果削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteSimulation(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.deleteSimulationUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メールアドレス重複チェックAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async checkSameMailAddress(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.checkSameMailAddressUrl
          : axiosBaseUrl() +
            process.env.checkSameMailAddressUrl.replace(
              '{mailAddress}',
              encodeURIComponent(requestData.email)
            ),

        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.email
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_利用申し込み内容登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async registUsageApplicationForm(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.registUsageApplicationFormUrl,
        headers: await getHeader(true, true),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_解約申し込みAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async putCancellation(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.putCancellationUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 解約申し込みレコードバージョン取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getContractRecordVersion(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getContractRecordVersionUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_ダッシュボード契約情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getContractInformation(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getContractInformationUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_ダッシュボード解約情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCancelNotice(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCancelNoticeUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_アカウント一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAccountList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getAccountListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_アカウント情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAccountDetail(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getAccountDetailUrl
          : axiosBaseUrl() +
            process.env.getAccountDetailUrl.replace(
              '{accountId}',
              requestData.tenantUserId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.tenantUserId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * アカウント_アカウント新規作成初期情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getNewAccountDetail(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getNewAccountDetailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_新規アカウント作成API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createNewAccountDetail(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createNewAccountDetailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_アカウント情報更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateAccountDetail(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateAccountDetailUrl
          : axiosBaseUrl() +
            process.env.getAccountDetailUrl.replace(
              '{accountId}',
              requestData.tenantUserId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.tenantUserId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_ヘッダアカウント情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAccountDetailHeader(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getAccountDetailHeaderUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_アカウントヘッダ情報更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateAccountDetailHeader(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateAccountDetailHeaderUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_契約情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getContractPlan(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getContractPlanUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_共通タグ取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAccountTag(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getAccountTagUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_共通タグ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateAccountTag(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateAccountTagUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_共通設定取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAccountCommonSettings(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getAccountCommonSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_共通設定更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateAccountCommonSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateAccountCommonSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_アカウント削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteAccount(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteAccountUrl,
        headers: await getHeader(),
      }
      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_招待メール再送API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async resendInvitationMail(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.resendInvitationMailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 会社カバー画像コード更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCorporateCoverImage(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCorporateCoverImageUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 企業情報表示内容取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCompanyData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCompanyDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 企業情報更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCorporateData(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCorporateDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 企業プロフィール更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateCorporateProfileData(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateCorporateProfileDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 保存条件取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getSaveConditions(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getSaveConditionsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 条件保存API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async insertSaveConditions(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.insertSaveConditionsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 保存条件削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteSaveConditions(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.deleteSaveConditionsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    getAddress(requestData) {
      const options = {
        method: getMethod('GET'),
        url: process.env.getAddress,
        adapter: axiosJsonpAdapter,
        params: {
          zipcode: requestData,
        },
      }
      return axios(options)
    },

    /**
     * 機能権限チェックAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMmiFunctionAuthority(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMmiFunctionAuthorityUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * アクティベート確認API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMmiActivatedState(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMmiActivatedStateUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * アクティベート実行API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async execMmiActivate(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.putMmiActivateUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 自社分析PL_BS取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMmiOwnCompany(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.getMmiOwnCompanyUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 統計分析(業種比較)PL_BS取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMmiStaticIndustries(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.getMmiIndustriesUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 統計分析(期間比較)PL_BS取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMmiStaticTerm(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.getMmiTermUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 統計分析(業種比較)PL_BS取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getCompanyMasterInfo(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getCompanyMasterDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 顧問先一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAdvisorInfo(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMmiAdvisorsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * テナント情報更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async putUpdateTenantInfo(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.putMmiUpdateTenantInfoUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 招待アカウント登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postInvitationAccount(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postInvitationAccountUrl
          : axiosBaseUrl() +
            process.env.postInvitationAccountUrl.replace(
              '{uuid}',
              requestData.uuid
            ),
        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.uuid
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * 招待アカウントレコードバージョン取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getInvitationRecordVersion(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getInvitationRecordVersionUrl
          : axiosBaseUrl() +
            process.env.getInvitationRecordVersionUrl.replace(
              '{uuid}',
              requestData.uuid
            ),
        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.uuid
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * サービスランチャーbizskyジャーナル一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getBizskyJournal(requestData) {
      const options = {
        method: getMethod('GET'),
        url: process.env.getBizskyJournal,
        headers: await getHeader(true, true),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * アカウント_独自ドメイン登録可否チェックAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async checkApplicationOwnDomainOption(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.checkApplicationOwnDomainOptionUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * サブドメイン確定API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async confirmedSubdomain(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.confirmedSubdomainUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageObjects(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageObjectsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 共有済オブジェクト取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageShared(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageSharedUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 最近使用したオブジェクト一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageRecent(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageRecentUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 削除済オブジェクト一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageDeleted(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageDeletedUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ ピン留めオブジェクト一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStoragePin(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStoragePinUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * アカウント_外部ツール連携API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getActivateData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getActivateDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ フォルダ作成API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createStorageFolders(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createStorageFoldersUrl,
        headers: await getHeader(),
      }

      options[getMethod('POST') === 'GET' ? 'params' : 'data'] = requestData

      return axios(options)
    },
    /**
     * ストレージ アップロードURL取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageUploadUrl(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageUploadUrlUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * presigned-urlを利用したS3へのファイルアップロード
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    putStorageFileForUploadUrl(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? process.env.putStorageFileForUploadUrlUrl
          : requestData.url,
        headers: {
          'Content-Type': requestData.fileType,
        },
      }

      options[getMethod('PUT') === 'GET' ? 'params' : 'data'] = getCheckDev()
        ? requestData
        : requestData.fileData

      return axios(options)
    },
    /**
     * ストレージ ファイル登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async registStorageFiles(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.registStorageFilesUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ オブジェクト削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteStorageObjects(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteStorageObjectsUrl,
        headers: await getHeader(),
      }
      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ ファイルコピーAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async copyStorageObject(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.copyStorageObjectUrl
          : axiosBaseUrl() +
            process.env.copyStorageObjectUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 共有リンク情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageShareLinks(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getStorageShareLinksUrl
          : axiosBaseUrl() +
            process.env.getStorageShareLinksUrl.replace(
              '{shareLinkId}',
              requestData.shareLinkId
            ),
        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.shareLinkId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ フォルダ更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateStorageFolders(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateStorageFoldersUrl
          : axiosBaseUrl() +
            process.env.updateStorageFoldersUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ ファイル更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateStorageFiles(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateStorageFilesUrl
          : axiosBaseUrl() +
            process.env.updateStorageFilesUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ オブジェクト移動API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async moveStorageData(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.moveStorageDataUrl
          : axiosBaseUrl() +
            process.env.moveStorageDataUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージオブジェクトリストアAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateStorageRestore(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateStorageRestoreUrl
          : axiosBaseUrl() +
            process.env.updateStorageRestoreUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージダウンロードURL取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageDownload(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageDownloadUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ共有リンクダウンロードURL取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageDownloadShare(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getStorageDownloadShareUrl
          : axiosBaseUrl() +
            process.env.getStorageDownloadShareUrl.replace(
              '{shareLinkId}',
              requestData.shareLinkId
            ),
        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.shareLinkId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 共有可能メンバー検索API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageShareableMembers(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageShareableMembersUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ オブジェクト検索API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageSearch(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getStorageSearchUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 共有メンバー取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getStorageShareFoldersMembers(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getStorageShareFoldersMembersUrl
          : axiosBaseUrl() +
            process.env.getStorageShareFoldersMembersUrl.replace(
              '{id}',
              requestData.id
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ 共有フォルダ登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createStorageShareFolders(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createStorageShareFoldersUrl,
        headers: await getHeader(),
      }

      options[getMethod('POST') === 'GET' ? 'params' : 'data'] = requestData

      return axios(options)
    },
    /**
     * ストレージ 共有リンク作成API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateStorageShareLink(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateStorageShareLinkUrl
          : axiosBaseUrl() +
            process.env.updateStorageShareLinkUrl.replace(
              '{id}',
              requestData.id
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * ストレージ オブジェクトピン留めAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateStoragePin(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateStoragePinUrl
          : axiosBaseUrl() +
            process.env.updateStoragePinUrl.replace('{id}', requestData.id),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.id
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * MJSデータレイクとの連携同意レコードバージョンの取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getAdvisoryCompanyRecordVersion(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getAdvisoryCompanyRecordVersionUrl
          : axiosBaseUrl() +
            process.env.getAdvisoryCompanyRecordVersionUrl.replace(
              '{uuid}',
              requestData.uuid
            ),
        headers: await getHeader(true, true),
      }

      if (!getCheckDev()) {
        delete requestData.uuid
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     *  MJSデータレイクとの連携同意登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postAdvisoryCompany(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postAdvisoryCompanyUrl
          : axiosBaseUrl() +
            process.env.postAdvisoryCompanyUrl.replace(
              '{uuid}',
              requestData.uuid
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.uuid
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト定義情報取得の取得
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getDefinitions(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getDefinitionsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト_コンタクト一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getContactList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getContactListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクトデータ項目定義の取得
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getDataItemDefinitions(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getDataItemDefinitionsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクトデータ項目定義 更新
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async saveDataItemDefinitions(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.saveDataItemDefinitionsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクトデータ項目定義の削除
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteDataItemDefinitions(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteDataItemDefinitionsUrl
          : axiosBaseUrl() +
            process.env.deleteDataItemDefinitionsUrl.replace(
              '{id}',
              requestData.contactId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * コンタクト_コンタクト一覧ダウンロード取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async downloadContactList(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.downloadContactListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト_コンタクト一覧ターゲットリスト作成API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createTargetList(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createTargetListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },

    /**
     * コンタクト_コンタクトデータ削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteContactData(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: axiosBaseUrl() + process.env.deleteContactDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト_コンタクト詳細情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getContactDetail(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getContactDetailUrl
          : axiosBaseUrl() +
            process.env.getContactDetailUrl.replace(
              '{id}',
              requestData.contactId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト_コンタクト詳細情報更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateContactDetail(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateContactDetailUrl
          : axiosBaseUrl() +
            process.env.updateContactDetailUrl.replace(
              '{id}',
              requestData.contactId
            ),
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト_コンタクト新規登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createContactDetail(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createContactDetailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * コンタクト_コンタクト詳細情報CSVインポートAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateContactDetailCsv(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.updateContactDetailCsvUrl,
        headers: await getHeader(),
      }

      options[getMethod('POST') === 'GET' ? 'params' : 'data'] = requestData // バイナリデータなのでトリムはしない
      options.headers['Content-Type'] = 'multipart/form-data'

      return axios(options)
    },
    /**
     * コンタクト_コンタクト詳細情報CSVインポートAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateDisplayItemList(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateDisplayItemListUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール＿新規メール作成API（仮）
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async createMail(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.createMailUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_メール情報取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailDetail(requestData) {
      const options = {
        method: getMethod('GET'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.getMailDetailUrl
          : axiosBaseUrl() +
            process.env.getMailDetailUrl.replace(
              '{mailId}',
              requestData.mailId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.mailId
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_メール情報登録API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateEditMailSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.updateEditMailSettingsUrl
          : axiosBaseUrl() +
            process.env.updateEditMailSettingsUrl.replace(
              '{mailId}',
              requestData.mailId
            ),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.mailId
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_宛先設定-配信情報一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailContactsDistribution(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMailContactsDistributionUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_コンタクト数取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailContactCount(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMailContactCountUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_配信リストCSV取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailContactsCsv(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.getMailContactsCsvUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_メール配信API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async sendMailData(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.sendMailDataUrl
          : axiosBaseUrl() +
            process.env.sendMailDataUrl.replace('{mailId}', requestData.mailId),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.mailId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_基本設定取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailBasicSettings(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMailBasicSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_基本設定更新API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async updateMailBasicSettings(requestData) {
      const options = {
        method: getMethod('PUT'),
        url: axiosBaseUrl() + process.env.updateMailBasicSettingsUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('PUT') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール一覧取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailListData(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMailListDataUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール削除API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async deleteMail(requestData) {
      const options = {
        method: getMethod('DELETE'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.deleteMailUrl
          : axiosBaseUrl() +
            process.env.deleteMailUrl.replace('{mailId}', requestData.mailId),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.mailId
      }

      options[
        getMethod('DELETE') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メールコピーAPI
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postMailCopy(requestData) {
      const options = {
        method: getMethod('POST'),
        url: getCheckDev()
          ? axiosBaseUrl() + process.env.postMailCopyUrl
          : axiosBaseUrl() +
            process.env.postMailCopyUrl.replace('{mailId}', requestData.mailId),
        headers: await getHeader(),
      }

      if (!getCheckDev()) {
        delete requestData.mailId
      }

      options[
        getMethod('POST') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * メール_配信レポート取得API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async getMailSendReport(requestData) {
      const options = {
        method: getMethod('GET'),
        url: axiosBaseUrl() + process.env.getMailSendReportUrl,
        headers: await getHeader(),
      }

      options[
        getMethod('GET') === 'GET' ? 'params' : 'data'
      ] = getRequestParaTrim(requestData)

      return axios(options)
    },
    /**
     * 新規メール作成API
     *
     * @param {object} requestData リクエストパラメータ
     * @returns {object} 処理結果
     */
    async postMailCreate(requestData) {
      const options = {
        method: getMethod('POST'),
        url: axiosBaseUrl() + process.env.postMailCreateUrl,
        headers: await getHeader(),
      }

      options[getMethod('POST') === 'GET' ? 'params' : 'data'] = requestData

      return axios(options)
    },
  }

  inject('api', api)
}
