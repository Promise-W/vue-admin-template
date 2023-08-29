import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import hljs from 'highlight.js'
Vue.prototype.$hljs = hljs
import 'highlight.js/styles/atom-one-dark.css' // 有多种样式可选，也可以到对应文件中定制化
Vue.directive('highlight', function(el) { // 自定义命令v-highlight
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.highlightBlock(block)
  })
})

// 复制组件引用
import ClipBoard from 'clipboard'
Vue.prototype.ClipBoard = ClipBoard

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import { post, get, imgUrl } from './utils/request'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 加载jsbc组件
import 'jsbc/dist/css/js-base-components.css'
import JSBC from 'jsbc'
Vue.use(JSBC)

Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$imgUrl = imgUrl

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
