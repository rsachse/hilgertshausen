import { createRouter, createWebHashHistory } from 'vue-router';

import LandingPage from '@/views/LandingPage.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import OrchardDetails from '@/views/orchard/OrchardDetails.vue';
import OrchardList from '@/views/orchard/OrchardList.vue';
import VarietyDetails from '@/views/variety/VarietyDetails.vue';
import VarietyList from '@/views/variety/VarietyList.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage,
    },
    {
      path: '/impressum',
      name: 'privacy-policy',
      component: PrivacyPolicy,
    },
    {
      path: '/streuobstwiesen/',
      name: 'orchard-list',
      component: OrchardList,
    },
    {
      path: '/streuobstwiesen/:id',
      name: 'orchard-details',
      component: OrchardDetails,
      props: true,
    },
    {
      path: '/sorten/',
      name: 'variety-list',
      component: VarietyList,
    },
    {
      path: '/sorten/:id',
      name: 'variety-details',
      component: VarietyDetails,
      props: true,
    },
  ],
});

export { router };
