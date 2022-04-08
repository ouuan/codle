import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';
import { createHtmlPlugin } from 'vite-plugin-html';
import { beginTimestamp, puzzleInterval, host } from './config';
import transformPuzzles from './src/vite/transformPuzzles';
import generateSitemap from './src/vite/generateSitemap';

export default defineConfig({
  plugins: [
    vue(),
    transformPuzzles(),
    generateSitemap(),
    splitVendorChunkPlugin(),
    createHtmlPlugin({
      minify: false,
      entry: '/src/main.ts',
      inject: {
        data: {
          puzzleId: Math.floor((Date.now() - beginTimestamp + 60000) / puzzleInterval).toString(),
          host,
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
    sourcemap: true,
    minify: 'terser',
  },
});
