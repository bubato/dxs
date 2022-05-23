import lscache from 'lscache'

export default ({ app, store }) => {
  // ページ遷移ごとに行いたい処理
  app.router.afterEach((to, from) => {
    const toPath = to.path.slice(-1) === '/' ? to.path : to.path + '/'
    if (app.$common.checkNotAuthScreens(toPath)) return

    // マスターデータがvuexに格納されていなければ、共通関数を呼び出して格納
    const storeData = JSON.parse(sessionStorage.getItem('bizsky'))
    const storeMasterData = storeData ? storeData.common.masterData : {} // マスターデータがvuexに格納されていなければ、共通関数を呼び出して格納

    if (process.env.environment !== 'development') {
      const backofficeSession = sessionStorage.getItem('mdx_bo_login')

      // 代理ログイン以外の場合は下記の処理を実行
      if (backofficeSession !== '1') {
        const checkLogin = lscache.get('loginFlg')
        // 30日ログインが有効な場合
        if (checkLogin === '1') {
          // 初回表示判定
          if (Object.keys(storeMasterData).length === 0) {
            app.$common.exeLogin()
            return
          }
        } else if (Object.keys(storeMasterData).length === 0) {
          app.router.push('/login/')
          return
        } else if (
          toPath === '/starter/initialTour/' &&
          storeMasterData.initialTourCompletedFlag === 1
        ) {
          app.router.push('/launcher/')
          return
        }
      }

      // localStorageにCSRFトークン情報がない場合は、cognitoログアウト後、401画面に遷移
      if (!localStorage.getItem('csrfToken')) {
        app.store.dispatch('auth/logout')
        app.router.push('/401/')
        return
      }

      // マスターデータがvuexに格納されていなければ、共通関数を呼び出して格納
      if (Object.keys(storeMasterData).length === 0) {
        app.$common.getMasterData()
      } else if (
        toPath === '/starter/initialTour/' &&
        storeMasterData.initialTourCompletedFlag === 1
      ) {
        app.router.push('/launcher/')
        return
      }
    } else if (Object.keys(storeMasterData).length === 0) {
      app.$common.getMasterData()
    }

    setTimeout(() => {
      app.store.commit('common/setAreaLabel', '') // ツールチップの初期化
    }, 0)
  })
}
