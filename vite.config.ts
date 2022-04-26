import { defineConfig, splitVendorChunk } from 'vite';
import { GetManualChunk } from 'rollup';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import viteRestart from 'vite-plugin-restart';

import {
  beginTimestamp,
  host,
  puzzleInterval,
  timeToBuildEarlier,
} from './config';
import transformPuzzles from './src/vite/transformPuzzles';
import generateSitemap from './src/vite/generateSitemap';
import humansTxt from './src/vite/humansTxt';

const splitVendor = splitVendorChunk();

const splitAlone = [
  'codemirror',
  'naive-ui',
  'tree-sitter-cpp',
  'vue-diff',
] as const;

const manualChunks: GetManualChunk = (id, api) => {
  const alone = splitAlone.find((item) => id.includes(`/${item}@`));
  if (alone) return alone;
  return splitVendor(id, api);
};

export default defineConfig({
  plugins: [
    vue(),
    transformPuzzles(),
    generateSitemap(),
    humansTxt(),
    viteRestart({
      restart: [
        'puzzles/*',
      ],
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      filter: /\.(js|map|json|css|html|wasm|txt|xml)$/i,
    }),
    createHtmlPlugin({
      minify: false,
      entry: '/src/main.ts',
      inject: {
        data: {
          puzzleId: Math.floor((Date.now() - beginTimestamp + timeToBuildEarlier) / puzzleInterval),
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
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      manualChunks,
    },
  },
});
