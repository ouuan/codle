import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';
import { createHtmlPlugin } from 'vite-plugin-html';
import transformPuzzles from './transformPuzzles';

export default defineConfig({
  plugins: [
    vue(),
    transformPuzzles(),
    splitVendorChunkPlugin(),
    createHtmlPlugin({
      minify: false,
      entry: '/src/main.ts',
      inject: {
        data: {
          puzzleId: Math.floor((Date.now() - new Date('2022-03-27T00:00:00Z').valueOf() + 60000) / (1000 * 60 * 60 * 24 * 7)).toString(),
        },
      },
    }),
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
