import { Quasar } from 'quasar';
import quasarLang from 'quasar/lang/de';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import OpenLayersMap from 'vue3-openlayers';
import 'vue3-openlayers/dist/vue3-openlayers.css';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import '@quasar/extras/mdi-v6/mdi-v6.css';
import '@/main.css';

import App from '@/App.vue';
import { messages } from '@/i18n/main';
import { router } from '@/router';

const app = createApp(App);

const i18n = createI18n({
  locale: 'de',
  messages,
  legacy: false,
  datetimeFormats: {
    de: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
    },
  },
});

app.use(router);
app.use(i18n);
app.use(Quasar, {
  plugins: {},
  lang: quasarLang,
});
app.use(OpenLayersMap);

app.mount('#app');
