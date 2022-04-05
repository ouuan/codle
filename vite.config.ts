import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';
import transformPuzzles from './transformPuzzles';

export default defineConfig({
  plugins: [
    vue(),
    transformPuzzles(),
    splitVendorChunkPlugin(),
    analyzer({
      limit: 10,
      summaryOnly: true,
    }),
  ],
  base: '',
  build: {
    target: 'es2016',
    chunkSizeWarningLimit: 1000,
  },
});
