import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueGoogleCharts from 'vue-google-charts'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'YOUR_KEY_HERE',
    libraries: ['places', 'drawing', 'visualization', 'elevation']
  }
})
Vue.use(VueGoogleCharts)

let currentResults = {}
let currentPath = []
new Vue({
  data: {
    currentResults,
    currentPath
  },
  render: h => h(App),
}).$mount('#app')
