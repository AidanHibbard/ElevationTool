import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import App from './App.vue';
import router from './router';

import { vuetify } from './plugins/vuetify';
import VueGoogleMaps from 'vue-google-maps-community-fork';

ChartJS.register(
  CategoryScale,    // <— fixes “category” scale error
  LinearScale,      // numeric y-axis
  PointElement,     // data points
  LineElement,      // line drawing
  Title,            // chart title plugin
  Tooltip,          // hover tooltips
  Legend            // legend plugin
);

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
