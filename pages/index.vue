<template>
  <div class="max-w-7xl mt-10 mx-auto px-5">
    <table class="border-separate border border-green-800 w-100">
      <thead>
        <tr>
          <th class="border border-green-600">画面ID</th>
          <th class="border border-green-600">画面名</th>
          <th class="border border-green-600">進捗率</th>
          <th class="border border-green-600">納期</th>
          <th class="border border-green-600">担当者</th>
          <th class="border border-green-600">プレビュー</th>
        </tr>
      </thead>
      <tbody>
        <!-- eslint-disable vue/no-template-shadow -->
        <template v-for="(lists, categoryIndex) in lists">
          <tr :key="categoryIndex.category">
            <th class="border border-green-600 p-3 title" colspan="6">
              {{ lists.category }}
            </th>
          </tr>
          <template v-for="(page, pageIndex) in lists.pages">
            <tr
              :key="pageIndex.id"
              :class="{
                noneEdit: isEdit(page.charge),
                visible: isVisible(page.id),
              }"
            >
              <td class="border border-green-600 p-3">{{ page.id }}</td>
              <td class="border border-green-600 p-3">{{ page.title }}</td>
              <td class="border border-green-600 p-3">{{ page.status }}</td>
              <td class="border border-green-600 p-3">
                {{ page.preferredDate }}
              </td>
              <td class="border border-green-600 p-3">
                {{ page.charge }}
              </td>
              <td class="border border-green-600 p-3">
                <nuxt-link :to="page.path"
                  ><LaunchSVG class="icon-launch"
                /></nuxt-link>
              </td>
            </tr>
          </template>
        </template>
        <!--eslint-enable-->
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  layout: 'testPage',
  data() {
    return {
      secondPhase: [
        'SC-DXT05030101',
        'SC-DXT05030201',
        'SC-DXT05030501',
        'SC-DXT05030601',
        'SC-DXT05030701',
        'SC-DXT05030801',
        'SC-DXT05030901',
        'SC-DXT05040501/SC-DXT05040501-1',
        'SC-DXT03020101/SC-DXT03020201/',
        'SC-DXT03030101',
        'SC-DXT06010701/SC-DXT06020201',
        'SC-DXT04010101/SC-DXT04010201',
        'SC-DXT04020101/SC-DXT04020901/SC-DXT04021101',
        'SC-DXT04040101/SC-DXT04040201/SC-DXT04040301',
      ],
      lists: [
        {
          category: 'COMMON',
          pages: [
            {
              id: 'SC-DXT00010201',
              title: 'サービスランチャー',
              status: '90%',
              path: '/launcher/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT00060501',
              title: '400',
              status: '100%',
              path: '/400/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00060601',
              title: '401',
              status: '100%',
              path: '/401/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00060101',
              title: '403',
              status: '100%',
              path: '/403/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00060201',
              title: '404',
              status: '100%',
              path: '/404/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00060301',
              title: '500',
              status: '100%',
              path: '/500/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00060401',
              title: '503',
              status: '100%',
              path: '/503/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'Webサイト',
          pages: [
            {
              id: 'SC-DXT01010101',
              title: 'ダッシュボード',
              status: '90%',
              path: '/site/dashboard/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01050101',
              title: '初期セットアップ（サイトURL）',
              status: '80%',
              path: '/site/setup/domain/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01050201',
              title: '初期セットアップ（サイト基本情報）',
              status: '80%',
              path: '/site/setup/basic/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01050301',
              title: '初期セットアップ（サイトデザイン）',
              status: '50%',
              path: '/site/setup/design/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01060101',
              title: '基本設定-基本情報',
              status: '80%',
              path: '/site/settings/basic/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01060201',
              title: '基本設定-ドメイン',
              status: '80%',
              path: '/site/settings/domain/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01060401',
              title: '基本設定-デザイン',
              status: '50%',
              path: '/site/settings/design/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01030101/SC-DXT01030201',
              title: 'ページ作成・編集',
              status: '90%',
              path: '/site/pages/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT01030601/SC-DXT01030701/SC-DXT01030801',
              title: 'ページエディタ（プロパティ/コンテンツ/公開設定）',
              status: '90%',
              path: '/site/pages/edit/123',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT01040101',
              title: '公開管理',
              status: '90%',
              path: '/site/publish/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'FORM',
          pages: [
            {
              id: 'SC-DXT02010101',
              title: 'ダッシュボード',
              status: '90%',
              path: '/form/dashboard/',
              preferredDate: '2021/03/31',
              charge: '松井',
            },
            {
              id: 'SC-DXT02020101',
              title: 'フォーム一覧',
              status: '90%',
              path: '/form/list/',
              preferredDate: '2021/03/31',
              charge: '松井',
            },
            {
              id: 'SC-DXT02020901',
              title: '回答レポート（リスト）',
              status: '90%',
              path: '/form/answer/1101011',
              preferredDate: '2021/03/31',
              charge: '松井',
            },
            {
              id: 'SC-DXT02030102',
              title: '新規フォーム作成',
              status: '90%',
              path: '/form/edit/12345',
              preferredDate: '2021/03/31',
              charge: '松井',
            },
            {
              id: 'SC-DXT02040101',
              title: '基本設定',
              status: '90%',
              path: '/form/settings/',
              preferredDate: '2021/03/31',
              charge: '松井',
            },
          ],
        },
        {
          category: 'Login',
          pages: [
            {
              id: 'SC-DXT00010101',
              title: 'ログイン画面',
              status: '90%',
              path: '/login/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00010201',
              title: 'パスワードリセット要求画面',
              status: '90%',
              path: '/passwordRequest/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00010401',
              title: 'パスワードリセット要求完了画面',
              status: '90%',
              path: '/passwordRequest/complete/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00010301',
              title: 'パスワードリセット画面',
              status: '90%',
              path: '/passwordReset/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00010501',
              title: 'パスワードリセット完了画面',
              status: '90%',
              path: '/passwordReset/complete/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00060701',
              title: 'パスワードリセット有効期限切れ',
              status: '100%',
              path: '/passwordReset/expire/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00010601',
              title: 'パスワード変更画面',
              status: '90%',
              path: '/passwordChange/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00010701',
              title: 'パスワード変更完了画面',
              status: '90%',
              path: '/passwordChange/complete/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'Account',
          pages: [
            {
              id: 'SC-DXT06010501',
              title: '利用申し込みフォーム',
              status: '90%',
              path: '/request/input/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT06010501',
              title: '利用申し込みフォーム完了画面',
              status: '90%',
              path: '/request/complete/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT00050101',
              title: '解約申し込みフォーム画面',
              status: '80%',
              path: '/cancel/input/',
              preferredDate: '2021/10/18',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT00050201',
              title: '解約申し込み完了画面',
              status: '80%',
              path: '/cancel/complete/',
              preferredDate: '2021/10/18',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT00010801',
              title: '招待アカウント登録画面',
              status: '80%',
              path: '/invitation/_uuid/',
              preferredDate: '2021/10/18',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT00010901',
              title: '招待アカウント登録完了画面',
              status: '80%',
              path: '/invitation/complete/',
              preferredDate: '2021/10/18',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT00011001',
              title: '招待アカウント有効期限切れ',
              status: '80%',
              path: '/invitation/expire/',
              preferredDate: '2021/10/18',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT00070101',
              title: 'MJSデータレイクとの連携同意',
              status: '80%',
              path: '/invitation/advisoryCompany/1234/',
              preferredDate: '2022/01/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT00070201',
              title: 'MJSデータレイクとの連携同意完了',
              status: '80%',
              path: '/invitation/advisoryCompany/complete/',
              preferredDate: '2022/01/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT00070301',
              title: '招待用URLの有効期限がきれています',
              status: '80%',
              path: '/invitation/advisoryCompany/expire/',
              preferredDate: '2022/01/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT00013101',
              title: '無効なアカウント',
              status: '80%',
              path: '/invalid/',
              preferredDate: '2022/01/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT00020101',
              title: '初期設定ツアートップ',
              status: '90%',
              path: '/starter/initialTour',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT06010701',
              title: 'ダッシュボード',
              status: '90%',
              path: '/account/dashboard/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT06010701/SC-DXT06020201',
              title: '請求情報（過去の請求一覧/請求先情報）',
              status: '0%',
              path: '/account/',
              preferredDate: '2021/XX/XX',
              charge: '',
            },
            {
              id: 'SC-DXT06030101',
              title: '契約プラン',
              status: '90%',
              path: '/account/contract/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT06040101',
              title: 'アカウント一覧',
              status: '90%',
              path: '/account/users/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT06040101-1',
              title: 'アカウント編集',
              status: '90%',
              path: '/account/users/edit/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: '',
              title: '企業情報',
              status: '90%',
              path: '/account/corporate/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: '',
              title: '共通設定',
              status: '90%',
              path: '/account/analytics/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT06040401',
              title: '共通タグ',
              status: '90%',
              path: '/account/tag/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-SC-DXT09010101',
              title: 'データレイク連携',
              status: '50%',
              path: '/account/connect/mjs-datalake/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT06070101',
              title: '外部ツール連携',
              status: '80%',
              path: '/account/connect/',
              preferredDate: '2022/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT06080101',
              title: '顧問先招待',
              status: '80%',
              path: '/account/invitation/',
              preferredDate: '2022/XX/XX',
              charge: '室津',
            },
          ],
        },
        {
          category: 'COMMUNITY',
          pages: [
            {
              id: 'SC-DXT05010101',
              title: 'タイムライン',
              status: '90%',
              path: '/community/timeline/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05020101',
              title: 'メッセージ一覧',
              status: '90%',
              path: '/community/message/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05031201',
              title: '会社紹介',
              status: '90%',
              path: '/community/corporate/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT05040101/SC-DXT05040101-1',
              title: 'プロフィール・プロフィール編集',
              status: '90%',
              path: '/community/profile/',
              preferredDate: '2021/XX/XX',
              charge: '松井、室津',
            },
            {
              id: 'SC-DXT05040301',
              title: 'つながり一覧',
              status: '90%',
              path: '/community/member/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05060101',
              title: '検索結果',
              status: '90%',
              path: '/community/searchResults/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05070101',
              title: 'グループ（最近の投稿）',
              status: '0%',
              path: '/community/group/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05070101/SC-DXT05070301',
              title: 'グループタイムライン/グループ参加メンバー',
              status: '0%',
              path: '/community/group/{グループid}/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05070501',
              title: '新規グループ作成',
              status: '0%',
              path: '/community/group/edit/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT05070501-1',
              title: 'グループプロフィール編集',
              status: '0%',
              path: '/community/group/edit/{グループid}/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'コンタクト',
          pages: [
            {
              id: 'SC-DXT04010101',
              title: 'コンタクト一覧',
              status: '0%',
              path: '/contact/list/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT04020101-1',
              title: 'コンタクト情報編集',
              status: '0%',
              path: '/edit/12345/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT04020101',
              title: '新規コンタクト登録（手動）',
              status: '0%',
              path: '/contact/create/manual/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT04020101',
              title: '新規コンタクト登録（インポート）',
              status: '0%',
              path: '/contact/create/import/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: 'SC-DXT04030101',
              title: '基本設定',
              status: '0%',
              path: '/contact/settings/',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
          ],
        },
        {
          category: 'メール',
          pages: [
            {
              id: 'SC-DXT03010101',
              title: 'メール一覧（リスト）',
              status: '0%',
              path: '/mail/list/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT03010401',
              title: '本文プレビュー',
              status: '0%',
              path: '/mail/preview/1234/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT03010501',
              title: '配信レポート',
              status: '0%',
              path: '/mail/report/1234/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT03030201',
              title: '新規メール作成',
              status: '0%',
              path: '/mail/edit/1234/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT03040101',
              title: '基本設定',
              status: '0%',
              path: '/mail/settings/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'COMMUNICATION',
          pages: [
            {
              id: '',
              title: 'ダッシュボード',
              status: '5%',
              path: '/communication/dashboard',
              preferredDate: '2021/XX/XX',
              charge: 'XXX',
            },
            {
              id: '',
              title: 'メール一覧（リスト/カード）',
              status: '30%',
              path: '/communication/mailList',
              preferredDate: '2021/XX/XX',
              charge: '松井、松井',
            },
            {
              id: '',
              title: '新規メール作成',
              status: '40%',
              path: '/communication/createMail',
              preferredDate: '2021/XX/XX',
              charge: '室津',
            },
            {
              id: '',
              title: '基本設定',
              status: '0%',
              path: '/communication/basicSettings',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'CRM',
          pages: [
            {
              id: 'SC-DXT04010101/SC-DXT04010201',
              title: 'ダッシュボード（コンタクトサマリー/企業別サマリー）',
              status: '0%',
              path: '/crm/',
              preferredDate: '2021/XX/XX',
              charge: 'XXX',
            },
            {
              id: 'SC-DXT04020101/SC-DXT04020901/SC-DXT04021101',
              title:
                'コンタクト（一覧/新規コンタクト登録（手動・インポート））',
              status: '0%',
              path: '/crm/',
              preferredDate: '2021/XX/XX',
              charge: 'XXX',
            },
            {
              id: 'SC-DXT04040101/SC-DXT04040201/SC-DXT04040301',
              title:
                '基本設定（コンタクトデータ設定/企業データ設定/ダッシュボード設定）',
              status: '0%',
              path: '/crm/',
              preferredDate: '2021/XX/XX',
              charge: 'XXX',
            },
          ],
        },
        {
          category: 'cashFlowManagement（キャッシュフロー マネジメント）',
          pages: [
            {
              id: 'SC-DXT08010101',
              title: '顧問先一覧',
              status: '80%',
              path: '/cashFlowManagement/advisoryCompany',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
            {
              id: 'SC-DXT08020101',
              title: '資金繰り予測レポート（会計事務所）',
              status: '60%',
              path: '/cashFlowManagement/forecastReport/',
              preferredDate: '2021/XX/XX',
              charge: '松井',
            },
          ],
        },
        {
          category: 'MMI',
          pages: [
            {
              id: 'SC-DXT09020101',
              title: '顧問先一覧',
              status: '50%',
              path: '/mmi/advisoryCompany',
              preferredDate: '2021/XX/XX',
              charge: '岸川',
            },
            {
              id: 'SC-DXT09030101',
              title: '自社分析',
              status: '50%',
              path: '/mmi/companyReport',
              preferredDate: '2021/XX/XX',
              charge: '岸川',
            },
            {
              id: 'SC-DXT09040101',
              title: '統計分析 - 期間比較',
              status: '0%',
              path: '/mmi/companyReport',
              preferredDate: '2021/XX/XX',
              charge: '岸川',
            },
            {
              id: 'SC-DXT09040201',
              title: '統計分析 - 業種比較',
              status: '0%',
              path: '/mmi/companyReport',
              preferredDate: '2021/XX/XX',
              charge: '岸川',
            },
            {
              id: 'SC-DXT09050101',
              title: '会計事務所一覧',
              status: '50%',
              path: '/mmi/accountingFirm',
              preferredDate: '2021/XX/XX',
              charge: '岸川',
            },
          ],
        },
        {
          category: 'ストレージ',
          pages: [
            {
              id: 'SC-DXT10010101',
              title: 'すべてのファイル',
              status: '80%',
              path: '/storage/home/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10012101',
              title: '下階層のフォルダ',
              status: '80%',
              path: '/storage/home/1/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10020101',
              title: '共有されたファイル',
              status: '80%',
              path: '/storage/sharedItem/temp/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10030101',
              title: '最近使用したファイル',
              status: '80%',
              path: '/storage/recent/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10070101',
              title: 'ピン留めしたファイル',
              status: '80%',
              path: '/storage/pin/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10040101',
              title: '共有済のファイル',
              status: '80%',
              path: '/storage/share/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10050101',
              title: '削除済のファイル',
              status: '80%',
              path: '/storage/delete/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
            {
              id: 'SC-DXT10060101',
              title: '検索結果',
              status: '80%',
              path: '/storage/searchResults/',
              preferredDate: '2021/XX/XX',
              charge: '鈴木',
            },
          ],
        },
        {
          category: '利用規約',
          pages: [
            {
              id: '',
              title: 'bizskyDXサービス利用規約',
              path: '/terms/service/index.html',
              status: '100%',
              preferredDate: 'XXXX',
              charge: '室津',
            },
            {
              id: '',
              title: '経営分析サービス利用規約',
              path: '/terms/advisoryCompany/index.html',
              status: '100%',
              preferredDate: 'XXXX',
              charge: '室津',
            },
            {
              id: '',
              title: 'MMI、CFMご利用ガイド',
              path: '/terms/finance-option/index.html',
              status: '100%',
              preferredDate: 'XXXX',
              charge: '室津',
            },
            {
              id: '',
              title: 'データレイク利用規約',
              path: '/terms/mjs-datalake/index.html',
              status: '100%',
              preferredDate: 'XXXX',
              charge: '室津',
            },
          ],
        },
        {
          category: '共通モジュール',
          pages: [
            {
              id: 'modules',
              title: '共通モジュール',
              path: '/common/moduleList',
              status: '100%',
              preferredDate: 'XXXX',
              charge: 'XXX',
            },
          ],
        },
      ],
    }
  },
  computed: {},
  created() {},
  methods: {
    isVisible(pageID) {
      return this.secondPhase.includes(pageID)
    },
    isEdit(stt) {
      return stt === 'XXX'
    },
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.max-w-7xl {
  margin-bottom: 60px;
}
.w {
  &-100 {
    width: 100%;
  }
  &-40 {
    width: 40%;
  }
}
.title {
  font-weight: 500;
  font-size: 24px;
}
.noneEdit * {
  background: #ffdcdc;
}
.visible * {
  background: #aaa;
}
</style>
