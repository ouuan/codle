/* eslint-disable no-console */

import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'fs/promises';
import { Feed, Item as FeedItem } from 'feed';
import { basename } from 'path';
import glob from 'glob-promise';
import { Plugin } from 'vite';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const { window } = new JSDOM('');
const { sanitize } = createDOMPurify(window as any as Window);

async function clear() {
  await Promise.all(['statement', 'targetCode'].map(async (dir) => {
    await rm(`public/${dir}`, { recursive: true, force: true });
    await mkdir(`public/${dir}`);
  }));
}

function dateForBase(base: string) {
  return new Date(new Date('2022-03-27T00:00:00Z').valueOf() + 1000 * 60 * 60 * 24 * 7 * parseInt(base, 10));
}

function datePublished(date: Date) {
  return date.valueOf() - Date.now() < 60000;
}

async function transformCodes() {
  const matches = await glob('puzzles/*.cpp');
  return Promise.all(matches.map(async (path) => {
    const content = await readFile(path);
    const base = basename(path, '.cpp');
    const date = dateForBase(base);
    if (!datePublished(date)) return;
    const urlEncoded = encodeURIComponent(content.toString());
    const base64Encoded = Buffer.from(urlEncoded).toString('base64');
    await writeFile(`public/targetCode/${base}.txt`, base64Encoded);
    console.log(path);
  }));
}

async function transformStatements(items: FeedItem[]) {
  const matches = await glob('puzzles/*.html');
  return Promise.all(matches.map(async (path) => {
    const buffer = await readFile(path);
    const content = sanitize(buffer.toString());
    const base = basename(path, '.html');
    const date = dateForBase(base);
    if (!datePublished(date)) return;
    await writeFile(`public/statement/${base}.txt`, content);
    items.push({
      title: `Codle #${base}`,
      id: `codle-${base}`,
      link: 'https://codle.ouuan.moe',
      content,
      date,
    });
    console.log(path);
  }));
}

export default function transformPuzzles(): Plugin {
  return {
    name: 'transform puzzles',
    async buildStart() {
      const feed = new Feed({
        title: 'Codle Puzzles',
        description: "A game to guess a target code's AST like Wordle with AST nodes as letters",
        id: 'https://codle.ouuan.moe/',
        link: 'https://codle.ouuan.moe/',
        image: 'https://codle.ouuan.moe/images/og-image.png',
        favicon: 'https://codle.ouuan.moe/favicon.ico',
        copyright: 'Copyright (C) 2022  Yufan You',
        feedLinks: {
          atom: 'https://codle.ouuan.moe/atom.xml',
          rss: 'https://codle.ouuan.moe/index.xml',
        },
        author: {
          name: 'ouuan',
          link: 'https://github.com/ouuan',
        },
      });
      const feedItems: FeedItem[] = [];

      await clear();

      await Promise.all([transformCodes(), transformStatements(feedItems)]);
      feedItems
        .sort((lhs, rhs) => rhs.date.valueOf() - lhs.date.valueOf())
        .forEach((item) => feed.addItem(item));

      await Promise.all([
        writeFile('public/atom.xml', feed.atom1()),
        writeFile('public/index.xml', feed.rss2()),
      ]);
    },
  };
}
