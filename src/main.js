import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import Http from './api/http'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/base.css'
// 把Http挂载到Vue实例身上
Vue.prototype.$Http = Http

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
