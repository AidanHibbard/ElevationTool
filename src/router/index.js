import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Elevation Tool',
      component: () => import('../views/ElevationTool.vue')
    },
    { 
      path: '/:polyline', 
      name: 'polyline',
      component: () => import('../views/ElevationTool.vue')
    },
  ],
});

export default router;
