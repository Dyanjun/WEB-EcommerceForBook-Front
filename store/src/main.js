// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element.js'
import store from './plugins/store.js'
import axios from 'axios'
import VueCookie from 'vue-cookie'

axios.defaults.timeout = 6000;
Vue.prototype.$axios = axios;
Vue.prototype.$cookie = VueCookie;
Vue.prototype.$store = store;
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  router,

  render: h => h(App),
}).$mount('#app')


