import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Elevation Tool',
      component: () => import('../views/ElevationTool.vue')
    },
  ],
});

export default router;
