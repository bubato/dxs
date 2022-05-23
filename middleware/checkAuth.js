export default ({ app, route, redirect }) => {
  if (process.env.environment !== 'development') {
    const checkScreenAuth = () => {
      const currentPath =
        route.path.slice(-1) === '/' ? route.path : route.path + '/'

      if (!app.$common.checkNotAuthScreens(currentPath)) {
        // cognito認証が通っていない場合はlogin画面に遷移
        if (!app.store.state.auth.isAuthenticated) {
          if (window.location.search === '?init=1') {
            app.store.commit('common/setInitShowPage', window.location.pathname)
          } else if (window.location.pathname !== '/login/') {
            app.store.commit('common/setInitShowPage', '')
          }

          return redirect('/login/')
        }

        const onlyDevScreen = app.store.state.common.onlyDevScreen
        for (let i = 0; i < onlyDevScreen.length; i++) {
          if (currentPath === onlyDevScreen[i]) {
            return redirect('/404/')
          }
        }
      }
    }

    checkScreenAuth()
  }
  if (!app.$common.checkFunctionAuth(route.path)) {
    return redirect('/launcher/')
  }
}
