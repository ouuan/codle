import {
  EnumChangefreq,
  SitemapItem,
  SitemapStream,
  streamToPromise,
} from 'sitemap';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';
import { Plugin } from 'vite';

const links: SitemapItem[] = [
  {
    url: 'https://codle.ouuan.moe',
    changefreq: EnumChangefreq.WEEKLY,
    priority: 1,
    lastmod: new Date().toISOString(),
    img: [
      { url: 'https://codle.ouuan.moe/images/og-image.png' },
      { url: 'https://codle.ouuan.moe/images/android-icon-192x192.png' },
    ],
    video: [],
    links: [],
  },
];

export default function generateSitemap(): Plugin {
  return {
    name: 'generate sitemap',
    async buildStart() {
      const stream = new SitemapStream({
        hostname: 'https://codle.ouuan.moe',
        xmlns: {
          news: false,
          xhtml: false,
          image: true,
          video: false,
        },
      });
      const buffer = await streamToPromise(Readable.from(links).pipe(stream));
      await writeFile('public/sitemap.xml', buffer);
    },
  };
}
