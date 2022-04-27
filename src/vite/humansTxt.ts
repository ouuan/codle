import { writeFile } from 'fs/promises';
import { Plugin } from 'vite';
import gitCommitInfo from 'git-commit-info';

import { dependencies, devDependencies } from '../../package.json';

export default function humansTxt(): Plugin {
  return {
    name: 'generate humans.txt',
    async buildStart() {
      const gitInfo = gitCommitInfo();

      const content = `/* TEAM */

    Chef: Yufan You
    GitHub: @ouuan
    Location: China
    Donate: https://ouuan.github.io/about/#donate

/* THANKS */

    Wordle Creator: Josh Wardle
    GitHub: @powerlanguage
    Wordle: https://www.nytimes.com/games/wordle/index.html

    Handle Creator: Anthony Fu
    GitHub: @antfu
    Handle: https://handle.antfu.me/

    Medle Creator: Shiqing Lyu
    GitHub: @kawa-yoiko
    Medle: https://medle.0-th.art/

    Semantle Creator: David Turner
    GitHub: @novalis
    Semantle: https://semantle.novalis.org/

/* SITE */

    Language: English

    Build:
        Last build date: ${new Date().toISOString().slice(0, 10)}
        Last commit date: ${new Date(gitInfo.date ?? '').toISOString().slice(0, 10)}
        Last commit hash: ${gitInfo.shortHash}

    Source code:
        Repository: https://github.com/ouuan/codle
        License: AGPL-3.0 or later

    Development:
        OS: Arch Linux
        Browser: Firefox / (Chrome)
        IDE: neovim
        LSP: Volar / tsserver / ESLint
        Image processing: GIMP / WPS Presentation

    Components:
        Major: Tree-sitter / Vue 3 / Naive UI / CodeMirror

        All NPM dependencies:
${Object.keys(dependencies).map((dep) => `        -   ${dep}`).join('\n')}

        All NPM dev dependencies:
${Object.keys(devDependencies).map((dep) => `        -   ${dep}`).join('\n')}`;

      await writeFile('public/humans.txt', content);
    },
  };
}
