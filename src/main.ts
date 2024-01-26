import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { vuetify } from './plugins/vuetify';
import VueGoogleMaps from 'vue-google-maps-community-fork';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .use(VueGoogleMaps, {
    load: {
      key: import.meta.env.VITE_MAPS_API_KEY,
      libraries: 'places',
    },
  })
  .mount('#app');
