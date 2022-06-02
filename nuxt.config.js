require('dotenv').config()
const environment = process.env.NODE_ENV || 'development'
const envSet = require(`./env.${environment}.js`)
const gtmTag = environment === 'production' ? 'GTM-NM6TRJD' : 'GTM-525D94H'
const gtmHeadTag = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmTag}');`
const gtmBodyTag = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmTag}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  env: envSet,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'bizskyDX',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1.0',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    // 外部リソースもここで読み込む
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src:
          'https://polyfill.io/v3/polyfill.min.js?features=Element.prototype.closest%2Cdocument.querySelector%2Cdom4%2CNode.prototype.contains%2CCSS.supports',
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.8.7/polyfill.min.js',
      },
      {
        hid: 'gtmHead',
        innerHTML: gtmHeadTag,
      },
    ],
    noscript: [
      {
        hid: 'gtmBody',
        innerHTML: gtmBodyTag,
        pbody: true,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      gtmHead: ['innerHTML'],
      gtmBody: ['innerHTML'],
    },
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    {
      src: '~/assets/styles/scss/index.scss',
      lang: 'scss',
    },
    'animate.css/animate.min.css',
  ],
  // SCSSの変数を展開し、全ページから参照できるようにする
  styleResources: {},

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/amplify.js', mode: 'client' },
    { src: '~/plugins/auth', mode: 'client' },
    '@/plugins/axios/apiList.js',
    {
      src: '~/plugins/common.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/vue-datepicker.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/highcharts-vue.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/vue-codemirror.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/svg.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/routerOption.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/sessionStorage.js',
      mode: 'client', // client or server
    },
    {
      src: '~/plugins/croppa.js',
      mode: 'client', // client or server
    },
    { src: '~/plugins/swiper', mode: 'client' },
    { src: '~/plugins/vueMq', mode: 'client' },
  ],

  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    //'@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-webfontloader',
    'nuxt-svg-loader',
  ],
  generate: {
    dir: environment,
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    baseURL: environment === 'development' ? '/' : '/',
  },
  // proxy: {
  //   '/api/': process.env.API_URL || 'http://localhost:3000/',
  // },
  router: {
    base: environment === 'development' ? '/' : '/',
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'notFound',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue'),
      })
    },
  },
  webfontloader: {
    google: {
      families: ['Noto+Sans+JP:400,500,700'],
    },
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.txt$/,
        loader: 'raw-loader',
        exclude: /(node_modules)/,
      })
    },
  },

  watchers: {
    webpack: {
      poll: true,
    },
  },
}
