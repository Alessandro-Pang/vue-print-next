import Vue from 'vue'
import App from './App.vue'
import {printPlugin} from "vue-print-next";

Vue.config.productionTip = false

Vue.use(printPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
