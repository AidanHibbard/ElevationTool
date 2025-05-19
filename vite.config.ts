import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/hillfinder/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  /**
    @see {https://github.com/NathanAP/vue-google-maps-community-fork#if-you-are-configuring-your-project-please-notice}
  */
  optimizeDeps: {
    include: [
      'vue-google-maps-community-fork',
      'fast-deep-equal',
    ],
  },
});
