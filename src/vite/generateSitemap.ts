import {
  EnumChangefreq,
  SitemapItem,
  SitemapStream,
  streamToPromise,
} from 'sitemap';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';
import { Plugin } from 'vite';
import { host } from '../../config';

const links: SitemapItem[] = [
  {
    url: `https://${host}`,
    changefreq: EnumChangefreq.WEEKLY,
    priority: 1,
    lastmod: new Date().toISOString(),
    img: [
      { url: `https://${host}/images/og-image.png` },
      { url: `https://${host}/images/android-icon-192x192.png` },
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
        hostname: `https://${host}`,
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
