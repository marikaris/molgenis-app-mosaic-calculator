import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faCaretUp, faCogs, faSync, faCalculator, faDownload, faMars, faVenus, faGenderless } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store'

Vue.use(BootstrapVue)

library.add(faCaretDown, faCaretUp, faCogs, faSync, faCalculator, faDownload, faMars, faVenus, faGenderless)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
