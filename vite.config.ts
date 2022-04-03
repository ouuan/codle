import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';

export default defineConfig({
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
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
