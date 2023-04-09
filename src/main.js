import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import VueGoogleMaps from '@fawmi/vue-google-maps';
import VueGoogleCharts from "vue3-googl-chart";

import './assets/dark.css';

loadFonts();

createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .use(VueGoogleMaps, {
        load: {
            key: import.meta.env.VITE_MAPS_API_KEY,
            libraries: "places"
        },
    })
    .use(VueGoogleCharts)
    .mount('#app');
