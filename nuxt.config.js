export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  googleAnalytics: {
    id: 'UA-204288028-1',
    debug: false
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'admin.คิวพร้อม.com',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ระบบจัดการคิว' },
      { name: 'format-detection', content: 'telephone=no' },

      { hid: "og:title", property: 'og:title', content: "admin.คิวพร้อม.com" },
      { hid: "og:description", property: 'og:description', content: "Platform ระบบลงทะเบียนจองคิว Free !!" },
      { hid: "og:image", property: 'og:image', content: "https://i.ibb.co/TbwThsb/Transparent.png" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href:
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
        rel: 'stylesheet',
        integrity:
          'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC',
        crossorigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css',
        integrity:
          'sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p',
        crossorigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: '',
        crossorigin: 'anonymous'
      }
    ],
    script: [
      {
        src:
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
        integrity:
          'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM',
        crossorigin: 'anonymous'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css',
    '@/assets/lib/perfect-scrollbar/css/perfect-scrollbar.css',
    '@/assets/lib/material-design-icons/css/material-design-iconic-font.min.css',
    '@/assets/lib/perfect-scrollbar/css/perfect-scrollbar.css',
    '@/assets/lib/select2/css/select2.min.css',
    '@/assets/lib/bootstrap-slider/css/bootstrap-slider.min.css',
    '@/assets/css/app.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/calendar.js',
    '~/plugins/ckEditor.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-analytics',
    '@nuxtjs/device',
  ],

  device: {
    defaultUserAgent: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Mobile Safari/537.36'
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    ['@nuxtjs/pwa', { icon: true }],
    'nuxt-sweetalert2',
    '@nuxtjs/toast'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    },
    icon: {
      fileName: 'icon.png'
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
