import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import Components from './components/index'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import i18n from '@/lang'

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(Components)

Vue.config.productionTip = false

// 定义全局按钮方法
Vue.prototype.$checkBtn = function(key) {
  return this.$store.state.user.userInfo.roles.points.includes(key)
}
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
