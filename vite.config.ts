import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';

export default defineConfig({
  plugins: [
    vue(),
    analyzer({
      limit: 10,
      summaryOnly: true,
    }),
  ],
  base: '',
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 1000,
  },
});
